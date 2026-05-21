#!/usr/bin/env node

/**
 * Script de bump de versión automático
 *
 * Auto-incrementa la versión en package.json siguiendo Semantic Versioning
 *
 * Uso:
 *   node scripts/bump-version.js patch    # 1.0.0 → 1.0.1
 *   node scripts/bump-version.js minor    # 1.0.0 → 1.1.0
 *   node scripts/bump-version.js major    # 1.0.0 → 2.0.0
 *   node scripts/bump-version.js 2.1.3    # 1.0.0 → 2.1.3 (específica)
 *
 * Integración en package.json:
 *   "version:patch": "node scripts/bump-version.js patch",
 *   "version:minor": "node scripts/bump-version.js minor",
 *   "version:major": "node scripts/bump-version.js major"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const PACKAGE_JSON = path.join(__dirname, '../package.json');
const CHANGELOG = path.join(__dirname, '../CHANGELOG.md');

/**
 * Parse de versión semántica
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Versión inválida: ${version}`);
  }
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3])
  };
}

/**
 * Formatea versión a string
 */
function formatVersion(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * Incrementa versión
 */
function bumpVersion(currentVersion, type) {
  if (!['major', 'minor', 'patch'].includes(type) && type.match(/^\d+\.\d+\.\d+$/)) {
    // Si es versión específica, retorna esa
    return type;
  }

  const version = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;

    case 'minor':
      version.minor++;
      version.patch = 0;
      break;

    case 'patch':
      version.patch++;
      break;

    default:
      throw new Error(`Tipo de versión inválido: ${type}. Usa: major, minor, patch`);
  }

  return formatVersion(version);
}

/**
 * Lee la versión actual de package.json
 */
function getCurrentVersion() {
  if (!fs.existsSync(PACKAGE_JSON)) {
    throw new Error(`${PACKAGE_JSON} no existe`);
  }

  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
  if (!pkg.version) {
    throw new Error('package.json no tiene versión');
  }

  return pkg.version;
}

/**
 * Actualiza la versión en package.json
 */
function updatePackageJsonVersion(newVersion) {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'));
  pkg.version = newVersion;
  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(pkg, null, 2) + '\n');
}

/**
 * Actualiza CHANGELOG.md con nuevo header para la versión
 */
function updateChangelog(newVersion) {
  if (!fs.existsSync(CHANGELOG)) {
    log(`⚠️  ${CHANGELOG} no existe, saltando actualización`, 'yellow');
    return;
  }

  const changelog = fs.readFileSync(CHANGELOG, 'utf-8');
  const today = new Date().toISOString().split('T')[0];

  // Buscar la sección de "Unreleased" o crear nueva
  const newEntry = `## [${newVersion}] - ${today}

### Added
-

### Changed
-

### Fixed
-

### Deprecated
-

### Removed
-

`;

  // Insertar después del header
  const lines = changelog.split('\n');
  let insertIndex = 0;

  // Buscar la primera línea de versión (##)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## [')) {
      insertIndex = i;
      break;
    }
  }

  lines.splice(insertIndex, 0, newEntry);
  fs.writeFileSync(CHANGELOG, lines.join('\n'));
}

/**
 * Crea un commit con la nueva versión
 */
function createVersionCommit(oldVersion, newVersion) {
  try {
    execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump version ${oldVersion} → ${newVersion}"`, {
      stdio: 'inherit'
    });
    execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`, {
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    log(`⚠️  No se pudo crear commit automático: ${error.message}`, 'yellow');
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    log('\nUso: node bump-version.js [major|minor|patch|X.Y.Z]\n', 'blue');
    log('Ejemplos:', 'blue');
    log('  node bump-version.js patch   # 1.0.0 → 1.0.1', 'blue');
    log('  node bump-version.js minor   # 1.0.0 → 1.1.0', 'blue');
    log('  node bump-version.js major   # 1.0.0 → 2.0.0', 'blue');
    log('  node bump-version.js 2.1.3   # 1.0.0 → 2.1.3\n', 'blue');
    process.exit(1);
  }

  const type = args[0].toLowerCase();

  log('\n' + '='.repeat(60), 'blue');
  log('Actualización de versión', 'blue');
  log('='.repeat(60), 'blue' + '\n');

  try {
    const oldVersion = getCurrentVersion();
    log(`Versión actual: ${oldVersion}`, 'blue');

    const newVersion = bumpVersion(oldVersion, type);
    log(`Versión nueva:  ${newVersion}\n`, 'blue');

    // Confirmación
    if (type !== 'patch' && type !== 'minor' && type !== 'major') {
      log(`Tipo: específica (${type})`, 'yellow');
    } else {
      log(`Tipo: ${type}`, 'yellow');
    }

    // Actualizar archivos
    log('\nActualizando archivos...', 'blue');

    updatePackageJsonVersion(newVersion);
    log('  ✓ package.json actualizado', 'green');

    updateChangelog(newVersion);
    log('  ✓ CHANGELOG.md actualizado', 'green');

    // Intentar crear commit
    log('\nCreando commit...', 'blue');
    const committed = createVersionCommit(oldVersion, newVersion);

    if (committed) {
      log('  ✓ Commit creado', 'green');
      log('  ✓ Tag creado', 'green');
      log('\nPróximos pasos:', 'blue');
      log(`  git push origin --tags`, 'yellow');
      log(`  npm publish`, 'yellow');
    } else {
      log('  ⚠️  Archivos actualizados pero sin commit automático', 'yellow');
      log('\nPróximos pasos manuales:', 'blue');
      log(`  git add package.json CHANGELOG.md`, 'yellow');
      log(`  git commit -m "chore: bump version ${oldVersion} → ${newVersion}"`, 'yellow');
      log(`  git tag -a v${newVersion} -m "Release ${newVersion}"`, 'yellow');
      log(`  git push origin --tags`, 'yellow');
      log(`  npm publish`, 'yellow');
    }

    log('\n' + '='.repeat(60), 'blue');
    log(`✓ Versión actualizada a ${newVersion}`, 'green');
    log('='.repeat(60), 'blue' + '\n');

  } catch (error) {
    log(`\n✗ Error: ${error.message}\n`, 'red');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { bumpVersion, parseVersion, formatVersion };
