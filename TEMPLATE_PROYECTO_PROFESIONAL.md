# Template: Estructura de Proyecto Profesional

**Copia esta estructura para crear un proyecto nuevo listo para compartir.**

## Paso 1: Estructura de Carpetas

```bash
# Crear estructura base
mkdir -p mi-proyecto/{src,examples,docs,tests,scripts,.github/workflows,templates}
cd mi-proyecto

# Git init
git init
echo "# mi-proyecto" > README.md
git add .
git commit -m "initial: project structure"
```

## Paso 2: Archivos Esenciales

### 1. `package.json`

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "description": "Descripción clara y breve de qué hace",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:examples": "node scripts/validate-examples.js",
    "test:docs": "node scripts/validate-docs.js",
    "verify:all": "npm run build && npm test && npm run test:examples && npm run test:docs",
    "format": "prettier --write \"src/**/*.js\" \"tests/**/*.js\" \"examples/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\" \"tests/**/*.js\" \"examples/**/*.js\"",
    "lint": "eslint src tests examples",
    "lint:fix": "eslint --fix src tests examples",
    "docs:generate": "typedoc --out docs src/index.ts"
  },
  "keywords": ["keyword1", "keyword2"],
  "author": "Tu Nombre",
  "license": "MIT",
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### 2. `README.md` (Copy-paste de guía anterior)

```markdown
# mi-proyecto

Descripción de una línea de qué hace exactamente.

[![npm version](https://img.shields.io/npm/v/mi-proyecto.svg)](https://www.npmjs.com/package/mi-proyecto)
[![Node.js Version](https://img.shields.io/node/v/mi-proyecto.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://github.com/tu-usuario/mi-proyecto/actions/workflows/test.yml/badge.svg)](https://github.com/tu-usuario/mi-proyecto/actions)

## Quick Start

```bash
npm install mi-proyecto
```

```js
import { miLibreria } from 'mi-proyecto';

const resultado = await miLibreria.hacer('algo');
console.log(resultado);
```

## Features

- ✨ Feature 1
- ✨ Feature 2
- ✨ Feature 3

## Installation

**Requirements:** Node.js >= 14.0

```bash
npm install mi-proyecto
```

## Usage

### Basic Example

```js
import { miLibreria } from 'mi-proyecto';

const instancia = new miLibreria();
const resultado = await instancia.procesar('input');
```

### Configuration

Ver [docs/API.md](docs/API.md) para documentación completa.

## API

Quick reference:
- `miLibreria.metodo()` - Descripción breve
- `miLibreria.otraFuncion()` - Descripción breve

Ver [docs/API.md](docs/API.md) para API completa.

## Examples

- [Basic Usage](examples/01-basic-usage.js)
- [Advanced Features](examples/02-advanced-features.js)
- [Error Handling](examples/03-error-handling.js)

Ejecuta ejemplos:
```bash
node examples/01-basic-usage.js
```

## Contributing

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © Tu Nombre

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md)
```

### 3. `.gitignore`

```
# Dependencias
node_modules/
package-lock.json
yarn.lock

# Build
dist/
build/
out/
.next/
.cache/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Secrets
.env
.env.local
.env.*.local
secrets.json

# OS
.DS_Store
Thumbs.db

# IDEs
.idea/
.vscode/
*.swp
*.swo

# Testing
coverage/
.nyc_output/

# Temporal
temp/
tmp/
*.tmp
```

### 4. `.npmignore`

```
src/
tests/
examples/
docs/
.github/
scripts/
.eslintrc
.prettierrc
.gitignore
CONTRIBUTING.md
CHANGELOG.md
```

### 5. `LICENSE` (MIT)

```
MIT License

Copyright (c) 2026 Tu Nombre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

### 6. `CHANGELOG.md`

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-05-20

### Added
- Initial release
- Core functionality
- Documentation

### Security
- No known security issues
```

