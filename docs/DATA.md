# 📊 Documentation des Données - NIRD Navigator Academy

## Structure des fichiers JSON

Tous les fichiers de données sont situés dans `/data/` et sont accessibles via l'API `/api/data/:type`.

---

## 1. `testimonials.json`

### Description
Témoignages d'établissements scolaires ayant adopté la démarche NIRD. Utilisé pour la page Ressources et comme preuve sociale.

### Structure

```json
[
  {
    "id": "string",              // Identifiant unique (kebab-case)
    "name": "string",            // Nom complet de l'établissement
    "type": "string",            // Type: "lycee" | "college"
    "location": "string",        // Région française
    "year": number,              // Année de mise en place
    "image": "string",           // Chemin vers image (relatif à /public)
    "quote": "string",           // Citation principale (1-2 phrases)
    "author": "string",          // Nom de l'auteur du témoignage
    "role": "string",            // Fonction de l'auteur
    "stats": {
      "savings": number,         // Économies réalisées (€)
      "machines": number,        // Nombre de machines concernées
      "co2Saved": number         // kg de CO2 économisés
    },
    "videoUrl": "string",        // URL vidéo YouTube/PeerTube (optionnel)
    "story": "string"            // Histoire complète (paragraphe)
  }
]
```

### Données actuelles

**3 établissements** :

1. **Lycée Carnot** (Bruay-la-Buissière, Hauts-de-France)
   - Économies : 40 000 €
   - Machines : 150
   - CO2 économisé : 30 000 kg
   - Vidéo : Oui

2. **Collège Einstein** (Île-de-France)
   - Économies : 15 000 €
   - Machines : 50
   - CO2 économisé : 10 000 kg

3. **Lycée Voltaire** (Auvergne-Rhône-Alpes)
   - Économies : 25 000 €
   - Machines : 100
   - CO2 économisé : 20 000 kg

### Utilisation

```javascript
// Récupérer tous les témoignages
const response = await fetch('/api/data/testimonials');
const testimonials = await response.json();

// Filtrer par type
const lycees = testimonials.filter(t => t.type === 'lycee');

// Afficher
testimonials.forEach(t => {
  console.log(`${t.name}: ${t.stats.savings.toLocaleString()}€ économisés`);
});
```

### Ajout d'un nouveau témoignage

```json
{
  "id": "college-nouveau",
  "name": "Collège Nouveau",
  "type": "college",
  "location": "Bretagne",
  "year": 2024,
  "image": "/images/testimonials/nouveau.jpg",
  "quote": "La transition vers le libre a été plus simple que prévu.",
  "author": "Jean Dupont",
  "role": "Principal",
  "stats": {
    "savings": 12000,
    "machines": 40,
    "co2Saved": 8000
  },
  "videoUrl": "",
  "story": "Notre établissement a commencé la transition en septembre 2024..."
}
```

---

## 2. `alternatives.json`

### Description
Correspondances entre logiciels propriétaires (Big Tech) et leurs alternatives libres (NIRD). Utilisé pour la page Academy niveau 2 et la page Ressources.

### Structure

```json
[
  {
    "category": "string",        // Catégorie fonctionnelle
    "bigTech": "string",         // Nom du logiciel propriétaire
    "nird": "string",            // Alternative libre
    "description": "string",     // Description courte (1 phrase)
    "compatibility": "string",   // Formats/protocoles compatibles
    "difficulty": "string",      // Difficulté: "Facile" | "Moyen" | "Avancé"
    "icon": "string"             // Classe Font Awesome (ex: "fa-file-word")
  }
]
```

### Catégories disponibles

1. **Bureautique** : Microsoft Office → LibreOffice
2. **Système d'exploitation** : Windows → Linux Ubuntu/Mint
3. **Navigateur** : Google Chrome → Firefox/Chromium
4. **Messagerie** : Gmail/Outlook → Thunderbird
5. **Visioconférence** : Teams/Zoom → Jitsi Meet/BigBlueButton
6. **Édition image** : Adobe Photoshop → GIMP
7. **Montage vidéo** : Adobe Premiere → Kdenlive/Shotcut
8. **Stockage cloud** : Google Drive/OneDrive → Nextcloud
9. **Développement** : Visual Studio → VS Code/Geany
10. **PDF** : Adobe Acrobat → PDF Arranger/Okular

