# IMPLEMENTACIÓN ESPECÍFICA — Los 5 Cambios de Contenido

---

## CAMBIO 1: Microlearning Dashboard + Adaptive Learning Paths

### 1.1 Estructura de Datos (MICROLESSONS_DATA)

```javascript
// Agregar a script.js (línea ~217, después LESSONS_DATA)
const MICROLESSONS_DATA = {
  'nivel4-mcp-servers': [
    {
      id: '4.1.1',
      title: '¿Qué es un MCP? (Conceptos fundamentales)',
      estimatedMinutes: 5,
      content: `
        # ¿Qué es un MCP?
        
        Model Context Protocol es un protocolo estándar para que
        aplicaciones cliente (como Claude Code) se conecten con
        servidores que proporcionan recursos adicionales.
        
        [Contenido expandido de la sección original, 600 palabras]
      `,
      prequiz: [
        {
          q: '¿Qué significa MCP?',
          options: ['Model Context Protocol', 'Multi-Client Platform', 'Main Computation Process'],
          correct: 0,
          explain: 'MCP = Model Context Protocol. Protocolo estándar para conectar recursos.'
        },
        {
          q: '¿Cuál es el beneficio principal de usar MCP?',
          options: [
            'Reducir tokens',
            'Agregar recursos externos de forma estándar y segura',
            'Acelerar la computación'
          ],
          correct: 1,
          explain: 'MCP permite integración estándar de recursos externos sin fragmentación.'
        }
      ],
      inline_quiz: [
        {
          q: 'Un cliente MCP se conecta a un servidor vía:',
          options: ['HTTP REST', 'stdio / SSE', 'WebSocket directo'],
          correct: 1
        }
      ],
      exercise: {
        type: 'code-editor',
        prompt: 'Escribe un manifest.json mínimo para registrar un MCP server',
        template: `{
  "name": "mi-server",
  "version": "1.0.0",
  "description": "Mi primer MCP",
  "command": "node",
  "args": ["server.js"]
}`,
        validation: 'JSON.parse() success + contiene "name", "command", "args"',
        hint: 'Revisa el ejemplo en la sección anterior'
      },
      nextMicro: '4.1.2'
    },
    {
      id: '4.1.2',
      title: 'Ciclo de vida de un MCP (Init → Ready → Shutdown)',
      estimatedMinutes: 7,
      content: `[Contenido expandido]`,
      prequiz: [],
      inline_quiz: [{ q: '¿Cuál es el primer mensaje que envía un servidor MCP?', options: [...], correct: 0 }],
      exercise: {
        type: 'diagram-match',
        prompt: 'Ordena los pasos del ciclo de vida MCP',
        items: ['Client init', 'Server capabilities', 'Tool call', 'Shutdown'],
        correctOrder: ['Client init', 'Server capabilities', 'Tool call', 'Shutdown']
      },
      nextMicro: '4.1.3'
    },
    {
      id: '4.1.3',
      title: 'Debugging MCP Failures (Logs, errores comunes)',
      estimatedMinutes: 8,
      content: `[Contenido expandido]`,
      prequiz: [],
      inline_quiz: [],
      exercise: {
        type: 'scenario',
        prompt: 'Tu MCP no inicia. ¿Cuál es tu plan de debugging?',
        steps: [
          'Revisar manifest.json syntax',
          'Ejecutar "claude mcp get <name>"',
          'Revisar stderr en ~/.claude/logs',
          'Validar el comando "node server.js" manualmente'
        ]
      },
      nextMicro: null
    }
  ],
  'nivel4-agentes-orquestacion': [
    // ... similar structure
  ],
  'nivel5-seguridad': [
    // ... similar structure
  ]
};
```

### 1.2 Funciones JavaScript para Micro-progression

