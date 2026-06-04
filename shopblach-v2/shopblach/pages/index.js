import { useState, useMemo } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import ArtworkCard from '../components/ArtworkCard'
import { ARTWORKS, CATEGORIES, ARTISTS } from '../lib/catalog'

export default function Home() {
  const [search, setSearch] = useState('')
  const [filterArtist, setFilterArtist] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState(2000)
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [sort, setSort] = useState('featured')

  const featured = ARTWORKS.filter(a => a.featured).slice(0, 3)

  const filtered = useMemo(() => {
    let results = [...ARTWORKS]
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.tags?.some(t => t.includes(q)) ||
        a.style?.toLowerCase().includes(q) ||
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
    else if (sort === 'featured') results.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return results
  }, [search, filterArtist, filterCategory, filterPriceMax, filterAvailable, sort])

  return (
    <Layout>
      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0a0a0a' }}>
        {/* Background decor */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,146,10,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(200,146,10,0.04) 80px),
                            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(200,146,10,0.04) 80px)`,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', textAlign: 'center', padding: '2rem 1.5rem', maxWidth: 900 }}>
          {/* Overline */}
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '1.5rem', fontWeight: 600 }}>
            ✦ &nbsp; Collectif d&apos;Artistes Lyonnais &nbsp; ✦
          </p>

          {/* Title */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.05, marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 700, color: '#f5f0e8', letterSpacing: '-0.03em' }}>BLACH</span>
            <span style={{ display: 'block', fontSize: 'clamp(1rem, 3vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.05em' }}>Gallery Shop</span>
          </h1>

          {/* Separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, transparent, #c8920a)' }} />
            <span style={{ color: '#c8920a', fontSize: '0.8rem' }}>✦</span>
            <div style={{ height: 1, width: 60, background: 'linear-gradient(90deg, #c8920a, transparent)' }} />
          </div>

          <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1.05rem)', color: 'rgba(245,240,232,0.55)', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.7, letterSpacing: '0.02em' }}>
            Éditions limitées, originaux et sculptures.<br/>Œuvres signées, numérotées, certifiées.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#catalogue" className="btn-gold" style={{ textDecoration: 'none' }}>Explorer le catalogue</a>
            <Link href="/artistes" className="btn-outline" style={{ textDecoration: 'none' }}>Les Artistes</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.4 }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8920a' }}>Défiler</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #c8920a, transparent)', animation: 'pulse 2s infinite' }} />
        </div>
      </section>

      {/* ══════════════════════════ MOTEUR DE RECHERCHE ══════════════════════════ */}
      <section id="catalogue" style={{ background: '#0f0f0f', borderTop: '1px solid rgba(200,146,10,0.15)', borderBottom: '1px solid rgba(200,146,10,0.15)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '1rem', textAlign: 'center' }}>✦ &nbsp; Moteur de recherche &nbsp; ✦</p>

          {/* Ligne 1 — Search + Sort */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(200,146,10,0.5)" strokeWidth="2" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher une œuvre, un style, un artiste..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', height: 44, background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.875rem', outline: 'none' }}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ height: 44, padding: '0 1rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.75rem', letterSpacing: '0.05em', outline: 'none', minWidth: 160 }}>
              <option value="featured">En vedette</option>
              <option value="new">Nouveautés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          {/* Ligne 2 — Filtres */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={filterArtist} onChange={e => setFilterArtist(e.target.value)}
              style={{ height: 36, padding: '0 0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.2)', color: filterArtist ? '#c8920a' : 'rgba(245,240,232,0.4)', fontSize: '0.75rem', outline: 'none' }}>
              <option value="">Tous les artistes</option>
              {Object.values(ARTISTS).map(a => <option key={a.id} value={a.id}>{a.alias}</option>)}
            </select>

            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              style={{ height: 36, padding: '0 0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.2)', color: filterCategory ? '#c8920a' : 'rgba(245,240,232,0.4)', fontSize: '0.75rem', outline: 'none' }}>
              <option value="">Toutes catégories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', whiteSpace: 'nowrap' }}>Max {filterPriceMax} €</span>
              <input type="range" min="50" max="2000" step="50" value={filterPriceMax}
                onChange={e => setFilterPriceMax(Number(e.target.value))}
                style={{ accentColor: '#c8920a', width: 120 }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)' }}>
              <input type="checkbox" checked={filterAvailable} onChange={e => setFilterAvailable(e.target.checked)} style={{ accentColor: '#c8920a' }} />
              Disponibles
            </label>

            {(search || filterArtist || filterCategory || filterAvailable || filterPriceMax < 2000) && (
              <button onClick={() => { setSearch(''); setFilterArtist(''); setFilterCategory(''); setFilterAvailable(false); setFilterPriceMax(2000) }}
                style={{ fontSize: '0.7rem', color: '#c8920a', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', textDecoration: 'underline' }}>
                Réinitialiser
              </button>
            )}

            <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: 'auto' }}>
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CATALOGUE ══════════════════════════ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'rgba(245,240,232,0.3)', fontSize: '1rem' }}>Aucune œuvre ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((artwork, i) => (
              <ArtworkCard key={artwork.id} artwork={artwork} delay={i * 80} />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════ BANDEAU COLLECTIF ══════════════════════════ */}
      <section style={{ background: '#0f0f0f', borderTop: '1px solid rgba(200,146,10,0.15)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '1.5rem' }}>✦ &nbsp; Le Collectif &nbsp; ✦</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#f5f0e8', lineHeight: 1.2, marginBottom: '1.5rem', fontStyle: 'italic' }}>
            "L'art urbain lyonnais<br/>dans sa plus belle expression"
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.8, marginBottom: '2rem' }}>
            BLACH Gallery rassemble des artistes lyonnais aux univers complémentaires — street art, graffiti, sculpture, Fluxus. Chaque œuvre est produite en édition strictement limitée, numérotée et signée.
          </p>
          <Link href="/artistes" className="btn-outline" style={{ textDecoration: 'none' }}>Découvrir les artistes</Link>
        </div>
      </section>

      <style jsx global>{`
        select option { background: #1a1a1a; color: #f5f0e8; }
        input[type=text]::placeholder { color: rgba(245,240,232,0.25); }
      `}</style>
    </Layout>
  )
}
