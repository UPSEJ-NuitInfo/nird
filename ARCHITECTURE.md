# ✅ Architecture de Base - NIRD Navigator Academy

## État du projet : PRÊT À DÉVELOPPER

---

## 📦 Ce qui est INSTALLÉ et FONCTIONNEL

### Backend ✅
- [x] `server.js` - Serveur Express configuré
- [x] `api/calculator.js` - Module de calculs complet
- [x] Routes API :
  - `POST /api/calculate` → Calculs économies/CO2
  - `GET /api/data/:type` → Récupération JSON

### Frontend - Structure ✅
- [x] `public/index.html` - Page d'accueil complète
- [x] `public/css/style.css` - Design system complet
- [x] `public/js/main.js` - Utilitaires (toast, modal, format...)
- [x] `public/js/storage.js` - Gestion localStorage

### Data - JSON ✅
- [x] `data/testimonials.json` - 3 témoignages
- [x] `data/alternatives.json` - 10 logiciels Big Tech ↔ NIRD
- [x] `data/quiz.json` - 15 questions (niveaux 1-3)
- [x] `data/constants.json` - Prix et constantes

### Documentation ✅
- [x] `README.md` - Vue d'ensemble
- [x] `START.md` - Quick start 5 min
- [x] `DEPLOY.md` - Guide déploiement
- [x] `CONTRIBUTING.md` - Workflow équipe
- [x] `PROJET.md` - Specs détaillées
- [x] `sujet.md` - Sujet hackathon
- [x] `.github/copilot-instructions.md` - Instructions AI

### Configuration ✅
- [x] `package.json` - Dépendances (Express uniquement)
- [x] `.gitignore` - Fichiers exclus
- [x] Structure dossiers complète

---

## 📝 Ce qui RESTE À CRÉER (MVP)

### Pages HTML (6 fichiers)
```bash
public/
├── navigator.html      # Formulaire diagnostic
├── results.html        # Affichage résultats
├── academy.html        # Dashboard academy
├── level1.html         # Quiz niveau 1
├── level2.html         # Quiz niveau 2
├── level3.html         # Quiz niveau 3
└── resources.html      # Ressources & vidéos
```

### Scripts JavaScript (4 fichiers)
```bash
public/js/
├── navigator.js        # Logique formulaire Navigator
├── results.js          # Affichage graphiques (Chart.js)
├── academy.js          # Gestion progression/badges
└── quiz.js             # Quiz interactifs
```

### Images (optionnel mais recommandé)
```bash
public/images/
├── hero/               # Bannières page accueil
├── badges/             # Badges Academy (Bronze, Argent, Or)
├── levels/             # Illustrations niveaux
└── testimonials/       # Photos témoignages
```

---

## 🎯 Ordre de développement recommandé

### Phase 1 : Navigator (2h30) - PRIORITÉ MAX
1. ✏️ `public/navigator.html`
   - Formulaire multi-étapes (3 étapes minimum)
   - Champs : nb machines, nb users, logiciels utilisés...
   
2. ✏️ `public/js/navigator.js`
   - Validation formulaire
   - Gestion étapes (next/previous)
   - Appel API `/api/calculate`
   - Redirection vers results
   
3. ✏️ `public/results.html`
   - Affichage des résultats
   - 2-3 graphiques (Chart.js)
   - Roadmap personnalisée
   
4. ✏️ `public/js/results.js`
   - Récupération données URL
   - Génération graphiques
   - Sauvegarde localStorage

### Phase 2 : Academy (2h30)
1. ✏️ `public/academy.html`
   - Dashboard progression
   - Liste des 5 niveaux
   - Affichage badges/XP
   
2. ✏️ `public/js/academy.js`
   - Récupération progression (storage.js)
   - Calcul XP total
   - Déverrouillage badges
   
3. ✏️ `public/level1.html`, `level2.html`, `level3.html`
   - Container quiz
   - Boutons validation
   - Affichage score
   
4. ✏️ `public/js/quiz.js`
   - Chargement questions depuis `/api/data/quiz`
   - Affichage questions/options
   - Validation réponses
   - Calcul score + sauvegarde

### Phase 3 : Resources (1h)
1. ✏️ `public/resources.html`
   - Affichage témoignages (fetch data)
   - Embed vidéos YouTube
   - Tableau alternatives logicielles
   - Liens NIRD officiels