```javascript
// Agregar a script.js

function renderMicroProgressDashboard() {
  const currentLevel = parseInt(localStorage.getItem('cc-current-level') || '1');
  const microLessons = MICROLESSONS_DATA[Object.keys(MICROLESSONS_DATA)[0]]; // ejemplo
  
  let html = `
    <div class="micro-dashboard">
      <h2>Tu Progreso Hoy</h2>
      <div class="micro-stats">
        <div class="stat">
          <span class="stat-number">4 de 12</span>
          <span class="stat-label">Micro-lecciones completadas</span>
        </div>
        <div class="stat">
          <span class="stat-number">🔥 7</span>
          <span class="stat-label">Días consecutivos</span>
        </div>
        <div class="stat">
          <span class="stat-number">↓ 35 min</span>
          <span class="stat-label">Tiempo estimado hoy</span>
        </div>
      </div>
      
      <h3>Próxima micro-lección</h3>
      <div class="micro-card recommended">
        <div class="micro-difficulty">Nivel 4 · Intermedio</div>
        <h4>Debugging MCP Failures (8 min)</h4>
        <p>Aprende a resolver errores comunes en MCP servers</p>
        <button onclick="startMicrolesson('4.1.3')">Comenzar →</button>
      </div>
      
      <h3>Micro-lecciones disponibles</h3>
      <div class="micro-list">
  `;
  
  microLessons.forEach(micro => {
    const isComplete = localStorage.getItem(`cc-micro-${micro.id}`) === 'complete';
    html += `
      <div class="micro-item ${isComplete ? 'completed' : ''}">
        <span class="micro-status">${isComplete ? '✓' : '→'}</span>
        <div>
          <h5>${micro.title}</h5>
          <p>${micro.estimatedMinutes} min</p>
        </div>
        <button onclick="startMicrolesson('${micro.id}')">${isComplete ? 'Revisar' : 'Iniciar'}</button>
      </div>
    `;
  });
  
  html += `</div></div>`;
  return html;
}

function startMicrolesson(microId) {
  const micro = getAllMicros().find(m => m.id === microId);
  if (!micro) return;
  
  // Mostrar contenido de micro-lección
  let html = `
    <div class="micro-content">
      <div class="micro-header">
        <button onclick="closeMicrolesson()">&larr; Atrás</button>
        <div class="micro-progress">
          <span class="micro-progress-bar" style="width: 33%"></span>
        </div>
        <span class="micro-timer">${micro.estimatedMinutes} min</span>
      </div>
      
      <div class="micro-body">
        <h2>${micro.title}</h2>
        ${renderMarkdown(micro.content)}
        
        <!-- Pre-quiz si existe -->
        ${micro.prequiz.length > 0 ? `<div class="micro-prequiz">${renderQuiz(micro.prequiz)}</div>` : ''}
        
        <!-- Inline quiz -->
        ${micro.inline_quiz.length > 0 ? `<div class="micro-inline-quiz">${renderQuiz(micro.inline_quiz)}</div>` : ''}
        
        <!-- Ejercicio interactivo -->
        ${micro.exercise ? `<div class="micro-exercise">${renderExercise(micro.exercise)}</div>` : ''}
        
        <!-- Next micro -->
        ${micro.nextMicro ? `
          <button class="btn-next-micro" onclick="startMicrolesson('${micro.nextMicro}')">
            Siguiente micro-lección →
          </button>
        ` : `
          <button class="btn-complete-section" onclick="completeSection()">
            ✓ Completar sección
          </button>
        `}
      </div>
    </div>
  `;
  
  document.getElementById('main-content').innerHTML = html;
  localStorage.setItem(`cc-micro-${microId}`, 'started');
}

function completeMicrolesson(microId, quizScore) {
  // Guardar progreso
  localStorage.setItem(`cc-micro-${microId}`, 'complete');
  localStorage.setItem(`cc-micro-${microId}-score`, quizScore);
  
  // Award badge si applicable
  if (quizScore >= 90) {
    awardBadge('mcp-master-' + microId.slice(0, 1), 'MCP Master');
  }
  
  // Actualizar dashboard
  updateProgressRing();
  renderMicroProgressDashboard();
}
```

### 1.3 CSS para Micro UI

```css
/* Agregar a styles.css */

.micro-dashboard {
  padding: 20px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(59, 130, 246, 0.05));
  border-radius: 12px;
  margin-bottom: 30px;
}

.micro-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.stat {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: var(--level-4);
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 5px;
}

.micro-list {
  display: grid;
  gap: 10px;
}

.micro-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-left: 3px solid #dbeafe;
  background: white;
  border-radius: 4px;
  transition: all 0.2s;
}

.micro-item.completed {
  border-left-color: #86efac;
  background: #f0fdf4;
}

.micro-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.micro-status {
  font-size: 20px;
  font-weight: bold;
  color: var(--level-4);
}

.micro-item h5 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
}

.micro-item p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.micro-item button {
  margin-left: auto;
  padding: 6px 12px;
  background: var(--level-4);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.micro-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 1000;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

.micro-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 100;
}

.micro-progress-bar {
  flex: 1;
  height: 3px;
  background: #dbeafe;
  border-radius: 2px;
  display: block;
}

.micro-timer {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.micro-body {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 20px;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

---

## CAMBIO 2: Feedback Loop Inline + Remediation

### 2.1 Pre-quiz Sistema

```javascript
function showPreQuizBanner(sectionId) {
  const prerequisites = {
    'nivel4-mcp-servers': {
      minScore: 70,
      quizzes: [
        { q: '¿Qué es un servidor en general?', options: [...], correct: 0 },
        { q: '¿Qué es un protocolo de comunicación?', options: [...], correct: 1 }
      ],
      remediationLink: 'nivel3-mcp-use-cases' // enlace a L3 para repaso
    }
  };
  
  const prereq = prerequisites[sectionId];
  if (!prereq) return;
  
  const userScore = localStorage.getItem(`cc-prediag-${sectionId}`);
  if (userScore && parseInt(userScore) >= prereq.minScore) {
    // User ya pasó pre-quiz
    return;
  }
  
  let html = `
    <div class="prediag-banner" id="prediag-${sectionId}">
      <div class="prediag-content">
        <h3>📋 Diagnóstico Rápido</h3>
        <p>Responde 2 preguntas para confirmar que tienes los conceptos previos</p>
        <button class="btn-prediag" onclick="startPreQuiz('${sectionId}')">
          Iniciar diagnóstico (2 min)
        </button>
        <button class="btn-prediag-skip" onclick="skipPreQuiz('${sectionId}')">
          Continuar de todas formas
        </button>
      </div>
    </div>
  `;
  
  return html;
}