### Utilisation

```javascript
// Récupérer toutes les alternatives
const alternatives = await fetch('/api/data/alternatives').then(r => r.json());

// Grouper par catégorie
const byCategory = alternatives.reduce((acc, alt) => {
  if (!acc[alt.category]) acc[alt.category] = [];
  acc[alt.category].push(alt);
  return acc;
}, {});

// Filtrer par difficulté
const faciles = alternatives.filter(a => a.difficulty === 'Facile');

// Créer un mini-jeu de correspondance
const game = alternatives.map(a => ({
  question: `Quelle est l'alternative libre à ${a.bigTech} ?`,
  answer: a.nird
}));
```

### Ajout d'une nouvelle alternative

```json
{
  "category": "Conception 3D",
  "bigTech": "AutoCAD",
  "nird": "FreeCAD",
  "description": "Conception assistée par ordinateur 3D paramétrique",
  "compatibility": "Formats DXF, STEP, STL",
  "difficulty": "Avancé",
  "icon": "fa-cube"
}
```

---

## 3. `quiz.json`

### Description
Questions de quiz pour les 5 niveaux de l'Académie NIRD. Chaque niveau a un thème et un objectif pédagogique.

### Structure globale

```json
{
  "level1": {
    "title": "string",           // Titre du niveau
    "description": "string",     // Description courte
    "questions": [...]           // Array de questions
  },
  "level2": { ... },
  "level3": { ... },
  "level4": { ... },  // À créer
  "level5": { ... }   // À créer
}
```

### Structure d'une question

#### Type: True/False

```json
{
  "id": "string",                // Identifiant unique (ex: "q1_1")
  "question": "string",          // Énoncé de la question
  "type": "true-false",
  "correct": boolean,            // true ou false
  "explanation": "string"        // Explication pédagogique
}
```

#### Type: Multiple Choice (QCM)

```json
{
  "id": "string",
  "question": "string",
  "type": "multiple-choice",
  "options": ["string", ...],    // Array de 2-4 options
  "correct": number,             // Index de la bonne réponse (0-based)
  "explanation": "string"
}
```

### Niveaux actuels

#### Niveau 1 : "Ouvrir les yeux"
**Objectif** : Comprendre la dépendance numérique  
**Questions** : 5  
**Thèmes** : Obsolescence programmée, impact CO2, coûts licences

**Exemple** :
```json
{
  "id": "q1_3",
  "question": "La fabrication d'un ordinateur émet environ combien de kg de CO2 ?",
  "type": "multiple-choice",
  "options": ["20 kg", "50 kg", "200 kg", "500 kg"],
  "correct": 2,
  "explanation": "La fabrication d'un ordinateur émet environ 200 kg de CO2..."
}
```

#### Niveau 2 : "Découvrir les alternatives"
**Objectif** : Connaître les solutions libres  
**Questions** : 5  
**Thèmes** : Logiciels libres, alternatives Big Tech, coûts

**Exemple** :
```json
{
  "id": "q2_1",
  "question": "Quel est l'équivalent libre de Microsoft Word ?",
  "type": "multiple-choice",
  "options": ["LibreOffice Writer", "Google Docs", "Notepad++", "Vim"],
  "correct": 0,
  "explanation": "LibreOffice Writer est l'alternative libre complète..."
}
```

#### Niveau 3 : "Passer à l'action"
**Objectif** : Identifier les étapes de transition  
**Questions** : 5  
**Thèmes** : Stratégie de migration, freins, timeline, communauté

**Exemple** :
```json
{
  "id": "q3_1",
  "question": "Par où commencer une transition vers NIRD ?",
  "type": "multiple-choice",
  "options": [
    "Remplacer tous les PC en une fois",
    "Tester sur quelques machines pilotes",
    "Former uniquement les élèves",
    "Acheter de nouveaux serveurs"
  ],
  "correct": 1,
  "explanation": "Il faut toujours commencer par une phase pilote..."
}
```

### Niveaux à créer

#### Niveau 4 : "Embarquer son établissement" (À FAIRE)
**Objectif** : Communication et pilotage de projet  
**Questions suggérées** : 5-7  
**Thèmes** : Pitch, argumentation, gestion résistance au changement

#### Niveau 5 : "Rejoindre la communauté" (À FAIRE)
**Objectif** : Contribuer et essaimer  
**Questions suggérées** : 5-7  
**Thèmes** : Partage d'expérience, forum, carte établissements

### Utilisation

```javascript
// Charger les quiz
const quizData = await fetch('/api/data/quiz').then(r => r.json());

