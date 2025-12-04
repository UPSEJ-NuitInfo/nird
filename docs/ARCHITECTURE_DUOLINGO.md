# 🎮 NIRD Academy - Architecture Duolingo

**Refonte complète** - Style apprentissage gamifié avec mini-jeux variés et progression par niveaux.

---

## 📋 Changements majeurs

### Ancien système
- ❌ Calculateur d'économies Big Tech → NIRD
- ❌ Formulaire multi-étapes
- ❌ Stockage localStorage uniquement
- ❌ Quiz simples avec JSON statiques

### Nouveau système ✅
- ✅ Plateforme d'apprentissage gamifiée (style Duolingo)
- ✅ 7 types de mini-jeux interactifs
- ✅ Base de données MariaDB avec Sequelize ORM
- ✅ Système XP, streaks, achievements
- ✅ Authentification JWT (comptes + anonymes)
- ✅ Progression sauvegardée en BDD
- ✅ Leaderboard et profils publics

---

## 🗄️ Architecture Base de Données

### Tables principales

#### **Users**
```sql
- id (PK)
- username (unique)
- email (unique, nullable)
- password (hashed, nullable si anonyme)
- displayName
- avatar
- totalXP
- currentStreak
- longestStreak
- lastActiveDate
- isAnonymous (boolean)
```

#### **GameTypes** (7 types de jeux)
```sql
- id (PK)
- code: quiz | matching | typing | dragdrop | dialogue | visual | estimation
- name
- description
- icon (Font Awesome)
- xpReward
- isActive
```

#### **Lessons** (5 niveaux)
```sql
- id (PK)
- levelNumber (1-5)
- title
- description
- theme: awareness | alternatives | action | advocacy | community
- requiredXP (déblocage progressif)
- orderIndex
- isLocked
- badgeName
- badgeIcon
```

#### **Exercises**
```sql
- id (PK)
- lessonId (FK → Lessons)
- gameTypeId (FK → GameTypes)
- orderIndex
- question (TEXT)
- data (JSON - structure variable selon type de jeu)
- xpReward
- difficulty: easy | medium | hard
```

#### **UserProgress**
```sql
- id (PK)
- userId (FK → Users)
- lessonId (FK → Lessons)
- isCompleted
- completedAt
- score
- stars (0-3)
```

#### **ExerciseAttempts**
```sql
- id (PK)
- userId (FK → Users)
- exerciseId (FK → Exercises)
- isCorrect
- userAnswer (JSON)
- timeSpent (secondes)
- xpEarned
- createdAt
```

#### **Achievements**
```sql
- id (PK)
- code (unique)
- name
- description
- icon
- tier: bronze | silver | gold | platinum
- requirement (JSON)
- xpBonus
```

#### **UserAchievements**
```sql
- userId (FK → Users)
- achievementId (FK → Achievements)
- unlockedAt
```

---

## 🎮 Types de Mini-Jeux

### 1. Quiz Rapide (`quiz`)
**Format** : Vrai/Faux ou QCM  
**XP** : 10 par bonne réponse  
**Exemple** : "Windows 10 devient obsolète en 2025" → Vrai/Faux  
**Structure data** :
```json
{
  "type": "true-false",
  "correct": true,
  "explanation": "Microsoft arrête le support..."
}
```

### 2. Associer (`matching`)
**Format** : Relier paires (Big Tech ↔ Alternative NIRD)  
**XP** : 15-20  
**Exemple** : Word → LibreOffice Writer, Chrome → Firefox  
**Structure data** :
```json
{
  "pairs": [
    {"left": "Microsoft Word", "right": "LibreOffice Writer"},
    {"left": "Google Chrome", "right": "Firefox"}
  ]
}
```

### 3. Taper la commande (`typing`)
**Format** : Saisir commande Linux exacte  
**XP** : 20-25  
**Exemple** : "Mettre à jour Ubuntu" → `sudo apt update && sudo apt upgrade`  
**Structure data** :
```json
{
  "expectedAnswer": "sudo apt update && sudo apt upgrade",
  "hints": ["Commence par sudo", "Utilise apt"],
  "acceptedVariations": ["sudo apt-get update && sudo apt-get upgrade"]
}
```

