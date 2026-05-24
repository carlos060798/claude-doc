/* ===================================================================
   CLAUDE CODE MASTERY — MINIMAL SCRIPT
   Solo navegación básica entre secciones + helpers esenciales
   =================================================================== */

(() => {
    'use strict';

    /* ============================================================
       STORAGE & UTILS
       ============================================================ */
    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.hidden = false;
        if (showToast._t) clearTimeout(showToast._t);
        showToast._t = setTimeout(() => { toast.hidden = true; }, 2000);
    }

    function isLevelUnlocked(level) {
        try {
            const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
            return (progress.unlockedLevels || []).includes(level) || level === 1;
        } catch {
            return level === 1;
        }
    }

    /* ============================================================
       NAVEGACIÓN
       ============================================================ */
    function setupNavigation() {
        const links = document.querySelectorAll('.nav-link, [data-jump]');

        function goTo(sectionId) {
            const sections = document.querySelectorAll('.content-section:not(.hidden)');
            sections.forEach((s) => {
                s.classList.toggle('active', s.dataset.section === sectionId);
            });

            document.querySelectorAll('.nav-link').forEach((l) => {
                l.classList.toggle('active', l.dataset.section === sectionId);
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, '', `#${sectionId}`);
        }

        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = link.dataset.section || link.dataset.jump;
                if (!target) return;

                const level = parseInt(link.dataset.level);
                if (level && !isLevelUnlocked(level)) {
                    e.preventDefault();
                    showToast(`🔒 Desbloquea el Nivel ${level - 1} para acceder`);
                    return;
                }

                e.preventDefault();
                goTo(target);
            });
        });

        const initial = window.location.hash.slice(1);
        if (initial && document.querySelector(`[data-section="${initial}"]`)) {
            goTo(initial);
        } else {
            // Default: mostrar dashboard
            goTo('dashboard');
        }
    }

    /* ============================================================
       MODO TÉCNICO vs ACCESIBLE
       ============================================================ */
    function setupModeToggle() {
        const toggle = document.getElementById('mode-toggle');
        const label = document.getElementById('mode-label');
        if (!toggle) return;

        const currentMode = localStorage.getItem('viewMode') || 'technical';
        toggle.checked = currentMode === 'accessible';
        updateModeLabel();

        toggle.addEventListener('change', (e) => {
            const newMode = e.target.checked ? 'accessible' : 'technical';
            localStorage.setItem('viewMode', newMode);
            updateModeLabel();
            updateVisibility();
        });

        function updateModeLabel() {
            const mode = localStorage.getItem('viewMode') || 'technical';
            if (label) {
                label.textContent = mode === 'accessible' ? '♿ Accesible' : '🔧 Técnico';
            }
        }

        function updateVisibility() {
            const mode = localStorage.getItem('viewMode') || 'technical';
            document.querySelectorAll('[data-mode]').forEach((el) => {
                const elMode = el.dataset.mode;
                const show = elMode === 'both' || elMode === mode;
                el.style.display = show ? '' : 'none';
            });
        }
    }

    /* ============================================================
       HAMBURGUESA MÓVIL
       ============================================================ */
    function setupHamburger() {
        const btn = document.getElementById('hamburger-btn');
        const sidebar = document.querySelector('aside.sidebar');
        if (!btn || !sidebar) return;

        btn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            btn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ============================================================
       BUSCADOR
       ============================================================ */
    function setupSearch() {
        const input = document.getElementById('command-search');
        const results = document.getElementById('search-results');
        if (!input || !results) return;

        const allLinks = Array.from(document.querySelectorAll('.nav-link[data-section]')).map((el) => ({
            name: el.textContent.trim(),
            section: el.dataset.section,
        }));

        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.toLowerCase();

            if (!query) {
                results.hidden = true;
                return;
            }

            debounceTimer = setTimeout(() => {
                const matched = allLinks.filter((l) =>
                    l.name.toLowerCase().includes(query) || l.section.includes(query)
                );

                if (matched.length === 0) {
                    results.innerHTML = '<div style="padding:12px; color:var(--text-muted);">No hay resultados</div>';
                    results.hidden = false;
                    return;
                }

                results.innerHTML = matched.map((m) =>
                    `<button class="search-result-item" data-section="${m.section}">${m.name}</button>`
                ).join('');
                results.hidden = false;

                results.querySelectorAll('.search-result-item').forEach((btn) => {
                    btn.addEventListener('click', () => {
                        const target = btn.dataset.section;
                        document.querySelector(`.nav-link[data-section="${target}"]`)?.click();
                        results.hidden = true;
                        input.value = '';
                    });
                });
            }, 100);
        });

        document.addEventListener('click', (e) => {
            if (e.target !== input && !results.contains(e.target)) {
                results.hidden = true;
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                results.hidden = true;
                input.value = '';
            }
        });
    }

    /* ============================================================
       COPIADO DE CÓDIGO
       ============================================================ */
    function setupCopyButtons() {
        document.querySelectorAll('.code-block').forEach((codeEl) => {
            if (codeEl.querySelector('.copy-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = '📋 Copy';
            btn.title = 'Copiar al portapapeles';

            btn.addEventListener('click', () => {
                const text = codeEl.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    btn.textContent = '✓ Copiado';
                    setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
                });
            });

            codeEl.appendChild(btn);
        });
    }

    /* ============================================================
       INIT
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        setupModeToggle();
        setupNavigation();
        setupHamburger();
        setupSearch();
        setupCopyButtons();

        console.log(
            '%c Claude Code Mastery %c  Minimal script loaded',
            'background: #ff7a59; color: #1a0a05; padding: 4px 8px; border-radius: 4px; font-weight: 700;',
            'color: #9aa7b8;'
        );
    });
})();
