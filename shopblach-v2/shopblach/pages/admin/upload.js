import { useState, useRef, useCallback } from 'react'
import Layout from '../../components/Layout'
import { ARTWORKS } from '../../lib/catalog'

const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PWD || 'blach2026'
const GH_TOKEN  = process.env.NEXT_PUBLIC_GH_TOKEN  || ''
const REPO      = 'blachgallery-coder/Shopy-Blach'
const CATALOG_PATH = 'shopblach-v2/shopblach/lib/catalog.js'
const IMAGES_PATH  = 'shopblach-v2/shopblach/public/images/'

// ── Pricing grid ─────────────────────────────────────────────────────────────
const GRID = {
  '30x60':{'photo':75,'framed':90},'40x40':{'photo':70,'framed':90},
  '40x50':{'photo':85,'framed':110},'40x60':{'photo':100,'framed':130},
  '50x50':{'photo':105,'framed':140},'50x60':{'photo':125,'framed':160},
  '55x38':{'photo':90,'framed':120},'60x60':{'photo':150,'framed':190},
  '60x80':{'photo':190,'framed':230},'75x50':{'photo':160,'framed':200},
  '75x75':{'photo':230,'framed':270},'70x70':{'photo':200,'framed':240},
  '80x52':{'photo':180,'framed':220},'80x56':{'photo':180,'framed':220},
  '80x80':{'photo':260,'framed':300},'90x60':{'photo':220,'framed':250},
}
function getPrice(w,h){
  const k=`${w}x${h}`; const k2=`${h}x${w}`
  return GRID[k]||GRID[k2]||null
}
function slugify(str){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}
async function toBase64(file){
  return new Promise((res,rej)=>{
    const r=new FileReader()
    r.onload=()=>res(r.result.split(',')[1])
    r.onerror=rej
    r.readAsDataURL(file)
  })
}
async function compressImage(file, maxW=1200, quality=0.82){
  return new Promise(res=>{
    const img=new Image()
    const url=URL.createObjectURL(file)
    img.onload=()=>{
      const scale=Math.min(1,maxW/img.width)
      const canvas=document.createElement('canvas')
      canvas.width=Math.round(img.width*scale)
      canvas.height=Math.round(img.height*scale)
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height)
      canvas.toBlob(blob=>{ URL.revokeObjectURL(url); res(blob) },'image/jpeg',quality)
    }
    img.src=url
  })
}

