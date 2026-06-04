import { useState } from 'react'
import Layout from '../components/Layout'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSent(true)
  }

  return (
    <Layout title="Contact — BLACH Gallery">
      <div style={{ background: '#0f0f0f', borderBottom: '1px solid rgba(200,146,10,0.15)', padding: '4rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '0.75rem' }}>✦ &nbsp; Nous contacter</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f5f0e8', fontWeight: 700 }}>Contact</h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '3rem', color: '#c8920a', marginBottom: '1rem' }}>✦</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#f5f0e8', marginBottom: '1rem' }}>Message envoyé</h2>
            <p style={{ color: 'rgba(245,240,232,0.5)' }}>Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <form onSubmit={handleSubmit}>
              {[['nom', 'Nom complet', 'text'], ['email', 'Email', 'email'], ['sujet', 'Sujet', 'text']].map(([name, label, type]) => (
                <div key={name} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8920a', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                  <input name={name} type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} required
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.875rem', outline: 'none' }} />
                </div>
              ))}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8920a', display: 'block', marginBottom: '0.4rem' }}>Message</label>
                <textarea name="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(245,240,232,0.04)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%', padding: '1rem' }}>Envoyer →</button>
            </form>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#f5f0e8', marginBottom: '1.5rem' }}>Informations</h3>
              {[
                { icon: '📍', label: 'Localisation', value: 'Lyon, France' },
                { icon: '📧', label: 'Email', value: 'contact@blachgallery.com' },
                { icon: '🌐', label: 'Site', value: 'blachgallery.com' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8920a', marginBottom: '0.2rem' }}>{label}</p>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.6)' }}>{value}</p>
                  </div>
                </div>
              ))}
              <div className="gold-line" style={{ margin: '1.5rem 0' }} />
              <a href="https://wa.me/33XXXXXXXXX" target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', textDecoration: 'none', padding: '0.75rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp — Pascal
              </a>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`input::placeholder, textarea::placeholder { color: rgba(245,240,232,0.2); }`}</style>
    </Layout>
  )
}
