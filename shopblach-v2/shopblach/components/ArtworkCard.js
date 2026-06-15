import Link from 'next/link'
import Image from 'next/image'
import useCart from '../lib/cart'
import { ARTISTS } from '../lib/catalog'

export default function ArtworkCard({ artwork, delay = 0 }) {
  const { addItem, items } = useCart()
  const inCart = items.some(i => i.id === artwork.id)
  const artist = ARTISTS[artwork.artist]

  return (
    <div className="artwork-card" style={{ animationDelay: `${delay}ms`, animation: 'fadeUp 0.6s ease forwards', opacity: 0 }}>
      {/* Image */}
      <Link href={`/oeuvre/${artwork.slug}`} style={{ display: 'block', position: 'relative', paddingTop: '130%', overflow: 'hidden', background: '#111' }}>
        {artwork.images?.[0] ? (
          <Image src={artwork.images[0]} alt={artwork.title} fill style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            className="artwork-img" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.1 }}>✦</div>
        )}
        {/* Overlay on hover */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s' }} className="card-overlay" />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {artwork.new && (
            <span style={{ background: '#c8920a', color: '#0a0a0a', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', fontWeight: 700 }}>Nouveau</span>
          )}
          {artwork.stock <= 5 && artwork.stock > 0 && (
            <span style={{ background: 'rgba(230,57,70,0.9)', color: '#fff', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', fontWeight: 600 }}>Dernières pièces</span>
          )}
          {!artwork.available && (
            <span style={{ background: 'rgba(10,10,10,0.8)', color: 'rgba(245,240,232,0.5)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', border: '1px solid rgba(245,240,232,0.2)' }}>Épuisé</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Link href={`/oeuvre/${artwork.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#f5f0e8', lineHeight: 1.3, fontWeight: 600 }}>{artwork.title}</h3>
          </Link>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#c8920a', fontWeight: 700, whiteSpace: 'nowrap' }}>{artwork.price} €</span>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
          {artist?.alias || artwork.artist} · {artwork.year}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="edition-badge">Éd. /{artwork.edition}</span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>
            {artwork.dimensions?.width}×{artwork.dimensions?.height} cm
          </span>
        </div>

        <div className="gold-line" style={{ marginBottom: '0.75rem' }} />

        <button
          onClick={() => artwork.available && !inCart && addItem(artwork)}
          disabled={!artwork.available || inCart}
          className="btn-gold"
          style={{
            width: '100%',
            opacity: (!artwork.available || inCart) ? 0.5 : 1,
            cursor: (!artwork.available || inCart) ? 'not-allowed' : 'pointer',
          }}
        >
          {inCart ? '✓ Dans le panier' : !artwork.available ? 'Épuisé' : 'Ajouter au panier'}
        </button>
      </div>

      <style jsx>{`
        .artwork-card:hover .artwork-img { transform: scale(1.05); }
        .artwork-card:hover .card-overlay { opacity: 1; }
      `}</style>
    </div>
  )
}
