# 📚 Documentation Technique - NIRD Navigator Academy

## Vue d'ensemble du projet

NIRD Navigator Academy est une plateforme web interactive développée pour la **Nuit de l'Info 2025**, visant à accompagner les établissements scolaires français vers l'autonomie numérique via la démarche NIRD (Numérique Inclusif, Responsable et Durable).

---

## 🏗️ Architecture Technique

### Stack

- **Backend** : Node.js v20+ avec Express.js 4.18.2
- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+)
- **Styling** : Tailwind CSS via CDN + CSS custom
- **Charts** : Chart.js (à intégrer)
- **Icons** : Font Awesome 6.4.0 (CDN)
- **Fonts** : Google Fonts (Poppins, Inter)
- **Storage** : localStorage (client-side) + JSON files (server-side)
- **Déploiement** : Compatible Vercel/Netlify/Render

### Principe de conception

- **Zero-dependency frontend** : Pas de build tools, pas de frameworks
- **API REST minimaliste** : 2 endpoints seulement
- **Progressive Enhancement** : Fonctionne sans JavaScript pour le contenu de base
- **Mobile-first** : Design responsive natif

---

## 📂 Structure du Projet

```
nird/
├── server.js                 # Serveur Express (point d'entrée)
├── package.json              # Configuration npm simplifiée
│
├── api/
│   └── calculator.js         # Module de calculs économiques/écologiques
│
├── data/                     # Données statiques JSON
│   ├── testimonials.json     # Témoignages d'établissements (3 entrées)
│   ├── alternatives.json     # Correspondances logiciels Big Tech ↔ NIRD (10 entrées)
│   ├── quiz.json            # Questions par niveau (15 questions sur 3 niveaux)
│   └── constants.json        # Constantes de calcul (prix, CO2, XP)
│
├── public/                   # Frontend statique
│   ├── index.html           # Page d'accueil (implémentée)
│   ├── css/
│   │   └── style.css        # Design system complet
│   ├── js/
│   │   ├── main.js          # Utilitaires globaux (20+ fonctions)
│   │   └── storage.js       # Gestion localStorage (badges, progression)
│   └── images/              # Assets visuels (placeholders)
│
├── docs/                     # Documentation (ce dossier)
│   ├── README.md            # Ce fichier
│   ├── API.md               # Documentation des endpoints
│   ├── MODULES.md           # Description des modules JS
│   └── DATA.md              # Structure des données JSON
│
└── [Guides]
    ├── START.md             # Quick start
    ├── DEPLOY.md            # Guide de déploiement
    ├── CONTRIBUTING.md      # Workflow équipe
    └── ARCHITECTURE.md      # État d'avancement
```

---

## ✅ Ce qui est implémenté

### Backend (100% fonctionnel)

#### `server.js`
Serveur Express minimaliste avec 3 routes :

```javascript
GET  /                    // Serve index.html
POST /api/calculate       // Calculs économies/CO2/autonomie
GET  /api/data/:type      // Récupération données JSON
```

**Caractéristiques** :
- Middleware JSON parser activé
- Serve static files depuis `/public`
- Gestion d'erreurs basique
- Port configurable via `process.env.PORT` (défaut: 3000)

#### `api/calculator.js`
Module de calculs économiques et écologiques complet.

**Fonctions exportées** :
- `calculateEconomies(data)` : Calcul principal
- `CONSTANTS` : Constantes de prix/CO2

**Formules implémentées** :

1. **Coûts Big Tech (5 ans)** :
   ```
   Total = (Windows × machines × 5) 
         + (Office × users × 5) 
         + (Google Workspace × users × 5)
         + (Renouvellement matériel)
   ```

2. **Coûts NIRD (5 ans)** :
   ```
   Total = (Support technique × 5) 
         + (Formation ponctuelle)
         + (Serveur local optionnel)
   ```

3. **Impact Carbone** :
   ```
   CO2 évité = machines_sauvées × 200 kg
   Arbres équivalents = CO2 / 22 kg/an
   ```

4. **Score d'autonomie (0-100)** :
   ```
   Score = (logiciels_libres/total × 40)
         + (matériel_linux/total × 30)
         + (données_locales × 20)
         + (compétences_internes × 10)
   ```

