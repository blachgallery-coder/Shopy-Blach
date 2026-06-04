import { useState, useMemo } from 'react'
import Layout from '../components/Layout'
import ArtworkCard from '../components/ArtworkCard'
import { ARTWORKS, CATEGORIES, ARTISTS } from '../lib/catalog'

export default function Shop({ initialCategory }) {
  const [search, setSearch] = useState('')
  const [filterArtist, setFilterArtist] = useState('')
  const [filterCategory, setFilterCategory] = useState(initialCategory || '')
  const [filterPriceMax, setFilterPriceMax] = useState(2000)
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    let results = [...ARTWORKS]
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.tags?.some(t => t.includes(q)) ||
        ARTISTS[a.artist]?.alias.toLowerCase().includes(q)
      )
    }
    if (filterArtist) results = results.filter(a => a.artist === filterArtist)
    if (filterCategory) results = results.filter(a => a.category === filterCategory)
    if (filterAvailable) results = results.filter(a => a.available)
    results = results.filter(a => a.price <= filterPriceMax)
    if (sort === 'price-asc') results.sort((a,b) => a.price - b.price)
    else if (sort === 'price-desc') results.sort((a,b) => b.price - a.price)
    else if (sort === 'new') results.sort((a,b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
    else results.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return results
  }, [search, filterArtist, filterCategory, filterPriceMax, filterAvailable, sort])

  return (
    <Layout title="Boutique — BLACH Gallery" description="Toutes les œuvres du collectif BLACH Gallery. Éditions limitées, originaux, sculptures.">
      {/* Header page */}
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(200,146,10,0.15)', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '0.75rem' }}>✦ &nbsp; BLACH Gallery</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f5f0e8', fontWeight: 700 }}>Boutique</h1>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(200,146,10,0.1)', padding: '1.25rem 1.5rem', position: 'sticky', top: 72, zIndex: 20 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.8rem', outline: 'none', height: 38 }} />
          </div>

          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setFilterCategory(filterCategory === c.id ? '' : c.id)}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', height: 38,
                borderColor: filterCategory === c.id ? '#c8920a' : 'rgba(200,146,10,0.2)',
                background: filterCategory === c.id ? 'rgba(200,146,10,0.12)' : 'transparent',
                color: filterCategory === c.id ? '#c8920a' : 'rgba(245,240,232,0.5)',
              }}>
              {c.icon} {c.label}
            </button>
          ))}

          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ height: 38, padding: '0 0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.2)', color: 'rgba(245,240,232,0.6)', fontSize: '0.75rem', outline: 'none', marginLeft: 'auto' }}>
            <option value="featured">En vedette</option>
            <option value="new">Nouveautés</option>
            <option value="price-asc">Prix ↑</option>
            <option value="price-desc">Prix ↓</option>
          </select>

          <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', whiteSpace: 'nowrap' }}>{filtered.length} œuvre{filtered.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Grille */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(245,240,232,0.3)' }}>Aucune œuvre trouvée.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((artwork, i) => <ArtworkCard key={artwork.id} artwork={artwork} delay={i * 60} />)}
          </div>
        )}
      </div>

      <style jsx global>{`select option { background: #1a1a1a; color: #f5f0e8; }`}</style>
    </Layout>
  )
}
