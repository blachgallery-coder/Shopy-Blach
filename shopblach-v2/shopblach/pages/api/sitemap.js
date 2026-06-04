import { ARTWORKS } from '../../lib/catalog'

export default function handler(req, res) {
  const base = 'https://shop.blachgallery.com'
  const urls = [
    `${base}/`,
    `${base}/shop`,
    `${base}/artistes`,
    `${base}/contact`,
    ...ARTWORKS.map(a => `${base}/oeuvre/${a.slug}`),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`
  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(xml)
}
