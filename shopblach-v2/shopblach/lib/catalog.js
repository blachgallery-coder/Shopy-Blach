// ============================================================
// BLACH GALLERY — CATALOGUE COMPLET
// Importé depuis artofBLACH (Etsy)
// Source de vérité unique.
// ============================================================

export const ARTISTS = {
  blach: {
    id: 'blach',
    name: 'Maxime Blachère',
    alias: 'BLACH®',
    bio: 'Artiste lyonnais né en 1980, fondateur du collectif BLACH Gallery.',
    coefficient: 1200,
  },
  carotte: { id: 'carotte', name: 'La Carotte', alias: 'Carotte', coefficient: 600 },
}

export const CATEGORIES = [
  { id: 'editions-limitees', label: 'Éditions Limitées', icon: '❖' },
  { id: 'new-york', label: 'New York', icon: '🗽' },
  { id: 'paris', label: 'Paris', icon: '🗴' },
  { id: 'france', label: 'France', icon: '🇫🇷' },
  { id: 'europe', label: 'Europe', icon: '🏰' },
  { id: 'asia', label: 'Asie', icon: '🏯' },
  { id: 'animal-fruit', label: 'Animal / Fruit', icon: '🐾' },
  { id: 'iceberg', label: 'Iceberg', icon: '🌊' },
  { id: 'graffiti-name', label: 'Graffiti Name', icon: '✍️' },
]

