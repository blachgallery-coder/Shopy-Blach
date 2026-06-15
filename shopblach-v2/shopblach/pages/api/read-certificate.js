export const config = { api: { bodyParser: { sizeLimit: '20mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { image, mediaType } = req.body
  if (!image) return res.status(400).json({ error: 'image required' })

  // Support both naming conventions (Vercel may translate env var names)
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY manquant' })

  const prompt = `Tu es un expert en art. Lis ce certificat d'authenticité et extrait toutes les informations.
Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks), avec cette structure exacte:
{
  "title": "titre exact de l'oeuvre",
  "artist": "blach",
  "year": 2024,
  "serie": "nom de la série ou null",
  "technique": "technique complète",
  "support": "support matière",
  "dimensions": {"width": 60, "height": 40, "unit": "cm"},
  "edition": 30,
  "price": 0,
  "priceFramed": 0,
  "stock": 10,
  "category": "print",
  "featured": false,
  "new": true,
  "tags": ["tag1", "tag2"],
  "description": "description courte en français pour le shop"
}
Pour price et priceFramed, mets 0 si tu ne sais pas (sera calculé selon la grille).`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: 'Anthropic API error: ' + err.slice(0, 300) })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let entry
    try {
      entry = JSON.parse(text)
    } catch(e) {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) entry = JSON.parse(match[0])
      else return res.status(500).json({ error: 'Réponse non JSON: ' + text.slice(0, 200) })
    }

    const GRID = {
      '30x60':{photo:75,framed:90},'40x40':{photo:70,framed:90},'40x50':{photo:85,framed:110},
      '40x60':{photo:100,framed:130},'50x50':{photo:105,framed:140},'50x60':{photo:125,framed:160},
      '55x38':{photo:90,framed:120},'60x60':{photo:150,framed:190},'60x80':{photo:190,framed:230},
      '75x50':{photo:160,framed:200},'75x75':{photo:230,framed:270},'70x70':{photo:200,framed:240},
      '80x52':{photo:180,framed:220},'80x56':{photo:180,framed:220},'80x80':{photo:260,framed:300},
      '90x60':{photo:220,framed:250},
    }
    if (entry.dimensions && (!entry.price || entry.price === 0)) {
      const {width:w, height:h} = entry.dimensions
      const p = GRID[`${w}x${h}`] || GRID[`${h}x${w}`]
      if (p) { entry.price = p.photo; entry.priceFramed = p.framed }
    }

    const slug = (entry.title || 'oeuvre').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    entry.id = slug
    entry.slug = slug

    res.json({ entry })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
