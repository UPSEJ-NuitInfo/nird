# NIRD Navigator Academy - AI Coding Assistant Instructions

## Project Overview

**NIRD Navigator Academy** is a web platform for the Nuit de l'Info 2025 hackathon, helping French schools transition to digital autonomy through NIRD (Numérique Inclusif, Responsable et Durable). Think "Astérix village vs Roman Empire" but for Big Tech dependency.

**Core Philosophy**: Simplicity over complexity. Vanilla JS/HTML/CSS, minimal dependencies, beginner-friendly stack for 12-hour hackathon context.

## Architecture & Stack

### Technology Constraints (CRITICAL)

- **NO frameworks**: React/Vue/Angular forbidden - use vanilla JavaScript only
- **NO build tools**: No Webpack/Vite - serve static files directly
- **NO database**: Use `localStorage` client-side + JSON files server-side
- **Dependencies**: Express.js ONLY (see `package.json` minimal in PROJET.md)
- **CDN-based**: Tailwind CSS, Chart.js, Font Awesome via CDN links

### Project Structure (When Implemented)

```
nird-navigator-academy/
├── server.js                 # Express minimal server (~50 lines)
├── api/calculator.js         # Economic/CO2 calculations
├── data/*.json               # Static data (testimonials, quiz, alternatives)
├── public/                   # All frontend files
│   ├── *.html               # Separate pages (index, navigator, results, academy, level1-5, resources)
│   ├── css/                 # Vanilla CSS + Tailwind utilities
│   ├── js/                  # Vanilla JS modules (navigator.js, academy.js, quiz.js, storage.js)
│   ├── images/              # Organized by feature (hero/, badges/, levels/)
│   └── assets/              # Icons, fonts
└── .tools/                  # Helper scripts per instructions file
```

## Key Features & Modules

### 1. NIRD Navigator (Diagnostic Tool)

**Purpose**: Multi-step form calculating cost savings & CO2 impact of switching from Big Tech to NIRD solutions.

**Calculation Logic** (see PROJET.md § Calculs Navigator):

```javascript
// 5-year economics
BigTech = (windows_licenses * machines * 5) + (office_licenses * users * 5)
        + (hardware_renewal) + (google_workspace * users * 5)
NIRD = (tech_support * 5) + (training) + (optional_local_server)
Savings = BigTech - NIRD

// Carbon impact
machines_saved = obsolete_windows10_machines
kg_CO2_avoided = machines_saved * 200kg  // Manufacturing footprint

// Autonomy score (0-100)
score = (libre_software_ratio * 40) + (linux_hardware_ratio * 30)
      + (local_data_storage * 20) + (internal_skills * 10)
```

**Output**: Interactive dashboard with Chart.js graphs, personalized roadmap, shareable link.

### 2. Academy NIRD (Gamified Learning)

**Purpose**: 5-level progressive learning path with badges, XP, and localStorage persistence.

**Levels**:

1. "Ouvrir les yeux" - Awareness quiz
2. "Découvrir alternatives" - Software matching game
3. "Passer à l'action" - Linux installation tutorial
4. "Embarquer établissement" - Pitch generator
5. "Rejoindre communauté" - Interactive map + forum

**Badge System**: Bronze (3 levels) → Silver (5 levels + sharing) → Gold (certification + map listing)

### 3. Resources Module

Static content: video embeds (Lycée Carnot), testimonials from `data/testimonials.json`, NIRD documentation links.

## Development Patterns

### HTML Structure

- **Separate files per page** - no single-page app complexity
- **Semantic HTML5** - accessibility matters for educational context
- **Forms**: Use native validation (`required`, `type`, `min/max`) before custom JS

### CSS Conventions

```css
/* Color palette (defined in PROJET.md) */
--primary: #2563eb      /* Blue - authority */
--secondary: #dc2626    /* Red - resistance */
--accent: #fbbf24       /* Gold - "magic potion" */
--success: #10b981      /* Green - autonomy */
--neutral: #64748b      /* Gray - modern */

/* Typography */
--font-heading: 'Poppins', sans-serif
--font-body: 'Inter', sans-serif
--font-mono: 'JetBrains Mono', monospace
```

