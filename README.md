# 🛡️ NIRD Navigator Academy

**Plateforme web interactive pour accompagner les établissements scolaires vers l'autonomie numérique**

Projet développé pour la **Nuit de l'Info 2025** par l'équipe UPSEJ.

---

## 🎯 Concept

NIRD Navigator Academy combine :
- **🧭 NIRD Navigator** : Diagnostic intelligent de dépendance Big Tech + calculs d'économies
- **🎓 Académie NIRD** : Parcours d'apprentissage gamifié en 5 niveaux
- **📚 Ressources** : Témoignages, vidéos, documentation NIRD

**Tagline** : *"De l'Empire Big Tech au Village Numérique Résistant"*

---

## 🚀 Quick Start

### Installation

```bash
# Cloner le repo
git clone https://github.com/UPSEJ-NuitInfo/nird.git
cd nird

# Installer les dépendances
npm install

# Lancer le serveur
npm start
```

Le site sera accessible sur **http://localhost:3000**

### Structure du projet

```
nird/
├── server.js              # Serveur Express minimal
├── api/
│   └── calculator.js      # Calculs économies/CO2
├── data/
│   ├── testimonials.json  # Témoignages
│   ├── alternatives.json  # Logiciels Big Tech → NIRD
│   ├── quiz.json          # Questions quiz
│   └── constants.json     # Constantes de calcul
├── public/
│   ├── index.html         # Page d'accueil
│   ├── css/               # Styles CSS
│   ├── js/                # JavaScript vanilla
│   └── images/            # Assets visuels
└── .tools/                # Scripts utilitaires
```

---

## 🔧 Stack Technique

**Backend** : Node.js + Express.js (minimal)  
**Frontend** : HTML5 + CSS3 + JavaScript vanilla  
**Styling** : Tailwind CSS (CDN)  
**Charts** : Chart.js (CDN)  
**Storage** : localStorage (client-side)  
**Icons** : Font Awesome (CDN)

**Aucune base de données** - Tout en JSON + localStorage !

---

## 📊 Fonctionnalités

### Navigator
- Formulaire multi-étapes (profil établissement, état actuel, objectifs)
- Calculs automatiques : économies sur 5 ans, impact CO2, score d'autonomie
- Graphiques interactifs (Chart.js)
- Roadmap personnalisée
- Partage de résultats

### Académie
- 5 niveaux d'apprentissage progressifs
- Quiz interactifs avec explications
- Système de badges (Bronze, Argent, Or)
- Points XP et progression sauvegardée
- Certificat NIRD téléchargeable

### Ressources
- Vidéos du Lycée Carnot
- Témoignages d'établissements
- Liens vers documentation NIRD officielle
- Comparateur d'alternatives logicielles

---

## 🎨 Design

**Thème** : Village Gaulois vs Empire Romain (Astérix)

**Couleurs** :
- `#2563eb` - Bleu (autorité/confiance)
- `#dc2626` - Rouge (résistance)
- `#fbbf24` - Or (potion magique)
- `#10b981` - Vert (autonomie)

**Polices** :
- Titres : Poppins
- Corps : Inter
- Code : JetBrains Mono

---

## 📦 Déploiement

### Vercel (recommandé)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy
```

### Render.com

Connecter le repo GitHub → Auto-deploy activé

---

## 📄 Licence

- **Code** : MIT License
- **Contenu** : CC BY-SA 4.0
- **Assets** : Ressources libres uniquement (unDraw, Font Awesome Free, Google Fonts)

---

## 🤝 Contribuer

Ce projet est développé dans le cadre de la **Nuit de l'Info 2025**.

**Liens utiles** :
- Site NIRD officiel : https://nird.forge.apps.education.fr/
- Documentation complète : voir `PROJET.md`
- Sujet hackathon : voir `sujet.md`

---

## 👥 Équipe UPSEJ

Projet porté par l'équipe UPSEJ pour la Nuit de l'Info 2025.

**Contact** : [À compléter]

---

## 🙏 Crédits

- **Collectif NIRD** - Inspiration et données
- **Lycée Carnot de Bruay-la-Buissière** - Pionnier NIRD
- **Forge des Communs Numériques Éducatifs** - Soutien

---

**Fait marcher > Fait beau > Fait optimisé** 🚀