export const ARTWORKS = [
  {
    id: 'new-york-bored-ape-fluo', slug: 'new-york-bored-ape-fluo',
    title: 'New York Bored Ape Fluo', artist: 'blach', year: 2023, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 300, priceFramed: 0,
    available: true, stock: 20, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'bored ape', 'fluo', 'VIC'],
    description: "VIC New York Bored Ape Fluo — Giclée sur Dibond aluminium brillant 60×40 cm. Édition /30 signée et numérotée.",
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'new-york-goldorak-albator', slug: 'new-york-goldorak-albator',
    title: 'New York Goldorak & Albator', artist: 'blach', year: 2023, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 300, priceFramed: 0,
    available: true, stock: 15, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'goldorak', 'albator', 'manga', 'VIC'],
    description: 'New York vandalisé par Goldorak et Albator. VIC series, édition /30 signée.',
    images: ['/images/new-york-goldorak-albator.jpg', '/images/new-york-goldorak-albator-2.jpg', '/images/new-york-goldorak-albator-3.jpg', '/images/new-york-goldorak-albator-4.jpg', '/images/new-york-goldorak-albator-5.jpg'],
  },
  {
    id: 'new-york-goldoblach-2026-xxl', slug: 'new-york-goldoblach-2026-xxl',
    title: 'New York GoldoBlach 2026 XXL', artist: 'blach', year: 2026,
    technique: 'Sérigraphie', support: 'Papier 300g',
    dimensions: { width: 100, height: 70, unit: 'cm' }, edition: 30, price: 890, priceFramed: 0,
    available: true, stock: 12, category: 'new-york', featured: true, new: true,
    tags: ['new york', 'goldorak', 'XXL', '2026'],
    description: 'Oeuvre monumentale 100x70 cm, tirage /30 numérotés et signés.',
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'new-york-simpsons', slug: 'new-york-simpsons',
    title: 'VIC New York Simpsons', artist: 'blach', year: 2024, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 300, priceFramed: 0,
    available: false, stock: 20, category: 'new-york', featured: false, new: false,
    tags: ['new york', 'simpsons', 'VIC', 'pop culture'],
    description: 'La famille Simpson envahit New York. Dibond brillant 60×40 cm, édition /30.',
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'new-york-rainbow-xl', slug: 'new-york-rainbow-xl',
    title: 'New York Rainbow XL', artist: 'blach', year: 2024,
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 80, height: 56, unit: 'cm' }, edition: 20, price: 450, priceFramed: 0,
    available: false, stock: 10, category: 'new-york', featured: false, new: false,
    tags: ['new york', 'rainbow', 'XL'],
    description: 'New York Rainbow XL. Dibond 80x56 cm, édition /20.',
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'paris-3024', slug: 'paris-3024',
    title: 'Paris 3024', artist: 'blach', year: 2025, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 300, priceFramed: 0,
    available: false, stock: 20, category: 'paris', featured: false, new: false,
    tags: ['paris', 'futur', 'VIC', '3024'],
    description: 'Paris projeté en 3024 — univers futuriste et coloré. VIC series /30.',
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'paris-je-taime', slug: 'paris-je-taime',
    title: "Paris Je T'Aime", artist: 'blach', year: 2023,
    technique: 'Impression offset', support: 'Toile 500g',
    dimensions: { width: 75, height: 50, unit: 'cm' }, edition: 30, price: 160, priceFramed: 200,
    available: false, stock: 15, category: 'paris', featured: false, new: false,
    tags: ['paris', 'amour', 'toile'],
    description: "Paris revisitée par BLACH® — déclaration d'amour à la capitale. Toile 500g 75x50 cm, /30.",
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'arc-de-triomphe-libertay', slug: 'arc-de-triomphe-libertay',
    title: 'Arc de Triomphe de la Libertay', artist: 'blach', year: 2022,
    technique: 'Giclée sur toile', support: 'Toile sur châssis bois',
    dimensions: { width: 60, height: 60, unit: 'cm' }, edition: 30, price: 150, priceFramed: 190,
    available: false, stock: 10, category: 'paris', featured: false, new: false,
    tags: ['paris', 'arc de triomphe', 'liberte'],
    description: "Arc de Triomphe revisité. Toile 60x60 cm. Édition /30.",
    images: ['/images/new-york-goldorak-albator.jpg'],
  },
  {
    id: 'lyon-fluence', slug: 'lyon-fluence',
    title: "Lyon 1'Fluence XL", artist: 'blach', year: 2023, serie: 'Lyon',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 90, height: 60, unit: 'cm' }, edition: 15, price: 220, priceFramed: 250,
    available: true, stock: 10, category: 'france', featured: true, new: false,
    tags: ['lyon', 'fluence', 'XL'],
    description: "Lyon 1'Fluence XL — Giclée Dibond 90x60 cm, édition /15 signée.",
    images: ['/images/lyon-fluence.jpg'],
  },
  {
    id: 'lyon-nb', slug: 'lyon-nb',
    title: 'Lyon NB', artist: 'blach', year: 2022, serie: 'Lyon',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 100, priceFramed: 130,
    available: true, stock: 10, category: 'france', featured: false, new: false,
    tags: ['lyon', 'noir et blanc'],
    description: "Lyon en noir et blanc. Giclée Dibond 60x40 cm, édition /30.",
    images: ['/images/lyon-nb.jpg'],
  },
  {
    id: 'lyon-urc-xl', slug: 'lyon-urc-xl',
    title: 'Lyon URc XL', artist: 'blach', year: 2024, serie: 'Lyon',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 80, height: 60, unit: 'cm' }, edition: 20, price: 190, priceFramed: 230,
    available: true, stock: 10, category: 'france', featured: false, new: false,
    tags: ['lyon', 'urc', 'XL'],
    description: "Lyon URc XL. Giclée Dibond 80x60 cm, édition /20.",
    images: ['/images/lyon-urc-xl.jpg'],
  },
  {
    id: 'lyon-guignol-xl', slug: 'lyon-guignol-xl',
    title: 'Lyon Guignol XL', artist: 'blach', year: 2023, serie: 'Lyon',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 90, height: 60, unit: 'cm' }, edition: 15, price: 220, priceFramed: 250,
    available: true, stock: 10, category: 'france', featured: true, new: false,
    tags: ['lyon', 'guignol', 'XL'],
    description: "Lyon Guignol XL. Giclée Dibond 90x60 cm, édition /15.",
    images: ['/images/lyon-guignol-xl.jpg'],
  },
  {
    id: 'lyon-opera', slug: 'lyon-opera',
    title: "VIC Lyon Opéra Allstars", artist: 'blach', year: 2023, serie: 'VIC',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 60, unit: 'cm' }, edition: 30, price: 150, priceFramed: 190,
    available: true, stock: 10, category: 'france', featured: false, new: false,
    tags: ['lyon', 'opera', 'VIC'],
    description: "VIC Lyon Opéra Allstars. Giclée Dibond 60x60 cm, édition /30.",
    images: ['/images/lyon-opera.jpg'],
  },
  {
    id: 'passerelle-rouge', slug: 'passerelle-rouge',
    title: 'Lyon Passerelle Rouge', artist: 'blach', year: 2024, serie: 'Lyon',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 80, height: 56, unit: 'cm' }, edition: 20, price: 180, priceFramed: 220,
    available: true, stock: 10, category: 'france', featured: false, new: false,
    tags: ['lyon', 'passerelle', 'rouge'],
    description: "Lyon Passerelle Rouge. Giclée Dibond 80x56 cm, édition /20.",
    images: ['/images/passerelle-rouge.jpg'],
  },
  {
    id: 'lyon-affiche-vintage', slug: 'lyon-affiche-vintage',
    title: 'Lyon Vintage du Futur', artist: 'blach', year: 2024, serie: 'Lyon',
    technique: 'Giclée sur Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 75, height: 50, unit: 'cm' }, edition: 30, price: 160, priceFramed: 200,
    available: true, stock: 10, category: 'france', featured: false, new: false,
    tags: ['lyon', 'vintage', 'affiche'],
    description: "Lyon Vintage du Futur. Giclée Dibond 75x50 cm, édition /30.",
    images: ['/images/lyon-affiche-vintage.jpg'],
  },
  {
    id: 'urc-lyon-xxl-2026', slug: 'urc-lyon-xxl-2026',
    title: 'URC Lyon XXL 2026', artist: 'blach', year: 2026, serie: 'Fluxus',
    technique: 'Mixed media: Acrylique, markers, crayons pastel, fixatif. Vernis satin spray.',
    support: 'Toile 450g/m2',
    dimensions: { width: 120, height: 120, unit: 'cm' }, edition: 1, price: 1500, priceFramed: 1500,
    available: true, stock: 1, category: 'original', featured: true, new: true,
    tags: ['lyon', 'XXL', 'original', 'fluxus', 'cityscape'],
    description: "Oeuvre originale unique 120x120 cm. Techniques mixtes sur toile. Style Fluxus, ville de Lyon.",
    images: ['/images/urc-lyon-xxl-2026.jpg', '/images/urc-lyon-xxl-2026-2.jpg', '/images/urc-lyon-xxl-2026-3.jpg', '/images/urc-lyon-xxl-2026-4.jpg', '/images/urc-lyon-xxl-2026-5.jpg', '/images/urc-lyon-xxl-2026-6.jpg', '/images/urc-lyon-xxl-2026-7.jpg', '/images/urc-lyon-xxl-2026-8.jpg', '/images/urc-lyon-xxl-2026-9.jpg', '/images/urc-lyon-xxl-2026-10.jpg', '/images/urc-lyon-xxl-2026-11.jpg'],
  },,
  {
    id: 'new-york-afro-graffiti', slug: 'new-york-afro-graffiti',
    title: 'New York Afro Graffiti', artist: 'blach', year: 2022, serie: 'Fluxus 2.0',
    technique: 'Giclée sur toile', support: 'Toile 610g',
    dimensions: { width: 80, height: 50, unit: 'cm' }, edition: 30, price: 160, priceFramed: 200,
    available: true, stock: 10, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'afro', 'graffiti', 'fluxus'],
    description: "New York Afro Graffiti — Giclée sur toile 610g, 80x50 cm. Édition limitée /30 signée et numérotée. Certificat d'authenticité BLACH®.",
    images: ['/images/new-york-afro-graffiti.jpg', '/images/new-york-afro-graffiti-2.jpg', '/images/new-york-afro-graffiti-3.jpg', '/images/new-york-afro-graffiti-4.jpg', '/images/new-york-afro-graffiti-5.jpg', '/images/new-york-afro-graffiti-6.jpg', '/images/new-york-afro-graffiti-7.jpg', '/images/new-york-afro-graffiti-8.jpg', '/images/new-york-afro-graffiti-9.jpg', '/images/new-york-afro-graffiti-10.jpg', '/images/new-york-afro-graffiti-11.jpg'],
  }
