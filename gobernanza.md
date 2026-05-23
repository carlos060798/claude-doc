# Gobernanza y Políticas — Nivel 4/5

> Managed settings para enterprise. Matriz RACI de permisos. Políticas de uso aceptable. Template onboarding policy.

## Introducción

A escala empresarial, Claude Code requiere governance. Esta sección cubre:

- Configuraciones centralizadas (managed settings)
- Matriz RACI de acceso
- Políticas de uso aceptable
- Onboarding seguro
- Auditoría y compliance

**Tiempo estimado:** 90 minutos  
**Requisitos:** Acceso admin Anthropic Console, equipo 10+ devs  
**Nivel de dificultad:** Avanzado

---

## 1. Managed Settings para Enterprise

### Configuración centralizada

En `console.anthropic.com/settings/organization`:

```json
{
  "organization": {
    "id": "org_12345",
    "name": "TechCorp Inc",
    "tier": "enterprise"
  },
  "policies": {
    "models": {
      "allowed": ["claude-opus-4-20250514", "claude-sonnet-4-20250514", "claude-haiku-4-5"],
      "forbidden": [],
      "cost_limit_monthly_usd": 10000,
      "cost_limit_per_request_usd": 50
    },
    "features": {
      "mcp_servers": true,
      "skills": true,
      "agent_teams": false,
      "custom_tools": true,
      "file_upload": true,
      "max_file_size_mb": 500,
      "context_caching": true
    },
    "security": {
      "require_2fa": true,
      "require_vpn": false,
      "ip_whitelist": ["10.0.0.0/8"],
      "data_retention_days": 30,
      "allow_api_keys": true,
      "max_api_key_age_days": 90
    },
    "compliance": {
      "soc2": true,
      "gdpr_mode": true,
      "hipaa_compliant": false,
      "pii_detection": "warn",
      "audit_logging": true
    }
  },
  "teams": [
    {
      "id": "team_backend",
      "name": "Backend",
      "members": 12,
      "budget_monthly_usd": 400,
      "default_model": "claude-sonnet-4-20250514"
    },
    {
      "id": "team_data",
      "name": "Data/ML",
      "members": 5,
      "budget_monthly_usd": 250,
      "default_model": "claude-opus-4-20250514"
    }
  ]
}
```

### Configuración por equipo

```yaml
# Backend Team settings
teams.backend:
  permissions:
    - create_mcp_servers: true
    - create_skills: true
    - manage_api_keys: true
    - view_usage: true
    - modify_policies: false  # Solo admin
  
  constraints:
    - max_concurrent_requests: 50
    - max_tokens_per_request: 100000
    - allowed_models: [sonnet, haiku]
    - forbidden_models: [opus]
    - max_monthly_cost_usd: 400
    
  defaults:
    - model: sonnet
    - temperature: 0.3
    - timeout_seconds: 60
```

---

## 2. Matriz RACI de Permisos

### RACI 5×5 (Roles vs Acciones)

| Acción | Admin | Team Lead | Senior Dev | Junior Dev | Auditor |
|--------|-------|-----------|------------|------------|---------|
| **Ver usage/costos** | A | C | R | I | A |
| **Crear API keys** | A | C | R | I | I |
| **Rotar secrets** | A | C | - | - | A |
| **Cambiar policy global** | A | I | - | - | - |
| **Crear MCP server** | C | A | R | I | I |
| **Crear skill** | C | A | R | R | I |
| **Aprobar PR con IA** | - | A | R | R | I |
| **Ver audit logs** | A | I | - | - | A |
| **Cambiar modelo default** | A | C | - | - | - |
| **Establecer budget equipo** | A | I | - | - | - |

**Leyenda:**
- **A (Accountable):** Toma decisión final
- **R (Responsible):** Ejecuta la tarea
- **C (Consulted):** Opinión antes de decidir
- **I (Informed):** Notificado después

### Implementación en settings.json (local)

```json
{
  "permissions": {
    "admin@techcorp.com": {
      "role": "admin",
      "can": ["*"],
      "cannot": []
    },
    "backend-lead@techcorp.com": {
      "role": "team_lead",
      "team": "backend",
      "can": [
        "run_claude_code",
        "create_mcp_server",
        "create_skill",
        "view_team_usage",
        "manage_team_keys"
      ],
      "cannot": [
        "change_global_policy",
        "manage_billing",
        "view_other_teams"
      ]
    },
    "junior-dev@techcorp.com": {
      "role": "developer",
      "team": "backend",
      "can": [
        "run_claude_code",
        "create_skill",
        "view_own_usage"
      ],
      "cannot": [
        "create_mcp_server",  # Requiere revisión
        "manage_keys",
        "change_policy"
      ]
    }
  }
}
```

---

## 3. Políticas de Uso Aceptable (AUP)

### Template AUP

