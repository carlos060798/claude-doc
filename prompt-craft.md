# Prompt Craft Básico — Nivel 1

> Estructura efectiva de prompts. 10 templates reutilizables. Errores comunes y ejercicios interactivos.

## Introducción

Los mejores resultados de Claude Code vienen de prompts bien estructurados. En esta sección aprenderás a escribir prompts que maximicen la precisión y minimicen iteraciones innecesarias.

**Tiempo estimado:** 45 minutos  
**Requisitos:** Ninguno (nivel introductorio)  
**Recursos:** Templates descargables, checklist de validación

---

## 1. Estructura Efectiva de Prompts

### Formula 3-Parte (Contexto + Tarea + Formato)

#### Parte 1: Contexto (15-30% del prompt)
Proporciona información que Claude necesita para entender el entorno:

```
Estoy desarrollando una API REST en Node.js con Express.
El equipo usa TypeScript y ESLint.
El proyecto debe cumplir con SonarQube score >= 85.
```

**Qué incluir:**
- Stack tecnológico
- Restricciones (performance, seguridad, compliance)
- Audiencia final
- Dependencias existentes
- Limitaciones conocidas

#### Parte 2: Tarea (50-70% del prompt)
Describe claramente QUÉ necesitas hacer:

```
Necesito crear un endpoint POST /users que:
1. Valide email con regex RFC 5322
2. Hash contraseña con bcrypt (rounds: 12)
3. Almacene en PostgreSQL usando Prisma
4. Retorne {id, email, createdAt} (sin password)
5. Maneje errores: email duplicado (409), validación (400), BD (500)
```

**Características:**
- Usa números o bullet points
- Incluye edge cases
- Especifica formatos esperados
- Enumera validaciones

#### Parte 3: Formato (10-20% del prompt)
Define exactamente cómo quieres la respuesta:

```
Entrega:
- Código TypeScript con JSDoc
- Unit tests con Jest
- Ejemplo cURL
- Matriz de errores

NO incluyas:
- Explicación teórica larga
- Código boilerplate innecesario
- Migración de BD
```

### Ejemplo Completo

```
# CONTEXTO
Proyecto: Dashboard de analytics
- React 19 + TypeScript
- Vite (build: <500ms)
- UI: Shadcn/ui + Tailwind
- Tests: Vitest + React Testing Library
- Constraint: Bundle < 150KB gzipped

# TAREA
Crear componente <MetricCard> que:
1. Acepte props: {label, value, trend, unit?}
2. Muestre ícono coloreado (verde: ↑, rojo: ↓)
3. Calcule diferencia %: (trend / value * 100).toFixed(1)
4. Responsive: stacked en móvil (<640px)
5. A11y: aria-label, role="status"

# FORMATO
Entrega:
- Component + types
- 4 snapshot tests
- Storybook story
- Accesibilidad: lighthouse >= 95

Códigos cortos, sin explicación narrativa.
```

---

## 2. Diez Templates Reutilizables

### Template 1: Crear componente/módulo

```
CONTEXTO: [Stack tecnológico]

NOMBRE: [nombre del componente/módulo]

RESPONSABILIDAD:
- [Lo que DEBE hacer]
- [Lo que NO debe hacer]

ENTRADA:
[Props, parámetros, tipos]

SALIDA:
[Return type, formato de respuesta]

FORMATO:
[Código + tests + docs]
```

### Template 2: Refactorizar código

```
CÓDIGO ACTUAL:
[Pega aquí o describe función]

PROBLEMAS OBSERVADOS:
1. [Rendimiento / legibilidad / duplicación]
2. [Dependencias circulares / mocking difícil]
3. [Tipo de issue #1]

RESTRICCIONES:
- [Mantener API pública]
- [Sin cambiar base de datos]
- [Compatible con Node 18+]

OBJETIVO:
[Mejorar X, reducir Y, agregar Z]

ENTREGA:
[Código refactorizado + tests + diff resumido]
```

### Template 3: Investigar/Analizar

```
PREGUNTA:
[¿Cómo optimizar X? ¿Qué patrón usar para Y?]

CONTEXTO:
- [Estado actual / problema específico]
- [Restricciones / requisitos]
- [Intentos previos (si aplica)]

ESCALA:
- [Pequeña: < 10 líneas]
- [Mediana: módulo de 100-500 líneas]
- [Grande: sistema con 3+ componentes]

ENTREGAR:
[Recomendaciones resumidas + código ejemplo + trade-offs]
```

### Template 4: Debug/Solucionar error

```
ERROR OBSERVADO:
[Mensaje de error exacto / comportamiento anómalo]

PASOS PARA REPRODUCIR:
1. [Paso 1]
2. [Paso 2]

ENTORNO:
- Node: 18.x
- OS: macOS Sonoma
- Browser: Chrome 125

CÓDIGO RELEVANTE:
[Fragmento donde falla]

QUÉ ESPERAS:
[Comportamiento deseado]

ENTREGA:
[Root cause + fix + test que valide]
```

