import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useCart from '../lib/cart'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total, count } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(200,146,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#f5f0e8' }}>Panier</h2>
            <p style={{ fontSize: '0.7rem', color: '#c8920a', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{count} {count > 1 ? 'œuvres' : 'œuvre'}</p>
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: '1px solid rgba(245,240,232,0.15)', color: '#f5f0e8', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(200,146,10,0.3)" strokeWidth="1" style={{ marginBottom: '1rem' }}>
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.875rem' }}>Votre panier est vide</p>
              <button onClick={closeCart} className="btn-outline" style={{ marginTop: '1.5rem' }}>Découvrir les œuvres</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(200,146,10,0.1)' }}>
                {/* Image placeholder */}
                <div style={{ width: 80, height: 80, background: '#1a1a1a', border: '1px solid rgba(200,146,10,0.2)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  {item.images?.[0] ? (
                    <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(200,146,10,0.3)', fontSize: '1.5rem' }}>✦</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.875rem', color: '#f5f0e8', fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginTop: 2 }}>Éd. /{item.edition} · Signé</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#c8920a' }}>{item.price} €</span>
                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.3)', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Retirer</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(200,146,10,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#f5f0e8' }}>{total} €</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginBottom: '1rem', lineHeight: 1.5 }}>Livraison calculée à la commande. Retours acceptés sous 30 jours.</p>
            <Link href="/checkout" onClick={closeCart} className="btn-gold" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Procéder au paiement
            </Link>
            <button onClick={closeCart} className="btn-outline" style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '0.75rem' }}>
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  )
}
