# 🛡️ NIRD Navigator Academy - Projet Nuit de l'Info 2025

## 🎯 Concept

**Une plateforme web interactive pour accompagner les établissements scolaires vers l'autonomie numérique**

Combinaison d'un outil d'aide à la décision intelligent (Navigator) et d'une académie d'apprentissage gamifiée pour promouvoir la démarche NIRD (Numérique Inclusif, Responsable et Durable).

### Tagline
> "De l'Empire Big Tech au Village Numérique Résistant - Votre parcours vers l'autonomie"

---

## 🎨 Vision & Thématique

**Inspiration : Astérix et le Village Gaulois**
- L'établissement = village résistant face à l'empire numérique
- Les solutions NIRD = potions magiques
- La communauté = force collective contre Goliath

**Ambiance :**
- Visuel coloré et engageant (pas austère)
- Ton décalé et humoristique
- Pédagogie par l'action et le jeu
- Données concrètes et chiffrées

---

## 🏗️ Architecture du Projet

### **Module 1 : Page d'Accueil "Le Village"**
- Animation d'introduction (village vs empire)
- 3 portes d'entrée selon profil :
  - 🎓 **Élève/Éco-délégué** : "Comprendre et agir"
  - 👨‍🏫 **Enseignant/Direction** : "Diagnostiquer et planifier"
  - 🏛️ **Collectivité** : "Investir intelligemment"
- Compteurs statiques : Stats NIRD (établissements, économies, impact)
- Liens vers ressources officielles NIRD

### **Module 2 : NIRD Navigator (Diagnostic & Plan d'Action)**
**Formulaire intelligent multi-étapes :**
1. **Profil établissement**
   - Type (collège/lycée), taille, budget IT annuel
   - Matériel actuel (nombre PC, âge moyen)
   - Logiciels utilisés (Windows, Office, Google Workspace...)

2. **État actuel**
   - Niveau de dépendance Big Tech (score auto)
   - Problèmes rencontrés (obsolescence, coûts, données...)
   - Compétences techniques internes

3. **Objectifs**
   - Motivations (économie, écologie, pédagogie, autonomie)
   - Timeline souhaitée (1-5 ans)
   - Niveau d'ambition

**Génération automatique :**
- 📊 **Tableau de bord comparatif**
  - Scénario Big Tech vs Scénario NIRD (5 ans)
  - Graphiques : coûts, CO2, matériel sauvé
  
- 🗺️ **Roadmap personnalisée**
  - Phases : Sensibilisation → Expérimentation → Déploiement → Autonomie
  - Actions concrètes par phase
  - Ressources et contacts
  
- 📄 **Kit de communication**
  - Argumentaire pour direction/collectivité
  - Présentation PDF téléchargeable
  - Infographies partageables

- 🔗 **Lien unique de partage**
  - Diagnostic sauvegardé
  - Suivi de progression

### **Module 3 : L'Académie NIRD (Apprentissage Gamifié)**
**5 Niveaux d'apprentissage :**

#### **Niveau 1 : "Ouvrir les yeux"** 🔍
- Quiz : "Dépendance numérique - vrai/faux"
- Infographie animée sur l'obsolescence programmée
- Vidéo : témoignage lycée Carnot (intégrée)
- **Badge débloqué :** "Éveillé Numérique"

#### **Niveau 2 : "Découvrir les alternatives"** 💡
- Mini-jeu : associer logiciels proprio ↔ libres
- Démo interactive : "Linux en 3 clics"
- Calculatrice d'économies simplifiée
- **Badge débloqué :** "Explorateur du Libre"

#### **Niveau 3 : "Passer à l'action"** 🛠️
- Tutoriel interactif : installer Linux sur vieux PC
- Quiz : identifier les freins et solutions
- Galerie de success stories filtrables
- **Badge débloqué :** "Artisan NIRD"

#### **Niveau 4 : "Embarquer son établissement"** 🚀
- Générateur de pitch personnalisé
- Checklist étapes clés projet NIRD
- Simulateur de réunion (dialogues à choix)
- **Badge débloqué :** "Ambassadeur NIRD"

