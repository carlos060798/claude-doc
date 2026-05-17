// Practical Use Cases & Workflows for Claude Code
// Learning Levels: 1 (Fundamentos), 2 (Intermedio), 3 (Avanzado)
// Each case includes: real-world scenario, step-by-step commands, expected output, tips & pitfalls

export const PRACTICAL_USE_CASES = {
  // ================================================================
  // NIVEL 1: FUNDAMENTOS — Everyday Developer Tasks
  // ================================================================
  nivel1: {
    title: 'Nivel 1: Fundamentos — Tareas Diarias del Desarrollador',
    intro: 'Casos reales que cualquier desarrollador enfrenta: setup inicial, código review, debugging básico. Sin MCP, sin Skills avanzadas. Solo Claude Code vanilla.',
    cases: [
      {
        id: 'level1-new-project',
        title: 'Caso 1: Configurar primer proyecto con Claude Code',
        description: 'Acabas de clonar un repositorio que no conoces. Quieres entender su estructura rápidamente y dejar configurado para sesiones futuras.',
        learning_level: 1,
        scenario: {
          context: 'Nuevo desarrollador en un equipo. El repo es un Next.js + Postgres. Necesitas entender la stack, arquitectura y convenciones antes de tu primer PR.',
          time_estimate: '15-20 minutos',
          prior_knowledge: 'Git, Node.js básico',
        },
        steps: [
          {
            step: 1,
            action: 'Navegar al proyecto y verificar instalación',
            command: 'cd mi-proyecto && claude --version',
            expectedResult: 'Salida: "Claude Code v2.x.x" o similar. Confirma que Claude está instalado.',
            tip: 'Si falla, ejecuta `npm install -g @anthropic-ai/claude-code`',
          },
          {
            step: 2,
            action: 'Iniciar sesión con Claude Code',
            command: 'cd mi-proyecto && claude',
            expectedResult: 'Se abre una sesión interactiva. Ves el prompt de Claude esperando comandos (terminales bash + slash commands).',
            tip: 'La primera vez te pide OAuth. Aceptas en el navegador. Queda registrado globalmente.',
          },
          {
            step: 3,
            action: 'Generar CLAUDE.md automático',
            command: '/init',
            expectedResult: 'Claude analiza el repo (package.json, estructura de carpetas, README). Genera un CLAUDE.md base con:\n- Stack detectado (Next.js, Postgres, etc.)\n- Scripts npm útiles\n- Archivos clave\n- Convenciones básicas',
            tip: 'Revisa el resultado. Si está incomplete, edítalo manualmente.',
          },
          {
            step: 4,
            action: 'Entender la arquitectura mencionando archivos clave',
            command: 'Revisa el archivo CLAUDE.md que se creó. Luego pregunta:\n\n"@package.json @src/app.tsx @prisma/schema.prisma — ¿Cuál es la arquitectura de este proyecto? ¿Dónde empezaría si me pidieras que añada autenticación?"',
            expectedResult: 'Claude te da un overview de:\n- Dependencias principales\n- Estructura de carpetas\n- Dónde ir para features específicas\n- Patrones usados (next.js app router, ORM, etc)',
            tip: 'Usa @ para mencionar archivos. Claude los carga automáticamente sin que tengas que copiar-pegar.',
          },
          {
            step: 5,
            action: 'Mejorar el CLAUDE.md con tu entendimiento',
            command: 'Abre el archivo y añade secciones:\n```markdown\n## Arquitectura\n[Descripción que obtuviste de Claude]\n\n## Comandos Frecuentes\nnpm run dev      # Dev server con hot reload\nnpm run build    # Production build\nnpm test         # Suite de tests\nnpm run migrate  # Migrations de Prisma\n```',
            expectedResult: 'Un CLAUDE.md completo que describe cómo funciona el proyecto. La próxima sesión lo cargará automáticamente.',
            tip: 'Este archivo es tu "memory" del proyecto. Actualízalo cada vez que aprendas algo importante.',
          },
          {
            step: 6,
            action: 'Verificar configuración',
            command: '/doctor',
            expectedResult: 'Diagnóstico que verifica:\n- ¿Está CLAUDE.md en la raíz?\n- ¿Node.js está instalado?\n- ¿Hay variables de entorno configuradas?\n- ¿El .git está sano?',
            tip: 'Si hay warnings, léelos. Usualmente son sobre .env o variables que necesitas configurar.',
          },
        ],
        expected_output: {
          files_created: ['CLAUDE.md en la raíz del proyecto'],
          state: 'Proyecto configurado. Próxima sesión cargará contexto automáticamente.',
          terminal_example: `$ cd mi-proyecto && claude
✓ Sesión iniciada en /Users/dev/mi-proyecto

$ /init
✓ Analizando proyecto...
✓ CLAUDE.md creado con:
  - Stack: Next.js 14 + TypeScript + Prisma + PostgreSQL
  - 12 scripts npm detectados
  - Estructura: /src/app, /src/components, /prisma

$ /doctor
✓ Diagnóstico OK
  - CLAUDE.md presente
  - Node 18.17 installed
  - Variables de entorno: DATABASE_URL ✓ (configurada)`,
        },
        tips: [
          'El CLAUDE.md es tu "system prompt". Actualízalo regularmente.',
          'Cada sesión lo carga automáticamente. Así no tienes que re-explicar contexto.',
          'Menciona archivos con @ruta. Claude los carga en contexto sin ocupar tokens innecesarios.',
          '/doctor es tu amigo. Usa cuando algo se sienta raro.',
        ],
        pitfalls: [
          '❌ No generar CLAUDE.md → cada sesión necesita re-explicación. Tardas 5 min en setup cada vez.',
          '❌ Pegar contenido completo de archivos grandes → desperdicia tokens. Usa @ en su lugar.',
          '❌ No actualizar CLAUDE.md → información se queda desactualizada. Resérvalo 5 min cada semana.',
          '❌ Usar Haiku para /init → usa Sonnet o superior para análisis profundo. /model claude-sonnet-4-6',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Análisis inicial, entender stack desconocida, generar CLAUDE.md, preguntas sobre arquitectura',
          manual: 'Editar CLAUDE.md (aunque Claude puede ayudarte), configurar variables de entorno, instalar dependencias faltantes',
        },
      },

      {
        id: 'level1-code-review',
        title: 'Caso 2: First Solo Code Review con Claude',
        description: 'Te piden que revises un PR antes de mergear. El autor espera feedback constructivo. Quieres ser exhaustivo pero rápido.',
        learning_level: 1,
        scenario: {
          context: 'PR de un compañero: 200 líneas de código nuevo en auth/login.ts. Tests añadidos. Descripción clara en el PR.',
          time_estimate: '10-15 minutos',
          prior_knowledge: 'Leer código, testing básico, seguridad web (OWASP top 10)',
        },
        steps: [
          {
            step: 1,
            action: 'Obtener el diff del PR',
            command: 'git log --oneline | head -5\n# Copia el hash del último commit\ngit show <hash> > /tmp/pr-diff.txt',
            expectedResult: 'Archivo /tmp/pr-diff.txt con el cambio completo.',
            tip: 'Si el PR está en GitHub, también puedes descargar el .patch directo.',
          },
          {
            step: 2,
            action: 'Iniciar sesión de code review',
            command: 'claude',
            expectedResult: 'Sesión abierta.',
            tip: 'Opcional: usa /rename "PR-review-auth" para poder volver a esta sesión después.',
          },
          {
            step: 3,
            action: 'Cargar el diff y pedir análisis',
            command: '@auth/login.ts @tests/auth.spec.ts — Acabo de hacer un PR con cambios en auth. Dame un code review profesional:\n1. ¿Hay bugs o vulnerabilidades de seguridad?\n2. ¿El código sigue las convenciones del proyecto? (Usa @CLAUDE.md)\n3. ¿Los tests cubren los casos edge?\n4. ¿Puedo simplificar o mejorar algo?\n\nFormato: feedback por sección + score overall (1-10).',
            expectedResult: 'Claude revisa:\n- Cada sección del código\n- Comparación vs CLAUDE.md\n- Tests y cobertura\n- Seguridad (OWASP, input validation, etc.)\n- Propone cambios específicos con ejemplos',
            tip: 'Claude puede ser muy detallista. Pídele "un review enfocado en seguridad e integración" si quieres algo más corto.',
          },
          {
            step: 4,
            action: 'Documentar feedback en el PR',
            command: 'Copia los puntos principales del review de Claude como comentarios en el PR de GitHub (o Bitbucket, etc).',
            expectedResult: 'Comentarios profesionales en el PR. El autor sabe exactamente qué mejorar.',
            tip: 'Si el feedback es muy largo, agrupa por categoría: "Security", "Code Style", "Tests", "Optional Improvements".',
          },
          {
            step: 5,
            action: 'Hacer follow-up si hay cambios',
            command: 'Una vez el autor pushea cambios:\n\n/rename "PR-review-auth-UPDATED" para cambiar el nombre de sesión\nMenciona el nuevo commit:\n\n@auth/login.ts — El autor hizo cambios. ¿Se resolvieron tus comentarios originales?',
            expectedResult: 'Confirmación de que los fixes se aplicaron correctamente.',
            tip: 'Si usaste /rename, puedes volver a esta sesión con /resume para context histórico.',
          },
        ],
        expected_output: {
          pr_comments: [
            '✓ Security concern: validateInput() no valida espacios en blanco. Riesgo de bypass.',
            '✓ Code style: inconsistency en error handling. A veces .catch(), a veces try-catch.',
            '✓ Test coverage: falta test para caso "empty password"',
            '✓ Minor: renombra "usr" a "user" para claridad',
          ],
          review_score: '7/10 — Sólido, con fixes menores recomendados',
          time_saved: '5 min vs 30 min manual review',
        },
        tips: [
          'Menciona @CLAUDE.md para que Claude conozca las convenciones del equipo.',
          'Pide un "score overall" — es útil para el autor saber si es bloqueante o minor.',
          'Si el PR es muy grande (>500 líneas), pide review por secciones: "Primero reviewer la capa de auth, luego tests"',
          'Guarda la sesión con /rename. Puedes volver si el autor pregunta dudas después.',
        ],
        pitfalls: [
          '❌ No cargar CLAUDE.md → feedback genérico que no respeta el style del proyecto.',
          '❌ Pedir review de un PR gigante sin contexto → Claude se pierde. Divide en partes.',
          '❌ Copiar feedback de Claude directamente al PR sin editar → suena como IA. Parafrasea.',
          '❌ No hacer follow-up en cambios → el autor mejora pero no tienes forma de verificar.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Análisis de seguridad, detectar patterns ineficientes, generar test cases, comparar vs convenciones',
          manual: 'Decisiones arquitectónicas, trade-offs de negocio, comunicación emocional ("buen trabajo!"), merge final',
        },
      },

      {
        id: 'level1-debug-production',
        title: 'Caso 3: Debugging Rápido de Prod (Error Fatal)',
        description: 'Hay un error en producción. Log dice "TypeError: undefined is not a function". Necesitas arreglarlo en 10 minutos.',
        learning_level: 1,
        scenario: {
          context: 'API endpoint /api/users/:id devuelve 500. Logs muestran error en línea 42 de userService.ts. Ya está en prod, clientes afectados.',
          time_estimate: '5-10 minutos',
          prior_knowledge: 'Leer stack traces, debugging básico, git diff',
        },
        steps: [
          {
            step: 1,
            action: 'Obtener el error y contexto',
            command: 'tail -100 /var/log/app.log | grep -A 5 "TypeError"\n# Copiar el stack trace completo',
            expectedResult: 'Stack trace con línea, función, y contexto.',
            tip: 'Si usas Vercel/Railway/Render, descarga los logs desde el dashboard.',
          },
          {
            step: 2,
            action: 'Iniciar sesión y cargar archivos relevantes',
            command: 'claude',
            expectedResult: 'Sesión abierta.',
            tip: 'Considera /rename "PROD-BUG-FIX-userService"',
          },
          {
            step: 3,
            action: 'Pedir diagnóstico rápido',
            command: '@src/services/userService.ts @src/api/users.ts — Stack trace:\n\nTypeError: undefined is not a function\n  at userService.ts:42\n  at /api/users/:id GET\n\n¿Qué está roto? Propón el fix mínimo.',
            expectedResult: 'Claude identifica:\n- La función undefined (probablemente missing import o refactor incomplete)\n- Línea exacta del problema\n- Fix sugerido (1-5 líneas)',
            tip: 'Claude entiende stack traces bien. Sé específico con línea de error.',
          },
          {
            step: 4,
            action: 'Aplicar el fix',
            command: 'Edita el archivo según sugerencia de Claude.',
            expectedResult: 'El archivo está arreglado.',
            tip: 'Verifica que hayas importado lo necesario.',
          },
          {
            step: 5,
            action: 'Testear localmente',
            command: 'npm run dev\n# Abre http://localhost:3000/api/users/123\n# Verifica que devuelve 200, no 500',
            expectedResult: '✓ Endpoint responde correctamente.',
            tip: 'Si sigue fallando, vuelve a Claude: "aún falla. Evo el nuevo error:"',
          },
          {
            step: 6,
            action: 'Commit y deploy',
            command: 'git add -A && git commit -m "fix: undefined function in userService line 42"\ngit push\n# Deploy se dispara automáticamente (si tienes CI/CD)',
            expectedResult: 'Fix en prod en <2 minutos.',
            tip: 'Si tienes permisos, usa `claude commit` para que Claude genere el mensaje automáticamente.',
          },
        ],
        expected_output: {
          before: 'API returns 500. Clients get blank page.',
          after: 'API returns 200 with user data.',
          time: '~10 min from error to prod fix',
          example_fix: `// BEFORE (línea 42)
const userData = userHelper.fetch(userId);  // helper undefined

// AFTER
const { fetch: fetchUser } = require('../helpers/userHelper');
const userData = await fetchUser(userId);`,
        },
        tips: [
          'Para prod bugs, sé lo más específico posible. Stack trace + archivo afectado = diagnóstico rápido.',
          'Si el fix es "obvious" (typo, missing import), dale la solución directa a Claude y aplícala.',
          'Si necesitas revert rápido: git revert <hash>. Claude te ayuda a escribir el commit message.',
          'Siempre testea localmente antes de mergear, incluso en bugs críticos.',
        ],
        pitfalls: [
          '❌ Adivinar qué está roto sin revisar el error → pierdes 5 min. Copia el stack trace exacto.',
          '❌ Aplicar fix sin entender la causa raíz → lo arreglas hoy, falla mañana. Pregunta "¿por qué pasó?"',
          '❌ No testear después del fix → deploys a ciegas. Siempre `npm run dev` local.',
          '❌ Commit sin mensaje claro → a las 3am nadie sabe qué fue "fix bug lol". Usa `feat:`, `fix:`, `docs:`',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Interpretar stack traces, proponer fixes, explicar por qué pasó',
          manual: 'Aplicar fix al editor, testear, mergear, deploy (habitual en tu flujo)',
        },
      },
    ],
  },

  // ================================================================
  // NIVEL 2: INTERMEDIO — Team Workflows & MCP Integration
  // ================================================================
  nivel2: {
    title: 'Nivel 2: Intermedio — Flujos de Equipo e Integración MCP',
    intro: 'Escalas más allá de proyectos individuales. Integras Claude Code en CI/CD, usas MCPs para GitHub/Slack/DB, coordinas con tu equipo.',
    cases: [
      {
        id: 'level2-github-mcp',
        title: 'Caso 1: Code Review Automático vía GitHub MCP',
        description: 'Cada PR abierto en el repo se revisa automáticamente con Claude. Comentarios postean directamente en GitHub. Sin tocar el CLI.',
        learning_level: 2,
        scenario: {
          context: 'Equipo de 4 developers. 15 PRs/semana. Los reviews manuales se demoran 1-2 días. Quieres acelerar sin perder calidad.',
          time_estimate: '30 minutos setup + 2 min por PR (automático después)',
          prior_knowledge: 'GitHub, personal access tokens, Claude Code nivel 1',
        },
        steps: [
          {
            step: 1,
            action: 'Crear GitHub Personal Access Token',
            command: 'GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)\nNuevo token con scopes:\n- repo (full control)\n- workflow\nCopia el token',
            expectedResult: 'Token como ghp_xxxxxxxxxxxxx',
            tip: 'Guarda en ~/.env o integra con tu .bashrc/.zshrc',
          },
          {
            step: 2,
            action: 'Agregar MCP de GitHub',
            command: 'claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx -- npx -y @modelcontextprotocol/server-github',
            expectedResult: '✓ GitHub MCP registrado. Comando `claude mcp list` muestra github con estado "connected".',
            tip: 'Usa --scope user para que esté disponible en todos tus proyectos.',
          },
          {
            step: 3,
            action: 'Verificar herramientas disponibles',
            command: 'claude\n/mcp\n# Busca "github" — debería listar: get_pr, list_prs, create_pr_comment, get_issue, etc',
            expectedResult: 'Lista de herramientas GitHub disponibles.',
            tip: 'Estas son las acciones que Claude puede hacer automáticamente.',
          },
          {
            step: 4,
            action: 'Crear Skill para code review automático',
            command: 'mkdir -p ~/.claude/skills/github-pr-review\ncat > ~/.claude/skills/github-pr-review/SKILL.md << \'EOF\'\n# GitHub PR Auto-Review\n\nRevisa un PR de GitHub automáticamente y postea comentarios.\n\n## Parameters\n- $1: owner/repo (ej: myteam/backend)\n- $2: PR number\n\n## Execution\n```bash\n# Obtén el diff\n!`gh pr view $2 --repo $1 --json body,files --jq \'.files[] | .path\' > /tmp/pr-files.txt`\n\n# Lee cada archivo\n!`for f in $(cat /tmp/pr-files.txt); do gh pr view $2 --repo $1 --json body; done`\n```\n\nLuego, analiza y postea:\n\"@github_user — He revisado tu PR. Feedbacks:\n\n1. **Security**: ...\n2. **Code quality**: ...\n3. **Tests**: ...\n\nOverall: 8/10. Listo para merge después de arreglar [X, Y].\"\nEOF',
            expectedResult: 'Skill registrada en ~/.claude/skills/github-pr-review/',
            tip: 'Esto es un ejemplo básico. Expande según necesidades.',
          },
          {
            step: 5,
            action: 'Testear el Skill',
            command: 'cd tu-repo && claude\n\n/github-pr-review myteam/backend 247',
            expectedResult: 'Claude ejecuta:\n1. Obtiene diff del PR #247\n2. Analiza código\n3. Postea comentarios automáticamente en GitHub',
            tip: 'Si falla, revisa con /mcp que GitHub esté conectado y el token tenga permisos.',
          },
          {
            step: 6,
            action: 'Integrar en CI/CD (opcional pero poderoso)',
            command: 'En tu GitHub Actions workflow (.github/workflows/auto-review.yml):\n\nname: Auto Review\non:\n  pull_request:\n    types: [opened, synchronize]\njobs:\n  review:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: |\n          npm install -g @anthropic-ai/claude-code\n          claude mcp add github -e GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }} ...\n          claude -p "/github-pr-review ${{ github.repository }} ${{ github.event.pull_request.number }}"',
            expectedResult: 'Cada PR abierto → GitHub Actions dispara → Claude revisa y comenta automáticamente.',
            tip: 'Usa secrets.GITHUB_TOKEN que GitHub proporciona. No necesitas token manual en CI.',
          },
        ],
        expected_output: {
          github_comment: `### Claude Code Review 🤖

**Security**: ✓ Validación de input sólida

**Code Quality**:
- Línea 45: Variable \`temp\` nunca se usa. Elimina.
- Línea 89: Considera extract a función separada para mejor testabilidad.

**Tests**: ✓ Cobertura ~85%. Considera test para edge case vacío.

**Overall**: 8/10 → Listo para merge 🟢`,
          time_saved: '~20 min/PR x 15 PRs/week = 5 horas/week',
          automation: 'Post-merge es automático. Tu equipo recibe feedback instant.',
        },
        tips: [
          'Configura Skill en tu .claude/skills/ para reutilizar. Toda el equipo puede usarla.',
          'Usa /mcp para verificar conexión a GitHub. Si no funciona, es problema de token/permisos.',
          'GitHub MCP también puede crear issues, etiquetar PRs, cerrar automáticamente. Expande según necesidades.',
          'Si combinas con /compact, conserva memoria de reviews previos para consistencia.',
        ],
        pitfalls: [
          '❌ Token con permisos limitados → MCP falla silenciosamente. Verifica scope del token.',
          '❌ Skill que postea sin análisis profundo → comentarios genéricos/útiles. Refuerza prompt.',
          '❌ Ejecutar en CI sin cache compartida → cada run cuesta tokens nuevos. Usa /fork para reutilizar contexto.',
          '❌ No configurar rate limits → spammear a GitHub. Limita a 1 review/PR, no múltiples.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Primera pasada de review (seguridad, convenciones, tests), comentarios iniciales, análisis automático',
          manual: 'Decisiones arquitectónicas, aprobación final humana, feedback emocional ("buen trabajo!")',
        },
      },

      {
        id: 'level2-ci-cd-integration',
        title: 'Caso 2: Integración en CI/CD — Tests Inteligentes Post-Merge',
        description: 'Cada commit mergeado a main ejecuta análisis profundo de regresión. Claude detecta cambios riesgosos y alerta al equipo via Slack.',
        learning_level: 2,
        scenario: {
          context: 'Aplicación backend crítica. Cambios en auth/database pueden romper silenciosamente (tests pasan, usuarios fallan). Quieres "safety net" automático.',
          time_estimate: '45 minutos setup + 3 min por commit (automático)',
          prior_knowledge: 'GitHub Actions, Slack webhooks, MCP nivel 1',
        },
        steps: [
          {
            step: 1,
            action: 'Crear Slack Bot Token',
            command: '1. Ir a https://api.slack.com/apps\n2. Create New App → From scratch\n3. Name: "Claude Code Guardian"\n4. OAuth & Permissions → Scopes: chat:write, files:write\n5. Copy Bot User OAuth Token: xoxb-xxxxx',
            expectedResult: 'Token Slack como xoxb_xxx',
            tip: 'Guarda en GitHub Secrets como SLACK_BOT_TOKEN',
          },
          {
            step: 2,
            action: 'Agregar MCP Slack',
            command: 'claude mcp add slack -e SLACK_BOT_TOKEN=xoxb_xxxxx -- npx -y @modelcontextprotocol/server-slack',
            expectedResult: '✓ Slack MCP conectado.',
            tip: 'Verifica con /mcp que esté "connected"',
          },
          {
            step: 3,
            action: 'Crear Skill "Risk Analysis"',
            command: 'mkdir -p ~/.claude/skills/risk-analysis\ncat > ~/.claude/skills/risk-analysis/SKILL.md << \'EOF\'\n# Risk Analysis After Merge\n\nAnaliza cambios en un commit y alerta si hay riesgos.\n\n## Parameters\n- $1: Commit hash\n\n## Execution\nObtén el diff:\n!`git show $1 --stat`\n\nAnaliza cambios en archivos sensibles:\n- ¿Cambios en auth/*? Risk alto.\n- ¿Cambios en database migrations? Risk alto.\n- ¿Cambios sin tests nuevos? Warning.\n\nPostea en Slack si hay riesgos:\n\"⚠️ Merge riesgoso detectado: $1\nCambios en [auth, database]. Review recomendada.\"\nEOF',
            expectedResult: 'Skill creada.',
            tip: 'Personaliza "archivos sensibles" según tu stack.',
          },
          {
            step: 4,
            action: 'GitHub Actions Workflow',
            command: 'cat > .github/workflows/claude-risk-check.yml << \'EOF\'\nname: Claude Risk Analysis\non:\n  push:\n    branches: [main]\njobs:\n  risk-check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n        with:\n          fetch-depth: 0  # Full history\n      - run: |\n          npm install -g @anthropic-ai/claude-code\n          claude mcp add slack -e SLACK_BOT_TOKEN=${{ secrets.SLACK_BOT_TOKEN }} ...\n          claude -p "/risk-analysis ${{ github.event.head_commit.id }}"\nEOF',
            expectedResult: 'Workflow configurado.',
            tip: 'Se ejecuta cada vez que pusheas a main (post-merge).',
          },
          {
            step: 5,
            action: 'Testear manualmente',
            command: 'cd tu-repo && claude\n\n# Simula un merge ficticio\n/risk-analysis 1a2b3c4d\n\n# Debería postear en Slack si hay riesgos',
            expectedResult: 'Mensaje en canal Slack #deployments indicando riesgo (si aplica).',
            tip: 'Si no funciona, verifica SLACK_BOT_TOKEN y que el bot esté en el canal.',
          },
          {
            step: 6,
            action: 'Escalar a análisis profundo (opcional)',
            command: 'Modifica el Skill para:\n- Comparar cambios vs baseline histórico\n- Ejecutar tests específicos (security, regression)\n- Generar resumen ejecutivo para el equipo\n- Bloquear deploy si risk es crítico',
            expectedResult: 'Análisis automático exhaustivo. Equipo tiene visibility de cada merge.',
            tip: 'Esto requiere /compact si el historial es muy largo. Guarda baseline en memory.',
          },
        ],
        expected_output: {
          slack_alert: `⚠️ **Claude Risk Alert** — Commit abc123 (2024-05-16)

**Risk Level**: 🔴 HIGH

**Changes Detected**:
- auth/login.ts: 45 líneas modificadas (auth = riesgo alto)
- services/userService.ts: 30 líneas (depende de auth)

**Concerns**:
- No hay tests nuevos añadidos
- Cambios en middleware de autenticación
- Afecta endpoint crítico /api/auth/login

**Recommendation**: Considera rollback o hotfix inmediato.
Review: https://github.com/..../commit/abc123`,
          metrics: 'Detecta ~80% de bugs potenciales antes de que clientes los vean',
        },
        tips: [
          'Configura "sensible files" que tu equipo considera críticas. Actualiza cada trimestre.',
          'Combina con /memory para guardar "deployment history" — Claude aprende patrones de tus bugs.',
          'Usa Slack para alertas, pero repo Issues para tracking formal. Ambos complementan.',
          'Si el risk es muy alto, considera workflow que bloquea el deploy (no automático; requiere approval manual).',
        ],
        pitfalls: [
          '❌ Alertas falsas positivas → el equipo ignora después. Refina criterios de riesgo.',
          '❌ No mencionar en Slack cómo remediar → solo alerta sin acción. Añade "Next steps".',
          '❌ Análisis demasiado lento → CI/CD se embotella. Usa timeout en Claude o /compact para reducir contexto.',
          '❌ Olvidar que Slack Token en GitHub Secrets = acceso público. Rota tokens cada 90 días.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Análisis automático, detección de riesgos, alertas, comparación vs histórico',
          manual: 'Aprobación de deployment, decisiones de rollback, post-mortem de incidentes',
        },
      },

      {
        id: 'level2-team-context-sharing',
        title: 'Caso 3: Compartir Contexto en el Equipo vía Memory',
        description: 'Tu equipo usa Claude Code. Necesitas que todos tengan acceso a decisiones arquitectónicas, bugs conocidos, y patrones del proyecto sin re-explicar cada vez.',
        learning_level: 2,
        scenario: {
          context: 'Equipo de 5 desarrolladores. Nuevo miembro se une. Tarda 2 semanas en entender la arquitectura, bugs "históricos", por qué algunas decisiones se tomaron.',
          time_estimate: '30 minutos setup + 5 min por sesión (automático después)',
          prior_knowledge: 'Git, CLAUDE.md básico, /memory comando',
        },
        steps: [
          {
            step: 1,
            action: 'Centralizar conocimiento en CLAUDE.md compartido',
            command: 'Abre tu CLAUDE.md (o crea uno en .claude/CLAUDE.md)\n\nAñade secciones:\n\n## Arquitectura\n[Overview del stack]\n\n## Bugs Históricos\n- ✅ [2024-03]: Refactor auth causó race condition. Solución: agregar mutex en userCache\n- ✅ [2024-02]: Postgres query N+1 en list_users. Optimizado con aggregation.\n\n## Decisiones de Diseño\n- ¿Por qué Postgres en lugar de MongoDB? [Respuesta]\n- ¿Por qué Next.js app router en lugar de pages router? [Respuesta]\n\n## Patrones de Código\n- Error handling: siempre try-catch con typed errors\n- Tests: 80%+ coverage mínimo\n- PRs: requieren aprobación de 2 seniors',
            expectedResult: 'CLAUDE.md actualizado con "institutional knowledge".',
            tip: 'Este archivo es tu "onboarding en 5 minutos" para nuevos devs.',
          },
          {
            step: 2,
            action: 'Usar /memory para guardar contexto persistente por sesión',
            command: 'claude\n\n/memory add "Equipo: Juan (backend), María (frontend), Carlos (DevOps)"\n/memory add "Estado actual: refactorizando auth, esperando PR #247"\n/memory add "Deadline: release 2.5.0 el 2024-06-15"',
            expectedResult: 'Contexto guardado. Próxima sesión lo carga automáticamente.',
            tip: '/memory es local a tu usuario. Si quieres equipo-wide, usa repo Issues o Wiki.',
          },
          {
            step: 3,
            action: 'Crear "Team Onboarding" document automático',
            command: 'claude\n\n/team-onboarding\n\n# Genera automáticamente un documento con:\n# - Stack detectado\n# - Bugs históricos más importantes\n# - Comandos útiles\n# - Primeros pasos para nuevo dev',
            expectedResult: 'Archivo TEAM_ONBOARDING.md con guía completa.',
            tip: 'Edítalo manualmente después. Claude da un buen starting point.',
          },
          {
            step: 4,
            action: 'Compartir con equipo via git',
            command: 'git add CLAUDE.md TEAM_ONBOARDING.md\ngit commit -m "docs: centralizar knowledge para equipo"\ngit push',
            expectedResult: 'Archivo en el repo. Todos los devs lo ven al clonar.',
            tip: 'Considerar en .gitignore partes privadas (.env, tokens). Pero CLAUDE.md debe estar versionado.',
          },
          {
            step: 5,
            action: 'Nuevo miembro: onboarding rápido',
            command: '# Nuevo dev clona repo y hace:\ncd mi-repo && claude\n\n# Lee el documento:\n@CLAUDE.md @TEAM_ONBOARDING.md\n\n# Pregunta:\nVoy a empezar en el proyecto. ¿Cuáles son los primeros pasos? ¿Qué debo saber de la arquitectura?',
            expectedResult: 'Claude explica arquitectura, bugs conocidos, próximos pasos, based en tu CLAUDE.md.\nNuevo dev entiende el proyecto en 15 minutos.',
            tip: 'El archivo cargado automáticamente ahorra toneladas de onboarding manual.',
          },
          {
            step: 6,
            action: 'Actualizar CLAUDE.md regularmente',
            command: 'Cada sprint, dedica 10 min a actualizar:\n- Bugs nuevos resueltos\n- Decisiones arquitectónicas nuevas\n- Cambios en stack o dependencias\n\ngit commit -m "docs: actualizar CLAUDE.md con learnings del sprint X"',
            expectedResult: 'CLAUDE.md siempre fresco. Equipo tiene fuente única de verdad.',
            tip: 'Si no actualizas, la info se vuelve obsoleta en 3 meses. Hazlo un ritual.',
          },
        ],
        expected_output: {
          team_onboarding: `# Team Onboarding Guide

## Stack
- Backend: Node.js 18 + Express
- Database: PostgreSQL 14
- Frontend: React 18 + TailwindCSS
- Deployment: Vercel (frontend), Railway (backend)

## Bugs Históricos
1. Auth race condition (2024-03) → Solucionado con mutex
2. Postgres N+1 query (2024-02) → Optimizado con aggregation
3. Memory leak en WebSocket (2024-01) → Añadido cleanup en disconnect

## First Steps for New Dev
1. Clone repo + \`npm install\`
2. Copy .env.example → .env.local
3. Run \`npm run dev\` (debe iniciar sin errores)
4. Read CLAUDE.md sections: Architecture, Design Decisions
5. Review 2-3 PRs recientes para ver patrones de código`,
          savings: 'Nuevo dev productivo en 1 día en lugar de 2 semanas',
        },
        tips: [
          'CLAUDE.md es tu "sistema nervioso" del proyecto. Mantenerlo actualizado es inversión a largo plazo.',
          '/memory es personal (local a tu sesión). Para compartir equipo-wide, usa repo files.',
          'Combina CLAUDE.md + /team-onboarding + /memory para máximo knowledge transfer.',
          'Cada trimestre, "audit" el CLAUDE.md. ¿Sigue siendo verdad? Actualiza.',
        ],
        pitfalls: [
          '❌ CLAUDE.md obsoleto → nuevo dev se confunde. Actualiza cada 2 semanas mínimo.',
          '❌ Información sensible en repo (API keys) → seguridad. Usa .env + .gitignore.',
          '❌ Demasiado detalle en CLAUDE.md → nadie lo lee. Mantén conciso (max 500 líneas).',
          '❌ /team-onboarding automático sin revisión → contiene inconsistencias. Siempre edita después.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Generar draft de TEAM_ONBOARDING, analizar CLAUDE.md, responder preguntas de nuevo dev',
          manual: 'Escribir CLAUDE.md inicial, decisiones arquitectónicas, aprobar cambios a memoria compartida',
        },
      },
    ],
  },

  // ================================================================
  // NIVEL 3: AVANZADO — Custom Skills & Multi-Agent Orchestration
  // ================================================================
  nivel3: {
    title: 'Nivel 3: Avanzado — Skills Personalizadas & Orquestación Multi-Agent',
    intro: 'Construyes automatización a medida. Skills reutilizables. Múltiples agentes trabajando en paralelo. Optimización de costos.',
    cases: [
      {
        id: 'level3-custom-skill-refactor',
        title: 'Caso 1: Skill Personalizada para Refactor Automático de Código Legacy',
        description: 'Tu equipo usa un Skill que transforma código viejo (CommonJS, callbacks) a moderno (ES modules, async-await). Reutilizable, documentado, shareable.',
        learning_level: 3,
        scenario: {
          context: 'Codebase antiguo con 500+ archivos CommonJS. Quieres migrar a ES modules sin hacer todo manualmente. Necesitas Skill que otros devs puedan ejecutar.',
          time_estimate: '60 minutos crear Skill + 5 min per file (automático)',
          prior_knowledge: 'Nivel 2 completo, Bash, understanding de MCP',
        },
        steps: [
          {
            step: 1,
            action: 'Planificar el Skill',
            command: 'Define qué hará:\n1. Detectar archivos CommonJS (require, module.exports)\n2. Analizar dependencias\n3. Reescribir con ES modules (import, export)\n4. Actualizar tests\n5. Verificar que no rompe nada',
            expectedResult: 'Plan claro.',
            tip: 'Divide en pasos pequeños. Un Skill grande = difícil de debuggear.',
          },
          {
            step: 2,
            action: 'Crear estructura del Skill',
            command: 'mkdir -p ~/.claude/skills/refactor-to-esm\ncat > ~/.claude/skills/refactor-to-esm/SKILL.md << \'EOF\'\n# Refactor to ES Modules\n\nTransforma código CommonJS a ES modules automáticamente.\n\n## Usage\n```\n/refactor-to-esm src/services/auth.js\n/refactor-to-esm src/**/*.js  # Batch\n```\n\n## Parameters\n- $1: File path o glob (ej: src/services/auth.js o src/**/*.js)\n\n## What It Does\n1. Analiza archivo CommonJS\n2. Reescribe con ES modules\n3. Actualiza tests si existen\n4. Verifica que compila\n5. Genera PR automático\nEOF',
            expectedResult: 'Estructura básica.',
            tip: 'El SKILL.md es tu documentación pública.',
          },
          {
            step: 3,
            action: 'Implementar lógica del Skill',
            command: 'cat > ~/.claude/skills/refactor-to-esm/refactor.sh << \'EOF\'\n#!/bin/bash\nFILE=$1\n\necho "Refactoring $FILE to ES modules..."\n\n# Detecta si es CommonJS\nif ! grep -q "require\\|module.exports" "$FILE"; then\n  echo "✓ Ya es ES module. Saltando."\n  exit 0\nfi\n\n# Copia backup\ncp "$FILE" "$FILE.bak"\n\necho "✓ Archivo analizado. Listo para Claude."\nEOF\nchmod +x ~/.claude/skills/refactor-to-esm/refactor.sh',
            expectedResult: 'Script bash helper.',
            tip: 'Los Scripts pueden ejecutarse vía !`comando` dentro del SKILL.md',
          },
          {
            step: 4,
            action: 'Crear lógica principal en SKILL.md',
            command: 'cat > ~/.claude/skills/refactor-to-esm/SKILL.md << \'EOF\'\n# Refactor to ES Modules\n\n## Execution\n\n### 1. Analizar\n!`grep -n "require\\|module.exports" $1 | head -20`\n\n### 2. Generar refactor\nDado el archivo $1, reescribe:\n- Todo `require()` → `import`\n- Todo `module.exports` → `export`\n- Callbacks → async-await donde aplique\n- Preserve tipos (TypeScript, si aplica)\n\n### 3. Validar\n!`npm run build && npm test`\n\n### 4. Output\nMostrar diff:\n!`diff -u $1.bak $1`\n\n### 5. Commit automático\n!`git add $1 && git commit -m "refactor: transform $1 to ES modules"`\n\nEOF',
            expectedResult: 'Skill funcional.',
            tip: 'El !`...` ejecuta bash. Muy poderoso para automatización.',
          },
          {
            step: 5,
            action: 'Testear el Skill',
            command: 'cd tu-repo && claude\n\n/refactor-to-esm src/services/auth.js\n\n# Verifica:\n# 1. ¿Se convierte correctamente?\n# 2. ¿Tests pasan?\n# 3. ¿El diff tiene sentido?',
            expectedResult: 'Archivo refactorizado. Commit automático.',
            tip: 'Si falla, edita SKILL.md y reintentas. Claude re-ejecuta con cambios.',
          },
          {
            step: 6,
            action: 'Ejecutar batch automático',
            command: 'claude\n\n/refactor-to-esm src/**/*.js\n\n# O combina con /fork para paralelizar:\n/fork "Refactor services layer"  # Branch 1\n/fork "Refactor utils layer"     # Branch 2\n\n# Ejecuta /refactor-to-esm en cada fork en paralelo',
            expectedResult: 'Múltiples archivos refactorizados en paralelo. Ahorra 10× tiempo vs manual.',
            tip: '/fork hereda contexto pero es sesión separada. Ideal para paralelizar.',
          },
          {
            step: 7,
            action: 'Documentar y compartir con equipo',
            command: 'git add ~/.claude/skills/refactor-to-esm/\ngit commit -m "skill: add refactor-to-esm for team"\ngit push',
            expectedResult: 'Skill disponible para todo el equipo.',
            tip: 'Considera crear un SKILLS.md de documentación centralizada.',
          },
        ],
        expected_output: {
          before_after: `// BEFORE (CommonJS)
const auth = require('./auth');
const db = require('./db');

function loginUser(username, password, callback) {
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return callback(err);
    auth.verifyPassword(password, user.hash, callback);
  });
}

module.exports = { loginUser };

// AFTER (ES modules + async)
import * as auth from './auth.js';
import * as db from './db.js';

export async function loginUser(username, password) {
  const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return auth.verifyPassword(password, user.hash);
}`,
          metrics: 'Refactor 500 files en ~2 horas (manual: 1 semana)',
        },
        tips: [
          'Skill reutilizable = invertir 1h ahora para ahorrar 8h después. Vale la pena.',
          'Usa /fork para paralelizar. Múltiples conversiones simultáneamente.',
          'Siempre valida el resultado con tests. No asumes que el refactor está "correcto".',
          'Documenta bien el SKILL.md. El equipo necesita saber cuándo/cómo usarlo.',
        ],
        pitfalls: [
          '❌ Skill demasiado genérico → no funciona bien en ningún caso. Sé específico (refactor CommonJS, no "todo")',
          '❌ No validar output → quebrantas el código. Siempre corre tests después.',
          '❌ Skill sin documentación → nadie sabe cómo usarla. Escribe SKILL.md como si fuera para principiante.',
          '❌ Ignorar edge cases → funciona en 90% de archivos, falla en 10%. Refina basado en feedback.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Análisis de refactor, generación de código, validación',
          manual: 'Decisiones arquitectónicas, cambios que requieren lógica biz, merge de cambios complejos',
        },
      },

      {
        id: 'level3-multi-agent-orchestration',
        title: 'Caso 2: Orquestación Multi-Agent — Diseño de API con múltiples perspectivas',
        description: 'Diseñas una API compleja. En lugar de una sesión, lanzas 3 "agentes especializados" (backend, frontend, security) en paralelo. Cada uno da feedback. Integras.',
        learning_level: 3,
        scenario: {
          context: 'Necesitas diseñar una API de pago que integre Stripe. Quieres validación simultánea:\n1. Backend: ¿es realizable con nuestra stack?\n2. Frontend: ¿es ergonómica para el cliente web?\n3. Security: ¿hay vulnerabilidades?',
          time_estimate: '40 minutos paralelizado (vs 2h secuencial)',
          prior_knowledge: 'Nivel 2, /fork command, context sharing',
        },
        steps: [
          {
            step: 1,
            action: 'Crear spec de API para todos los agentes',
            command: 'cat > api-payment-spec.md << \'EOF\'\n# Payment API Design\n\n## Endpoints\nGET /payments/:id\nPOST /payments\nPATCH /payments/:id/retry\nDELETE /payments/:id/refund\n\n## Request/Response Examples\n[Details...]\nEOF',
            expectedResult: 'Spec compartido.',
            tip: 'Este es el punto de referencia para todos los agentes.',
          },
          {
            step: 2,
            action: 'Iniciar sesión principal y mentorear agentes',
            command: 'claude\n\n# Cargar spec\n@api-payment-spec.md\n\n# Crear 3 forks especializados\n/fork "Backend Validation — ¿es realizable?"\n/fork "Frontend Usability — ¿es ergonómica?"\n/fork "Security Review — ¿hay riesgos?"',
            expectedResult: '3 sesiones paralelas creadas. Cada una hereda contexto + spec.',
            tip: '/fork hereda memoria y contexto cacheado. Costo = 1 prompt principal + 3 análisis especializados.',
          },
          {
            step: 3,
            action: 'Agente Backend: análisis de implementación',
            command: '# En fork 1 (Backend)\n\nComo architect backend, valida:\n1. ¿Cómo se integra Stripe en nuestra stack (Node + Express + Postgres)?\n2. ¿Qué campos guardar en DB? ¿Qué delegar a Stripe?\n3. ¿Manejo de errores y reintentos? ¿Webhooks?\n4. Propón estructura de datos (schema Prisma).',
            expectedResult: 'Análisis Backend con:\n- Schema propuesto\n- Flujo de integración\n- Manejo de edge cases (fallo de Stripe, timeout, etc)',
            tip: 'Backend ve desde perspectiva de implementación. Puede detectar "esto es duro de hacer"',
          },
          {
            step: 4,
            action: 'Agente Frontend: validar usabilidad',
            command: '# En fork 2 (Frontend)\n\nComo developer web, valida:\n1. ¿El request/response es claro y eficiente para SPA?\n2. ¿Manejo de loading states, errors, success states?\n3. ¿Rate limits y timeouts son razonables para UX?\n4. Propón flujo de usuario desde web.',
            expectedResult: 'Feedback Frontend:\n- Mejoras a request/response\n- Sugerencias de UX (polling vs websockets, etc)\n- Endpoint order y agrupación lógica',
            tip: 'Frontend ve desde perspectiva del cliente. Puede detectar "nadie va a hacer clicks así"',
          },
          {
            step: 5,
            action: 'Agente Security: audit',
            command: '# En fork 3 (Security)\n\nComo security engineer, valida:\n1. ¿Hay tokens/keys expuestos en la API?\n2. ¿HTTPS enforcement? ¿Rate limits?\n3. ¿Validación de entrada? ¿SQL injection, XSS??\n4. ¿Compliance (PCI-DSS, GDPR) para datos de pago?\n5. Propón medidas de seguridad.',
            expectedResult: 'Security review con:\n- Vulnerabilidades potenciales\n- Recomendaciones de hardening\n- Checklist de compliance',
            tip: 'Security ve riesgos. Puede bloquear diseño inseguro antes de código.',
          },
          {
            step: 6,
            action: 'Integrar feedback de los 3 agentes',
            command: '# De vuelta en sesión principal\n\n# Recopila feedback de cada fork:\n## Backend Report: [Copy-paste de fork 1]\n## Frontend Report: [Copy-paste de fork 2]\n## Security Report: [Copy-paste de fork 3]\n\n# Pide integración:\n"Dame una API final que:\n1. Sea realizable backend (Fork 1)\n2. Sea usable en frontend (Fork 2)\n3. Sea secure (Fork 3)\n\nPrioritiza: Security > Backend > Frontend"',
            expectedResult: 'API spec final mejorada. Incorpora learnings de 3 perspectivas.',
            tip: 'La integración es donde ocurre la magia. Cada fork vio blind spots del otro.',
          },
          {
            step: 7,
            action: 'Documentar y socializar',
            command: 'git add api-payment-spec-final.md\ngit commit -m "design: payment API — reviewed by backend/frontend/security"\ngit push\n\n# Post en PR o issue para feedback del equipo',
            expectedResult: 'API spec compartida, validada por 3 expertos (virtuales).',
            tip: 'Los agentes nunca se equivocan 100%, pero encuentran problemas que 1 persona pierde.',
          },
        ],
        expected_output: {
          comparison: {
            headers: ['Aspecto', 'Backend Solo', 'Backend + Frontend + Security'],
            rows: [
              ['Tiempo', '2 horas', '40 min (paralelizado)'],
              ['Coverage', 'Técnica, olvida UX', '360°: técnica + UX + seguridad'],
              ['Bugs encontrados', '3-5', '8-12 (sin coincidencias entre expertos)'],
              ['Costo tokens', '1000', '~1500 (pero 10× más valor)'],
            ]
          },
          final_api: `GET /api/v1/payments/:id
POST /api/v1/payments
- Validación de input strict
- Rate limit: 10 req/min por usuario
- HTTPS-only
- Webhook retry logic
- Audit logging para compliance`,
        },
        tips: [
          '/fork es tu multiplicador de expertise. 1 persona con 3 perspectivas > 1 persona solo.',
          'Agentes especializados ven lo que otros extrañan. Combina para encontrar problemas raros.',
          'Documenta feedback claro. "Backend necesita X porque Y" es más útil que "hagamos X".',
          'Usa /memory para guardar "lecciones aprendidas" de orquestación. Reutiliza patrones.',
        ],
        pitfalls: [
          '❌ 3 agentes que no se coordinan → feedback contradictorio. Alguien integra al final.',
          '❌ Agentes con contexto incompleto → miss requirements. Carga spec completo en cada fork.',
          '❌ Ignorar feedback de un agente → olvidas perspectiva importante. Prioritiza pero no ignores.',
          '❌ Demasiadas forks = contexto fragmentado. Máx 5-7 forks para un problema. Más = confusión.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Análisis de perspectiva múltiple, encontrar edge cases, validación cruzada',
          manual: 'Decisiones finales, trade-offs de negocio, comunicación con stakeholders',
        },
      },

      {
        id: 'level3-cost-optimization',
        title: 'Caso 3: Optimización de Costos — /compact, /fork, prompt caching',
        description: 'Tu sesión usa 100k tokens/mes. Optimizas con /compact, /fork cache, y context reuse. Reduces a 30k sin perder funcionalidad.',
        learning_level: 3,
        scenario: {
          context: 'Proyecto grande con CI/CD que ejecuta Claude Code diariamente. 100k tokens/mes = $3-5/mes. Quieres reducir sin calidad.',
          time_estimate: '60 minutos audit + optimizaciones continuas',
          prior_knowledge: 'Nivel 2 completo, /compact, /fork, /usage',
        },
        steps: [
          {
            step: 1,
            action: 'Auditar uso actual de tokens',
            command: 'claude\n\n/usage\n\n# Muestra:\n# - Tokens usados en sesión\n# - Costo estimado\n# - Prompts más costosos',
            expectedResult: 'Desglose de consumo.',
            tip: 'Ejecuta /usage regularmente. Es tu "bill" de Claude.',
          },
          {
            step: 2,
            action: 'Identificar repeticiones',
            command: 'claude -p "Dame un resumen de dónde se gastan más tokens:\n- ¿Mencionas CLAUDE.md constantemente?\n- ¿Repites contexto en múltiples prompts?\n- ¿Hay conversaciones largas que no se usan después?"',
            expectedResult: 'Diagnóstico de dónde "sangra" tokens.',
            tip: 'Usualmente: 30% CLAUDE.md repetido, 30% historial viejo, 30% contexto de archivos, 10% prompts nuevos.',
          },
          {
            step: 3,
            action: 'Implementar /compact',
            command: 'claude\n\n# Después de hacer mucho trabajo:\n/compact mantén arquitectura y decisiones, descarta logs de debug y intentos fallidos',
            expectedResult: 'Historial comprimido sin perder info crítica.',
            tip: 'Compacta cada 500 mensajes o cuando sientas que el historial está "gordo".',
          },
          {
            step: 4,
            action: 'Usar /fork con herencia de cache',
            command: 'claude\n\n# Sesión 1: Setup caro (cargar CLAUDE.md, archivos grandes, etc)\n# ~5000 tokens\n\n/fork "Tarea A"\n# Sesión 2 hereda cache. Solo paga tokens nuevos de Tarea A\n# ~1000 tokens (en lugar de 5000)\n\n/fork "Tarea B"  # Otra fork, otra 1000 tokens\n\n# Total: 5000 + 1000 + 1000 = 7000\n# Sin fork: 5000 + 5000 + 5000 = 15000\n# Ahorro: 53%',
            expectedResult: 'Múltiples forks compartiendo setup caro. Ahorro significativo.',
            tip: '/fork es tu mejor amiga para reducir costos. Úsala agresivamente.',
          },
          {
            step: 5,
            action: 'Optimizar mención de archivos',
            command: '# ANTES (caro):\nMenciono @src/services/auth.ts cada vez. \nArchivo tiene 500 líneas → 1500 tokens c/u\n\n# DESPUÉS (barato):\n1. Primero: /memory add "auth.ts responsable de validación".\n2. Luego: Solo menciono el archivo si necesito detalles nuevos.\n3. O: Crea un resumen "auth-summary.md" de 50 líneas (100 tokens) y menciona eso.\n\n# Ahorro: 90% en archivos repetidos',
            expectedResult: 'Consumo de archivos reducido.',
            tip: 'Crea "summaries" de archivos grandes. Reutiliza.',
          },
          {
            step: 6,
            action: 'Usar /memory agresivamente',
            command: 'claude\n\n/memory add "Arquitectura: Next.js + Prisma. Autenticación con JWT. DB Postgres en Railway."\n/memory add "Convenciones: Error handling con typed errors. Tests con Vitest. PRs requieren 2 reviews."\n/memory add "Bugs históricos: 1) Race condition en auth (2024-03), 2) Slow queries (2024-02)"',
            expectedResult: 'Memory cargada. Próxima sesión no necesita re-explicación.',
            tip: 'Memory = contexto persistente = sin repetición. Máximo ahorro.',
          },
          {
            step: 7,
            action: 'Cambiar modelo según tarea',
            command: 'claude\n\n/model claude-haiku-4-5  # Tareas simples (100 tokens vs 300 Sonnet)\n# Ej: resumen de PR, debugging simple\n\n/model claude-sonnet-4-6  # Tareas medianas (análisis, refactor)\n\n/model claude-opus-4-7  # Tareas complejas (diseño, orquestación)',
            expectedResult: 'Modelo optado por complejidad.',
            tip: '50% de las tareas = Haiku. 40% = Sonnet. 10% = Opus. Ahorro de 30%.',
          },
          {
            step: 8,
            action: 'Auditar y documentar optimizaciones',
            command: 'cat > COST_OPTIMIZATION.md << \'EOF\'\n# Cost Optimization Strategy\n\n## Baseline\n- Uso actual: 100k tokens/mes (~$5)\n- Objetivo: 30k tokens/mes (~$1.50)\n\n## Tactics\n1. /fork para paralelizar (overhead compartido) → -30%\n2. /compact regularmente → -20%\n3. /memory para context reutilizable → -20%\n4. Cambiar modelo por tarea → -15%\n5. Resumir archivos grandes → -10%\n6. Reducir historial verbal → -5%\n\n## Expected Result\n100k → 35k tokens/mes (~65% reduction)\nEOF\n\ngit add COST_OPTIMIZATION.md\ngit commit -m "docs: cost optimization strategy"\ngit push',
            expectedResult: 'Documento que guía optimizaciones continuas.',
            tip: 'Monitoea /usage cada mes. Ajusta si se desvía.',
          },
        ],
        expected_output: {
          before_after: `## Baseline (Sin optimizaciones)
Jan 2024: 100k tokens
Feb 2024: 105k tokens (creep gradual)
Mar 2024: 110k tokens

## After Optimization (Implementadas todas)
Apr 2024: 35k tokens (-65%)
May 2024: 32k tokens
Jun 2024: 30k tokens (estable)

## ROI
Ahorro: $5/mes → $1.50/mes = $3.50/mes = $42/año
Tiempo invertido: 2 horas setup

ROI: Muy alto. Setup de 1 vez, beneficio perpetuo.`,
          metrics: {
            token_reduction: '65% (100k → 35k)',
            cost_reduction: '70% ($5/mes → $1.50/mes)',
            quality_impact: 'Cero. Mismas capacidades, menos desperdicio.',
          },
        },
        tips: [
          '/fork es tu herramienta #1 de reducción de costos. Úsala siempre que repitas setup.',
          '/memory es gratis en tokens. Usa para contexto persistente.',
          'Cambia de modelo según complejidad. Haiku para tareas simples. Opus solo cuando sea necesario.',
          '/usage es tu dashboard. Checkea cada semana.',
          '/compact != perder info. Es "garbage collection" del historial.',
        ],
        pitfalls: [
          '❌ Optimizar sin medir → crees que ahorras pero no. Usa /usage.',
          '❌ /fork sin herencia → sigues pagando setup en cada fork. Usa contexto compartido.',
          '❌ Eliminar CLAUDE.md para "ahorrar" → re-explicar cada sesión cuesta 10× más. Mantén CLAUDE.md.',
          '❌ Cambiar a Haiku siempre para ahorrar → quality sufre. Usa Haiku solo para tareas simples.',
        ],
        when_to_use_claude_vs_manual: {
          use_claude: 'Análisis de costos, sugerencias de optimización, auditoría de consumo',
          manual: 'Cambios arquitectónicos, decisiones de trade-off, implementación de mejoras',
        },
      },
    ],
  },
}

// Export summary structure for easy navigation
export const LEARNING_LEVELS_SUMMARY = {
  1: {
    title: 'Fundamentos',
    focus: 'Tareas diarias individuales',
    cases: 3,
    keywords: ['Setup', 'Code Review', 'Debugging'],
  },
  2: {
    title: 'Intermedio',
    focus: 'Flujos de equipo y MCPs',
    cases: 3,
    keywords: ['GitHub MCP', 'CI/CD', 'Team Sharing'],
  },
  3: {
    title: 'Avanzado',
    focus: 'Custom skills y orquestación',
    cases: 3,
    keywords: ['Skills', 'Multi-agent', 'Cost Optimization'],
  },
}