function startPreQuiz(sectionId) {
  const prerequisites = { /* ... */ };
  const prereq = prerequisites[sectionId];
  
  let html = `<div class="prediag-modal">`;
  prereq.quizzes.forEach((q, i) => {
    html += `
      <div class="prediag-question">
        <h4>${i + 1}. ${q.q}</h4>
        <div class="options">
          ${q.options.map((opt, j) => `
            <label class="option">
              <input type="radio" name="prediag-q${i}" value="${j}" />
              ${opt}
            </label>
          `).join('')}
        </div>
      </div>
    `;
  });
  html += `<button onclick="submitPreQuiz('${sectionId}')">Enviar →</button>`;
  html += `</div>`;
  
  document.getElementById('modal-container').innerHTML = html;
}

function submitPreQuiz(sectionId) {
  const prerequisites = { /* ... */ };
  const prereq = prerequisites[sectionId];
  
  let score = 0;
  prereq.quizzes.forEach((q, i) => {
    const selected = document.querySelector(`input[name="prediag-q${i}"]:checked`);
    if (selected && parseInt(selected.value) === q.correct) {
      score += 50; // 50% per question
    }
  });
  
  localStorage.setItem(`cc-prediag-${sectionId}`, score);
  
  if (score < prereq.minScore) {
    // Mostrar remediación
    showRemediationSuggestion(prereq.remediationLink, sectionId);
  } else {
    // Permitir continuar
    closeModal();
  }
}

function showRemediationSuggestion(linkSection, currentSection) {
  let html = `
    <div class="remediation-modal">
      <h3>💡 Recomendación de Repaso</h3>
      <p>Te sugerimos repasar "${linkSection}" (8 min) antes de continuar</p>
      <div class="remediation-buttons">
        <button onclick="navigateTo('${linkSection}'); closeModal();">
          → Ir a repaso rápido
        </button>
        <button onclick="proceedAnyway('${currentSection}');">
          Continuar de todas formas
        </button>
      </div>
    </div>
  `;
  document.getElementById('modal-container').innerHTML = html;
}
```

### 2.2 Inline Exercise System

```javascript
function renderExercise(exercise) {
  let html = '';
  
  switch(exercise.type) {
    case 'code-editor':
      html = `
        <div class="exercise-container">
          <h4>${exercise.prompt}</h4>
          <textarea id="exercise-editor" placeholder="${exercise.template}"></textarea>
          <button onclick="validateExercise('${exercise.type}')">
            ✓ Validar respuesta
          </button>
          <details>
            <summary>💡 Pista</summary>
            <p>${exercise.hint}</p>
          </details>
        </div>
      `;
      break;
      
    case 'scenario':
      html = `
        <div class="exercise-scenario">
          <h4>${exercise.prompt}</h4>
          <div class="scenario-steps">
            ${exercise.steps.map((step, i) => `
              <div class="scenario-step">
                <input type="checkbox" id="step-${i}" />
                <label for="step-${i}">${step}</label>
              </div>
            `).join('')}
          </div>
          <button onclick="validateScenario()">Marcar completo</button>
        </div>
      `;
      break;
      
    case 'diagram-match':
      html = `
        <div class="exercise-match">
          <h4>${exercise.prompt}</h4>
          <div class="drag-list">
            ${exercise.items.map((item, i) => `
              <div class="drag-item" draggable="true" id="item-${i}">
                ${item}
              </div>
            `).join('')}
          </div>
          <button onclick="validateMatch()">Verificar orden</button>
        </div>
      `;
      break;
  }
  
  return html;
}

function validateExercise(type) {
  if (type === 'code-editor') {
    const code = document.getElementById('exercise-editor').value;
    try {
      JSON.parse(code);
      showFeedback('success', '¡Excelente! JSON válido. Ahora agrega la sección "transport"');
    } catch(e) {
      showFeedback('error', `Error JSON: ${e.message}. Revisa la sintaxis.`);
    }
  }
}

function showFeedback(status, message) {
  const html = `
    <div class="feedback ${status}">
      ${status === 'success' ? '✓' : '✗'} ${message}
    </div>
  `;
  document.getElementById('feedback-container').innerHTML = html;
}
```

### 2.3 Remediation Library

```javascript
const REMEDIATION_LIBRARY = {
  'qué-son-hooks': {
    title: '¿Qué son los Hooks? (Repaso rápido)',
    duration: 5,
    content: `
      # Hooks en Claude Code
      
      Los hooks son funciones que se ejecutan automáticamente en momentos
      específicos del flujo de Claude Code.
      
      [Contenido resumido de L3]
    `
  },
  'intro-mcp': {
    title: 'Introducción a MCP (L3 recap)',
    duration: 8,
    content: `[...]`
  },
  'yaml-basics': {
    title: 'Conceptos básicos de YAML',
    duration: 6,
    content: `[...]`
  }
};