### 7. `CONTRIBUTING.md`

```markdown
# Contributing to mi-proyecto

¡Gracias por tu interés!

## Setup

1. Fork: `git clone https://github.com/tu-usuario/mi-proyecto.git`
2. Instala: `npm install`
3. Tests: `npm test`

## Development

```bash
git checkout -b feature/mi-feature
npm test
git commit -m "feat: descripción"
git push origin feature/mi-feature
```

## Code Standards

- ESLint + Prettier: `npm run format`
- Tests: Mínimo 80% cobertura
- Commits: Conventional Commits (feat:, fix:, docs:)

## PR Checklist

- [ ] Tests pasan: `npm test`
- [ ] Formateado: `npm run format`
- [ ] Documentación actualizada
- [ ] Ejemplos funcionan
- [ ] Changelog actualizado

## Reporting Bugs

1. Usa [Issues](https://github.com/tu-usuario/mi-proyecto/issues)
2. Incluye: versión, pasos, comportamiento esperado
3. Ejemplos/logs si es posible
```

## Paso 3: Código Fuente

### `src/index.ts` o `src/index.js`

```typescript
/**
 * Función principal de la librería
 * @param input - El input a procesar
 * @returns Resultado del procesamiento
 */
export function hacer(input: string): string {
  if (!input) {
    throw new Error('Input no puede estar vacío');
  }
  return `Procesado: ${input}`;
}

export interface Opciones {
  /** Habilitar modo verbose */
  verbose?: boolean;
}

/**
 * Función asincrónica
 */
export async function procesarArchivo(
  ruta: string,
  opciones?: Opciones
): Promise<string> {
  // implementación
  return 'resultado';
}
```

## Paso 4: Ejemplos Ejecutables

### `examples/01-basic-usage.js`

```javascript
// Este archivo debe ser ejecutable: node examples/01-basic-usage.js

const { hacer } = require('../dist/index.js');

console.log('=== Basic Usage Example ===\n');

try {
  const resultado = hacer('hola mundo');
  console.log('Entrada: "hola mundo"');
  console.log('Resultado:', resultado);
  console.log('\n✓ Ejemplo ejecutado exitosamente');
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
```

### `examples/02-advanced-features.js`

```javascript
const { procesarArchivo } = require('../dist/index.js');

console.log('=== Advanced Example ===\n');

(async () => {
  try {
    const resultado = await procesarArchivo('./data.txt', {
      verbose: true
    });
    console.log('Resultado:', resultado);
    console.log('\n✓ Ejemplo ejecutado exitosamente');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
})();
```

## Paso 5: Documentación

### `docs/API.md`

```markdown
# API Reference

## `hacer(input: string): string`

Procesa un string.

**Parameters:**
- `input` (string, required) - El string a procesar

**Returns:** (string) El resultado procesado

**Throws:**
- `Error` si input está vacío

**Example:**
```js
const { hacer } = require('mi-proyecto');
console.log(hacer('hello')); // "Procesado: hello"
```

## `procesarArchivo(ruta: string, opciones?: Opciones): Promise<string>`

Procesa un archivo de forma asincrónica.

**Parameters:**
- `ruta` (string, required) - Ruta del archivo
- `opciones` (Opciones, optional) - Configuración

**Opciones:**
- `verbose` (boolean) - Mostrar logs (default: false)

**Returns:** Promise que resuelve con resultado

**Example:**
```js
const { procesarArchivo } = require('mi-proyecto');
const resultado = await procesarArchivo('./data.txt', {
  verbose: true
});
```

## Interfaces

### Opciones

```typescript
interface Opciones {
  verbose?: boolean;
}
```
```

### `docs/EXAMPLES.md`

```markdown
# Examples & Guides

## Basic Usage

```js
const { hacer } = require('mi-proyecto');
const resultado = hacer('input');
console.log(resultado);
```

## Advanced Scenarios

[Ejemplos más complejos]

## Troubleshooting

[Problemas comunes y soluciones]
```

## Paso 6: Tests

### `tests/index.test.js`

```javascript
const { hacer, procesarArchivo } = require('../src/index.js');

describe('hacer', () => {
  test('procesa string correctamente', () => {
    const resultado = hacer('hola');
    expect(resultado).toBe('Procesado: hola');
  });

  test('lanza error si input está vacío', () => {
    expect(() => hacer('')).toThrow('Input no puede estar vacío');
  });
});

describe('procesarArchivo', () => {
  test('procesa archivo asincronamente', async () => {
    const resultado = await procesarArchivo('./test.txt');
    expect(resultado).toBeDefined();
  });
});
```

## Paso 7: Scripts de Validación

### `scripts/validate-examples.js`

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const examplesDir = path.join(__dirname, '../examples');
const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));

console.log(`\nValidando ${files.length} ejemplos...\n`);

let passed = 0;
let failed = 0;

for (const file of files) {
  try {
    const filePath = path.join(examplesDir, file);
    execSync(`timeout 5s node "${filePath}"`, { stdio: 'pipe' });
    console.log(`✓ ${file}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${file}`);
    failed++;
  }
}

console.log(`\n${passed} OK, ${failed} FAILED\n`);
process.exit(failed > 0 ? 1 : 0);
```

### `scripts/validate-docs.js`

```javascript
const fs = require('fs');
const path = require('path');

const docsFile = path.join(__dirname, '../docs/API.md');
const apiDocs = fs.readFileSync(docsFile, 'utf-8');

// Verificar que funciones principales estén documentadas
const requiredFunctions = ['hacer', 'procesarArchivo'];
const missing = requiredFunctions.filter(fn => !apiDocs.includes(fn));

if (missing.length > 0) {
  console.error(`\n✗ Funciones sin documentar: ${missing.join(', ')}\n`);
  process.exit(1);
} else {
  console.log(`\n✓ Todas las funciones públicas están documentadas\n`);
}
```

## Paso 8: GitHub Actions (CI/CD)

### `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14, 16, 18]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Validate examples
        run: npm run test:examples
      
      - name: Validate docs
        run: npm run test:docs
      
      - name: Check formatting
        run: npm run format:check
      
      - name: Lint
        run: npm run lint
```

## Paso 9: Configuración Adicional

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

### `.eslintrc.json`

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error"
  }
}
```

### `tsconfig.json` (si usas TypeScript)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

## Paso 10: Primeros Comandos

```bash
# Instalar dependencias
npm install

# Build (si usas TypeScript)
npm run build

# Validar todo
npm run verify:all

# Run tests
npm test

# Validar ejemplos
npm run test:examples

# Validar docs
npm run test:docs

# Formato automático
npm run format

# Lint
npm run lint
```

## Checklist Final

- [ ] Estructura de carpetas creada
- [ ] `package.json` completado
- [ ] `README.md` con Quick Start funcional
- [ ] `CHANGELOG.md`, `CONTRIBUTING.md` listos
- [ ] Ejemplos en `examples/` son ejecutables
- [ ] Tests en `tests/` funcionan
- [ ] Scripts de validación en `scripts/`
- [ ] GitHub Actions workflow configurado
- [ ] `.gitignore` y `.npmignore` correctos
- [ ] `npm run verify:all` pasa
- [ ] Primer commit hecho

## Próximos Pasos

1. **Publicar a npm:**
   ```bash
   npm login
   npm publish
   ```

2. **Versioning:**
   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   npm version minor  # 1.0.0 → 1.1.0
   npm version major  # 1.0.0 → 2.0.0
   git push --tags
   ```

3. **Mantener:**
   - Actualizar docs cuando cambies código
   - Correr `verify:all` antes de cada commit
   - Actualizar CHANGELOG.md
   - Revisar PRs con documentación checklist

