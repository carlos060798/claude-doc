# CHEATSHEET — Implementación de los 5 Cambios

**Referencia rápida para desarrollador. Copiar-pegar en script.js/styles.css según sea necesario.**

---

## CAMBIO 1: Microlearning (12h)

### Paso 1: Agregar MICROLESSONS_DATA
```javascript
// En script.js línea ~217
const MICROLESSONS_DATA = {
  'nivel4-mcp-servers': [
    { id: '4.1.1', title: 'What is MCP?', estimatedMinutes: 5,
      content: '...', prequiz: [...], inline_quiz: [...], 
      exercise: {...}, nextMicro: '4.1.2' }
  ]
};
```

### Paso 2: Función para renderizar micro-dashboard
```javascript
function renderMicroProgressDashboard() {
  // Retorna HTML con: 
  // - stats: "4 de 12 micros", "🔥 x7 streak", "35 min restantes"
  // - lista de micros con status (✓ complete, → in progress)
  // - botón "Comenzar" para próxima micro
}
```

### Paso 3: CSS para micro UI
```css
.micro-dashboard { padding: 20px; background: gradient; }
.micro-stats { grid: 3 cols; gap: 15px; }
.micro-list { display: grid; gap: 10px; }
.micro-item { flex: row; border-left: 3px; }
.micro-item.completed { background: #f0fdf4; border-left: #86efac; }
```

### Paso 4: localStorage tracking
```javascript
localStorage.setItem(`cc-micro-${microId}`, 'complete');
localStorage.setItem(`cc-micro-${microId}-score`, quizScore);
```

---

## CAMBIO 2: Feedback Inline (10h)

### Paso 1: Pre-quiz antes de sección
```javascript
function showPreQuizBanner(sectionId) {
  // Mostrar banner: "Responde 2 q sobre prerequisitos"
  // Si < 70%: link a remediación
  // Si >= 80%: permitir continuar
}
```

### Paso 2: Ejercicios interactivos inline
```javascript
function renderExercise(exercise) {
  // exercise.type: 'code-editor' | 'scenario' | 'diagram-match'
  // Renderizar textarea + validación regex en vivo
  // Mostrar feedback inmediato: "✓ JSON válido" o "✗ Error: missing field"
}
```

### Paso 3: Smart feedback post-quiz
```javascript
if (quizScore < 70) {
  feedback = {
    message: "Entendiste 50%, pero falta concepto X",
    hint: "Relee párrafo 3",
    video: "https://...",
    retry: true
  };
} else {
  unlockNextMicro();
}
```

### Paso 4: Remediation library
```javascript
const REMEDIATION_LIBRARY = {
  'qué-son-hooks': { 
    title: 'Hooks 101', duration: 5, content: '...' 
  }
};
```

---

## CAMBIO 3: Gamification (8h)

### Paso 1: BADGES_SYSTEM
```javascript
const BADGES_SYSTEM = {
  badges: {
    'mcp-builder': {
      id: 'mcp-builder', name: 'MCP Builder', icon: '🔧',
      description: 'Implementaste tu primer MCP',
      unlockCondition: 'completedExercise("nivel4-mcp")',
      points: 40
    }
  }
};

function awardBadge(badgeId) {
  const earned = JSON.parse(localStorage.getItem('cc-badges') || '[]');
  earned.push(badgeId);
  localStorage.setItem('cc-badges', JSON.stringify(earned));
  showBadgeNotification(badge);
}
```

### Paso 2: Daily streak
```javascript
function trackDailyStreak() {
  const today = new Date().toDateString();
  const lastSession = localStorage.getItem('cc-last-session');
  const streak = parseInt(localStorage.getItem('cc-streak-days') || '0');
  
  if (lastSession !== today) {
    streak++;
    localStorage.setItem('cc-streak-days', streak);
    if (streak % 7 === 0) awardBadge('7-day-streak');
  }
}
```

