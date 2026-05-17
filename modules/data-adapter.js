/**
 * data-adapter.js — Adaptador para usar datos JSON en lugar de hardcoded COMMANDS_DATA
 * Este módulo actúa como puente entre script.js y los archivos JSON en /data/
 */

const dataAdapter = {
  // Cache de datos cargados
  _cache: {
    commands: null,
    curriculum: null,
    metadata: null,
    loadedAt: null
  },

  /**
   * Obtiene todos los comandos (combinados de todos los niveles)
   * Si contentLoader.init() fue llamado, usa datos en caché
   * Si no, carga directamente desde JSON
   */
  async getAllCommands() {
    if (this._cache.commands) {
      return this._cache.commands;
    }

    if (window.__APP_DATA && window.__APP_DATA.commands) {
      this._cache.commands = this._flattenCommands(window.__APP_DATA.commands);
      return this._cache.commands;
    }

    // Fallback: cargar manualmente
    const commands = {};
    for (let level = 1; level <= 4; level++) {
      try {
        const res = await fetch(`/data/commands-l${level}.json`);
        commands[level] = res.ok ? await res.json() : [];
      } catch (err) {
        console.warn(`Failed to load commands-l${level}.json`, err);
        commands[level] = [];
      }
    }

    this._cache.commands = this._flattenCommands(commands);
    return this._cache.commands;
  },

  /**
   * Aplana estructura por-nivel a un array único
   * Input: { 1: [...], 2: [...], ... }
   * Output: [...]
   */
  _flattenCommands(commandsByLevel) {
    const flat = [];
    Object.values(commandsByLevel).forEach(arr => {
      if (Array.isArray(arr)) flat.push(...arr);
    });
    return flat;
  },

  /**
   * Obtiene comandos de un nivel específico
   */
  async getCommandsByLevel(level) {
    if (window.__APP_DATA && window.__APP_DATA.commands && window.__APP_DATA.commands[level]) {
      return window.__APP_DATA.commands[level];
    }

    try {
      const res = await fetch(`/data/commands-l${level}.json`);
      return res.ok ? await res.json() : [];
    } catch (err) {
      console.error(`Failed to load commands level ${level}`, err);
      return [];
    }
  },

  /**
   * Obtiene curriculum
   */
  async getCurriculum() {
    if (this._cache.curriculum) return this._cache.curriculum;
    if (window.__APP_DATA && window.__APP_DATA.curriculum) {
      this._cache.curriculum = window.__APP_DATA.curriculum;
      return this._cache.curriculum;
    }

    try {
      const res = await fetch('/data/curriculum.json');
      if (res.ok) {
        this._cache.curriculum = await res.json();
        return this._cache.curriculum;
      }
    } catch (err) {
      console.error('Failed to load curriculum', err);
    }
    return null;
  },

  /**
   * Obtiene metadata
   */
  async getMetadata() {
    if (this._cache.metadata) return this._cache.metadata;
    if (window.__APP_DATA && window.__APP_DATA.metadata) {
      this._cache.metadata = window.__APP_DATA.metadata;
      return this._cache.metadata;
    }

    try {
      const res = await fetch('/data/metadata.json');
      if (res.ok) {
        this._cache.metadata = await res.json();
        return this._cache.metadata;
      }
    } catch (err) {
      console.error('Failed to load metadata', err);
    }
    return null;
  },

  /**
   * Estadísticas de validación por nivel
   */
  async getValidationStats() {
    const metadata = await this.getMetadata();
    if (!metadata || !metadata.levels) return null;

    const stats = {};
    Object.entries(metadata.levels).forEach(([level, data]) => {
      stats[level] = {
        total: data.commands,
        verified: data.verified_count,
        percentage: Math.round((data.verified_count / data.commands) * 100),
        status: data.status
      };
    });
    return stats;
  },

  /**
   * Búsqueda de comandos (compatible con función original)
   */
  async search(query) {
    const allCommands = await this.getAllCommands();
    const queryLower = query.toLowerCase();

    return allCommands.filter(cmd => {
      return (
        cmd.cmd.toLowerCase().includes(queryLower) ||
        cmd.desc.toLowerCase().includes(queryLower) ||
        cmd.example.toLowerCase().includes(queryLower) ||
        (cmd.category && cmd.category.toLowerCase().includes(queryLower))
      );
    });
  },

  /**
   * Obtiene comandos de una categoría
   */
  async getByCategory(category) {
    const allCommands = await this.getAllCommands();
    return allCommands.filter(cmd => cmd.category === category);
  },

  /**
   * Información de compatibilidad con script.js antiguo
   * Retorna estructura compatible para que script.js existente funcione
   */
  async getLegacyFormat() {
    const allCommands = await this.getAllCommands();
    // Retorna en formato que script.js espera (array plano)
    return allCommands;
  }
};

// Export para uso en script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = dataAdapter;
}
