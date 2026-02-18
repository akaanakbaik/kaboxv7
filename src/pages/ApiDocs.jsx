import { useTranslation } from 'react-i18next'

export default function ApiDocs() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-semibold tracking-tighter mb-4">API Documentation</h1>
      <p className="text-zinc-400 mb-12">Public • Tanpa API Key • 8 Provider Random (Supabase, Neon, Turso, Appwrite, Cloudinary, Backblaze, ImageKit, Prisma)</p>

      <div className="space-y-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1 bg-emerald-500 text-black text-sm font-medium rounded-full">POST</div>
            <h2 className="text-2xl font-medium">/api/upload</h2>
          </div>
          <p className="text-zinc-400 mb-6">Upload max 5 file + pilih expired • provider random otomatis</p>
          <pre className="bg-black/60 p-6 rounded-2xl text-sm overflow-x-auto">curl -F "files=@file1.jpg" -F "expires=30d" https://domku.xyz/api/upload</pre>
          <div className="mt-8">
            <p className="uppercase text-xs tracking-widest text-zinc-500 mb-3">Response</p>
            <pre className="bg-black/60 p-6 rounded-2xl text-sm overflow-x-auto">{JSON.stringify({ author: "aka", email: "akaanakbaik17@proton.me", success: true, data: [{ id: "abc123", provider: "supabase", filename: "file.jpg", url: "https://...", shortUrl: "https://...", expires: "30d" }] }, null, 2)}</pre>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1 bg-sky-500 text-black text-sm font-medium rounded-full">GET</div>
            <h2 className="text-2xl font-medium">/files/:id/status</h2>
          </div>
          <pre className="bg-black/60 p-6 rounded-2xl text-sm">curl https://domku.xyz/files/abc123/status</pre>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1 bg-sky-500 text-black text-sm font-medium rounded-full">GET</div>
            <h2 className="text-2xl font-medium">/files/:id</h2>
          </div>
          <pre className="bg-black/60 p-6 rounded-2xl text-sm">curl https://domku.xyz/files/abc123</pre>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1 bg-rose-500 text-black text-sm font-medium rounded-full">GET</div>
            <h2 className="text-2xl font-medium">/files/:id/download</h2>
          </div>
          <pre className="bg-black/60 p-6 rounded-2xl text-sm">curl -OJ https://domku.xyz/files/abc123/download</pre>
        </div>
      </div>
    </div>
  )
}