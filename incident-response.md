# Incident Response — Nivel 4

> Playbook de fallos. Rollback strategies. Post-mortem template. Escalation procedures. Root cause analysis.

## Introducción

Cuando Claude Code falla (alucinación, timeout, generado código buggy), necesitas proceso. Esta sección cubre:

- Playbook de fallos comunes
- Estrategias de rollback
- Root cause analysis
- Post-mortem template
- Escalation procedures

**Tiempo estimado:** 75 minutos  
**Requisitos:** Experiencia en incident response  
**Nivel de dificultad:** Avanzado

---

## 1. Playbook de Fallos Comunes

### Fallo 1: Code generado no compila

```
SÍNTOMA:
├─ Compile error tras mergear PR con código de Claude
├─ ej: "Cannot find module X" o "Syntax error line 42"

CAUSA RAÍZ (típica):
├─ Alucinación: import de librería no existente
├─ Cambio de API: Librería cambió v5→v6
├─ Versión incompleta: Faltó ver archivo completo

INCIDENT CLASSIFICATION:
├─ Severidad: MEDIUM (detectable en CI)
├─ Detectada por: CI pipeline
└─ Tiempo de detección: < 5 min

MITIGATION (< 5 min):
1. Revert commit inmediatamente
2. Notify author + reviewer
3. Log error para analysis

RESOLUTION (< 30 min):
1. Ejecutar Claude Code nuevamente
2. Especificar: "Verifica imports contra package.json"
3. Code review humano más cuidadoso
4. Re-merge

PREVENTION:
- Agregar linter pre-commit
- Require manual verification de imports
- Tests que fallan si imports break
```

### Fallo 2: Lógica genera output incorrecto

```
SÍNTOMA:
├─ Tests pasan localmente
├─ Production reporta cálculos incorrectos
├─ ej: "Price calculations off by 15%"

CAUSA RAÍZ (típica):
├─ Edge case no considerado
├─ Alucinación de fórmula
├─ Interpretación incorrecta de requisitos

INCIDENT CLASSIFICATION:
├─ Severidad: CRITICAL (data corruption risk)
├─ Detectada por: Usurio reporte o monitoring
└─ Tiempo de detección: 1-24 horas (!!!)

MITIGATION (ASAP):
1. ROLLBACK cambios
2. Kill feature toggle (si existe)
3. Notify customers si data afectada
4. Escalate a engineering lead + product

DIAGNOSIS (30-60 min):
1. Reproducir bug en staging
2. Identificar qué casos fallan
3. Comparar con antes/después
4. Root cause analysis

RESOLUTION (2-4 horas):
1. Claude Code: reanalizar requisitos
2. Generar test cases para edge cases
3. Fix lógica
4. Deploy con monitoring intenso
5. Validar con sample data

PREVENTION:
- Property-based testing (generar casos random)
- Before/after comparison tests
- Canary deploy (5% usuarios primero)
```

### Fallo 3: Performance regression

```
SÍNTOMA:
├─ API latencia: 200ms → 2000ms
├─ Memory: 100MB → 500MB
├─ Refactorización generada es ineficiente

CAUSA RAÍZ (típica):
├─ Loop donde debería haber índice
├─ N+1 query pattern introducido
├─ Alocación innecesaria de memoria

INCIDENT CLASSIFICATION:
├─ Severidad: HIGH (SLA risk)
├─ Detectada por: APM (Datadog, New Relic)
└─ Tiempo de detección: 1-5 min

MITIGATION (< 10 min):
1. Revert código
2. Latencia vuelve a normal
3. Notify oncall + architect

DIAGNOSIS (15-30 min):
1. Comparar código antes/después
2. Profile con benchmark
3. Identificar hotspot
4. Root cause: loop O(n²)?

RESOLUTION (1-2 horas):
1. Claude Code: "Optimiza este código O(n²) a O(n log n)"
2. Benchmark: Validar mejora
3. Code review arquitecto
4. Re-deploy con monitoring

PREVENTION:
- Benchmark antes/después (CI check)
- Performance budget en CI
- Staging environment tiene datos reales
```

