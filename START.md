# ⚡ QUICK START - NIRD Navigator Academy

## 🚀 Démarrage en 5 minutes

### 1. Vérifier les prérequis

```bash
# Node.js installé ?
node --version
# Doit afficher v18+ ou v20+

# Git configuré ?
git --version
```

Si Node.js n'est pas installé : https://nodejs.org/

### 2. Installer le projet

```bash
# Cloner (si pas encore fait)
git clone https://github.com/UPSEJ-NuitInfo/nird.git
cd nird

# Installer dépendances (juste Express !)
npm install
```

### 3. Lancer le serveur

```bash
npm start
```

Ouvrir **http://localhost:3000** dans le navigateur.

✅ Si la page d'accueil s'affiche → **C'est bon !**

---

## 📁 Architecture - Où trouver quoi ?

```
nird/
├── 📄 server.js              → Serveur Express (déjà fonctionnel)
│
├── 🔧 api/
│   └── calculator.js         → Calculs économies/CO2 (complet)
│
├── 📊 data/
│   ├── testimonials.json     → 3 témoignages pré-remplis
│   ├── alternatives.json     → 10 logiciels Big Tech ↔ NIRD
│   ├── quiz.json             → Questions niveaux 1-3 (à étendre)
│   └── constants.json        → Prix et constantes
│
└── 🌐 public/
    ├── index.html            → Page accueil (squelette prêt)
    ├── navigator.html        → (À CRÉER)
    ├── results.html          → (À CRÉER)
    ├── academy.html          → (À CRÉER)
    ├── level1-5.html         → (À CRÉER)
    ├── resources.html        → (À CRÉER)
    │
    ├── css/
    │   ├── style.css         → Styles principaux (complet)
    │   └── components.css    → (À CRÉER si besoin)
    │
    ├── js/
    │   ├── main.js           → Fonctions utilitaires (complet)
    │   ├── storage.js        → Gestion localStorage (complet)
    │   ├── navigator.js      → (À CRÉER)
    │   ├── results.js        → (À CRÉER)
    │   ├── academy.js        → (À CRÉER)
    │   └── quiz.js           → (À CRÉER)
    │
    └── images/               → (VIDE - à remplir avec images libres)
```

---

## ✅ Ce qui est DÉJÀ fait

### Backend ✔️
- ✅ Serveur Express fonctionnel
- ✅ Route `/api/calculate` (calculs économies)
- ✅ Route `/api/data/:type` (récupération JSON)
- ✅ Module `calculator.js` avec formules complètes

### Frontend ✔️
- ✅ Page d'accueil `index.html` (complète)
- ✅ Styles CSS de base + design system
- ✅ JavaScript utilitaires (`main.js`)
- ✅ Gestion localStorage (`storage.js`)

### Data ✔️
- ✅ 3 témoignages d'établissements
- ✅ 10 alternatives logicielles
- ✅ Quiz niveaux 1-3 (15 questions)
- ✅ Constantes de calcul

### Documentation ✔️
- ✅ README complet
- ✅ Guide de déploiement (`DEPLOY.md`)
- ✅ Guide de contribution (`CONTRIBUTING.md`)
- ✅ Instructions AI (`.github/copilot-instructions.md`)

---

## 🔥 Prochaines étapes - MVP (6h)

### Priorité 1 - Navigator (2h30)

```bash
# Créer les pages
touch public/navigator.html
touch public/results.html
touch public/js/navigator.js
touch public/js/results.js
```

**Tâches** :
1. Formulaire multi-étapes (3-4 étapes minimum)
2. Validation JS côté client
3. Appel API `/api/calculate` avec fetch
4. Page résultats avec 2 graphiques Chart.js

**Exemple de base** :

```javascript
// public/js/navigator.js
async function submitForm(formData) {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const results = await response.json();
  window.location.href = `/results.html?data=${btoa(JSON.stringify(results))}`;
}
```

### Priorité 2 - Academy (2h30)

```bash
# Créer les pages
touch public/academy.html
touch public/level1.html
touch public/level2.html
touch public/level3.html
touch public/js/academy.js
touch public/js/quiz.js
```

