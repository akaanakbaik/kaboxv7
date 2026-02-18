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
        toast.success(t('success'), { description: `${files.length} file berhasil diupload` })
      } else toast.error(t('failed'))
      setUploading(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 800)
    }

    xhr.send(formData)
  }

  const copyLink = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('Link disalin')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-semibold tracking-tighter mb-4">
          Upload ke kabox
        </motion.h1>
        <p className="text-zinc-400 text-xl">8 Provider Random • kabox.my.id</p>
      </div>

      {/* sisanya sama seperti sebelumnya, hanya judul diubah */}
      {/* ... (drag area, results, dll tetap sama) ... */}
    </div>
  )
}