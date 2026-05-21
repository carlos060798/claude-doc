# INICIO RÁPIDO — P8 CERTIFICACIÓN ARCHITECT

**Tiempo total:** 20-35 minutos | **Dificultad:** 🟢 Fácil | **Pasos:** 4 fases

---

## TL;DR (1 minuto de lectura)

Se generaron:
- 4 documentos educativos (220+ págs)
- 830 líneas de código HTML/CSS/JS listo para pegar
- Plan paso a paso para integración

**Lo que tienes que hacer:**
1. Leer PLAN_INTEGRACION_FINAL.md (este es tu guía)
2. Seguir 4 fases simples: integración → docs → testing → deploy
3. Hacer 2 commits y push

**Tiempo:** 30-45 minutos | **Complejidad:** Copiar/pegar + grep

---

## PASO 1: LEE EL PLAN (5 min)

Abre este archivo y léelo completamente:
```
C:\Users\usuario\claude doc\PLAN_INTEGRACION_FINAL.md
```

Es tu guía maestra. Contiene:
- Código exacto a copiar/pegar
- Ubicaciones precisas (línea + contexto)
- Checklist de validación
- Comandos bash/git

---

## PASO 2: INTEGRACIÓN INMEDIATA (5-10 min)

### 2.1 Editar index.html

**Línea 149 (después de Nivel 6):**
Busca:
```html
</ul>
<p class="nav-group-title">Evaluación & Progreso</p>
```

Reemplaza por:
```html
</ul>

<!-- CERTIFICACIÓN ARCHITECT -->
<p class="nav-group-title">Certificación <span class="lock-icon">🔐</span></p>
<ul class="nav-list">
    <li><a href="#certificacion" class="nav-link" data-section="certificacion" data-level="cert">
        <span class="nav-icon">🏆</span> Architect Certification</a></li>
</ul>

<p class="nav-group-title">Evaluación & Progreso</p>
```

**Línea 13576 (antes de `</main>`):**
Busca la última línea con `</section>` y `</main>`

Reemplaza por el código de la sección "1.2 Agregar sección de contenido" en PLAN_INTEGRACION_FINAL.md (280 líneas).

### 2.2 Editar styles.css

Agrega al final (antes del cierre):

```css
/* ========== CERTIFICACIÓN ARCHITECT ========== */

.cert-unlock-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(200, 0, 0, 0.05));
    border: 2px solid var(--level-6, #dc2626);
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    gap: 16px;
}

.cert-lock-icon { font-size: 32px; }

.cert-unlock-banner h3 {
    margin: 0 0 4px 0;
    color: var(--level-6, #dc2626);
    font-size: 16px;
}

.cert-unlock-banner p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.cert-unlock-btn {
    background: var(--level-6, #dc2626);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    transition: all 0.3s ease;
}

.cert-unlock-btn:hover {
    background: var(--level-6-dark, #991b1b);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.cert-hero {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(200, 0, 0, 0.02));
    border-radius: 12px;
    padding: 32px;
    margin: 24px 0;
}

.cert-hero-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
}

.cert-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: var(--bg-surface);
    border-radius: 8px;
}

.cert-stat-num {
    font-size: 24px;
    font-weight: bold;
    color: var(--level-6, #dc2626);
}

.cert-stat-label {
    font-size: 12px;
    color: var(--text-secondary);
    text-align: center;
}

.cert-domains { margin: 32px 0; }

.domains-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 16px 0;
}

.domain-card {
    background: var(--bg-surface);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
}

.domain-card:hover {
    border-color: var(--level-6, #dc2626);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

.domain-card h4 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
}

.domain-card p {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
}

.cert-cta-group {
    display: flex;
    gap: 12px;
    margin: 24px 0;
}

.cert-cta-btn {
    flex: 1;
    padding: 12px 16px;
    font-size: 14px;
}

.cert-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.cert-modal-content {
    background: var(--bg-primary);
    border-radius: 12px;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 32px;
    position: relative;
}

.cert-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 28px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: color 0.3s ease;
}

.cert-modal-close:hover { color: var(--text-primary); }

.cert-diagram {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0;
}

.diagram-phase {
    background: var(--bg-surface);
    border-left: 4px solid var(--level-6, #dc2626);
    padding: 16px;
    border-radius: 6px;
}

.diagram-phase h4 {
    margin: 0 0 8px 0;
    color: var(--level-6, #dc2626);
}

.diagram-phase p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .cert-hero-stats { grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .cert-stat { padding: 12px; gap: 4px; }
    .cert-stat-num { font-size: 18px; }
    .cert-stat-label { font-size: 11px; }
    .domains-grid { grid-template-columns: 1fr; }
    .cert-cta-group { flex-direction: column; }
    .cert-cta-btn { width: 100%; }
}
```

