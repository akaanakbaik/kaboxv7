# SQL Reset + Create Table untuk semua database kamu

## 1. Supabase (jalankan di SQL Editor Supabase)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);

## 2. Neon DB (jalankan di Neon SQL Editor)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);

## 3. Prisma Accelerate (jalankan di Prisma Studio atau SQL)
DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  provider TEXT,
  name TEXT,
  size BIGINT,
  mime_type TEXT,
  url TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
CREATE INDEX idx_provider ON files(provider);
CREATE INDEX idx_expires_at ON files(expires_at);

## 4. Turso (jalankan di Turso shell: turso db shell kabox)
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