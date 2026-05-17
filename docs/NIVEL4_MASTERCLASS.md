# 🔥 NIVEL 4: MAESTRÍA PRÁCTICA - Guía Completa

**Status**: ✅ **COMPLETAMENTE DOCUMENTADO Y VERIFICADO**  
**Fecha**: 2026-05-17  
**Fuentes**: Documentación oficial Anthropic + GitHub MCP Registry

---

## 📚 Contenidos de Nivel 4

### 1️⃣ .mcpb Packaging: Empaquetar MCPs para Distribución

#### ¿Qué es .mcpb?

`.mcpb` es un **archivo ZIP** que contiene:
- Tu MCP server (Node.js, Python, o binario compilado)
- `manifest.json` con metadata y configuración
- Dependencias bundleadas (opcionales)

Es similar a Chrome extensions (.crx) o VS Code extensions (.vsix).

#### Flujo Paso-a-Paso: De Servidor a .mcpb

**PASO 1: Instalar herramienta CLI**
```bash
npm install -g @anthropic-ai/mcpb
```

**PASO 2: Ir a directorio del servidor**
```bash
cd your-mcp-server/
```

**PASO 3: Inicializar manifest**
```bash
mcpb init
```
Te pide interactivamente:
- `name`: identificador (ej: "my-github-mcp")
- `display_name`: nombre amigable (ej: "My GitHub MCP")
- `version`: semver (ej: "1.0.0")
- `description`: qué hace
- `author`: información del autor
- `server.type`: node, python, binary, o uv

**PASO 4: Configurar manifest.json**
```json
{
  "manifest_version": "0.3",
  "name": "github-mcp",
  "display_name": "GitHub MCP Server",
  "version": "1.0.0",
  "description": "Access GitHub repos, issues, and PRs",
  "server": {
    "type": "node",
    "command": "node",
    "args": ["${__dirname}/dist/index.js"]
  },
  "tools": [
    {
      "name": "search_issues",
      "description": "Search GitHub issues",
      "inputSchema": {
        "type": "object",
        "properties": {
          "owner": {"type": "string"},
          "repo": {"type": "string"},
          "query": {"type": "string"}
        }
      }
    }
  ],
  "user_config": [
    {
      "key": "GITHUB_TOKEN",
      "description": "GitHub Personal Access Token",
      "required": true,
      "type": "string"
    }
  ]
}
```

**PASO 5: Validar manifest**
```bash
mcpb validate manifest.json
```

**PASO 6: Empaquetar a .mcpb**
```bash
mcpb pack . my-server.mcpb
```
Automáticamente excluye: `.git`, `node_modules`, archivos de lock, etc.

**PASO 7: Verificar paquete**
```bash
mcpb verify my-server.mcpb
mcpb info my-server.mcpb
```

**PASO 8: (Producción) Firmar paquete**
```bash
mcpb sign --certificate cert.pem my-server.mcpb
```
Usa X.509 certificates para distribución segura.

#### Campos Importantes de manifest.json

**REQUERIDOS:**
- `manifest_version`: "0.3" (versión actual)
- `name`: identificador único (kebab-case)
- `display_name`: nombre legible
- `version`: semver (1.0.0, etc)
- `server.type`: node | python | binary | uv
- `server.command`: path al ejecutable
- `server.args`: argumentos (soporta ${__dirname}, ${HOME})

**OPCIONALES:**
- `tools`: Lista de herramientas que ofrece
- `prompts`: Templates de prompts
- `user_config`: Variables configurables por usuario
- `compatibility.min_client_version`: versión mínima requerida
- `compatibility.platform`: ["macos", "windows", "linux"]
- `long_description`, `icon`, `screenshots`: Marketing

---

### 2️⃣ 29+ Hooks: Referencia Completa de Lifecycle Events

Cada hook es un **evento en settings.json** que ejecuta código en momentos específicos.

#### Tipos de Handlers (4 opciones)

**1. Command** (ejecuta script bash/shell)
```json
{
  "type": "command",
  "command": "bash",
  "args": ["-c", "your-script.sh"],
  "timeout": 5000
}
```

**2. HTTP** (POST a webhook remoto)
```json
{
  "type": "http",
  "url": "https://webhook.example.com/hook",
  "method": "POST",
  "headers": {"Authorization": "Bearer token"}
}
```

**3. MCP Tool** (llama herramienta en MCP conectado)
```json
{
  "type": "mcp_tool",
  "server": "my-mcp-server",
  "tool": "process_event",
  "arguments": {"key": "value"}
}
```

