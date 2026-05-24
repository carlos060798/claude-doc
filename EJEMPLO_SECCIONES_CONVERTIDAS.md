# Ejemplos Concretos: Conversión .md → HTML

## Sección 1: Nivel 5 - Troubleshooting Avanzado

Esta es la conversión HTML completa de una sección de troubleshooting, lista para integrar en index.html.

```html
<!-- ====== SECCIÓN: NIVEL 5 — TROUBLESHOOTING ====== -->
<section class="content-section" data-section="nivel-5-troubleshooting" data-mode="technical">

    <div class="section-header">
        <span class="breadcrumb">Nivel 5 / Troubleshooting</span>
        <h2>🔧 Troubleshooting Avanzado</h2>
        <p class="section-lead">
            Herramientas sistemáticas y flujos de diagnóstico para resolver
            problemas complejos en Claude Code. Desde agotamiento de tokens
            hasta errores de integración con MCP.
        </p>
    </div>

    <!-- BLOQUE 1: Metodología Introductoria -->
    <h3 class="block-title">🎯 Metodología de Diagnóstico</h3>
    <p>
        Todo problema tiene un patrón reconocible. La mayoría de errores en Claude Code
        caen en 5 categorías predecibles:
    </p>
    <ul class="bullet-list">
        <li><strong>Token budget agotado</strong> — Sesiones largas sin compactación</li>
        <li><strong>MCP connectivity</strong> — Fallo en conexión a servidor externo</li>
        <li><strong>Memory issues</strong> — Contexto persistente inválido o corrupto</li>
        <li><strong>Permission errors</strong> — Permisos insuficientes en archivos/directorios</li>
        <li><strong>Performance degradation</strong> — Respuestas lentas sin razón aparente</li>
    </ul>

    <p>El flujo diagnóstico sigue 3 pasos simples:</p>
    <ol class="step-list">
        <li><strong>Recopilar evidencia:</strong> Logs, stack traces, contexto de ejecución</li>
        <li><strong>Aislar variable:</strong> Reduce el input hasta encontrar la causa raíz</li>
        <li><strong>Validar hipótesis:</strong> Verifica tu solución antes de escalar a soporte</li>
    </ol>

    <!-- BLOQUE 2: Comando clave -->
    <h3 class="block-title">⚡ Comando Esencial: /context</h3>
    <p>
        El comando <code>/context</code> es tu herramienta de diagnóstico número uno.
        Ejecutalo cada hora en sesiones largas.
    </p>
    <div class="code-block" data-lang="bash" data-title="Terminal">
        <pre><code>$ claude /context
┌─────────────────────────────────────────────┐
│ 📊 Context Usage (Sesión: debug-api)        │
├─────────────────────────────────────────────┤
│ Tokens Usados:    124,850 / 200,000        │
│ % Utilización:    62.4% (SEGURO)            │
│ Sistema Prompt:   800 tokens                │
│ Conversación:     124,050 tokens            │
│ Ventana Activa:   ~40K (últimas 10 msgs)   │
├─────────────────────────────────────────────┤
│ Recomendación: Continúa normalmente         │
└─────────────────────────────────────────────┘</code></pre>
    </div>

    <div class="highlight-box">
        <strong>💡 Pro Tip:</strong> Si utilización > 85%, ejecuta <code>/compact "mantén últimas 5 mensajes"</code>
        inmediatamente. No esperes a que el error ocurra.
    </div>

    <!-- BLOQUE 3: Matriz de Decisión -->
    <h3 class="block-title">📊 Matriz: 5 Problemas Principales y Soluciones</h3>
    <div class="grid-3col">
        <div>
            <h4>📦 Token Budget Agotado</h4>
            <p><strong>Síntoma:</strong> Error "Context limit exceeded" o respuestas rechazadas</p>
            <p><strong>Verificación rápida:</strong></p>
            <ol>
                <li>Ejecutar: <code>/context</code></li>
                <li>Si > 85%: Proceder a solución</li>
            </ol>
            <p><strong>Solución:</strong></p>
            <ol>
                <li>Ejecuta: <code>/compact "preserva últimas 3 interacciones"</code></li>
                <li>Verifica: <code>/context</code> nuevamente (debe bajar a ~30%)</li>
                <li>Continúa normalmente</li>
            </ol>
        </div>

        <div>
            <h4>🔗 Conexión MCP Rechazada</h4>
            <p><strong>Síntoma:</strong> "Connection refused" o "ECONNREFUSED"</p>
            <p><strong>Verificación rápida:</strong></p>
            <ol>
                <li>Puerto activo: <code>lsof -i :5000</code></li>
                <li>Si nada: servidor está down</li>
            </ol>
            <p><strong>Solución:</strong></p>
            <ol>
                <li>Restart: <code>/mcp restart github</code></li>
                <li>Espera 5 seg, reintenta</li>
                <li>Si falla: revisar logs del servidor</li>
            </ol>
        </div>

        <div>
            <h4>🚨 Error de Permisos</h4>
            <p><strong>Síntoma:</strong> "Permission denied" o "EACCES"</p>
            <p><strong>Verificación rápida:</strong></p>
            <ol>
                <li>Revisar: <code>ls -la archivo.txt</code></li>
                <li>Buscar "r" en columna 1-3</li>
            </ol>
            <p><strong>Solución:</strong></p>
            <ol>
                <li>Añadir lectura: <code>chmod +r archivo.txt</code></li>
                <li>Reintenta la operación</li>
            </ol>
        </div>
    </div>

    <!-- BLOQUE 4: Tabla comparativa -->
    <h3 class="block-title">📋 Tabla: Comandos de Diagnóstico</h3>
    <table>
        <thead>
            <tr>
                <th>Comando</th>
                <th>Cuándo usarlo</th>
                <th>Output esperado</th>
                <th>Acción si falla</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>/context</code></td>
                <td>Cada 1-2 horas en sesiones largas</td>
                <td>% tokens, breakdown por sección</td>
                <td>Si > 90%, ejecuta /compact ahora</td>
            </tr>
            <tr>
                <td><code>/memory</code></td>
                <td>Para verificar persistencia</td>
                <td>Contenido de memoria en CLAUDE.md</td>
                <td>Si vacío, añade anotaciones manualmente</td>
            </tr>
            <tr>
                <td><code>claude --version</code></td>
                <td>Para verificar instalación</td>
                <td>Versión semántica (ej: 1.25.3)</td>
                <td>Si error: reinstala con npm</td>
            </tr>
            <tr>
                <td><code>DEBUG=1 claude ...</code></td>
                <td>Para obtener logs detallados</td>
                <td>Líneas de debug en stderr</td>
                <td>Revisa logs, busca palabras clave de error</td>
            </tr>
        </tbody>
    </table>

    <div class="warning">
        <strong>⚠️ Cuidado:</strong> No comprimas contexto si tienes tokens sin procesar
        (ej: respuestas pendientes de leer). Puedes perder datos críticos.
        Siempre lee la respuesta completa antes de /compact.
    </div>

    <!-- BLOQUE 5: Casos específicos -->
    <h3 class="block-title">🔍 Casos Específicos: Diagnóstico Profundo</h3>

    <h4>Caso A: Sesión lenta sin motivo aparente</h4>
    <div class="code-block" data-lang="text" data-title="Procedimiento">
        <pre><code>1. Verifica CPU/RAM en tu máquina
   $ top -n 1 | head -20
   
2. Revisa si hay MCPs consumiendo recursos
   $ ps aux | grep mcp
   
3. Reduce tamaño de input (archivos muy grandes enlentecen)
   $ wc -l archivo.ts  # Si > 500 líneas, considera dividir
   
4. Haz /compact con "preserva últimas 5 mensajes"
   
5. Reintenta con input más pequeño</code></pre>
    </div>

    <h4>Caso B: MCP falla pero no sabes cuál</h4>
    <div class="code-block" data-lang="bash" data-title="Diagnóstico">
        <pre><code>$ claude /mcp list
Registered MCPs:
  ✅ github (stdio, localhost:3001)
  ❌ slack (HTTP, no response)
  ✅ postgres (stdio, localhost:5432)

# Reinicia solo el que está down
$ claude /mcp restart slack

# Espera 5 segundos y verifica
$ claude /mcp list</code></pre>
    </div>

    <div class="notas-css">
        <strong>ℹ️ Información:</strong> Si un MCP falla persistentemente, revisa el log del servidor.
        Generalmente el problema es que el servidor está down o escucha en otro puerto.
    </div>

    <!-- BLOQUE 6: Escalación -->
    <h3 class="block-title">🚀 Cuándo Escalar a Soporte</h3>
    <p>
        Si después de estos pasos el problema persiste, recopila esta información
        antes de contactar a soporte:
    </p>
    <ul class="bullet-list">
        <li>Output exacto de <code>/context</code></li>
        <li>Output exacto del error (copy/paste completo)</li>
        <li>Logs: <code>DEBUG=1 claude ... 2>&1 | tee debug.log</code></li>
        <li>Versión: <code>claude --version</code></li>
        <li>Tu SO: <code>uname -a</code></li>
        <li>Node version: <code>node --version</code></li>
    </ul>

</section>
```

