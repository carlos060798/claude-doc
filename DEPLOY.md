# 🚀 Guía de despliegue — Claude Code Mastery Guide

Tu proyecto está listo para desplegar. Elige la opción que prefieras:

## Opción 1: Vercel (⭐ Recomendado)

### Prerequisitos
- Cuenta en [vercel.com](https://vercel.com) (gratis)
- Git configurado localmente

### Pasos

#### 1A. Con CLI de Vercel (más rápido)
```bash
# Instala Vercel CLI
npm install -g vercel

# Navega a la carpeta del proyecto
cd "/Users/usuario/claude doc"

# Despliega (sigue los prompts)
vercel

# Una vez deployado, obtén tu URL:
# https://claude-code-mastery.vercel.app (ejemplo)
```

#### 1B. Con GitHub (recomendado para CI/CD)
```bash
# 1. Crea un repo en GitHub
# https://github.com/new
# Nombre: claude-code-mastery
# Descripción: Interactive SPA guide to mastering Claude Code

# 2. Configura el remoto local
git remote add origin https://github.com/TU_USERNAME/claude-code-mastery.git
git branch -M main
git push -u origin main

# 3. Conecta a Vercel
# https://vercel.com/new
# → Import from GitHub
# → Selecciona tu repo
# → Deploy (automático, ~30 segundos)
```

**Resultado**: Tu app estará en `https://claude-code-mastery.vercel.app` (o tu dominio custom)

---

## Opción 2: GitHub Pages

### Prerequisitos
- Cuenta en [github.com](https://github.com) (gratis)
- Git configurado localmente

### Pasos

```bash
# 1. Crea el repo en GitHub
# https://github.com/new
# Nombre: claude-code-mastery

# 2. Configura el remoto
git remote add origin https://github.com/TU_USERNAME/claude-code-mastery.git
git branch -M main
git push -u origin main

# 3. En GitHub: Settings → Pages
# → Source: Deploy from a branch
# → Branch: main / (root)
# → Save

# 4. Tu sitio estará en:
# https://TU_USERNAME.github.io/claude-code-mastery
```

**Ventaja**: Totalmente gratis, sin limite de bandwidth  
**Desventaja**: Menos features que Vercel (sin analytics, custom domains tienen límites)

---

## Opción 3: Netlify

### Pasos rápidos

```bash
# 1. Sign up en https://netlify.com

# 2. Crea el repo en GitHub (igual que arriba)

# 3. En Netlify: New site from Git
# → Connect GitHub
# → Selecciona tu repo
# → Build settings: (dejar en blanco, es estático)
# → Deploy

# Tu URL será:
# https://claude-code-mastery.netlify.app
```

---

## Comparativa

| Aspecto | Vercel | GitHub Pages | Netlify |
|---------|--------|--------------|---------|
| Costo | Gratis | Gratis | Gratis |
| Setup | 2 min | 3 min | 3 min |
| Performance | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Analytics | Sí (Pro) | No | Sí (Pro) |
| Custom domain | Sí | Sí ($ apuntación) | Sí |
| CI/CD automático | Sí | Limitado | Sí |
| **Recomendación** | ✅ | ✅ | ✅ |

---

## Verificar que todo funciona (post-despliegue)

```bash
# 1. Abre tu URL en el navegador
https://tu-url.vercel.app (o .netlify.app / .github.io)

# 2. Prueba las funciones clave:
✅ Carga correctamente (sin errores de 404)
✅ Ctrl+K abre buscador
✅ Clickea en "Nivel 1" → carga sección
✅ Selecciona un escenario terminal → "Ejecutar" anima
✅ En móvil: hamburguesa aparece y abre sidebar
✅ Links internos (#nivel-1, #nivel-2, etc.) funcionan

# 3. Si hay errores, abre DevTools (F12)
# Verifica la consola (Console tab) por errores JavaScript
```

---

## Actualizar contenido (post-despliegue)

### Local
```bash
# Edita archivos (index.html, script.js, etc.)
git add .
git commit -m "feat: nuevo contenido"
git push
```

### Automático en Vercel/Netlify/GitHub Pages
Tu sitio se actualiza automáticamente en ~1 minuto ✨

---

## Dominio custom (opcional)

### En Vercel
```
Settings → Domains → Add Domain
Luego en tu registrador (GoDaddy, Namecheap, etc.):
  CNAME → claude-code-mastery.vercel.app
```

### En GitHub Pages
```
Settings → Pages → Custom domain
Ingresa tu dominio (ej: claude-code.tech)
```

---

## Soporte & troubleshooting

**Problema**: "404 Not Found" en producción
→ Verifica que `index.html` está en la raíz

**Problema**: Assets (CSS, JS) no carga
→ Verifica rutas relativas (./styles.css, no /styles.css)

**Problema**: Buscador o terminal no funcionan
→ Abre F12 Console, busca errores JavaScript

**Problema**: Mobile sidebar no abre
→ Verifica viewport meta tag en index.html (debe estar)

---

## Siguiente paso recomendado

1. ✅ Elegir Vercel (opción 1B)
2. ✅ Crear repo en GitHub
3. ✅ Hacer push (git push)
4. ✅ Conectar a Vercel
5. ✅ Esperar ~30 segundos
6. ✅ Compartir URL con tu equipo 🎉

---

**¿Necesitas ayuda?**
- Vercel docs: https://vercel.com/docs
- GitHub Pages: https://pages.github.com
- Netlify docs: https://docs.netlify.com
