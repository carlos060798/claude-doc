# Quick Start: Documentar tu Proyecto Profesionalmente

*Para cuando tienes 5 minutos y necesitas empezar ahora.*

## En 3 Pasos

### 1. Copiar Estructura (5 min)

```bash
# Si es proyecto nuevo
mkdir -p mi-proyecto/{src,examples,docs,tests,scripts,.github/workflows}
cd mi-proyecto
git init

# Si es proyecto existente
mkdir -p examples docs tests scripts .github/workflows
```

### 2. Crear Archivos Mínimos (10 min)

Copia estos 3 archivos:

#### `README.md`
```markdown
# Mi Proyecto

Una línea describiendo qué hace.

## Quick Start

```bash
npm install mi-proyecto
```

```js
import { miLibreria } from 'mi-proyecto';
const resultado = await miLibreria.hacer('algo');
```

## Features

- ✨ Feature 1
- ✨ Feature 2

## Installation

npm install mi-proyecto

## Usage

Ver [docs/API.md](docs/API.md)

## Contributing

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

#### `package.json`
```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "description": "Breve descripción",
  "main": "dist/index.js",
  "scripts": {
    "test": "jest",
    "test:examples": "node scripts/validate-examples.js",
    "test:docs": "node scripts/validate-docs.js",
    "verify:all": "npm test && npm run test:examples && npm run test:docs"
  },
  "license": "MIT"
}
```

#### `.gitignore`
```
node_modules/
dist/
.env
.DS_Store
coverage/
```

### 3. Documentar tu Código (15 min)

Escribe JSDoc en tu código:

```javascript
/**
 * Procesa un archivo
 * @param {string} filePath - Ruta del archivo
 * @param {Object} options - Opciones
 * @returns {Promise<Result>} El resultado
 * @example
 * const resultado = await procesar('./data.txt');
 */
export async function procesar(filePath, options = {}) {
  // tu código
}
```

Luego crea `docs/API.md`:

```markdown
# API Reference

## procesar(filePath, options)

Procesa un archivo.

**Parameters:**
- `filePath` (string) - Ruta del archivo
- `options` (Object) - Opciones

**Returns:** Promise<Result>

**Example:**
```js
const resultado = await procesar('./data.txt');
console.log(resultado);
```
```

## En 5 Scripts

Copia estos scripts a `scripts/`:

### 1. `scripts/validate-examples.js`
```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const examplesDir = path.join(__dirname, '../examples');
const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));

let passed = 0, failed = 0;
for (const file of files) {
  try {
    execSync(`timeout 5s node "${path.join(examplesDir, file)}"`, { stdio: 'pipe' });
    console.log(`✓ ${file}`);
    passed++;
  } catch {
    console.error(`✗ ${file}`);
    failed++;
  }
}
console.log(`\n${passed} OK, ${failed} FAILED\n`);
process.exit(failed > 0 ? 1 : 0);
```

### 2. `scripts/validate-docs.js`
```javascript
const fs = require('fs');
const path = require('path');

const apiDocs = fs.readFileSync(path.join(__dirname, '../docs/API.md'), 'utf-8');
const requiredFunctions = ['tuFuncion1', 'tuFuncion2']; // Personaliza