#### **Niveau 5 : "Rejoindre la communauté"** 🤝
- Carte interactive des établissements NIRD
- Forum/espace questions-réponses
- Partage d'expérience (formulaire)
- **Badge débloqué :** "Résistant Certifié"

**Système de progression :**
- Points XP par activité
- **Certificat NIRD téléchargeable** (PDF)
- **Partage sur réseaux sociaux**

### **Module 4 : Ressources & Inspiration**
- 📚 **Bibliothèque statique** : liens vers tutoriels NIRD officiels
- 🎥 **Galerie vidéos** : intégration des vidéos lycée Carnot (YouTube embed)
- 📰 **Témoignages** : 3-5 success stories présentées (contenu fixe)
- 🔗 **Liens utiles** : site NIRD, documentation, contacts

### **Module 5 : Boîte à Outils**
- **Comparateur express** : widget simple Big Tech vs NIRD
- **Check-list PDF** : guide de démarrage NIRD téléchargeable
- **Liste matériel** : tableau statique de matériel compatible Linux
- **Glossaire** : définitions des termes techniques

## 🔧 Stack Technique

### **Backend (Simple)**
```javascript
- Node.js v18+ (serveur de fichiers statiques)
- Express.js minimal (servir HTML + route API simple)
- JSON files (stockage données)
- Pas de templating serveur (tout en frontend)
```

### **Frontend (Vanilla - Débutant Friendly)**
```javascript
- HTML pur (pages séparées)
- CSS vanilla + Tailwind via CDN (styling facile)
- JavaScript pur (pas de framework)
- Chart.js via CDN (graphiques)
- localStorage (sauvegarde progression)
- Font Awesome via CDN (icônes)
```

### **Architecture Simplifiée**
```
Frontend : HTML/CSS/JS statiques
Backend  : Express minimal (API calculs + servir fichiers)
Data     : Fichiers JSON
```

### **Déploiement (Zero Config)**
- **Hébergement :** Vercel (recommandé) / Netlify / Render
- **Base de données :** AUCUNE - localStorage côté client
- **Assets :** Tous dans /public
- **Deploy :** Git push = auto-deploy (ou drag&drop)

### **Dépendances npm (MINIMUM)**
```json
{
  "dependencies": {
    "express": "^4.18.2"  // C'EST TOUT !
  }
}
```

---

## 📂 Structure du Projet (Simplifiée - Vanilla JS)

```
nird-navigator-academy/
├── server.js                 # Serveur Express minimal (50 lignes)
├── package.json
├── README.md
│
├── api/                      # Logique backend simple
│   └── calculator.js         # Calculs économies/CO2
│
├── data/                     # Données JSON
│   ├── testimonials.json     # 3-5 success stories
│   ├── alternatives.json     # Logiciels Big Tech → NIRD
│   ├── quiz.json             # Questions quiz par niveau
│   └── constants.json        # Prix, facteurs calcul
│
├── public/                   # Frontend statique
│   │
│   ├── index.html            # Page accueil
│   ├── navigator.html        # Page diagnostic
│   ├── results.html          # Page résultats
│   ├── academy.html          # Dashboard academy
│   ├── level1.html           # Niveau 1
│   ├── level2.html           # Niveau 2
│   ├── level3.html           # Niveau 3
│   ├── level4.html           # Niveau 4
│   ├── level5.html           # Niveau 5
│   ├── resources.html        # Page ressources
│   │
│   ├── css/
│   │   ├── style.css         # Styles personnalisés
│   │   └── components.css    # Composants réutilisables
│   │
│   ├── js/
│   │   ├── main.js           # Fonctions communes (navigation, etc.)
│   │   ├── navigator.js      # Logique formulaire & calculs
│   │   ├── results.js        # Affichage résultats + graphiques
│   │   ├── academy.js        # Gestion progression & badges
│   │   ├── quiz.js           # Logique quiz interactifs
│   │   └── storage.js        # Gestion localStorage
│   │
│   ├── images/
│   │   ├── hero/             # Images page accueil
│   │   ├── badges/           # Badges Academy
│   │   ├── levels/           # Illustrations niveaux
│   │   └── testimonials/     # Photos témoignages
│   │
│   └── assets/
│       ├── icons/            # Icônes custom SVG
│       └── fonts/            # Polices locales (optionnel)
│
└── .tools/                   # Scripts helper (voir instructions)
    └── generate-pdf.js       # Script génération PDF (optionnel)
```