// Récupérer un niveau
const level1 = quizData.level1;
console.log(level1.title); // "Ouvrir les yeux"

// Mélanger les questions
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
const randomQuestions = shuffle([...level1.questions]);

// Calculer le score
let score = 0;
let userAnswers = [true, 1, 2, false, 0]; // Exemple réponses utilisateur

level1.questions.forEach((q, i) => {
  if (q.correct === userAnswers[i]) {
    score++;
  }
});

console.log(`Score: ${score}/${level1.questions.length}`);
```

### Ajout de questions

```json
{
  "id": "q4_1",
  "question": "Quel argument est le plus efficace pour convaincre une direction ?",
  "type": "multiple-choice",
  "options": [
    "L'aspect écologique",
    "Les économies financières",
    "La modernité de l'approche",
    "La conformité RGPD"
  ],
  "correct": 1,
  "explanation": "Les économies financières sont généralement l'argument décisif..."
}
```

---

## 4. `constants.json`

### Description
Toutes les constantes numériques utilisées pour les calculs, la gamification et la configuration. Centralisé pour faciliter les ajustements.

### Structure

```json
{
  "pricing": {
    "windowsLicense": number,       // Prix licence Windows annuel (€)
    "officeLicense": number,        // Prix licence Office annuel (€)
    "googleWorkspace": number,      // Prix Google Workspace annuel (€)
    "techSupportYear": number,      // Coût support technique annuel (€)
    "trainingOneTime": number,      // Coût formation ponctuelle (€)
    "localServerOptional": number,  // Coût serveur local optionnel (€)
    "pcRenewalCost": number         // Coût renouvellement PC (€)
  },
  "carbon": {
    "co2PerPcKg": number,           // kg CO2 fabrication 1 PC
    "kgPerTree": number             // kg CO2 absorbé par arbre/an
  },
  "projectionYears": number,        // Durée projection calculs
  "autonomyWeights": {
    "software": number,             // Poids logiciels dans score (40)
    "hardware": number,             // Poids matériel dans score (30)
    "dataStorage": number,          // Poids données dans score (20)
    "skills": number                // Poids compétences dans score (10)
  },
  "badges": {
    "bronze": {
      "requirement": "string",      // Condition déblocage
      "xp": number                  // XP requis
    },
    "silver": { ... },
    "gold": { ... }
  },
  "levels": {
    "level1": {
      "xp": number,                 // XP gagné
      "badge": "string"             // Nom du badge
    },
    "level2": { ... },
    ...
  }
}
```

### Valeurs actuelles

#### Pricing (Tarifs éducation 2025)
```json
{
  "windowsLicense": 150,        // €/an/machine
  "officeLicense": 100,         // €/an/utilisateur
  "googleWorkspace": 72,        // €/an/utilisateur (6€/mois)
  "techSupportYear": 3000,      // €/an pour support NIRD
  "trainingOneTime": 2000,      // € formation initiale
  "localServerOptional": 5000,  // € serveur Nextcloud
  "pcRenewalCost": 600          // € par PC neuf
}
```

#### Carbon
```json
{
  "co2PerPcKg": 200,            // Fabrication PC = 200 kg CO2
  "kgPerTree": 22               // 1 arbre absorbe 22 kg/an
}
```

#### Autonomy Weights
```json
{
  "software": 40,               // 40% du score = logiciels
  "hardware": 30,               // 30% = matériel Linux
  "dataStorage": 20,            // 20% = données locales
  "skills": 10                  // 10% = compétences internes
}
```
**Total = 100 points**

#### Badges
```json
{
  "bronze": {
    "requirement": "3 niveaux complétés",
    "xp": 300
  },
  "silver": {
    "requirement": "5 niveaux + partage",
    "xp": 500
  },
  "gold": {
    "requirement": "Certification + carte",
    "xp": 1000
  }
}
```

#### Levels (5 niveaux × 100 XP)
```json
{
  "level1": { "xp": 100, "badge": "Éveillé Numérique" },
  "level2": { "xp": 100, "badge": "Explorateur du Libre" },
  "level3": { "xp": 100, "badge": "Artisan NIRD" },
  "level4": { "xp": 100, "badge": "Ambassadeur NIRD" },
  "level5": { "xp": 100, "badge": "Résistant Certifié" }
}
```

### Utilisation

```javascript
// Charger les constantes
const constants = await fetch('/api/data/constants').then(r => r.json());

