# Memoria global del usuario

## Curso Claude Code Mastery

El usuario está siguiendo el curso interactivo en `C:\Users\usuario\claude doc` (SPA `index.html`).

Si menciona "curso", "lección", "nivel", "checkpoint", "retomar" o "Mastery Guide":
1. Lee primero `C:\Users\usuario\.claude\curso-claude-code\progreso.md` para conocer dónde se quedó.
2. Usa los comandos custom `/curso-checkpoint` (guardar) y `/curso-retomar` (resumir y continuar).
3. El curso tiene 3 niveles: 1 Fundamentos · 2 Avanzado/MCP · 3 Experto/Skills. Cada nivel tiene objetivos, herramientas, capítulo, caso práctico, quiz y misión final.

## Verificación de Código
**Regla importante:** Siempre revisa código, NUNCA abras el navegador para verificar.
- Usa Grep para verificar contenido inyectado en archivos
- Usa Read para validar estructura HTML/JS
- Evita preview_start, preview_screenshot, browser tools (ahorra tokens)
- Si el código está correcto en los archivos, está hecho ✅

---

## Glob Patterns en Claude Code

Los patrones glob se usan en los archivos `rules` de Claude Code para especificar a qué archivos aplica cada regla. Es una forma compacta y poderosa de describir conjuntos de rutas sin necesidad de enumerarlas una por una.

### ¿Qué es un patrón glob?

Un glob es una plantilla que describe un conjunto de rutas de archivo mediante comodines. El sistema las expande a la lista concreta de archivos que encajan. El nombre viene de un programa antiguo de Unix (`glob` = global) que hacía exactamente esto: expandir comodines en la línea de comandos.

**Concepto clave**: Un glob se compara contra una ruta. O encaja completamente, o no encaja. No es código ni expresión regular.

Ejemplo:
```
Patrón:   src/**/*.ts
Ruta A:   src/utils/format.ts      ← ✅ encaja
Ruta B:   src/index.ts             ← ✅ encaja
Ruta C:   lib/utils/format.ts      ← ❌ NO encaja (no empieza por src/)
Ruta D:   src/components/Button.tsx ← ❌ NO encaja (extensión .tsx, no .ts)
```

### Caracteres especiales

#### El asterisco simple: `*`

Coincide con cualquier cadena **dentro de un mismo tramo de ruta**, sin cruzar separadores (`/`).

```
Patrón:  *.md
✅ README.md
✅ notas.md
❌ docs/guia.md   ← está en un subdirectorio

Patrón:  src/*.ts
✅ src/index.ts
✅ src/utils.ts
❌ src/utils/helpers.ts   ← hay otro nivel de por medio
```

Puedes usarlo múltiples veces en el mismo tramo:
```
*.test.ts           → login.test.ts, utils.test.ts
test-*.js           → test-auth.js, test-api.js
components/*Form.*  → LoginForm.tsx, SignupForm.jsx
```

#### El asterisco doble: `**` (globstar)

Coincide con **cualquier cadena, incluyendo separadores de directorio**. Atraviesa cuantos niveles haga falta.

```
Patrón:  **/*.ts
✅ index.ts
✅ src/utils.ts
✅ src/components/forms/Login.ts
✅ a/b/c/d/e/f/archivo.ts
```

Diferencia fundamental con `*`:
```
src/*.ts      → solo archivos .ts DIRECTAMENTE dentro de src
src/**/*.ts   → archivos .ts en src y en cualquier subdirectorio suyo
```

Tres usos típicos:

**Al principio** (en cualquier lugar del proyecto):
```
**/node_modules   → cualquier carpeta node_modules
**/*.log          → todos los logs, sin importar ubicación
```

**En medio** (saltar cantidad desconocida de niveles):
```
src/**/*.test.ts  → tests en src a cualquier profundidad
packages/**/dist  → carpeta dist de cualquier paquete
```

**Al final** (todo lo que hay a partir de aquí):
```
docs/**           → absolutamente todo dentro de docs
src/legacy/**     → todo el contenido de legacy
```

⚠️ **Importante**: `**` debe aparecer como tramo completo entre barras. `src**/foo` NO funciona; lo correcto es `src/**/foo`.

#### El signo de interrogación: `?`

Coincide con **exactamente un carácter cualquiera** (excepto `/`). Mucho más restrictivo que `*`.

```
Patrón:  test?.js
✅ test1.js
✅ testA.js
❌ test.js    ← falta el carácter
❌ test10.js  ← son dos caracteres

Patrón:  v?.?.?.md
✅ v1.2.3.md
✅ v9.0.1.md
❌ v1.10.0.md  ← "10" son dos caracteres
```

Se usa poco, pero es útil para formatos de nombre estrictos (versiones, IDs de longitud fija).

#### Clases de caracteres: `[...]`

Especifica un conjunto de caracteres aceptables en una posición. Coincide exactamente con **uno** de los caracteres listados.

```
Patrón:  [abc]rchivo.txt
✅ archivo.txt
✅ brchivo.txt
✅ crchivo.txt
❌ drchivo.txt
```

**Rangos con guion**:
```
[0-9]     → cualquier dígito
[a-z]     → cualquier minúscula
[A-Z]     → cualquier mayúscula
[a-zA-Z]  → cualquier letra
[0-9a-f]  → cualquier dígito hexadecimal
```

Ejemplos realistas:
```
log-[0-9].txt        → log-0.txt hasta log-9.txt
v[0-9].[0-9].ts      → v1.0.ts, v2.3.ts, v9.9.ts...
test-[a-z].spec.js   → test-a.spec.js, test-b.spec.js...
[A-Z]*.md            → ficheros .md que empiezan por mayúscula
```

