import { useState, useRef } from 'react'
import Head from 'next/head'

const GRID = {
  '30x60':{photo:75,framed:90},'40x40':{photo:70,framed:90},'40x50':{photo:85,framed:110},
  '40x60':{photo:100,framed:130},'50x50':{photo:105,framed:140},'50x60':{photo:125,framed:160},
  '55x38':{photo:90,framed:120},'60x60':{photo:150,framed:190},'60x80':{photo:190,framed:230},
  '75x50':{photo:160,framed:200},'75x75':{photo:230,framed:270},'70x70':{photo:200,framed:240},
  '80x52':{photo:180,framed:220},'80x56':{photo:180,framed:220},'80x80':{photo:260,framed:300},
  '90x60':{photo:220,framed:250},
}
function getPrice(w,h){ return GRID[`${w}x${h}`]||GRID[`${h}x${w}`]||null }

function slugify(s){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }

async function compressImg(file, maxW, q){
  return new Promise(res=>{
    const img=new Image(); const url=URL.createObjectURL(file)
    img.onload=()=>{
      const sc=Math.min(1,maxW/img.width)
      const c=document.createElement('canvas')
      c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc)
      c.getContext('2d').drawImage(img,0,0,c.width,c.height)
      c.toBlob(b=>{ URL.revokeObjectURL(url); res(b) },'image/jpeg',q)
    }
    img.src=url
  })
}
async function toB64(file){
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(',')[1]); r.onerror=rej; r.readAsDataURL(file) })
}

const GH_TOKEN = process.env.NEXT_PUBLIC_GH_TOKEN||''
const REPO_NAME = 'blachgallery-coder/Shopy-Blach'
const CATALOG_PATH = 'shopblach-v2/shopblach/lib/catalog.js'
const IMAGES_PATH = 'shopblach-v2/shopblach/public/images/'

async function ghGet(path,tok){ const r=await fetch(`https://api.github.com/repos/${REPO_NAME}/contents/${path}`,{headers:{'Authorization':`token ${tok}`,'User-Agent':'blach-admin'}}); return r.json() }
async function ghPutText(path,content,msg,sha,tok){
  const body={message:msg,content:btoa(unescape(encodeURIComponent(content))),...(sha&&{sha})}
  const r=await fetch(`https://api.github.com/repos/${REPO_NAME}/contents/${path}`,{method:'PUT',headers:{'Authorization':`token ${tok}`,'Content-Type':'application/json','User-Agent':'blach-admin'},body:JSON.stringify(body)})
  return r.json()
}
async function ghPutBin(path,b64,msg,sha,tok){
  const body={message:msg,content:b64,...(sha&&{sha})}
  const r=await fetch(`https://api.github.com/repos/${REPO_NAME}/contents/${path}`,{method:'PUT',headers:{'Authorization':`token ${tok}`,'Content-Type':'application/json','User-Agent':'blach-admin'},body:JSON.stringify(body)})
  return r.json()
}

const gold='#c8920a', dark='#0a0a0a', card='#111', border='rgba(200,146,10,0.25)'
const inp={width:'100%',padding:'0.5rem 0.75rem',background:'rgba(255,255,255,0.05)',border:`1px solid ${border}`,color:'#f5f0e8',fontSize:'0.85rem',outline:'none',boxSizing:'border-box',fontFamily:'inherit'}