---

## 🧪 Commandes de test

### Démarrer le serveur
```bash
npm start
# Ouvrir http://localhost:3000
```

### Tester l'API
```bash
# Calculs
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"nbMachines":100,"nbUsers":200,"hasWindows":true}'

# Données
curl http://localhost:3000/api/data/testimonials
curl http://localhost:3000/api/data/quiz
```

### Vérifier localStorage
```javascript
// Console navigateur (F12)
NIRD.Storage.saveNavigatorData({test: 'data'});
NIRD.Storage.getNavigatorData();
```

---

## 📚 Ressources disponibles

### CDN déjà intégrés dans index.html
- ✅ Tailwind CSS
- ✅ Font Awesome
- ✅ Google Fonts (Poppins, Inter)

### À ajouter dans les pages
```html
<!-- Chart.js pour graphiques -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Déjà dans toutes les pages -->
<script src="/js/main.js"></script>
<script src="/js/storage.js"></script>
```

### Fonctions utiles disponibles (main.js)
```javascript
NIRD.showToast(message, type)           // Notification
NIRD.formatEuro(amount)                 // Format monétaire
NIRD.formatNumber(num)                  // Format nombre
NIRD.saveToStorage(key, value)          // localStorage
NIRD.getFromStorage(key)                // localStorage
```

### Fonctions storage disponibles (storage.js)
```javascript
NIRD.Storage.saveNavigatorData(data)
NIRD.Storage.getNavigatorData()
NIRD.Storage.saveAcademyProgress(levelId, completed, score)
NIRD.Storage.getAcademyProgress()
NIRD.Storage.unlockBadge(id, name, type)
NIRD.Storage.getTotalXP()
```

---

## 🎨 Design System

### Couleurs (variables CSS)
```css
--primary: #2563eb     /* Bleu */
--secondary: #dc2626   /* Rouge */
--accent: #fbbf24      /* Or */
--success: #10b981     /* Vert */
--neutral: #64748b     /* Gris */
```

### Classes Tailwind utiles
```html
<!-- Boutons -->
<button class="btn-primary">Action</button>
<button class="btn-secondary">Secondaire</button>

<!-- Cards -->
<div class="bg-white rounded-lg shadow-lg p-6">...</div>

<!-- Grille responsive -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">...</div>
```

---

## 🚀 Déploiement

Quand le MVP est prêt :

```bash
# Option 1 : Vercel (le plus simple)
npm i -g vercel
vercel

# Option 2 : Netlify drag & drop
# → Glisser le dossier public/ sur netlify.com
```

---

## ✅ Checklist finale MVP

### Fonctionnalités
- [ ] Page accueil cliquable
- [ ] Navigator : formulaire 3 étapes
- [ ] Navigator : calculs fonctionnent
- [ ] Results : 2 graphiques affichés
- [ ] Academy : dashboard progression
- [ ] Academy : 3 quiz jouables
- [ ] Academy : badges sauvegardés
- [ ] Resources : témoignages affichés

### Qualité
- [ ] Responsive mobile testé
- [ ] Pas d'erreurs console (F12)
- [ ] Navigation entre pages OK
- [ ] localStorage persiste les données
- [ ] API répond correctement

### Déploiement
- [ ] Site en ligne (URL publique)
- [ ] Testé en ligne (pas juste local)
- [ ] README à jour avec URL

---

## 📊 Estimation temps restant

| Phase         | Temps    | Fichiers        |
| ------------- | -------- | --------------- |
| Navigator     | 2h30     | 4 fichiers      |
| Academy       | 2h30     | 6 fichiers      |
| Resources     | 1h       | 1 fichier       |
| Polish/Debug  | 1h       | -               |
| Déploiement   | 30min    | -               |
| **TOTAL MVP** | **7h30** | **11 fichiers** |

---

## 🎯 Prêt à coder !

**Commencer par** :
1. Créer `public/navigator.html` (copier structure de `index.html`)
2. Créer `public/js/navigator.js` (formulaire simple)
3. Tester appel API avec `console.log()`
4. Itérer !

**Lire avant de commencer** :
- `START.md` - Quick start
- `CONTRIBUTING.md` - Workflow Git

---

**Let's build! 🚀**

*Architecture validée le 4 décembre 2025*
