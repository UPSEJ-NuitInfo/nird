# 🔌 Documentation API - NIRD Navigator Academy

## Endpoints disponibles

Le serveur expose **2 endpoints REST** principaux pour les calculs et l'accès aux données.

**Base URL** : `http://localhost:3000` (développement)

---

## 1. POST `/api/calculate`

### Description
Calcule les économies financières, l'impact carbone et le score d'autonomie numérique d'un établissement sur une période de 5 ans, en comparant un scénario "Big Tech" (dépendance aux solutions propriétaires) avec un scénario "NIRD" (solutions libres).

### Requête

**Method** : `POST`  
**Content-Type** : `application/json`

**Body Parameters** :

| Paramètre             | Type    | Requis | Description                                   | Exemple |
| --------------------- | ------- | ------ | --------------------------------------------- | ------- |
| `nbMachines`          | number  | Oui    | Nombre total de machines dans l'établissement | `100`   |
| `nbUsers`             | number  | Oui    | Nombre total d'utilisateurs                   | `200`   |
| `hasWindows`          | boolean | Non    | Utilise Windows (défaut: true)                | `true`  |
| `hasOffice`           | boolean | Non    | Utilise Microsoft Office (défaut: true)       | `true`  |
| `hasGoogleWorkspace`  | boolean | Non    | Utilise Google Workspace (défaut: false)      | `false` |
| `nbObsoleteMachines`  | number  | Non    | Nombre de machines obsolètes Windows 10       | `50`    |
| `logicielsLibres`     | number  | Non    | Nombre de logiciels libres utilisés           | `5`     |
| `logicielsTotal`      | number  | Non    | Nombre total de logiciels utilisés            | `10`    |
| `materielLinux`       | number  | Non    | Nombre de machines sous Linux                 | `20`    |
| `donneesLocales`      | boolean | Non    | Données hébergées localement                  | `false` |
| `competencesInternes` | boolean | Non    | Compétences techniques internes présentes     | `true`  |

**Exemple de requête** :

```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Exemple JavaScript (fetch)** :

```javascript
const data = {
  nbMachines: 100,
  nbUsers: 200,
  hasWindows: true,
  hasOffice: true,
  nbObsoleteMachines: 50
};

