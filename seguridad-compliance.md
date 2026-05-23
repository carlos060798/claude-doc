# Seguridad & Compliance — Nivel 5

> GDPR implications. Data residency. SOC2 checklist. .claudeignore avanzado. Patrones de seguridad.

## Introducción

La seguridad es crítica. Esta sección cubre:

- GDPR, HIPAA, SOC2 implications
- Data residency y privacidad
- Patrones seguros de uso
- .claudeignore avanzado
- Auditoría y trazabilidad

**Tiempo estimado:** 90 minutos  
**Requisitos:** Conocimiento de compliance, security  
**Nivel de dificultad:** Avanzado

---

## 1. GDPR Implications

### Qué es GDPR

Regulación EU que protege datos personales (PII) de ciudadanos EU.

### Aplicable a ti si:

- ✓ Procesas datos de EU ciudadanos
- ✓ Tienes empleados en EU
- ✓ Clientes en EU
- ✓ Servidores en EU (incluso si empresa US)

### Restricciones con Claude Code

```yaml
GDPR:
  allowed:
    - ✓ Código sanitizado (sin PII)
    - ✓ Arquitectura, algoritmos
    - ✓ Análisis anónimo
    - ✓ Testing de lógica
  
  forbidden:
    - ✗ Nombres de usuarios EU
    - ✗ Emails, teléfonos, direcciones
    - ✗ Datos médicos/financieros
    - ✗ Biometría
  
  compliance_requirements:
    - Data Processing Agreement (DPA) con Anthropic
    - Data residency: EU region preferida
    - Retention: max 30 días
    - Right to be forgotten: implementado
    - Audit logs: 1 año mínimo
```

### Implementación segura

```python
# before.py ❌ GDPR VIOLATION
def debug_error():
    error_log = """
    User: john.smith@example.com
    Order: #12345 (€500)
    Payment: Visa ending 4242
    Error: Processing failed
    """
    claude_code.analyze(error_log)

# after.py ✅ GDPR COMPLIANT
def debug_error():
    error_log = """
    Error type: PaymentProcessing
    Amount: numeric (sanitized)
    Status: failed
    Error code: ERR_429_RATE_LIMIT
    """
    claude_code.analyze(error_log)
    # Guarda raw log en DB privada (no en IA)
```

---

## 2. Data Residency

### Dónde se almacenan datos

```
INPUT (Tu código)
├─ Transmisión: Encriptado TLS
├─ Almacenamiento: Servvidores Anthropic (US región por defecto)
└─ Retención: 30 días (GDPR), 90 días (default)

OUTPUT (Respuesta)
├─ Transmisión: Encriptado TLS
├─ Almacenamiento: Tu máquina (local)
└─ Logs: Console.anthropic.com (30-90 días)
```

### Cumplimiento regional

| Región | Requerimiento | Solución |
|--------|---|---|
| **EU (GDPR)** | Datos EU → EU servers | Usar EU endpoint si disponible |
| **HIPAA (US)** | Datos médicos protegidos | NO usar IA pública; usar on-premise |
| **CCPA (CA)** | Derechos de consumidor | DPA con Anthropic requerido |
| **UK (DPA 2018)** | Post-GDPR UK | Similar a GDPR |

### Configuración regional

```javascript
// eu-compliant.js
const claudeClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.eu.anthropic.com',  // EU endpoint
  defaultHeaders: {
    'X-Data-Residency': 'EU',
    'X-Retention-Days': '30'  // GDPR max
  }
});
```

---

## 3. SOC2 Checklist

### SOC2 Type II (Security, Availability, Integrity)

```markdown
# SOC2 Type II Checklist — Claude Code Usage

## Security (CC: Control Criteria)

### CC1: Access Control
- [ ] Solo employees autorizados acceden
- [ ] API keys rotadas cada 90 días
- [ ] No hardcoded secrets en código
- [ ] .gitignore + .claudeignore sincronizados

### CC2: Monitoring
- [ ] Logs de todo acceso a API
- [ ] Alertas si gasto anormal
- [ ] Audit trail 12 meses retención

### CC3: Encryption
- [ ] TLS en tránsito (validado)
- [ ] Sensitive data encriptado en rest

## Availability (A: Availability Criteria)

### A1: System Performance
- [ ] P95 latency monitoreado
- [ ] Fallback strategy si Claude Code down
- [ ] RTO/RPO documentados

## Integrity (PI: Processing Integrity)

### PI1: Error Prevention
- [ ] Validar salida de Claude Code
- [ ] Tests antes de producción
- [ ] Code review humano requerido

### PI2: Completeness
- [ ] Audit logs completos
- [ ] Nada se pierde o modifica sin log
```

