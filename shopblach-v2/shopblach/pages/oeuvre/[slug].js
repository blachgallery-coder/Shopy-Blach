import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { ARTWORKS, ARTISTS, getArtwork } from '../../lib/catalog'
import useCart from '../../lib/cart'

export async function getStaticPaths() {
  return {
    paths: ARTWORKS.map(a => ({ params: { slug: a.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const artwork = getArtwork(params.slug)
  if (!artwork) return { notFound: true }
  return { props: { artwork } }
}

export default function ArtworkPage({ artwork }) {
  const { addItem, items } = useCart()
  const inCart = items.some(i => i.id === artwork.id)
  const artist = ARTISTS[artwork.artist]
  const [imageIdx, setImageIdx] = useState(0)

  // Schéma JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    creator: { '@type': 'Person', name: artist?.name || artwork.artist },
    artMedium: artwork.technique,
    artworkSurface: artwork.support,
    width: `${artwork.dimensions.width} cm`,
    height: `${artwork.dimensions.height} cm`,
    offers: {
      '@type': 'Offer',
      price: artwork.price,
      priceCurrency: 'EUR',
      availability: artwork.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    }
  }

  return (
    <Layout
      title={`${artwork.title} — BLACH Gallery`}
      description={artwork.description}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2.5rem', fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)' }}>
          <Link href="/" style={{ color: 'rgba(245,240,232,0.35)', textDecoration: 'none' }}>Accueil</Link>
          <span>/</span>
          <Link href="/shop" style={{ color: 'rgba(245,240,232,0.35)', textDecoration: 'none' }}>Boutique</Link>
          <span>/</span>
          <span style={{ color: '#c8920a' }}>{artwork.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          {/* ── Galerie d'images ── */}
          <div>
            {/* Image principale */}
            <div style={{ position: 'relative', background: '#111', border: '1px solid rgba(200,146,10,0.2)', marginBottom: '0.75rem', overflow: 'hidden' }}>
              <div style={{ paddingTop: '120%', position: 'relative' }}>
                {artwork.images?.[imageIdx] ? (
                  <Image src={artwork.images[imageIdx]} alt={artwork.title} fill style={{ objectFit: 'contain', padding: '1rem' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', opacity: 0.08 }}>✦</div>
                )}
              </div>
            </div>

            {/* Miniatures */}
            {artwork.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {artwork.images.map((img, idx) => (
                  <button key={idx} onClick={() => setImageIdx(idx)}
                    style={{ width: 64, height: 64, border: `1px solid ${idx === imageIdx ? '#c8920a' : 'rgba(200,146,10,0.2)'}`, background: '#111', cursor: 'pointer', overflow: 'hidden', position: 'relative', padding: 0 }}>
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Infos produit ── */}
          <div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {artwork.new && <span style={{ background: '#c8920a', color: '#0a0a0a', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', fontWeight: 700 }}>Nouveau</span>}
              <span className="edition-badge">Éd. limitée /{artwork.edition}</span>
              <span className="edition-badge">Signé</span>
              {artwork.available && <span className="edition-badge" style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}>Disponible</span>}
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#f5f0e8', lineHeight: 1.1, marginBottom: '0.5rem', fontWeight: 700 }}>{artwork.title}</h1>

            <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.4)', marginBottom: '1.5rem', letterSpacing: '0.03em' }}>
              par <span style={{ color: '#c8920a' }}>{artist?.alias || artwork.artist}</span> · {artwork.year}
            </p>

            {/* Prix */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#f5f0e8', fontWeight: 700 }}>{artwork.price}</span>
              <span style={{ fontSize: '1.2rem', color: 'rgba(245,240,232,0.5)' }}>€</span>
              {artwork.stock && artwork.stock <= 5 && (
                <span style={{ fontSize: '0.75rem', color: '#ef3340', marginLeft: '0.5rem' }}>({artwork.stock} restantes)</span>
              )}
            </div>

            <div className="gold-line" style={{ margin: '1.5rem 0' }} />

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                ['Technique', artwork.technique],
                ['Support', artwork.support],
                ['Format', `${artwork.dimensions.width} × ${artwork.dimensions.height} cm`],
                ['Édition', `/${artwork.edition} exemplaires`],
                ['Année', artwork.year],
                ['Style', artwork.style],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '0.2rem' }}>{label}</p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.75)' }}>{value}</p>
                </div>
              ))}
            </div>

            <div className="gold-line" style={{ margin: '1.5rem 0' }} />

            {/* Description */}
            <p style={{ fontSize: '0.9rem', color: 'rgba(245,240,232,0.6)', lineHeight: 1.8, marginBottom: '2rem' }}>{artwork.description}</p>

            {/* CTA */}
            <button onClick={() => artwork.available && !inCart && addItem(artwork)}
              disabled={!artwork.available || inCart}
              className="btn-gold"
              style={{ width: '100%', padding: '1rem', fontSize: '0.8rem', opacity: (!artwork.available || inCart) ? 0.5 : 1, cursor: (!artwork.available || inCart) ? 'not-allowed' : 'pointer', marginBottom: '0.75rem' }}>
              {inCart ? '✓ Dans le panier' : !artwork.available ? 'Épuisé' : 'Ajouter au panier'}
            </button>

            <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.25)', textAlign: 'center', letterSpacing: '0.05em' }}>
              🔒 Paiement sécurisé · Livraison soignée · Retours 30 jours
            </p>

            {/* Whatsapp */}
            <a href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20suis%20intéressé%20par%20l%27œuvre%20" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Question ? Contactez Pascal sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}
