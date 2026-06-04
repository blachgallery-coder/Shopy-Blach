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
    id: 'new-york-bored-ape-fluo', slug: 'new-york-bored-ape-fluo', etsy_id: '1513649542',
    title: 'New York Bored Ape Fluo', artist: 'blach', year: 2023, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250,
    available: true, stock: 20, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'bored ape', 'fluo', 'VIC'],
    description: "VIC New York Bored Ape Fluo — Giclée sur Dibond aluminium brillant 60×40 cm. Édition /30 signée et numérotée. Certificat d'authenticité.",
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'new-york-goldorak-albator', slug: 'new-york-goldorak-albator', etsy_id: '1513647064',
    title: 'New York Goldorak & Albator', artist: 'blach', year: 2023, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250,
    available: true, stock: 15, category: 'new-york', featured: true, new: false,
    tags: ['new york', 'goldorak', 'albator', 'manga', 'VIC'],
    description: 'New York vandalisé par Goldorak et Albator. VIC series, édition /30 signée.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'new-york-goldoblach-2026-xxl', slug: 'new-york-goldoblach-2026-xxl',
    title: 'New York GoldoBlach 2026 XXL', artist: 'blach', year: 2026,
    technique: 'Sérigraphie', support: 'Papier 300g',
    dimensions: { width: 100, height: 70, unit: 'cm' }, edition: 30, price: 890,
    available: true, stock: 12, category: 'new-york', featured: true, new: true,
    tags: ['new york', 'goldorak', 'XXL', '2026'],
    description: 'Œuvre monumentale 100×70 cm, tirage /30 numérotés et signés.',
    images: ['/images/new-york-goldoblach-2026-xxl/main.jpg'],
  },
  {
    id: 'new-york-simpsons', slug: 'new-york-simpsons', etsy_id: '1656956779',
    title: 'VIC New York Simpsons', artist: 'blach', year: 2024, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250,
    available: true, stock: 20, category: 'new-york', featured: false, new: false,
    tags: ['new york', 'simpsons', 'VIC', 'pop culture'],
    description: 'La famille Simpson envahit New York. Dibond brillant 60×40 cm, édition /30.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'paris-3024', slug: 'paris-3024', etsy_id: '1743683057',
    title: 'Paris 3024', artist: 'blach', year: 2025, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250,
    available: true, stock: 20, category: 'paris', featured: false, new: false,
    tags: ['paris', 'futur', 'VIC', '3024'],
    description: 'Paris projeté en 3024 — univers futuriste et coloré. VIC series /30.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'paris-je-taime', slug: 'paris-je-taime',
    title: "Paris Je T'Aime", artist: 'blach', year: 2023,
    technique: 'Impression offset', support: 'Toile 500g',
    dimensions: { width: 75, height: 50, unit: 'cm' }, edition: 30, price: 250,
    available: true, stock: 15, category: 'paris', featured: true, new: false,
    tags: ['paris', 'amour', 'toile'],
    description: "Paris revisitée par BLACH® — déclaration d'amour à la capitale. Toile 500g 75×50 cm, /30.",
    images: ['/images/paris-je-taime/main.jpg'],
  },
  {
    id: 'arc-de-triomphe-libertay', slug: 'arc-de-triomphe-libertay',
    title: 'Arc de Triomphe de la Libertay', artist: 'blach', year: 2022,
    technique: 'Giclée sur toile montée sur châssis', support: 'Toile sur châssis bois',
    dimensions: { width: 60, height: 60, depth: 2, unit: 'cm' }, edition: 30, price: 280,
    available: true, stock: 10, category: 'paris', featured: false, new: false,
    tags: ['paris', 'arc de triomphe', 'liberté'],
    description: "Arc de Triomphe revisité. Toile 60×60×2 cm. Photo : Bastien Nvs. Édition /30.",
    images: ['/images/arc-de-triomphe/main.jpg'],
  },
  {
    id: 'lyon-1fluence-xl', slug: 'lyon-1fluence-xl', etsy_id: '1676156103',
    title: "Lyon 1'Fluence XL", artist: 'blach', year: 2023,
    technique: 'Sérigraphie', support: 'Papier 300g',
    dimensions: { width: 75, height: 50, unit: 'cm' }, edition: 15, price: 270,
    available: true, stock: 7, category: 'france', featured: false, new: false,
    tags: ['lyon', 'typo', 'sérigraphie', 'influence'],
    description: "Lyon 1'Fluence — tirage limité /15 numérotés et signés.",
    images: ['/images/lyon-1fluence-xl/main.jpg'],
  },
  {
    id: 'lyon-feat-carotte-xl', slug: 'lyon-feat-carotte-xl',
    title: 'Lyon Feat Carotte XL', artist: 'blach', artist2: 'carotte', year: 2024,
    technique: 'Lithographie offset', support: 'Papier 250g',
    dimensions: { width: 75, height: 50, unit: 'cm' }, edition: 30, price: 180,
    available: true, stock: 18, category: 'france', featured: true, new: false,
    tags: ['lyon', 'carotte', 'collaboration'],
    description: 'Collaboration BLACH® × Carotte autour de Lyon. Édition /30 signée.',
    images: ['/images/lyon-feat-carotte-xl/main.jpg'],
  },
  {
    id: 'lyon-doisneau-feat-carotte', slug: 'lyon-doisneau-feat-carotte',
    title: 'Lyon Doisneau Feat Carotte', artist: 'blach', artist2: 'carotte', year: 2024,
    technique: 'Lithographie offset', support: 'Toile 500g',
    dimensions: { width: 48, height: 48, unit: 'cm' }, edition: 30, price: 180,
    available: true, stock: 22, category: 'france', featured: false, new: false,
    tags: ['lyon', 'doisneau', 'carotte'],
    description: "Hommage à Doisneau revisité par BLACH® et Carotte. Toile 48×48 cm, /30.",
    images: ['/images/lyon-doisneau-feat-carotte/main.jpg'],
  },
  {
    id: 'la-carotte-street-cap-lyon', slug: 'la-carotte-street-cap-lyon', etsy_id: '1612643500',
    title: 'La Carotte Street Cap Lyon', artist: 'carotte', year: 2024,
    technique: 'Impression offset sur toile', support: 'Toile 500g',
    dimensions: { width: 50, height: 50, unit: 'cm' }, edition: 30, price: 150,
    available: true, stock: 20, category: 'france', featured: false, new: false,
    tags: ['lyon', 'carotte', 'street'],
    description: 'La Carotte Street Cap Lyon — œuvre colorée de Carotte. Format 50×50 cm, /30.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'berliner-dom', slug: 'berliner-dom', etsy_id: '1642745594',
    title: 'Berliner Dom', artist: 'blach', year: 2024, serie: 'VIC',
    technique: 'Giclée sur toile montée sur châssis', support: 'Toile sur châssis bois',
    dimensions: { width: 40, height: 40, depth: 2, unit: 'cm' }, edition: 30, price: 180,
    available: true, stock: 20, category: 'europe', featured: false, new: false,
    tags: ['berlin', 'allemagne', 'dom', 'VIC'],
    description: 'Berliner Dom vandalisé par BLACH®. Toile 40×40×2 cm, /30 signée.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'vic-trail-playboy-vitraux', slug: 'vic-trail-playboy-vitraux', etsy_id: '4357085016',
    title: 'VIC TRAIL & Playboy — Vitraux', artist: 'blach', year: 2025, serie: 'VIC',
    technique: 'Giclée sur Dibond aluminium brillant', support: 'Dibond 0.3 cm',
    dimensions: { width: 60, height: 40, unit: 'cm' }, edition: 30, price: 250,
    available: true, stock: 20, category: 'europe', featured: false, new: true,
    tags: ['vitraux', 'playboy', 'VIC', 'humour'],
    description: "Vitraux et Playboy par BLACH® — humour irrévérencieux dans la chapelle de Graffiti Céleste. /30.",
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'taj-mahal-vandal', slug: 'taj-mahal-vandal', etsy_id: '1656187763',
    title: 'Taj Mahal Vandal', artist: 'blach', year: 2024, serie: 'VIC',
    technique: 'Giclée sur toile montée sur châssis', support: 'Toile sur châssis bois',
    dimensions: { width: 40, height: 40, depth: 2, unit: 'cm' }, edition: 30, price: 180,
    available: true, stock: 20, category: 'asia', featured: false, new: false,
    tags: ['taj mahal', 'inde', 'VIC'],
    description: 'Taj Mahal vandalisé par BLACH®. Toile 40×40×2 cm, /30 signée.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'white-cat-origami', slug: 'white-cat-origami', etsy_id: '4331685530',
    title: 'Chat Blanc Origami', artist: 'blach', year: 2025,
    technique: 'Giclée sur papier satiné galerie', support: 'Papier satiné 40×40 cm',
    dimensions: { width: 40, height: 40, unit: 'cm' }, edition: 10, price: 120,
    available: true, stock: 8, category: 'animal-fruit', featured: false, new: true,
    tags: ['chat', 'origami', 'graffiti', 'blanc'],
    description: 'Chat Blanc Origami — origami + graffiti + humour. Ultra-limité /10 sur papier satiné 40×40 cm.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'iceberg-save-the-planet', slug: 'iceberg-save-the-planet', etsy_id: '1625698061',
    title: 'Iceberg — Save the Planet', artist: 'blach', year: 2023, serie: 'Iceberg',
    technique: 'Impression numérique', support: 'Papier / Toile',
    dimensions: { width: 50, height: 70, unit: 'cm' }, edition: null, price: 60,
    available: true, stock: 99, category: 'iceberg', featured: false, new: false,
    tags: ['iceberg', 'écologie', 'planète'],
    description: "Iceberg Save the Planet — message écologique fort. Édition ouverte.",
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'graffiti-benji', slug: 'graffiti-benji', etsy_id: '1743803023',
    title: 'Graffiti BENJI', artist: 'blach', year: 2025,
    technique: 'Impression numérique sur papier', support: 'Papier photo',
    dimensions: { width: 30, height: 21, unit: 'cm' }, edition: null, price: 35,
    available: true, stock: 99, category: 'graffiti-name', featured: false, new: false,
    tags: ['graffiti', 'prénom', 'lettering', 'personnalisé'],
    description: 'Prénom personnalisé en style graffiti par Max le Tagueur / BLACH®. Idéal cadeau.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'annecy', slug: 'annecy', etsy_id: '1743676431',
    title: 'Annecy', artist: 'blach', year: 2025, serie: 'VIC',
    technique: 'Giclée sur toile montée sur châssis', support: 'Toile sur châssis bois',
    dimensions: { width: 40, height: 40, depth: 2, unit: 'cm' }, edition: 30, price: 180,
    available: true, stock: 20, category: 'france', featured: false, new: false,
    tags: ['annecy', 'france', 'lac', 'VIC'],
    description: 'Annecy vandalisée par BLACH®. Toile 40×40×2 cm, /30 signée.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
  {
    id: 'new-york-rainbow-xl', slug: 'new-york-rainbow-xl', etsy_id: '4332558321',
    title: 'New York Rainbow XL', artist: 'blach', year: 2023, serie: 'Fluxus 2.0',
    technique: 'Impression offset sur toile', support: 'Toile canvas 500g',
    dimensions: { width: 80, height: 80, unit: 'cm' }, edition: 30, price: 280,
    available: true, stock: 18, category: 'new-york', featured: false, new: true,
    tags: ['new york', 'rainbow', 'XL', 'fluxus'],
    description: 'New York Rainbow XL — 80×80 cm carré, plein de détails joueurs et références pop. Fluxus 2.0, /30.',
    images: ['https://i.etsystatic.com/41442245/r/il/fb64a2/5158235741/il_794xN.5158235741_ss0c.jpg'],
  },
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