### Alcance SOC2 típico

```
INCLUIR en auditoría:
✓ Claude Code como tool autorizado
✓ Access controls a console.anthropic.com
✓ Logs y monitoring
✓ Data handling practices

EXCLUIR:
✗ Calidad de recomendaciones (eso es QA)
✗ Hallucinations (inherente a IA)
✗ Modelo accuracy (Anthropic responsibility)
```

---

## 4. .claudeignore Avanzado

### Estructura jerarquica

```yaml
# .claudeignore (raíz proyecto)

# Nivel 1: Secretos absolutos
.env
.env.local
.env.*.local
secrets/
credentials.json
*.pem
*.key

# Nivel 2: Datos sensibles
data/
pii/
user_data/
**/private/**
config/production.json

# Nivel 3: Archivos grandes
node_modules/
dist/
.next/
build/
vendor/

# Nivel 4: Dependencias
*.lock
*.lock.json
package-lock.json

# Nivel 5: Archivos de build/temp
.DS_Store
*.tmp
*.log
.pytest_cache/
__pycache__/

# PATRONES AVANZADOS:

# Excepto: todas las .md EXCEPTO CHANGELOG
*.md
!CHANGELOG.md

# Todas las keys EXCEPTO public keys
**/api-key*
!**/public-key*

# Específico por directorio
tests/**/fixtures/user-*.json
tests/**/fixtures/!mock-data.json
```

### Validación

```bash
# Verificar qué se enviaría a Claude
claude-code --dry-run --show-context review src/app.ts

# Output:
# Files to be sent:
# ✓ src/app.ts (2.5KB)
# ✓ src/services/auth.ts (1.2KB)
# ✗ .env (IGNORED by .claudeignore)
# ✗ node_modules/ (IGNORED - too large)
```

---

## 5. Patrones Seguros de Uso

### Patrón 1: Sanitización de entrada

```javascript
// unsafe.js ❌
function reviewUserCode(githubPR) {
  const code = fetchPRContent(githubPR);
  // Código puede contener secrets si dev las pusheó
  claude.review(code);
}

// safe.js ✅
function reviewUserCode(githubPR) {
  const code = fetchPRContent(githubPR);
  
  // Sanitizar antes de enviar
  const sanitized = sanitizeSecrets(code, {
    patterns: [
      /api[_-]?key[\s:=]+['"]{0,1}[\w\-]{20,}['"]?/gi,
      /password[\s:=]+['"]{0,1}[\w\-]{8,}['"]?/gi,
      /https:\/\/[^\s]+@/g  // URLs con credenciales
    ],
    replacement: '***REDACTED***'
  });
  
  claude.review(sanitized);
}

function sanitizeSecrets(text, options) {
  let sanitized = text;
  options.patterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, options.replacement);
  });
  return sanitized;
}
```

### Patrón 2: Output validation

```javascript
// Validar que Claude no alucinó credenciales
function validateClaudeOutput(suggestion) {
  const forbidden = [
    /password/i,
    /api.?key/i,
    /secret/i,
    /token/i,
    /(https?):\/\/\w+:\w+@/,  // URLs with creds
  ];
  
  forbidden.forEach(pattern => {
    if (pattern.test(suggestion)) {
      throw new Error('Claude suggested sensitive data! Manual review required.');
    }
  });
  
  return suggestion;  // Safe
}
```

### Patrón 3: Approval workflow

