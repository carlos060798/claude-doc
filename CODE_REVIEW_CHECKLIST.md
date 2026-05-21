# Code Review Checklist para Documentación

*Usar este checklist cuando reviews código que cambia API, añade features, o modifica comportamiento.*

## Antes de Revisar

- [ ] Tienes acceso al código
- [ ] Entiendes el cambio a alto nivel
- [ ] Has leído el PR description

---

## 1. Documentación de API

### Si hay cambios de API:

- [ ] **¿Se actualizó `docs/API.md`?**
  - Función/método nuevo → ¿Está documentado?
  - Parámetro nuevo → ¿Se agregó a lista de parámetros?
  - Cambio en retorno → ¿Se refleja en sección Returns?
  - Throwing errores → ¿Está en sección Throws?

- [ ] **¿Los JSDoc/TypeScript types son correctos?**
  ```javascript
  ✓ Bien:
  /**
   * Procesa un archivo
   * @param {string} filePath - Ruta del archivo
   * @returns {Promise<Result>} El resultado
   */
  
  ✗ Mal:
  /**
   * Process
   */
  function procesar(x) { }
  ```

- [ ] **¿Los ejemplos en JSDoc/comentarios funcionan?**
  ```javascript
  ✓ Bien:
  /**
   * @example
   * const resultado = await procesar('./file.txt');
   * console.log(resultado.success);
   */
  
  ✗ Mal:
  /**
   * @example
   * const resultado = procesar(); // incompleto
   */
  ```

---

## 2. Ejemplos Ejecutables

### Si hay código de ejemplo nuevo o modificado:

- [ ] **¿Existe ejemplo en `examples/` para el nuevo feature?**
  - Nueva feature importante → ¿Tiene ejemplo?
  - Breaking change → ¿Hay ejemplo de la nueva forma?
  - Caso de uso común → ¿Está documentado?

- [ ] **¿El ejemplo es copy-paste funcional?**
  ```javascript
  ✓ Bien:
  // examples/01-basic-usage.js
  const { hacer } = require('../dist/index.js');
  const resultado = hacer('input');
  console.log(resultado);
  
  ✗ Mal:
  // const resultado = hacer(...) // comentado
  // console.log('TODO') // incompleto
  ```

- [ ] **¿El ejemplo corre sin errores?**
  ```bash
  npm run test:examples
  ```

- [ ] **¿No tiene console.log de debug?**
  ```javascript
  ✗ Mal:
  console.log('DEBUG:', data); // déjalo para logs
  ```

---

## 3. README.md

### Si es cambio significativo o nuevo proyecto:

- [ ] **¿El Quick Start sigue funcionando?**
  - ¿El código de ejemplo es válido?
  - ¿Los comandos de instalación funcionan?

- [ ] **¿Se actualizó si hay breaking change?**
  - ¿Menciona la versión que requiere?
  - ¿Hay migration guide si es necesario?

- [ ] **¿Los badges están correctos?**
  - ¿Apuntan a URLs válidas?
  - ¿Están actualizados?

---

## 4. CHANGELOG.md

### Antes de mergear:

- [ ] **¿Se actualizó `CHANGELOG.md`?**
  - Nueva feature → `### Added`
  - Bug fix → `### Fixed`
  - Breaking change → `### BREAKING CHANGES`
  - Deprecación → `### Deprecated`

- [ ] **¿El formato es correcto?**
  ```markdown
  ✓ Bien:
  ### Added
  - New `procesarEnParalelo()` function
  - Support for streaming large files
  
  ✗ Mal:
  - fixed something (sin categoría)
  ```

---

## 5. CONTRIBUTING.md

### Si agregaste reglas o procesos nuevos:

- [ ] **¿Se actualizó `CONTRIBUTING.md`?**
  - Nuevo standard de código → ¿Está documentado?
  - Nuevo tool en setup → ¿Lo menciona?
  - Cambio en workflow → ¿Lo explica?

---

## 6. Documentación Técnica

### Si hay cambio arquitectónico o behavior significativo:

- [ ] **¿Se actualizó `docs/ARCHITECTURE.md`?**
  - Nuevo módulo → ¿Se describió?
  - Cambio de diseño → ¿Se explican decisiones?
  - Flujo modificado → ¿Se actualiza diagrama/explicación?

- [ ] **¿Se actualizó `docs/TROUBLESHOOTING.md`?**
  - Nuevo error posible → ¿Se documenta?
  - Cambio que puede quebrar upgrade → ¿Se menciona?

