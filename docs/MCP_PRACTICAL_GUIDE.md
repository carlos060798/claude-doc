# 🚀 MCP Casos de Uso Reales - Guía Práctica

**Status**: ✅ **VERIFICADO CONTRA DOCUMENTACIÓN OFICIAL**  
**Fecha**: 2026-05-17  
**Fuentes**: GitHub MCP Registry, Anthropic Official Docs

---

## Intro: MCP En Acción

Este documento muestra **5 MCPs reales** que puedes instalar y usar **HOY** en Claude Code.

Cada caso incluye:
- ✅ Instalación exacta
- ✅ .mcp.json copiable
- ✅ Ejemplo real de uso
- ✅ Errores comunes + fixes

---

## 1️⃣ Filesystem MCP — Operaciones de Archivos

### ¿Qué hace?

Lee, escribe, lista archivos **dentro de un directorio sandbox** (seguro, no acceso root).

### Instalación

```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/root
```

Reemplaza `/path/to/root` con el directorio raíz permitido:
```bash
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /home/user/projects
```

### .mcp.json Completo (Copiar-Pegar)

```json
{
  "name": "filesystem",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"],
  "env": {}
}
```

### Herramientas Disponibles

| Tool | Qué hace |
|------|----------|
| `read_file` | Lee contenido del archivo |
| `write_file` | Crea o sobrescribe archivo |
| `list_dir` | Lista directorios y archivos |
| `move_file` | Mueve/renombra archivo |
| `delete_file` | Elimina archivo |

### Ejemplo Real en Acción

**Pregunta**: "Find all TODO comments in the src/ directory and list them"

**Claude hace**:
1. Llama `list_dir` en src/
2. Por cada archivo .js/.py/.ts: llama `read_file`
3. Parsea contenido buscando "TODO"
4. Retorna lista organizada con líneas

**Resultado**:
```
✅ src/auth.js:34 — TODO: Add OAuth2 support
✅ src/api.js:112 — TODO: Cache responses
✅ src/utils.js:88 — TODO: Optimize regex
```

### Errores Comunes

**Error**: `EACCES: permission denied, scandir '/root'`  
**Causa**: Intentas acceder fuera del directorio sandbox  
**Fix**: El directorio raíz que especificaste es la frontera; no puede salir

**Error**: `ENOENT: no such file or directory`  
**Causa**: Ruta relativa incorrecta o archivo no existe  
**Fix**: Usa rutas relativas al directorio raíz, ej: `src/app.js` no `/home/user/projects/src/app.js`

---

## 2️⃣ GitHub MCP — Gestión de Repositorios

### ¿Qué hace?

Accede a **repositorios, issues, PRs, workflows** en GitHub (requiere token).

### Instalación

```bash
export GITHUB_TOKEN="ghp_xxxx..." # Tu GitHub PAT
claude mcp add github -- docker run -e GITHUB_TOKEN=$GITHUB_TOKEN ghcr.io/github/github-mcp-server
```

O si prefieres npm (nota: deprecated pero funciona):
```bash
npm install -g @modelcontextprotocol/server-github
claude mcp add github -- server-github
```

### .mcp.json Completo

```json
{
  "name": "github",
  "type": "stdio",
  "command": "docker",
  "args": [
    "run",
    "-e", "GITHUB_TOKEN=${GITHUB_TOKEN}",
    "ghcr.io/github/github-mcp-server"
  ],
  "env": {
    "GITHUB_TOKEN": "your_github_pat_here"
  }
}
```

### Herramientas Disponibles

| Tool | Qué hace |
|------|----------|
| `search_repositories` | Busca repos públicos/privados |
| `get_repository` | Obtiene detalles del repo |
| `list_issues` | Lista issues abiertos/cerrados |
| `search_issues` | Busca issues por keyword |
| `create_issue` | Crea nueva issue |
| `create_pull_request` | Crea nuevo PR |
| `get_pull_request` | Obtiene detalles del PR |
| `add_pull_request_comment` | Comenta en PR |
| `search_code` | Busca código en repos |

### Ejemplo Real en Acción

**Pregunta**: "List all open bugs in my 'claude-code-mastery' repo, group by priority"

**Claude hace**:
1. Llama `search_issues` con query: `repo:owner/claude-code-mastery is:open label:bug`
2. Filtra por label "priority: critical", "priority: high", etc
3. Retorna lista agrupada

**Resultado**:
```
🔴 CRITICAL (2):
  - Issue #42: "Quiz localStorage not persisting" (comment: blocking)
  - Issue #51: "Export button downloads invalid JSON"

🟠 HIGH (3):
  - Issue #38: "Mobile responsiveness broken"
  - Issue #45: "Dark mode color contrast"
  - Issue #49: "Search is slow"

🟡 MEDIUM (1):
  - Issue #53: "Add keyboard shortcuts"
```

### Crear GitHub PAT (Personal Access Token)

1. Ve a https://github.com/settings/tokens
2. Click "Generate new token"
3. Nombre: "Claude Code MCP"
4. Scopes: ✅ `repo` (full control), ✅ `read:org`
5. Expiration: 90 days (recuerda renovar)
6. Copia token → `export GITHUB_TOKEN="ghp_..."`

### Errores Comunes

**Error**: `GITHUB_TOKEN not set`  
**Causa**: Variable de entorno no existe  
**Fix**: `echo $GITHUB_TOKEN` para verificar; si está vacío, export el token nuevamente

**Error**: `404 Not Found`  
**Causa**: Repo no existe o token no tiene permiso  
**Fix**: Verifica que el repo exista y el token tenga scope `repo`

**Error**: `API rate limit exceeded`  
**Causa**: Demasiadas llamadas en corto tiempo  
**Fix**: Espera 1 hora o actualiza tu cuenta GitHub a Pro

