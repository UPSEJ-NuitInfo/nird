# 🤝 Guide de Contribution - NIRD Navigator Academy

## Organisation de l'équipe (Nuit de l'Info)

### Workflow recommandé

1. **Créer une branche** pour chaque feature
2. **Commiter souvent** (toutes les 15-30 min)
3. **Tester localement** avant de push
4. **Merge sur main** quand la feature est prête

### Convention de nommage des branches

```bash
feature/nom-de-la-fonctionnalite
fix/correction-bug
design/amelioration-visuelle
content/ajout-contenu
```

Exemples :
```bash
git checkout -b feature/navigator-form
git checkout -b design/hero-animation
git checkout -b fix/chart-display
```

---

## Conventions de code

### HTML
- Indentation : **2 espaces**
- Classes Tailwind : utiliser la convention existante
- IDs uniques : préfixer avec le nom de la page (`nav-form`, `academy-progress`)

```html
<!-- ✅ Bon -->
<div class="container mx-auto px-4">
  <h1 class="font-heading text-4xl">Titre</h1>
</div>

<!-- ❌ À éviter -->
<div class="container mx-auto px-4"><h1 class="font-heading text-4xl">Titre</h1></div>
```

### CSS
- Variables CSS obligatoires pour les couleurs
- Pas de `!important` sauf exception
- Classes BEM si CSS custom

```css
/* ✅ Bon */
.nav-link {
  color: var(--primary);
  transition: var(--transition-base);
}

/* ❌ À éviter */
.nav-link {
  color: #2563eb !important;
}
```

### JavaScript
- **Vanilla JS uniquement** (pas de frameworks)
- `const` par défaut, `let` si réassignation, **jamais** `var`
- Fonctions fléchées préférées
- Commentaires pour logique complexe

```javascript
// ✅ Bon
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ À éviter
var calculateTotal = function(items) {
  var sum = 0;
  for(var i=0; i<items.length; i++) {
    sum = sum + items[i].price;
  }
  return sum;
}
```

### JSON
- Indentation : **2 espaces**
- Pas de commentaires (invalide en JSON)
- Tester avec un validateur : https://jsonlint.com/

---

## Git Workflow

### Avant de commencer

```bash
# Récupérer les dernières modifs
git pull origin main

# Créer ta branche
git checkout -b feature/ma-fonctionnalite
```

### Pendant le développement

```bash
# Voir les fichiers modifiés
git status

# Ajouter tous les fichiers modifiés
git add .

# OU ajouter fichiers spécifiques
git add public/index.html public/css/style.css

# Commiter avec message clair
git commit -m "feat: Ajout formulaire Navigator étape 1"
```

### Messages de commit

Format : `type: description`

**Types** :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `design:` Amélioration visuelle
- `content:` Ajout/modification contenu
- `refactor:` Restructuration code
- `docs:` Documentation

**Exemples** :
```bash
git commit -m "feat: Ajout calculatrice économies API"
git commit -m "fix: Correction affichage graphique sur mobile"
git commit -m "design: Animation hero section"
git commit -m "content: Ajout témoignages lycée Carnot"
```

### Pousser les modifications

```bash
# Première fois sur la branche
git push -u origin feature/ma-fonctionnalite

# Ensuite
git push
```

### Merger sur main

```bash
# Revenir sur main
git checkout main

# Récupérer les dernières modifs
git pull origin main

# Merger ta branche
git merge feature/ma-fonctionnalite

# Pousser
git push origin main

# Supprimer la branche (optionnel)
git branch -d feature/ma-fonctionnalite
```

---

## Structure de travail par rôle

### 👤 Personne 1 - Backend & API

**Fichiers** :
- `server.js`
- `api/calculator.js`
- `data/*.json`

**Tâches** :
1. Tester API avec Postman/curl
2. Valider les calculs avec exemples réels
3. Gérer les erreurs (try/catch)

### 👤 Personne 2 - Navigator

**Fichiers** :
- `public/navigator.html`
- `public/results.html`
- `public/js/navigator.js`
- `public/js/results.js`

**Tâches** :
1. Formulaire multi-étapes fonctionnel
2. Validation côté client
3. Appels API
4. Affichage graphiques Chart.js

### 👤 Personne 3 - Academy

**Fichiers** :
- `public/academy.html`
- `public/level1-5.html`
- `public/js/academy.js`
- `public/js/quiz.js`

**Tâches** :
1. Dashboard progression
2. Quiz interactifs
3. Système badges + XP
4. localStorage

### 👤 Personne 4 - Design & Contenu

**Fichiers** :
- `public/index.html`
- `public/resources.html`
- `public/css/style.css`
- `public/css/components.css`
- `data/testimonials.json`

**Tâches** :
1. Page accueil attractive
2. Design cohérent toutes pages
3. Responsive mobile
4. Contenu textes/images

---

## Checklist avant de push

✅ **Vérifications** :
- [ ] Code fonctionne en local (`npm start`)
- [ ] Pas d'erreurs dans console (F12)
- [ ] Testé sur Chrome ET Firefox
- [ ] Responsive vérifié (DevTools mobile view)
- [ ] Pas de `console.log()` oubliés
- [ ] Indentation propre
- [ ] Commentaires ajoutés si logique complexe

---

## Communication équipe

### Pendant la Nuit de l'Info

- **Discord/Slack** : Communication instantanée
- **GitHub Issues** : Pour tracker bugs/tâches
- **Trello/Notion** (optionnel) : Kanban board

### Demander de l'aide

1. Essayer de débugger seul (15 min max)
2. Lire l'erreur dans la console
3. Google l'erreur exacte
4. Demander à ChatGPT/Copilot
5. Appeler le "Chef d'orchestre"

### Signaler un problème

Créer une **GitHub Issue** :

```markdown
**Titre** : Formulaire Navigator ne soumet pas

**Description** :
Quand je clique sur "Suivant" à l'étape 2, rien ne se passe.

**Erreur console** :
`Uncaught ReferenceError: nextStep is not defined`

**Fichier** : `public/js/navigator.js` ligne 45

**À faire** : Définir la fonction `nextStep()`
```

---

## Ressources utiles

### Documentation
- HTML : https://developer.mozilla.org/fr/docs/Web/HTML
- CSS : https://developer.mozilla.org/fr/docs/Web/CSS
- JavaScript : https://javascript.info/
- Tailwind : https://tailwindcss.com/docs
- Chart.js : https://www.chartjs.org/docs/

### Outils
- Validateur HTML : https://validator.w3.org/
- Validateur JSON : https://jsonlint.com/
- Compresseur images : https://tinypng.com/
- Palette couleurs : https://coolors.co/

### Inspiration
- Site NIRD : https://nird.forge.apps.education.fr/
- Vidéos Lycée Carnot : Voir `sujet.md`

---

## En cas de conflit Git

```bash
# Si message "merge conflict"
git status  # Voir les fichiers en conflit

# Ouvrir les fichiers marqués, chercher :
<<<<<<< HEAD
Code actuel
=======
Code de l'autre branche
>>>>>>> autre-branche

# Résoudre manuellement, puis :
git add fichier-resolu.html
git commit -m "fix: Résolution conflit"
git push
```

---

**Bon courage à toute l'équipe ! 🚀**

*"Fait marcher > Fait beau > Fait optimisé"*
