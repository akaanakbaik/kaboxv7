import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { lang } = useParams()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/logokaboxnobg.png" alt="logo" className="w-9 h-9" />
            <span className="text-2xl font-semibold tracking-tighter">domku box</span>
          </div>

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 hover:bg-zinc-900 rounded-2xl transition-all lg:hidden"
          >
            {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: sidebarOpen ? 1 : 0 }}
        className={`fixed inset-0 bg-black/70 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`fixed top-0 bottom-0 right-0 w-80 bg-zinc-900 border-l border-zinc-800 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
        <div className="p-8 pt-20 space-y-2">
          <button 
            onClick={() => { navigate(`/${lang}/\~`); setSidebarOpen(false) }}
            className="w-full text-left px-6 py-4 text-lg hover:bg-zinc-800 rounded-2xl transition-all active:scale-95"
          >
            Beranda
          </button>
          <button 
            onClick={() => { navigate(`/${lang}/docs`); setSidebarOpen(false) }}
            className="w-full text-left px-6 py-4 text-lg hover:bg-zinc-800 rounded-2xl transition-all active:scale-95"
          >
            Dokumentasi API
          </button>
          <button 
            onClick={() => { navigate(`/${lang}/terms`); setSidebarOpen(false) }}
            className="w-full text-left px-6 py-4 text-lg hover:bg-zinc-800 rounded-2xl transition-all active:scale-95"
          >
            Syarat & Ketentuan
          </button>
        </div>
      </div>
    </>
  )
}