**Tâches** :
1. Dashboard avec progression (barre XP, badges)
2. 3 niveaux avec quiz (récupérer de `data/quiz.json`)
3. Système de scoring et validation
4. Sauvegarde localStorage (utiliser `storage.js`)

**Exemple de base** :

```javascript
// public/js/quiz.js
async function loadQuiz(levelId) {
  const response = await fetch(`/api/data/quiz`);
  const quizzes = await response.json();
  return quizzes[levelId];
}
```

### Priorité 3 - Resources (1h)

```bash
touch public/resources.html
```

**Tâches** :
1. Afficher témoignages (fetch `/api/data/testimonials`)
2. Embed vidéos YouTube Lycée Carnot
3. Liens vers site NIRD officiel

---

## 🎨 Pour le design

### Utiliser Tailwind (déjà en CDN)

```html
<!-- Exemple de carte -->
<div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
  <h3 class="font-heading text-2xl font-bold mb-4">Titre</h3>
  <p class="text-gray-600">Description...</p>
</div>
```

### Utiliser Font Awesome (déjà en CDN)

```html
<i class="fas fa-check-circle text-green-500"></i>
<i class="fas fa-calculator text-blue-500"></i>
<i class="fas fa-graduation-cap text-purple-500"></i>
```

### Utiliser Chart.js (ajouter dans HTML)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

```javascript
// Exemple graphique
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Big Tech', 'NIRD'],
    datasets: [{
      label: 'Coûts sur 5 ans (€)',
      data: [75000, 25000],
      backgroundColor: ['#dc2626', '#10b981']
    }]
  }
});
```

---

## 🧪 Tester l'API

### Avec curl

```bash
# Test calcul
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "nbMachines": 100,
    "nbUsers": 200,
    "hasWindows": true,
    "hasOffice": true,
    "nbObsoleteMachines": 50
  }'

# Test données
curl http://localhost:3000/api/data/testimonials
curl http://localhost:3000/api/data/alternatives
curl http://localhost:3000/api/data/quiz
```

### Avec Postman

1. Télécharger Postman : https://www.postman.com/
2. Créer requête POST vers `http://localhost:3000/api/calculate`
3. Body → raw → JSON
4. Coller exemple JSON ci-dessus

---

## 🐛 Debug rapide

### La page ne charge pas

```bash
# Vérifier que le serveur tourne
# Terminal doit afficher : "Serveur NIRD lancé sur http://localhost:3000"

# Redémarrer si besoin
Ctrl + C
npm start
```

### Erreur 404

→ Vérifier que le fichier est dans `public/`

### API ne répond pas

→ Ouvrir la console (F12) → onglet Network → voir la requête

### localStorage ne fonctionne pas

→ Vérifier que `<script src="/js/main.js">` est chargé AVANT `storage.js`

---

## 📝 Checklist MVP

- [ ] Page accueil attractive
- [ ] Formulaire Navigator (3 étapes)
- [ ] API calculs fonctionne
- [ ] Page résultats avec 2 graphiques
- [ ] Dashboard Academy
- [ ] 3 niveaux avec quiz
- [ ] Badges + localStorage
- [ ] Page ressources basique
- [ ] Responsive mobile
- [ ] Site déployé en ligne

---

## 🚀 Déployer rapidement

```bash
# Option la plus rapide : Vercel
npm i -g vercel
vercel
# Suivre les instructions → Site en ligne en 2 min !
```

---

## 📞 Aide

- **Documentation** : Lire `PROJET.md` (specs complètes)
- **Sujet** : Lire `sujet.md` (contexte hackathon)
- **Contribution** : Lire `CONTRIBUTING.md` (workflow équipe)
- **Déploiement** : Lire `DEPLOY.md` (mettre en ligne)

**En cas de blocage** :
1. Console navigateur (F12)
2. Google l'erreur
3. ChatGPT/Copilot
4. Demander à l'équipe

---

**C'est parti ! 🚀**

*"Fait marcher > Fait beau > Fait optimisé"*
