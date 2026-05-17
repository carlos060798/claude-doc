/**
 * quiz-engine.js — Sistema de evaluación + progreso de usuario
 * Almacena avance en localStorage, permite export de resultados
 */

const quizEngine = {
  // Storage key
  STORAGE_KEY: 'claude-mastery-progress',

  // Definición de quizzes por nivel (basada en curriculum.json)
  QUIZZES: {
    1: [
      {
        id: 'l1-q1',
        question: '¿Cuál es el primer comando para instalar Claude Code?',
        options: [
          'npm install -g @anthropic-ai/claude-code',
          'claude auth login',
          'pip install claude-code',
          'brew install claude-code'
        ],
        correct: 0,
        explanation: 'Se instala vía npm: npm install -g @anthropic-ai/claude-code'
      },
      {
        id: 'l1-q2',
        question: '¿Qué hace el comando /init?',
        options: [
          'Inicia sesión con OAuth',
          'Genera un CLAUDE.md inicial analizando tu proyecto',
          'Inicializa un repositorio git',
          'Inicializa un archivo package.json'
        ],
        correct: 1,
        explanation: '/init analiza el proyecto y genera CLAUDE.md automáticamente'
      },
      {
        id: 'l1-q3',
        question: '¿Cómo mencionar un archivo en Claude Code?',
        options: [
          'archivo.ts',
          '#archivo.ts',
          '@archivo.ts',
          '$archivo.ts'
        ],
        correct: 2,
        explanation: 'Se usa @ para mencionar archivos: @archivo.ts'
      }
    ],
    2: [
      {
        id: 'l2-q1',
        question: '¿Qué es MCP?',
        options: [
          'Model Code Protocol',
          'Model Context Protocol',
          'Memory Code Protocol',
          'Management Context Platform'
        ],
        correct: 1,
        explanation: 'MCP = Model Context Protocol (protocolo para extender Claude)'
      },
      {
        id: 'l2-q2',
        question: '¿Cómo agregar un servidor MCP local?',
        options: [
          'claude mcp attach github',
          'claude mcp add github -- npx -y @modelcontextprotocol/server-github',
          'mcp install github',
          'claude mcp register github'
        ],
        correct: 1,
        explanation: 'claude mcp add <name> -- <command> registra un MCP'
      },
      {
        id: 'l2-q3',
        question: '¿Cuál es la función de /memory?',
        options: [
          'Limpiar la memoria caché',
          'Gestionar memoria persistente entre sesiones',
          'Mostrar uso de memoria del sistema',
          'Resetear la sesión'
        ],
        correct: 1,
        explanation: '/memory persiste información entre sesiones del proyecto'
      }
    ],
    3: [
      {
        id: 'l3-q1',
        question: '¿Qué es una Skill en Claude Code?',
        options: [
          'Una herramienta de programación',
          'Un comando personalizado definido en SKILL.md',
          'Una característica del navegador',
          'Un archivo de configuración'
        ],
        correct: 1,
        explanation: 'Las Skills son comandos personalizados definidos en SKILL.md'
      },
      {
        id: 'l3-q2',
        question: '¿Cuál es el propósito de /fork?',
        options: [
          'Crear un repositorio fork en GitHub',
          'Bifurcar la sesión en una rama paralela',
          'Crear una copia del proyecto',
          'Hacer merge de ramas'
        ],
        correct: 1,
        explanation: '/fork bifurca la sesión actual en una rama paralela'
      },
      {
        id: 'l3-q3',
        question: '¿Qué permite hacer el Agent SDK?',
        options: [
          'Crear interfaces gráficas',
          'Ejecutar agentes autónomos con herramientas',
          'Gestionar bases de datos',
          'Compilar código'
        ],
        correct: 1,
        explanation: 'Agent SDK permite crear agentes autónomos que usan herramientas'
      }
    ],
    4: [
      {
        id: 'l4-q1',
        question: '¿Cuál es el primer paso para empaquetar un MCP en formato .mcpb?',
        options: [
          'Instalar @anthropic-ai/mcpb globalmente',
          'Crear manifest.json manualmente',
          'Compilar el servidor a binario',
          'Subir a npm registry'
        ],
        correct: 0,
        explanation: 'npm install -g @anthropic-ai/mcpb instala la herramienta CLI necesaria'
      },
      {
        id: 'l4-q2',
        question: '¿Cuántos eventos hay documentados en settings.json hooks?',
        options: [
          '12',
          '21',
          '29+',
          '50+'
        ],
        correct: 2,
        explanation: 'Claude Code soporta 29+ eventos: SessionStart, PreToolUse, PermissionRequest, etc'
      },
      {
        id: 'l4-q3',
        question: '¿Cuál hook permite bloquear comandos peligrosos?',
        options: [
          'PostToolUseFailure',
          'PreToolUse',
          'SessionStart',
          'CwdChanged'
        ],
        correct: 1,
        explanation: 'PreToolUse se ejecuta ANTES de la herramienta y es blocking'
      },
      {
        id: 'l4-q4',
        question: '¿Qué es el patrón "Pipeline" en orquestación multi-agente?',
        options: [
          'Todos los agentes trabajan en paralelo',
          'Un agente central delega a especialistas',
          'Un agente → siguiente → siguiente (secuencial)',
          'Sin coordinación, resultados independientes'
        ],
        correct: 2,
        explanation: 'Pipeline Pattern: output de agente 1 → input de agente 2 → agente 3'
      },
      {
        id: 'l4-q5',
        question: '¿Cuál es la diferencia entre "blocking: true" y "blocking: false" en hooks?',
        options: [
          'No hay diferencia, es solo documentación',
          'blocking:true = puede detener/modificar evento, blocking:false = solo lectura',
          'blocking:true = corre en paralelo, blocking:false = secuencial',
          'blocking:true = siempre se ejecuta, blocking:false = a veces'
        ],
        correct: 1,
        explanation: 'blocking:true permite validar/rechazar comandos; blocking:false es solo observación'
      }
    ]
  },

  /**
   * Obtener progreso actual del usuario
   */
  getProgress() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.getInitialProgress();
  },

  /**
   * Estructura inicial de progreso
   */
  getInitialProgress() {
    return {
      currentLevel: 1,
      levels: {
        1: { completed: false, quizScore: 0, missionStatus: 'pending' },
        2: { completed: false, quizScore: 0, missionStatus: 'pending' },
        3: { completed: false, quizScore: 0, missionStatus: 'pending' },
        4: { completed: false, quizScore: 0, missionStatus: 'pending' }
      },
      quizResults: {},
      startDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };
  },

  /**
   * Guardar resultado de quiz
   */
  saveQuizResult(level, answers) {
    const quiz = this.QUIZZES[level];
    if (!quiz) return null;

    let score = 0;
    answers.forEach((answer, idx) => {
      if (answer === quiz[idx].correct) score++;
    });

    const percentage = Math.round((score / quiz.length) * 100);

    const progress = this.getProgress();
    progress.quizResults[level] = {
      timestamp: new Date().toISOString(),
      score: score,
      total: quiz.length,
      percentage: percentage,
      answers: answers
    };
    progress.levels[level].quizScore = percentage;
    progress.lastUpdate = new Date().toISOString();

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    return progress.quizResults[level];
  },

  /**
   * Marcar misión como completada
   */
  completeMission(level) {
    const progress = this.getProgress();
    if (progress.levels[level]) {
      progress.levels[level].missionStatus = 'completed';
      progress.levels[level].completed = true;
      progress.lastUpdate = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      return true;
    }
    return false;
  },

  /**
   * Obtener quiz de un nivel
   */
  getQuiz(level) {
    return this.QUIZZES[level] || null;
  },

  /**
   * Calcular estadísticas generales
   */
  getStats() {
    const progress = this.getProgress();
    const levels = progress.levels;

    const completedLevels = Object.keys(levels).filter(l => levels[l].completed).length;
    const avgScore = Object.values(levels).reduce((sum, l) => sum + l.quizScore, 0) / 4;

    return {
      completedLevels,
      totalLevels: 4,
      avgQuizScore: Math.round(avgScore),
      startDate: progress.startDate,
      lastUpdate: progress.lastUpdate,
      levels: levels
    };
  },

  /**
   * Exportar progreso como JSON
   */
  exportJSON() {
    const progress = this.getProgress();
    const stats = this.getStats();

    const data = {
      metadata: {
        exportDate: new Date().toISOString(),
        course: 'Claude Code Mastery',
        version: '1.0.0'
      },
      statistics: stats,
      progress: progress,
      quizzes: progress.quizResults
    };

    return JSON.stringify(data, null, 2);
  },

  /**
   * Exportar como CSV (para Excel)
   */
  exportCSV() {
    const progress = this.getProgress();
    let csv = 'Nivel,Quiz Score,Mission Status,Quiz Timestamp\n';

    Object.entries(progress.levels).forEach(([level, data]) => {
      const timestamp = progress.quizResults[level]?.timestamp || 'N/A';
      csv += `${level},${data.quizScore}%,${data.missionStatus},${timestamp}\n`;
    });

    return csv;
  },

  /**
   * Limpiar progreso (reset)
   */
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.getInitialProgress();
  },

  /**
   * Renderizar quiz en HTML
   */
  renderQuiz(level, containerId) {
    const quiz = this.getQuiz(level);
    if (!quiz) return false;

    const container = document.getElementById(containerId);
    if (!container) return false;

    let html = `<div class="quiz-container" data-level="${level}">
      <h3>Quiz - Nivel ${level}</h3>
      <div class="quiz-questions">`;

    quiz.forEach((q, idx) => {
      html += `<div class="question" data-idx="${idx}">
        <h4>${q.question}</h4>
        <div class="options">`;

      q.options.forEach((opt, optIdx) => {
        html += `<label>
          <input type="radio" name="q${idx}" value="${optIdx}">
          ${opt}
        </label><br>`;
      });

      html += `</div></div>`;
    });

    html += `</div>
      <button class="submit-quiz" onclick="quizEngine.submitQuiz(${level}, '${containerId}')">
        Enviar Quiz
      </button>
      <div class="quiz-result"></div>
    </div>`;

    container.innerHTML = html;
    return true;
  },

  /**
   * Procesar envío de quiz
   */
  submitQuiz(level, containerId) {
    const container = document.getElementById(containerId);
    const answers = [];

    document.querySelectorAll(`[data-level="${level}"] input[type="radio"]:checked`).forEach(radio => {
      answers.push(parseInt(radio.value));
    });

    if (answers.length !== this.QUIZZES[level].length) {
      alert('Por favor responde todas las preguntas');
      return;
    }

    const result = this.saveQuizResult(level, answers);
    const resultDiv = container.querySelector('.quiz-result');

    resultDiv.innerHTML = `<div class="result-message">
      <h4>✅ Quiz Completado!</h4>
      <p>Puntuación: <strong>${result.percentage}%</strong> (${result.score}/${result.total})</p>
      <p>${result.percentage >= 70 ? '¡Felicidades! Pasaste el quiz 🎉' : 'Intenta nuevamente para mejorar tu puntuación'}</p>
    </div>`;
  }
};

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quizEngine;
}