---

## 📊 Fonctionnalités Détaillées

### **Calculs Navigator**

#### Économies financières (sur 5 ans)
```javascript
// Exemple de calcul
BigTech = (licences_windows * nb_machines * 5) 
        + (licences_office * nb_users * 5)
        + (renouvellement_materiel * prix_moyen)
        + (google_workspace * nb_users * 5)

NIRD = (support_technique * 5)
     + (formation_equipes * 1)
     + (serveur_local optionnel)

Économie = BigTech - NIRD
```

#### Impact Carbone
```javascript
// kg CO2 économisés
machines_sauvées = nb_machines_obsolètes_windows10
kg_CO2_par_machine = 200 (fabrication)
total_CO2_évité = machines_sauvées * kg_CO2_par_machine
```

#### Score d'autonomie (0-100)
```javascript
score = 
  + (logiciels_libres / logiciels_total) * 40
  + (materiel_linux / materiel_total) * 30
  + (donnees_locales ? 20 : 0)
  + (competences_internes ? 10 : 0)
```

### **Système de Badges Academy**
- Bronze : 3 niveaux complétés
- Argent : 5 niveaux + partage d'expérience
- Or : Certification + établissement inscrit sur carte

### **Endpoints simples (optionnels)**
```
POST /api/calculate             # Calcul économies (form submit)
GET  /api/data/:type            # Récupérer données JSON
```
## ⏱️ Planning Nuit de l'Info (12h) - Adapté débutants

### **Phase 1 : Setup & Structure (1h) - 19h→20h**
- Init projet Node.js simple (Express + dossiers)
- Créer structure HTML de base pour toutes les pages
- Setup Tailwind via CDN
- Design système (couleurs, variables CSS)

**Répartition équipe :**
- 1 dev : Backend Express + fichiers JSON
- 2 devs : HTML de toutes les pages (squelettes)
- 1 dev : CSS de base + composants réutilisables

### **Phase 2 : Pages Statiques (2h) - 20h→22h**
- Page accueil complète (hero + 3 portails)
- Page ressources (vidéos + témoignages)
- Header + Footer + Navigation
- CSS responsive de base

**Répartition équipe :**
- 2 devs : HTML/CSS pages
- 1 dev : Navigation JavaScript + animations
- 1 dev : Préparer données JSON

### **Phase 3 : Navigator (2h30) - 22h→00h30**
- Formulaire multi-étapes (HTML/JS vanilla)
- Logique de calculs (JavaScript + API backend)
- Page résultats avec graphiques (Chart.js)
- LocalStorage pour sauvegarder

**Répartition équipe :**
- 2 devs : Formulaire + validation JS
- 1 dev : Backend API calculs
- 1 dev : Page résultats + graphiques

### **🍕 PAUSE (30min) - 00h30→01h00**

### **Phase 4 : Academy (2h30) - 01h00→03h30**
- Dashboard Academy (progression, badges)
- 5 pages de niveaux (HTML)
- Quiz interactifs (JavaScript)
- Système de points/badges (localStorage)

**Répartition équipe :**
- 2 devs : Pages niveaux + quiz
- 1 dev : Logique progression/badges
- 1 dev : Design badges + animations

### **Phase 5 : Polish & Responsive (1h30) - 03h30→05h00**
- Responsive mobile toutes les pages
- Animations CSS simples
- Intégration contenu (textes, images, vidéos)
- Tests navigation

**Répartition équipe :**
- Tous : Chacun responsive ses pages

### **Phase 6 : Debug & Tests (1h) - 05h00→06h00**
- Tests sur différents navigateurs
- Fix bugs
- Optimisation images
- Vérification liens

### **Phase 7 : Déploiement (1h) - 06h00→07h00**
- Push GitHub
- Déploiement Vercel/Netlify (super simple)
- Tests en ligne
- README + screenshots

### **Bonus si temps (30min) - 07h00→07h30**
- Easter eggs
- Mode sombre
- Export PDF
- Vidéo démo

---

## 🎯 MVP (Minimum Viable Product)

