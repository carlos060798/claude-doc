# Guía: Documentación y Compartición de Código Profesional

*Una guía práctica para crear repositorios profesionales que no alucinen, se mantengan actualizados y sean fáciles de usar.*

## Tabla de Contenidos

1. [Estructura de Repositorio Ideal](#estructura-de-repositorio-ideal)
2. [Documentación Clara y Validada](#documentación-clara-y-validada)
3. [Código Compartible](#código-compartible)
4. [Versionamiento Semántico](#versionamiento-semántico)
5. [Best Practices Anti-Alucinación](#best-practices-anti-alucinación)
6. [Checklist de Verificación](#checklist-de-verificación)

---

## 1. Estructura de Repositorio Ideal

### 1.1 Estructura de Carpetas Recomendada

```
mi-proyecto/
├── .github/
│   └── workflows/           # CI/CD, deployment automation
├── docs/                    # Documentación completa (guías, API)
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   └── TROUBLESHOOTING.md
├── examples/                # Ejemplos ejecutables
│   ├── basic-usage.js
│   ├── advanced-features.js
│   └── integration-example.js
├── src/                     # Código fuente
│   ├── index.js
│   ├── utils/
│   └── types/
├── tests/                   # Tests (unitarios, integración)
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── templates/               # Boilerplate para usuarios
│   ├── project-template/
│   └── minimal-setup/
├── .gitignore               # Archivos a ignorar (ver sección 3)
├── .npmignore               # Archivos a excluir de npm publish
├── LICENSE                  # Licencia (MIT, Apache 2.0, etc.)
├── README.md                # Punto de entrada principal
├── CHANGELOG.md             # Histórico de cambios
├── CONTRIBUTING.md          # Cómo contribuir
├── package.json             # Dependencias y metadatos
└── VERSION                  # Versión actual (opcional pero recomendado)
```

### 1.2 README: Estructura Ganadora

Un README profesional debe tener **exactamente esta estructura**, en este orden:

```markdown
# Project Name

[Una línea: qué hace tu proyecto]

[![npm version](badge-url)](link) 
[![Node.js Version](badge-url)](link)
[![License](badge-url)](link)
[![Build Status](badge-url)](link)

## Quick Start

```bash
npm install mi-proyecto
```

```js
// Ejemplo mínimo funcional en 5 líneas
import { miLibreria } from 'mi-proyecto';
const resultado = miLibreria.hacer('algo');
console.log(resultado);
```

## Features

- ✨ Característica 1
- ✨ Característica 2
- ✨ Característica 3

## Installation

```bash
npm install mi-proyecto
# o
yarn add mi-proyecto
```

**Requisitos:** Node.js >= 14.0

## Usage

### Basic Example

```js
// Código copy-paste que funciona
import { miLibreria } from 'mi-proyecto';

const instancia = new miLibreria({
  opcion1: 'valor',
  opcion2: 123
});

const resultado = await instancia.metodo();
```

### Advanced Configuration

[Enlace a docs/API.md]

## API Reference

Quick reference (ver docs/API.md para documentación completa):

- `miLibreria.metodo(options)` → Promise<Result>
- `miLibreria.otraFuncion(input)` → Result

## Examples

- [Basic Usage](examples/basic-usage.js)
- [Advanced Features](examples/advanced-features.js)
- [Real-world Integration](examples/integration-example.js)

## Contributing

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Cómo reportar bugs
- Cómo sugerir features
- Cómo hacer PR

## License

MIT © [Tu Nombre]

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para histórico completo de cambios.
```

**Reglas de Oro del README:**
- ✅ La sección "Quick Start" debe ser copy-paste funcional
- ✅ Máximo 2-3 ejemplos de código (pocos, pero valiosos)
- ✅ Links a documentación detallada, NO en el README
- ✅ Badges reales que apunten a estado actual
- ❌ NO hagas README de 5000 líneas
- ❌ NO copies ejemplos que no testeas

### 1.3 CONTRIBUTING.md: Guía para Colaboradores

```markdown
# Contributing to [Project Name]

¡Gracias por tu interés en contribuir!

## Setup

1. Fork el repositorio
2. Clone: `git clone https://github.com/tu-user/repo.git`
3. Instala dependencias: `npm install`
4. Corre tests: `npm test`

## Development Workflow

```bash
# Crea rama para tu feature
git checkout -b feature/mi-feature

# Haz cambios, corre tests
npm test

# Commit con mensajes claros
git commit -m "feat: descripción breve"

# Push a tu fork
git push origin feature/mi-feature

# Abre Pull Request
```

## Code Standards

- **Estilo:** ESLint + Prettier (corre `npm run format`)
- **Tests:** Mínimo 80% cobertura
- **Commits:** Conventional Commits (feat:, fix:, docs:, etc.)
- **TypeScript:** Tipos para todas las APIs públicas

## PR Checklist

Antes de enviar PR:

- [ ] Tests pasan: `npm test`
- [ ] Código formateado: `npm run format`
- [ ] Documentación actualizada
- [ ] Ejemplos funcionan: `npm run examples`
- [ ] No hay console.log ni debugger
- [ ] Commit mensaje sigue convención

## Reporting Bugs

Incluye:
1. Versión del proyecto
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Entorno (Node.js version, SO)

## Questions?

- Issues: Para bugs y features
- Discussions: Para preguntas
- Email: (si aplica)
```

---

## 2. Documentación Clara y Validada

### 2.1 Estructura de Documentación

**Archivos recomendados en `docs/`:**

| Archivo | Propósito |
|---------|-----------|
| `API.md` | Referencia completa de todas las funciones públicas |
| `ARCHITECTURE.md` | Explicación de diseño, decisiones, flujos |
| `EXAMPLES.md` | Ejemplos detallados por caso de uso |
| `TROUBLESHOOTING.md` | Problemas comunes y soluciones |
| `TESTING.md` | Cómo escribir tests, estrategia de testing |
| `CHANGELOG.md` | Histórico de versiones |

### 2.2 Escribir Documentación que No Alucine

**Principio fundamental:** La documentación debe generarse del código, no el código seguir la documentación.

#### Opción A: JSDoc + Generador

```javascript
/**
 * Procesa un archivo y retorna el resultado
 * 
 * @param {string} filePath - Ruta del archivo a procesar
 * @param {Object} options - Opciones de procesamiento
 * @param {boolean} options.verbose - Mostrar logs (default: false)
 * @param {number} options.timeout - Timeout en ms (default: 5000)
 * @returns {Promise<ProcessResult>} Resultado del procesamiento
 * @throws {FileNotFoundError} Si el archivo no existe
 * @throws {ProcessingError} Si falla el procesamiento
 * 
 * @example
 * const resultado = await procesarArchivo('./data.txt', { verbose: true });
 * console.log(resultado.success);
 */
export async function procesarArchivo(filePath, options = {}) {
  // implementación
}
```

**Luego genera docs automáticamente:**
```bash
npm run docs:generate  # Usa TypeDoc, JSDoc, etc.
```

#### Opción B: TypeScript + Declaraciones

```typescript
/**
 * Configuración de procesamiento
 */
export interface ProcessOptions {
  /** Mostrar logs detallados */
  verbose?: boolean;
  /** Timeout en milisegundos */
  timeout?: number;
}

/**
 * Resultado del procesamiento
 */
export interface ProcessResult {
  success: boolean;
  data: unknown;
  duration: number;
}

/**
 * Procesa un archivo
 * @throws FileNotFoundError
 */
export async function procesarArchivo(
  filePath: string,
  options?: ProcessOptions
): Promise<ProcessResult>;
```

Las definiciones TypeScript **SON** documentación ejecutable.

### 2.3 Ubicación de Ejemplos

**Cada tipo de ejemplo en su lugar:**

```
src/
├── index.ts                    # Código principal
├── types.ts                    # Definiciones TypeScript (= documentación)
└── ...

docs/
├── API.md                      # Referencia generada (puede ser auto)
├── EXAMPLES.md                 # Guías paso a paso

examples/
├── 01-basic-usage.js          # Funciona: node examples/01-basic-usage.js
├── 02-advanced-config.js
├── 03-error-handling.js
└── README.md                   # Cómo correr los ejemplos

tests/
└── examples.test.js            # Tests validan que ejemplos funcionan
```

### 2.4 Validar que Documentación = Código Actual

**Script de validación (incluido en CI):**

```bash
# En package.json
{
  "scripts": {
    "test": "jest",
    "test:examples": "node -e \"require('./tests/validate-examples.js')\"",
    "test:docs": "node -e \"require('./tests/validate-docs.js')\"",
    "verify:all": "npm run test && npm run test:examples && npm run test:docs"
  }
}
```

Ver sección 5 para scripts de validación automáticos.

---

## 3. Código Compartible

### 3.1 Qué Incluir en el Repositorio

**✅ INCLUIR:**

```
src/                           # Código fuente
├── index.js                   # Entry point limpio
├── core/
└── utils/

examples/                       # Ejemplos ejecutables
├── basic.js
└── advanced.js

docs/                          # Documentación
tests/                         # Tests
templates/                     # Boilerplate para usuarios
package.json                   # Dependencias
README.md                      # Documentación principal
CHANGELOG.md                   # Histórico
.npmignore                     # Qué excluir de npm
LICENSE                        # Licencia
```

### 3.2 Qué NO Incluir Nunca

**❌ NUNCA INCLUIR:**

```
node_modules/                  # Generado por npm install
dist/                          # Generado por build
.env                           # Secrets
.env.local                     # Secrets
*.log                          # Logs
.DS_Store                      # macOS system files
.idea/                         # IDE config
.vscode/                       # IDE config (settings sí, pero no secrets)
build/                         # Generado por build
coverage/                      # Generado por tests
.next/                         # Generado por Next.js
out/                           # Build output
temp/                          # Temporales
*.swp                          # Editor backups
personal-keys.json             # API keys
config.local.js                # Configuración local
```

### 3.3 .gitignore Checklist

```bash
# Dependencias
node_modules/
package-lock.json              # Si usas yarn, NPM, etc.
yarn.lock                       # Si usas yarn

# Generados en build
/dist
/build
/out
/.next
/.cache
/target                        # Para Rust, Java

# Logs y debug
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Secretos y env
.env
.env.local
.env.*.local
secrets.json
config.private.*
*.key
*.pem

# OS
.DS_Store                      # macOS
Thumbs.db                      # Windows
.vscode/settings.json          # IDE config personal

# IDEs
.idea/
.vscode/
*.swp
*.swo

# Testing
/coverage
/.nyc_output

# IDE temp
.eslintcache
.stylelintcache

# Editor personal config (OK en .gitignore)
.prettierignore
.prettierrc

# Temporal
temp/
tmp/
*.tmp
```

**Generar .gitignore automático:**

```bash
# Opción 1: gitignore.io
curl -s https://www.toptal.com/developers/gitignore/api/node,macos,windows > .gitignore

# Opción 2: npx
npx gitignore node
```

### 3.4 .npmignore (para librerías npm)

Si publicas a npm, crea `.npmignore`:

```
src/                           # Fuente original
tests/
examples/
docs/
.github/
scripts/
.eslintrc
.prettierrc
.gitignore
*.md
!README.md
!CHANGELOG.md
```

Sin `.npmignore`, npm usa `.gitignore`, lo que a veces incluye demasiado.

---

## 4. Versionamiento Semántico

### 4.1 Semantic Versioning (SemVer)

Versiones: **MAJOR.MINOR.PATCH**

```
MAJOR (1.0.0)   → Breaking changes, incompatible API
MINOR (1.5.0)   → Nuevas features, backwards compatible
PATCH (1.5.2)   → Bug fixes
```

**Ejemplos:**
- `1.0.0` → Versión inicial
- `1.2.0` → Nueva feature, sin breaking changes
- `1.2.3` → Bug fix
- `2.0.0` → Rediseño, breaking changes

### 4.2 CHANGELOG.md Profesional

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.1.0] - 2026-05-15

### Added
- Nuevo método `procesarEnParalelo()` para mejor performance
- Soporte para TypeScript strict mode
- Documentación para casos de error

### Changed
- Rediseño de API interna (sin breaking changes públicos)
- Mejorada performance de parsing 40%

### Fixed
- Bug: Error cuando input está vacío
- Bug: Memory leak en versión anterior

### Deprecated
- `antiguoMetodo()` será removido en v3.0.0, usa `nuevoMetodo()` en su lugar

### Removed
- Support para Node.js < 14 (usa v1.x para Node 12)

## [2.0.0] - 2026-04-01

### BREAKING CHANGES
- API public cambió: `parse(str)` ahora es `parseString(str)`
- Resultado ahora es AsyncIterator en lugar de Array

### Added
- Nuevo modo streaming para archivos grandes
- Mejor error handling

### Fixed
- Memory leak en datos grandes

## [1.0.0] - 2026-03-01

### Added
- Initial release
```

**Cómo mantenerlo automático:**

```bash
# En package.json
{
  "scripts": {
    "version": "npm run changelog && git add CHANGELOG.md"
  }
}
```

### 4.3 Git Tags para Releases

```bash
# Crear tag para versión
git tag -a v2.1.0 -m "Release version 2.1.0"

# Listar tags
git tag -l

# Push tags a remote
git push origin --tags

# Eliminar tag local
git tag -d v2.1.0

# Eliminar tag remoto
git push origin --delete v2.1.0
```

### 4.4 Versión en package.json

Siempre mantén versionado en `package.json`:

```json
{
  "name": "mi-proyecto",
  "version": "2.1.0",
  "description": "Descripción clara",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "keywords": ["keyword1", "keyword2"],
  "author": "Tu Nombre",
  "license": "MIT"
}
```

---

## 5. Best Practices Anti-Alucinación

### 5.1 Tests que Validen Ejemplos

Los ejemplos deben ser ejecutables y testeados:

```javascript
// tests/examples.test.js
const fs = require('fs');
const path = require('path');

describe('Examples', () => {
  const examplesDir = path.join(__dirname, '../examples');
  const exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));

  test('Todos los ejemplos deben tener extensión .js', () => {
    expect(exampleFiles.length).toBeGreaterThan(0);
  });

  test('Cada ejemplo es ejecutable', async () => {
    for (const file of exampleFiles) {
      const filePath = path.join(examplesDir, file);
      // Puedes agregar lógica para ejecutar cada ejemplo
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });
});
```

### 5.2 CI/CD que Valida Documentación

**GitHub Actions (.github/workflows/validate-docs.yml):**

```yaml
name: Validate Documentation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Validate examples
        run: npm run test:examples
      
      - name: Validate docs match code
        run: npm run test:docs
      
      - name: Check code formatting
        run: npm run format:check
      
      - name: Lint
        run: npm run lint
```

### 5.3 Code Review Checklist para Documentación

Antes de mergear código que cambia API:

**Checklist para reviewers:**

```markdown
## Documentation Review

- [ ] ¿Se actualizó `docs/API.md` si hay cambios de API?
- [ ] ¿Los ejemplos en `examples/` aún funcionan?
- [ ] ¿Se agregó ejemplo en `examples/` si es nueva feature?
- [ ] ¿Se actualizó `CHANGELOG.md`?
- [ ] ¿Los JSDoc/TypeScript types están correctos?
- [ ] ¿Se actualizó `README.md` si es cambio significativo?
- [ ] ¿Los tests pasan?
- [ ] ¿Se corrió `npm run test:examples`?
- [ ] ¿Se corrió `npm run test:docs`?

## Code Quality

- [ ] ¿No hay console.log, debugger, commented code?
- [ ] ¿Código formateado?
- [ ] ¿Tipos TypeScript completos?
- [ ] ¿Tests con cobertura >= 80%?
```

### 5.4 Validación de Ejemplos en Código

Script para ejecutar y validar ejemplos automáticamente:

**validate-examples.js:**

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const examplesDir = path.join(__dirname, '../examples');
const exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));

console.log(`\n✓ Validando ${exampleFiles.length} ejemplos...\n`);

let passed = 0;
let failed = 0;

for (const file of exampleFiles) {
  const filePath = path.join(examplesDir, file);
  
  try {
    // Timeout de 5 segundos por ejemplo
    execSync(`timeout 5s node "${filePath}"`, { stdio: 'pipe' });
    console.log(`✓ ${file}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${file} - ${error.message.split('\n')[0]}`);
    failed++;
  }
}

console.log(`\n${passed} ejemplos OK, ${failed} fallaron\n`);

if (failed > 0) {
  process.exit(1);
}
```

**En package.json:**
```json
{
  "scripts": {
    "test:examples": "node scripts/validate-examples.js"
  }
}
```

### 5.5 Validación de Documentación vs Código

**validate-docs.js:**

```javascript
const fs = require('fs');
const path = require('path');

// Verificar que todos los archivos públicos estén documentados
const srcDir = path.join(__dirname, '../src');
const docsFile = path.join(__dirname, '../docs/API.md');

const docs = fs.readFileSync(docsFile, 'utf-8');

function getExportedFunctions(dir) {
  const indexFile = path.join(dir, 'index.js');
  if (!fs.existsSync(indexFile)) return [];
  
  const content = fs.readFileSync(indexFile, 'utf-8');
  const exports = content.match(/export\s+(function|const|class)\s+(\w+)/g) || [];
  return exports.map(e => e.match(/\s+(\w+)$/)[1]);
}

const exported = getExportedFunctions(srcDir);
const undocumented = exported.filter(fn => !docs.includes(`\`${fn}\``));

if (undocumented.length > 0) {
  console.error(`❌ Funciones sin documentar: ${undocumented.join(', ')}`);
  process.exit(1);
} else {
  console.log(`✓ Todas las ${exported.length} funciones están documentadas`);
}
```

---

## 6. Checklist de Verificación

### 6.1 Pre-Release Checklist

Antes de publicar una versión nueva:

```markdown
## Pre-Release Checklist

### Documentación
- [ ] README.md está actualizado y ejemplo Quick Start funciona
- [ ] docs/API.md está completo
- [ ] docs/EXAMPLES.md cubre casos comunes
- [ ] CHANGELOG.md está actualizado
- [ ] CONTRIBUTING.md está correcto

### Código
- [ ] Todos los tests pasan: `npm test`
- [ ] Ejemplos funcionan: `npm run test:examples`
- [ ] Documentación válida: `npm run test:docs`
- [ ] Código formateado: `npm run format`
- [ ] Linting pasa: `npm run lint`
- [ ] TypeScript types correctos (si aplica)

### Versionamiento
- [ ] Versión en package.json bumped
- [ ] CHANGELOG.md actualizado con cambios
- [ ] Git tags creados (v2.1.0, etc.)

### Publishing (si es npm)
- [ ] .npmignore configurado correctamente
- [ ] Archivos innecesarios excluidos
- [ ] `npm pack` no incluye node_modules
- [ ] Listo para: `npm publish`

### Final
- [ ] Commit message sigue convención
- [ ] PR aprobado
- [ ] Código mergeado a main/master
```

### 6.2 Quality Gates (CI/CD)

Tu CI debe fallar si:

```bash
# 1. Tests no pasan
npm test -- --coverage --collectCoverageFrom='src/**/*.js'

# 2. Ejemplos no funcionan
npm run test:examples

# 3. Código no está formateado
npm run format:check

# 4. Linting falla
npm run lint

# 5. TypeScript tiene errores
npm run type-check

# 6. Build falla
npm run build

# 7. Documentación desactualizada
npm run test:docs
```

### 6.3 Post-Release

Después de publicar:

```bash
# Verificar que npm tiene la nueva versión
npm view mi-proyecto@latest

# Verificar que funciona instalándolo
npm install mi-proyecto@2.1.0 --save

# Verificar que funciona el Quick Start
node -e "const lib = require('mi-proyecto'); ..."

# Anunciar release en redes/comunidades
```

---

## 7. Template Listo para Copiar

Ver archivo: **TEMPLATE_PROYECTO_PROFESIONAL.md**

---

## 8. Scripts Automáticos

Ver archivos:
- **scripts/validate-examples.js** - Ejecuta todos los ejemplos
- **scripts/validate-docs.js** - Valida que API.md === código
- **scripts/bump-version.js** - Auto-bump versión SemVer
- **.github/workflows/validate-docs.yml** - CI/CD workflow

---

## Resumen: Los 10 Principios Clave

1. **README simple pero completo:** Quick start funcional + links a docs
2. **Documentación separada:** `docs/` para guías, `examples/` para código
3. **Ejemplos ejecutables:** Son tests también
4. **No alucinar:** JSDoc/TypeScript son la fuente de verdad
5. **Ignorar lo necesario:** .gitignore estricto, .npmignore para npm
6. **Versionar correctamente:** SemVer + CHANGELOG.md
7. **CI/CD que valide:** Tests, formato, documentación, ejemplos
8. **Code review:** Checklist específico para docs
9. **Validación continua:** Ejemplos y docs se ejecutan en cada commit
10. **Mantener actualizado:** Si cambias código, actualiza docs primero (o al mismo tiempo)

---

**Próximos pasos:**

1. Lee **TEMPLATE_PROYECTO_PROFESIONAL.md**
2. Copia la estructura a tu proyecto
3. Configura los scripts de validación
4. Agrega GitHub Actions workflow
5. Haz primer release siguiendo el checklist