// ── GitHub helpers ────────────────────────────────────────────────────────────
async function ghGet(path, token){
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{
    headers:{'Authorization':`token ${token}`,'User-Agent':'blach-admin'}
  })
  return r.json()
}
async function ghPut(path, content, message, sha, token){
  const body={message, content:btoa(unescape(encodeURIComponent(content))), ...(sha&&{sha})}
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{
    method:'PUT',
    headers:{'Authorization':`token ${token}`,'Content-Type':'application/json','User-Agent':'blach-admin'},
    body:JSON.stringify(body)
  })
  return r.json()
}
async function ghPutBinary(path, base64Content, message, sha, token){
  const body={message, content:base64Content, ...(sha&&{sha})}
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{
    method:'PUT',
    headers:{'Authorization':`token ${token}`,'Content-Type':'application/json','User-Agent':'blach-admin'},
    body:JSON.stringify(body)
  })
  return r.json()
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminUpload(){
  const [auth, setAuth]=useState(false)
  const [pwd, setPwd]=useState('')
  const [token, setToken]=useState(GH_TOKEN || (typeof window!=='undefined'&&localStorage.getItem('gh_token'))||'')
  const [images, setImages]=useState([])      // File[]
  const [certFile, setCertFile]=useState(null) // File (image)
  const [status, setStatus]=useState('')
  const [log, setLog]=useState([])
  const [entry, setEntry]=useState(null)       // generated catalog entry
  const [publishing, setPublishing]=useState(false)
  // Save token to localStorage when it changes
  const updateToken=(t)=>{ setToken(t); if(typeof window!=='undefined') localStorage.setItem('gh_token',t) }
  const imgRef=useRef(); const certRef=useRef()

  const addLog=(msg,type='info')=>setLog(l=>[...l,{msg,type,t:new Date().toLocaleTimeString()}])

  // ── Step 1: Read certificate with Claude API ──────────────────────────────
  async function readCertificate(){
    if(!certFile){ alert('Ajoute un certificat (image)'); return }
    setStatus('reading'); setLog([]); addLog('Compression du certificat...')
    try{
      const compressed=await compressImage(certFile, 800, 0.7)
      const b64=await toBase64(compressed)
      addLog('Lecture du certificat par Claude...')
      const mediaType='image/jpeg'
      const resp=await fetch('/api/read-certificate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({image:b64, mediaType})
      })
      const data=await resp.json()
      if(data.error){ addLog('Erreur Claude: '+data.error,'error'); setStatus(''); return }
      if(!data.entry){ addLog('Erreur: réponse vide de Claude','error'); setStatus(''); return }
      addLog('✅ Certificat lu','success')
      // Ensure all required fields have defaults
      const e = data.entry
      if(!e.price||e.price===0){ const p=getPrice(e.dimensions?.width,e.dimensions?.height); if(p){e.price=p.photo;e.priceFramed=p.framed} }
      if(!e.artist) e.artist='BLACH®'
      if(!e.category) e.category='print'
      if(!e.stock) e.stock=10
      if(!e.tags) e.tags=[]
      if(!e.description) e.description=''
      setEntry({...e})
      setStatus('ready')
      addLog('Titre: '+(e.title||'?')+' | Prix: '+(e.price||'?')+'€','success')
    }catch(e){ addLog('Erreur: '+e.message,'error'); setStatus('') }
  }

  // ── Step 2: Push everything to GitHub ────────────────────────────────────
  async function publish(){
    if(!entry || images.length===0){ alert('Certificat lu + au moins 1 image requise'); return }
    if(!token){ alert('Token GitHub manquant'); return }
    setPublishing(true); setStatus('publishing')

    try{
      const id=entry.id||slugify(entry.title)
      const imgPaths=[]

      // Upload images
      for(let i=0;i<images.length;i++){
        const file=images[i]
        addLog(`Compression image ${i+1}/${images.length}...`)
        const compressed=await compressImage(file)
        const b64=await toBase64(compressed)
        const ext='jpg'
        const imgName=i===0?`${id}.${ext}`:`${id}-${i+1}.${ext}`
        const ghPath=`${IMAGES_PATH}${imgName}`
        // Check if exists
        let existingSha=null
        try{ const ex=await ghGet(ghPath.replace('shopblach-v2/shopblach/public/images/','shopblach-v2/shopblach/public/images/'),token); existingSha=ex.sha }catch(e){}
        addLog(`Upload ${imgName}...`)
        const res=await ghPutBinary(ghPath,b64,`feat: add image ${imgName}`,existingSha,token)
        if(res.content){ imgPaths.push(`/images/${imgName}`); addLog(`✅ ${imgName}`,'success') }
        else{ addLog(`⚠️ Erreur upload ${imgName}: ${JSON.stringify(res)}`,'error') }
      }

      // Update catalog.js
      addLog('Mise à jour catalog.js...')
      const catInfo=await ghGet(CATALOG_PATH,token)
      const currentCatalog=decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g,''))))
      const finalEntry={...entry, id, slug:id, images:imgPaths, available:true, new:true}
      const entryStr=`  {\n${Object.entries(finalEntry).map(([k,v])=>{
        if(k==='dimensions') return `    dimensions: { width: ${v.width}, height: ${v.height}, unit: '${v.unit}' }`
        if(k==='tags') return `    tags: [${v.map(t=>`'${t}'`).join(', ')}]`
        if(k==='images') return `    images: [${v.map(s=>`'${s}'`).join(', ')}]`
        if(typeof v==='string') return `    ${k}: "${v}"`
        return `    ${k}: ${v}`
      }).join(',\n')},\n  }`
      // Insert before closing ]
      const insertAt=currentCatalog.lastIndexOf('\n]')
      const newCatalog=currentCatalog.slice(0,insertAt)+',\n'+entryStr+'\n'+currentCatalog.slice(insertAt)
      const pushRes=await ghPut(CATALOG_PATH,newCatalog,`feat: add artwork ${entry.title}`,catInfo.sha,token)
      if(pushRes.commit){ addLog(`✅ Catalog mis à jour — commit ${pushRes.commit.sha.slice(0,8)}`,'success') }
      else{ addLog('⚠️ Erreur catalog: '+JSON.stringify(pushRes),'error') }

      addLog('🚀 Vercel redéploie automatiquement — ~2 min','success')
      setStatus('done')
    }catch(e){ addLog('Erreur publish: '+e.message,'error') }
    setPublishing(false)
  }

  // ── Auth screen ───────────────────────────────────────────────────────────
  if(!auth) return(
    <Layout title="Admin Upload — BLACH Gallery">
      <div style={{minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:340,padding:'2.5rem',background:'#0f0f0f',border:'1px solid rgba(200,146,10,0.2)',textAlign:'center'}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'#c8920a',marginBottom:'0.5rem'}}>BLACH®</div>
          <p style={{fontSize:'0.7rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(245,240,232,0.3)',marginBottom:'2rem'}}>Admin Upload</p>
          <input type="password" placeholder="Mot de passe" value={pwd} onChange={e=>setPwd(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&pwd===ADMIN_PWD&&setAuth(true)}
            style={{width:'100%',padding:'0.75rem',background:'rgba(245,240,232,0.04)',border:'1px solid rgba(200,146,10,0.25)',color:'#f5f0e8',fontSize:'0.875rem',outline:'none',marginBottom:'0.75rem',textAlign:'center',boxSizing:'border-box'}}/>
          <input type="text" placeholder="GitHub Token (ghp_...)" value={token} onChange={e=>updateToken(e.target.value)}
            style={{width:'100%',padding:'0.75rem',background:'rgba(245,240,232,0.04)',border:'1px solid rgba(200,146,10,0.25)',color:'#f5f0e8',fontSize:'0.75rem',outline:'none',marginBottom:'1rem',textAlign:'center',boxSizing:'border-box',fontFamily:'monospace'}}/>
          <button onClick={()=>pwd===ADMIN_PWD?setAuth(true):alert('Mot de passe incorrect')}
            style={{width:'100%',padding:'0.75rem',background:'#c8920a',color:'#000',border:'none',cursor:'pointer',fontWeight:'bold',letterSpacing:'0.1em',textTransform:'uppercase',fontSize:'0.8rem'}}>
            Accéder →
          </button>
        </div>
      </div>
    </Layout>
  )

  // ── Upload UI ─────────────────────────────────────────────────────────────
  const gold='#c8920a'; const bg='#0a0a0a'; const card='#111'; const border='rgba(200,146,10,0.2)'
  return(
    <Layout title="Admin Upload — BLACH Gallery">
      <div style={{background:'#0f0f0f',borderBottom:`1px solid ${border}`,padding:'1.5rem 2rem'}}>
        <div style={{maxWidth:900,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <p style={{fontSize:'0.6rem',letterSpacing:'0.3em',textTransform:'uppercase',color:gold,margin:0}}>✦ Administration</p>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',color:'#f5f0e8',margin:0}}>Ajouter une œuvre</h1>
          </div>
          <a href="/admin" style={{color:gold,fontSize:'0.75rem',textDecoration:'none',letterSpacing:'0.1em'}}>← Dashboard</a>
        </div>
      </div>

      <div style={{maxWidth:900,margin:'0 auto',padding:'2rem 1.5rem'}}>

        {/* Steps indicator */}
        <div style={{display:'flex',gap:'1rem',marginBottom:'2rem'}}>
          {['1. Certificat','2. Photos','3. Vérifier','4. Publier'].map((s,i)=>(
            <div key={i} style={{padding:'0.4rem 0.8rem',background:i<=['reading','ready','publishing','done'].indexOf(status)+1?gold:'transparent',
              border:`1px solid ${border}`,color:i<=['reading','ready','publishing','done'].indexOf(status)+1?'#000':gold,
              fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>{s}</div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'1.5rem'}}>

          {/* Certificate drop zone */}
          <div style={{border:`2px dashed ${border}`,padding:'1.5rem',textAlign:'center',background:card,cursor:'pointer'}}
            onClick={()=>certRef.current.click()}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))setCertFile(f)}}>
            <input ref={certRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>setCertFile(e.target.files[0])}/>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>📋</div>
            <p style={{color:certFile?gold:'rgba(245,240,232,0.4)',fontSize:'0.8rem',margin:0}}>
              {certFile?`✅ ${certFile.name}`:'Certificat (photo ou scan)'}
            </p>
            <p style={{color:'rgba(245,240,232,0.2)',fontSize:'0.65rem',marginTop:'0.25rem'}}>Cliquer ou glisser</p>
          </div>

          {/* Images drop zone */}
          <div style={{border:`2px dashed ${border}`,padding:'1.5rem',textAlign:'center',background:card,cursor:'pointer'}}
            onClick={()=>imgRef.current.click()}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));setImages(p=>[...p,...files])}}>
            <input ref={imgRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>setImages(p=>[...p,...e.target.files])}/>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🖼️</div>
            <p style={{color:images.length?gold:'rgba(245,240,232,0.4)',fontSize:'0.8rem',margin:0}}>
              {images.length?`✅ ${images.length} photo${images.length>1?'s':''}  sélectionnée${images.length>1?'s':''}`:'Photos de l\'œuvre'}
            </p>
            {images.length>0&&<p style={{color:'rgba(245,240,232,0.3)',fontSize:'0.65rem',marginTop:'0.25rem'}}>{images.map(f=>f.name).join(', ')}</p>}
            <p style={{color:'rgba(245,240,232,0.2)',fontSize:'0.65rem',marginTop:'0.25rem'}}>Cliquer ou glisser (plusieurs ok)</p>
          </div>
        </div>

        {/* Read certificate button */}
        <button onClick={readCertificate} disabled={!certFile||status==='reading'}
          style={{width:'100%',padding:'0.9rem',background:certFile?gold:'#333',color:certFile?'#000':'#666',
            border:'none',cursor:certFile?'pointer':'not-allowed',fontWeight:'bold',letterSpacing:'0.15em',
            textTransform:'uppercase',fontSize:'0.85rem',marginBottom:'1rem'}}>
          {status==='reading'?'⏳ Lecture en cours...':'🤖 Lire le certificat avec Claude'}
        </button>

        {/* Generated entry preview + editable fields */}
        {entry&&(
          <div style={{background:card,border:`1px solid ${border}`,padding:'1.5rem',marginBottom:'1.5rem'}}>
            <p style={{color:gold,fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'1rem'}}>✦ Données extraites — vérifiez et corrigez si besoin</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[
                ['Titre','title'],['Artiste','artist'],['Année','year'],
                ['Technique','technique'],['Support','support'],['Édition','edition'],
                ['Prix photo (€)','price'],['Prix encadrée (€)','priceFramed'],
                ['Catégorie','category'],['Série','serie'],
              ].map(([label,key])=>(
                <div key={key}>
                  <label style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',display:'block',marginBottom:'0.25rem'}}>{label}</label>
                  <input value={entry[key]||''} onChange={e=>setEntry(p=>({...p,[key]:e.target.value}))}
                    style={{width:'100%',padding:'0.5rem',background:'rgba(245,240,232,0.05)',border:'1px solid rgba(200,146,10,0.2)',color:'#f5f0e8',fontSize:'0.85rem',outline:'none',boxSizing:'border-box'}}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:'1rem'}}>
              <label style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',display:'block',marginBottom:'0.25rem'}}>Dimensions (W×H cm)</label>
              <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                <input value={entry.dimensions?.width||''} onChange={e=>setEntry(p=>({...p,dimensions:{...p.dimensions,width:+e.target.value}}))}
                  style={{width:80,padding:'0.5rem',background:'rgba(245,240,232,0.05)',border:'1px solid rgba(200,146,10,0.2)',color:'#f5f0e8',fontSize:'0.85rem',outline:'none'}} placeholder="W"/>
                <span style={{color:gold}}>×</span>
                <input value={entry.dimensions?.height||''} onChange={e=>setEntry(p=>({...p,dimensions:{...p.dimensions,height:+e.target.value}}))}
                  style={{width:80,padding:'0.5rem',background:'rgba(245,240,232,0.05)',border:'1px solid rgba(200,146,10,0.2)',color:'#f5f0e8',fontSize:'0.85rem',outline:'none'}} placeholder="H"/>
                <span style={{color:'rgba(245,240,232,0.4)',fontSize:'0.8rem'}}>cm</span>
                {entry.dimensions?.width&&entry.dimensions?.height&&(()=>{
                  const p=getPrice(entry.dimensions.width,entry.dimensions.height)
                  return p?<span style={{color:gold,fontSize:'0.75rem',marginLeft:'0.5rem'}}>→ grille: {p.photo}€ / {p.framed}€ encadrée</span>
                    :<span style={{color:'#e55',fontSize:'0.75rem',marginLeft:'0.5rem'}}>⚠️ Format hors grille</span>
                })()}
              </div>
            </div>
            <div style={{marginTop:'1rem'}}>
              <label style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',letterSpacing:'0.1em',textTransform:'uppercase',display:'block',marginBottom:'0.25rem'}}>Description</label>
              <textarea value={entry.description||''} onChange={e=>setEntry(p=>({...p,description:e.target.value}))} rows={3}
                style={{width:'100%',padding:'0.5rem',background:'rgba(245,240,232,0.05)',border:'1px solid rgba(200,146,10,0.2)',color:'#f5f0e8',fontSize:'0.8rem',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
            </div>
          </div>
        )}

        {/* Publish button */}
        {entry&&images.length>0&&(
          <button onClick={publish} disabled={publishing}
            style={{width:'100%',padding:'1rem',background:publishing?'#333':gold,color:publishing?'#666':'#000',
              border:'none',cursor:publishing?'not-allowed':'pointer',fontWeight:'bold',letterSpacing:'0.2em',
              textTransform:'uppercase',fontSize:'0.9rem',marginBottom:'1rem'}}>
            {publishing?'⏳ Publication en cours...':'🚀 Publier sur le shop'}
          </button>
        )}

        {/* Log */}
        {log.length>0&&(
          <div style={{background:'#000',border:`1px solid ${border}`,padding:'1rem',fontFamily:'monospace',fontSize:'0.75rem',maxHeight:200,overflowY:'auto'}}>
            {log.map((l,i)=>(
              <div key={i} style={{color:l.type==='error'?'#e55':l.type==='success'?gold:'rgba(245,240,232,0.6)',marginBottom:'0.2rem'}}>
                <span style={{color:'rgba(245,240,232,0.2)',marginRight:'0.5rem'}}>{l.t}</span>{l.msg}
              </div>
            ))}
          </div>
        )}

        {status==='done'&&(
          <div style={{background:'rgba(200,146,10,0.1)',border:`1px solid ${gold}`,padding:'1rem',textAlign:'center',marginTop:'1rem'}}>
            <p style={{color:gold,fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',margin:0}}>✦ Œuvre publiée avec succès</p>
            <p style={{color:'rgba(245,240,232,0.5)',fontSize:'0.75rem',marginTop:'0.5rem'}}>
              Vercel redéploie automatiquement — disponible dans ~2 minutes
            </p>
            <a href="/shop" target="_blank" style={{color:gold,fontSize:'0.75rem',letterSpacing:'0.1em'}}>Voir le shop →</a>
          </div>
        )}
      </div>
    </Layout>
  )
}
