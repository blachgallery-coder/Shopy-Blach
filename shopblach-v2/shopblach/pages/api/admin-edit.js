export const config = { api: { bodyParser: { sizeLimit: '25mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const GH_TOKEN = process.env.NEXT_PUBLIC_GH_TOKEN
  if (!GH_TOKEN) return res.status(500).json({ error: 'GH token manquant' })
  
  const { action, artwork, imageData, imageName, imageIndex } = req.body
  const REPO = 'blachgallery-coder/Shopy-Blach'
  const CATALOG_PATH = 'shopblach-v2/shopblach/lib/catalog.js'
  const IMAGES_PATH = 'shopblach-v2/shopblach/public/images/'

  async function ghGet(path) {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GH_TOKEN}`, 'User-Agent': 'blach-admin' }
    })
    return r.json()
  }
  async function ghPut(path, content, message, sha) {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `token ${GH_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'blach-admin' },
      body: JSON.stringify({ message, content: btoa(unescape(encodeURIComponent(content))), ...(sha && { sha }) })
    })
    return r.json()
  }
  async function ghPutBin(path, b64, message, sha) {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `token ${GH_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'blach-admin' },
      body: JSON.stringify({ message, content: b64, ...(sha && { sha }) })
    })
    return r.json()
  }

  try {
    // ── Update artwork fields (price, title, description, available, etc.) ──
    if (action === 'update') {
      const catInfo = await ghGet(CATALOG_PATH)
      let catalog = decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g, ''))))
      
      // Find and replace the entry
      const idPattern = new RegExp(`(\\{[^{}]*?id:\\s*['"]${artwork.id}['"][^{}]*?)\\}`, 's')
      
      const newEntry = `  {
    id: '${artwork.id}', slug: '${artwork.slug || artwork.id}',
    title: "${artwork.title}", titleEn: "${artwork.title}",
    description: "${(artwork.description || '').replace(/"/g, "'")}",
    images: [${(artwork.images || []).map(i => `'${i}'`).join(', ')}],
    price: ${Number(artwork.price) || 0}, priceFramed: ${Number(artwork.priceFramed) || 0},
    format: "${artwork.dimensions?.width}x${artwork.dimensions?.height} cm",
    dimensions: { width: ${artwork.dimensions?.width || 0}, height: ${artwork.dimensions?.height || 0}, unit: 'cm' },
    edition: ${artwork.edition || 1},
    technique: "${artwork.technique || ''}",
    support: "${artwork.support || ''}",
    category: '${artwork.category || 'print'}',
    year: ${artwork.year || 2024},
    artist: '${artwork.artist || 'blach'}',
    serie: '${artwork.serie || ''}',
    tags: [${(artwork.tags || []).map(t => `'${t}'`).join(', ')}],
    stock: ${artwork.stock || 10},
    available: ${artwork.available ? 'true' : 'false'},
    featured: ${artwork.featured ? 'true' : 'false'},
    new: ${artwork.new ? 'true' : 'false'},
  }`
      
      // Replace old entry
      const startIdx = catalog.indexOf(`id: '${artwork.id}'`)
      if (startIdx < 0) return res.status(404).json({ error: 'Oeuvre non trouvée: ' + artwork.id })
      const blockStart = catalog.lastIndexOf('\n  {', startIdx)
      const blockEnd = catalog.indexOf('\n  }', startIdx) + 4
      catalog = catalog.slice(0, blockStart) + '\n' + newEntry + catalog.slice(blockEnd)
      
      const r = await ghPut(CATALOG_PATH, catalog, `fix: update ${artwork.title}`, catInfo.sha)
      if (r.commit) return res.json({ ok: true, commit: r.commit.sha.slice(0, 8) })
      return res.status(500).json({ error: JSON.stringify(r).slice(0, 200) })
    }

    // ── Upload new image ──
    if (action === 'upload-image') {
      const path = IMAGES_PATH + imageName
      let existSha = null
      try { const ex = await ghGet(path); existSha = ex.sha } catch(e) {}
      const r = await ghPutBin(path, imageData, `feat: add image ${imageName}`, existSha)
      if (r.content) return res.json({ ok: true, url: '/images/' + imageName })
      return res.status(500).json({ error: JSON.stringify(r).slice(0, 200) })
    }

    // ── Delete image from artwork ──
    if (action === 'remove-image') {
      const catInfo = await ghGet(CATALOG_PATH)
      let catalog = decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g, ''))))
      const startIdx = catalog.indexOf(`id: '${artwork.id}'`)
      if (startIdx < 0) return res.status(404).json({ error: 'Oeuvre non trouvée' })
      const blockStart = catalog.lastIndexOf('\n  {', startIdx)
      const blockEnd = catalog.indexOf('\n  }', startIdx) + 4
      let block = catalog.slice(blockStart, blockEnd)
      block = block.replace(new RegExp(`,?\\s*'${imageIndex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'), '')
      catalog = catalog.slice(0, blockStart) + block + catalog.slice(blockEnd)
      const r = await ghPut(CATALOG_PATH, catalog, `fix: remove image from ${artwork.id}`, catInfo.sha)
      if (r.commit) return res.json({ ok: true })
      return res.status(500).json({ error: JSON.stringify(r).slice(0, 200) })
    }

    // ── Delete artwork entirely ──
    if (action === 'delete') {
      const catInfo = await ghGet(CATALOG_PATH)
      let catalog = decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g, ''))))
      const startIdx = catalog.indexOf(`id: '${artwork.id}'`)
      if (startIdx < 0) return res.status(404).json({ error: 'Oeuvre non trouvée' })
      const blockStart = catalog.lastIndexOf('\n  {', startIdx)
      const blockEnd = catalog.indexOf('\n  }', startIdx) + 4
      let before = catalog.slice(0, blockStart)
      let after = catalog.slice(blockEnd)
      // remove leading comma if present
      after = after.replace(/^,/, '')
      if (before.endsWith(',') && after.trimStart().startsWith(']')) before = before.slice(0, -1)
      catalog = before + after
      const r = await ghPut(CATALOG_PATH, catalog, `feat: delete artwork ${artwork.id}`, catInfo.sha)
      if (r.commit) return res.json({ ok: true })
      return res.status(500).json({ error: JSON.stringify(r).slice(0, 200) })
    }

    res.status(400).json({ error: 'Action inconnue: ' + action })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
