import { useState } from 'react'
import Layout from '../components/Layout'
import useCart from '../lib/cart'
import Image from 'next/image'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', adresse: '', ville: '', cp: '', pays: 'France' })
  const [step, setStep] = useState(1) // 1=panier, 2=livraison, 3=paiement, 4=confirmation
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Intégrer Stripe/PayPal ici
    await new Promise(r => setTimeout(r, 1500))
    setStep(4)
    clearCart()
    setLoading(false)
  }

  return (
    <Layout title="Commande — BLACH Gallery">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#f5f0e8', marginBottom: '0.5rem' }}>Commande</h1>

        {/* Steps */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid rgba(200,146,10,0.15)', paddingBottom: '1.5rem' }}>
          {[['1', 'Panier'], ['2', 'Livraison'], ['3', 'Paiement']].map(([n, label]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: Number(n) <= step ? '#c8920a' : 'rgba(200,146,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: Number(n) <= step ? '#0a0a0a' : 'rgba(200,146,10,0.5)' }}>{n}</div>
              <span style={{ fontSize: '0.75rem', color: Number(n) <= step ? '#c8920a' : 'rgba(245,240,232,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
            </div>
          ))}
        </div>

        {step === 4 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✦</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#c8920a', marginBottom: '1rem' }}>Commande confirmée</h2>
            <p style={{ color: 'rgba(245,240,232,0.6)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Merci pour votre acquisition. Un email de confirmation vous a été envoyé à <strong style={{ color: '#f5f0e8' }}>{form.email}</strong>.
            </p>
            <a href="/" className="btn-gold" style={{ textDecoration: 'none' }}>Retour à la galerie</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'start' }}>
            {/* Formulaire */}
            <div>
              {step === 1 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#f5f0e8', marginBottom: '1.5rem' }}>Votre sélection</h2>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(200,146,10,0.1)' }}>
                      <div style={{ width: 80, height: 80, background: '#111', border: '1px solid rgba(200,146,10,0.2)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                        {item.images?.[0] ? <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} /> : null}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: '#f5f0e8' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.25rem' }}>Éd. /{item.edition} · Signé</p>
                      </div>
                      <span style={{ color: '#c8920a', fontWeight: 700, fontSize: '1.1rem' }}>{item.price} €</span>
                    </div>
                  ))}
                  <button onClick={() => setStep(2)} className="btn-gold" style={{ marginTop: '2rem', width: '100%', padding: '1rem' }} disabled={items.length === 0}>
                    Continuer →
                  </button>
                </div>
              )}

              {step >= 2 && step < 4 && (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#f5f0e8', marginBottom: '1.5rem' }}>Adresse de livraison</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    {[['prenom', 'Prénom'], ['nom', 'Nom']].map(([name, label]) => (
                      <div key={name}>
                        <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8920a', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange} required
                          style={{ width: '100%', padding: '0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.875rem', outline: 'none' }} />
                      </div>
                    ))}
                  </div>
                  {[['email', 'Email', 'email'], ['adresse', 'Adresse', 'text'], ['ville', 'Ville', 'text'], ['cp', 'Code postal', 'text']].map(([name, label, type]) => (
                    <div key={name} style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8920a', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                      <input name={name} type={type} value={form[name]} onChange={handleChange} required
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.875rem', outline: 'none' }} />
                    </div>
                  ))}
                  <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Traitement...' : 'Confirmer la commande →'}
                  </button>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.25)', textAlign: 'center', marginTop: '1rem' }}>
                    Paiement sécurisé par Stripe. Retours acceptés sous 30 jours.
                  </p>
                </form>
              )}
            </div>

            {/* Récap commande */}
            <div style={{ width: 280, background: '#0f0f0f', border: '1px solid rgba(200,146,10,0.15)', padding: '1.5rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '1rem' }}>Récapitulatif</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)' }}>{items.length} œuvre{items.length > 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.8rem', color: '#f5f0e8' }}>{total} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)' }}>Livraison</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)' }}>Calculée</span>
              </div>
              <div className="gold-line" style={{ margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#f5f0e8', fontWeight: 700 }}>{total} €</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`input::placeholder { color: rgba(245,240,232,0.2); }`}</style>
    </Layout>
  )
}
