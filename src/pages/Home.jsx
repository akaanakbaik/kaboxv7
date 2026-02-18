import { useState, useRef } from 'react'
import { Upload, Copy, ExternalLink, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState([])
  const [expires, setExpires] = useState('30d')
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)

  const handleDragOver = (e) => { e.preventDefault(); dropRef.current.classList.add('dragover') }
  const handleDragLeave = () => dropRef.current.classList.remove('dragover')
  const handleDrop = (e) => {
    e.preventDefault()
    dropRef.current.classList.remove('dragover')
    setFiles(Array.from(e.dataTransfer.files).slice(0, 5))
  }

  const startUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('expires', expires)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload', true)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.response)
        setResults(res.data || [])
        toast.success('Berhasil!', { description: `${files.length} file diupload` })
      } else toast.error('Gagal')
      setUploading(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 800)
    }

    xhr.send(formData)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* ... header sama seperti sebelumnya ... */}

      <div ref={dropRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        className="drag-area border-4 border-dashed border-zinc-700 rounded-3xl h-80 flex flex-col items-center justify-center bg-zinc-900/50 cursor-pointer"
        onClick={() => fileInputRef.current.click()}>
        <Upload size={64} className="mb-6 text-zinc-400" />
        <p className="text-2xl mb-2">{t('dragdrop')}</p>
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))} />
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium">File terpilih ({files.length}/5)</p>
            <select value={expires} onChange={(e) => setExpires(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-2 text-sm">
              <option value="30s">30 detik</option>
              <option value="1m">1 menit</option>
              <option value="1d">1 hari</option>
              <option value="30d">30 hari</option>
              <option value="1y">1 tahun</option>
              <option value="forever">Selamanya</option>
            </select>
          </div>

          <button onClick={startUpload} disabled={uploading} className="w-full py-4 bg-white text-black rounded-2xl font-semibold">
            Mulai Upload
          </button>
        </div>
      )}

      {uploading && (
        <div className="mt-8">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="progress-bar h-2 bg-white rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-center text-sm mt-2">{progress}%</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-semibold mb-8">{t('results')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {results.map((item, i) => (
              <motion.div key={i} className="card bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <p className="text-sm text-zinc-400 mb-2">{item.filename}</p>
                <div className="bg-black/60 border border-zinc-700 rounded-2xl px-4 py-3 text-sm break-all font-mono mb-6">{item.url}</div>
                <div className="flex gap-3">
                  <button onClick={() => { navigator.clipboard.writeText(item.url); toast.success('Link disalin') }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 rounded-2xl">
                    Salin
                  </button>
                  <a href={item.url} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black rounded-2xl">Buka</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}