### Paso 3: CSS para badges
```css
.badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
.badge-card { border: 2px solid #dbeafe; padding: 15px; text-align: center; }
.badge-card.earned { background: linear-gradient(...); border-color: var(--level-4); }
.badge-notification { position: fixed; bottom: 20px; right: 20px; animation: slideIn 0.4s; }
```

### Paso 4: Progress ring SVG
```html
<svg class="progress-ring" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" class="progress-ring__background" />
  <circle cx="50" cy="50" r="45" class="progress-ring__circle" 
    style="stroke-dashoffset: calc(280 * (1 - 0.65));" />
  <text x="50" y="55" text-anchor="middle">65%</text>
</svg>
```

---

## CAMBIO 4: Capstones (14h)

### Paso 1: CAPSTONE_PROJECTS structure
```javascript
const CAPSTONE_PROJECTS = {
  2: {
    title: 'Build CLI Tool',
    deliverables: ['GitHub repo', 'CLAUDE.md', 'Cost breakdown', 'README'],
    rubric: {
      functionality: { weight: 40 },
      documentation: { weight: 30 },
      costOptimization: { weight: 20 },
      design: { weight: 10 }
    }
  }
};
```

### Paso 2: Submit capstone
```javascript
function submitCapstone(level, repoLink, description) {
  const portfolio = JSON.parse(localStorage.getItem('cc-portfolio') || '{}');
  portfolio.capstones.push({
    id: generateUUID(), level, title: CAPSTONE_PROJECTS[level].title,
    repoLink, description, submittedAt: new Date(),
    rubricScore: null, peerReviews: []
  });
  localStorage.setItem('cc-portfolio', JSON.stringify(portfolio));
  awardBadge(`capstone-level-${level}`);
}
```

### Paso 3: Portfolio showcase
```javascript
function renderPortfolioHub() {
  const portfolio = JSON.parse(localStorage.getItem('cc-portfolio') || '{}');
  // Tabs: Capstones | Badges | Certificates
  // Mostrar capstone cards con rubric scores
  // Botón para descargar certificados PDF
  // Botón para compartir LinkedIn/Twitter
}
```

### Paso 4: Peer review rubric
```javascript
function renderPeerReviewForm(capstoneId) {
  const project = CAPSTONE_PROJECTS[capstone.level];
  // Renderizar radio buttons 1-5 por cada criterion
  // Textarea para feedback
  // Submit → actualizar capstone.rubricScore = average
}
```

---

## CAMBIO 5: Community (10h)

### Paso 1: Community hub UI
```javascript
function renderCommunityHub() {
  let html = `<div class="community-hub">
    <div class="community-tabs">
      <button onclick="switchTab('projects')">Proyectos</button>
      <button onclick="switchTab('qa')">Q&A</button>
      <button onclick="switchTab('tips')">Tips</button>
      <button onclick="switchTab('jobs')">Job Board</button>
    </div>
    <div class="tab-content">
      <!-- Renderizar projects, qa, tips, jobs -->
    </div>
  </div>`;
  return html;
}
```

### Paso 2: Submit proyecto a community
```javascript
function submitCommunityProject(title, repoLink, description, tags) {
  const community = JSON.parse(localStorage.getItem('cc-community') || '{}');
  community.projects.push({
    id: generateUUID(), author: currentUser, title, repoLink,
    description, tags, likes: 0, createdAt: new Date()
  });
  localStorage.setItem('cc-community', JSON.stringify(community));
}
```

### Paso 3: Post-mastery paths
```javascript
const POST_MASTERY_PATHS = {
  'ai-for-hiring': {
    title: 'AI en Hiring',
    duration: '6 semanas',
    modules: ['Screening agents', 'Resume parsing', 'Interview bots']
  }
};

function renderPostMasteryPaths() {
  if (completedLevel(6)) {
    // Mostrar carousel de 2-3 paths recomendados
    // Botón "Explorar" → enrollPath()
  }
}
```

### Paso 4: Job board
```javascript
const JOB_LISTINGS = [
  { title: 'Senior AI Engineer', company: 'Anthropic', level: 5, ... }
];

function renderJobBoard() {
  const userLevel = parseInt(localStorage.getItem('cc-completed-level') || '0');
  const eligible = JOB_LISTINGS.filter(j => userLevel >= j.level);
  // Renderizar tabla de ofertas
}
```

