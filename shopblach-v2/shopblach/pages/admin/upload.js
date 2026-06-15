import React, { useState, useRef } from 'react'

const GRID = {
  '30x60': { photo: 75, framed: 90 }, '40x40': { photo: 70, framed: 90 },
  '40x50': { photo: 85, framed: 110 }, '40x60': { photo: 100, framed: 130 },
  '50x50': { photo: 105, framed: 140 }, '50x60': { photo: 125, framed: 160 },
  '55x38': { photo: 90, framed: 120 }, '60x60': { photo: 150, framed: 190 },
  '60x80': { photo: 190, framed: 230 }, '75x50': { photo: 160, framed: 200 },
  '75x75': { photo: 230, framed: 270 }, '70x70': { photo: 200, framed: 240 },
  '80x52': { photo: 180, framed: 220 }, '80x56': { photo: 180, framed: 220 },
  '80x80': { photo: 260, framed: 300 }, '90x60': { photo: 220, framed: 250 },
}

function getPrice(w, h) {
  return GRID[w + 'x' + h] || GRID[h + 'x' + w] || null
}

function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function compressImg(file, maxW, q) {
  return new Promise(function(res) {
    var img = new Image()
    var url = URL.createObjectURL(file)
    img.onload = function() {
      var sc = Math.min(1, maxW / img.width)
      var c = document.createElement('canvas')
      c.width = Math.round(img.width * sc)
      c.height = Math.round(img.height * sc)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      c.toBlob(function(b) { URL.revokeObjectURL(url); res(b) }, 'image/jpeg', q)
    }
    img.src = url
  })
}