### Template 5: Integración/Conectar sistemas

```
SISTEMA A: [descripción]
SISTEMA B: [descripción]

FLUJO REQUERIDO:
1. [Evento dispara en A]
2. [A envía datos a B]
3. [B procesa y retorna]

DATOS A TRANSFERIR:
[Estructura JSON/schema]

MANEJO DE ERRORES:
- [Timeout: X segundos]
- [Reintentos: Y veces]
- [Fallback: Z comportamiento]

ENTREGA:
[Código de integración + error handling + tests]
```

### Template 6: Optimización/Performance

```
MÉTRICA ACTUAL:
- Load time: 5.2s
- Memory: 450MB
- Bundle: 280KB gzipped

MÉTRICA OBJETIVO:
- Load time: < 2s
- Memory: < 200MB
- Bundle: < 100KB

RESTRICCIONES:
[No cambiar librerías, mantener funcionalidad]

CÓDIGO BASE:
[Archivo/función a optimizar]

ENTREGA:
[Cambios ordenados por impacto + antes/después métricas]
```

### Template 7: Documentación/Ejemplos

```
CÓDIGO/CONCEPTO A DOCUMENTAR:
[Función, clase, patrón]

AUDIENCIA:
[Junior devs, arquitectos, devops, etc]

INCLUIR:
- [Ejemplos reales de uso]
- [Edge cases comunes]
- [Errores típicos a evitar]

FORMATO:
[README.md, JSDoc inline, wiki page]

ENTREGA:
[Documentación + 3 ejemplos ejecutables]
```

### Template 8: Testing

```
FUNCIÓN/COMPONENTE A TESTEAR:
[Nombre y ubicación]

CASOS CRÍTICOS:
- [Happy path]
- [Edge case 1]
- [Error scenario]

FRAMEWORK:
[Jest, Vitest, Playwright]

COBERTURA OBJETIVO:
[Líneas: %, Branches: %, Funciones: %]

ENTREGA:
[Tests + reporte cobertura]
```

### Template 9: Arquitectura/Diseño

```
PROBLEMA:
[Qué estructura necesitamos]

ESCALA ESPERADA:
- [Usuarios / eventos / requests / datos]

RESTRICCIONES:
- [Latencia máxima]
- [Budget de infraestructura]
- [Compliance / datos sensibles]

ALTERNATIVAS CONSIDERADAS:
1. [Opción A: Ventajas / Desventajas]
2. [Opción B: Ventajas / Desventajas]

ENTREGA:
[Diagrama ASCII + decisiones + checklist implementación]
```

### Template 10: Migración/Upgrade

```
VERSIÓN ACTUAL: [v1.2.3]
VERSIÓN TARGET: [v2.0.0]

CAMBIOS BREAKING:
[Lista de APIs que cambiaron]

CÓDIGO A MIGRAR:
[Ubicación de archivos]

RIESGOS IDENTIFICADOS:
- [Risk 1: mitigation]
- [Risk 2: mitigation]

ENTREGA:
[Plan de migración + código migrado + test suite + rollback plan]
```

---

## 3. Errores Comunes en Prompts

### ❌ Error 1: Vago o incompleto

**Mal:**
```
Crea un botón bonito
```

**Bien:**
```
Componente React <PrimaryButton> que:
- Background: #3B82F6, hover: #1E40AF
- Padding: 12px 16px
- Fuente: 14px, peso 600
- Radio: 8px
- Accesible: aria-label, focus ring visible
- Props: {onClick, disabled?, children, variant?: 'primary'|'secondary'}
```

### ❌ Error 2: Demasiado contexto innecesario

**Mal:**
```
Hace 3 años empecé este proyecto. Usé React originalmente porque pensé que sería fácil.
Luego agregué TypeScript porque el equipo insistió. Ahora tenemos 200+ componentes.
¿Cómo mejoro este? [5000 líneas de código]
```

**Bien:**
```
React 19 + TS. 200+ componentes. Performance: FCP 3.5s (objetivo < 2s).
Fichero problema: src/components/Dashboard.tsx (850 líneas).
Necesito refactorizar para mejorar FCP. 

ENTREGA: Cambios específicos ordenados por impacto.
```

### ❌ Error 3: Formato de respuesta ambiguo

**Mal:**
```
Hazme un script que descargue datos de la API
```

**Bien:**
```
Script Node.js que:
- Lea archivo JSON (config.json) con {apiUrl, apiKey, batchSize}
- Descargue en batches de 100 registros
- Guarde en CSV: id,name,email,status,created_at
- Log cada 100 registros descargados
- Reintente fallos hasta 3 veces con exponential backoff

ENTREGA: script.js ejecutable + archivo config.example.json
```