---

## TESTING CHECKLIST

- [ ] Micro-lesson: cargar, completar, progreso guardar
- [ ] Pre-quiz: < 70% → remediation, >= 80% → continuar
- [ ] Ejercicio: validación en vivo (JSON, regex, etc.)
- [ ] Badge: unlock condicional, notificación, localStorage
- [ ] Streak: incrementar diario, reset si > 1 día ausente
- [ ] Portfolio: capstones listar, certificados descargar
- [ ] Community: submit, filtrar, upvote funcional
- [ ] Responsive: mobile (375px), tablet (768px), desktop
- [ ] Accesibilidad: labels en inputs, alt en icons, contrast WCAG

---

## DEPLOYMENT STEPS

1. **Backup:** `git checkout -b feature/5-cambios-contenido`
2. **Merge:** Agregar MICROLESSONS_DATA + BADGES_SYSTEM + etc. a script.js
3. **CSS:** Agregar micro-* + badge-* + community-* clases
4. **HTML:** Agregar `<section id="community">` y `<section id="portfolio">`
5. **Test:** Manual QA en Chrome, Firefox, Safari
6. **Rollout:** 20% traffic (Cohorte A) por 1 semana, luego 100%
7. **Monitor:** Dashboard KPIs (completion rate, session frequency, badges earned)
8. **Iterate:** Feedback post-W1, ajustes en W2-W4

---

## COMANDOS GIT

```bash
# Crear rama de feature
git checkout -b feature/microlearning-dashboard

# Commit por cambio (atomic commits)
git add script.js && git commit -m "feat: add MICROLESSONS_DATA structure"
git add styles.css && git commit -m "style: add .micro-* classes"
git add index.html && git commit -m "html: add community hub section"

# Push y PR
git push origin feature/microlearning-dashboard
gh pr create --title "5 cambios contenido: engagement +71%" \
  --body "Implements microlearning, feedback, gamification, capstones, community"

# Deploy (post-merge)
git checkout master && git pull
npm run build && npm run deploy
```

---

## KPIs A MONITOREAR (Semanal)

```json
{
  "completion": { "L4": "42%→65%?", "L5": "38%→60%?", "L6": "22%→45%?" },
  "engagement": { "session_freq": "2→4x/week?", "duration": "45→120 min?", "badges_earned": "count" },
  "community": { "projects_submitted": "count", "post_mastery_enrollments": "count" },
  "errors": { "js_console": "0", "broken_links": "0", "abandoned_micros": "count" }
}
```

---

## TROUBLESHOOTING RÁPIDO

| Problema | Causa | Solución |
|----------|-------|----------|
| Pre-quiz no aparece | localStorage.getItem() null | Inicializar localStorage en page load |
| Badge no se destransforma | unlockCondition incorrecto | Revisar lógica en awardBadge() |
| Micro progress no avanza | localStorage key typo | Verificar `cc-micro-${microId}` |
| Community posts no guardan | JSON.stringify error | Usar try-catch en submitProject |
| Certificate PDF vacío | generateVerifyToken() undefined | Definir función antes de renderizar |

---

## REFERENCIAS

- **script.js línea:** 217 (LESSONS_DATA), 1200 (funciones), 2600 (localStorage)
- **styles.css línea:** 800 (colores), 1200 (grid layouts), 1500 (animations)
- **HTML secciones:** L4 (línea ~700), L5 (línea ~900), L6 (línea ~1100)
- **Archivos relevantes:** 
  - `C:\Users\usuario\claude doc\IMPLEMENTACION_ESPECIFICA.md` (código detallado)
  - `C:\Users\usuario\claude doc\ANALISIS_ESTRATEGICO.md` (contexto)
  - `C:\Users\usuario\claude doc\RESUMEN_EJECUTIVO.md` (KPIs)

---

**Listo para código. ¡A implementar!**
