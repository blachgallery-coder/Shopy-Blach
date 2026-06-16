export const config = { api: { bodyParser: { sizeLimit: '25mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const GH_TOKEN = process.env.NEXT_PUBLIC_GH_TOKEN
  if (!GH_TOKEN) return res.status(500).json({ error: 'GH token manquant' })

  const { action, artwork, imageData, imageName } = req.body
  const REPO = 'blachgallery-coder/Shopy-Blach'
  const CATALOG_PATH = 'shopblach-v2/shopblach/lib/catalog.js'
  const IMAGES_PATH = 'shopblach-v2/shopblach/public/images/'
  const BASE = 'https://api.github.com/repos/' + REPO + '/contents/'

  const headers = { Authorization: 'token ' + GH_TOKEN, 'User-Agent': 'blach-admin', 'Content-Type': 'application/json' }

  async function ghGet(path) {
    const r = await fetch(BASE + path, { headers })
    if (!r.ok) throw new Error('ghGet ' + path + ' → ' + r.status)
    return r.json()
  }

  async function ghPutText(path, content, message) {
    // Always fetch fresh SHA before writing
    let sha = null
    try { const ex = await ghGet(path); sha = ex.sha } catch(e) {}
    const body = { message, content: btoa(unescape(encodeURIComponent(content))) }
    if (sha) body.sha = sha
    const r = await fetch(BASE + path, { method: 'PUT', headers, body: JSON.stringify(body) })
    const d = await r.json()
    if (!d.commit) throw new Error(JSON.stringify(d).slice(0, 200))
    return d
  }

  async function ghPutBin(path, b64, message) {
    let sha = null
    try { const ex = await ghGet(path); sha = ex.sha } catch(e) {}
    const body = { message, content: b64 }
    if (sha) body.sha = sha
    const r = await fetch(BASE + path, { method: 'PUT', headers, body: JSON.stringify(body) })
    const d = await r.json()
    if (!d.content) throw new Error(JSON.stringify(d).slice(0, 200))
    return d
  }

  function buildEntryText(a) {
    const imgs = (a.images || []).map(i => "'" + i + "'").join(', ')
    const tags = (a.tags || []).map(t => "'" + t + "'").join(', ')
    return `  {
    id: '${a.id}', slug: '${a.slug || a.id}',
    title: "${(a.title||'').replace(/"/g,"'")}",
    description: "${(a.description||'').replace(/"/g,"'").replace(/\n/g,' ')}",
    images: [${imgs}],
    price: ${Number(a.price)||0}, priceFramed: ${Number(a.priceFramed)||0},
    format: "${(a.dimensions?.width||0)}x${(a.dimensions?.height||0)} cm",
    dimensions: { width: ${a.dimensions?.width||0}, height: ${a.dimensions?.height||0}, unit: 'cm' },
    edition: ${a.edition||1},
    technique: "${(a.technique||'').replace(/"/g,"'")}",
    support: "${(a.support||'').replace(/"/g,"'")}",
    category: '${a.category||'print'}',
    year: ${a.year||2024},
    artist: '${a.artist||'blach'}',
    serie: '${(a.serie||'').replace(/'/g,'')}',
    tags: [${tags}],
    stock: ${a.stock||10},
    available: ${a.available ? 'true' : 'false'},
    featured: ${a.featured ? 'true' : 'false'},
    new: ${a.new ? 'true' : 'false'},
  }`
  }

  async function updateCatalog(artwork) {
    const catInfo = await ghGet(CATALOG_PATH)
    let catalog = decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g, ''))))
    const startIdx = catalog.indexOf("id: '" + artwork.id + "'")
    if (startIdx < 0) throw new Error('Oeuvre non trouvée: ' + artwork.id)
    const blockStart = catalog.lastIndexOf('\n  {', startIdx)
    const blockEnd = catalog.indexOf('\n  }', startIdx) + 4
    catalog = catalog.slice(0, blockStart) + '\n' + buildEntryText(artwork) + catalog.slice(blockEnd)
    return ghPutText(CATALOG_PATH, catalog, 'fix: update ' + artwork.title)
  }

  try {
    // ── Update artwork ──
    if (action === 'update') {
      const r = await updateCatalog(artwork)
      return res.json({ ok: true, commit: r.commit.sha.slice(0, 8) })
    }

    // ── Upload one image + update catalog ──
    if (action === 'upload-image') {
      const path = IMAGES_PATH + imageName
      await ghPutBin(path, imageData, 'feat: add image ' + imageName)
      // Update catalog with new image added
      const newImgs = [...(artwork.images || []), '/images/' + imageName]
      const updated = { ...artwork, images: newImgs }
      const r = await updateCatalog(updated)
      return res.json({ ok: true, url: '/images/' + imageName, images: newImgs, commit: r.commit.sha.slice(0, 8) })
    }

    // ── Delete artwork ──
    if (action === 'delete') {
      const catInfo = await ghGet(CATALOG_PATH)
      let catalog = decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g, ''))))
      const startIdx = catalog.indexOf("id: '" + artwork.id + "'")
      if (startIdx < 0) throw new Error('Oeuvre non trouvée')
      const blockStart = catalog.lastIndexOf('\n  {', startIdx)
      const blockEnd = catalog.indexOf('\n  }', startIdx) + 4
      let before = catalog.slice(0, blockStart)
      let after = catalog.slice(blockEnd)
      if (before.trimEnd().endsWith(',')) before = before.trimEnd().slice(0, -1)
      else if (after.trimStart().startsWith(',')) after = after.trimStart().slice(1)
      catalog = before + after
      const r = await ghPutText(CATALOG_PATH, catalog, 'feat: delete ' + artwork.id)
      return res.json({ ok: true, commit: r.commit.sha.slice(0, 8) })
    }

    res.status(400).json({ error: 'Action inconnue: ' + action })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