**Retour JSON** :
```javascript
{
  costs: { bigTech: {...}, nird: {...} },
  savings: { amount, percent },
  carbon: { machinesSaved, co2Avoided, treesEquivalent },
  autonomy: { score, level },
  roadmap: [phases...]
}
```

### Frontend (Base complète)

#### `public/index.html`
Page d'accueil complète et fonctionnelle.

**Sections implémentées** :
- ✅ Navigation responsive avec logo
- ✅ Hero section avec stats (établissements, économies, CO2)
- ✅ 3 portails d'entrée (Élève, Enseignant, Collectivité)
- ✅ Section "Pourquoi NIRD" (4 avantages)
- ✅ CTA avec 2 boutons d'action
- ✅ Footer avec liens et crédits

**Liens actifs** :
- `/navigator.html` (à créer)
- `/academy.html` (à créer)
- `/resources.html` (à créer)

#### `public/css/style.css`
Design system complet avec 400+ lignes.

**Variables CSS définies** :
```css
--primary: #2563eb    /* Bleu */
--secondary: #dc2626  /* Rouge */
--accent: #fbbf24     /* Or */
--success: #10b981    /* Vert */
--neutral: #64748b    /* Gris */
```

**Composants stylisés** :
- Navigation avec effet hover
- Boutons (primary, secondary, outline)
- Cards avec transitions
- Progress bars animées
- Badges (bronze, silver, gold)
- Modals
- Toast notifications
- Spinners de chargement
- Scrollbar personnalisée

**Animations** :
- Fade-in
- Slide-in-right
- Hover effects (scale, translateY)

#### `public/js/main.js`
Module utilitaire global avec namespace `window.NIRD`.

**Fonctions disponibles** (20+) :

| Fonction                              | Description              | Exemple                                    |
| ------------------------------------- | ------------------------ | ------------------------------------------ |
| `showToast(msg, type, duration)`      | Notification toast       | `NIRD.showToast('Succès!', 'success')`     |
| `toggleModal(id, show)`               | Afficher/cacher modal    | `NIRD.toggleModal('myModal', true)`        |
| `showLoading(containerId)`            | Spinner de chargement    | `NIRD.showLoading('results')`              |
| `formatEuro(amount)`                  | Formater en euros        | `NIRD.formatEuro(15000)` → "15 000 €"      |
| `formatNumber(num)`                   | Formater nombre          | `NIRD.formatNumber(1234567)` → "1 234 567" |
| `isValidEmail(email)`                 | Valider email            | `NIRD.isValidEmail('test@example.com')`    |
| `getUrlParams()`                      | Récupérer paramètres URL | `NIRD.getUrlParams()` → `{id: '123'}`      |
| `saveToStorage(key, value)`           | Sauvegarder localStorage | `NIRD.saveToStorage('data', obj)`          |
| `getFromStorage(key)`                 | Récupérer localStorage   | `NIRD.getFromStorage('data')`              |
| `copyToClipboard(text)`               | Copier texte             | `NIRD.copyToClipboard('https://...')`      |
| `debounce(func, wait)`                | Debounce function        | `debounce(search, 300)`                    |
| `animateNumber(el, target, duration)` | Animer compteur          | `NIRD.animateNumber(el, 1000, 2000)`       |

**Initialisation automatique** :
- Menu mobile (si présent)
- Smooth scroll pour ancres
- Tooltips (structure prête)

#### `public/js/storage.js`
Module de gestion localStorage avec namespace `window.NIRD.Storage`.

**Clés de stockage définies** :
```javascript
STORAGE_KEYS = {
  NAVIGATOR_DATA: 'nird_navigator_data',
  ACADEMY_PROGRESS: 'nird_academy_progress',
  USER_BADGES: 'nird_user_badges',
  QUIZ_RESULTS: 'nird_quiz_results',
  USER_PROFILE: 'nird_user_profile'
}
```

**API disponible** :