```javascript
// Crítico: requerir aprobación humana
async function criticalChange(code) {
  const claudeSuggestion = await claude.refactor(code);
  
  // NO aplicar automáticamente
  // Requerir aprobación humana
  const approval = await requireApproval({
    title: 'Security-sensitive refactor',
    suggestion: claudeSuggestion,
    requiredApprovers: ['security@company.com'],
    maxWaitTime: '4 hours'
  });
  
  if (!approval.approved) {
    return { status: 'rejected' };
  }
  
  applyChanges(code, claudeSuggestion);
}
```

### Patrón 4: Audit trail

```javascript
// Loguear todo para auditoría
function auditClaudeCodeUsage(request, response) {
  const auditLog = {
    timestamp: new Date().toISOString(),
    user_id: request.user_id,
    action: 'claude_code_request',
    
    // Entrada (sin datos sensibles)
    input: {
      file_hash: hash(request.file),
      file_size: request.file.size,
      // NO incluir contenido si confidencial
    },
    
    // Output (validado)
    output_hash: hash(response),
    output_applied: response.applied,
    
    // Aprobación
    approval: {
      required: response.requires_approval,
      approved_by: response.approved_by || null,
      approval_time: response.approval_time || null
    },
    
    // Trazabilidad
    git_commit: getHeadCommit(),
    pr_number: getPRNumber()
  };
  
  // Guardar en inmutable log
  saveToImmutableLog(auditLog);
}
```

---

## 6. Compliance Checklist por Framework

### GDPR

- [ ] DPA con Anthropic firmado
- [ ] EU endpoint configurado
- [ ] Retention policy: 30 días max
- [ ] Right to be forgotten implementado
- [ ] Data breach notification plan
- [ ] Privacy policy actualizada
- [ ] Employee training completado

### HIPAA (Healthcare)

- [ ] NO usar IA pública para datos médicos
- [ ] Solution: On-premise o HIPAA-compliant
- [ ] BAA (Business Associate Agreement) requerido
- [ ] Encryption at rest y in transit
- [ ] Access logs 6 años retención

### SOC2

- [ ] Access control policy documentado
- [ ] API key rotation cada 90 días
- [ ] Monitoring y alertas activos
- [ ] Incident response plan
- [ ] Annual audit completado

### PCI DSS (si datos de pago)

- [ ] NUNCA enviar payment data a IA
- [ ] Tokens: OK (no números de tarjeta)
- [ ] Encryption requerida
- [ ] Compliance: anual

---

## 7. Incident Response para Data Breach

### Si sospechas que se envió data sensible:

```
PASO 1: CONTENCIÓN (ahora)
├─ Revocar API keys inmediatamente
├─ Cambiar contraseñas si comprometidas
└─ Notificar Anthropic privacy@anthropic.com

PASO 2: INVESTIGACIÓN (1 hora)
├─ Revisar audit logs
├─ Determinar qué data se envió
├─ Calcular scope y severidad
└─ Documentar timeline

PASO 3: NOTIFICATION (24 horas)
├─ Notificar reguladores (si GDPR: < 72 horas)
├─ Notificar clientes afectados
├─ Comunicado prensa (si grave)
└─ Legal review

PASO 4: REMEDIATION (1 semana)
├─ Actualizar .claudeignore
├─ Reentrenar equipo
├─ Auditoría de código existente
└─ Validar fixes
```

---

## Resumen

**5 ideas clave:**
1. **GDPR es real** — sanitizar datos SIEMPRE
2. **Data residency** importa para compliance
3. **.claudeignore** es tu defensa principal
4. **Audit trails** son requeridos
5. **Patrones seguros** previenen 99% issues

**Próximo:** Nivel 5 → Ética y Limitaciones

---

## Referencia rápida

```
SENSIBLE? SÍ → NUNCA ENVIES A CLAUDE CODE
├─ Passwords, API keys, tokens
├─ PII (nombres, emails, addresses)
├─ Payment data
└─ Medical records

SEGURO? → PUEDES ENVIAR (con cuidado)
├─ Código sanitizado
├─ Logs sin PII
├─ Architecure, algoritmos
└─ Mock data

VALIDATION CHECKLIST:
- [ ] .claudeignore updated
- [ ] Secrets NUNCA hardcoded
- [ ] Output validado antes de merge
- [ ] Audit log configurado
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 5.
