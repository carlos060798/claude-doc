#!/usr/bin/env node

/**
 * Script de validación de ejemplos
 *
 * Ejecuta todos los ejemplos en la carpeta examples/ y verifica que funcionen
 *
 * Uso:
 *   node scripts/validate-examples.js
 *
 * Integración en package.json:
 *   "test:examples": "node scripts/validate-examples.js"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const EXAMPLES_DIR = path.join(__dirname, '../examples');
const TIMEOUT_MS = 5000;
const TIMEOUT_SECONDS = Math.ceil(TIMEOUT_MS / 1000);

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getExampleFiles() {
  if (!fs.existsSync(EXAMPLES_DIR)) {
    log(`❌ Directorio ${EXAMPLES_DIR} no existe`, 'red');
    return [];
  }

  return fs
    .readdirSync(EXAMPLES_DIR)
    .filter(f => f.endsWith('.js') || f.endsWith('.ts'))
    .sort();
}

function validateExample(filePath, fileName) {
  try {
    // Ejecutar archivo con timeout
    const command = `timeout ${TIMEOUT_SECONDS}s node "${filePath}"`;

    try {
      execSync(command, {
        stdio: 'pipe',
        encoding: 'utf-8'
      });
    } catch (error) {
      // Si el error es por timeout, lanzar error específico
      if (error.status === 124) {
        throw new Error(`Timeout (>${TIMEOUT_SECONDS}s)`);
      }
      // Si hay output en stderr, es probablemente un error
      if (error.stderr) {
        throw new Error(error.stderr.split('\n')[0]);
      }
      // Si hay error pero está en stdout, también es error
      if (error.message && error.message.includes('Error')) {
        throw error;
      }
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error.message || error.toString()
    };
  }
}

function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('Validando ejemplos ejecutables', 'blue');
  log('='.repeat(60), 'blue');

  const files = getExampleFiles();

  if (files.length === 0) {
    log(`\n⚠️  No se encontraron archivos de ejemplo en ${EXAMPLES_DIR}\n`, 'yellow');
    return 0;
  }

  log(`\nEncontrados ${files.length} ejemplos:\n`, 'blue');

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const file of files) {
    const filePath = path.join(EXAMPLES_DIR, file);
    const result = validateExample(filePath, file);

    if (result.success) {
      log(`  ✓ ${file}`, 'green');
      passed++;
    } else {
      log(`  ✗ ${file}`, 'red');
      log(`    Error: ${result.error}`, 'red');
      failed++;
    }

    results.push({ file, ...result });
  }

  // Resumen
  log('\n' + '='.repeat(60), 'blue');
  log(`Resumen: ${passed} OK, ${failed} FAILED`,
    failed > 0 ? 'red' : 'green'
  );
  log('='.repeat(60), 'blue' + '\n');

  if (failed > 0) {
    log('Ejemplos que fallaron:', 'red');
    results
      .filter(r => !r.success)
      .forEach(r => {
        log(`  - ${r.file}: ${r.error}`, 'red');
      });
    log('');
    process.exit(1);
  }

  log('✓ Todos los ejemplos se ejecutaron exitosamente\n', 'green');
  process.exit(0);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { validateExample, getExampleFiles };