### ❌ Error 4: Mezclar múltiples tareas

**Mal:**
```
Necesito:
1. Crear API REST
2. Diseñar BD
3. Hacer frontend
4. Configurar deploy
5. Escribir tests
```

**Bien:**
```
[PRIMERA SESIÓN - Scope: Etapa 1 de 4]

TAREA: Especificación de API REST
- Endpoints GET/POST/PUT/DELETE
- Validaciones
- Códigos de error

ENTREGA: OpenAPI 3.0 spec (YAML)
```

### ❌ Error 5: Expectativas poco realistas

**Mal:**
```
Necesito una app tipo Spotify completa en 1 hora
```

**Bien:**
```
Prototipo de reproductor que:
- Carga track JSON con {titulo, artista, duración, url}
- Play/pause/next/previous
- Barra de progreso interactiva
- Responsive móvil

ESCALA: ~200 líneas React
TIEMPO: 30 min
```

---

## 4. Mini-Ejercicio Interactivo

### Ejercicio 1: Estructura básica

**Consigna:**
Tienes este prompt mal escrito:
```
Quiero un formulario. Hazlo bonito y que funcione.
```

**Tu tarea:**
Reescribe usando la estructura Contexto + Tarea + Formato.

**Ejemplo de solución:**
```
CONTEXTO:
React 19 + TypeScript, Tailwind CSS, Form library: React Hook Form

TAREA:
Formulario login que:
1. Campos: email (RFC 5322), password (min 8 chars)
2. Validación real-time
3. Submit deshabilitado hasta válido
4. Error messages rojas bajo campo inválido
5. Loading spinner durante request
6. Redirect a /dashboard si éxito

FORMATO:
- Component <LoginForm> exportable
- Types para props
- Manejo de errores API
- Jest tests para validación
```

### Ejercicio 2: Elegir template correcto

**Consigna:**
Tienes estos 4 escenarios. Elige qué template uses:

1. "Mi app está lenta, FCP es 8s, necesito bajar a 3s"
   → Template: **Template 6 (Optimización)**

2. "¿Cómo manejo sincronización offline-online?"
   → Template: **Template 3 (Investigar)**

3. "Necesito un botón que abre modal"
   → Template: **Template 1 (Crear componente)**

4. "Error: Cannot read property 'map' of undefined en línea 42"
   → Template: **Template 4 (Debug)**

### Ejercicio 3: Revisar y mejorar

**Prompts para revisar:**

```
PROMPT 1:
"Crea un hook para manejar estado global"

PUNTUACIÓN: 2/10
ISSUES:
- Sin contexto (qué estado, qué escala)
- Sin formato esperado
- Sin restricciones

MEJORA:
"Hook useAppStore para aplicación de chat.
Estado: {messages[], users[], currentUser, loading}
Debe soportar 10k+ messages sin lag.
Entrega: Hook exportable + ejemplos de uso"
```

---

## 5. Checklist: Antes de Enviar un Prompt

- [ ] ¿Incluye contexto técnico (stack, versiones)?
- [ ] ¿La tarea está clara en 2-3 puntos principales?
- [ ] ¿Define formato exacto de respuesta esperada?
- [ ] ¿Menciona restricciones o límites?
- [ ] ¿Evita ambigüedad o múltiples interpretaciones?
- [ ] ¿Es conciso pero completo (ideal 100-300 palabras)?
- [ ] ¿Incluye ejemplos si la tarea es compleja?
- [ ] ¿Si es investigación, define "escala" de respuesta?
- [ ] ¿Evita "hazme todo", enfocándose en una tarea?
- [ ] ¿Si hay código, está en bloque ```lang?

---

## 6. Recursos y Templates Descargables

### Descarga los 10 templates en Markdown:
```
/descargar-templates/prompt-craft-nivel1.zip
```

Contiene:
- `template-1-crear-componente.md`
- `template-2-refactorizar.md`
- ... (8 templates más)
- `checklist-antes-enviar.txt`
- `ejemplos-reales-por-framework.md`

---

## Resumen

**3 ideas clave:**
1. **Contexto → Tarea → Formato** es la estructura ganadora
2. **10 templates** cubren 90% de casos reales
3. **Checklist de 10 preguntas** evita 95% de prompts deficientes

**Siguiente:** Nivel 1 → Decisión Framework (cuándo usar Claude Code)

---

## Mapa del Nivel 1

```
├─ Prompt Craft Básico (estás aquí) ✓
├─ Decision Framework (próximo)
├─ Fundamentos de CLI
├─ MCP (Model Context Protocol) intro
└─ Primeras Habilidades
```

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 1.