| Fonction                                            | Description                  | Retour         |
| --------------------------------------------------- | ---------------------------- | -------------- |
| `saveNavigatorData(data)`                           | Sauvegarder diagnostic       | boolean        |
| `getNavigatorData()`                                | Récupérer diagnostic         | object \| null |
| `saveAcademyProgress(levelId, completed, score)`    | Progression niveau           | boolean        |
| `getAcademyProgress()`                              | Récupérer progression        | object         |
| `getCompletedLevelsCount()`                         | Nombre niveaux complétés     | number         |
| `unlockBadge(id, name, type)`                       | Débloquer badge              | boolean        |
| `getUserBadges()`                                   | Liste badges                 | array          |
| `hasBadge(id)`                                      | Vérifier badge               | boolean        |
| `saveQuizResult(levelId, score, maxScore, answers)` | Résultat quiz                | boolean        |
| `getQuizResult(levelId)`                            | Récupérer résultat           | object         |
| `getTotalXP()`                                      | XP total                     | number         |
| `getBadgeLevel()`                                   | Niveau badge actuel          | object         |
| `resetAllData()`                                    | Réinitialiser (avec confirm) | void           |
| `exportUserData()`                                  | Export JSON                  | void           |
| `importUserData(file)`                              | Import JSON                  | void           |

**Logique de badges** :
- Bronze : 1-2 niveaux complétés
- Argent : 3-4 niveaux complétés
- Or : 5 niveaux + 3 badges

### Données JSON

#### `data/testimonials.json`
3 témoignages d'établissements NIRD.

**Structure** :
```json
{
  "id": "lycee-carnot",
  "name": "Lycée Carnot de Bruay-la-Buissière",
  "type": "lycee",
  "location": "Hauts-de-France",
  "year": 2023,
  "quote": "Le passage au libre...",
  "author": "Équipe NIRD",
  "role": "Enseignants & Techniciens",
  "stats": {
    "savings": 40000,
    "machines": 150,
    "co2Saved": 30000
  },
  "videoUrl": "https://...",
  "story": "Texte long..."
}
```

**Établissements inclus** :
1. Lycée Carnot (Hauts-de-France) - 40k€ économisés
2. Collège Einstein (Île-de-France) - 15k€ économisés
3. Lycée Voltaire (Auvergne-Rhône-Alpes) - 25k€ économisés

#### `data/alternatives.json`
10 correspondances logiciels propriétaires ↔ libres.

**Structure** :
```json
{
  "category": "Bureautique",
  "bigTech": "Microsoft Office",
  "nird": "LibreOffice",
  "description": "Suite bureautique complète",
  "compatibility": "Fichiers .docx, .xlsx, .pptx",
  "difficulty": "Facile",
  "icon": "fa-file-word"
}
```

**Catégories couvertes** :
1. Bureautique (Office → LibreOffice)
2. Système d'exploitation (Windows → Ubuntu/Mint)
3. Navigateur (Chrome → Firefox/Chromium)
4. Messagerie (Gmail → Thunderbird)
5. Visioconférence (Teams → Jitsi/BBB)
6. Édition image (Photoshop → GIMP)
7. Montage vidéo (Premiere → Kdenlive)
8. Stockage cloud (Drive → Nextcloud)
9. Développement (Visual Studio → VS Code)
10. PDF (Acrobat → PDF Arranger)

#### `data/quiz.json`
15 questions réparties sur 3 niveaux.

**Niveaux disponibles** :
- `level1` : "Ouvrir les yeux" (5 questions)
- `level2` : "Découvrir les alternatives" (5 questions)
- `level3` : "Passer à l'action" (5 questions)

**Structure des questions** :
```json
{
  "id": "q1_1",
  "question": "Windows 10 ne sera plus supporté...",
  "type": "true-false" | "multiple-choice",
  "correct": true | 2,
  "options": ["Option 1", "Option 2", ...], // Si multiple-choice
  "explanation": "Texte explicatif..."
}
```

**Types de questions** :
- `true-false` : Vrai/Faux avec booléen
- `multiple-choice` : QCM avec index de réponse correcte

#### `data/constants.json`
Toutes les constantes de calcul centralisées.

