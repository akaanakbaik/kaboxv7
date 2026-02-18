import { Routes, Route, useParams } from 'react-router-dom'
import { Toaster } from 'sonner'
import Header from './components/Header'
import Home from './pages/Home'
import ApiDocs from './pages/ApiDocs'
import Terms from './pages/Terms'
import { useEffect } from 'react'
import i18n from './i18n'

function AppContent() {
  const { lang } = useParams()

  useEffect(() => {
    if (lang === 'en' || lang === 'id') {
      i18n.changeLanguage(lang)
    }
  }, [lang])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/:lang/\~" element={<Home />} />
          <Route path="/:lang/docs" element={<ApiDocs />} />
          <Route path="/:lang/terms" element={<Terms />} />
        </Routes>
      </main>
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<AppContent />} />
    </Routes>
  )
}