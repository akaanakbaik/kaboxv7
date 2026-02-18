import { useTranslation } from 'react-i18next'

export default function Terms() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-zinc prose-invert">
      <h1 className="text-5xl font-semibold tracking-tighter mb-12">Syarat & Ketentuan</h1>
      
      <div className="space-y-12 text-lg leading-relaxed">
        <p>domku box adalah layanan CDN gratis yang disediakan oleh aka. Dengan menggunakan layanan ini, Anda setuju dengan semua ketentuan berikut.</p>

        <div>
          <h2 className="text-2xl font-semibold mb-4">1. Penggunaan Layanan</h2>
          <p>Layanan ini diperuntukkan untuk penyimpanan sementara file media hingga 30 hari. Pengguna bertanggung jawab penuh atas konten yang diupload. Dilarang mengupload file yang melanggar hukum Indonesia atau hak cipta.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">2. Batasan Penggunaan</h2>
          <p>Max 5 file per request. Ukuran file tidak dibatasi (tergantung server). Setiap IP dibatasi 10 request per detik. Pelanggaran berulang akan mengakibatkan pemblokiran permanen.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">3. Privasi & Keamanan</h2>
          <p>Kami tidak menyimpan file Anda di database selain Vercel KV & Blob. Setiap request dicatat hanya untuk monitoring. Kami tidak akan membagikan data Anda kepada pihak ketiga.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">4. Penghapusan File</h2>
          <p>File akan otomatis terhapus setelah 30 hari. Kami tidak menyediakan fitur delete manual untuk menghindari penyalahgunaan.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">5. Tanggung Jawab</h2>
          <p>Layanan ini disediakan "sebagaimana adanya". Kami tidak bertanggung jawab atas kerugian akibat penggunaan layanan ini.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">6. Perubahan Ketentuan</h2>
          <p>Kami dapat mengubah syarat & ketentuan ini kapan saja. Penggunaan terus menerus berarti Anda menyetujui perubahan tersebut.</p>
        </div>

        <p className="text-sm text-zinc-500 pt-12 border-t border-zinc-800">Terakhir diperbarui: 18 Februari 2026 • dibuat oleh aka untuk komunitas.</p>
      </div>
    </div>
  )
}