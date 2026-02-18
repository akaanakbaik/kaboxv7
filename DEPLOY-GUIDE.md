Cara Deploy domku box ke Vercel (Step by Step)

1. Buat repo baru di GitHub
2. Upload semua 28 file yang sudah dikirim (pastikan struktur folder benar)
3. Buka vercel.com → New Project → Import GitHub repo
4. Di Environment Variables, paste semua isi .env.example (nama variabel persis sama)
5. Klik Deploy
6. Setelah deploy selesai, buka Settings → Domains → tambah domku.xyz (atau domain kamu)

Test:
- Buka https://domku.xyz/id/\~
- Upload file → lihat provider random berubah-ubah
- Cek Telegram channel untuk monitoring

Semua 8 provider (Supabase, Neon, Turso, Appwrite, Cloudinary, Backblaze, ImageKit, Prisma) sudah aktif random dan wajib terpakai.

Selesai.

Made by aka