```markdown
# Política de Uso Aceptable — Claude Code

Efectivo: 2026-05-20 | Versión: 2.0

## 1. Propósito Aceptable

Claude Code se usa SOLO para:

✓ Tareas técnicas legítimas de desarrollo
✓ Code review, refactorización, testing
✓ Investigación interna, documentación
✓ Debugging, optimización de rendimiento
✓ Diseño arquitectónico, prueba de conceptos

## 2. Usos Prohibidos

✗ Generar código para venta sin licencia
✗ Intentar "jailbreak" o bypass restricciones
✗ Procesar información confidencial NO AUTORIZADA
✗ Crear herramientas de hacking/exploit
✗ Violar propiedad intelectual terceros
✗ Generar contenido discriminatorio/ilegal
✗ Evasión de seguridad (obtener credenciales)

## 3. Datos Sensibles

### NUNCA envíes a Claude Code:

- [ ] Contraseñas, JWT tokens, API keys
- [ ] Números de tarjeta de crédito
- [ ] SSN, pasaportes, documentos identidad
- [ ] Datos personales de usuarios (PII)
- [ ] Secretos comerciales no generalizados

### PUEDES enviar (con cuidado):

- [ ] Código propietario (sanitizado)
- [ ] Arquitectura (generalizada)
- [ ] Logs de error (sin contexto sensible)
- [ ] Esquemas BD (sin datos reales)

## 4. Compliance

### GDPR
- [ ] No procesar datos personales de EU sin consentimiento
- [ ] Datos residuales: max 30 días
- [ ] Derechos: olvido, acceso, portabilidad respetados

### SOC 2
- [ ] Auditoría: logs de todo acceso
- [ ] Cifrado: TLS en tránsito, en reposo
- [ ] Segregación: datos cliente separados

### HIPAA (si aplica)
- [ ] SÍ permitido (ej. análisis anónimo)
- [ ] NO permitido: PII de pacientes

## 5. Monitoreo y Auditoría

- Uso tracked automáticamente
- Alertas si: gasto anormal, patrón sospechoso
- Acceso a logs: admin, auditor, team lead
- Retención: 1 año, anonimización después

## 6. Sanciones

**Violación menor** (Primer aviso):
- Cambio de política
- Sesión de compliance

**Violación grave** (Segundo aviso):
- Suspension 1 semana
- Sesión con CISO

**Violación crítica** (Irreversible):
- Revoke acceso permanente
- Posible escalada legal

## 7. Preguntas Frecuentes

**P: ¿Puedo dejar logs en la consola?**
A: Sí si no contienen credenciales. Revisa antes de mandar.

**P: ¿Cuánto tiempo guarda Anthropic mis datos?**
A: Max 30 días si GDPR, 90 días si no.

**P: ¿Puedo compartir resultado con cliente?**
A: Sí si código fue generado para ese cliente.

**P: ¿Necesito reporte de auditoría para SOC2?**
A: Sí, disponible en console.anthropic.com/audit-logs

Actualización: 2026-05-20
Próxima revisión: 2026-08-20
```

---

## 4. Matriz de Control de Acceso

### Por nivel de sensitivo

```
NIVEL 1 — PUBLIC (No restringido)
├─ Código abierto
├─ Documentación pública
├─ Ejemplos/demos
└─ Acceso: TODOS

NIVEL 2 — INTERNAL (Empleados TechCorp)
├─ Código propietario
├─ Arquitectura de sistemas
├─ Roadmap técnico
└─ Acceso: Staff + contractors con NDA

NIVEL 3 — CONFIDENTIAL (Leadership + equipo específico)
├─ Estrategia de negocios
├─ Datos financieros
├─ Clientes grandes
└─ Acceso: VP+, team leads

NIVEL 4 — RESTRICTED (Muy selectivo)
├─ PII de usuarios
├─ Credenciales production
├─ Datos médicos (si HIPAA)
└─ Acceso: Security team, CISO
└─ Acción: NUNCA envíar a IA pública
```

### Configuración settings.json

```json
{
  "data_classification": {
    "public": {
      "tools": ["run_claude_code", "create_skill"],
      "teams": ["all"],
      "models": ["haiku", "sonnet", "opus"]
    },
    "internal": {
      "tools": ["run_claude_code", "create_mcp_server", "create_skill"],
      "teams": ["backend", "frontend", "data"],
      "models": ["sonnet", "opus"],
      "require_approval": false,
      "audit_log": true
    },
    "confidential": {
      "tools": ["run_claude_code"],
      "teams": ["backend"],
      "models": ["opus"],
      "require_approval": true,
      "require_vpn": true,
      "audit_log": true,
      "pii_scan": "block"
    },
    "restricted": {
      "tools": [],
      "teams": [],
      "models": [],
      "action": "ERROR - Do not share with external AI"
    }
  }
}
```

---

## 5. Onboarding Policy Template