// Utiliser dans les calculs
const cout5ans = constants.pricing.windowsLicense * nbMachines * constants.projectionYears;

// Vérifier les seuils de badges
function getBadge(xp) {
  if (xp >= constants.badges.gold.xp) return 'gold';
  if (xp >= constants.badges.silver.xp) return 'silver';
  if (xp >= constants.badges.bronze.xp) return 'bronze';
  return 'none';
}

// Calculer XP total des niveaux
const totalXP = Object.values(constants.levels)
  .reduce((sum, level) => sum + level.xp, 0);
console.log(`XP max: ${totalXP}`); // 500
```

### Ajustement des valeurs

Pour mettre à jour les prix (par exemple après inflation) :

1. Modifier `data/constants.json`
2. Pas besoin de redémarrer le serveur (rechargé dynamiquement)
3. Les calculs utilisent automatiquement les nouvelles valeurs

**Exemple** :
```json
{
  "pricing": {
    "windowsLicense": 165,  // +10% inflation
    "officeLicense": 110,   // +10%
    ...
  }
}
```

---

## Validation des données

### Schémas JSON (optionnel)

Pour valider les données, utiliser JSON Schema :

```javascript
// Exemple schema testimonials
const testimonialSchema = {
  type: "object",
  required: ["id", "name", "type", "stats"],
  properties: {
    id: { type: "string", pattern: "^[a-z-]+$" },
    name: { type: "string", minLength: 3 },
    type: { type: "string", enum: ["lycee", "college"] },
    year: { type: "number", minimum: 2020, maximum: 2030 },
    stats: {
      type: "object",
      required: ["savings", "machines", "co2Saved"],
      properties: {
        savings: { type: "number", minimum: 0 },
        machines: { type: "number", minimum: 1 },
        co2Saved: { type: "number", minimum: 0 }
      }
    }
  }
};
```

---

## Performance

### Taille des fichiers
- `testimonials.json` : ~2 KB
- `alternatives.json` : ~3 KB
- `quiz.json` : ~8 KB
- `constants.json` : ~1 KB

**Total : ~14 KB** - Très léger, chargement instantané.

### Optimisations possibles
- ✅ Pas de base de données nécessaire
- ✅ Fichiers mis en cache par le navigateur
- ⚠️ Pour > 100 témoignages : paginer
- ⚠️ Pour > 50 questions/niveau : charger à la demande

---

## Maintenance

### Ajout de contenu

**Témoignages** : Contacter établissements NIRD, recueillir stats réelles

**Alternatives** : Tester logiciels, vérifier compatibilité

**Quiz** : Valider auprès d'enseignants, tester compréhension élèves

**Constantes** : Mettre à jour annuellement (inflation, nouveaux tarifs)

### Sources de données

- **Témoignages** : Site NIRD officiel, vidéos lycée Carnot
- **Prix** : Tarifs éducation Microsoft, Google Workspace Éducation
- **CO2** : ADEME, études cycle de vie matériel informatique
- **Logiciels** : Documentation officielle projets libres

---

*Dernière mise à jour : 4 décembre 2025*  
*Version données : 1.0.0*