### Fallo 4: Security issue

```
SÍNTOMA:
├─ SQL injection posible
├─ Credenciales en código
├─ CORS misconfigured

CAUSA RAÍZ (típica):
├─ Alucinación: input no sanitized
├─ Copy-paste de ejemplo inseguro
├─ No siguió security checklist

INCIDENT CLASSIFICATION:
├─ Severidad: CRITICAL (immediate threat)
├─ Detectada por: Security scanner o audit
└─ Tiempo de detección: 1 min - 1 semana (!!!)

MITIGATION (ASAP):
1. Revoke any exposed credentials
2. Assess damage scope
3. Patch inmediatamente
4. Notify security team
5. If exposed: notify regulatory (GDPR, etc)

DIAGNOSIS (immediately):
1. How was it introduced?
2. What was exposed?
3. For how long?

RESOLUTION (1-24 horas):
1. Patch código
2. Audit similar patterns (grep for vuln)
3. Security review antes de prod
4. Log access si vulnerable period
5. Deploy

PREVENTION:
- Security review MANDATORY para code gen
- Static analysis (bandit, semgrep)
- No hardcoded secrets ever
- .claudeignore redact sensibles
- Security checklist in CLAUDE.md
```

---

## 2. Rollback Strategies

### Estrategia 1: Simple revert (< 5 min downtime)

```bash
# Identificar commit problemático
git log --oneline | head -10
# abc1234 refactor: optimize code review

# Revert
git revert abc1234
git push

# Downtime: ~2 min (deployment)
# Complejidad: Baja
# Riesgo: Bajo (revierte exactamente)

# CONS:
# - Vuelves a viejo código (puede estar buggy también)
# - Git history confusa
```

### Estrategia 2: Feature flag (0 downtime)

```javascript
// config/features.json
{
  "claude_code_refactor": {
    "enabled": true,
    "percentage": 100  // Start at 5%, ramp up
  }
}

// index.js
const useNewRefactor = featureFlags.isEnabled('claude_code_refactor');
const processor = useNewRefactor ? newRefactoredCode : oldCode;

// Si falla:
// 1. Set percentage: 0
// 2. Deployments en otros servicios usan old code
// 3. 0 downtime
// 4. Fix bug mientras others use old code
```

### Estrategia 3: Database rollback (si applicable)

```sql
-- Si migración/schema cambió
BEGIN TRANSACTION;

-- Revert schema change
ALTER TABLE users DROP COLUMN new_field;

-- Restore data from backup
INSERT INTO users 
SELECT * FROM users_backup 
WHERE backup_date = '2026-05-20';

COMMIT;

-- Downtime: 1-5 min
-- Complejidad: Media
-- Riesgo: Data loss si mal hecho
```

### Matriz de Rollback

| Tipo | Uptime | Complejidad | Recomendado | Tiempo |
|------|--------|-------------|---|---|
| Git Revert | <5 min downtime | Baja | Bugs simples | 5 min |
| Feature Flag | 0 downtime | Media | Preferred | 1 min |
| DB Rollback | 1-5 min | Media | Si schema cambió | 10-30 min |
| Canary Rollback | 0 downtime | Alta | Gradual rollout | 5-30 min |

---

## 3. Root Cause Analysis (RCA)

### Template: 5 Whys

```
INCIDENT: Code refactoring introducido SQL injection

Why 1: ¿Por qué pasó code con SQL injection?
└─ Porque no pasó security review

Why 2: ¿Por qué no pasó security review?
└─ Porque asumimos Claude Code "sabe" seguridad

Why 3: ¿Por qué asumimos eso?
└─ Porque trabajó bien en 5 refactorizations previas

Why 4: ¿Por qué no previmos?
└─ Porque no teníamos security gate en CI/CD

Why 5: ¿Cómo prevenimos en futuro?
└─ Agregar security scanning automático + manual review obligatoria para queries
```

### Template: Fishbone (Cause & Effect)