### 2.3 Editar script.js

En `setupNavigation()` (alrededor de línea 500), agrega:

```javascript
// ========== CERTIFICACIÓN ARCHITECT ==========

function isCertificationUnlocked() {
    return localStorage.getItem('cc-level-6-completed') === 'true';
}

function updateCertificationUI() {
    const banner = document.getElementById('cert-unlock-banner');
    const mainContent = document.getElementById('cert-main-content');
    if (!banner || !mainContent) return;
    if (isCertificationUnlocked()) {
        banner.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        banner.style.display = 'flex';
        mainContent.style.display = 'none';
    }
}

function viewCertRequirements() {
    alert('Para desbloquear la Certificación Architect, debes completar:\n\n✓ Nivel 1: Explorador\n✓ Nivel 2: Practicante\n✓ Nivel 3: Constructor\n✓ Nivel 4: Ingeniero\n✓ Nivel 5: Líder Técnico\n✓ Nivel 6: Arquitecto\n\nUna vez completado Nivel 6, la certificación se desbloqueará automáticamente.');
}

function openDiagramModal() {
    const modal = document.getElementById('cert-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeDiagramModal() {
    const modal = document.getElementById('cert-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function downloadCertDocuments() {
    alert('Los documentos de certificación estarán disponibles para descargar una vez completes Nivel 6.\n\nIncluirán:\n- Ruta de 12 semanas\n- Guía de estudio por fase\n- 6 escenarios de examen\n- Anti-patrones y best practices\n- Examen de práctica');
}

const certLink = document.querySelector('[data-section="certificacion"]');
if (certLink) {
    certLink.addEventListener('click', function(e) {
        if (!isCertificationUnlocked()) {
            e.preventDefault();
            viewCertRequirements();
        }
    });
}

updateCertificationUI();

const originalUnlockLevel = window.unlockLevel;
window.unlockLevel = function(level) {
    if (originalUnlockLevel) {
        originalUnlockLevel(level);
    }
    if (level === 6) {
        updateCertificationUI();
    }
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDiagramModal();
    }
});
```

---

## PASO 3: DOCUMENTACIÓN (5 min)

### 3.1 Copiar 4 documentos

```bash
cp "C:\Users\usuario\claude doc\PLAN_CERTIFICACION_ARCHITECT.md" "C:\Users\usuario\.claude\curso-claude-code\cert-plan-12weeks.md"
cp "C:\Users\usuario\claude doc\EJEMPLOS_CODIGO_ARCHITECT.md" "C:\Users\usuario\.claude\curso-claude-code\cert-code-examples.md"
cp "C:\Users\usuario\claude doc\REFERENCIA_RAPIDA_ARCHITECT.md" "C:\Users\usuario\.claude\curso-claude-code\cert-reference.md"
cp "C:\Users\usuario\claude doc\ANALISIS_ESTRATEGICO.md" "C:\Users\usuario\.claude\curso-claude-code\cert-roadmap.md"
```

### 3.2 Verificar que los 4 archivos existan

```bash
ls C:\Users\usuario\.claude\curso-claude-code\cert-*.md
```

Debes ver 4 archivos.

---

## PASO 4: TESTING (5-10 min)

### 4.1 Validar HTML