### 4. Glisser-Déposer (`dragdrop`)
**Format** : Construire architecture (à implémenter frontend)  
**XP** : 15  
**Exemple** : Placer "Nextcloud" sur "Serveur local", "LibreOffice" sur "Postes clients"

### 5. Dialogue (`dialogue`)
**Format** : Convaincre un interlocuteur (choix multiples enchaînés)  
**XP** : 20  
**Exemple** : Argumenter auprès d'un directeur pour passer à NIRD

### 6. Identification Visuelle (`visual`)
**Format** : Reconnaître logos/interfaces  
**XP** : 10  
**Exemple** : "Quel est ce logo ?" → Image de Tux → Réponse: Linux

### 7. Estimation (`estimation`)
**Format** : Deviner un chiffre (±20% de tolérance)  
**XP** : 15  
**Exemple** : "Combien d'€ économisés sur 5 ans pour 100 PC ?"

---

## 🚀 API REST Endpoints

### Authentification
```
POST   /api/auth/register          - Inscription
POST   /api/auth/login             - Connexion
POST   /api/auth/anonymous         - Compte anonyme
GET    /api/auth/me                - Profil (JWT requis)
POST   /api/auth/convert-anonymous - Convertir anonyme → compte
```

### Leçons
```
GET    /api/lessons                - Liste toutes les leçons + progression
GET    /api/lessons/:id            - Détails d'une leçon
POST   /api/lessons/:id/start      - Démarrer une leçon
POST   /api/lessons/:id/complete   - Terminer une leçon
```

### Exercices
```
GET    /api/exercises/:id          - Détails exercice (sans réponse)
POST   /api/exercises/:id/submit   - Soumettre réponse
GET    /api/exercises/:id/stats    - Stats personnelles
```

### Utilisateurs
```
GET    /api/users/profile          - Profil complet + stats
POST   /api/users/update-streak    - Mettre à jour série quotidienne
GET    /api/users/leaderboard      - Classement (all-time/month/week)
GET    /api/users/:id/public       - Profil public
```

### Legacy (compatibilité)
```
POST   /api/calculate              - Ancien calculateur
GET    /api/data/:type             - Anciens JSON
```

---

## 📊 Système de Progression

### XP (Points d'Expérience)
- **Quiz simple** : 10 XP
- **Matching** : 15 XP
- **Typing** : 20-25 XP
- **Bonus vitesse** (<5s) : +5 XP
- **Bonus 1ère tentative** : +5 XP

### Déblocage Niveaux
1. **Niveau 1** : 0 XP (débloqué)
2. **Niveau 2** : 100 XP
3. **Niveau 3** : 250 XP
4. **Niveau 4** : 450 XP
5. **Niveau 5** : 700 XP

### Streaks (Séries)
- Compter chaque jour d'activité consécutif
- Badge à 7 jours (+50 XP)
- Affichage 🔥 avec nombre de jours
- Reset si jour manqué

### Étoiles par Leçon (0-3)
- **3 étoiles** : 100% de réussite
- **2 étoiles** : 80-99%
- **1 étoile** : 60-79%
- **0 étoile** : <60%

### Achievements (8 succès seed)
```javascript
- Premiers Pas (1 exercice) → Bronze, +10 XP
- Une Semaine de Résistance (7 jours streak) → Silver, +50 XP
- Maître du Niveau 1 (3 étoiles partout) → Gold, +100 XP
- Apprenti NIRD (500 XP) → Silver, +25 XP
- Expert NIRD (1000 XP) → Gold, +100 XP
- Sans Faute (leçon parfaite) → Silver, +30 XP
- Éclair NIRD (10 exercices <5s) → Gold, +75 XP
- Membre de la Communauté (niveau 5) → Platinum, +200 XP
```

---

## 🎨 Frontend à implémenter

### Page principale (`/app`)
- **Arbre de progression** style Duolingo
- Niveaux 1-5 en scrollable vertical
- Chaque niveau = pastille cliquable
- Indicateur XP actuel / XP requis pour prochain niveau
- Affichage streak 🔥
- Avatar + username en haut

### Page leçon (`/lesson/:id`)
- Liste d'exercices (5-10 par leçon)
- Barre de progression
- Bouton suivant/précédent
- Résultats en temps réel

### Mini-jeux components
- `QuizGame.js` - Boutons réponses
- `MatchingGame.js` - Drag & drop paires
- `TypingGame.js` - Input + validation
- `EstimationGame.js` - Slider ou input numérique
- `DialogueGame.js` - Choix multiples narratif

