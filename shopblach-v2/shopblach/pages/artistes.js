import Layout from '../components/Layout'
import Link from 'next/link'
import { ARTISTS, ARTWORKS } from '../lib/catalog'

export default function Artistes() {
  return (
    <Layout title="Les Artistes — BLACH Gallery" description="Découvrez les artistes du collectif Blach Gallery : BLACH®, Carotte et bien d'autres.">
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(200,146,10,0.15)', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '0.75rem' }}>✦ &nbsp; Le Collectif</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f5f0e8', fontWeight: 700 }}>Les Artistes</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {Object.values(ARTISTS).map(artist => {
            const works = ARTWORKS.filter(a => a.artist === artist.id || a.artist2 === artist.id)
            return (
              <div key={artist.id} style={{ background: '#0f0f0f', border: '1px solid rgba(200,146,10,0.15)', padding: '2rem', transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c8920a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(200,146,10,0.15)'}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#c8920a', fontWeight: 700 }}>
                  {artist.alias[0]}
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#f5f0e8', marginBottom: '0.25rem' }}>{artist.alias}</h2>
                <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)', marginBottom: '1rem', letterSpacing: '0.05em' }}>{artist.name}</p>
                <div className="gold-line" style={{ marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.55)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{artist.bio}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>{works.length} œuvre{works.length > 1 ? 's' : ''} disponible{works.length > 1 ? 's' : ''}</span>
                  <Link href={`/shop?artist=${artist.id}`} className="btn-outline" style={{ textDecoration: 'none', padding: '0.4rem 0.9rem', fontSize: '0.65rem' }}>Voir les œuvres</Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Autres artistes du collectif */}
        <div style={{ marginTop: '4rem', padding: '3rem', background: '#0f0f0f', border: '1px solid rgba(200,146,10,0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '1rem' }}>✦ &nbsp; Également dans le collectif</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['ART HM', 'Bonté', 'Séverine', 'Rémi Porcar', 'Michel Donier', 'Alain Méraud', 'Jacques Berger'].map(name => (
              <span key={name} style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.4)', fontFamily: "'Playfair Display', serif" }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
