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
const BOT_TOKEN = '8465999771:AAGHtOm8S6oiqD1TyosSqEkIOnMn8TfON30';
const OWNER_ID = 6559289892;
const CHANNEL_ID = -1003723592679;

const bot = new TelegramBot(BOT_TOKEN);

const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
  message: { success: false, error: 'Terlalu banyak request. IP kamu telah dibatasi sementara.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

const upload = multer({ storage: multer.memoryStorage() });

const sendToTelegram = async (message) => {
  try {
    await bot.sendMessage(CHANNEL_ID, message, { parse_mode: 'HTML' });
  } catch (e) {}
};

const getCountryFromIP = (ip) => {
  const geo = geoip.lookup(ip);
  return geo ? geo.country : 'UNKNOWN';
};

app.use((req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const country = getCountryFromIP(ip);
  const isIndonesia = country === 'ID';

  if (req.path.startsWith('/api/') || req.path.startsWith('/files/')) {
    sendToTelegram(`New Request\nIP: ${ip}\nCountry: ${country}\nPath: ${req.path}\nUser-Agent: ${req.headers['user-agent']}`);
    return next();
  }

  if (req.path === '/' || req.path === '/\~') {
    if (isIndonesia) {
      return res.redirect(301, '/id/\~');
    } else {
      return res.redirect(301, '/en/\~');
    }
  }
  next();
});

app.post('/api/upload', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const results = [];

    for (const file of req.files) {
      const id = shortid.generate();
      const extension = mime.extension(file.mimetype) || 'bin';
      const filename = `\( {id}. \){extension}`;

      const blob = await put(filename, file.buffer, {
        access: 'public',
        addRandomSuffix: false
      });

      const data = {
        id: id,
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: blob.url,
        downloadUrl: `https://\( {req.get('host')}/files/ \){id}/download`,
        createdAt: new Date().toISOString()
      };

      await kv.set(`file:${id}`, data, { ex: 60 * 60 * 24 * 30 });

      results.push({
        id: id,
        filename: file.originalname,
        url: blob.url,
        shortUrl: `https://\( {req.get('host')}/files/ \){id}`
      });
    }

    await sendToTelegram(`Upload Berhasil\nJumlah: ${req.files.length} file\nIP: ${req.ip}`);

    res.json({
      author: "aka",
      email: "akaanakbaik17@proton.me",
      success: true,
      data: results
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Upload gagal' });
  }
});

app.get('/files/:id/status', async (req, res) => {
  const { id } = req.params;
  const data = await kv.get(`file:${id}`);
  if (!data) return res.status(404).json({ success: false, error: 'File not found' });

  res.json({
    success: true,
    data: {
      id: data.id,
      name: data.name,
      size: data.size,
      status: 'completed',
      message: 'Upload completed',
      downloadUrl: data.downloadUrl
    }
  });
});

app.get('/files/:id', async (req, res) => {
  const { id } = req.params;
  const data = await kv.get(`file:${id}`);
  if (!data) return res.status(404).json({ success: false, error: 'File not found' });

  res.json({
    success: true,
    data: {
      id: data.id,
      name: data.name,
      size: data.size,
      mimeType: data.mimeType,
      chunked: false,
      chunkCount: 0,
      checksum: 'sha256-not-available-in-sim',
      createdAt: data.createdAt,
      downloadUrl: data.downloadUrl
    }
  });
});

app.get('/files/:id/download', async (req, res) => {
  const { id } = req.params;
  const data = await kv.get(`file:${id}`);
  if (!data) return res.status(404).send('File not found');

  res.redirect(data.url);
});

app.get('*', (req, res) => {
  res.sendFile('dist/index.html', { root: process.cwd() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});