---

## 3️⃣ Memory MCP — Almacenamiento Persistente

### ¿Qué hace?

**Conocimiento persistente entre sesiones**: Entidades, relaciones, observaciones.

Es como una "librería de memoria" que Claude puede consultar después de reiniciar.

### Instalación

```bash
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory
```

### .mcp.json Completo

```json
{
  "name": "memory",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"],
  "env": {
    "MEMORY_DATABASE_PATH": "${HOME}/.claude-memory.jsonl"
  }
}
```

### Herramientas Disponibles

| Tool | Qué hace |
|------|----------|
| `create_entity` | Crea entidad (persona, proyecto, concepto) |
| `add_relation` | Crea relación entre 2 entidades |
| `add_observation` | Agrega hecho timestamped sobre entidad |
| `query_entities` | Busca entidades |
| `query_relations` | Busca relaciones entre entidades |

### Ejemplo Real en Acción

**Sesión 1 — Tú le dices a Claude**:
"Remember: Alice is working on the dashboard feature and is blocked by API changes"

**Claude hace**:
- `create_entity`: name="Alice", type="person"
- `create_entity`: name="dashboard", type="feature"
- `add_relation`: source="Alice", target="dashboard", type="is_working_on"
- `add_observation`: entity="Alice", observation="blocked_by_api_changes"
- Guarda en `~/.claude-memory.jsonl`

**Sesión 2 — Semana después, tú preguntas**:
"What's Alice working on? Is she still blocked?"

**Claude hace**:
- `query_entities`: finds "Alice"
- `query_relations`: finds Alice is_working_on "dashboard"
- `query_observations`: finds observation "blocked_by_api_changes"
- Retorna: "Alice is still working on dashboard, still blocked by API changes"

### Use Cases

✅ **Cross-session project context**: Recuerda dónde te quedaste  
✅ **Team knowledge base**: Roles, responsabilidades, blockers  
✅ **Customer context**: Preferencias, historial, decisiones pasadas  
✅ **Architecture decisions**: "Elegimos X porque Y" (y por qué no Z)

---

## 4️⃣ Fetch MCP — Obtener Contenido Web

### ¿Qué hace?

**Descarga y convierte web** → HTML a Markdown legible

### Instalación

```bash
claude mcp add fetch -- uvx mcp-server-fetch
```

### .mcp.json Completo

```json
{
  "name": "fetch",
  "type": "stdio",
  "command": "uvx",
  "args": ["mcp-server-fetch"],
  "env": {
    "ALLOWED_DOMAINS": "github.com,*.anthropic.com,modelcontextprotocol.io"
  }
}
```

### Herramientas

| Tool | Qué hace |
|------|----------|
| `fetch` | Descarga URL → Markdown |
| `fetch_with_chunks` | Descarga en chunks configurables |

### Ejemplo Real en Acción

**Pregunta**: "What's in the latest Claude Code blog post?"

**Claude hace**:
- `fetch`: https://blog.claude.ai/latest
- Convierte HTML → Markdown limpio
- Retorna contenido formateado

**Resultado**:
```markdown
# Latest Claude Code Features

## Hooks System
New lifecycle events added...

## Agent SDK Integration
Build autonomous agents...
```

### ⚠️ Seguridad

Fetch puede acceder a **localhost**. Si tienes servidores privados, cuidado:
```json
{
  "ALLOWED_DOMAINS": "public.example.com,NOT:localhost,NOT:192.168.1.*"
}
```

---

## 5️⃣ Time MCP (Bonus) — Zona Horaria & Conversiones

### ¿Qué hace?

Convierte entre zonas horarias, obtiene hora actual

### Instalación

```bash
claude mcp add time -- uvx mcp-server-time
```

### Herramientas

| Tool | Qué hace |
|------|----------|
| `get_current_time` | Hora actual en timezone |
| `convert_timezone` | Convierte entre timezones |
| `get_timezone_offset` | Offset UTC |

### Ejemplo

**Pregunta**: "What time is it in Tokyo when it's 9 AM in NYC?"

**Respuesta**: "10 PM same day (o 11 PM si daylight saving)"

---

## 🎯 Quick Start: Instala Los 5 Hoy

```bash
# 1. Filesystem
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem $HOME/projects

# 2. GitHub (requiere PAT)
export GITHUB_TOKEN="ghp_..." 
claude mcp add github -- docker run -e GITHUB_TOKEN=$GITHUB_TOKEN ghcr.io/github/github-mcp-server

# 3. Memory
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory

# 4. Fetch
claude mcp add fetch -- uvx mcp-server-fetch

# 5. Time
claude mcp add time -- uvx mcp-server-time

# Verificar
/mcp
```

Deberías ver 5 MCPs conectados y listos.

---

## 📚 Recursos Oficiales

| MCP | GitHub | Docs |
|-----|--------|------|
| Filesystem | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) | [README](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) |
| GitHub | [github/github-mcp-server](https://github.com/github/github-mcp-server) | [README](https://github.com/github/github-mcp-server#readme) |
| Memory | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) | [README](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) |
| Fetch | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) | [README](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) |
| Time | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/time) | [README](https://github.com/modelcontextprotocol/servers/tree/main/src/time) |

---

## ✅ Checklist: Nivel 2 Completo

Con estos 5 MCPs, completaste **Nivel 2: Avanzado**:

✅ Entiendes MCP (qué es, cómo funciona)  
✅ Sabes instalar MCPs (`claude mcp add`)  
✅ Conoces 5 casos reales (filesystem, github, memory, fetch, time)  
✅ Puedes construir workflows que combinan MCPs  
✅ Sabes debugging (`/mcp`)

---

**Siguiente nivel**: Nivel 3 Skills + Nivel 4 Maestría