async function toB64(file) {
  return new Promise(function(res, rej) {
    var r = new FileReader()
    r.onload = function() { res(r.result.split(',')[1]) }
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

var GH_TOKEN = process.env.NEXT_PUBLIC_GH_TOKEN || ''
var REPO_NAME = 'blachgallery-coder/Shopy-Blach'
var CATALOG_PATH = 'shopblach-v2/shopblach/lib/catalog.js'
var IMAGES_PATH = 'shopblach-v2/shopblach/public/images/'

async function ghGet(path, tok) {
  var r = await fetch('https://api.github.com/repos/' + REPO_NAME + '/contents/' + path, { headers: { 'Authorization': 'token ' + tok, 'User-Agent': 'blach-admin' } })
  return r.json()
}

async function ghPutText(path, content, msg, sha, tok) {
  var body = { message: msg, content: btoa(unescape(encodeURIComponent(content))) }
  if (sha) body.sha = sha
  var r = await fetch('https://api.github.com/repos/' + REPO_NAME + '/contents/' + path, { method: 'PUT', headers: { 'Authorization': 'token ' + tok, 'Content-Type': 'application/json', 'User-Agent': 'blach-admin' }, body: JSON.stringify(body) })
  return r.json()
}

async function ghPutBin(path, b64, msg, sha, tok) {
  var body = { message: msg, content: b64 }
  if (sha) body.sha = sha
  var r = await fetch('https://api.github.com/repos/' + REPO_NAME + '/contents/' + path, { method: 'PUT', headers: { 'Authorization': 'token ' + tok, 'Content-Type': 'application/json', 'User-Agent': 'blach-admin' }, body: JSON.stringify(body) })
  return r.json()
}

var gold = '#c8920a'
var dark = '#0a0a0a'
var card = '#111'
var bdr = 'rgba(200,146,10,0.25)'
var inp = { width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,146,10,0.25)', color: '#f5f0e8', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

export default function AdminUpload() {
  var certRef = useRef()
  var photoRef = useRef()
  var _auth = useState(false); var auth = _auth[0]; var setAuth = _auth[1]
  var _pwd = useState(''); var pwd = _pwd[0]; var setPwd = _pwd[1]
  var _certFile = useState(null); var certFile = _certFile[0]; var setCertFile = _certFile[1]
  var _photos = useState([]); var photos = _photos[0]; var setPhotos = _photos[1]
  var _log = useState([]); var log = _log[0]; var setLog = _log[1]
  var _entry = useState(null); var entry = _entry[0]; var setEntry = _entry[1]
  var _busy = useState(false); var busy = _busy[0]; var setBusy = _busy[1]
  var _done = useState(false); var done = _done[0]; var setDone = _done[1]

  function addLog(msg, type) {
    setLog(function(l) { return l.concat([{ msg: msg, type: type || 'info' }]) })
  }

  function setField(k, v) {
    setEntry(function(p) { var n = Object.assign({}, p); n[k] = v; return n })
  }

  function setDim(k, v) {
    setEntry(function(p) { var n = Object.assign({}, p); n.dimensions = Object.assign({}, p.dimensions); n.dimensions[k] = Number(v); return n })
  }

  async function readCert() {
    if (!certFile) { alert('Selectionne un certificat'); return }
    setBusy(true); setLog([]); setEntry(null); setDone(false)
    addLog('Compression du certificat...')
    try {
      var blob = await compressImg(certFile, 900, 0.75)
      var b64 = await toB64(blob)
      addLog('Envoi a Claude...')
      var resp = await fetch('/api/read-certificate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64, mediaType: 'image/jpeg' }) })
      var data = await resp.json()
      if (data.error) { addLog('Erreur: ' + data.error, 'error'); setBusy(false); return }
      if (!data.entry) { addLog('Erreur: pas de donnees', 'error'); setBusy(false); return }
      var e = data.entry
      if (!e.price || e.price === 0) { var p = getPrice(e.dimensions && e.dimensions.width, e.dimensions && e.dimensions.height); if (p) { e.price = p.photo; e.priceFramed = p.framed } }
      if (!e.artist) e.artist = 'BLACH®'
      if (!e.category) e.category = 'print'
      if (!e.stock) e.stock = 10
      if (!e.tags) e.tags = []
      if (!e.description) e.description = ''
      if (!e.id) e.id = slugify(e.title || 'oeuvre')
      e.slug = e.id
      addLog('OK: ' + e.title, 'success')
      setEntry(e)
    } catch(err) { addLog('Erreur: ' + err.message, 'error') }
    setBusy(false)
  }

  async function publish() {
    if (!entry || photos.length === 0) { alert('Certificat + au moins 1 photo requis'); return }
    var tok = GH_TOKEN
    if (!tok) { addLog('Token GitHub manquant', 'error'); return }
    setBusy(true)
    try {
      var id = entry.id || slugify(entry.title)
      var imgPaths = []
      for (var i = 0; i < photos.length; i++) {
        addLog('Compression photo ' + (i + 1) + '/' + photos.length + '...')
        var blob = await compressImg(photos[i], 1400, 0.82)
        var b64 = await toB64(blob)
        var name = i === 0 ? id + '.jpg' : id + '-' + (i + 1) + '.jpg'
        var ghPath = IMAGES_PATH + name
        var existSha = null
        try { var ex = await ghGet(ghPath, tok); existSha = ex.sha } catch(e2) {}
        var r2 = await ghPutBin(ghPath, b64, 'feat: image ' + name, existSha, tok)
        if (r2.content) { imgPaths.push('/images/' + name); addLog('OK ' + name, 'success') }
        else addLog('Erreur ' + name, 'error')
      }
      addLog('Mise a jour catalog...')
      var catInfo = await ghGet(CATALOG_PATH, tok)
      var catalog = decodeURIComponent(escape(atob(catInfo.content.replace(/\n/g, ''))))
      var dims = entry.dimensions || { width: 0, height: 0, unit: 'cm' }
      var tagsStr = (entry.tags || []).map(function(t) { return "'" + t + "'" }).join(', ')
      var imgsStr = imgPaths.map(function(s) { return "'" + s + "'" }).join(', ')
      var newEntry = "  {\n    id: '" + id + "', slug: '" + id + "',\n    title: \"" + entry.title + "\", titleEn: \"" + entry.title + "\",\n    description: \"" + (entry.description || '').replace(/"/g, "'") + "\",\n    images: [" + imgsStr + "],\n    price: " + (entry.price || 0) + ", priceFramed: " + (entry.priceFramed || 0) + ",\n    format: \"" + dims.width + "x" + dims.height + " cm\",\n    dimensions: { width: " + dims.width + ", height: " + dims.height + ", unit: 'cm' },\n    edition: " + (entry.edition || 1) + ",\n    technique: \"" + (entry.technique || '') + "\",\n    support: \"" + (entry.support || '') + "\",\n    category: '" + (entry.category || 'print') + "',\n    year: " + (entry.year || 2026) + ",\n    artist: '" + (entry.artist || 'BLACH®') + "',\n    serie: '" + (entry.serie || '') + "',\n    tags: [" + tagsStr + "],\n    stock: " + (entry.stock || 10) + ",\n    available: true, featured: false, new: true,\n  }"
      var insertAt = catalog.lastIndexOf('\n]')
      var newCatalog = catalog.slice(0, insertAt) + ',\n' + newEntry + '\n' + catalog.slice(insertAt)
      var pushR = await ghPutText(CATALOG_PATH, newCatalog, 'feat: add ' + entry.title, catInfo.sha, tok)
      if (pushR.commit) { addLog('Publie! commit ' + pushR.commit.sha.slice(0, 8), 'success'); setDone(true) }
      else addLog('Erreur catalog: ' + JSON.stringify(pushR).slice(0, 100), 'error')
    } catch(err) { addLog('Erreur: ' + err.message, 'error') }
    setBusy(false)
  }

  if (!auth) {
    return React.createElement('div', { style: { minHeight: '100vh', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      React.createElement('div', { style: { width: 340, padding: '2.5rem', background: card, border: '1px solid ' + bdr, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '1.8rem', color: gold, fontFamily: 'Playfair Display, serif', marginBottom: '0.25rem' } }, 'BLACH®'),
        React.createElement('div', { style: { fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(245,240,232,0.3)', marginBottom: '2rem' } }, 'ADMIN UPLOAD'),
        React.createElement('input', { type: 'password', placeholder: 'Mot de passe', value: pwd, onChange: function(e) { setPwd(e.target.value) }, onKeyDown: function(e) { if (e.key === 'Enter' && pwd === 'blach2026') setAuth(true) }, style: Object.assign({}, inp, { marginBottom: '1rem', textAlign: 'center' }) }),
        React.createElement('button', { onClick: function() { pwd === 'blach2026' ? setAuth(true) : alert('Mot de passe incorrect') }, style: { width: '100%', padding: '0.75rem', background: gold, color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.15em', fontSize: '0.85rem' } }, 'ACCEDER')
      )
    )
  }

  return React.createElement('div', { style: { minHeight: '100vh', background: dark, color: '#f5f0e8' } },
    React.createElement('div', { style: { background: card, borderBottom: '1px solid ' + bdr, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement('div', { style: { fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: gold } }, 'BLACH® — Ajouter une oeuvre'),
      React.createElement('a', { href: '/admin', style: { color: gold, fontSize: '0.75rem', textDecoration: 'none' } }, '<- Dashboard')
    ),
    React.createElement('div', { style: { maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' } },
        React.createElement('div', { onClick: function() { certRef.current.click() }, onDragOver: function(e) { e.preventDefault() }, onDrop: function(e) { e.preventDefault(); var f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) setCertFile(f) }, style: { border: '2px dashed ' + (certFile ? gold : bdr), padding: '2rem', textAlign: 'center', cursor: 'pointer' } },
          React.createElement('input', { ref: certRef, type: 'file', accept: 'image/*', style: { display: 'none' }, onChange: function(e) { setCertFile(e.target.files[0]) } }),
          React.createElement('div', { style: { fontSize: '2rem', marginBottom: '0.5rem' } }, '📋'),
          React.createElement('div', { style: { color: certFile ? gold : 'rgba(245,240,232,0.4)', fontSize: '0.8rem' } }, certFile ? '✅ ' + certFile.name : 'Certificat (photo ou scan)'),
          React.createElement('div', { style: { color: 'rgba(245,240,232,0.2)', fontSize: '0.65rem', marginTop: '0.25rem' } }, 'Cliquer ou glisser')
        ),
        React.createElement('div', { onClick: function() { photoRef.current.click() }, onDragOver: function(e) { e.preventDefault() }, onDrop: function(e) { e.preventDefault(); var files = Array.from(e.dataTransfer.files).filter(function(f) { return f.type.startsWith('image/') }); setPhotos(function(p) { return p.concat(files) }) }, style: { border: '2px dashed ' + (photos.length ? gold : bdr), padding: '2rem', textAlign: 'center', cursor: 'pointer' } },
          React.createElement('input', { ref: photoRef, type: 'file', accept: 'image/*', multiple: true, style: { display: 'none' }, onChange: function(e) { setPhotos(function(p) { return p.concat(Array.from(e.target.files)) }) } }),
          React.createElement('div', { style: { fontSize: '2rem', marginBottom: '0.5rem' } }, '🖼️'),
          React.createElement('div', { style: { color: photos.length ? gold : 'rgba(245,240,232,0.4)', fontSize: '0.8rem' } }, photos.length ? '✅ ' + photos.length + ' photo(s)' : "Photos de l'oeuvre"),
          React.createElement('div', { style: { color: 'rgba(245,240,232,0.2)', fontSize: '0.65rem', marginTop: '0.25rem' } }, 'Cliquer ou glisser (plusieurs ok)')
        )
      ),
      React.createElement('button', { onClick: readCert, disabled: busy || !certFile, style: { width: '100%', padding: '0.85rem', background: (certFile && !busy) ? gold : '#333', color: (certFile && !busy) ? '#000' : '#666', border: 'none', cursor: (certFile && !busy) ? 'pointer' : 'not-allowed', fontWeight: 'bold', letterSpacing: '0.15em', fontSize: '0.85rem', marginBottom: '1rem' } },
        busy && !entry ? '⏳ Lecture en cours...' : '🤖 LIRE LE CERTIFICAT AVEC CLAUDE'
      ),
      entry && React.createElement('div', { style: { background: card, border: '1px solid ' + bdr, padding: '1.5rem', marginBottom: '1rem' } },
        React.createElement('div', { style: { color: gold, fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '1rem' } }, '✦ VERIFIEZ ET CORRIGEZ SI BESOIN'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' } },
          ['title', 'artist', 'serie', 'technique', 'support', 'category'].map(function(key) {
            var labels = { title: 'Titre', artist: 'Artiste', serie: 'Serie', technique: 'Technique', support: 'Support', category: 'Categorie' }
            return React.createElement('div', { key: key },
              React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, labels[key].toUpperCase()),
              React.createElement('input', { value: (entry[key] || ''), onChange: function(e) { setField(key, e.target.value) }, style: inp })
            )
          }),
          React.createElement('div', { key: 'year' },
            React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'ANNEE'),
            React.createElement('input', { type: 'number', value: (entry.year || ''), onChange: function(e) { setField('year', Number(e.target.value)) }, style: inp })
          ),
          React.createElement('div', { key: 'edition' },
            React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'EDITION'),
            React.createElement('input', { type: 'number', value: (entry.edition || ''), onChange: function(e) { setField('edition', Number(e.target.value)) }, style: inp })
          ),
          React.createElement('div', { key: 'price' },
            React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'PRIX PHOTO (EUR)'),
            React.createElement('input', { type: 'number', value: (entry.price || ''), onChange: function(e) { setField('price', Number(e.target.value)) }, style: inp })
          ),
          React.createElement('div', { key: 'priceFramed' },
            React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'PRIX ENCADREE (EUR)'),
            React.createElement('input', { type: 'number', value: (entry.priceFramed || ''), onChange: function(e) { setField('priceFramed', Number(e.target.value)) }, style: inp })
          )
        ),
        React.createElement('div', { style: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem' } },
          React.createElement('div', null,
            React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'LARGEUR (cm)'),
            React.createElement('input', { type: 'number', value: (entry.dimensions && entry.dimensions.width || ''), onChange: function(e) { setDim('width', e.target.value) }, style: Object.assign({}, inp, { width: 100 }) })
          ),
          React.createElement('div', { style: { color: gold, fontSize: '1.2rem', paddingTop: '1.2rem' } }, 'x'),
          React.createElement('div', null,
            React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'HAUTEUR (cm)'),
            React.createElement('input', { type: 'number', value: (entry.dimensions && entry.dimensions.height || ''), onChange: function(e) { setDim('height', e.target.value) }, style: Object.assign({}, inp, { width: 100 }) })
          )
        ),
        React.createElement('div', { style: { marginTop: '0.75rem' } },
          React.createElement('div', { style: { color: 'rgba(245,240,232,0.4)', fontSize: '0.65rem', marginBottom: '0.3rem' } }, 'DESCRIPTION'),
          React.createElement('textarea', { value: (entry.description || ''), onChange: function(e) { setField('description', e.target.value) }, rows: 3, style: Object.assign({}, inp, { resize: 'vertical' }) })
        )
      ),
      entry && photos.length > 0 && !done && React.createElement('button', { onClick: publish, disabled: busy, style: { width: '100%', padding: '1rem', background: busy ? '#333' : gold, color: busy ? '#666' : '#000', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 'bold', letterSpacing: '0.2em', fontSize: '0.9rem', marginBottom: '1rem' } },
        busy ? '⏳ Publication...' : '🚀 PUBLIER SUR LE SHOP'
      ),
      done && React.createElement('div', { style: { background: 'rgba(200,146,10,0.1)', border: '1px solid ' + gold, padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' } },
        React.createElement('div', { style: { fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: gold } }, '✦ Oeuvre publiee !'),
        React.createElement('div', { style: { fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', marginTop: '0.5rem' } }, 'Vercel redeploie — visible dans ~2 min'),
        React.createElement('button', { onClick: function() { setCertFile(null); setPhotos([]); setEntry(null); setLog([]); setDone(false) }, style: { marginTop: '1rem', background: 'transparent', border: '1px solid ' + gold, color: gold, padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.8rem' } }, '+ Ajouter une autre')
      ),
      log.length > 0 && React.createElement('div', { style: { background: '#000', border: '1px solid ' + bdr, padding: '1rem', fontFamily: 'monospace', fontSize: '0.72rem', maxHeight: 180, overflowY: 'auto' } },
        log.map(function(l, i) { return React.createElement('div', { key: i, style: { color: l.type === 'error' ? '#e55' : l.type === 'success' ? gold : 'rgba(245,240,232,0.5)', marginBottom: '0.15rem' } }, l.msg) })
      )
    )
  )
}