export default function AdminUpload(){
  const [auth,setAuth]=useState(false)
  const [pwd,setPwd]=useState('')
  const [certFile,setCertFile]=useState(null)
  const [photos,setPhotos]=useState([])
  const [log,setLog]=useState([])
  const [entry,setEntry]=useState(null)
  const [busy,setBusy]=useState(false)
  const [done,setDone]=useState(false)
  const certRef=useRef(); const photoRef=useRef()

  const addLog=(msg,type='info')=>setLog(l=>[...l,{msg,type}])

  async function readCert(){
    if(!certFile){ alert('Sélectionne un certificat'); return }
    setBusy(true); setLog([]); setEntry(null); setDone(false)
    addLog('Compression du certificat...')
    try{
      const blob=await compressImg(certFile,900,0.75)
      const b64=await toB64(blob)
      addLog('Envoi à Claude...')
      const resp=await fetch('/api/read-certificate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:b64,mediaType:'image/jpeg'})})
      const data=await resp.json()
      if(data.error){ addLog('Erreur: '+data.error,'error'); setBusy(false); return }
      if(!data.entry){ addLog('Erreur: pas de données retournées','error'); setBusy(false); return }
      const e=data.entry
      if(!e.price||e.price===0){ const p=getPrice(e.dimensions?.width,e.dimensions?.height); if(p){e.price=p.photo;e.priceFramed=p.framed} }
      e.artist=e.artist||'BLACH®'
      e.category=e.category||'print'
      e.stock=e.stock||10
      e.tags=e.tags||[]
      e.description=e.description||''
      e.id=slugify(e.title||'oeuvre')
      e.slug=e.id
      addLog('✅ Lu: '+e.title+' ('+e.dimensions?.width+'×'+e.dimensions?.height+' cm)','success')
      setEntry({...e})
    }catch(err){ addLog('Erreur: '+err.message,'error') }
    setBusy(false)
  }

  function setField(k,v){ setEntry(p=>({...p,[k]:v})) }
  function setDim(k,v){ setEntry(p=>({...p,dimensions:{...p.dimensions,[k]:+v}})) }

  async function publish(){
    if(!entry||photos.length===0){ alert('Certificat lu + au moins 1 photo'); return }
    setBusy(true); addLog('Publication en cours...')
    const tok=GH_TOKEN
    if(!tok){ addLog('Token GitHub manquant','error'); setBusy(false); return }
    try{
      const id=entry.id||slugify(entry.title)
      const imgPaths=[]
      for(let i=0;i<photos.length;i++){
        addLog(`Compression photo ${i+1}/${photos.length}...`)
        const blob=await compressImg(photos[i],1400,0.82)
        const b64=await toB64(blob)
        const name=i===0?`${id}.jpg`:`${id}-${i+1}.jpg`
        const ghPath=`${IMAGES_PATH}${name}`
        let existSha=null
        try{ const ex=await ghGet(ghPath,tok); existSha=ex.sha }catch(e){}
        const r=await ghPutBin(ghPath,b64,`feat: image ${name}`,existSha,tok)
        if(r.content){ imgPaths.push(`/images/${name}`); addLog('✅ '+name,'success') }
        else addLog('⚠️ Erreur '+name+': '+JSON.stringify(r).slice(0,100),'error')
      }
      addLog('Mise à jour catalog.js...')
      const catInfo=await ghGet(CATALOG_PATH,tok)
      const catalog=decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g,''))))
      const dims=entry.dimensions||{width:0,height:0,unit:'cm'}
      const tagsStr=(entry.tags||[]).map(t=>`'${t}'`).join(', ')
      const imgsStr=imgPaths.map(s=>`'${s}'`).join(', ')
      const newEntry=`  {
    id: '${id}', slug: '${id}',
    title: "${entry.title}", titleEn: "${entry.title}",
    description: "${(entry.description||'').replace(/"/g,"'")}",
    descriptionEn: "${(entry.description||'').replace(/"/g,"'")}",
    images: [${imgsStr}],
    price: ${entry.price||0}, priceFramed: ${entry.priceFramed||0},
    format: "${dims.width}×${dims.height} cm",
    dimensions: { width: ${dims.width}, height: ${dims.height}, unit: 'cm' },
    edition: ${entry.edition||1},
    technique: "${entry.technique||''}",
    support: "${entry.support||''}",
    category: '${entry.category||'print'}',
    year: ${entry.year||2026},
    artist: '${entry.artist||'BLACH®'}',
    serie: '${entry.serie||''}',
    tags: [${tagsStr}],
    stock: ${entry.stock||10},
    available: true, featured: false, new: true,
  }`
      const insertAt=catalog.lastIndexOf('\n]')
      const newCatalog=catalog.slice(0,insertAt)+',\n'+newEntry+'\n'+catalog.slice(insertAt)
      const pushR=await ghPutText(CATALOG_PATH,newCatalog,`feat: add ${entry.title}`,catInfo.sha,tok)
      if(pushR.commit){ addLog('✅ Catalog mis à jour — commit '+pushR.commit.sha.slice(0,8),'success'); setDone(true) }
      else addLog('⚠️ Erreur catalog: '+JSON.stringify(pushR).slice(0,200),'error')
    }catch(err){ addLog('Erreur: '+err.message,'error') }
    setBusy(false)
  }

  if(!auth) return(
    <div style={{minHeight:'100vh',background:dark,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif"}}>
      <Head><title>Admin — BLACH Gallery</title></Head>
      <div style={{width:340,padding:'2.5rem',background:card,border:`1px solid ${border}`,textAlign:'center'}}>
        <div style={{fontSize:'1.8rem',color:gold,marginBottom:'0.25rem'}}>BLACH®</div>
        <div style={{fontSize:'0.65rem',letterSpacing:'0.25em',color:'rgba(245,240,232,0.3)',marginBottom:'2rem',fontFamily:'sans-serif'}}>ADMIN UPLOAD</div>
        <input type="password" placeholder="Mot de passe" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&pwd==='blach2026'&&setAuth(true)}
          style={{...inp,marginBottom:'1rem',textAlign:'center'}}/>
        <button onClick={()=>pwd==='blach2026'?setAuth(true):alert('Mot de passe incorrect')}
          style={{width:'100%',padding:'0.75rem',background:gold,color:'#000',border:'none',cursor:'pointer',fontWeight:'bold',letterSpacing:'0.15em',fontSize:'0.85rem',fontFamily:'sans-serif'}}>
          ACCÉDER →
        </button>
      </div>
    </div>
  )

  return(
    <div style={{minHeight:'100vh',background:dark,color:'#f5f0e8',fontFamily:'sans-serif'}}>
      <Head><title>Admin Upload — BLACH Gallery</title></Head>
      <div style={{background:card,borderBottom:`1px solid ${border}`,padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:gold}}>BLACH® — Ajouter une œuvre</div>
        <a href="/admin" style={{color:gold,fontSize:'0.75rem',textDecoration:'none'}}>← Dashboard</a>
      </div>

      <div style={{maxWidth:860,margin:'0 auto',padding:'2rem 1.5rem'}}>

        {/* Drop zones */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
          <div onClick={()=>certRef.current.click()} onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f?.type.startsWith('image/'))setCertFile(f)}}
            style={{border:`2px dashed ${certFile?gold:border}`,padding:'2rem',textAlign:'center',cursor:'pointer',background:'rgba(200,146,10,0.03)'}}>
            <input ref={certRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>setCertFile(e.target.files[0])}/>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>📋</div>
            <div style={{color:certFile?gold:'rgba(245,240,232,0.4)',fontSize:'0.8rem'}}>{certFile?'✅ '+certFile.name:'Certificat (photo ou scan)'}</div>
            <div style={{color:'rgba(245,240,232,0.2)',fontSize:'0.65rem',marginTop:'0.25rem'}}>Cliquer ou glisser</div>
          </div>
          <div onClick={()=>photoRef.current.click()} onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const files=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));setPhotos(p=>[...p,...files])}}
            style={{border:`2px dashed ${photos.length?gold:border}`,padding:'2rem',textAlign:'center',cursor:'pointer',background:'rgba(200,146,10,0.03)'}}>
            <input ref={photoRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>setPhotos(p=>[...p,...e.target.files])}/>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🖼️</div>
            <div style={{color:photos.length?gold:'rgba(245,240,232,0.4)',fontSize:'0.8rem'}}>{photos.length?`✅ ${photos.length} photo${photos.length>1?'s':''}`:'Photos de l\'œuvre'}</div>
            <div style={{color:'rgba(245,240,232,0.2)',fontSize:'0.65rem',marginTop:'0.25rem'}}>Cliquer ou glisser (plusieurs ok)</div>
          </div>
        </div>

        <button onClick={readCert} disabled={busy||!certFile}
          style={{width:'100%',padding:'0.85rem',background:certFile&&!busy?gold:'#333',color:certFile&&!busy?'#000':'#666',border:'none',cursor:certFile&&!busy?'pointer':'not-allowed',fontWeight:'bold',letterSpacing:'0.15em',fontSize:'0.85rem',marginBottom:'1rem'}}>
          {busy&&!entry?'⏳ Lecture en cours...':'🤖 LIRE LE CERTIFICAT AVEC CLAUDE'}
        </button>

        {/* Editable fields */}
        {entry&&(
          <div style={{background:card,border:`1px solid ${border}`,padding:'1.5rem',marginBottom:'1rem'}}>
            <div style={{color:gold,fontSize:'0.65rem',letterSpacing:'0.2em',marginBottom:'1rem'}}>✦ VÉRIFIEZ ET CORRIGEZ SI BESOIN</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
              {[['Titre','title'],['Artiste','artist'],['Série','serie'],['Technique','technique'],['Support','support'],['Catégorie','category']].map(([label,key])=>(
                <div key={key}>
                  <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>{label.toUpperCase()}</div>
                  <input value={entry[key]||''} onChange={e=>setField(key,e.target.value)} style={inp}/>
                </div>
              ))}
              <div>
                <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>ANNÉE</div>
                <input type="number" value={entry.year||''} onChange={e=>setField('year',+e.target.value)} style={inp}/>
              </div>
              <div>
                <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>ÉDITION</div>
                <input type="number" value={entry.edition||''} onChange={e=>setField('edition',+e.target.value)} style={inp}/>
              </div>
              <div>
                <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>PRIX PHOTO (€)</div>
                <input type="number" value={entry.price||''} onChange={e=>setField('price',+e.target.value)} style={inp}/>
              </div>
              <div>
                <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>PRIX ENCADRÉE (€)</div>
                <input type="number" value={entry.priceFramed||''} onChange={e=>setField('priceFramed',+e.target.value)} style={inp}/>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'auto auto 1fr',gap:'0.5rem',alignItems:'center',marginTop:'0.75rem'}}>
              <div>
                <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>LARGEUR (cm)</div>
                <input type="number" value={entry.dimensions?.width||''} onChange={e=>setDim('width',e.target.value)} style={{...inp,width:100}}/>
              </div>
              <div style={{color:gold,paddingTop:'1.2rem',fontSize:'1.2rem'}}>×</div>
              <div>
                <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>HAUTEUR (cm)</div>
                <input type="number" value={entry.dimensions?.height||''} onChange={e=>setDim('height',e.target.value)} style={{...inp,width:100}}/>
              </div>
            </div>
            {entry.dimensions?.width&&entry.dimensions?.height&&(()=>{
              const p=getPrice(entry.dimensions.width,entry.dimensions.height)
              return <div style={{color:p?gold:'#e55',fontSize:'0.75rem',marginTop:'0.5rem'}}>
                {p?`→ Grille: ${p.photo}€ photo / ${p.framed}€ encadrée`:'⚠️ Format hors grille — prix manuel requis'}
              </div>
            })()}
            <div style={{marginTop:'0.75rem'}}>
              <div style={{color:'rgba(245,240,232,0.4)',fontSize:'0.65rem',marginBottom:'0.3rem'}}>DESCRIPTION</div>
              <textarea value={entry.description||''} onChange={e=>setField('description',e.target.value)} rows={3}
                style={{...inp,resize:'vertical'}}/>
            </div>
          </div>
        )}

        {entry&&photos.length>0&&!done&&(
          <button onClick={publish} disabled={busy}
            style={{width:'100%',padding:'1rem',background:busy?'#333':gold,color:busy?'#666':'#000',border:'none',cursor:busy?'not-allowed':'pointer',fontWeight:'bold',letterSpacing:'0.2em',fontSize:'0.9rem',marginBottom:'1rem'}}>
            {busy?'⏳ Publication...':'🚀 PUBLIER SUR LE SHOP'}
          </button>
        )}

        {done&&(
          <div style={{background:'rgba(200,146,10,0.1)',border:`1px solid ${gold}`,padding:'1.5rem',textAlign:'center',marginBottom:'1rem'}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',color:gold}}>✦ Œuvre publiée !</div>
            <div style={{fontSize:'0.75rem',color:'rgba(245,240,232,0.5)',marginTop:'0.5rem'}}>Vercel redéploie — visible dans ~2 min</div>
            <div style={{marginTop:'1rem',display:'flex',gap:'1rem',justifyContent:'center'}}>
              <a href="/shop" target="_blank" style={{color:gold,fontSize:'0.8rem'}}>Voir le shop →</a>
              <button onClick={()=>{setCertFile(null);setPhotos([]);setEntry(null);setLog([]);setDone(false)}}
                style={{background:'transparent',border:`1px solid ${gold}`,color:gold,padding:'0.4rem 1rem',cursor:'pointer',fontSize:'0.8rem'}}>
                + Ajouter une autre
              </button>
            </div>
          </div>
        )}

        {log.length>0&&(
          <div style={{background:'#000',border:`1px solid ${border}`,padding:'1rem',fontFamily:'monospace',fontSize:'0.72rem',maxHeight:180,overflowY:'auto'}}>
            {log.map((l,i)=>(
              <div key={i} style={{color:l.type==='error'?'#e55':l.type==='success'?gold:'rgba(245,240,232,0.5)',marginBottom:'0.15rem'}}>{l.msg}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