```markdown
# Onboarding Checklist — Claude Code

Para NUEVOS desarrolladores en TechCorp:

## Día 1: Acceso

- [ ] Crear cuenta Anthropic (usar email corporativo)
- [ ] Activar 2FA en console.anthropic.com
- [ ] Agregar a equipo (backend/frontend/data)
- [ ] Sincronizar settings.json con repo privado
- [ ] Instalar: `npm install -g @anthropic-ai/claude-code`

## Día 2: Training

- [ ] Ver: Introducción 20 min (video interno)
- [ ] Leer: AUP y Política de Datos (15 min)
- [ ] Quiz: Compliance (80% requerido)
- [ ] Práctica: 3 tareas guiadas con mentor

## Día 3: Hands-on

- [ ] Tarea 1: Code review asistido (pequeño PR)
- [ ] Tarea 2: Generar tests de función
- [ ] Tarea 3: Refactor con guía
- [ ] Review: Mentor revisa resultados

## Semana 2: Independencia

- [ ] Usar Claude Code en tareas reales
- [ ] Reportar issues/feedback
- [ ] Check-in con team lead

## Continuidad

- [ ] Refresco anual de AUP
- [ ] Actualización de features (semestrales)
- [ ] Auditoría de acceso (anual)

---

## Firma de Cumplimiento

Confirmo que:
- [ ] He leído y entendido la AUP
- [ ] Comprendo las restricciones de datos
- [ ] Aceptaré auditoría de uso
- [ ] Reportaré violaciones

Empleado: ________________  Fecha: __________
Manager:  ________________  Fecha: __________
```

---

## 6. Auditoría y Logging

### Configuración de logs

```yaml
# audit-config.yaml
audit:
  enabled: true
  retention_days: 365
  
  events_to_log:
    - api_key_creation
    - api_key_rotation
    - policy_change
    - user_added_to_team
    - access_denied
    - cost_threshold_exceeded
    - mcp_server_created
    - skill_created
    - model_changed
  
  sensitive_fields_masked:
    - api_key_value (solo últimos 4 chars)
    - email_domain (solo domain)
    - file_content (hash solo)
  
  export_formats:
    - CSV (weekly)
    - JSON (on-demand)
    - Datadog (real-time)
```

### Ejemplo de log

```json
{
  "timestamp": "2026-05-20T14:32:15Z",
  "event_type": "MCP_SERVER_CREATED",
  "user_id": "user_12345",
  "user_email": "backend-dev@techcorp.com",
  "team_id": "team_backend",
  "action": "created",
  "resource": {
    "type": "mcp_server",
    "name": "custom-api-validator",
    "id": "mcp_server_67890"
  },
  "status": "success",
  "ip_address": "10.20.30.40",
  "user_agent": "Claude-Code/v2.1.77",
  "additional_context": {
    "approval_required": false,
    "auto_approved": true
  }
}
```

### Dashboard de auditoría

```
console.anthropic.com/audit-logs

Filtros:
- Por usuario/equipo
- Por evento
- Por rango fecha
- Por resultado (success/failure)

Exportar: CSV, JSON, Parquet

Alertas:
- > $500 gasto en 1 día
- Acceso denégado 5× en 1 hora
- API key creada/rotada
- Policy cambió
```

---

## 7. Compliance Checklist

```markdown
# Compliance Checklist — Claude Code Enterprise

## SOC 2 Type II

- [ ] Auditoría financiera completada
- [ ] Logs de acceso retenidos 12+ meses
- [ ] Cambios de policy documentados
- [ ] Incidentes de seguridad reportados
- [ ] Segregación de datos validada
- [ ] Cifrado en tránsito y en reposo configurado

## GDPR (si EU)

- [ ] Data Processing Agreement (DPA) firmado
- [ ] Datos EU almacenados en EU región
- [ ] Retención: 30 días máximo
- [ ] Right to be forgotten implementado
- [ ] Data breach notification plan

## HIPAA (si healthcare)

- [ ] Business Associate Agreement (BAA) firmado
- [ ] Datos de pacientes nunca a IA pública
- [ ] Auditoría completada
- [ ] Encryption estándar implementado

## ISO 27001 (si requerido)

- [ ] Information Security Policy aprobada
- [ ] Risk Assessment completado
- [ ] Incident Response plan documentado
- [ ] Staff training anual completado
```

---

## Resumen

**5 ideas clave:**
1. **Managed settings** centralizan políticas a escala
2. **Matriz RACI** clarifica quién decide qué
3. **AUP clara** previene violaciones
4. **Auditoría exhaustiva** para compliance
5. **Onboarding robusto** reduce riesgo

**Próximo:** Nivel 5 → Observabilidad y Monitoreo

---

## Referencia rápida

```
ROLES TÍPICOS:
- Admin: Crea policy, maneja billing, auditoría
- Team Lead: Aprueba MCP/Skills, gestiona budget
- Developer: Usa Claude Code, crea Skills
- Auditor: Revisa logs, reporte compliance

DATOS RESTRICTOS:
- NUNCA: passwords, tokens, PII
- CUIDADO: código propietario, estrategia
- OK: logs sanitizados, arquitectura

AUDITORÍA:
- Todos los accesos logged
- Retención: 1 año
- Alertas en: gasto anormal, acceso denegado
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 4-5.