### Page profil (`/profile`)
- Stats : XP total, leçons complétées, taux réussite
- Badges débloqués avec dates
- Graphique progression XP
- Bouton "Partager profil"

### Leaderboard (`/leaderboard`)
- Top 50 utilisateurs
- Filtres : all-time, mois, semaine
- Avatar + username + XP + streak

---

## 🔧 Setup & Démarrage

### 1. Configuration MariaDB
Créer base de données :
```sql
CREATE DATABASE nird_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nird_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nird_academy.* TO 'nird_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configuration .env
Copier `.env.example` → `.env` et remplir :
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nird_academy
DB_USER=nird_user
DB_PASSWORD=password

JWT_SECRET=changez_moi_en_production
```

### 3. Migration + Seed
```bash
npm run db:migrate   # Crée les tables
npm run db:seed      # Seed 7 game types, 5 lessons, exercices, achievements
```

### 4. Lancer serveur
```bash
npm run dev   # Nodemon (auto-restart)
# ou
npm start     # Node classique
```

### 5. Test compte démo
```
Username: demo
Password: demo123
```

---

## 📦 Données Seed (Incluses)

### GameTypes : 7 types
- Quiz, Matching, Typing, DragDrop, Dialogue, Visual, Estimation

### Lessons : 5 niveaux
1. Ouvrir les yeux (0 XP)
2. Découvrir alternatives (100 XP)
3. Passer à l'action (250 XP)
4. Embarquer établissement (450 XP)
5. Rejoindre communauté (700 XP)

### Exercises : 10+ exercices
- Niveau 1 : 5 quiz (obsolescence, CO2, coûts, Carnot)
- Niveau 2 : 2 matching (Word→Writer, Ubuntu→usage)
- Niveau 3 : 2 typing (apt update, install libreoffice)

### Achievements : 8 succès
- Bronze : 2
- Silver : 3
- Gold : 2
- Platinum : 1

---

## 🔐 Authentification

### JWT Token
- Expire : 7 jours (comptes normaux)
- Expire : 30 jours (anonymes)
- Header : `Authorization: Bearer <token>`

### Flow anonyme
1. `POST /api/auth/anonymous` → Token
2. Jouer sans compte
3. Convertir : `POST /api/auth/convert-anonymous` avec username/password

### Flow compte
1. `POST /api/auth/register` → Token
2. Ou `POST /api/auth/login` → Token
3. Utiliser token dans toutes requêtes

---

## 📈 Métriques à tracker

### Par utilisateur
- Total XP
- Streak actuel/record
- Leçons complétées
- Taux de réussite global
- Temps moyen par exercice
- Achievements débloqués

### Global
- Total utilisateurs actifs
- XP moyen par jour
- Exercice le plus réussi/raté
- Temps moyen par type de jeu

---

## 🚧 TODO Prioritaire

### Backend
- [x] Setup Sequelize + MariaDB
- [x] Modèles (8 tables)
- [x] API Auth (5 endpoints)
- [x] API Lessons (4 endpoints)
- [x] API Exercises (3 endpoints)
- [x] API Users (4 endpoints)
- [x] Migrations + Seed
- [ ] Tests unitaires API
- [ ] Rate limiting
- [ ] Logs structurés

### Frontend
- [ ] Arbre de progression Duolingo
- [ ] Components mini-jeux (7 types)
- [ ] Page leçon avec exercices
- [ ] Système feedback visuel (confettis, sons)
- [ ] Profil utilisateur
- [ ] Leaderboard
- [ ] Responsive mobile-first
- [ ] Animations (streak, XP gain)

### Contenu
- [ ] +30 exercices niveau 4-5
- [ ] Images/illustrations pour visual game
- [ ] Sons/musiques (optionnel)
- [ ] Traductions (optionnel)

---

## 📚 Resources

- **Sequelize docs** : https://sequelize.org/docs/v6/
- **MariaDB** : https://mariadb.org/documentation/
- **JWT** : https://jwt.io/
- **Duolingo UX** : Étudier leur interface (couleurs, animations, feedback)

---

*Architecture mise à jour le 4 décembre 2025*  
*Stack: Node.js + Express + Sequelize + MariaDB*