```
                    ┌─ No security review
                    │
                    ├─ Alucinación: unsanitized input
INCIDENT: SQL       │
Injection       ────┼─ Bad timing (deadline pressure)
                    │
                    ├─ Falta testing edge cases
                    │
                    └─ .claudeignore no tenía ejemplos
```

### Reporte RCA

```markdown
# Root Cause Analysis — SQL Injection Incident

## Summary
SQL injection descubierta en POST /search endpoint el 2026-05-15.

## Timeline
- 2026-05-14 10:00 — Claude Code refactoriza query builder
- 2026-05-14 15:30 — Code merged (sin security review)
- 2026-05-15 08:15 — QA descubre en staging
- 2026-05-15 09:00 — Revert + incident declared
- 2026-05-15 14:00 — Fix + security review + re-deploy

## Root Causes
1. **Primary:** Security review no requerida (policy gap)
2. **Secondary:** CI/CD carece SAST scanning
3. **Tertiary:** Falta training en security de Claude Code

## Contributing Factors
- Deadline urgente en feature relacionada
- Assumption: Claude Code = seguro (false)
- Nueva codebase → reviewers no familiarizados

## Remediation (Immediate)
- ✅ Deploy fix con input sanitization
- ✅ Audit codebase para patrones similares
- ✅ Retroactivo penetration test

## Prevention (Long-term)
- ✅ Agregar semgrep rule para SQL injection
- ✅ Hacer security review MANDATORY para Claude Code
- ✅ Training: "Security-first Claude Code"
- ✅ Add to .claudeignore: ejemplos de unsafe patterns
```

---

## 4. Post-Mortem Template

```markdown
# Post-Mortem: Performance Regression Incident (2026-05-20)

## Incident Summary
- **Title:** API latency regression (200ms → 2000ms) post-refactor
- **Duration:** 45 minutos (05:15 - 06:00 UTC)
- **Severity:** MEDIUM
- **Detected By:** Datadog APM alertas
- **Resolved By:** Rollback commit

## Timeline
| Time | Event |
|------|-------|
| 05:00 | Deploy refactorización de Claude Code |
| 05:15 | Alerta: P95 latency > 1000ms |
| 05:20 | Oncall engineer contacted |
| 05:25 | Root cause identified: N+1 queries |
| 05:30 | Rollback iniciado |
| 05:35 | Rollback deployed, latency normal |
| 05:45 | Incident closed |
| 06:00 | Team notificado, RCA iniciado |

## Root Cause
Refactor generado por Claude Code introdujo N+1 pattern:
```javascript
// Antes: 1 query
users = User.find({active: true});

// Después: N queries (1 por usuario)
users = User.find({active: true});
users.forEach(u => {
  u.profile = getUserProfile(u.id);  // ← N queries!
});
```

## Impact
- **User Impact:** 45 min de latencia elevada
- **Customers Affected:** ~10% (depending on region)
- **Data Loss:** None
- **Revenue Impact:** ~$2K lost (estimated)

## Contributing Factors
1. Benchmark antes/después no requerido
2. Staging no usó data volume realista
3. Code review visual not detectó loop

## Remediation

### Immediate (< 4 horas)
- ✅ Rollback
- ✅ Revert Claude Code suggestion
- ✅ Run performance test suite locally

### Short-term (< 1 week)
- ✅ Implement proper N+1 detection (linter)
- ✅ Require benchmark as part of PR
- ✅ Update Claude Code prompt to mention N+1

### Long-term (< 1 month)
- ✅ Setup staging con production data (anonymized)
- ✅ APM benchmarking automated in CI
- ✅ Performance budget enforcement
- ✅ Architecture review para refactors >5%

## Lessons Learned
1. **Should not have:** Assumed Claude Code optimizations are always correct
2. **Should have:** Run benchmarks before deploy
3. **Could improve:** N+1 detection in linter
4. **Good:** Monitoring caught it quickly

## Action Items

| Owner | Task | Deadline |
|-------|------|----------|
| DevOps | Setup staging with prod data | 2026-05-27 |
| Platform | Add N+1 linter rule | 2026-05-25 |
| Security | Update Claude Code guidelines | 2026-05-28 |
| Engineering | Retrain on performance testing | 2026-05-29 |

## Approval
- **Incident Lead:** Sarah Chen (SRE)
- **Engineering Lead:** Michael Park
- **Product:** Reviewed 2026-05-20

---
**P.S.:** This is NOT a blame exercise. Goal is learning + prevention.
```

