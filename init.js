/**
 * init.js — Inicialización de datos JSON
 * Se ejecuta ANTES de script.js para proveer COMMANDS_DATA, SCENARIOS, etc.
 * desde archivos JSON en lugar de valores hardcoded
 */

(async function initializeAppData() {
  console.log('[init.js] Starting data initialization from JSON...');

  try {
    // Cargar todos los comandos desde JSON
    const commandsByLevel = {};
    for (let level = 1; level <= 4; level++) {
      try {
        const response = await fetch(`/data/commands-l${level}.json`);
        if (response.ok) {
          commandsByLevel[level] = await response.json();
          console.log(`[init.js] Loaded ${commandsByLevel[level].length} commands for level ${level}`);
        } else {
          console.warn(`[init.js] Failed to load commands-l${level}.json: ${response.statusText}`);
          commandsByLevel[level] = [];
        }
      } catch (err) {
        console.warn(`[init.js] Error loading commands-l${level}.json:`, err);
        commandsByLevel[level] = [];
      }
    }

    // Flatear a un único array para compatibilidad con script.js
    const COMMANDS_DATA = [];
    Object.values(commandsByLevel).forEach(cmds => {
      if (Array.isArray(cmds)) COMMANDS_DATA.push(...cmds);
    });

    // Exponer globalmente para que script.js lo use
    window.__COMMANDS_DATA_LOADED = true;
    window.COMMANDS_DATA = COMMANDS_DATA;
    window.COMMANDS_BY_LEVEL = commandsByLevel;

    console.log(`[init.js] ✅ Loaded ${COMMANDS_DATA.length} total commands`);
    console.log('[init.js] Data available at window.COMMANDS_DATA and window.COMMANDS_BY_LEVEL');

  } catch (error) {
    console.error('[init.js] Fatal error during initialization:', error);
    window.__COMMANDS_DATA_LOADED = false;
  }
})();
