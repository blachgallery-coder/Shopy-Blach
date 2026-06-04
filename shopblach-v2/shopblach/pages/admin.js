import { useState } from 'react'
import Layout from '../components/Layout'
import { ARTWORKS, ARTISTS } from '../lib/catalog'

const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PWD || 'blach2026'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pwd, setPwd] = useState('')
  const [tab, setTab] = useState('oeuvres')

  if (!auth) return (
    <Layout title="Admin — BLACH Gallery">
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 320, padding: '2.5rem', background: '#0f0f0f', border: '1px solid rgba(200,146,10,0.2)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#c8920a', marginBottom: '0.5rem' }}>BLACH®</div>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', marginBottom: '2rem' }}>Administration</p>
          <input type="password" placeholder="Mot de passe" value={pwd} onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pwd === ADMIN_PWD && setAuth(true)}
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.875rem', outline: 'none', marginBottom: '1rem', textAlign: 'center' }} />
          <button onClick={() => pwd === ADMIN_PWD ? setAuth(true) : alert('Mot de passe incorrect')}
            className="btn-gold" style={{ width: '100%' }}>Accéder →</button>
        </div>
      </div>
      <style jsx global>{`input::placeholder { color: rgba(245,240,232,0.2); }`}</style>
    </Layout>
  )

  const totalStock = ARTWORKS.reduce((s, a) => s + (a.stock || 0), 0)
  const totalValue = ARTWORKS.reduce((s, a) => s + a.price * (a.stock || 0), 0)

  return (
    <Layout title="Admin — BLACH Gallery">
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(200,146,10,0.15)', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a' }}>✦ Dashboard</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#f5f0e8' }}>Administration</h1>
          </div>
          <button onClick={() => setAuth(false)} className="btn-outline" style={{ fontSize: '0.7rem' }}>Déconnexion</button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Œuvres au catalogue', value: ARTWORKS.length, unit: '' },
            { label: 'Exemplaires en stock', value: totalStock, unit: '' },
            { label: 'Valeur du stock', value: totalValue.toLocaleString('fr-FR'), unit: '€' },
            { label: 'Artistes', value: Object.keys(ARTISTS).length, unit: '' },
          ].map(({ label, value, unit }) => (
            <div key={label} style={{ background: '#0f0f0f', border: '1px solid rgba(200,146,10,0.15)', padding: '1.5rem' }}>
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '0.5rem' }}>{label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#f5f0e8' }}>{value}<span style={{ fontSize: '1rem', color: 'rgba(245,240,232,0.4)', marginLeft: '0.25rem' }}>{unit}</span></p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(200,146,10,0.15)', marginBottom: '2rem' }}>
          {[['oeuvres', 'Œuvres'], ['artistes', 'Artistes']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: '0.75rem 0', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2px solid ${tab === id ? '#c8920a' : 'transparent'}`, color: tab === id ? '#c8920a' : 'rgba(245,240,232,0.4)', transition: 'all 0.2s', marginBottom: -1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Table œuvres */}
        {tab === 'oeuvres' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(200,146,10,0.2)' }}>
                  {['Titre', 'Artiste', 'Prix', 'Éd.', 'Stock', 'Statut'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8920a', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ARTWORKS.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(200,146,10,0.07)', background: i % 2 === 0 ? 'transparent' : 'rgba(245,240,232,0.01)' }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#f5f0e8', fontFamily: "'Playfair Display', serif" }}>{a.title}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'rgba(245,240,232,0.5)' }}>{ARTISTS[a.artist]?.alias}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#c8920a', fontWeight: 700 }}>{a.price} €</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'rgba(245,240,232,0.5)' }}>/{a.edition}</td>
                    <td style={{ padding: '0.75rem 1rem', color: a.stock <= 5 ? '#ef3340' : 'rgba(245,240,232,0.5)' }}>{a.stock ?? '—'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', border: '1px solid', borderColor: a.available ? 'rgba(74,222,128,0.3)' : 'rgba(239,52,64,0.3)', color: a.available ? '#4ade80' : '#ef3340', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {a.available ? 'Disponible' : 'Épuisé'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>
              Pour ajouter ou modifier une œuvre, éditez le fichier <code style={{ color: '#c8920a', background: 'rgba(200,146,10,0.1)', padding: '0 0.3rem' }}>lib/catalog.js</code>
            </p>
          </div>
        )}

        {tab === 'artistes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {Object.values(ARTISTS).map(a => (
              <div key={a.id} style={{ background: '#0f0f0f', border: '1px solid rgba(200,146,10,0.15)', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#c8920a', marginBottom: '0.25rem' }}>{a.alias}</h3>
                <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.75rem' }}>{a.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)' }}>Coeff. prix : {a.coefficient} €/m²</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