**Si manque de temps, prioriser :**

✅ **Must Have - Version Présentable (6h)**
1. Page accueil attractive avec navigation
2. Formulaire Navigator (3-4 étapes)
3. Page résultats avec 2 graphiques
4. 3 niveaux Academy avec quiz simples
5. Page ressources basique
6. Site déployé en ligne

⚡ **Should Have - Version Complète (+ 3h)**
7. 5 niveaux Academy complets
8. Système badges + localStorage
9. Roadmap personnalisée affichée
10. Animations CSS simples
11. Responsive parfait mobile

🌟 **Nice to Have - Version Polish (+ 3h)**
12. Graphiques avancés (5+ types)
13. Export résultats (PDF ou image)
14. Easter eggs thème Astérix
15. Mode sombre
16. Animations complexes

### **Palette de couleurs**
```css
/* Thème Village Résistant */
--primary: #2563eb      /* Bleu audacieux */
--secondary: #dc2626    /* Rouge résistance */
--accent: #fbbf24       /* Or potion magique */
--success: #10b981      /* Vert autonomie */
--neutral: #64748b      /* Gris moderne */
--bg-light: #f8fafc
--bg-dark: #1e293b
```

### **Typographie**
```css
--font-heading: 'Poppins', sans-serif  /* Titres */
--font-body: 'Inter', sans-serif       /* Corps */
--font-mono: 'JetBrains Mono', monospace /* Code */
```

### **Composants clés**
- Cards avec hover effects
- Progress bars animées
- Badges dynamiques
- Modals pour quiz/énigmes
- Tooltips pédagogiques
- Notifications toast

---

## 📈 Métriques de Succès

**Critères d'évaluation Nuit de l'Info :**
- ✅ Application fonctionnelle en ligne
- ✅ Expérience ludique et engageante
- ✅ Utilité pédagogique réelle
- ✅ Promotion effective de NIRD
- ✅ Originalité et créativité
- ✅ Qualité technique
- ✅ Ressources libres de droit
- ✅ Licence libre

**Objectifs quantifiables :**
- Temps moyen sur site : > 5 min
- Taux de completion diagnostic : > 70%
- Niveaux Academy complétés : moyenne 2-3
- Partages sociaux : 50+
- Feedback positif jury : 🎯

---

## 📄 Licence & Ressources

### **Licence du projet**
- **Code :** MIT License
- **Contenus :** CC BY-SA 4.0

### **Ressources libres utilisées**
- **Icônes :** Font Awesome (Free), Heroicons
- **Illustrations :** unDraw, Storyset
- **Polices :** Google Fonts
- **Photos :** Unsplash, Pexels
- **Données :** Site officiel NIRD

### **Crédits**
- Collectif NIRD
- Lycée Carnot de Bruay-la-Buissière
- Forge des Communs Numériques Éducatifs
- Équipe Nuit de l'Info 2025

---

## 🚀 Quick Start (Super Simple)

```bash
# Installation
git clone https://github.com/votre-equipe/nird-navigator-academy.git
cd nird-navigator-academy
npm install

# Lancer le serveur
node server.js

# Ouvrir dans le navigateur
# http://localhost:3000
```

### **package.json minimal**

```json
{
  "name": "nird-navigator-academy",
  "version": "1.0.0",
  "description": "Plateforme NIRD - Nuit de l'Info 2025",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "license": "MIT"
}
```

### **Déploiement ultra-simple**

**Option 1 : Vercel (recommandé pour débutants)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer (1 commande)
vercel

