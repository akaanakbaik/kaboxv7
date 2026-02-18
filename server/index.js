import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import TelegramBot from 'node-telegram-bot-api';
import geoip from 'geoip-lite';
import { uploadToProvider } from './storageManager.js';

const app = express();
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: { success: false, error: 'Terlalu banyak request. IP kamu dibatasi sementara.' }
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } });

const sendTelegram = async (msg) => {
  try { await bot.sendMessage(process.env.TELEGRAM_CHANNEL_ID, msg, { parse_mode: 'HTML' }); } catch (_) {}
};

app.use(async (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
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
    const results = [];

    for (const file of req.files) {
      const result = await uploadToProvider(file, expires, req);
      results.push(result);
    }

    await sendTelegram(`Upload Sukses\nJumlah: ${req.files.length}\nProvider random: digunakan semua`);

    res.json({ author: "aka", email: "akaanakbaik17@proton.me", success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Upload gagal' });
  }
});

app.get('/files/:id/status', async (req, res) => {
  for (const prov of ['supabase','neon','turso','appwrite','cloudinary','backblaze','imagekit','prisma']) {
    const data = await kv.get(`file:\( {prov}: \){req.params.id}`);
    if (data) return res.json({ success: true, data: { ...data, status: 'completed' } });
  }
  res.status(404).json({ success: false, error: 'File not found' });
});

app.get('/files/:id', async (req, res) => {
  for (const prov of ['supabase','neon','turso','appwrite','cloudinary','backblaze','imagekit','prisma']) {
    const data = await kv.get(`file:\( {prov}: \){req.params.id}`);
    if (data) return res.json({ success: true, data });
  }
  res.status(404).json({ success: false, error: 'File not found' });
});

app.get('/files/:id/download', async (req, res) => {
  for (const prov of ['supabase','neon','turso','appwrite','cloudinary','backblaze','imagekit','prisma']) {
    const data = await kv.get(`file:\( {prov}: \){req.params.id}`);
    if (data) return res.redirect(data.url);
  }
  res.status(404).send('File not found');
});

app.get('*', (req, res) => res.sendFile('dist/index.html', { root: process.cwd() }));

app.listen(PORT);