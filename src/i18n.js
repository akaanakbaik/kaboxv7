import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  id: {
    translation: {
      home: 'Beranda',
      apidocs: 'Dokumentasi API',
      terms: 'Syarat & Ketentuan',
      uploadTitle: 'Upload Media ke CDN',
      dragdrop: 'Tarik dan lepas file di sini',
      or: 'atau',
      selectfiles: 'Pilih File',
      start: 'Mulai Upload',
      max5: 'Maksimal 5 file',
      results: 'Hasil Upload',
      copy: 'Salin',
      open: 'Buka',
      uploading: 'Mengunggah...',
      success: 'Berhasil!',
      failed: 'Gagal'
    }
  },
  en: {
    translation: {
      home: 'Home',
      apidocs: 'API Docs',
      terms: 'Terms & Conditions',
      uploadTitle: 'Upload Media to CDN',
      dragdrop: 'Drag and drop files here',
      or: 'or',
      selectfiles: 'Select Files',
      start: 'Start Upload',
      max5: 'Maximum 5 files',
      results: 'Upload Results',
      copy: 'Copy',
      open: 'Open',
      uploading: 'Uploading...',
      success: 'Success!',
      failed: 'Failed'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id',
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n