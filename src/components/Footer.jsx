import { useTranslation } from 'react-i18next'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12 mt-auto">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-sm text-zinc-500">
          created by <a href="https://akadev.me" target="_blank" className="text-red-500 hover:underline">aka</a> dengan ❤️ dan kode
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <a href="https://t.me/akamodebaik" target="_blank" className="text-zinc-400 hover:text-white transition-all">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.59 2 12.253c0 4.54 2.87 8.4 6.84 9.8.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.87 1.5 2.29 1.07 2.85.82.09-.64.34-1.07.62-1.32-2.21-.25-4.55-1.1-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0112 6.8c.85.004 1.71.115 2.52.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.67-4.57 4.91.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49C19.14 20.65 22 16.79 22 12.253 22 6.59 17.52 2 12 2z"/></svg>
          </a>
          <a href="https://github.com/akaanakbaik" target="_blank" className="text-zinc-400 hover:text-white transition-all">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
        </div>
        <p className="mt-8 text-xs text-zinc-600">© 2026 domku box • Fast Secure CDN • Multi Storage Random</p>
      </div>
    </footer>
  )
}