**Sections** :
```json
{
  "pricing": {
    "windowsLicense": 150,
    "officeLicense": 100,
    "googleWorkspace": 72,
    "techSupportYear": 3000,
    "trainingOneTime": 2000,
    "localServerOptional": 5000,
    "pcRenewalCost": 600
  },
  "carbon": {
    "co2PerPcKg": 200,
    "kgPerTree": 22
  },
  "projectionYears": 5,
  "autonomyWeights": {
    "software": 40,
    "hardware": 30,
    "dataStorage": 20,
    "skills": 10
  },
  "badges": {
    "bronze": { "requirement": "3 niveaux", "xp": 300 },
    "silver": { "requirement": "5 niveaux", "xp": 500 },
    "gold": { "requirement": "Certification", "xp": 1000 }
  },
  "levels": {
    "level1": { "xp": 100, "badge": "Éveillé Numérique" },
    ...
  }
}
```

---

## 🔗 Routes API

### POST `/api/calculate`

**Description** : Calcule les économies, l'impact carbone et le score d'autonomie.

**Body (JSON)** :
```json
{
  "nbMachines": 100,
  "nbUsers": 200,
  "hasWindows": true,
  "hasOffice": true,
  "hasGoogleWorkspace": false,
  "nbObsoleteMachines": 50,
  "logicielsLibres": 5,
  "logicielsTotal": 10,
  "materielLinux": 20,
  "donneesLocales": false,
  "competencesInternes": true
}
```

**Response (200)** :
```json
{
  "costs": {
    "bigTech": {
      "windows": 75000,
      "office": 100000,
      "google": 0,
      "renewal": 30000,
      "total": 205000
    },
    "nird": {
      "support": 15000,
      "training": 2000,
      "server": 0,
      "total": 17000
    }
  },
  "savings": {
    "amount": 188000,
    "percent": 92
  },
  "carbon": {
    "machinesSaved": 50,
    "co2Avoided": 10000,
    "treesEquivalent": 454
  },
  "autonomy": {
    "score": 45,
    "level": "Intermédiaire - Premiers pas"
  },
  "roadmap": [
    {
      "name": "Sensibilisation",
      "duration": "1-2 mois",
      "actions": ["...", "..."]
    },
    ...
  ]
}
```

**Erreurs** :
- `400` : Données invalides
- `500` : Erreur serveur

### GET `/api/data/:type`

**Description** : Récupère les données JSON statiques.

**Paramètres** :
- `:type` : `testimonials` | `alternatives` | `quiz` | `constants`

**Exemples** :
```
GET /api/data/testimonials  → Array de 3 témoignages
GET /api/data/alternatives  → Array de 10 logiciels
GET /api/data/quiz          → Object avec level1-3
GET /api/data/constants     → Object avec toutes les constantes
```

**Response (200)** : JSON correspondant

**Erreurs** :
- `404` : Type de données inexistant

---

## 🎨 Design System

### Couleurs

| Nom       | Hex       | Usage                      |
| --------- | --------- | -------------------------- |
| Primary   | `#2563eb` | Actions principales, liens |
| Secondary | `#dc2626` | Danger, résistance         |
| Accent    | `#fbbf24` | Highlights, badges or      |
| Success   | `#10b981` | Validation, autonomie      |
| Neutral   | `#64748b` | Texte secondaire           |
| BG Light  | `#f8fafc` | Fond clair                 |
| BG Dark   | `#1e293b` | Fond sombre                |

### Typographie

| Type    | Font           | Weights            | Usage          |
| ------- | -------------- | ------------------ | -------------- |
| Heading | Poppins        | 400, 600, 700      | Titres, CTA    |
| Body    | Inter          | 300, 400, 500, 600 | Corps de texte |
| Mono    | JetBrains Mono | 400                | Code, données  |

### Composants

**Boutons** :
- `.btn-primary` : Fond bleu, texte blanc
- `.btn-secondary` : Fond blanc, texte rouge
- `.btn-outline` : Transparent, bordure blanche

**Cards** :
- `.portal-card` : Card portail avec hover
- `.feature-card` : Card fonctionnalité
- `.stat-card` : Card statistique

**Badges** :
- `.badge-bronze` : Fond bronze
- `.badge-silver` : Fond argent
- `.badge-gold` : Fond or

**Utilitaires** :
- `.text-primary/secondary/accent`
- `.bg-primary/secondary/accent`
- Progress bars avec `.progress-bar`
- Modals avec `.modal`
- Toasts avec `.toast`

---

## 📋 Checklist État d'avancement