**Negación dentro de corchetes**: Si empieza por `!` (o `^`), coincide con caracteres que **NO** estén en el conjunto:
```
[!0-9]*.txt   → .txt cuyo nombre NO empieza por dígito
[!_]*.js      → .js cuyo nombre NO empieza por guion bajo
```

⚠️ La negación en corchetes afecta solo a esa posición, no al patrón entero.

#### Alternativas: `{...}`

Lista varias alternativas separadas por comas. El patrón encaja si coincide con **cualquiera** de ellas (como un OR).

```
Patrón:  *.{js,ts}
✅ app.js
✅ app.ts
❌ app.jsx
```

Especialmente útil para agrupar extensiones:
```
*.{jpg,jpeg,png,gif,webp}       → cualquier formato de imagen
{Dockerfile,docker-compose.yml}  → ficheros de Docker
src/**/*.{test,spec}.ts         → tests con cualquiera de las convenciones
```

Las alternativas pueden incluir tramos de ruta completos:
```
{src,lib,packages}/**/*.ts  → TS en cualquiera de los tres directorios
```

#### Negación de patrón: `!patrón`

Excluye archivos que encajen con el patrón. Se usa típicamente para "incluir amplio, excluir específico":

```
**/*.ts        → incluye todos los TS
!**/*.test.ts  → excepto los tests
!**/node_modules/**  → y nunca nada de node_modules
```

Los patrones se evalúan en **orden**: cada patrón negado resta del conjunto acumulado hasta ese momento.

⚠️ Distinción importante:
- **Negación de patrón**: `!` al principio, excluye rutas **completas**
- **Negación en corchetes**: `[!abc]`, solo afecta a **una posición de carácter**

### Combinaciones útiles: ejemplos prácticos

**Todos los TypeScript sin los tests**:
```
**/*.ts
!**/*.test.ts
!**/*.spec.ts
```

**Solo componentes React en `src`**:
```
src/**/*.{jsx,tsx}
```

**Ficheros de configuración en la raíz**:
```
*.{json,yaml,yml,toml}
```

**Todos los README, dondequiera que estén**:
```
**/README.md
**/README
```

**Migraciones de BD numeradas**:
```
db/migrations/[0-9][0-9][0-9][0-9]_*.sql
```
(Coincide con `0001_init.sql`, `0042_add_users.sql`, etc.)

**Scripts de shell en `bin/`, cualquier profundidad**:
```
bin/**/*.{sh,bash,zsh}
```

**Cualquier fichero dentro de un directorio `__tests__`**:
```
**/__tests__/**
```

**Markdown de documentación, excepto borradores**:
```
docs/**/*.md
!docs/**/DRAFT-*.md
```

**Archivos de estilo, cualquier preprocesador**:
```
**/*.{css,scss,sass,less,styl}
```

**Código fuente menos lo generado**:
```
src/**
!src/**/generated/**
!src/**/*.generated.*
```

### Errores habituales y cómo evitarlos

1. **Confundir `*` con `**`**: 
   - ❌ `src/*.ts` no cubre subdirectorios
   - ✅ `src/**/*.ts` sí cubre

2. **Olvidar que `**` necesita aislamiento**:
   - ❌ `src**` o `**foo` (no funciona)
   - ✅ `src/**/foo` (correcto)

3. **Pensar que los globs son regex**:
   - Los globs NO tienen cuantificadores como `+` o `{3,5}`
   - El punto `.` es literal, no "cualquier carácter"
   - `app.js` significa exactamente `app.js`

4. **No pensar en ficheros ocultos**:
   - Archivos que empiezan por punto (`.env`, `.gitignore`) pueden quedar fuera
   - `*.json` NO tiene por qué capturar `.babelrc.json`
   - Si los quieres incluir: `.*` o `**/.*`

### Referencia rápida

| Patrón | Qué hace | Ejemplo |
|--------|----------|---------|
| `*` | Cualquier cadena sin cruzar barras | `*.ts` → `index.ts` |
| `**` | Cualquier cadena atravesando directorios | `src/**/*.ts` → `src/a/b/c.ts` |
| `?` | Exactamente un carácter | `v?.md` → `v1.md` pero no `v10.md` |
| `[abc]` | Uno de los caracteres listados | `[abc].js` → `a.js`, `b.js` o `c.js` |
| `[a-z]` | Un carácter en el rango | `[0-9].txt` → `0.txt` hasta `9.txt` |
| `[!abc]` | Un carácter que NO está en el conjunto | `[!_]*.js` → excluye los que empiezan por `_` |
| `{a,b}` | Alternativas, funciona como OR | `*.{js,ts}` → `app.js` o `app.ts` |
| `!patrón` | Excluye rutas que encajen | `!**/*.test.ts` → deja fuera los tests |

### Cómo aplicarlo a tus `rules`

Para cada regla que escribas en los archivos `rules` de Claude Code, pregúntate:

1. **¿Qué ficheros exactos deberían dispararla?** (especificidad)
2. **¿Qué ficheros parecidos deberían quedar fuera?** (límites)
3. **¿Hay algún directorio "trampa"** (`node_modules`, `dist`, `build`, `.next`) **que convenga excluir explícitamente?** (excepciones)

Responder estas tres preguntas casi siempre lleva a un glob que funciona bien. Y si dudas entre dos patrones, casi siempre el bueno es **el más específico que sigue cubriendo los casos que te importan**.

Un glob demasiado amplio activa la regla donde no toca y genera ruido. Uno demasiado estrecho deja sin cubrir casos legítimos. **Afina hasta que encaje.**
