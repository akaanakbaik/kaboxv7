import { useTranslation } from 'react-i18next'

export default function Terms() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-zinc prose-invert">
      <h1 className="text-5xl font-semibold tracking-tighter mb-12">Syarat & Ketentuan</h1>
      
      <div className="space-y-12 text-lg leading-relaxed">
        <p>domku box adalah layanan CDN gratis dengan sistem 8 provider random. Dengan menggunakan layanan ini Anda setuju dengan semua ketentuan berikut.</p>

        <div>
          <h2 className="text-2xl font-semibold mb-4">1. Multi Provider Random</h2>
          <p>Setiap upload dipilih secara acak ke salah satu dari 8 provider: Supabase, Neon, Turso, Appwrite, Cloudinary, Backblaze, ImageKit, Prisma. Sistem ini memastikan semua provider digunakan secara merata dan optimal.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">2. Masa Expired</h2>
          <p>Pengguna dapat memilih masa berlaku: 30 detik, 1 menit, 1 hari, 30 hari, 1 tahun, atau selamanya. File akan otomatis dihapus setelah masa expired kecuali selamanya.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">3. Batasan & Keamanan</h2>
          <p>Maksimal 5 file per request. Setiap IP dibatasi 10 request per detik. Pelanggaran berulang akan diblokir permanen. Dilarang mengupload konten ilegal atau melanggar hak cipta.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">4. Privasi</h2>
          <p>Kami tidak menyimpan file selain di provider yang dipilih dan Vercel KV. Semua request dicatat hanya untuk monitoring internal.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">5. Tanggung Jawab</h2>
          <p>Layanan ini disediakan sebagaimana adanya. Kami tidak bertanggung jawab atas kerugian akibat penggunaan layanan ini.</p>
        </div>

        <p className="text-sm text-zinc-500 pt-12 border-t border-zinc-800">Terakhir diperbarui: 18 Februari 2026 • dibuat oleh aka</p>
      </div>
    </div>
  )
}