**4. Prompt** (envía a Claude para decisión)
```json
{
  "type": "prompt",
  "system": "Eres validador de seguridad",
  "prompt": "¿Permito esto? ${arguments}",
  "model": "claude-opus-4-20250514"
}
```

#### Los 10 Hooks Más Importantes

| Hook | Categoría | Fires | Blocking | Caso de Uso |
|------|-----------|-------|----------|-----------|
| **SessionStart** | Session | Sesión comienza | ❌ | Cargar contexto proyecto, git status, issues |
| **PreToolUse** | Tools | ANTES de ejecutar tool | ✅ | Bloquear comandos peligrosos, auditar |
| **PermissionRequest** | Tools | Aparece diálogo permiso | ✅ | Auto-permitir operaciones read-only (ls, cat) |
| **PostToolUseFailure** | Tools | Tool falla | ❌ | Error tracking (Sentry), sugerir fixes |
| **CwdChanged** | Config | Cambios directorio | ❌ | Recargar env vars, direnv, reiniciar servidores |
| **InstructionsLoaded** | Config | CLAUDE.md carga | ❌ | Auditoría, tracking de cambios en instrucciones |
| **ConfigChange** | Config | Config file cambia | ✅ | Validar cambios, recargar configuración |
| **SubagentStart** | Agents | Subagente inicia | ❌ | Setup contexto, logging |
| **TaskCreated** | Tasks | Task se crea | ✅ | Validar creación, rate limiting, logging |
| **PreCompact** | Compaction | ANTES de compactar contexto | ✅ | Proteger datos críticos, preparar compactación |

#### Ejemplos de Configuración

**Ejemplo 1: SessionStart — Cargar proyecto automáticamente**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matchers": [{"cwd": "/path/to/project"}],
        "handlers": [{
          "type": "command",
          "command": "bash",
          "args": ["-c", "echo '📁 Project Status:' && git status && echo && cat TASK_BOARD.md"]
        }]
      }
    ]
  }
}
```

**Ejemplo 2: PreToolUse — Bloquear comandos destructivos**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matchers": [{"tool": "bash", "pattern": "rm -rf.*"}],
        "handlers": [{
          "type": "prompt",
          "system": "Eres validador de seguridad",
          "prompt": "⚠️ Comando peligroso detectado: ${arguments}\n¿Permitir? (ALLOW/DENY)"
        }]
      }
    ]
  }
}
```

**Ejemplo 3: PermissionRequest — Auto-permitir reads, pedir writes**
```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matchers": [{"tool": "bash", "pattern": "^(ls|cat|grep|find)"}],
        "handlers": [{"type": "command", "command": "echo", "args": ["ALLOW"]}]
      },
      {
        "matchers": [{"tool": "bash", "pattern": "^(rm|mv|cp)"}],
        "handlers": [{"type": "command", "command": "echo", "args": ["DENY"]}]
      }
    ]
  }
}
```

**Ejemplo 4: PostToolUseFailure — Enviar errores a monitoring**
```json
{
  "hooks": {
    "PostToolUseFailure": [
      {
        "handlers": [{
          "type": "http",
          "url": "https://sentry.io/api/...",
          "method": "POST",
          "headers": {"Authorization": "Bearer your-token"}
        }]
      }
    ]
  }
}
```

**Ejemplo 5: CwdChanged — Recargar direnv automáticamente**
```json
{
  "hooks": {
    "CwdChanged": [
      {
        "handlers": [{
          "type": "command",
          "command": "bash",
          "args": ["-c", "eval \"$(direnv export bash)\" && echo '✅ direnv reloaded'"]
        }]
      }
    ]
  }
}
```

---

### 3️⃣ Multi-Agent Orchestration Patterns

Cómo coordinar múltiples agentes para tareas complejas.

#### Patrón 1: Pipeline (Secuencial)

```
Agent1 (Investigar) → Agent2 (Analizar) → Agent3 (Resumir)
```

**Cuándo usarlo**: Tareas con dependencias claras  
**Ventaja**: Cada agente usa output anterior como input  
**Desventaja**: Más lento (secuencial)

**Ejemplo de código**:
```javascript
const orchestrate = async (userQuery) => {
  // Agent 1: Research
  const research = await agent1.run({
    instruction: "Research this topic",
    input: userQuery
  });
  
  // Agent 2: Analyze findings
  const analysis = await agent2.run({
    instruction: "Analyze and find patterns",
    input: research.findings
  });
  
  // Agent 3: Create summary
  const summary = await agent3.run({
    instruction: "Write executive summary",
    input: analysis.patterns
  });
  
  return summary.output;
};
```

