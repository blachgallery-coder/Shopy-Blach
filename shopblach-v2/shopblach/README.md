# BLACH® Gallery Shop — v2.0

Boutique officielle du collectif d'Artistes Lyonnais Blach Gallery.

## 🚀 Déploiement sur Vercel (méthode recommandée)

### Étape 1 — Uploader sur GitHub
1. Va sur https://github.com/blachgallery-coder/ShopiBlach (ou crée un nouveau repo)
2. Clique **"Upload files"**
3. Glisse **tout le contenu** de ce dossier (pas le dossier lui-même)
4. **"Commit changes"**

### Étape 2 — Déployer sur Vercel
1. Va sur https://vercel.com → **"New Project"**
2. Importe le repo GitHub `ShopiBlach`
3. Vercel détecte automatiquement Next.js ✅
4. Clique **"Deploy"**
5. Ton shop est en ligne !

## 💻 Lancement local (Windows)

```bash
cd shopblach
npm install
npm run dev
```
Ouvre http://localhost:3000

## ➕ Ajouter une nouvelle œuvre

Édite uniquement `lib/catalog.js` — ajoute un objet dans le tableau `ARTWORKS` :

```js
{
  id: 'mon-oeuvre',
  slug: 'mon-oeuvre',
  title: 'Titre FR',
  artist: 'blach',   // ou 'carotte'
  year: 2026,
  technique: 'Sérigraphie',
  support: 'Papier 300g',
  dimensions: { width: 75, height: 50, unit: 'cm' },
  edition: 30,
  price: 350,
  available: true,
  stock: 20,
  category: 'editions-limitees',
  images: ['/images/mon-oeuvre/main.jpg'],
  description: 'Description de l\'œuvre...',
}
```

Mets les images dans `public/images/mon-oeuvre/`.

## 🔑 Admin

Accès : `/admin`  
Mot de passe par défaut : `blach2026`  
(À changer via variable d'environnement `NEXT_PUBLIC_ADMIN_PWD`)

## 📦 Structure du projet

```
shopblach/
├── components/       # Layout, CartDrawer, ArtworkCard
├── lib/
│   ├── catalog.js   # ⭐ SOURCE DE VÉRITÉ des œuvres
│   └── cart.js      # Zustand store panier
├── pages/
│   ├── index.js     # Homepage + moteur de recherche
│   ├── shop.js      # Boutique complète
│   ├── artistes.js  # Page artistes
│   ├── checkout.js  # Commande
│   ├── contact.js   # Contact
│   ├── admin.js     # Dashboard admin
│   └── oeuvre/[slug].js  # Page détail œuvre
├── styles/
│   └── globals.css  # Design system BLACH®
└── public/
    └── images/      # Photos des œuvres
```