---

## 7. Calidad del Código

### Todos los PRs:

- [ ] **¿No hay console.log, debugger, o código comentado?**
  ```javascript
  ✗ Mal:
  console.log('DEBUG DATA', obj);
  // const oldWay = process(x);
  debugger;
  
  ✓ Bien:
  // Si necesitas logs, usa logger
  logger.debug('Processing:', obj);
  ```

- [ ] **¿Está formateado correctamente?**
  ```bash
  npm run format:check
  ```

- [ ] **¿TypeScript types son completos?**
  - ¿Todas las funciones públicas tienen tipos?
  - ¿No hay `any` innecesario?

- [ ] **¿Los tests pasan?**
  ```bash
  npm test
  ```

- [ ] **¿Cobertura de tests >= 80%?**
  ```bash
  npm test -- --coverage
  ```

---

## 8. Validación Automática

### Scripts que DEBEN pasar:

```bash
# Formato
npm run format:check

# Linting
npm run lint

# Tests con cobertura
npm test -- --coverage

# Ejemplos ejecutables
npm run test:examples

# Documentación vs código
npm run test:docs

# TypeScript (si aplica)
npm run type-check

# Build
npm run build

# Todo junto
npm run verify:all
```

---

## 9. Links y Referencias

### Si hay links internos o referencias:

- [ ] **¿Todos los links internos son válidos?**
  ```markdown
  ✓ Bien:
  [CONTRIBUTING.md](CONTRIBUTING.md)
  [API Reference](docs/API.md)
  
  ✗ Mal:
  [Link](docs/this-file-doesnt-exist.md)
  ```

- [ ] **¿Los links a secciones existen?**
  ```markdown
  ✗ Mal:
  [See Installation](#instalation)  // typo en heading
  
  ✓ Bien:
  [See Installation](#installation)
  ```

---

## 10. Decisiones de Review

### En caso de dudas:

- [ ] **¿La documentación es clara?**
  - ¿Un usuario nuevo la entiendería?
  - ¿Hay ejemplos de cada feature?

- [ ] **¿La documentación está actualizada?**
  - ¿Refleja el código real?
  - ¿No hay referencias a código viejo?

- [ ] **¿Está completa?**
  - ¿No falta nada importante?
  - ¿Están todos los casos cubiertos?

---

## Comentarios al Autor

### Si algo no está bien:

**Para documentación faltante:**
```
Request changes con:
"Missing documentation for new function X.
Please add to docs/API.md with JSDoc example."
```

**Para ejemplos rotos:**
```
"Example in examples/02-advanced.js fails with:
[error message]. Please fix and verify with npm run test:examples"
```

**Para código sin limpiar:**
```
"Please remove console.log debug statements before merge.
Run npm run format before final commit."
```

---

## Aprobación Final

Aprueba el PR si:

- ✅ Todos los puntos de arriba están OK
- ✅ Scripts `npm run verify:all` pasan
- ✅ Documentación es clara y completa
- ✅ No hay issues críticos de código quality
- ✅ Tests tienen cobertura adecuada

**NO apruebes si:**

- ❌ Faltan tests significativos
- ❌ Documentación está desactualizada o incompleta
- ❌ Hay código comentado o debug statements
- ❌ Ejemplos no funcionan
- ❌ Breaking changes sin CHANGELOG/docs

---

## Template para Comentario de Aprobación

```markdown
✅ Approved

Cambios revisados:
- [x] API documentation actualizada
- [x] Ejemplos funcionan
- [x] CHANGELOG.md actualizado
- [x] Tests pasan y cobertura OK
- [x] Código formateado y sin debug

Todo listo para mergear. ¿Quién es el reviewer siguiente?
```

---

## Template para Comentario de Cambios Requeridos

```markdown
❌ Changes Requested

Issues encontrados:

1. **Falta documentación de API**
   - Nueva función `procesarEnParalelo()` no tiene JSDoc
   - Agrega comentario con parámetros y return type

2. **Ejemplo incompleto**
   - `examples/03-advanced.js` tiene código comentado
   - Completa o elimina

3. **CHANGELOG.md**
   - No menciona la nueva feature
   - Agrega bajo ### Added

Por favor resuelve y solicita re-review.
```

---

## Recursos Rápidos

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [JSDoc](https://jsdoc.app/)