### JavaScript Guidelines

- **Module pattern**: Each feature gets its own file (`navigator.js`, `academy.js`, etc.)
- **Storage**: Use `storage.js` wrapper for localStorage operations
- **Shared utilities**: `main.js` for common functions (navigation, modal handlers)
- **No async/await unless necessary** - keep it simple for beginners

### Data Flow

1. Form input → JavaScript validation
2. POST to `/api/calculate` (if backend ready) OR local calculation
3. Save to localStorage for persistence
4. Render results with Chart.js
5. Generate shareable URL with query params

## Critical Constraints

### Time Budget (12h hackathon)

**MVP Priority** (6h minimum):

1. Attractive landing page
2. Navigator form (3-4 steps minimum)
3. Results page with 2 charts
4. 3 Academy levels with simple quizzes
5. Basic resources page
6. Deployed online

**Defer if time-constrained**:

- Complex animations
- All 5 Academy levels
- PDF export
- Dark mode
- Easter eggs

### Deployment

- **Target**: Vercel, Netlify, or Render (zero-config)
- **Command**: `vercel` or drag-drop `public/` folder
- **Requirement**: MUST be online before hackathon deadline

### Licensing

- **Code**: MIT License
- **Content**: CC BY-SA 4.0
- **Assets**: Only libre resources (unDraw, Font Awesome Free, Google Fonts, Unsplash)

## Common Tasks

### Adding a new page

1. Create `public/newpage.html` with standard header/footer
2. Add link in navigation (`main.js` or header HTML)
3. Create `public/js/newpage.js` if interactive
4. Update `server.js` if special routing needed (usually not)

### Adding a quiz/level

1. Add questions to `data/quiz.json`:

```json
{
  "level2": [
    {"question": "...", "options": [...], "correct": 1, "explanation": "..."}
  ]
}
```

2. Create `public/level2.html` with quiz container
3. Use `quiz.js` module to render and score

### Adding calculations

1. Update `api/calculator.js` with new formula
2. Document assumptions in comments (e.g., "200kg CO2 per PC manufacturing")
3. Add unit tests if time allows (not MVP requirement)

### Managing localStorage

Always use `storage.js` wrapper:

```javascript
// Save progress
storage.saveProgress("navigator", formData);

// Retrieve
const progress = storage.getProgress("navigator");

// Academy badges
storage.unlockBadge("level1-complete");
```

## Troubleshooting

### "It's not working" checklist

1. Open browser DevTools Console (F12)
2. Check for JS errors (red text)
3. Verify file paths (absolute from `/public/`)
4. Test in Chrome first (best DevTools)
5. Simplify - remove complexity until it works

### Common pitfalls

- ❌ Using `node_modules` imports → ✅ Use CDN links in HTML
- ❌ Complex state management → ✅ Use localStorage + page reloads
- ❌ Responsive as afterthought → ✅ Mobile-first with Tailwind
- ❌ Forgetting to commit → ✅ `git commit` every 30min

## Resources & References

- **NIRD Official**: https://nird.forge.apps.education.fr/
- **Lycée Carnot Videos**: See `sujet.md` for YouTube links
- **Subject Brief**: `sujet.md` - full hackathon requirements
- **Project Spec**: `PROJET.md` - detailed technical blueprint
- **Quick Start**: See PROJET.md § Quick Start for setup

## Tone & Communication

**Target Audience**: High school students, teachers, administrators - NOT developers.

- ✅ Friendly, encouraging, humor (Astérix theme)
- ✅ Concrete examples, real numbers
- ✅ Avoid jargon or explain it
- ❌ Technical elitism
- ❌ Boring corporate speak

**Content Strategy**: Show impact (savings, CO2), build community (testimonials), empower action (roadmaps).

## Questions for Stakeholders

When implementing features, consider these NIRD-specific questions:

- Does this help schools understand their Big Tech dependency?
- Is it accessible to non-technical users (teachers, students)?
- Does it promote the "village résistant" narrative?
- Can this be reused post-hackathon by real schools?
- Is it fun/engaging enough to complete?

---

**Remember**: Fait marcher > Fait beau > Fait optimisé. Ship working software first, polish later.