---

## 5. Escalation Procedures

### Escalation Matrix

```yaml
Severity Classification:

SEVERITY 1 (CRITICAL):
├─ Criteria: Data loss, security breach, >1h downtime
├─ Page: On-call engineer (immediately)
├─ Notification: CTO, VP Engineering
├─ Update cadence: Every 15 min
├─ RCA: Required within 24h

SEVERITY 2 (HIGH):
├─ Criteria: 30-60 min downtime, performance issue
├─ Page: Team lead
├─ Notification: Engineering lead, PM
├─ Update cadence: Every 30 min
├─ RCA: Required within 48h

SEVERITY 3 (MEDIUM):
├─ Criteria: <30 min impact, non-critical issue
├─ Page: NO (unless oncall decides)
├─ Notification: Team lead
├─ Update cadence: As needed
├─ RCA: Optional

SEVERITY 4 (LOW):
├─ Criteria: No user impact, future prevention
├─ Notification: None (may log)
├─ RCA: Not required
```

### Escalation Flowchart

```
New incident
    │
    ├─ ¿Usuarios afectados? 
    │  └─ SÍ: Severity 1-3
    │  └─ NO: Severity 4
    │
    ├─ ¿Cuántos usuarios?
    │  ├─ >10% o datos críticos → SEV 1
    │  ├─ 1-10% → SEV 2
    │  └─ <1% → SEV 3
    │
    ├─ ¿Downtime?
    │  ├─ >1h → Escalar
    │  ├─ 30-60m → Notificar
    │  └─ <30m → Log
    │
    └─ Page on-call si SEV 1-2
```

---

## 6. Communication During Incident

### Status Updates (Public)

```
**[SEV 2] API Performance Issue - 2026-05-20 05:15 UTC**

**Status:** INVESTIGATING
**Duration:** 10 minutes
**Impact:** Elevated latency on all endpoints

We are investigating elevated latency. More details soon.
```

→ Update every 15 min

### Post-Incident Communication

```
**[RESOLVED] API Performance Issue**

**Timeline:**
- Detected: 2026-05-20 05:15 UTC
- Resolved: 2026-05-20 06:00 UTC
- Duration: 45 minutes

**Root Cause:** N+1 database query pattern in refactored code

**Impact:** ~45K requests delayed by 1-2 seconds each

**What We're Doing:**
- Rolled back problematic code
- Implementing automated benchmarking
- Conducting root cause analysis

Apologies for the disruption. Full post-mortem within 24 hours.
```

---

## Resumen

**5 ideas clave:**
1. **Playbook** (no improvisation)
2. **Fast rollback** (feature flags > git revert)
3. **RCA rigorous** (5 Whys)
4. **Post-mortem blameless** (focus learning)
5. **Escalation clear** (who pages who)

**Próximo:** Nivel 4 → Labs Prácticos

---

## Referencia rápida

```
INCIDENT CLASSIFICATION:
- SEV 1: Data loss, security, >1h downtime → Page oncall ASAP
- SEV 2: 30-60m downtime, perf issue → Notify lead
- SEV 3: <30m, non-critical → Log
- SEV 4: No user impact → Fix in next sprint

ROLLBACK STRATEGIES:
1. Git revert (< 5 min) - simple bugs
2. Feature flag (0 downtime) - preferred
3. DB rollback - si schema cambió

RCA TEMPLATE:
- Timeline (exact)
- Root cause (5 Whys)
- Impact (users, data)
- Remediation (immediate + long-term)
- Lessons learned
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 4.
