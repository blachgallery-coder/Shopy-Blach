export default async function handler(req, res) {
  try {
    const { ARTWORKS } = await import('../../lib/catalog')
    res.json({ artworks: ARTWORKS })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
