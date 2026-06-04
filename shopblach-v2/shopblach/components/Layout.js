import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import useCart from '../lib/cart'
import CartDrawer from './CartDrawer'

export default function Layout({ children, title = 'BLACH Gallery — Éditions Limitées', description = 'Boutique officielle du collectif d\'Artistes Lyonnais Blach Gallery' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, toggleCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Navigation ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(200,146,10,0.15)' : '1px solid transparent',
      }}>
        <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#c8920a' }}>BLACH<span style={{ color: '#f5f0e8' }}>®</span></span>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)', marginTop: 2 }}>Gallery Shop</span>
            </div>
          </Link>

          {/* Nav links — desktop */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden md:flex">
            {[
              { href: '/shop', label: 'Boutique' },
              { href: '/shop?category=editions-limitees', label: 'Éditions' },
              { href: '/artistes', label: 'Artistes' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(245,240,232,0.7)', textDecoration: 'none', fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#c8920a'}
              onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.7)'}
              >{label}</Link>
            ))}
          </div>

          {/* Cart + menu */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={toggleCart} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#f5f0e8',
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem',
              position: 'relative',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2, width: 16, height: 16,
                  borderRadius: '50%', background: '#c8920a', color: '#0a0a0a',
                  fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{count}</span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f5f0e8', display: 'flex', padding: '0.5rem' }} className="md:hidden">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(10,10,10,0.98)', borderTop: '1px solid rgba(200,146,10,0.15)', padding: '1.5rem' }}>
            {[
              { href: '/shop', label: 'Boutique' },
              { href: '/shop?category=editions-limitees', label: 'Éditions Limitées' },
              { href: '/artistes', label: 'Artistes' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '0.75rem 0', fontSize: '0.875rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(245,240,232,0.7)', textDecoration: 'none',
                borderBottom: '1px solid rgba(200,146,10,0.1)'
              }}>{label}</Link>
            ))}
          </div>
        )}
      </header>

      <main style={{ paddingTop: 72 }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(200,146,10,0.15)', padding: '4rem 1.5rem 2rem', marginTop: '6rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            {/* Brand */}
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#c8920a', marginBottom: '0.75rem' }}>BLACH<span style={{ color: '#f5f0e8' }}>®</span></div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                du collectif d&apos;Artistes<br/>Lyonnais Blach Gallery
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="https://www.instagram.com/blachgallery" target="_blank" rel="noreferrer" style={{ color: 'rgba(245,240,232,0.4)', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = '#c8920a'} onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.4)'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
              </div>
            </div>
            {/* Liens */}
            {[
              { title: 'Boutique', links: [['Éditions Limitées', '/shop?category=editions-limitees'], ['Originaux', '/shop?category=originaux'], ['Sculptures', '/shop?category=sculptures'], ['Nouveautés', '/shop?sort=new']] },
              { title: 'Info', links: [['Artistes', '/artistes'], ['À propos', '/a-propos'], ['Contact', '/contact'], ['FAQ', '/faq']] },
              { title: 'Légal', links: [['Livraison', '/livraison'], ['Retours — 30 jours', '/retours'], ['CGV', '/cgv'], ['Mentions légales', '/mentions-legales']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '1.25rem', fontWeight: 600 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none' }}>
                  {col.links.map(([label, href]) => (
                    <li key={href} style={{ marginBottom: '0.6rem' }}>
                      <Link href={href} style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#f5f0e8'} onMouseLeave={e => e.target.style.color = 'rgba(245,240,232,0.5)'}
                      >{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="gold-line" style={{ margin: '2rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', letterSpacing: '0.05em' }}>
              © {new Date().getFullYear()} BLACH Gallery — Lyon, France. Tous droits réservés.
            </p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>
              Paiement sécurisé · Stripe · PayPal
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </>
  )
}
