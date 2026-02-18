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
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    dropRef.current.classList.add('dragover')
  }

  const handleDragLeave = () => {
    dropRef.current.classList.remove('dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    dropRef.current.classList.remove('dragover')
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 5)
    setFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 5)
    setFiles(selectedFiles)
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const startUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setResults([])

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload', true)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setProgress(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.response)
          setResults(res.data || [])
          toast.success(t('success'), { description: `${files.length} file berhasil diupload` })
        } else {
          toast.error(t('failed'))
        }
        setUploading(false)
        setProgress(100)
        setTimeout(() => setProgress(0), 800)
      }

      xhr.send(formData)
    } catch (err) {
      toast.error(t('failed'))
      setUploading(false)
    }
  }

  const copyLink = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('Link disalin')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-semibold tracking-tighter mb-4"
        >
          {t('uploadTitle')}
        </motion.h1>
        <p className="text-zinc-400 text-xl">domku box • CDN cepat & aman</p>
      </div>

      <div 
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="drag-area border-4 border-dashed border-zinc-700 rounded-3xl h-80 flex flex-col items-center justify-center bg-zinc-900/50 cursor-pointer hover:border-zinc-500"
        onClick={() => fileInputRef.current.click()}
      >
        <Upload size={64} className="mb-6 text-zinc-400" />
        <p className="text-2xl mb-2">{t('dragdrop')}</p>
        <p className="text-zinc-500">{t('or')}</p>
        <button className="mt-6 px-8 py-3 bg-white text-black rounded-2xl font-medium flex items-center gap-3 hover:bg-zinc-200 transition-all">
          {t('selectfiles')}
        </button>
        <input 
          ref={fileInputRef} 
          type="file" 
          multiple 
          className="hidden" 
          onChange={handleFileSelect} 
        />
        <p className="text-xs text-zinc-500 mt-8">{t('max5')}</p>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-medium">File terpilih ({files.length}/5)</p>
            <button 
              onClick={startUpload}
              disabled={uploading}
              className="px-10 py-3 bg-white text-black rounded-2xl font-semibold disabled:opacity-50 flex items-center gap-3 hover:bg-zinc-200 transition-all active:scale-95"
            >
              {t('start')}
            </button>
          </div>

          <div className="grid gap-3">
            {files.map((file, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                    📄
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-md">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="text-zinc-400 hover:text-red-400">
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="mt-8">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="progress-bar h-2 bg-white rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-zinc-400 mt-2">{progress}%</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-8">{t('results')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {results.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <p className="text-sm text-zinc-400 mb-2">{item.filename}</p>
                <div className="bg-black/60 border border-zinc-700 rounded-2xl px-4 py-3 text-sm break-all font-mono mb-6">
                  {item.url}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => copyLink(item.url)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all"
                  >
                    <Copy size={18} /> {t('copy')}
                  </button>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all"
                  >
                    <ExternalLink size={18} /> {t('open')}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-24 text-center text-xs text-zinc-500 flex flex-col items-center gap-1">
        created by <a href="https://akadev.me" target="_blank" className="text-red-500 hover:underline">aka</a> dengan ❤️ dan kode<br />
        <div className="flex gap-4 mt-4">
          <a href="https://t.me/akamodebaik" target="_blank" className="hover:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.59 2 12.253c0 4.54 2.87 8.4 6.84 9.8.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.87 1.5 2.29 1.07 2.85.82.09-.64.34-1.07.62-1.32-2.21-.25-4.55-1.1-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0112 6.8c.85.004 1.71.115 2.52.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.67-4.57 4.91.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49C19.14 20.65 22 16.79 22 12.253 22 6.59 17.52 2 12 2z"/></svg>
          </a>
          <a href="https://github.com/akaanakbaik" target="_blank" className="hover:scale-110 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}