function getRemediationPath(conceptId) {
  // Retorna la ruta de remediación para un concepto
  return REMEDIATION_LIBRARY[conceptId];
}
```

---

## CAMBIO 3: Gamification System (Badges, Streaks)

### 3.1 Badges Data Structure

```javascript
const BADGES_SYSTEM = {
  badges: {
    // Nivel 1
    'first-prompt': {
      id: 'first-prompt',
      name: '🎯 First Prompt',
      description: 'Escribiste tu primer prompt sin templates',
      icon: '🎯',
      color: 'var(--level-1)',
      unlockCondition: 'completedSection("primeros-pasos") && submittedQuiz("nivel1") && score >= 80',
      points: 10
    },
    'claude-md-architect': {
      id: 'claude-md-architect',
      name: '📝 CLAUDE.md Architect',
      description: 'Creaste un CLAUDE.md con 4+ secciones significativas',
      icon: '📝',
      color: 'var(--level-1)',
      unlockCondition: 'custom', // trackear vía localStorage
      points: 25
    },
    
    // Nivel 4
    'mcp-builder': {
      id: 'mcp-builder',
      name: '🔧 MCP Builder',
      description: 'Implementaste tu primer MCP funcional',
      icon: '🔧',
      color: 'var(--level-4)',
      unlockCondition: 'completedExercise("nivel4-mcp-servers", "code-editor")',
      points: 40
    },
    'debugging-master': {
      id: 'debugging-master',
      name: '🔍 Debugging Master',
      description: 'Ejecutaste /doctor 5+ veces y corregiste issues',
      icon: '🔍',
      color: 'var(--level-4)',
      unlockCondition: 'custom', // event tracking
      points: 35
    },
    
    // Nivel 6
    'architecture-visionary': {
      id: 'architecture-visionary',
      name: '🏗️ Architecture Visionary',
      description: 'Diseñaste un sistema escalable a 1M req/día',
      icon: '🏗️',
      color: 'var(--level-6)',
      unlockCondition: 'completedCapstone("nivel6")',
      points: 50
    },
    
    // Streaks
    '7-day-streak': {
      id: '7-day-streak',
      name: '🔥 One Week Warrior',
      description: '7 días consecutivos aprendiendo',
      icon: '🔥',
      color: '#ff6b6b',
      unlockCondition: 'streak >= 7',
      points: 25
    },
    '30-day-streak': {
      id: '30-day-streak',
      name: '🏆 Mastery Committed',
      description: '30 días consecutivos',
      icon: '🏆',
      color: '#ffd93d',
      unlockCondition: 'streak >= 30',
      points: 100
    }
  }
};

function awardBadge(badgeId) {
  const badge = BADGES_SYSTEM.badges[badgeId];
  if (!badge) return;
  
  const earned = JSON.parse(localStorage.getItem('cc-badges') || '[]');
  if (!earned.includes(badgeId)) {
    earned.push(badgeId);
    localStorage.setItem('cc-badges', JSON.stringify(earned));
    
    // Mostrar notificación
    showBadgeNotification(badge);
    
    // Award points
    updateXP(badge.points);
  }
}

function showBadgeNotification(badge) {
  const html = `
    <div class="badge-notification">
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-info">
        <h4>${badge.name}</h4>
        <p>${badge.description}</p>
        <span class="badge-points">+${badge.points} XP</span>
      </div>
      <button onclick="closeBadgeNotification()">×</button>
    </div>
  `;
  
  const container = document.getElementById('notifications-container');
  container.innerHTML = html;
  
  // Auto-hide después de 5 segundos
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

function renderBadgesShowcase() {
  const earned = JSON.parse(localStorage.getItem('cc-badges') || '[]');
  
  let html = '<div class="badges-grid">';
  
  Object.values(BADGES_SYSTEM.badges).forEach(badge => {
    const isEarned = earned.includes(badge.id);
    html += `
      <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
        <div class="badge-icon" style="color: ${badge.color}">
          ${isEarned ? badge.icon : '🔒'}
        </div>
        <h4>${badge.name}</h4>
        <p>${badge.description}</p>
        <span class="badge-points">${isEarned ? `+${badge.points} XP` : 'Bloqueado'}</span>
      </div>
    `;
  });
  
  html += '</div>';
  return html;
}
```

### 3.2 Daily Streak System

```javascript
function trackDailyStreak() {
  const today = new Date().toDateString();
  const lastSession = localStorage.getItem('cc-last-session');
  const streak = parseInt(localStorage.getItem('cc-streak-days') || '0');
  
  if (lastSession === today) {
    // Usuario ya visitó hoy
    return;
  }
  
  const lastDate = new Date(lastSession);
  const todayDate = new Date();
  const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  
  let newStreak = streak;
  if (diffDays === 1) {
    newStreak = streak + 1;
  } else if (diffDays > 1) {
    newStreak = 1; // reset streak
  }
  
  localStorage.setItem('cc-last-session', today);
  localStorage.setItem('cc-streak-days', newStreak);
  
  // Award badges si aplica
  if (newStreak === 7) {
    awardBadge('7-day-streak');
  }
  if (newStreak === 30) {
    awardBadge('30-day-streak');
  }
  
  return newStreak;
}

function renderStreakWidget() {
  const streak = parseInt(localStorage.getItem('cc-streak-days') || '0');
  
  return `
    <div class="streak-widget">
      <span class="streak-icon">🔥</span>
      <span class="streak-count">${streak}</span>
      <span class="streak-label">días consecutivos</span>
    </div>
  `;
}
```

### 3.3 CSS para Badges y Streaks

```css
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  padding: 20px;
}