---

## Sección 2: Nivel 5 - Cost Forecasting y ROI

```html
<!-- ====== SECCIÓN: NIVEL 5 — COST FORECASTING ====== -->
<section class="content-section" data-section="nivel-5-cost-forecasting" data-mode="technical">

    <div class="section-header">
        <span class="breadcrumb">Nivel 5 / Cost Forecasting</span>
        <h2>💰 Predicción de Costos y ROI</h2>
        <p class="section-lead">
            Predice costos de API antes de escalar. Modelos de presupuesto,
            estimadores por caso de uso, análisis de ROI y optimizaciones
            para empresas que gastan 5K+/mes en Claude.
        </p>
    </div>

    <!-- BLOQUE 1: Fórmula base -->
    <h3 class="block-title">🧮 Fórmula Base de Costo</h3>
    <p>
        El costo de Claude API es una función lineal simple: depende de tokens
        de entrada y tokens de salida. El input es siempre más barato que el output.
    </p>
    <div class="code-block" data-lang="text" data-title="Matemática">
        <pre><code>Costo Total = (Tokens Input × Precio Input) + (Tokens Output × Precio Output)

=== EJEMPLO ===
Modelo: Claude 3.5 Sonnet
- Precio Input:  $3.00 / 1M tokens
- Precio Output: $15.00 / 1M tokens

Si procesas:
- Input:  1,000,000 tokens
- Output: 500,000 tokens

Cálculo:
Costo = (1,000,000 × $0.000003) + (500,000 × $0.000015)
Costo = $3.00 + $7.50
Costo Total = $10.50 para esta operación</code></pre>
    </div>

    <div class="highlight-box">
        <strong>💡 Insight clave:</strong> El output es 5x más caro que el input en Sonnet.
        Para optimizar costos, <strong>reduce tokens de salida</strong>, no input.
    </div>

    <!-- BLOQUE 2: Tabla de modelos -->
    <h3 class="block-title">📊 Tabla Comparativa: Modelos y Precios Actuales (2026)</h3>
    <table>
        <thead>
            <tr>
                <th>Modelo</th>
                <th>Entrada (por 1M)</th>
                <th>Salida (por 1M)</th>
                <th>Relación S/E</th>
                <th>Mejor para</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Claude 3.5 Haiku</strong></td>
                <td>$0.80</td>
                <td>$4.00</td>
                <td>5x</td>
                <td>Batch masivo, análisis rápido, desarrollo local</td>
            </tr>
            <tr>
                <td><strong>Claude 3.5 Sonnet</strong></td>
                <td>$3.00</td>
                <td>$15.00</td>
                <td>5x</td>
                <td>Producción, balanceado, recomendado general</td>
            </tr>
            <tr>
                <td><strong>Claude 3.5 Opus</strong></td>
                <td>$15.00</td>
                <td>$75.00</td>
                <td>5x</td>
                <td>Razonamiento complejo, research, edge cases</td>
            </tr>
            <tr>
                <td><strong>Claude 3 Haiku</strong></td>
                <td>$0.25</td>
                <td>$1.25</td>
                <td>5x</td>
                <td>Batch muy barato, tests, prototipado</td>
            </tr>
        </tbody>
    </table>

    <div class="notas-css">
        <strong>ℹ️ Nota técnica:</strong> Con prompt caching (entrada reutilizada 2+ veces),
        la entrada tiene descuento de 90%. Perfecta para sesiones largas o análisis repetido.
    </div>

    <!-- BLOQUE 3: Estimadores por caso de uso -->
    <h3 class="block-title">🎯 Estimadores Rápidos: Casos Reales</h3>
    <div class="grid-2col">
        <div>
            <h4>Caso 1: Code Review Bot (100 PRs/mes)</h4>
            <div class="code-block" data-lang="text" data-title="Cálculo">
                <pre><code>=== Tokens por PR ===
Input:
  - Código promedio:  10K tokens
  - Contexto (diff):  5K tokens
  - Instrucción:      100 tokens
  Total input: 15K tokens

Output:
  - Comentarios:      3K tokens
  Total output: 3K tokens

=== Costo por PR ===
Usando: Claude 3.5 Sonnet
Input:  15,000 × ($3.00/1M) = $0.045
Output: 3,000 × ($15.00/1M) = $0.045
Costo/PR = $0.09

=== Costo mensual ===
100 PRs × $0.09 = $9.00/mes
Anual: $108/año (1 developer equivalente)</code></pre>
            </div>
        </div>

        <div>
            <h4>Caso 2: Data Analysis (50 análisis/mes)</h4>
            <div class="code-block" data-lang="text" data-title="Cálculo">
                <pre><code>=== Tokens por análisis ===
Input:
  - Dataset CSV: 30K tokens
  - SQL queries: 15K tokens
  - Prompt: 5K tokens
  Total input: 50K tokens

Output:
  - Insights + SQL: 10K tokens
  Total output: 10K tokens

=== Costo por análisis ===
Modelo: Claude 3.5 Sonnet
Input:  50,000 × ($3.00/1M) = $0.15
Output: 10,000 × ($15.00/1M) = $0.15
Costo/análisis = $0.30

=== Costo mensual ===
50 análisis × $0.30 = $15.00/mes
Anual: $180/año (data analyst equivalente)</code></pre>
            </div>
        </div>

        <div>
            <h4>Caso 3: Documentación + Testing (bulk generation)</h4>
            <div class="code-block" data-lang="text" data-title="Cálculo">
                <pre><code>=== Tokens por módulo ===
Input:
  - Código fuente: 25K tokens
  - Specs: 10K tokens
  - Ejemplos: 5K tokens
  Total input: 40K tokens

Output:
  - Docs + tests: 20K tokens
  Total output: 20K tokens

=== Costo por módulo ===
Modelo: Claude 3.5 Sonnet
Input:  40K × $0.000003 = $0.12
Output: 20K × $0.000015 = $0.30
Costo/módulo = $0.42

=== Costo anual (20 módulos) ===
20 × $0.42 = $8.40
Tiempo ahorrado: ~160 horas (developer equivalente: $3,200)</code></pre>
            </div>
        </div>
    </div>

    <div class="highlight-box">
        <strong>💡 Promedio por Developer:</strong> Si un developer usa Claude Code
        1-2 horas/día, presupuesta $30-80/mes en API. Para un equipo de 100 developers,
        costo estimado: $3,000-8,000/mes.
    </div>

    <!-- BLOQUE 4: Optimizaciones -->
    <h3 class="block-title">⚡ 5 Estrategias para Reducir Costos</h3>
    <div class="grid-3col">
        <div>
            <h4>1. Prompt Caching</h4>
            <p>Reutiliza prompts + contexto largo 2+ veces → 90% descuento en input</p>
            <div class="code-block" data-lang="text" data-title="Ahorro">
                <pre><code>Sin cache:
100 análisis × 50K input × $3/M = $15

Con cache (1x entrada, 99x reutilizada):
= (1 × 50K × $3/M) + (99 × 50K × $0.30/M)
= $0.15 + $14.85 = $15

❌ Casi nada si cada análisis es diferente</code></pre>
            </div>
        </div>

        <div>
            <h4>2. Batch API (Análisis Offline)</h4>
            <p>Procesa 100s de requests a menor precio (50% descuento)</p>
            <div class="code-block" data-lang="text" data-title="Ahorro">
                <pre><code>Regular: 100 × 50K × $3/M = $15
Batch:   100 × 50K × $1.5/M = $7.50

Ahorro: 50% ✅
Trade-off: 24h latencia</code></pre>
            </div>
        </div>

        <div>
            <h4>3. Usar Haiku en lugar de Sonnet</h4>
            <p>Para tareas simples (parsing, clasificación) → 75% más barato</p>
            <div class="code-block" data-lang="text" data-title="Ahorro">
                <pre><code>Sonnet: 50K input × $3/M = $0.15
Haiku:  50K input × $0.80/M = $0.04

Ahorro: 73% ✅
Validación: Apenas afecta calidad</code></pre>
            </div>
        </div>
    </div>

    <!-- BLOQUE 5: ROI -->
    <h3 class="block-title">📈 Análisis de ROI: Cuándo se amortiza</h3>
    <p>
        Claude no es gratis, pero el ROI típico es positivo en 1-3 meses.
        Aquí está el breakdown:
    </p>
    <table>
        <thead>
            <tr>
                <th>Escenario</th>
                <th>Inversión Inicial</th>
                <th>Costo Mensual</th>
                <th>Ahorro Mensual</th>
                <th>Break-even</th>
                <th>ROI Año 1</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>1 Developer (Code Review)</strong></td>
                <td>$0</td>
                <td>$9</td>
                <td>$1,200 (8h/mes ahorradas)</td>
                <td>~1 semana</td>
                <td>13x</td>
            </tr>
            <tr>
                <td><strong>10 Developers (Equipo)</strong></td>
                <td>$500 (setup)</td>
                <td>$400</td>
                <td>$12,000 (80h/mes ahorradas)</td>
                <td>~10 días</td>
                <td>35x</td>
            </tr>
            <tr>
                <td><strong>100 Developers (Empresa)</strong></td>
                <td>$5,000 (infra + training)</td>
                <td>$5,000</td>
                <td>$120,000 (800h/mes ahorradas)</td>
                <td>~3 semanas</td>
                <td>240x</td>
            </tr>
        </tbody>
    </table>

    <div class="warning">
        <strong>⚠️ Advertencia:</strong> El ROI asume que los developers <strong>realmente</strong>
        usan Claude para automatizar tareas. Sin training y governance, adoption es 0%.
    </div>

</section>
```