# Suivre les instructions (Enter Enter Enter)
```

**Option 2 : Netlify**
```bash
# Drag & drop du dossier public/ sur netlify.com
# ou
npm i -g netlify-cli
netlify deploy
```

**Option 3 : Render.com**
- Connecter repo GitHub
- Auto-détecte Node.js
- Deploy automatique

**URL de démo :** À venir après déploiement

---

## 👥 Équipe & Rôles Suggérés (Adapté Débutants)

### **Équipe de 4 personnes**

**👤 Personne 1 - "Chef d'orchestre" (intermédiaire/avancé)**
- Setup projet initial
- Backend Express simple
- Aide les autres si bloqués
- Déploiement final

**👤 Personne 2 - "Pages Navigator"**
- HTML/CSS pages formulaire et résultats
- JavaScript formulaire (validation, étapes)
- Intégration Chart.js pour graphiques

**👤 Personne 3 - "Pages Academy"**
- HTML/CSS des 5 niveaux
- Quiz JavaScript
- Système badges (localStorage)

**👤 Personne 4 - "Design & Contenu"**
- Page accueil + ressources
- CSS global + responsive
- Préparer contenus (textes, images)
- Données JSON (quiz, témoignages)

### **Équipe de 5 personnes**

Même répartition + **Personne 5** :
- Animations CSS/JS
- LocalStorage (sauvegarde)
- Export PDF/image
- Tests & debug

---

## 💡 Conseils pour Débutants

### **🎓 Technologies à apprendre AVANT la nuit (2-3h)**

1. **HTML/CSS de base** (1h)
   - Balises principales
   - Flexbox / Grid basics
   - Classes CSS

2. **JavaScript vanilla** (1h)
   - Variables, fonctions
   - DOM manipulation (querySelector, addEventListener)
   - fetch API
   - localStorage

3. **Node.js/Express minimal** (30min)
   - Créer serveur
   - Servir fichiers statiques
   - Route POST simple

4. **Git basics** (30min)
   - clone, add, commit, push
   - Branches simples

### **📚 Ressources Express**

- HTML/CSS : https://htmlcheatsheet.com/
- JavaScript : https://javascript.info/
- Express : https://expressjs.com/en/starter/hello-world.html
- Chart.js : https://www.chartjs.org/docs/latest/getting-started/
- Tailwind : https://tailwindcss.com/docs

### **🔧 Setup Environnement Débutant**

**IDE recommandé :**
- VS Code + extensions :
  - Live Server
  - Prettier
  - Auto Rename Tag

**Navigateur :**
- Chrome + DevTools ouverts (F12)

**Terminal :**
- Git Bash (Windows) ou Terminal (Mac/Linux)

### **⚠️ Pièges à éviter**

❌ **Ne PAS faire :**
- Utiliser React/Vue/Angular (trop complexe)
- Setup Webpack/Vite (pas nécessaire)
- Base de données (localStorage suffit)
- Authentification (pas demandé)
- Tests unitaires (pas le temps)

✅ **À FAIRE :**
- Rester simple
- Copier/coller code qui marche
- Utiliser CDN (pas de npm install complexe)
- Commit souvent
- Tester dans le navigateur régulièrement

### **🆘 Déblocage Rapide**

**Si bloqué > 15min :**
1. Console navigateur (F12) → lire l'erreur
2. Google l'erreur exacte
3. Demander à ChatGPT/Copilot
4. Appeler le "Chef d'orchestre"
5. Simplifier : version plus basique

**Phrase magique :**
> "Fait marcher > Fait beau > Fait optimisé"

*Équipe de 4-5 personnes recommandée*



---

## 💡 Points de Différenciation

**Ce qui rend ce projet unique :**
1. ✨ **Approche hybride** : outil utile + apprentissage ludique
2. 📊 **Données concrètes** : calculs réalistes, pas de bluff
3. 🎮 **Gamification intelligente** : pas gadget, vraiment pédagogique
4. 🤝 **Focus communauté** : partage, entraide, essaimage
5. 🎨 **Identité forte** : thème Astérix cohérent et engageant
6. 🔧 **Open Source** : code réutilisable par autres initiatives
7. 🌍 **Impact réel** : outil déployable post-hackathon

---

## 📞 Contacts & Liens

- **Site NIRD :** https://nird.forge.apps.education.fr/
- **GitHub Projet :** (à créer)
- **Discord équipe :** (à créer)
- **Trello/Notion :** (à créer pour suivi)

---

## 🎉 Message de l'équipe

> "Nous créons plus qu'une application : nous construisons un pont entre la prise de conscience et l'action concrète. Chaque ligne de code est un acte de résistance numérique pour une école plus autonome, plus durable, plus libre."
>
> **Bon courage à tous les participants ! 🚀**

---

**Dernière mise à jour :** 4 décembre 2025
**Version :** 1.0 - Projet Nuit de l'Info 2025