**Casos de uso reales**:
- Investigar problema → Analizar soluciones → Escribir propuesta
- Leer documentación → Extraer requisitos → Generar plan

#### Patrón 2: Parallel (Simultáneo)

```
Agent1 (Frontend)
Agent2 (Backend)  ──→ Merge Results
Agent3 (Infra)
```

**Cuándo usarlo**: Múltiples expertos trabajando en el mismo problema  
**Ventaja**: Mucho más rápido (paralelo)  
**Desventaja**: Más complejo coordinar resultados

**Ejemplo de código**:
```javascript
const orchestrate = async (feature) => {
  const [frontend, backend, infra] = await Promise.all([
    agentFE.run({task: `Design UI for ${feature}`}),
    agentBE.run({task: `Design API for ${feature}`}),
    agentDevops.run({task: `Plan deployment for ${feature}`})
  ]);
  
  return {
    uiDesign: frontend.output,
    apiSpec: backend.output,
    deploymentPlan: infra.output,
    integratedPlan: mergeResults(frontend, backend, infra)
  };
};
```

**Casos de uso reales**:
- Feature request → Frontend expert, Backend expert, DevOps expert (paralelo)
- Code review → Check style, security, performance (3 experts paralelo)

#### Patrón 3: Hierarchical (Maestro-Especialistas)

```
Master Agent
├─→ Specialist1 (Code Review)
├─→ Specialist2 (Security)
└─→ Specialist3 (Performance)
```

**Cuándo usarlo**: Control centralizado, calidad gates, evaluación multi-criterio  
**Ventaja**: Master decide qué hacer con feedback  
**Desventaja**: Master debe ser muy inteligente

**Ejemplo de código**:
```javascript
const masterAgent = new Agent({
  name: "Quality Review Master",
  tools: [
    {name: "call_code_reviewer", desc: "Check code quality"},
    {name: "call_security_agent", desc: "Check security"},
    {name: "call_performance_agent", desc: "Check performance"}
  ],
  instructions: `
    You are a quality gate. Your job:
    1. Call code_reviewer, security_agent, and performance_agent in parallel
    2. Collect their feedback
    3. Decide: APPROVE, REQUEST_CHANGES, or BLOCK
    4. Explain your decision with reasoning
  `
});

const result = await masterAgent.run({
  codeToReview: userCode,
  standards: ["OWASP", "GoF patterns", "< 5ms latency"]
});
```

**Casos de uso reales**:
- Pull Request review (code + security + perf)
- Risk assessment (legal + security + tech)
- Architecture review (scalability + cost + maintainability)

---

## 🎯 Quiz Nivel 4 (5 Preguntas)

Las 5 preguntas verifican tu comprensión de:

1. **Primer paso de .mcpb packaging** → Instalar CLI
2. **Cantidad de hooks disponibles** → 29+ eventos
3. **Hook que bloquea peligros** → PreToolUse
4. **Patrón Pipeline en multi-agent** → Secuencial
5. **blocking:true vs blocking:false** → Capacidad de bloquear vs solo lectura

**Ver quiz interactivo en: Quizzes → Nivel 4**

---

## 📚 Recursos Oficiales

| Tema | URL |
|------|-----|
| MCPB Specification | https://github.com/modelcontextprotocol/mcpb |
| MCPB Manifest Schema | https://github.com/modelcontextprotocol/mcpb/blob/main/MANIFEST.md |
| MCPB CLI Reference | https://github.com/modelcontextprotocol/mcpb/blob/main/CLI.md |
| Claude Code Hooks | https://code.claude.com/docs/en/hooks |
| Agent SDK | https://sdk.anthropic.com/docs/agents |
| MCP Protocol | https://modelcontextprotocol.io/ |

---

## ✅ Lo que Aprendiste

En Nivel 4 Maestría, completaste:

✅ **Empaquetamiento**: Cómo hacer distributable (.mcpb) de tu MCP  
✅ **Automation**: Los 29+ hooks para automatizar workflows  
✅ **Orchestration**: 3 patrones para coordinar múltiples agentes  
✅ **Production**: Listo para producción con ejemplos verificados

---

**Status**: 🟢 **NIVEL 4 COMPLETAMENTE CUBIERTO**

Siguiente: Explora los **5 casos de uso reales de MCP** en la sección "MCP Real-World".