---

## Integración en index.html

### Ubicación correcta en el árbol HTML:

```
<main class="main-content">
    <!-- ... otras secciones antes ... -->

    <!-- Aquí va Nivel 5 Troubleshooting -->
    <!-- ====== SECCIÓN: NIVEL 5 — TROUBLESHOOTING ====== -->
    <section class="content-section" data-section="nivel-5-troubleshooting" ...>
    ...
    </section>

    <!-- Aquí va Nivel 5 Cost Forecasting -->
    <!-- ====== SECCIÓN: NIVEL 5 — COST FORECASTING ====== -->
    <section class="content-section" data-section="nivel-5-cost-forecasting" ...>
    ...
    </section>

    <!-- ... otras secciones después ... -->
</main>
```

### Verificaciones post-integración:

1. **En navegador:** Abre index.html
2. **Busca en sidebar:** ¿Aparecen los links en "Nivel 5: Líder Técnico"?
3. **Clickea en sidebar:** ¿Se muestra la sección correcta?
4. **Prueba navegación:** ¿Puedes alternar entre troubleshooting y cost-forecasting?
5. **Valida CSS:** ¿Se ve el color del borde naranja en los h3 con class="block-title"?
6. **Prueba responsivo:** ¿Funciona en móvil (grid se colapsa a 1 columna)?

---

## Notas de implementación:

- **data-section:** Debe coincidir exactamente con el href en sidebar (sin #)
- **data-mode:** "technical" filtra por modo (mostrar solo si toggle en "Técnico")
- **Clases CSS:** Todas heredan de styles.css existente (no requiere CSS adicional)
- **Emojis:** Se renderizan nativamente en HTML moderno
- **Tablas:** Heredan estilos de table > tr > td en styles.css
- **Grid:** grid-3col usa CSS Grid nativo (no requiere librerías)