### ✅ Complètement implémenté
- [x] Serveur Express fonctionnel
- [x] API `/api/calculate` avec formules complètes
- [x] API `/api/data/:type` pour récupération JSON
- [x] Module `calculator.js` avec tests manuels
- [x] Page d'accueil complète et responsive
- [x] Design system CSS complet
- [x] 20+ fonctions utilitaires JS
- [x] Gestion localStorage complète
- [x] 3 témoignages d'établissements
- [x] 10 alternatives logicielles
- [x] 15 questions de quiz (3 niveaux)
- [x] Toutes les constantes de calcul
- [x] Documentation technique exhaustive

### ⏳ À implémenter (MVP)
- [ ] Page `navigator.html` (formulaire multi-étapes)
- [ ] Script `navigator.js` (logique formulaire)
- [ ] Page `results.html` (affichage résultats)
- [ ] Script `results.js` (graphiques Chart.js)
- [ ] Page `academy.html` (dashboard progression)
- [ ] Script `academy.js` (gestion XP/badges)
- [ ] Pages `level1-3.html` (niveaux Academy)
- [ ] Script `quiz.js` (logique quiz interactifs)
- [ ] Page `resources.html` (ressources statiques)
- [ ] Images/illustrations (placeholders actuellement)
- [ ] Tests navigateurs (Chrome, Firefox, Safari)
- [ ] Déploiement en ligne (Vercel/Netlify)

### 🌟 Nice to have (Post-MVP)
- [ ] Niveaux 4-5 Academy
- [ ] Export PDF des résultats
- [ ] Mode sombre
- [ ] Easter eggs thème Astérix
- [ ] Animations CSS avancées
- [ ] PWA (Progressive Web App)

---

## 🧪 Tests

### Tests manuels backend

```bash
# Test API calculate
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "nbMachines": 100,
    "nbUsers": 200,
    "hasWindows": true,
    "hasOffice": true,
    "nbObsoleteMachines": 50
  }'

# Test API data
curl http://localhost:3000/api/data/testimonials
curl http://localhost:3000/api/data/alternatives
curl http://localhost:3000/api/data/quiz
curl http://localhost:3000/api/data/constants
```

### Tests frontend

**Console navigateur** (F12) :
```javascript
// Tester utilitaires
NIRD.showToast('Test notification', 'success');
NIRD.formatEuro(15000); // "15 000 €"
NIRD.formatNumber(1234567); // "1 234 567"

// Tester localStorage
NIRD.Storage.unlockBadge('test', 'Badge Test', 'bronze');
NIRD.Storage.getUserBadges();
NIRD.Storage.getTotalXP();
```

**Responsive** :
- Desktop : 1920x1080
- Tablet : 768x1024
- Mobile : 375x667

---

## 📦 Déploiement

### Prérequis
- Node.js v20+
- Git configuré
- Compte Vercel/Netlify/Render

### Build
**Aucun build nécessaire** - Tous les fichiers sont statiques et prêts.

### Commandes

**Vercel** :
```bash
npm install -g vercel
vercel
```

**Netlify** :
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Render** :
Connecter le repo GitHub via l'interface web.

---

## 🔒 Sécurité

### Bonnes pratiques implémentées
- ✅ Pas de secrets en dur dans le code
- ✅ Validation côté serveur (try/catch)
- ✅ Gestion d'erreurs API
- ✅ Pas d'injection SQL (pas de DB)
- ✅ Sanitization inputs (à renforcer côté client)

### À améliorer
- [ ] Rate limiting API
- [ ] CORS configuration
- [ ] Helmet.js pour headers sécurisés
- [ ] Input validation stricte

---

## 📞 Support & Contribution

### Bugs & Issues
Créer une issue GitHub avec :
- Description du problème
- Étapes de reproduction
- Erreur console (si applicable)
- Navigateur/OS

### Pull Requests
1. Fork le repo
2. Créer une branche `feature/ma-feature`
3. Commiter avec messages clairs
4. Pousser et créer PR

### Contact
- GitHub : https://github.com/UPSEJ-NuitInfo/nird
- Documentation : Voir dossier `/docs`

---

*Documentation générée le 4 décembre 2025*  
*Version : 1.0.0*  
*Projet NIRD Navigator Academy - Nuit de l'Info 2025*