.badge-card {
  border: 2px solid #dbeafe;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s;
  background: white;
}

.badge-card.earned {
  border-color: var(--level-4);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(236, 72, 153, 0.05));
}

.badge-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.badge-icon {
  font-size: 40px;
  margin-bottom: 10px;
  display: block;
}

.badge-card h4 {
  margin: 10px 0 5px 0;
  font-size: 13px;
  color: #1f2937;
}

.badge-card p {
  margin: 0;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
}

.badge-points {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
  color: var(--level-4);
}

.badge-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid var(--level-4);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.4s ease-out;
  z-index: 1000;
}

.badge-notification .badge-icon {
  font-size: 32px;
  margin: 0;
}

.badge-notification h4 {
  margin: 0;
  color: var(--level-4);
}

.badge-points {
  color: #fbbf24;
  font-weight: bold;
}

.streak-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #fbbf24, #ff6b6b);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}

.streak-icon {
  font-size: 16px;
}

.streak-count {
  font-size: 16px;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## CAMBIO 4: Capstones + Portfolio

### 4.1 Capstone Projects Structure

```javascript
const CAPSTONE_PROJECTS = {
  2: {
    id: 'cli-tool-with-cost',
    title: '🛠️ Build a CLI Tool with Cost Tracking',
    description: 'Crea un tool real en Node.js, documenta con CLAUDE.md, trackea costos',
    level: 2,
    duration: '4 horas',
    deliverables: [
      'GitHub repo públicamente accesible',
      'CLAUDE.md completo (stack, scripts, arquitectura)',
      'Cost breakdown: tokens consumidos, USD total',
      'README con instrucciones de setup'
    ],
    rubric: {
      functionality: { weight: 40, description: '¿El tool hace lo que promete?' },
      documentation: { weight: 30, description: '¿Está bien documentado?' },
      costOptimization: { weight: 20, description: '¿Optimizó tokens?' },
      design: { weight: 10, description: '¿Buena UX/arquitectura?' }
    },
    exampleSubmission: 'https://github.com/...',
    mentorNotes: 'Busca que usen Claude para generar el CLI, no que Claude solo revise código manual'
  },
  4: {
    id: 'multi-agent-system',
    title: '🤖 Design & Deploy a Multi-Agent System',
    description: 'Orquesta 2+ agentes para resolver un problema complejo real',
    level: 4,
    duration: '8 horas',
    deliverables: [
      'Arquitectura diagram (Miro/Excalidraw/link)',
      'Agent code (skills + MCP servers funcionales)',
      'Observability setup (Datadog/Grafana/Prometheus)',
      'Post-mortem: fallos encontrados + soluciones'
    ],
    rubric: {
      design: { weight: 30, description: 'Arquitectura clara y escalable' },
      implementation: { weight: 35, description: 'Código funcional y limpio' },
      observability: { weight: 20, description: 'Métricas, logs, alertas' },
      resilience: { weight: 15, description: 'Manejo de fallos y recovery' }
    }
  },
  6: {
    id: 'enterprise-adoption',
    title: '🏢 Enterprise AI Adoption Program',
    description: 'Diseña un plan de adopción AI 12 semanas para empresa Fortune 500',
    level: 6,
    duration: '20 horas',
    deliverables: [
      'Roadmap detallado (12 semanas, milestones)',
      'Training materials (3-5 documentos técnicos)',
      'ROI calculator + business case',
      'Risk assessment matrix (5×5)',
      'Governance framework (roles, approval workflow)'
    ],
    rubric: {
      strategy: { weight: 25, description: 'Visión clara y alcanzable' },
      execution: { weight: 25, description: 'Plan realista y detalladodel' },
      riskMgmt: { weight: 20, description: 'Identificación y mitigación de riesgos' },
      measurement: { weight: 30, description: 'KPIs, métricas de éxito' }
    }
  }
};

function submitCapstone(level, repoLink, description, files = {}) {
  const portfolio = JSON.parse(localStorage.getItem('cc-portfolio') || '{"capstones":[]}');
  
  const capstone = CAPSTONE_PROJECTS[level];
  if (!capstone) return;
  
  portfolio.capstones.push({
    id: generateUUID(),
    projectId: capstone.id,
    level,
    title: capstone.title,
    repoLink,
    description,
    files, // { rubricFile, architectureFile, etc }
    submittedAt: new Date().toISOString(),
    rubricScore: null,
    peerReviews: [],
    isFeatured: false
  });
  
  localStorage.setItem('cc-portfolio', JSON.stringify(portfolio));
  
  // Award badge
  awardBadge(`capstone-level-${level}`);
  
  // Notify
  showNotification(`✓ Capstone submitted para Nivel ${level}`);
}

function renderCapstoneCard(capstone) {
  const project = CAPSTONE_PROJECTS[capstone.level];
  
  return `
    <div class="capstone-card">
      <div class="capstone-header">
        <h3>${project.title}</h3>
        <span class="capstone-level">Nivel ${capstone.level}</span>
      </div>
      
      <p class="capstone-description">${capstone.description}</p>
      
      <div class="capstone-deliverables">
        <h4>Entregables:</h4>
        <ul>
          ${project.deliverables.map(d => `<li>✓ ${d}</li>`).join('')}
        </ul>
      </div>
      
      <div class="capstone-actions">
        <a href="${capstone.repoLink}" target="_blank" class="btn-view-repo">
          Ver repositorio →
        </a>
        ${capstone.rubricScore ? `
          <div class="rubric-score">
            Score: ${capstone.rubricScore}/100
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
```

### 4.2 Portfolio Section

```javascript
function renderPortfolioHub() {
  const portfolio = JSON.parse(localStorage.getItem('cc-portfolio') || '{"capstones":[], "badges":[], "certificates":[]}');
  
  let html = `
    <div class="portfolio-hub">
      <div class="portfolio-header">
        <h2>🎯 Tu Portafolio</h2>
        <p>Demostrá tus habilidades en Claude Code Mastery</p>
      </div>
      
      <div class="portfolio-tabs">
        <button class="tab active" onclick="switchPortfolioTab('capstones')">
          Capstones (${portfolio.capstones.length})
        </button>
        <button class="tab" onclick="switchPortfolioTab('badges')">
          Badges (${portfolio.badges ? portfolio.badges.length : 0})
        </button>
        <button class="tab" onclick="switchPortfolioTab('certificates')">
          Certificados
        </button>
      </div>
      
      <div class="portfolio-content">
        <!-- Capstones Tab -->
        <div id="capstones-tab" class="portfolio-tab">
          ${portfolio.capstones.length === 0 ? `
            <div class="empty-state">
              <p>No has enviado capstones aún</p>
              <p>Completa Nivel 2+ para acceder a proyectos</p>
            </div>
          ` : `
            <div class="capstones-grid">
              ${portfolio.capstones.map(cap => renderCapstoneCard(cap)).join('')}
            </div>
          `}
        </div>
        
        <!-- Badges Tab -->
        <div id="badges-tab" class="portfolio-tab" style="display:none;">
          ${renderBadgesShowcase()}
        </div>
        
        <!-- Certificados Tab -->
        <div id="certificates-tab" class="portfolio-tab" style="display:none;">
          ${renderCertificates()}
        </div>
      </div>
      
      <div class="portfolio-share">
        <h3>🌍 Compartir Portafolio</h3>
        <input type="text" id="portfolio-link" value="https://mastery.claudecode.io/u/${getUsername()}" readonly />
        <button onclick="copyPortfolioLink()">Copiar enlace</button>
        <button onclick="shareTweet()">Share en Twitter</button>
        <button onclick="shareLinkedin()">Share en LinkedIn</button>
      </div>
    </div>
  `;
  
  return html;
}

function renderCertificates() {
  const completedLevel = parseInt(localStorage.getItem('cc-completed-level') || '0');
  
  let html = '<div class="certificates-grid">';
  
  for (let i = 1; i <= completedLevel; i++) {
    const level = ['', 'Explorador', 'Practicante', 'Constructor', 'Ingeniero', 'Líder Técnico', 'Arquitecto'][i];
    const levelColor = ['', '#3b82f6', '#8b5cf6', '#6366f1', '#fbbf24', '#ec4899', '#dc2626'][i];
    
    html += `
      <div class="certificate" style="border-left: 4px solid ${levelColor}">
        <div class="cert-header">
          <h3>CLAUDE CODE MASTERY</h3>
          <span class="cert-level">${level}</span>
        </div>
        
        <div class="cert-content">
          <p>Completó 6 niveles de aprendizaje progresivo en Claude Code.</p>
          <p>Nivel alcanzado: <strong>${level} (${i}/6)</strong></p>
        </div>
        
        <div class="cert-footer">
          <small>Verificar en: <a href="https://mastery.claudecode.io/verify/${generateVerifyToken()}">
            mastery.claudecode.io
          </a></small>
        </div>
        
        <div class="cert-actions">
          <button onclick="downloadCertificate(${i})">Descargar PDF</button>
          <button onclick="shareCertificateLinkedin(${i})">Share en LinkedIn</button>
        </div>
      </div>
    `;
  }
  
  html += '</div>';
  return html;
}
```

### 4.3 Rubric Scoring (Peer Review)

```javascript
function submitPeerReview(capstoneId, rubricScores) {
  const portfolio = JSON.parse(localStorage.getItem('cc-portfolio') || '{}');
  const capstone = portfolio.capstones.find(c => c.id === capstoneId);
  
  if (!capstone) return;
  
  // Calcular score total
  const project = CAPSTONE_PROJECTS[capstone.level];
  let totalScore = 0;
  Object.entries(rubricScores).forEach(([criterion, score]) => {
    totalScore += (score * project.rubric[criterion].weight / 100);
  });
  
  capstone.peerReviews.push({
    reviewerId: getCurrentUser(),
    scores: rubricScores,
    totalScore,
    feedback: document.getElementById('peer-feedback').value,
    timestamp: new Date().toISOString()
  });
  
  capstone.rubricScore = calculateAverageScore(capstone.peerReviews);
  
  localStorage.setItem('cc-portfolio', JSON.stringify(portfolio));
  
  showNotification('✓ Revisión enviada');
}

function renderPeerReviewForm(capstoneId) {
  const capstone = /* fetch capstone */;
  const project = CAPSTONE_PROJECTS[capstone.level];
  
  let html = `<form class="peer-review-form">
    <h3>Calificar Capstone</h3>
  `;
  
  Object.entries(project.rubric).forEach(([criterion, details]) => {
    html += `
      <div class="rubric-criterion">
        <label>
          <h5>${criterion} (${details.weight}%)</h5>
          <p>${details.description}</p>
        </label>
        <div class="rating">
          ${[1,2,3,4,5].map(star => `
            <input type="radio" name="${criterion}" value="${star}" />
            <label>${'⭐'.repeat(star)}</label>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += `
    <textarea id="peer-feedback" placeholder="Feedback detallado (opcional)"></textarea>
    <button onclick="submitPeerReview('${capstoneId}')">Enviar revisión</button>
  </form>`;
  
  return html;
}
```

---

## CAMBIO 5: Community Hub + Next Steps

### 5.1 Community Hub

```javascript
const COMMUNITY_STRUCTURE = {
  projects: [],
  questions: [],
  tips: [],
  jobs: []
};

function submitCommunityProject(title, repoLink, description, tags = []) {
  const community = JSON.parse(localStorage.getItem('cc-community') || JSON.stringify(COMMUNITY_STRUCTURE));
  
  community.projects.push({
    id: generateUUID(),
    author: getCurrentUser(),
    title,
    repoLink,
    description,
    tags,
    likes: 0,
    comments: 0,
    featured: false,
    createdAt: new Date().toISOString()
  });
  
  localStorage.setItem('cc-community', JSON.stringify(community));
}

function renderCommunityHub() {
  const community = JSON.parse(localStorage.getItem('cc-community') || JSON.stringify(COMMUNITY_STRUCTURE));
  
  let html = `
    <div class="community-hub">
      <h2>🌍 Community Hub</h2>
      
      <div class="community-tabs">
        <button class="tab active" onclick="switchCommunityTab('projects')">
          Proyectos (${community.projects.length})
        </button>
        <button class="tab" onclick="switchCommunityTab('q-and-a')">
          Q&A
        </button>
        <button class="tab" onclick="switchCommunityTab('tips')">
          Tips & Hacks
        </button>
        <button class="tab" onclick="switchCommunityTab('jobs')">
          Job Board
        </button>
      </div>
      
      <div class="community-content">
        <!-- Projects -->
        <div id="projects-tab">
          <button onclick="openProjectSubmit()" class="btn-submit">
            + Compartir tu proyecto
          </button>
          <div class="projects-grid">
            ${community.projects.map(proj => `
              <div class="project-card">
                <h4>${proj.title}</h4>
                <p>${proj.description}</p>
                <div class="tags">
                  ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-actions">
                  <a href="${proj.repoLink}" target="_blank">Ver repo</a>
                  <button onclick="likeProject('${proj.id}')">👍 ${proj.likes}</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Q&A -->
        <div id="q-and-a-tab" style="display:none;">
          <button onclick="openAskQuestion()" class="btn-submit">
            + Hacer pregunta
          </button>
          <div class="qa-threads">
            ${community.questions.map(q => `
              <div class="qa-thread">
                <h4>${q.title}</h4>
                <p>Por <strong>${q.author}</strong></p>
                <div class="answers-count">${q.answers} respuestas</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  return html;
}

function openProjectSubmit() {
  const form = `
    <div class="submit-form">
      <h3>Compartir Proyecto</h3>
      <input type="text" id="project-title" placeholder="Título del proyecto" />
      <textarea id="project-desc" placeholder="Descripción (qué aprendiste)"></textarea>
      <input type="text" id="project-repo" placeholder="Link del repositorio GitHub" />
      <input type="text" id="project-tags" placeholder="Tags: #mcp, #cost-optimization" />
      <button onclick="submitProject()">Compartir →</button>
    </div>
  `;
  
  showModal(form);
}
```

### 5.2 Post-Mastery Paths

```javascript
const POST_MASTERY_PATHS = {
  'ai-for-hiring': {
    id: 'ai-for-hiring',
    title: '👔 AI en Hiring & Recruitment',
    description: 'Automatiza screening, análisis de CVs, entrevistas',
    duration: '6 semanas',
    difficulty: 'Intermedio',
    modules: [
      'Screening agents avanzados',
      'Resume parsing con Claude',
      'Interview coaching bots',
      'Bias detection & fairness'
    ],
    nextSteps: [
      'Toma el curso "AI en Hiring" (nuevo)',
      'Contribuye al repo de screening agents',
      'Case study: implementación en tu empresa'
    ]
  },
  'ai-for-finance': {
    id: 'ai-for-finance',
    title: '💼 AI en Financial Services',
    description: 'Cumplimiento, riesgo, fraude, optimización',
    duration: '8 semanas',
    difficulty: 'Avanzado',
    modules: [
      'Compliance automation',
      'Risk assessment agents',
      'Portfolio optimization',
      'Fraud detection patterns'
    ]
  },
  'open-source-contrib': {
    id: 'open-source',
    title: '🔓 Contributing al Ecosistema MCP',
    description: 'Mantén servidores MCP, publica en registry',
    duration: 'Autónomo',
    difficulty: 'Avanzado',
    modules: [
      'Leyendo código fuente de Anthropic',
      'Best practices de MCP servers',
      'Publicando tu primer .mcpb',
      'Community maintenance'
    ]
  }
};

function renderPostMasteryPaths() {
  const completedLevel = parseInt(localStorage.getItem('cc-completed-level') || '0');
  
  if (completedLevel < 6) return '';
  
  let html = `
    <div class="post-mastery-section">
      <h2>🚀 ¿Qué sigue después de Nivel 6?</h2>
      <p>Eres un Arquitecto. Ahora elige tu especialidad:</p>
      
      <div class="paths-carousel">
  `;
  
  Object.values(POST_MASTERY_PATHS).slice(0, 3).forEach(path => {
    html += `
      <div class="path-card">
        <h3>${path.title}</h3>
        <p>${path.description}</p>
        <ul class="path-modules">
          ${path.modules.slice(0, 2).map(m => `<li>• ${m}</li>`).join('')}
          <li>• +${path.modules.length - 2} más...</li>
        </ul>
        <div class="path-meta">
          <span>${path.duration}</span>
          <span>${path.difficulty}</span>
        </div>
        <button onclick="enrollPath('${path.id}')">
          Explorar →
        </button>
      </div>
    `;
  });
  
  html += `</div></div>`;
  return html;
}

function enrollPath(pathId) {
  const path = POST_MASTERY_PATHS[pathId];
  if (!path) return;
  
  const enrolled = JSON.parse(localStorage.getItem('cc-enrolled-paths') || '[]');
  if (!enrolled.includes(pathId)) {
    enrolled.push(pathId);
    localStorage.setItem('cc-enrolled-paths', JSON.stringify(enrolled));
    
    showNotification(`✓ Inscrito en "${path.title}"`);
  }
}
```

### 5.3 Job Board

```javascript
const JOB_LISTINGS = [
  {
    id: 1,
    title: 'Senior AI Engineer',
    company: 'Anthropic',
    location: 'Remote',
    salary: '$180-220K',
    level: 5, // Requiere L5+
    link: 'https://anthropic.com/careers/...'
  },
  {
    id: 2,
    title: 'AI Ops Engineer',
    company: 'TechCorp',
    location: 'San Francisco',
    salary: '$160-200K',
    level: 4,
    link: '...'
  }
];

function renderJobBoard() {
  const userLevel = parseInt(localStorage.getItem('cc-completed-level') || '0');
  
  const eligible = JOB_LISTINGS.filter(job => userLevel >= job.level);
  
  let html = `
    <div class="job-board">
      <h2>💼 Ofertas para Claude Code Masters</h2>
      <p>Empresas buscando expertos en Claude Code Mastery</p>
      
      <div class="jobs-table">
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Empresa</th>
              <th>Ubicación</th>
              <th>Salario</th>
              <th>Nivel requerido</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${eligible.map(job => `
              <tr>
                <td><strong>${job.title}</strong></td>
                <td>${job.company}</td>
                <td>${job.location}</td>
                <td>${job.salary}</td>
                <td>Nivel ${job.level}+</td>
                <td><a href="${job.link}" target="_blank" class="btn-apply">Aplicar</a></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  return html;
}
```

---

## Fin de Implementación Específica

Estos cambios proporcionan el código estructurado necesario para aumentar engagement 50%+ con:

1. **Micro-lecciones** → reducen abandono L4-5
2. **Feedback inline** → acelera aprendizaje  
3. **Badges + streaks** → motivación sostenida
4. **Capstones** → demostración práctica
5. **Community** → networking + next steps

**Estimación de desarrollo:** 2-3 semanas (JS vanilla, sin frameworks)