const missing = requiredFunctions.filter(fn => !apiDocs.includes(fn));
if (missing.length > 0) {
  console.error(`✗ Sin documentar: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('✓ Documentación OK\n');
```

### 3. `scripts/bump-version.js`
```javascript
const fs = require('fs');
const path = require('path');

const type = process.argv[2]; // 'patch', 'minor', 'major'
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);

if (type === 'patch') pkg.version = `${major}.${minor}.${patch + 1}`;
if (type === 'minor') pkg.version = `${major}.${minor + 1}.0`;
if (type === 'major') pkg.version = `${major + 1}.0.0`;

fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(pkg, null, 2) + '\n');
console.log(`✓ Versión bumped a ${pkg.version}`);
```

## Checklist Mínimo

Antes de cada release:

- [ ] `README.md` tiene Quick Start funcional
- [ ] `docs/API.md` documenta todas las funciones públicas
- [ ] `examples/` tiene al menos 1 ejemplo ejecutable
- [ ] `npm run test:examples` pasa
- [ ] `npm run test:docs` pasa
- [ ] `CHANGELOG.md` está actualizado
- [ ] `package.json` versión bumped

## Comandos Esenciales

```bash
# Crear ejemplo nuevo
echo "const { miFunc } = require('../dist/index.js');
console.log(miFunc('test'));" > examples/01-basic.js

# Ejecutar ejemplos
npm run test:examples

# Validar docs
npm run test:docs

# Bump versión
node scripts/bump-version.js patch

# Verificar todo
npm run verify:all
```

## Plantillas Copy-Paste

### Plantilla: Función Documentada

```javascript
/**
 * Descripción clara y breve de qué hace
 *
 * @param {string} input - Descripción del parámetro
 * @param {Object} options - Opciones (opcional)
 * @param {boolean} options.verbose - Mostrar logs (default: false)
 * @returns {Promise<string>} Descripción del retorno
 * @throws {Error} Si algo falla
 *
 * @example
 * const resultado = await miFunc('entrada');
 * console.log(resultado);
 */
export async function miFunc(input, options = {}) {
  if (!input) throw new Error('Input requerido');
  return 'resultado';
}
```

### Plantilla: Ejemplo Ejecutable

```javascript
// examples/01-basic-usage.js
// Este archivo es copy-paste en documentación
// SIEMPRE debe ser ejecutable: node examples/01-basic-usage.js

const { tuFuncion } = require('../dist/index.js');

console.log('=== Basic Usage ===\n');

try {
  const resultado = tuFuncion('entrada');
  console.log('Resultado:', resultado);
  console.log('\n✓ Ejemplo OK');
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
```

### Plantilla: CONTRIBUTING.md

```markdown
# Contributing

## Setup

```bash
git clone https://github.com/tu-usuario/tu-proyecto.git
npm install
npm test
```

## Before PR

- [ ] Tests pasan: `npm test`
- [ ] Formato OK: `npm run format`
- [ ] Documentación actualizada
- [ ] Ejemplos funcionan

## Code Style

- ESLint + Prettier
- Conventional Commits (feat:, fix:, docs:)
- Mínimo 80% test coverage
```

## Errores Comunes (Y Cómo Evitarlos)

### ❌ README con código que no funciona
```javascript
// ✗ MAL: Incompleto
const { hacer } = require('mi-proyecto');
hacer(); // falta input

// ✓ BIEN: Copy-paste funcional
const { hacer } = require('mi-proyecto');
const resultado = hacer('input');
console.log(resultado);
```

### ❌ Documentación desactualizada
```javascript
// ✓ Solución: Documenta en JSDoc y genera desde código
/**
 * @param {string} input - El string a procesar
 * @returns {string} Procesado
 */
export function procesar(input) { }
```

### ❌ Ejemplos que no corren
```bash
# ✓ Solución: Testea en CI
npm run test:examples
```

### ❌ Versión manual y olvidada
```bash
# ✓ Solución: Script automático
node scripts/bump-version.js patch
```

## Siguientes Pasos

1. Lee `GUIA_DOCUMENTACION_PROFESIONAL.md` para detalles
2. Copia `TEMPLATE_PROYECTO_PROFESIONAL.md` para estructura completa
3. Integra scripts de validación en tu CI/CD
4. Usa `CODE_REVIEW_CHECKLIST.md` en PRs

## Recursos

- **Detailed Guide:** `GUIA_DOCUMENTACION_PROFESIONAL.md`
- **Full Template:** `TEMPLATE_PROYECTO_PROFESIONAL.md`
- **Code Review:** `CODE_REVIEW_CHECKLIST.md`
- **Scripts:** `scripts-validacion/`

## FAQ

**P: ¿Dónde pongo ejemplos?**
R: En carpeta `examples/`, uno por caso de uso. Deben ser ejecutables.

**P: ¿Cómo documento funciones?**
R: JSDoc en el código + `docs/API.md` como referencia.

**P: ¿Con qué frecuencia actualizo CHANGELOG?**
R: Con cada feature/fix que mergees.

**P: ¿Necesito CI/CD?**
R: Sí, al menos validate-docs.yml para verificar antes de merge.

**P: ¿Puedo saltarme documentación?**
R: No si quieres que otros (y tú futuro) usen tu código.

---

**Ready?** Empieza ahora mismo:

```bash
mkdir mi-proyecto && cd mi-proyecto && git init
# Copia los 3 archivos mínimos de arriba
# Haz tu primer commit
git add -A && git commit -m "initial: project setup"
```

¡Listo! Tu proyecto está profesionalmente configurado.

