#!/usr/bin/env node

/**
 * Script de validación de documentación
 *
 * Verifica que:
 * 1. Todas las funciones/clases exportadas estén documentadas en docs/API.md
 * 2. Los ejemplos en docs/ existan y sean legibles
 * 3. No haya references rotos en documentación
 *
 * Uso:
 *   node scripts/validate-docs.js
 *
 * Integración en package.json:
 *   "test:docs": "node scripts/validate-docs.js"
 */

const fs = require('fs');
const path = require('path');

// Configuración
const SRC_DIR = path.join(__dirname, '../src');
const DOCS_DIR = path.join(__dirname, '../docs');
const API_DOCS = path.join(DOCS_DIR, 'API.md');

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

/**
 * Extrae funciones/clases exportadas de un archivo
 */
function getExportedItems(fileContent) {
  const items = [];

  // Patrones para buscar exports
  const patterns = [
    /export\s+function\s+(\w+)/g,
    /export\s+class\s+(\w+)/g,
    /export\s+const\s+(\w+)/g,
    /export\s+interface\s+(\w+)/g,
    /export\s+type\s+(\w+)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(fileContent)) !== null) {
      items.push(match[1]);
    }
  }

  return [...new Set(items)]; // Remover duplicados
}

/**
 * Obtiene todas las funciones exportadas del proyecto
 */
function getAllExportedItems() {
  if (!fs.existsSync(SRC_DIR)) {
    log(`⚠️  Directorio ${SRC_DIR} no existe`, 'yellow');
    return [];
  }

  const items = [];
  const files = fs.readdirSync(SRC_DIR).filter(
    f => f.endsWith('.js') || f.endsWith('.ts')
  );

  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const exported = getExportedItems(content);
    items.push(...exported);
  }

  return [...new Set(items)];
}

/**
 * Verifica que un archivo de documentación exista y sea válido
 */
function validateDocFile(filePath, fileDescription) {
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      error: `Archivo no existe: ${filePath}`
    };
  }

  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    return {
      valid: false,
      error: `Archivo vacío: ${filePath}`
    };
  }

  return { valid: true, error: null };
}

/**
 * Verifica que funciones estén documentadas
 */
function validateExportedItemsDocumented() {
  const result = validateDocFile(API_DOCS, 'API.md');
  if (!result.valid) {
    return {
      valid: false,
      missing: [],
      errors: [result.error]
    };
  }

  const apiDocs = fs.readFileSync(API_DOCS, 'utf-8');
  const exported = getAllExportedItems();

  if (exported.length === 0) {
    return {
      valid: true,
      missing: [],
      errors: []
    };
  }

  const missing = exported.filter(item => {
    // Busca backticks o código en markdown
    return !apiDocs.includes(`\`${item}\``) && !apiDocs.includes(`${item}(`);
  });

  return {
    valid: missing.length === 0,
    missing,
    errors: missing.length > 0
      ? [`${missing.length} funciones/tipos sin documentar: ${missing.join(', ')}`]
      : []
  };
}

/**
 * Verifica links en documentación
 */
function validateDocLinks() {
  const errors = [];

  // Buscar todos los archivos .md en docs/
  if (!fs.existsSync(DOCS_DIR)) {
    return { valid: true, errors: [] };
  }

  const mdFiles = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));

  for (const mdFile of mdFiles) {
    const filePath = path.join(DOCS_DIR, mdFile);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Buscar links markdown [text](path)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkPattern.exec(content)) !== null) {
      const [, text, link] = match;

      // Ignorar URLs externas
      if (link.startsWith('http')) {
        continue;
      }

      // Ignorar anchors internos
      if (link.startsWith('#')) {
        continue;
      }

      // Verificar que el archivo existe
      const linkedPath = path.join(DOCS_DIR, '..', link);
      const normalizedPath = path.normalize(linkedPath);

      if (!fs.existsSync(normalizedPath)) {
        errors.push(`${mdFile}: Link roto "${link}" → ${normalizedPath}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Verifica que README.md existe y tiene Quick Start
 */
function validateReadme() {
  const readmePath = path.join(__dirname, '../README.md');

  if (!fs.existsSync(readmePath)) {
    return {
      valid: false,
      error: 'README.md no existe'
    };
  }

  const content = fs.readFileSync(readmePath, 'utf-8');

  // Verificar secciones esenciales
  const requiredSections = ['Quick Start', 'Installation', 'Usage'];
  const missing = requiredSections.filter(section => !content.includes(section));

  if (missing.length > 0) {
    return {
      valid: false,
      error: `README.md falta secciones: ${missing.join(', ')}`
    };
  }

  // Verificar que tiene código de ejemplo
  const hasCodeExample = /```(js|javascript|typescript)\n[\s\S]*?\n```/.test(content);
  if (!hasCodeExample) {
    return {
      valid: false,
      error: 'README.md no tiene ejemplos de código'
    };
  }

  return { valid: true, error: null };
}

function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('Validando documentación', 'blue');
  log('='.repeat(60), 'blue' + '\n');

  let allValid = true;
  const results = [];

  // 1. Validar que API.md existe
  log('1. Verificando API.md...', 'blue');
  const apiDocCheck = validateDocFile(API_DOCS, 'API.md');
  if (apiDocCheck.valid) {
    log('   ✓ API.md existe\n', 'green');
  } else {
    log(`   ✗ ${apiDocCheck.error}\n`, 'red');
    allValid = false;
  }

  // 2. Validar que funciones exportadas estén documentadas
  log('2. Verificando que funciones estén documentadas...', 'blue');
  const exportedCheck = validateExportedItemsDocumented();
  if (exportedCheck.valid) {
    log(`   ✓ Todas las funciones exportadas están documentadas\n`, 'green');
  } else {
    log(`   ✗ Funciones sin documentar:\n`, 'red');
    exportedCheck.missing.forEach(item => {
      log(`      - ${item}`, 'red');
    });
    log('');
    allValid = false;
  }

  // 3. Validar links en documentación
  log('3. Verificando links en documentación...', 'blue');
  const linksCheck = validateDocLinks();
  if (linksCheck.valid) {
    log('   ✓ Todos los links en documentación son válidos\n', 'green');
  } else {
    log('   ✗ Links rotos encontrados:\n', 'red');
    linksCheck.errors.forEach(error => {
      log(`      - ${error}`, 'red');
    });
    log('');
    allValid = false;
  }

  // 4. Validar README.md
  log('4. Verificando README.md...', 'blue');
  const readmeCheck = validateReadme();
  if (readmeCheck.valid) {
    log('   ✓ README.md es válido\n', 'green');
  } else {
    log(`   ✗ ${readmeCheck.error}\n`, 'red');
    allValid = false;
  }

  // Resumen
  log('='.repeat(60), 'blue');
  if (allValid) {
    log('✓ Toda la documentación es válida', 'green');
  } else {
    log('✗ Problemas encontrados en documentación', 'red');
  }
  log('='.repeat(60), 'blue' + '\n');

  process.exit(allValid ? 0 : 1);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  getExportedItems,
  getAllExportedItems,
  validateDocLinks,
  validateReadme
};
