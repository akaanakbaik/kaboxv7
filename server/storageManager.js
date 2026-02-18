import { put } from '@vercel/blob'
import { kv } from '@vercel/kv'
import shortid from 'shortid'

const providers = [
  'supabase', 'neon', 'turso', 'appwrite',
  'cloudinary', 'backblaze', 'imagekit', 'prisma'
]

export const getRandomProvider = () => {
  const idx = Math.floor(Math.random() * providers.length)
  return providers[idx]
}

export const uploadToProvider = async (file, expiresType, req) => {
  const provider = getRandomProvider()
  const id = shortid.generate()
  const ext = file.originalname.split('.').pop() || 'bin'
  const filename = `\( {provider}/ \){id}.${ext}`

  const blob = await put(filename, file.buffer, {
    access: 'public',
    addRandomSuffix: false
  })

  const expirySeconds = {
    '30s': 30, '1m': 60, '1d': 86400,
    '30d': 2592000, '1y': 31536000, 'forever': null
  }[expiresType] || 2592000

  const data = {
    id,
    provider,
    name: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    url: blob.url,
    downloadUrl: `https://\( {req.get('host')}/files/ \){id}/download`,
    createdAt: new Date().toISOString(),
    expiresAt: expirySeconds ? new Date(Date.now() + expirySeconds * 1000).toISOString() : null
  }

  const key = `file:\( {provider}: \){id}`
  if (expirySeconds) await kv.set(key, data, { ex: expirySeconds })
  else await kv.set(key, data)

  return { id, provider, filename: file.originalname, url: blob.url, shortUrl: `https://\( {req.get('host')}/files/ \){id}`, expires: expiresType }
}