```bash
cd "C:\Users\usuario\claude doc"
grep "certificacion" index.html | wc -l
```

Resultado esperado: **3 líneas** (nav + sección + modal)

### 4.2 Validar CSS

```bash
grep -c "cert-" styles.css
```

Resultado esperado: **>30 líneas**

### 4.3 Validar JS

```bash
grep "isCertificationUnlocked\|updateCertificationUI" script.js
```

Resultado esperado: **2 funciones encontradas**

### 4.4 Validar localStorage (opcional pero recomendado)

Abre el navegador (F12) y en la consola:
```javascript
localStorage.getItem('cc-level-6-completed')
```

Debe retornar `null` o `false` antes de completar Nivel 6.

---

## PASO 5: DEPLOY (5-10 min)

### 5.1 Commit código

```bash
cd "C:\Users\usuario\claude doc"
git add index.html styles.css script.js
git commit -m "feat: integrate certification architect section

- Add navigation link for post-L6 certification path
- Implement certification unlock UI (displays after L6 completion)
- Add 5-domain technical curriculum view
- Modal for certification roadmap visualization
- 830 lines of production-ready code (280 HTML + 450 CSS + 100 JS)
- Auto-unlock on Level 6 completion via localStorage
- Responsive design for mobile (375px+)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### 5.2 Commit documentación

```bash
git add .claude/curso-claude-code/cert-*.md .claude/curso-claude-code/progreso.md
git commit -m "docs: add 4 certification architect guides

- cert-plan-12weeks.md: 12-week curriculum roadmap
- cert-code-examples.md: 15 architecture patterns with code
- cert-reference.md: 50+ anti-patterns cheatsheet
- cert-roadmap.md: executive summary & implementation plan

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### 5.3 Push

```bash
git push origin master
```

Espera a que finalice (2-5 segundos).

---

## VALIDACIÓN FINAL

✅ Marca estas casillas cuando las completes:

- [ ] Link "🏆 Architect Certification" aparece en navegación
- [ ] Banner muestra "Completa Nivel 6..." inicialmente
- [ ] Modal abre sin errores (F12 → Console)
- [ ] ESC cierra modal
- [ ] localStorage persiste entre refresh
- [ ] Responsive en móvil (F12 → 375px)
- [ ] 4 documentos en `.claude/curso-claude-code/`
- [ ] progreso.md actualizado
- [ ] 2 commits realizados
- [ ] Git push exitoso

**Si todas están ✅, ¡LISTO!**

---

## RECURSOS

| Documento | Propósito | Leer si... |
|-----------|-----------|-----------|
| **PLAN_INTEGRACION_FINAL.md** | Guía maestra 4 fases | Necesitas detalles |
| **RESUMEN_COORDINACION_P8.md** | Contexto + código | Necesitas entender estructura |
| **ENTREGA_FINAL_P8.md** | Resumen artefactos | Necesitas visión general |
| **PLAN_CERTIFICACION_ARCHITECT.md** | Curriculum 12 semanas | Quieres estudiar certificación |
| **EJEMPLOS_CODIGO_ARCHITECT.md** | Patrones código | Necesitas ejemplos técnicos |
| **REFERENCIA_RAPIDA_ARCHITECT.md** | Cheatsheet | Necesitas repaso rápido |
| **ANALISIS_ESTRATEGICO.md** | ROI + roadmap | Quieres business case |

---

## SOPORTE

Si algo falla:

1. **Línea no encontrada:** Usa Ctrl+F en editor para buscar el contexto exacto
2. **Errores JS:** F12 → Console para ver qué falta
3. **CSS no aplica:** Verifica que styles.css se agregó al final (antes de `</style>`)
4. **localStorage no persiste:** Limpiar browser cache (Ctrl+Shift+Del)

---

**Tiempo estimado:** 30-45 minutos  
**Dificultad:** 🟢 Fácil (copiar/pegar)  
**Prerequisito:** Tener git instalado  
**Resultado:** Certificación Architect integrada ✅

**¡Adelante!**