const response = await fetch('/api/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

const results = await response.json();
console.log(results);
```

### Réponse

**Status** : `200 OK`  
**Content-Type** : `application/json`

**Response Body** :

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
      "actions": [
        "Présenter NIRD à l'équipe éducative",
        "Identifier les besoins et freins",
        "Former un groupe pilote"
      ]
    },
    {
      "name": "Découverte",
      "duration": "3-6 mois",
      "actions": [
        "Tester alternatives libres (LibreOffice, Firefox...)",
        "Installer Linux sur 2-3 machines pilotes",
        "Documenter l'expérience"
      ]
    },
    {
      "name": "Expérimentation",
      "duration": "6-12 mois",
      "actions": [
        "Déployer Linux sur 20 machines",
        "Former les utilisateurs clés",
        "Mettre en place support technique"
      ]
    },
    {
      "name": "Déploiement",
      "duration": "1-2 ans",
      "actions": [
        "Généraliser Linux sur toutes les machines compatibles",
        "Migrer stockage vers solutions locales",
        "Rejoindre la communauté NIRD"
      ]
    }
  ]
}
```

**Structure de la réponse** :

| Champ                    | Type   | Description                         |
| ------------------------ | ------ | ----------------------------------- |
| `costs.bigTech`          | object | Détail des coûts Big Tech sur 5 ans |
| `costs.bigTech.windows`  | number | Coût licences Windows (€)           |
| `costs.bigTech.office`   | number | Coût licences Office (€)            |
| `costs.bigTech.google`   | number | Coût Google Workspace (€)           |
| `costs.bigTech.renewal`  | number | Coût renouvellement matériel (€)    |
| `costs.bigTech.total`    | number | Total Big Tech (€)                  |
| `costs.nird`             | object | Détail des coûts NIRD sur 5 ans     |
| `costs.nird.support`     | number | Coût support technique (€)          |
| `costs.nird.training`    | number | Coût formation (€)                  |
| `costs.nird.server`      | number | Coût serveur local optionnel (€)    |
| `costs.nird.total`       | number | Total NIRD (€)                      |
| `savings.amount`         | number | Économies en euros                  |
| `savings.percent`        | number | Économies en pourcentage            |
| `carbon.machinesSaved`   | number | Nombre de machines sauvées          |
| `carbon.co2Avoided`      | number | kg de CO2 évités                    |
| `carbon.treesEquivalent` | number | Équivalent en arbres                |
| `autonomy.score`         | number | Score d'autonomie (0-100)           |
| `autonomy.level`         | string | Niveau textuel                      |
| `roadmap`                | array  | Phases de transition recommandées   |

### Formules de calcul

#### Coûts Big Tech (5 ans)
```javascript
windows = licences_windows × nb_machines × 5
office = licences_office × nb_users × 5
google = google_workspace × nb_users × 5  // Si activé
renewal = nb_machines_obsoletes × prix_renouvellement

total_bigtech = windows + office + google + renewal
```

**Constantes utilisées** :
- Licence Windows : 150 €/an
- Licence Office : 100 €/an
- Google Workspace : 72 €/an (6€/mois)
- Renouvellement PC : 600 €

#### Coûts NIRD (5 ans)
```javascript
support = support_technique_annuel × 5
training = formation_ponctuelle × 1
server = serveur_local_optionnel  // 0 par défaut

total_nird = support + training + server
```

**Constantes utilisées** :
- Support technique : 3000 €/an
- Formation : 2000 € (unique)
- Serveur local : 5000 € (optionnel)

#### Impact Carbone
```javascript
machines_sauvees = nb_machines_obsoletes
co2_evite_kg = machines_sauvees × 200
arbres_equivalent = Math.round(co2_evite_kg / 22)
```

**Base** : 1 PC fabriqué = 200 kg CO2, 1 arbre absorbe 22 kg CO2/an

#### Score d'autonomie (0-100)
```javascript
score_logiciels = (logiciels_libres / logiciels_total) × 40
score_materiel = (materiel_linux / nb_machines) × 30
score_donnees = donnees_locales ? 20 : 0
score_competences = competences_internes ? 10 : 0

score_total = Math.round(
  score_logiciels + 
  score_materiel + 
  score_donnees + 
  score_competences
)
```

**Niveaux** :
- 80-100 : "Expert - Village Résistant"
- 60-79 : "Avancé - En bonne voie"
- 40-59 : "Intermédiaire - Premiers pas"
- 20-39 : "Débutant - Prise de conscience"
- 0-19 : "Dépendant - Empire numérique"

### Erreurs

**400 Bad Request** :
```json
{
  "error": "Message d'erreur descriptif"
}
```

**500 Internal Server Error** :
```json
{
  "error": "Erreur lors du calcul"
}
```

---

## 2. GET `/api/data/:type`

### Description
Récupère les données JSON statiques (témoignages, alternatives logicielles, quiz, constantes).

### Requête

**Method** : `GET`  
**URL Parameters** :

| Paramètre | Type   | Valeurs possibles                                   | Description                 |
| --------- | ------ | --------------------------------------------------- | --------------------------- |
| `type`    | string | `testimonials`, `alternatives`, `quiz`, `constants` | Type de données à récupérer |

### Endpoints disponibles

#### GET `/api/data/testimonials`

Récupère les témoignages d'établissements ayant adopté NIRD.

**Exemple** :
```bash
curl http://localhost:3000/api/data/testimonials
```

**Réponse** :
```json
[
  {
    "id": "lycee-carnot",
    "name": "Lycée Carnot de Bruay-la-Buissière",
    "type": "lycee",
    "location": "Hauts-de-France",
    "year": 2023,
    "image": "/images/testimonials/carnot.jpg",
    "quote": "Le passage au libre nous a permis d'économiser 40 000€ sur 3 ans...",
    "author": "Équipe NIRD du Lycée Carnot",
    "role": "Enseignants & Techniciens",
    "stats": {
      "savings": 40000,
      "machines": 150,
      "co2Saved": 30000
    },
    "videoUrl": "https://tube-numerique-educatif.apps.education.fr/...",
    "story": "Pionniers de la démarche NIRD..."
  },
  ...
]
```

**Structure** :
- Array de 3 objets
- Champs : id, name, type, location, year, quote, author, role, stats, videoUrl, story

#### GET `/api/data/alternatives`

Récupère les correspondances logiciels Big Tech ↔ NIRD.

**Exemple** :
```bash
curl http://localhost:3000/api/data/alternatives
```

**Réponse** :
```json
[
  {
    "category": "Bureautique",
    "bigTech": "Microsoft Office",
    "nird": "LibreOffice",
    "description": "Suite bureautique complète (traitement de texte, tableur, présentation)",
    "compatibility": "Fichiers .docx, .xlsx, .pptx",
    "difficulty": "Facile",
    "icon": "fa-file-word"
  },
  ...
]
```

**Structure** :
- Array de 10 objets
- Champs : category, bigTech, nird, description, compatibility, difficulty, icon

**Catégories** : Bureautique, Système d'exploitation, Navigateur, Messagerie, Visioconférence, Édition image, Montage vidéo, Stockage cloud, Développement, PDF

#### GET `/api/data/quiz`

Récupère les questions de quiz par niveau.

**Exemple** :
```bash
curl http://localhost:3000/api/data/quiz
```

**Réponse** :
```json
{
  "level1": {
    "title": "Ouvrir les yeux",
    "description": "Comprendre la dépendance numérique",
    "questions": [
      {
        "id": "q1_1",
        "question": "Windows 10 ne sera plus supporté par Microsoft en 2025...",
        "type": "true-false",
        "correct": true,
        "explanation": "Le support de Windows 10 prend fin en octobre 2025..."
      },
      {
        "id": "q1_3",
        "question": "La fabrication d'un ordinateur émet environ combien de kg de CO2 ?",
        "type": "multiple-choice",
        "options": ["20 kg", "50 kg", "200 kg", "500 kg"],
        "correct": 2,
        "explanation": "La fabrication d'un ordinateur émet environ 200 kg de CO2..."
      },
      ...
    ]
  },
  "level2": { ... },
  "level3": { ... }
}
```

**Structure** :
- Object avec clés `level1`, `level2`, `level3`
- Chaque niveau : title, description, questions[]
- Question : id, question, type, correct, explanation
- Types : `"true-false"` (correct = boolean) ou `"multiple-choice"` (correct = index)

#### GET `/api/data/constants`

Récupère toutes les constantes de calcul.

**Exemple** :
```bash
curl http://localhost:3000/api/data/constants
```

**Réponse** :
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
    "bronze": { "requirement": "3 niveaux complétés", "xp": 300 },
    "silver": { "requirement": "5 niveaux + partage", "xp": 500 },
    "gold": { "requirement": "Certification + carte", "xp": 1000 }
  },
  "levels": {
    "level1": { "xp": 100, "badge": "Éveillé Numérique" },
    "level2": { "xp": 100, "badge": "Explorateur du Libre" },
    "level3": { "xp": 100, "badge": "Artisan NIRD" },
    "level4": { "xp": 100, "badge": "Ambassadeur NIRD" },
    "level5": { "xp": 100, "badge": "Résistant Certifié" }
  }
}
```

### Erreurs

**404 Not Found** :
```json
{
  "error": "Données non trouvées"
}
```

Survient si le paramètre `:type` ne correspond à aucun fichier JSON valide.

---

## 3. GET `/` (Homepage)

### Description
Sert la page d'accueil statique.

**Requête** :
```bash
curl http://localhost:3000/
```

**Réponse** : HTML de `public/index.html`

---

## 4. Static Files

### Description
Tous les fichiers du dossier `/public` sont servis statiquement.

**Exemples** :
- `GET /index.html` → Page d'accueil
- `GET /css/style.css` → Feuille de style
- `GET /js/main.js` → JavaScript utilitaires
- `GET /images/logo.png` → Image (si présente)

---

## Codes de statut HTTP

| Code | Signification         | Cas d'usage           |
| ---- | --------------------- | --------------------- |
| 200  | OK                    | Requête réussie       |
| 400  | Bad Request           | Paramètres invalides  |
| 404  | Not Found             | Ressource introuvable |
| 500  | Internal Server Error | Erreur serveur        |

---

## CORS & Headers

**CORS** : Non configuré (même origine uniquement)  
**Content-Type** : `application/json` pour toutes les réponses API

---

## Rate Limiting

⚠️ **Aucun rate limiting implémenté actuellement**

Pour la production, ajouter `express-rate-limit` :

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requêtes par IP
});

app.use('/api/', limiter);
```

