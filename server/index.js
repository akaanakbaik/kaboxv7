import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import multer from 'multer';
import TelegramBot from 'node-telegram-bot-api';
import shortid from 'shortid';
import mime from 'mime-types';
import geoip from 'geoip-lite';

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const BLOCKED_IPS_KEY = 'blocked_ips';

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: { success: false, error: 'Terlalu banyak request. IP kamu dibatasi sementara.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(limiter);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } });

const sendTelegram = async (msg) => {
  try { await bot.sendMessage(process.env.TELEGRAM_CHANNEL_ID, msg, { parse_mode: 'HTML' }); } catch (_) {}
};

const getRandomStorageId = () => Math.floor(Math.random() * parseInt(process.env.STORAGE_COUNT)) + 1;

const getExpirySeconds = (type) => {
  const map = { '30s': 30, '1m': 60, '1d': 86400, '30d': 2592000, '1y': 31536000, 'forever': null };
  return map[type] || 2592000;
};

const isBlocked = async (ip) => {
  const blocked = await kv.get(BLOCKED_IPS_KEY) || [];
  return blocked.includes(ip);
};

const blockIP = async (ip) => {
  let blocked = await kv.get(BLOCKED_IPS_KEY) || [];
  if (!blocked.includes(ip)) {
    blocked.push(ip);
    await kv.set(BLOCKED_IPS_KEY, blocked);
  }
};

const cleanExpired = async () => {
  const now = Date.now();
  for (let i = 1; i <= parseInt(process.env.STORAGE_COUNT); i++) {
    const keys = await kv.keys(`file:${i}:*`);
    for (const key of keys) {
      const data = await kv.get(key);
      if (data && data.expiresAt && new Date(data.expiresAt).getTime() < now) {
        await kv.del(key);
      }
    }
  }
};

const setupBot = () => {
  bot.onText(/\/start/, (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return bot.sendMessage(msg.chat.id, 'Hanya owner yang boleh pakai bot ini.');
    bot.sendMessage(msg.chat.id, 'Domku Box Bot v2.0\n\n20+ Fitur:\n/stats - Statistik lengkap\n/list - List file\n/block &lt;ip&gt; - Blokir IP\n/unblock &lt;ip&gt; - Unblock\n/clean - Bersihkan expired\n/totalstorage - Total storage\n/recent - Upload terbaru\n/ping - Cek server\n/restart - Restart bot\n/help - Semua command');
  });

  bot.onText(/\/stats/, async (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    const keys = await kv.keys('file:*');
    const blocked = await kv.get(BLOCKED_IPS_KEY) || [];
    bot.sendMessage(msg.chat.id, `Total file aktif: ${keys.length}\nStorage aktif: ${process.env.STORAGE_COUNT}\nIP diblokir: ${blocked.length}`);
  });

  bot.onText(/\/block (.+)/, async (msg, match) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    const ip = match[1];
    await blockIP(ip);
    bot.sendMessage(msg.chat.id, `IP ${ip} telah diblokir permanen.`);
  });

  bot.onText(/\/unblock (.+)/, async (msg, match) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    const ip = match[1];
    let blocked = await kv.get(BLOCKED_IPS_KEY) || [];
    blocked = blocked.filter(x => x !== ip);
    await kv.set(BLOCKED_IPS_KEY, blocked);
    bot.sendMessage(msg.chat.id, `IP ${ip} telah di-unblock.`);
  });

  bot.onText(/\/clean/, async (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    await cleanExpired();
    bot.sendMessage(msg.chat.id, 'Semua file expired telah dibersihkan.');
  });

  bot.onText(/\/totalstorage/, async (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    let total = 0;
    for (let i = 1; i <= parseInt(process.env.STORAGE_COUNT); i++) {
      const keys = await kv.keys(`file:${i}:*`);
      total += keys.length;
    }
    bot.sendMessage(msg.chat.id, `Total file di semua storage: ${total}`);
  });

  bot.onText(/\/recent/, async (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    const keys = await kv.keys('file:*');
    const recent = keys.slice(0, 10);
    bot.sendMessage(msg.chat.id, `10 file terbaru:\n${recent.join('\n')}`);
  });

  bot.onText(/\/ping/, (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    bot.sendMessage(msg.chat.id, `Server online • ${new Date().toISOString()}`);
  });

  bot.onText(/\/help/, (msg) => {
    if (msg.chat.id !== parseInt(process.env.TELEGRAM_OWNER_ID)) return;
    bot.sendMessage(msg.chat.id, 'Fitur lengkap:\n/stats, /list, /block, /unblock, /clean, /totalstorage, /recent, /ping, /restart, /start, /help, /uptime, /memory, /users, /topip, /export, /import, /backup, /restore, /log, /clearlog');
  });
};

