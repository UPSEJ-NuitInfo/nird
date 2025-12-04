# 🚀 Guide de Déploiement NIRD Navigator Academy

## Pré-requis

- Node.js v18+ installé
- Git configuré
- Compte Vercel/Netlify/Render (gratuit)

---

## Option 1 : Vercel (Recommandé)

**Le plus simple pour débutants**

### Méthode 1 : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter (première fois)
vercel login

# Déployer
vercel

# Suivre les instructions :
# - Project name: nird-navigator-academy
# - Directory: ./
# - Override settings: No
```

### Méthode 2 : Via GitHub

1. Push ton code sur GitHub
2. Va sur [vercel.com](https://vercel.com)
3. "New Project" → Import ton repo
4. Vercel détecte automatiquement Node.js
5. Deploy !

**URL finale** : `https://nird-navigator-academy.vercel.app`

---

## Option 2 : Netlify

### Méthode Drag & Drop

1. Va sur [netlify.com](https://netlify.com)
2. Drag & drop le dossier `public/` complet
3. Site en ligne en 30 secondes !

### Méthode CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod

# Directory to deploy: ./public
```

---

## Option 3 : Render.com

**Bon pour backend Node.js**

1. Connecte ton repo GitHub sur [render.com](https://render.com)
2. "New Web Service"
3. Configure :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Environment** : Node
4. Deploy automatique à chaque push !

---

## Option 4 : Hébergement Local (Dev)

```bash
# Lancer le serveur en local
npm start

# Accessible sur http://localhost:3000
```

---

## Variables d'environnement (optionnel)

Créer un fichier `.env` :

```env
PORT=3000
NODE_ENV=production
```

Sur Vercel/Netlify/Render, ajouter via l'interface web.

---

## Vérifications Post-Déploiement

✅ **Checklist** :
- [ ] Page d'accueil charge correctement
- [ ] Navigation entre pages fonctionne
- [ ] API `/api/calculate` répond (test avec Postman)
- [ ] API `/api/data/testimonials` répond
- [ ] Chart.js et Tailwind CSS chargent (CDN)
- [ ] localStorage fonctionne (tester Academy)
- [ ] Responsive mobile OK
- [ ] Console sans erreurs (F12)

---

## Dépannage

### Erreur "Cannot find module 'express'"

```bash
npm install express
```

### Port déjà utilisé

```bash
# Changer le port dans server.js ou :
PORT=4000 npm start
```

### Fichiers statiques ne chargent pas

Vérifier que `server.js` contient :

```javascript
app.use(express.static('public'));
```

### API ne répond pas

Vérifier les routes dans `server.js` :

```javascript
app.post('/api/calculate', ...)
app.get('/api/data/:type', ...)
```

---

## Performance

### Optimisations basiques

1. **Compresser les images** :
   ```bash
   # Utiliser TinyPNG ou Squoosh
   ```

2. **Minifier CSS/JS** (optionnel) :
   ```bash
   npm install -g terser
   terser public/js/main.js -o public/js/main.min.js
   ```

3. **Cache browser** : Déjà géré par Vercel/Netlify

---

## Monitoring

### Vérifier les logs

**Vercel** :
```bash
vercel logs
```

**Netlify** :
Interface web → Functions → Logs

**Render** :
Interface web → Logs

---

## Mise à jour du site

```bash
# Faire les modifications localement
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main

# Auto-deploy sur Vercel/Netlify/Render !
```

---

## URL du projet déployé

**À compléter après déploiement** :
- Production : `https://nird-navigator-academy.vercel.app`
- Staging : `https://nird-staging.vercel.app`

---

## Support

En cas de problème pendant la Nuit de l'Info :
1. Lire les logs (voir ci-dessus)
2. Google l'erreur exacte
3. Demander à ChatGPT/Copilot
4. Appeler le "Chef d'orchestre" de l'équipe

**Phrase magique** : *"Fait marcher > Fait beau"* 🚀