,
  {
    id: 'new-york-bat-blach', slug: 'new-york-bat-blach',
    title: 'VIC Bat Blach', artist: 'blach', year: 2021, serie: 'Fluxus 2.0',
    technique: 'Giclée sur aluminium Dibond', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250, priceFramed: 0,
    available: true, stock: 10, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'batman', 'VIC', 'fluxus', 'superheros'],
    description: "VIC Bat Blach — Batman s'invite à New York. Giclée sur Dibond aluminium brillant 60x40 cm. Édition limitée /30 signée et numérotée. Certificat d'authenticité BLACH®.",
    images: ['/images/new-york-bat-blach.jpg', '/images/new-york-bat-blach-2.jpg', '/images/new-york-bat-blach-3.jpg', '/images/new-york-bat-blach-4.jpg', '/images/new-york-bat-blach-5.jpg', '/images/new-york-bat-blach-6.jpg', '/images/new-york-bat-blach-7.jpg', '/images/new-york-bat-blach-8.jpg', '/images/new-york-bat-blach-9.jpg'],
  }
,
  {
    id: 'new-york-burns-joker-blachcoin', slug: 'new-york-burns-joker-blachcoin',
    title: 'VIC New York Burns vs Joker vs Blachcoin', artist: 'blach', year: 2021, serie: 'Fluxus 2.0',
    technique: 'Giclée sur toile', support: 'Toile 500g/m2',
    dimensions: { width: 70, height: 102, unit: 'cm' }, edition: 30, price: 250, priceFramed: 0,
    available: true, stock: 10, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'burns', 'joker', 'blachcoin', 'VIC', 'fluxus'],
    description: "VIC New York Burns vs Joker vs Blachcoin — Format vertical XXL 70x102 cm. Giclée sur toile 500g/m2. Édition limitée /30 signée et numérotée. Certificat d'authenticité BLACH®.",
    images: ['/images/new-york-burns-joker-blachcoin.jpg', '/images/new-york-burns-joker-blachcoin-2.jpg', '/images/new-york-burns-joker-blachcoin-3.jpg', '/images/new-york-burns-joker-blachcoin-4.jpg', '/images/new-york-burns-joker-blachcoin-5.jpg', '/images/new-york-burns-joker-blachcoin-6.jpg'],
  }