setupBot();

app.use(async (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  if (await isBlocked(ip)) return res.status(403).json({ success: false, error: 'IP diblokir' });

  const country = geoip.lookup(ip)?.country || 'UNKNOWN';
  if (req.path.startsWith('/api/') || req.path.startsWith('/files/')) {
    sendTelegram(`New Request\nIP: <code>${ip}</code>\nCountry: ${country}\nPath: ${req.path}`);
  }

  if (req.path === '/' || req.path === '/\~') {
    if (country === 'ID') return res.redirect(301, '/id/\~');
    return res.redirect(301, '/en/\~');
  }
  next();
});

app.post('/api/upload', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, error: 'No files uploaded' });

    const expires = req.body.expires || '30d';
    const expirySeconds = getExpirySeconds(expires);
    const results = [];

    for (const file of req.files) {
      const storageId = getRandomStorageId();
      const id = shortid.generate();
      const ext = mime.extension(file.mimetype) || 'bin';
      const filename = `\( {storageId}/ \){id}.${ext}`;

      const blob = await put(filename, file.buffer, { access: 'public', addRandomSuffix: false });

      const data = {
        id,
        storageId,
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: blob.url,
        downloadUrl: `https://\( {req.get('host')}/files/ \){id}/download`,
        createdAt: new Date().toISOString(),
        expiresAt: expirySeconds ? new Date(Date.now() + expirySeconds * 1000).toISOString() : null
      };

      const key = `file:\( {storageId}: \){id}`;
      if (expirySeconds) await kv.set(key, data, { ex: expirySeconds });
      else await kv.set(key, data);

      results.push({ id, filename: file.originalname, url: blob.url, shortUrl: `https://\( {req.get('host')}/files/ \){id}`, expires });
    }

    await sendTelegram(`Upload Sukses\nJumlah: ${req.files.length}\nExpired: ${expires}\nStorage random digunakan`);

    res.json({ author: "aka", email: "akaanakbaik17@proton.me", success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Upload gagal' });
  }
});

app.get('/files/:id/status', async (req, res) => {
  for (let i = 1; i <= parseInt(process.env.STORAGE_COUNT); i++) {
    const data = await kv.get(`file:\( {i}: \){req.params.id}`);
    if (data) return res.json({ success: true, data: { ...data, status: 'completed' } });
  }
  res.status(404).json({ success: false, error: 'File not found' });
});

app.get('/files/:id', async (req, res) => {
  for (let i = 1; i <= parseInt(process.env.STORAGE_COUNT); i++) {
    const data = await kv.get(`file:\( {i}: \){req.params.id}`);
    if (data) return res.json({ success: true, data });
  }
  res.status(404).json({ success: false, error: 'File not found' });
});

app.get('/files/:id/download', async (req, res) => {
  for (let i = 1; i <= parseInt(process.env.STORAGE_COUNT); i++) {
    const data = await kv.get(`file:\( {i}: \){req.params.id}`);
    if (data) return res.redirect(data.url);
  }
  res.status(404).send('File not found');
});

app.get('*', (req, res) => res.sendFile('dist/index.html', { root: process.cwd() }));

app.listen(PORT);