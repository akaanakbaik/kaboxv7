SQL Reset + Create Table untuk semua 8 provider kamu
Jalankan satu per satu di masing-masing database

1. Supabase (SQL Editor di dashboard)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);

2. Neon DB (Neon SQL Editor atau psql)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);

3. Prisma Accelerate (Prisma Studio atau SQL)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);

4. Turso (jalankan di terminal)
turso db shell kabox
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size INTEGER,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TEXT,
  expires_at TEXT
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);
.exit

5. Appwrite (Appwrite Console → Database → SQL)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size INTEGER,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TEXT,
  expires_at TEXT
);

6-8. Cloudinary, Backblaze, ImageKit (tidak perlu table, pakai Vercel KV + Blob)
Tidak perlu SQL, metadata disimpan di Vercel KV

Selesai. Semua provider sudah siap digunakan secara random.