#!/usr/bin/env node

/**
 * Script para completar las 18 secciones vacías
 * Secciones: branching, rules, memory, patrones, desafios, skills, ci-cd,
 * intro-acc, casos-rol, glosario, quizzes, progreso, mejores-practicas, terminal, recursos
 * + git-workflows, mcp-use-cases, hooks-production
 */

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

const missingSections = `
            <!-- BRANCHING STRATEGY SECTION -->
            <section class="content-section" data-section="branching" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Arquitectura / Git Branching</span>
                    <h2>🌿 Branching Strategy</h2>
                    <p class="section-lead">Elige tu flujo de trabajo: Trunk-based, Gitflow o Worktrees.</p>
                </div>
                <article class="card">
                    <p>Ver <a href="#git-workflows-detail" data-jump="git-workflows-detail">Git Workflows Detallado</a> para implementación completa.</p>
                </article>
            </section>

            <!-- RULES & CONFIG SECTION -->
            <section class="content-section" data-section="rules" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Arquitectura / Configuración</span>
                    <h2>📋 .rules & Config</h2>
                    <p class="section-lead">Convenciones y reglas del proyecto en CLAUDE.md</p>
                </div>
                <article class="card">
                    <h3>¿Qué son las .rules?</h3>
                    <p>Reglas de código que Claude DEBE y NO DEBE hacer. Se especifican en CLAUDE.md:</p>
                    <pre><code class="language-markdown">## Rules
- ✅ Siempre usar TypeScript (no any)
- ✅ Tests para cada feature
- ❌ No commitear .env
- ❌ No usar eval()
- ❌ No modificar schema sin migration</code></pre>
                </article>
                <article class="card">
                    <h3>/doctor: Verificar Configuración</h3>
                    <pre><code class="language-bash">claude
/doctor
# Verifica:
# - CLAUDE.md presente
# - Variables de entorno OK
# - .git sano
# - Node.js compatible</code></pre>
                </article>
            </section>

            <!-- MEMORY MANAGEMENT SECTION -->
            <section class="content-section" data-section="memory" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Arquitectura / Memory</span>
                    <h2>💾 Memory Management</h2>
                    <p class="section-lead">Gestiona la memoria de contexto eficientemente.</p>
                </div>
                <article class="card">
                    <h3>Comandos de Memory</h3>
                    <pre><code class="language-bash"># Ver uso actual
/context

# Comprimir contexto (mantén lo esencial, descarta logs)
/compact

# Ver tokens y costo estimado
/usage

# Guardar información en memory (persistente)
/memory add "Equipo: Juan, María, Carlos"</code></pre>
                </article>
                <article class="card">
                    <h3>Cuándo Comprimir</h3>
                    <ul>
                        <li>Cuando /context muestra >80% de uso</li>
                        <li>Si tienes logs muy largos que no necesitas</li>
                        <li>Antes de tareas complejas que requieren más contexto</li>
                    </ul>
                </article>
            </section>

            <!-- PATRONES DE COMANDOS SECTION -->
            <section class="content-section" data-section="patrones" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Arquitectura / Patrones</span>
                    <h2>🔄 Patrones de Comandos</h2>
                    <p class="section-lead">Patrones frecuentes de cómo usar Claude Code.</p>
                </div>
                <article class="card">
                    <h3>Patrón 1: Mención de Archivos</h3>
                    <pre><code class="language-bash">@src/auth/login.ts @src/api/users.ts
Revisa estos archivos y propón mejoras de seguridad.</code></pre>
                </article>
                <article class="card">
                    <h3>Patrón 2: Contexto de Proyecto</h3>
                    <pre><code class="language-bash">@CLAUDE.md
Según las convenciones, ¿cómo debería refactorizar este código?</code></pre>
                </article>
                <article class="card">
                    <h3>Patrón 3: Fork para Paralelismo</h3>
                    <pre><code class="language-bash">/fork "Analizar rendimiento en paralelo"
# Abre sesión paralela con contexto compartido</code></pre>
                </article>
            </section>

            <!-- DESAFÍOS SECTION -->
            <section class="content-section" data-section="desafios" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Casos Prácticos / Desafíos</span>
                    <h2>🧠 Desafíos de Aprendizaje</h2>
                    <p class="section-lead">Pruebas tu conocimiento con desafíos prácticos.</p>
                </div>
                <article class="card">
                    <h3>Desafío Nivel 1: Setup Rápido</h3>
                    <p><strong>Objetivo:</strong> Clonar un repo, inicializar con /init y explicar la arquitectura en 10 min.</p>
                    <p><strong>Evaluación:</strong> CLAUDE.md generado + explicación clara</p>
                </article>
                <article class="card">
                    <h3>Desafío Nivel 2: Code Review</h3>
                    <p><strong>Objetivo:</strong> Revisar un PR de 200 líneas y postear feedback en GitHub.</p>
                    <p><strong>Evaluación:</strong> Identificación de 3+ issues reales + seguridad</p>
                </article>
                <article class="card">
                    <h3>Desafío Nivel 3: Automatización</h3>
                    <p><strong>Objetivo:</strong> Crear una Skill que automatice un flujo de tu equipo.</p>
                    <p><strong>Evaluación:</strong> Skill funcional, documentado, reutilizable</p>
                </article>
            </section>

            <!-- SKILLS AVANZADOS SECTION -->
            <section class="content-section" data-section="skills-avanzados" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Profundización / Skills Avanzados</span>
                    <h2>🧩 Skills Avanzados</h2>
                    <p class="section-lead">Crea Skills complejas que orquestas MCPs y automatizan equipos.</p>
                </div>
                <article class="card">
                    <h3>Estructura de una Skill Avanzada</h3>
                    <pre><code class="language-bash">~/.claude/skills/mi-skill/
├── SKILL.md          # Metadata + prompt
├── data.json         # Datos auxiliares
└── handlers.js       # (opcional) lógica custom</code></pre>
                </article>
                <article class="card">
                    <h3>Skill Multi-MCP: Code Review + Slack Alert</h3>
                    <p>Revisar PR en GitHub, analizar con PostgreSQL MCP, alertar en Slack si risky.</p>
                    <pre><code># Pseudocódigo
/fork "GitHub review"
  → GitHub MCP: get PR diff
  → PostgreSQL MCP: affected tables
  → Análisis
  → Slack MCP: post alert si risky</code></pre>
                </article>
            </section>

            <!-- CI/CD & HEADLESS SECTION -->
            <section class="content-section" data-section="ci-cd" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Profundización / CI/CD</span>
                    <h2>🔁 CI/CD & Headless Automation</h2>
                    <p class="section-lead">Claude Code sin GUI: GitHub Actions, cron jobs, headless.</p>
                </div>
                <article class="card">
                    <h3>GitHub Actions + Claude Code</h3>
                    <pre><code class="language-yaml">name: Auto Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          npm install -g @anthropic-ai/claude-code
          claude -p "/code-review-skill"</code></pre>
                </article>
                <article class="card">
                    <h3>Cron Job: Análisis Nightly</h3>
                    <pre><code class="language-bash"># ~/.claude/cron/nightly.md
Cada noche, ejecuta:
- npm test
- npm run lint
- Análisis de deuda técnica
- Alerta si hay breaking changes</code></pre>
                </article>
            </section>

            <!-- INTRO ACCESIBLE SECTION -->
            <section class="content-section" data-section="intro-acc" data-mode="accessible">
                <div class="section-header">
                    <span class="breadcrumb">No-Programadores / Introducción</span>
                    <h2>📘 ¿Qué es Claude Code?</h2>
                    <p class="section-lead">Para personas sin experiencia en programación.</p>
                </div>
                <article class="card">
                    <h3>Claude Code es como un Colega Programador IA</h3>
                    <p>Imagina que tienes un compañero que sabe programar muy bien y está disponible 24/7.</p>
                    <p>Puedes pedirle que:</p>
                    <ul>
                        <li>Revise código (como un jefe de equipo)</li>
                        <li>Refactorice (reescriba mejorando)</li>
                        <li>Explique cómo funciona algo</li>
                        <li>Encuentre bugs</li>
                        <li>Escriba tests</li>
                    </ul>
                </article>
            </section>

            <!-- CASOS POR ROL SECTION -->
            <section class="content-section" data-section="casos-rol" data-mode="accessible">
                <div class="section-header">
                    <span class="breadcrumb">No-Programadores / Roles</span>
                    <h2>👥 Claude Code por Rol</h2>
                    <p class="section-lead">Cómo usar Claude Code según tu rol en el equipo.</p>
                </div>
                <article class="card">
                    <h3>Product Manager</h3>
                    <p>Pide a Claude que explique cambios técnicos en términos de producto.</p>
                </article>
                <article class="card">
                    <h3>QA / Tester</h3>
                    <p>Claude puede escribir tests, generar casos de prueba, validar bugs.</p>
                </article>
                <article class="card">
                    <h3>DevOps</h3>
                    <p>Automatización de CI/CD, deploymets, monitoreo.</p>
                </article>
            </section>

            <!-- GLOSARIO SECTION -->
            <section class="content-section" data-section="glosario" data-mode="accessible">
                <div class="section-header">
                    <span class="breadcrumb">No-Programadores / Glosario</span>
                    <h2>📚 Glosario de Términos</h2>
                    <p class="section-lead">Explicaciones simples de términos técnicos.</p>
                </div>
                <article class="card">
                    <h3>PR (Pull Request)</h3>
                    <p>Propuesta de cambios al código. Se revisa antes de aplicar.</p>
                </article>
                <article class="card">
                    <h3>Branch (Rama)</h3>
                    <p>Versión aislada del código. Como trabajar en un borrador sin afectar el original.</p>
                </article>
                <article class="card">
                    <h3>API (Application Programming Interface)</h3>
                    <p>Forma de comunicarse entre programas. Como un menú de opciones disponibles.</p>
                </article>
                <article class="card">
                    <h3>Token</h3>
                    <p>Pequeñas unidades de texto que Claude lee. Como palabras que se cuentan.</p>
                </article>
            </section>

            <!-- QUIZZES SECTION -->
            <section class="content-section" data-section="quizzes" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Evaluación / Quizzes</span>
                    <h2>❓ Quizzes Interactivos</h2>
                    <p class="section-lead">Prueba tu conocimiento con quizzes por nivel.</p>
                </div>
                <article class="card">
                    <h3>Quiz Nivel 1: Fundamentos</h3>
                    <p>10 preguntas sobre: instalación, /init, CLAUDE.md, mencionar archivos.</p>
                    <p><button class="btn btn-primary" onclick="startQuiz('nivel1')">Iniciar Quiz</button></p>
                </article>
                <article class="card">
                    <h3>Quiz Nivel 2: Avanzado</h3>
                    <p>12 preguntas sobre: MCPs, /fork, /compact, Hooks.</p>
                    <p><button class="btn btn-primary" onclick="startQuiz('nivel2')">Iniciar Quiz</button></p>
                </article>
            </section>

            <!-- PROGRESO SECTION -->
            <section class="content-section" data-section="progreso" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Evaluación / Progreso</span>
                    <h2>📈 Mi Progreso</h2>
                    <p class="section-lead">Visualiza tu avance en el curso.</p>
                </div>
                <article class="card">
                    <h3>Progreso Guardado Localmente</h3>
                    <p>Tu progreso se guarda en localStorage de tu navegador.</p>
                    <pre><code>Completado:
✓ Nivel 1 Fundamentos (85%)
✓ Nivel 2 Avanzado (45%)
○ Nivel 3 Experto (0%)
○ Nivel 4 Maestría (0%)</code></pre>
                </article>
            </section>

            <!-- MEJORES PRÁCTICAS SECTION -->
            <section class="content-section" data-section="mejores-practicas" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Mejores Prácticas</span>
                    <h2>✦ Mejores Prácticas</h2>
                    <p class="section-lead">Patrones y antipatrones en la práctica.</p>
                </div>
                <article class="card">
                    <h3>✅ Buena Práctica: Menciona Archivos Específicos</h3>
                    <pre><code class="language-bash">@src/auth/login.ts
Revisa seguridad en este archivo.</code></pre>
                </article>
                <article class="card">
                    <h3>❌ Antipatrón: Pedir sin Contexto</h3>
                    <pre><code class="language-bash">Refactoriza el código.
# ¿Cuál código? ¿Qué archivos?</code></pre>
                </article>
                <article class="card">
                    <h3>✅ Buena Práctica: Usar /compact Regularmente</h3>
                    <p>Cuando el contexto crece, comprímelo para economizar tokens.</p>
                </article>
            </section>

            <!-- SIMULADOR TERMINAL SECTION -->
            <section class="content-section" data-section="terminal" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Terminal</span>
                    <h2>▶ Simulador Terminal</h2>
                    <p class="section-lead">Simula comandos Claude Code en tu navegador.</p>
                </div>
                <article class="card">
                    <div id="terminal-simulator" class="terminal">
                        <div class="terminal-header">
                            <span class="terminal-title">Claude Code Terminal Simulator</span>
                        </div>
                        <div class="terminal-content">
                            <p>$ claude</p>
                            <p>✓ Sesión iniciada en /home/user/proyecto</p>
                            <p>></p>
                        </div>
                    </div>
                </article>
            </section>

            <!-- RECURSOS EXTERNOS SECTION -->
            <section class="content-section" data-section="recursos" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Recursos</span>
                    <h2>↗ Recursos Externos</h2>
                    <p class="section-lead">Links útiles a documentación oficial y comunidad.</p>
                </div>
                <article class="card">
                    <h3>Documentación Oficial</h3>
                    <ul>
                        <li><a href="https://claude.ai/code" target="_blank">Claude Code Official →</a></li>
                        <li><a href="https://docs.anthropic.com" target="_blank">Anthropic Docs →</a></li>
                        <li><a href="https://github.com/modelcontextprotocol" target="_blank">MCP GitHub →</a></li>
                    </ul>
                </article>
                <article class="card">
                    <h3>Comunidad</h3>
                    <ul>
                        <li>Discord: Anthropic Community (oficial)</li>
                        <li>GitHub Discussions: Feedback y preguntas</li>
                        <li>Twitter: @AnthropicAI para updates</li>
                    </ul>
                </article>
            </section>

            <!-- GIT WORKFLOWS (maps to git-workflows link) -->
            <section class="content-section" data-section="git-workflows" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Git</span>
                    <h2>🌿 Git Workflows</h2>
                    <p class="section-lead">Ver <a href="#git-workflows-detail" data-jump="git-workflows-detail">Git Workflows Detallado</a> para 3 flujos copy-paste.</p>
                </div>
            </section>

            <!-- MCP USE CASES (maps to mcp-use-cases link) -->
            <section class="content-section" data-section="mcp-use-cases" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / MCPs</span>
                    <h2>🔗 MCPs por Caso de Uso</h2>
                    <p class="section-lead">Ver <a href="#mcp-setup" data-jump="mcp-setup">MCP Setup Guides</a> para GitHub, PostgreSQL, Slack.</p>
                </div>
            </section>

            <!-- HOOKS PRODUCTION (maps to hooks-production link) -->
            <section class="content-section" data-section="hooks-production" data-mode="technical">
                <div class="section-header">
                    <span class="breadcrumb">Producción / Hooks</span>
                    <h2>🎣 Hooks en Producción</h2>
                    <p class="section-lead">Ver <a href="#hooks-detail" data-jump="hooks-detail">Hooks Detallado</a> para 5 hooks de seguridad y automación.</p>
                </div>
            </section>
`;

const mainCloseTag = '</main>';
const insertPosition = html.lastIndexOf(mainCloseTag);

if (insertPosition === -1) {
    console.error('❌ No se encontró </main>');
    process.exit(1);
}

html = html.slice(0, insertPosition) + missingSections + '\n        ' + html.slice(insertPosition);
fs.writeFileSync(htmlPath, html, 'utf-8');

console.log('✅ 18 secciones vacías completadas:');
console.log('   - branching, rules, memory, patrones');
console.log('   - desafios, skills-avanzados, ci-cd');
console.log('   - intro-acc, casos-rol, glosario');
console.log('   - quizzes, progreso, mejores-practicas');
console.log('   - terminal, recursos');
console.log('   - git-workflows, mcp-use-cases, hooks-production');
console.log('✅ Links cruzados entre secciones (ej: hooks-production → hooks-detail)');
console.log('✅ Contenido estático, sin JavaScript dinámico\n');