---

## Exemples d'intégration

### Vanilla JavaScript

```javascript
// Appel API calculate
async function calculateSavings(formData) {
  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const results = await response.json();
    displayResults(results);
  } catch (error) {
    console.error('Erreur:', error);
    NIRD.showToast('Erreur lors du calcul', 'error');
  }
}

// Appel API data
async function loadTestimonials() {
  const response = await fetch('/api/data/testimonials');
  const testimonials = await response.json();
  
  testimonials.forEach(t => {
    console.log(`${t.name}: ${t.stats.savings}€ économisés`);
  });
}
```

### jQuery (si utilisé)

```javascript
// POST calculate
$.ajax({
  url: '/api/calculate',
  type: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({ nbMachines: 100, nbUsers: 200 }),
  success: function(results) {
    console.log('Économies:', results.savings.amount);
  },
  error: function(xhr) {
    console.error('Erreur:', xhr.responseJSON.error);
  }
});

// GET data
$.getJSON('/api/data/alternatives', function(alternatives) {
  alternatives.forEach(alt => {
    console.log(`${alt.bigTech} → ${alt.nird}`);
  });
});
```

---

## Tests avec Postman

### Collection Postman

Créer une collection avec ces requêtes :

1. **Calculate Savings**
   - Method: POST
   - URL: `{{baseUrl}}/api/calculate`
   - Body: JSON avec paramètres

2. **Get Testimonials**
   - Method: GET
   - URL: `{{baseUrl}}/api/data/testimonials`

3. **Get Alternatives**
   - Method: GET
   - URL: `{{baseUrl}}/api/data/alternatives`

4. **Get Quiz**
   - Method: GET
   - URL: `{{baseUrl}}/api/data/quiz`

**Variables d'environnement** :
- `baseUrl`: `http://localhost:3000` (dev) ou `https://votre-app.vercel.app` (prod)

---

## Changelog API

### Version 1.0.0 (4 décembre 2025)
- ✅ Création endpoint `/api/calculate`
- ✅ Création endpoint `/api/data/:type`
- ✅ Support de 4 types de données
- ✅ Formules de calcul complètes
- ✅ Génération roadmap dynamique

---

*Dernière mise à jour : 4 décembre 2025*  
*Version API : 1.0.0*
