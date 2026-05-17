/**
 * content-loader.js — Carga fragmentos HTML y datos JSON dinámicamente
 * Permite reestructuración modular sin cambiar experiencia del usuario
 */

const contentLoader = {
  /**
   * Carga un archivo JSON
   * @param {string} path - Ruta relativa a /data/
   * @returns {Promise<Object>} Datos parseados
   */
  async loadJSON(path) {
    try {
      const response = await fetch(`/data/${path}`);
      if (!response.ok) throw new Error(`Failed to load ${path}: ${response.statusText}`);
      return await response.json();
    } catch (err) {
      console.error(`[contentLoader] Error loading ${path}:`, err);
      return null;
    }
  },

  /**
   * Carga todos los comandos por nivel
   * @returns {Promise<Object>} { 1: [...], 2: [...], 3: [...], 4: [...] }
   */
  async loadAllCommands() {
    const commands = {};
    for (let level = 1; level <= 4; level++) {
      const data = await this.loadJSON(`commands-l${level}.json`);
      commands[level] = data || [];
    }
    return commands;
  },

  /**
   * Carga curriculum oficial
   * @returns {Promise<Object>} Curriculum data
   */
  async loadCurriculum() {
    return await this.loadJSON('curriculum.json');
  },

  /**
   * Carga metadata de validación
   * @returns {Promise<Object>} Metadata
   */
  async loadMetadata() {
    return await this.loadJSON('metadata.json');
  },

  /**
   * Carga HTML fragment (si existe en /content/)
   * @param {string} section - Nombre de sección (ej: "nivel-1")
   * @returns {Promise<string|null>} HTML content or null
   */
  async loadHTML(section) {
    try {
      const response = await fetch(`/content/${section}.html`);
      if (!response.ok) return null; // OK si no existe (fallback a inline HTML)
      return await response.text();
    } catch (err) {
      // Silently fail — fallback a HTML inline en index.html
      return null;
    }
  },

  /**
   * Renderiza tabla de comandos basada en nivel
   * @param {HTMLElement} container - Elemento donde renderizar
   * @param {Array} commands - Array de comandos
   * @param {boolean} includeVerification - Mostrar status de verificación
   */
  renderCommandsTable(container, commands, includeVerification = false) {
    if (!commands || commands.length === 0) {
      container.innerHTML = '<p>No commands available</p>';
      return;
    }

    let html = '<div class="commands-table-wrapper"><table class="commands-table"><thead><tr>';
    html += '<th>Comando</th><th>Descripción</th><th>Ejemplo</th>';
    if (includeVerification) html += '<th>Status</th>';
    html += '</tr></thead><tbody>';

    commands.forEach(cmd => {
      const verified = cmd.verified ? '✅' : '⚠️';
      html += `<tr>
        <td class="cmd-cell"><code>${this.escapeHTML(cmd.cmd)}</code></td>
        <td>${this.escapeHTML(cmd.desc)}</td>
        <td class="example-cell"><code>${this.escapeHTML(cmd.example)}</code></td>`;
      if (includeVerification) {
        const status = cmd.verified ? 'Verificado' : cmd.verificationStatus || 'Pending';
        html += `<td>${verified} ${status}</td>`;
      }
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
  },

  /**
   * Renderiza card de progreso del nivel
   * @param {HTMLElement} container - Elemento donde renderizar
   * @param {Object} levelData - Datos del nivel del curriculum
   */
  renderLevelProgress(container, levelData) {
    if (!levelData) return;

    const { level, name, commands, verified } = levelData;
    const status = verified ? '✅ Validado' : '⏳ En validación';

    let html = `
      <div class="level-progress-card">
        <div class="level-header">
          <h3>Nivel ${level}: ${name}</h3>
          <span class="status-badge ${verified ? 'verified' : 'pending'}">${status}</span>
        </div>
        <div class="progress-info">
          <p><strong>Comandos:</strong> ${commands}</p>
          <p><strong>Estado validación:</strong> ${status}</p>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  /**
   * Renderiza indicador de validación técnica
   * @param {HTMLElement} container - Elemento donde renderizar
   * @param {Object} metadata - Metadata de validación
   */
  renderValidationStatus(container, metadata) {
    if (!metadata || !metadata.levels) return;

    let html = '<div class="validation-summary"><h3>Estado de Validación</h3><ul>';

    Object.entries(metadata.levels).forEach(([level, data]) => {
      const percentage = Math.round((data.verified_count / data.commands) * 100);
      const color = percentage === 100 ? 'green' : percentage >= 70 ? 'yellow' : 'red';
      html += `<li>
        <strong>Nivel ${level}:</strong> ${data.verified_count}/${data.commands} (${percentage}%)
        <div class="progress-bar" style="background-color: var(--${color})">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
      </li>`;
    });

    html += '</ul></div>';
    container.innerHTML = html;
  },

  /**
   * Utilidad: escapar HTML para evitar XSS
   * @param {string} text - Texto a escapar
   * @returns {string} HTML escapado
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Inicializa el loader: carga datos y renderiza
   * Llamar una sola vez en window.load
   */
  async init() {
    console.log('[contentLoader] Initializing...');

    // Cargar datos
    const commands = await this.loadAllCommands();
    const curriculum = await this.loadCurriculum();
    const metadata = await this.loadMetadata();

    // Exponer globalmente para acceso en script.js
    window.__APP_DATA = {
      commands,
      curriculum,
      metadata,
      timestamp: new Date().toISOString()
    };

    console.log('[contentLoader] Initialization complete', window.__APP_DATA);
  }
};

// Auto-init cuando se carga el módulo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => contentLoader.init());
} else {
  contentLoader.init();
}
