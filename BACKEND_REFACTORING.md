# Backend API Refactoring - Simplified Schema

## ✅ Completed Tasks

### 1. New API Endpoints Created

#### **api/auth_new.js** (146 lines)
Simplified authentication matching new User model (id, username, password only):
- `POST /api/auth/register` - Register with username/password only
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile
- Removed: email, displayName, avatar, XP, streaks, anonymous accounts

#### **api/games.js** (118 lines)
Game management and scoring:
- `GET /api/games` - List all available games
- `GET /api/games/:id` - Get game details
- `POST /api/games/:id/score` - Submit score (protected)
- `GET /api/games/:id/leaderboard` - Get top 50 scores for a game
- `GET /api/games/:id/my-score` - Get user's best score (protected)

#### **api/scores.js** (72 lines)
User score tracking:
- `GET /api/users/:id/scores` - Get all scores for a user
- `GET /api/users/me/scores` - Get scores for current user (protected)

### 2. Database Seed Rewritten

#### **database/seed.js** (completely rewritten)
Now seeds only:
- 5 games (Quiz, Matching, Typing, Memory, Code Breaker)
- 1 demo user (username: `demo`, password: `demo123`)
- 3 sample high scores

Removed all references to:
- GameType, Lesson, Exercise, Achievement models
- XP, streak, badge logic

### 3. Server Routes Updated

#### **server.js**
- Updated imports to use `auth_new.js`, `games.js`, `scores.js`
- Removed obsolete routes: lessons, exercises, users
- Kept legacy calculator and data endpoints for compatibility

### 4. Old Files Backed Up

Created `api_backup/` with:
- Old auth.js (with email, XP, streaks)
- Old lessons.js, exercises.js, users.js

## ⚠️ Current Issue

**Database Connection Timeout**
```
ConnectionError: Connection timeout: failed to create socket after 10005ms
Host: in2h30.myd.infomaniak.com:3306
```

**Possible causes:**
1. Infomaniak firewall blocking connection from current IP
2. Database server temporarily unavailable
3. Network/ISP blocking port 3306
4. Credentials changed by hosting provider

**Resolution needed:**
- Verify database is accessible (check Infomaniak dashboard)
- Test connection from different network
- Check if IP whitelisting required
- Consider testing with local MySQL/MariaDB first

## 📋 Next Steps (Once DB Connection Fixed)

### Backend Completion
1. [ ] Test `npm run db:migrate` successfully creates 3 tables
2. [ ] Test `npm run db:seed` populates games and demo user
3. [ ] Rename `api/auth_new.js` → `api/auth.js` (replace old one)
4. [ ] Test all API endpoints with Postman/curl
5. [ ] Add input validation (username length, score ranges)

### Frontend Redesign (Major)
1. [ ] **login.html** - Simplify (remove email field, remove anonymous option)
2. [ ] **app.html** - Complete redesign:
   - Change from lesson progression tree → game selection grid
   - Show game cards with thumbnails, descriptions, best scores
   - Add leaderboard preview for each game
3. [ ] **public/js/api.js** - Rewrite:
   - Remove: lessons, exercises, achievements, XP functions
   - Add: games, scores, leaderboard functions
4. [ ] **public/js/app.js** - Rewrite:
   - Load games list instead of lessons
   - Display user's scores instead of XP/streak
   - No lesson tree rendering
5. [ ] **game.html** (new) - Individual game player:
   - Can reuse existing game implementations (Quiz, Matching, Typing)
   - Add score submission on completion
   - Show user's best score + leaderboard
6. [ ] **profile.html** (new) - User stats:
   - List all games with user's best scores
   - Show ranking in each game
   - Simple UI, no badges/achievements

### Optional Enhancements
- [ ] Add game thumbnails/icons
- [ ] Implement actual game logic (currently just placeholders)
- [ ] Add pagination to leaderboards
- [ ] Add filters (friends only, time ranges)
- [ ] Add score history graphs

## 📊 Database Schema (Simplified)

```sql
-- Users: Basic authentication
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Games: Available mini-games
CREATE TABLE Games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

-- Highscore: Many-to-many junction with scores
CREATE TABLE Highscore (
  id_user INT NOT NULL,
  id_game INT NOT NULL,
  score INT NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  PRIMARY KEY (id_user, id_game),
  FOREIGN KEY (id_user) REFERENCES Users(id),
  FOREIGN KEY (id_game) REFERENCES Games(id)
);
```

## 🔑 Test Credentials

After seeding:
- **Username**: demo
- **Password**: demo123

## 📁 File Structure Summary

```
api/
├── auth_new.js       ✅ NEW - Simplified auth (username/password)
├── games.js          ✅ NEW - Game management + scoring
├── scores.js         ✅ NEW - User score tracking
├── calculator.js     (legacy, kept for compatibility)
├── auth.js           ⚠️  OLD - will be replaced by auth_new.js
└── api_backup/       ✅ Backup of old files

database/
├── models.js         ✅ SIMPLIFIED by user (3 models only)
├── connection.js     (unchanged)
├── migrate.js        (unchanged)
└── seed.js           ✅ REWRITTEN for new schema

server.js             ✅ UPDATED routes

public/               ⚠️  NEEDS COMPLETE REDESIGN
├── login.html        (needs simplification)
├── app.html          (needs complete redesign)
├── lesson.html       (repurpose as game.html)
├── css/              (can reuse design system)
└── js/
    ├── api.js        (needs rewrite)
    ├── app.js        (needs rewrite)
    └── lesson.js     (repurpose for games)
```

## 🎯 Summary

**Backend: 80% Complete** ✅
- New simplified API endpoints match 3-table schema
- Seed script rewritten for new structure
- Server routes updated
- Awaiting database connection fix for testing

**Frontend: 0% Complete** ⚠️
- Still designed for Duolingo learning path concept
- Needs complete redesign for game arcade model
- Will require significant HTML/CSS/JS changes
- Can reuse existing design system (colors, typography)

---

**Last Updated**: After backend API refactoring
**Blocker**: Database connection timeout to Infomaniak MariaDB