,
  {
    id: 'dbz-dragon-ball-z', slug: 'dbz-dragon-ball-z',
    title: 'Dragon Ball Z', artist: 'blach', year: 2023, serie: 'Fluxus 2.0',
    technique: 'Giclée sur papier', support: 'Papier 300g',
    dimensions: { width: 75, height: 50, unit: 'cm' }, edition: 30, price: 200, priceFramed: 0,
    available: true, stock: 10, category: 'new-york', featured: true, new: false,
    tags: ['dragon ball', 'DBZ', 'manga', 'anime', 'graffiti', 'fluxus'],
    description: "Dragon Ball Z x BLACH® — Le dragon légendaire s'invite dans l'univers Fluxus. Giclée sur papier 300g, 75x50 cm. Édition limitée /30 signée et numérotée à la main.",
    images: ['/images/dbz-dragon-ball-z.jpg', '/images/dbz-dragon-ball-z-2.jpg', '/images/dbz-dragon-ball-z-3.jpg', '/images/dbz-dragon-ball-z-4.jpg', '/images/dbz-dragon-ball-z-5.jpg', '/images/dbz-dragon-ball-z-6.jpg', '/images/dbz-dragon-ball-z-7.jpg', '/images/dbz-dragon-ball-z-8.jpg', '/images/dbz-dragon-ball-z-9.jpg', '/images/dbz-dragon-ball-z-10.jpg', '/images/dbz-dragon-ball-z-11.jpg'],
  }
,
  {
    id: 'vic-done-kind', slug: 'vic-done-kind',
    title: 'VIC Done Kind', artist: 'blach', year: 2021, serie: 'ALT0174',
    technique: 'Giclée sur Aluminium Dibond finition brillante', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250, priceFramed: 0,
    available: true, stock: 10, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'done', 'kind', 'VIC', 'graffiti', 'fluxus'],
    description: "VIC Done Kind — New York vandalisé par les maîtres du graffiti Done et Kind. giclée. Édition limitée /30 signée et numérotée. Certificat d'authenticité BLACH®.",
    images: ['/images/vic-done-kind.jpg', '/images/vic-done-kind-2.jpg', '/images/vic-done-kind-3.jpg', '/images/vic-done-kind-4.jpg', '/images/vic-done-kind-5.jpg', '/images/vic-done-kind-6.jpg', '/images/vic-done-kind-7.jpg', '/images/vic-done-kind-8.jpg'],
  }

]

export function getArtwork(slug) { return ARTWORKS.find(a => a.slug === slug) || null }
export function getFeatured() { return ARTWORKS.filter(a => a.featured) }
export function getNew() { return ARTWORKS.filter(a => a.new) }
export function getArtworksByCategory(cat) { return ARTWORKS.filter(a => a.category === cat) }
export function getArtworksByArtist(id) { return ARTWORKS.filter(a => a.artist === id || a.artist2 === id) }
export function searchArtworks({ query='', artist='', category='', maxPrice=9999, available=false, sort='featured' }={}) {
  let r = [...ARTWORKS]
  if (query) { const q=query.toLowerCase(); r=r.filter(a=>a.title.toLowerCase().includes(q)||a.tags?.some(t=>t.includes(q))) }
  if (artist) r=r.filter(a=>a.artist===artist||a.artist2===artist)
  if (category) r=r.filter(a=>a.category===category)
  if (available) r=r.filter(a=>a.available)
  r=r.filter(a=>a.price<=maxPrice)
  if (sort==='price-asc') r.sort((a,b)=>a.price-b.price)
  else if (sort==='price-desc') r.sort((a,b)=>b.price-a.price)
  else if (sort==='new') r.sort((a,b)=>(b.new?1:0)-(a.new?1:0))
  else r.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0))
  return r
}
