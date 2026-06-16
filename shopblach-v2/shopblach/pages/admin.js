import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'

const PWD = 'blach2026'
const gold = '#c8920a', dark = '#0a0a0a', card = '#111', bdr = 'rgba(200,146,10,0.2)'
const inp = { width:'100%', padding:'0.5rem 0.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(200,146,10,0.2)', color:'#f5f0e8', fontSize:'0.85rem', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }
const btn = (col='gold') => ({ padding:'0.5rem 1rem', background: col==='gold'?gold:'transparent', color: col==='gold'?'#000':'#e55', border: col==='gold'?'none':'1px solid #e55', cursor:'pointer', fontWeight:'bold', fontSize:'0.75rem', letterSpacing:'0.1em' })

async function api(body) {
  const r = await fetch('/api/admin-edit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
  return r.json()
}

async function compressImg(file, maxW=1400, q=0.82) {
  return new Promise(res => {
    const img = new window.Image(); const url = URL.createObjectURL(file)
    img.onload = () => {
      const sc = Math.min(1, maxW/img.width)
      const c = document.createElement('canvas'); c.width = Math.round(img.width*sc); c.height = Math.round(img.height*sc)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      c.toBlob(b => { URL.revokeObjectURL(url); res(b) }, 'image/jpeg', q)
    }; img.src = url
  })
}
async function toB64(blob) {
  return new Promise((res,rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(blob) })
}

function slugify(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pwd, setPwd] = useState('')
  const [artworks, setArtworks] = useState([])
  const [selected, setSelected] = useState(null)   // artwork being edited
  const [log, setLog] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('list')          // 'list' | 'edit' | 'add'
  const fileRef = useRef()

  // Load artworks from catalog API
  async function loadArtworks() {
    try {
      const r = await fetch('/api/admin-edit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'list' }) })
      const d = await r.json()
      if (d.artworks) setArtworks(d.artworks)
    } catch(e) {}
  }

  // Load via import on auth
  useEffect(() => {
    if (auth) {
      fetch('/api/catalog-list').then(r=>r.json()).then(d=>{ if(d.artworks) setArtworks(d.artworks) }).catch(()=>{})
    }
  }, [auth])

  function addLog(msg, ok=true) { setLog(ok ? '✅ '+msg : '❌ '+msg) }

  async function save() {
    setSaving(true); setLog('Sauvegarde...')
    const r = await api({ action:'update', artwork: selected })
    if (r.ok) { addLog('Sauvegardé — commit ' + r.commit); setArtworks(a => a.map(x => x.id===selected.id ? selected : x)) }
    else addLog(r.error, false)
    setSaving(false)
  }

  async function deleteArtwork() {
    if (!confirm('Supprimer "' + selected.title + '" définitivement ?')) return
    setSaving(true); setLog('Suppression...')
    const r = await api({ action:'delete', artwork: selected })
    if (r.ok) { addLog('Supprimé !'); setArtworks(a => a.filter(x => x.id!==selected.id)); setView('list'); setSelected(null) }
    else addLog(r.error, false)
    setSaving(false)
  }

  async function uploadImage(file) {
    setLog('Compression...')
    const blob = await compressImg(file)
    const b64 = await toB64(blob)
    const ext = 'jpg'
    const existing = selected.images || []
    const name = existing.length === 0 ? selected.id + '.' + ext : selected.id + '-' + (existing.length+1) + '.' + ext
    setLog('Upload ' + name + '...')
    const r = await api({ action:'upload-image', artwork: selected, imageData: b64, imageName: name })
    if (r.ok) {
      const newImgs = [...existing, r.url]
      const updated = { ...selected, images: newImgs }
      setSelected(updated)
      setLog('✅ ' + name + ' uploadée — sauvegarde catalog...')
      const r2 = await api({ action:'update', artwork: updated })
      if (r2.ok) addLog('Image ajoutée — commit ' + r2.commit)
      else addLog(r2.error, false)
    } else addLog(r.error, false)
  }

  async function removeImage(url, idx) {
    if (!confirm('Supprimer cette photo ?')) return
    const newImgs = selected.images.filter((_,i) => i !== idx)
    const updated = { ...selected, images: newImgs }
    setSelected(updated)
    setLog('Suppression photo du catalog...')
    const r = await api({ action:'update', artwork: updated })
    if (r.ok) { addLog('Photo supprimée — commit ' + r.commit); setArtworks(a => a.map(x => x.id===selected.id ? updated : x)) }
    else addLog(r.error, false)
  }

  function moveImage(idx, dir) {
    const imgs = [...selected.images]
    const swap = idx + dir
    if (swap < 0 || swap >= imgs.length) return
    ;[imgs[idx], imgs[swap]] = [imgs[swap], imgs[idx]]
    setSelected({ ...selected, images: imgs })
  }

  const setF = (k, v) => setSelected(p => ({ ...p, [k]: v }))
  const setDim = (k, v) => setSelected(p => ({ ...p, dimensions: { ...p.dimensions, [k]: Number(v) } }))

  // ── Auth ──
  if (!auth) return (
    <div style={{ minHeight:'100vh', background:dark, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Head><title>Admin — BLACH Gallery</title></Head>
      <div style={{ width:340, padding:'2.5rem', background:card, border:'1px solid '+bdr, textAlign:'center' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:gold, marginBottom:'0.25rem' }}>BLACH®</div>
        <div style={{ fontSize:'0.65rem', letterSpacing:'0.25em', color:'rgba(245,240,232,0.3)', marginBottom:'2rem', fontFamily:'sans-serif' }}>ADMINISTRATION</div>
        <input type="password" placeholder="Mot de passe" value={pwd} onChange={e=>setPwd(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&pwd===PWD&&setAuth(true)}
          style={{ ...inp, marginBottom:'1rem', textAlign:'center' }}/>
        <button onClick={()=>pwd===PWD?setAuth(true):alert('Incorrect')}
          style={{ width:'100%', padding:'0.75rem', background:gold, color:'#000', border:'none', cursor:'pointer', fontWeight:'bold', letterSpacing:'0.15em', fontFamily:'sans-serif' }}>
          ACCÉDER →
        </button>
      </div>
    </div>
  )

  const filtered = artworks.filter(a => !search || a.title?.toLowerCase().includes(search.toLowerCase()) || a.id?.includes(search.toLowerCase()))

  // ── Edit view ──
  if (view === 'edit' && selected) return (
    <div style={{ minHeight:'100vh', background:dark, color:'#f5f0e8', fontFamily:'sans-serif' }}>
      <Head><title>Éditer — {selected.title}</title></Head>
      {/* Header */}
      <div style={{ background:card, borderBottom:'1px solid '+bdr, padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <button onClick={()=>{setView('list');setSelected(null);setLog('')}} style={{ background:'transparent', border:'none', color:gold, cursor:'pointer', fontSize:'1.2rem' }}>←</button>
          <div style={{ fontFamily:"'Playfair Display',serif", color:gold }}>✦ {selected.title}</div>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
          {log && <span style={{ fontSize:'0.75rem', color: log.startsWith('❌')?'#e55':gold }}>{log}</span>}
          <button onClick={deleteArtwork} disabled={saving} style={{ ...btn('red') }}>🗑 SUPPRIMER</button>
          <button onClick={save} disabled={saving} style={{ ...btn(), opacity: saving?0.6:1 }}>{saving?'⏳':'💾 SAUVEGARDER'}</button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>

        {/* ── Colonne gauche: Photos ── */}
        <div>
          <h3 style={{ color:gold, fontSize:'0.7rem', letterSpacing:'0.2em', marginBottom:'1rem' }}>✦ PHOTOS ({(selected.images||[]).length})</h3>
          
          {/* Upload zone */}
          <div onClick={()=>fileRef.current.click()} style={{ border:'2px dashed '+bdr, padding:'1.5rem', textAlign:'center', cursor:'pointer', marginBottom:'1rem', background:'rgba(200,146,10,0.03)' }}>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e=>{ Array.from(e.target.files).forEach(f=>uploadImage(f)); e.target.value='' }}/>
            <div style={{ fontSize:'1.5rem' }}>📷</div>
            <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.8rem', marginTop:'0.25rem' }}>Cliquer pour ajouter des photos</div>
            <div style={{ color:'rgba(245,240,232,0.2)', fontSize:'0.65rem' }}>JPEG recommandé — compression auto</div>
          </div>

          {/* Grid photos */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem' }}>
            {(selected.images||[]).map((url, i) => (
              <div key={i} style={{ position:'relative', background:'#0a0a0a', border: i===0?'2px solid '+gold:'1px solid rgba(200,146,10,0.15)', borderRadius:2 }}>
                {i===0 && <div style={{ position:'absolute', top:4, left:4, background:gold, color:'#000', fontSize:'0.55rem', padding:'1px 5px', zIndex:2, fontWeight:'bold' }}>PRINCIPALE</div>}
                <div style={{ position:'relative', width:'100%', paddingBottom:'75%' }}>
                  <img src={url} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'0.25rem', background:'rgba(0,0,0,0.6)' }}>
                  <div style={{ display:'flex', gap:'0.15rem' }}>
                    <button onClick={()=>moveImage(i,-1)} disabled={i===0} style={{ background:'transparent', border:'none', color: i===0?'#333':gold, cursor:'pointer', fontSize:'0.8rem', padding:'0 3px' }}>←</button>
                    <button onClick={()=>moveImage(i,1)} disabled={i===(selected.images.length-1)} style={{ background:'transparent', border:'none', color: i===(selected.images.length-1)?'#333':gold, cursor:'pointer', fontSize:'0.8rem', padding:'0 3px' }}>→</button>
                  </div>
                  <button onClick={()=>removeImage(url,i)} style={{ background:'transparent', border:'none', color:'#e55', cursor:'pointer', fontSize:'0.8rem' }}>✕</button>
                </div>
                <div style={{ padding:'0.15rem 0.25rem', fontSize:'0.55rem', color:'rgba(245,240,232,0.2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{url.split('/').pop()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonne droite: Infos ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <h3 style={{ color:gold, fontSize:'0.7rem', letterSpacing:'0.2em', marginBottom:'0.25rem' }}>✦ INFORMATIONS</h3>

          {[['Titre','title'],['Artiste','artist'],['Série','serie'],['Technique','technique'],['Support','support'],['Catégorie','category']].map(([label,key]) => (
            <div key={key}>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>{label.toUpperCase()}</div>
              <input value={selected[key]||''} onChange={e=>setF(key,e.target.value)} style={inp}/>
            </div>
          ))}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.5rem' }}>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>ANNÉE</div>
              <input type="number" value={selected.year||''} onChange={e=>setF('year',Number(e.target.value))} style={inp}/>
            </div>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>ÉDITION</div>
              <input type="number" value={selected.edition||''} onChange={e=>setF('edition',Number(e.target.value))} style={inp}/>
            </div>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>STOCK</div>
              <input type="number" value={selected.stock||''} onChange={e=>setF('stock',Number(e.target.value))} style={inp}/>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>PRIX PHOTO (€)</div>
              <input type="number" value={selected.price||''} onChange={e=>setF('price',Number(e.target.value))} style={{ ...inp, color:gold, fontWeight:'bold' }}/>
            </div>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>PRIX ENCADRÉE (€)</div>
              <input type="number" value={selected.priceFramed||''} onChange={e=>setF('priceFramed',Number(e.target.value))} style={inp}/>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'0.5rem', alignItems:'end' }}>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>LARGEUR (cm)</div>
              <input type="number" value={selected.dimensions?.width||''} onChange={e=>setDim('width',e.target.value)} style={inp}/>
            </div>
            <div style={{ color:gold, paddingBottom:'0.6rem', textAlign:'center' }}>×</div>
            <div>
              <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>HAUTEUR (cm)</div>
              <input type="number" value={selected.dimensions?.height||''} onChange={e=>setDim('height',e.target.value)} style={inp}/>
            </div>
          </div>

          <div>
            <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>DESCRIPTION</div>
            <textarea value={selected.description||''} onChange={e=>setF('description',e.target.value)} rows={4} style={{ ...inp, resize:'vertical' }}/>
          </div>

          <div>
            <div style={{ color:'rgba(245,240,232,0.4)', fontSize:'0.65rem', marginBottom:'0.25rem' }}>TAGS (séparés par virgule)</div>
            <input value={(selected.tags||[]).join(', ')} onChange={e=>setF('tags',e.target.value.split(',').map(t=>t.trim()).filter(Boolean))} style={inp}/>
          </div>

          <div style={{ display:'flex', gap:'1.5rem', marginTop:'0.5rem' }}>
            {[['available','Disponible à la vente'],['featured','En vedette'],['new','Nouveau']].map(([key,label]) => (
              <label key={key} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.8rem', color:'rgba(245,240,232,0.7)' }}>
                <input type="checkbox" checked={!!selected[key]} onChange={e=>setF(key,e.target.checked)}
                  style={{ accentColor:gold, width:16, height:16 }}/>
                {label}
              </label>
            ))}
          </div>

          {/* Preview link */}
          <a href={'/oeuvre/'+selected.id} target="_blank" style={{ color:gold, fontSize:'0.75rem', marginTop:'0.5rem', textDecoration:'none' }}>
            👁 Voir sur le shop →
          </a>
        </div>
      </div>
    </div>
  )

  // ── List view ──
  return (
    <div style={{ minHeight:'100vh', background:dark, color:'#f5f0e8', fontFamily:'sans-serif' }}>
      <Head><title>Admin — BLACH Gallery</title></Head>
      <div style={{ background:card, borderBottom:'1px solid '+bdr, padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:gold }}>BLACH® — Administration</div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <a href="/shop" target="_blank" style={{ color:gold, fontSize:'0.75rem', textDecoration:'none' }}>Voir le shop →</a>
          <a href="/admin/upload" style={{ color:gold, fontSize:'0.75rem', textDecoration:'none' }}>+ Ajouter une œuvre</a>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem 1.5rem' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
          {[
            ['Œuvres', artworks.length, '🖼'],
            ['En vente', artworks.filter(a=>a.available).length, '✅'],
            ['Non publiées', artworks.filter(a=>!a.available).length, '⚠️'],
            ['Photos manquantes', artworks.filter(a=>!a.images||a.images.length===0).length, '📷'],
          ].map(([label, val, icon]) => (
            <div key={label} style={{ background:card, border:'1px solid '+bdr, padding:'1.25rem', textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'0.25rem' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:gold }}>{val}</div>
              <div style={{ fontSize:'0.65rem', letterSpacing:'0.1em', color:'rgba(245,240,232,0.4)', textTransform:'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <input placeholder="Rechercher une œuvre..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ ...inp, marginBottom:'1rem', maxWidth:400 }}/>

        {/* Artworks table */}
        <div style={{ background:card, border:'1px solid '+bdr }}>
          <div style={{ display:'grid', gridTemplateColumns:'60px 1fr 80px 80px 80px 100px 60px', gap:'0', borderBottom:'1px solid '+bdr, padding:'0.5rem 1rem' }}>
            {['Photo','Titre','Prix','Format','Édition','Statut',''].map(h => (
              <div key={h} style={{ fontSize:'0.6rem', letterSpacing:'0.15em', color:'rgba(245,240,232,0.3)', textTransform:'uppercase' }}>{h}</div>
            ))}
          </div>
          {filtered.length === 0 && <div style={{ padding:'2rem', textAlign:'center', color:'rgba(245,240,232,0.3)' }}>Aucune œuvre</div>}
          {filtered.map(a => (
            <div key={a.id} onClick={()=>{setSelected({...a});setView('edit');setLog('')}}
              style={{ display:'grid', gridTemplateColumns:'60px 1fr 80px 80px 80px 100px 60px', gap:'0', borderBottom:'1px solid rgba(200,146,10,0.08)', padding:'0.5rem 1rem', cursor:'pointer', alignItems:'center', transition:'background 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(200,146,10,0.05)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{ width:48, height:36, position:'relative', background:'#0a0a0a', border:'1px solid rgba(200,146,10,0.1)', overflow:'hidden' }}>
                {a.images?.[0] ? <img src={a.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'1rem', opacity:0.2 }}>✦</div>}
              </div>
              <div>
                <div style={{ fontSize:'0.85rem', marginBottom:'0.1rem' }}>{a.title}</div>
                <div style={{ fontSize:'0.65rem', color:'rgba(245,240,232,0.3)' }}>{a.id}</div>
              </div>
              <div style={{ color:gold, fontWeight:'bold', fontSize:'0.85rem' }}>{a.price}€</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(245,240,232,0.5)' }}>{a.dimensions?.width}×{a.dimensions?.height}</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(245,240,232,0.5)' }}>{a.edition ? '/'+a.edition : '—'}</div>
              <div>
                <span style={{ fontSize:'0.65rem', padding:'2px 8px', background: a.available?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', color: a.available?'#4ade80':'#f87171', border: '1px solid '+(a.available?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)') }}>
                  {a.available ? 'EN VENTE' : 'MASQUÉ'}
                </span>
                {(!a.images||a.images.length===0) && <span style={{ fontSize:'0.6rem', color:'#f87171', marginLeft:'0.25rem' }}>📷</span>}
              </div>
              <div style={{ color:'rgba(245,240,232,0.3)', textAlign:'right' }}>✏️</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
