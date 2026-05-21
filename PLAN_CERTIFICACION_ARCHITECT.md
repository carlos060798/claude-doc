# 🏗️ Plan de Certificación: Claude Certified Architect

**Versión:** 1.0  
**Última actualización:** 21 de mayo de 2026  
**Duración total:** 12 semanas (1 hora/día)  
**Objetivo:** Dominar arquitectura escalable con agentes de IA

---

## 📋 Tabla de Contenidos

1. [Dominios de Competencia](#dominios-de-competencia)
2. [Estructura de Fases](#estructura-de-fases)
3. [Plan Semana por Semana](#plan-semana-por-semana)
4. [Escenarios de Examen](#escenarios-de-examen)
5. [Anti-patrones Arquitectónicos](#anti-patrones-arquitectónicos)
6. [Puntos Clave por Módulo](#puntos-clave-por-módulo)
7. [Checkpoints de Progreso](#checkpoints-de-progreso)

---

## 🎯 Dominios de Competencia

### 1. **Agentic Loops (Bucles Agénticos)**
#### Competencias esperadas:
- ✅ Diseño de ciclos de retroalimentación automáticos
- ✅ Implementación de patrones de razonamiento iterativo
- ✅ Control de estados transicionales en agentes
- ✅ Optimización de convergencia y evitar bucles infinitos
- ✅ Manejo de fallos en ciclos de ejecución

#### Componentes:
- Arquitectura de bucles: percepción → decisión → acción
- Mecanismos de parada (halt conditions)
- Retroalimentación y ajustes dinámicos
- Escalabilidad de agentes concurrentes

---

### 2. **Tool Design (Diseño de Herramientas)**
#### Competencias esperadas:
- ✅ Especificación de esquemas JSON robustos
- ✅ Validación de parámetros y manejo de errores
- ✅ Composición y orquestación de herramientas
- ✅ Versionado y backwards compatibility
- ✅ Seguridad en ejecución de herramientas

#### Componentes:
- Definición de integraciones (API, bases de datos, servicios)
- Timeouts y rate limiting
- Logging y observabilidad
- Fallback y redundancia

---

### 3. **CI/CD (Integración y Despliegue Continuo)**
#### Competencias esperadas:
- ✅ Pipelines de validación automática
- ✅ Testing en arquitecturas con agentes
- ✅ Despliegue seguro y rollback
- ✅ Monitoreo en producción
- ✅ Versionado de modelos y prompts

#### Componentes:
- GitHub Actions / GitLab CI workflows
- Test coverage para lógica agéntica
- Canary deployments
- Feature flags

---

### 4. **Prompt Engineering (Ingeniería de Prompts)**
#### Competencias esperadas:
- ✅ Diseño de prompts complejos y multipasos
- ✅ Técnicas: chain-of-thought, few-shot, role-playing
- ✅ Optimización de costos y latencia
- ✅ Manejo de contexto (context window)
- ✅ Evaluación y métricas de calidad

#### Componentes:
- Prompting templates y patterns
- Pruebas A/B de prompts
- Generación automática de test cases
- Validación de salidas

---

### 5. **Context Management (Gestión de Contexto)**
#### Competencias esperadas:
- ✅ Estrategias de información en memoria
- ✅ Compresión de contexto
- ✅ Recuperación eficiente (RAG patterns)
- ✅ Manejo de estado en aplicaciones distribuidas
- ✅ Persistencia y sincronización de contexto

#### Componentes:
- Vector databases (embeddings)
- Caching inteligente
- Sesiones y perfiles de usuario
- Caducidad y limpieza de contexto

---

## 🎪 Estructura de Fases

```
┌─────────────────────────────────────────────────────────────┐
│                     12 SEMANAS TOTALES                       │
├─────────────────┬──────────────────┬──────────────────────────┤
│  FASE 1 (4 sem) │ FASE 2 (4 sem)   │ FASE 3 (4 sem)         │
│  Foundations    │ Applied          │ Exam Prep              │
└─────────────────┴──────────────────┴──────────────────────────┘
```

### **Fase 1: Foundations (Semanas 1-4)**
**Objetivo:** Entender conceptos fundamentales

- Agent loops y orquestación
- Diseño básico de herramientas
- Introducción a CI/CD
- Fundamentals de prompting
- Almacenamiento y recuperación de contexto

**Entrega:** 4 mini-proyectos + Quiz de 25 preguntas

---

### **Fase 2: Applied (Semanas 5-8)**
**Objetivo:** Aplicar en escenarios reales

- Configuración avanzada de pipelines
- Patrones de validación complejos
- Optimización de herramientas y prompts
- Estrategias de distribución
- Manejo de fallos en producción

**Entrega:** 4 ejercicios prácticos + Quiz de 30 preguntas

---

### **Fase 3: Exam Prep (Semanas 9-12)**
**Objetivo:** Prepararse para certificación final

- 6 escenarios de examen (1 por semana adaptativo)
- 4 ejercicios integradores
- 3 exámenes de práctica full (4 horas c/u)
- Revisión y refuerzo de débiles
- **Examen Final:** 50 preguntas (4 horas)

**Entrega:** Certificado Claude Certified Architect

---

## 📅 Plan Semana por Semana

### **FASE 1: FOUNDATIONS**

---

#### **SEMANA 1: Agentic Loops - Conceptos Fundamentales**

**Tema Central:** Arquitectura básica de bucles agénticos

**Contenido:**
- [ ] Ciclo de percepción-decisión-acción
- [ ] Estados de un agente (idle, processing, halted)
- [ ] Condiciones de parada (halt conditions)
- [ ] Manejo de errores en bucles
- [ ] Patrones de retorno exponencial (exponential backoff)

**Herramientas:**
- Python: `while` loops, state machines
- TypeScript: Async/await patterns
- Pseudo-código de máquinas de estados

**Ejemplo Práctico:**
```python
# Agent loop básico
class Agent:
    def __init__(self):
        self.state = "idle"
        self.max_iterations = 10
        self.iteration = 0
    
    def loop(self):
        while self.state != "halted" and self.iteration < self.max_iterations:
            self.perceive()
            self.decide()
            self.act()
            self.iteration += 1
    
    def perceive(self):
        # Recopilar información
        pass
    
    def decide(self):
        # Tomar decisión
        pass
    
    def act(self):
        # Ejecutar acción
        pass
```

**Quiz Checkpoint:** 5 preguntas
- ¿Cuál es el riesgo de bucles infinitos?
- ¿Cuándo usar halt conditions vs max iterations?
- Diseña un estado máquina para un agente de atención al cliente

**Recursos:**
- Documentación oficial de agentes Claude
- Patrones de control de flujo
- Casos de uso: chatbots, assistants, automation

---

#### **SEMANA 2: Tool Design - Especificación y Validación**

**Tema Central:** Diseñar herramientas robustas para agentes

**Contenido:**
- [ ] Esquemas JSON-Schema para herramientas
- [ ] Parámetros obligatorios vs opcionales
- [ ] Validación de entrada (type checking, ranges)
- [ ] Especificación de errores y excepciones
- [ ] Versionado de herramientas

**Herramientas:**
- JSON-Schema
- OpenAPI specs
- Python pydantic models

**Ejemplo Práctico:**
```python
from pydantic import BaseModel, Field, validator

class CalculatorTool(BaseModel):
    operation: str = Field(..., description="Operación: add, subtract, multiply, divide")
    x: float = Field(..., description="Primer operando")
    y: float = Field(..., description="Segundo operando")
    
    @validator('operation')
    def validate_operation(cls, v):
        valid_ops = ['add', 'subtract', 'multiply', 'divide']
        if v not in valid_ops:
            raise ValueError(f"Operación debe ser una de: {valid_ops}")
        return v
    
    @validator('y')
    def validate_division(cls, v, values):
        if values.get('operation') == 'divide' and v == 0:
            raise ValueError("No se puede dividir entre cero")
        return v
```

**Quiz Checkpoint:** 5 preguntas
- Diseña esquema para herramienta de búsqueda en BD
- ¿Cómo manejar versionado backward-compatible?
- Patrón de retry con exponential backoff

**Recursos:**
- JSON-Schema documentation
- Pydantic for Python validation
- Best practices de API design

---

#### **SEMANA 3: Introducción a CI/CD y Prompt Versioning**

**Tema Central:** Automatizar validación y despliegue

**Contenido:**
- [ ] Pipelines básicos de GitHub Actions
- [ ] Testing de prompts (golden tests)
- [ ] Versionado de prompts y configuraciones
- [ ] Almacenamiento de prompts (prompt management)
- [ ] Feedback loops desde producción

**Herramientas:**
- GitHub Actions
- Git tagging
- Simple test frameworks

**Ejemplo Práctico (GitHub Actions):**
```yaml
name: Validate Prompts

on: [push, pull_request]

jobs:
  test-prompts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run prompt tests
        run: python -m pytest tests/prompts/
      - name: Check prompt length
        run: python scripts/validate_prompts.py
```

**Quiz Checkpoint:** 5 preguntas
- Diseña pipeline para validar cambios en prompts
- ¿Cómo versionar prompts en Git?
- Estrategia de rollback

**Recursos:**
- GitHub Actions documentation
- Prompt versioning best practices
- Testing frameworks

---

#### **SEMANA 4: Fundamentos de Context Management**

**Tema Central:** Almacenamiento y recuperación eficiente de contexto

**Contenido:**
- [ ] Tipos de memoria (short-term vs long-term)
- [ ] Embeddings y similitud semántica
- [ ] Recuperación (retrieval) básica
- [ ] Límites de context window
- [ ] Estrategias de compresión de contexto

**Herramientas:**
- Vector databases (Pinecone, Weaviate, Milvus)
- Embeddings (OpenAI embeddings, Hugging Face)
- Python libraries (langchain, llamaindex)

**Ejemplo Práctico:**
```python
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
import pinecone

# Inicializar Pinecone
pinecone.init(api_key="YOUR_KEY", environment="us-west1-gcp")

# Crear vector store
embeddings = OpenAIEmbeddings()
vector_store = Pinecone.from_texts(
    texts=["El cielo es azul", "Los pájaros vuelan alto"],
    embedding=embeddings,
    index_name="context-store"
)

# Recuperar contexto similar
results = vector_store.similarity_search("¿Color del cielo?", k=3)
for doc in results:
    print(f"Relevancia: {doc.metadata['score']}")
    print(f"Contenido: {doc.page_content}")
```

**Evaluación Semana 4:** Mini-proyecto
- Construir sistema de recuperación de contexto
- Pruebas de relevancia
- Documentación arquitectónica

**Recursos:**
- Vector database documentation
- Embedding techniques
- RAG (Retrieval-Augmented Generation) patterns

---

### **CHECKPOINT FASE 1**

**Quiz Acumulativo:** 25 preguntas
- 5 preguntas por dominio
- Duración: 1 hora
- Puntuación mínima para pasar: 75%

**Mini-Proyecto Integrador:**
Construir agente simple que:
1. Percibe entrada del usuario
2. Busca contexto relevante
3. Llama a 2-3 herramientas
4. Devuelve respuesta estructurada
5. Incluye logging y manejo de errores

---

---

### **FASE 2: APPLIED (Semanas 5-8)**

---

#### **SEMANA 5: Patrones Avanzados de Agentic Loops**

**Tema Central:** Orquestación compleja de agentes

**Contenido:**
- [ ] Multi-agent systems (MAS)
- [ ] Comunicación entre agentes
- [ ] Coordinación con token budgets
- [ ] Manejo de deadlocks
- [ ] Monitoreo y observabilidad de loops

**Patrones:**
- Producer-consumer
- Master-worker
- Gossip protocol
- Centralized coordinator

**Ejemplo Práctico (Multi-agent):**
```python
from dataclasses import dataclass
from enum import Enum
from typing import List

class AgentRole(Enum):
    PLANNER = "planner"
    EXECUTOR = "executor"
    REVIEWER = "reviewer"

@dataclass
class Message:
    sender: str
    recipient: str
    content: str
    priority: int = 1

class MultiAgentOrchestrator:
    def __init__(self):
        self.agents = {}
        self.message_queue = []
        self.iteration = 0
        self.max_iterations = 50
    
    def register_agent(self, name: str, role: AgentRole):
        self.agents[name] = {
            'role': role,
            'state': 'idle',
            'messages': []
        }
    
    def broadcast_message(self, message: Message):
        self.message_queue.append(message)
    
    def run_orchestration(self):
        while self.iteration < self.max_iterations:
            # Procesar mensajes
            self._process_messages()
            
            # Ejecutar lógica de cada agente
            self._execute_agents()
            
            # Evaluar convergencia
            if self._converged():
                break
            
            self.iteration += 1
    
    def _process_messages(self):
        # Ordenar por prioridad
        self.message_queue.sort(key=lambda m: -m.priority)
        for message in self.message_queue:
            if message.recipient in self.agents:
                self.agents[message.recipient]['messages'].append(message)
        self.message_queue.clear()
    
    def _execute_agents(self):
        # Cada agente procesa sus mensajes
        for name, agent in self.agents.items():
            if agent['messages']:
                agent['state'] = 'processing'
                # Lógica específica del rol
                self._execute_role(name, agent)
                agent['state'] = 'idle'
                agent['messages'].clear()
    
    def _execute_role(self, name: str, agent):
        role = agent['role']
        if role == AgentRole.PLANNER:
            # Planificar tareas
            pass
        elif role == AgentRole.EXECUTOR:
            # Ejecutar tareas
            pass
        elif role == AgentRole.REVIEWER:
            # Revisar resultados
            pass
    
    def _converged(self) -> bool:
        # Verificar si todos alcanzaron objetivo
        return all(agent['state'] == 'idle' for agent in self.agents.values())
```

**Ejercicio Práctico:**
- Diseñar orquestador para workflow de análisis de datos
- Implementar 3 agentes (planner, executor, reviewer)
- Incluir timeouts y fallbacks

**Quiz Checkpoint:** 6 preguntas

---

#### **SEMANA 6: Tool Integration Avanzada y Composición**

**Tema Central:** Orquestar múltiples herramientas de forma segura

**Contenido:**
- [ ] Composición de herramientas (tool chaining)
- [ ] Timeout y rate limiting en herramientas
- [ ] Circuit breakers y fallbacks
- [ ] Logging estructurado y trazabilidad
- [ ] Seguridad: sandboxing y permisos

**Ejemplo Práctico:**
```python
from functools import wraps
from typing import Callable, Any
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_calls: int, time_window: int):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = defaultdict(list)
    
    def is_allowed(self, tool_name: str) -> bool:
        now = time.time()
        # Limpiar llamadas antiguas
        self.calls[tool_name] = [
            ts for ts in self.calls[tool_name]
            if now - ts < self.time_window
        ]
        
        if len(self.calls[tool_name]) < self.max_calls:
            self.calls[tool_name].append(now)
            return True
        return False

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        if self.state == "open":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "half-open"
            else:
                raise Exception("Circuit breaker is open")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

class ToolComposer:
    def __init__(self):
        self.rate_limiter = RateLimiter(max_calls=10, time_window=60)
        self.circuit_breakers = {}
    
    def chain_tools(self, tools: List[str]):
        """Encadenar herramientas de forma segura"""
        results = []
        for tool in tools:
            if not self.rate_limiter.is_allowed(tool):
                raise Exception(f"Rate limit exceeded for {tool}")
            
            if tool not in self.circuit_breakers:
                self.circuit_breakers[tool] = CircuitBreaker()
            
            try:
                result = self.circuit_breakers[tool].call(
                    self._execute_tool,
                    tool
                )
                results.append(result)
            except Exception as e:
                # Fallback logic
                results.append(self._get_fallback(tool))
        
        return results
```

**Ejercicio Práctico:**
- Diseñar cadena de 5 herramientas para procesamiento de documentos
- Implementar rate limiting y circuit breaker
- Pruebas de resiliencia

**Quiz Checkpoint:** 6 preguntas

---

#### **SEMANA 7: CI/CD Avanzado y Deployment Seguro**

**Tema Central:** Pipelines robustos para agentes en producción

**Contenido:**
- [ ] Multi-stage pipelines (dev, staging, prod)
- [ ] Canary deployments
- [ ] A/B testing de prompts
- [ ] Rollback automático
- [ ] Monitoring y alertas

**Ejemplo Práctico (Advanced GitHub Actions):**
```yaml
name: Deploy Agent to Production

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/agent

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run comprehensive tests
        run: |
          python -m pytest tests/ -v --cov=src
          python scripts/validate_prompts.py
          python scripts/validate_tools.py
      - name: Check prompt quality
        run: python scripts/evaluate_prompts.py

  canary-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to canary (5% traffic)
        run: |
          kubectl set image deployment/agent-canary \
            agent=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
      - name: Monitor canary metrics
        run: python scripts/monitor_canary.py --duration=15m
      - name: Check error rate
        run: |
          ERROR_RATE=$(python scripts/get_metrics.py --metric=error_rate)
          if (( $(echo "$ERROR_RATE > 1.0" | bc -l) )); then
            kubectl rollout undo deployment/agent-canary
            exit 1
          fi

  prod-deploy:
    needs: canary-deploy
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production (100% traffic)
        run: |
          kubectl set image deployment/agent \
            agent=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
      - name: Verify deployment
        run: kubectl rollout status deployment/agent --timeout=5m
      - name: Run smoke tests
        run: python scripts/smoke_tests.py

  monitoring:
    needs: prod-deploy
    runs-on: ubuntu-latest
    steps:
      - name: Setup monitoring alerts
        run: |
          python scripts/setup_alerts.py \
            --error-rate-threshold=0.5 \
            --latency-threshold=500ms
```

**Ejercicio Práctico:**
- Implementar pipeline canary para nuevo agente
- Crear métricas de monitoreo
- Plan de rollback automático

**Quiz Checkpoint:** 6 preguntas

---

#### **SEMANA 8: Optimización de Contexto y Prompt Engineering Avanzado**

**Tema Central:** Maximizar efectividad con restricciones de recursos

**Contenido:**
- [ ] Compresión de contexto (summarization)
- [ ] Dynamic prompting (prompts que se adaptan)
- [ ] Few-shot learning con ejemplos óptimos
- [ ] Evaluación de calidad (BLEU, ROUGE, custom metrics)
- [ ] Cost optimization (tokens, API calls)

**Ejemplo Práctico:**
```python
import hashlib
from typing import List, Dict

class ContextCompressor:
    def __init__(self, max_tokens: int = 2000):
        self.max_tokens = max_tokens
        self.cache = {}
    
    def compress(self, context: List[str]) -> str:
        """Comprimir contexto manteniendo información clave"""
        # Caching para no recomprimir
        context_hash = hashlib.md5(
            ''.join(context).encode()
        ).hexdigest()
        
        if context_hash in self.cache:
            return self.cache[context_hash]
        
        # Extraer puntos clave
        key_points = self._extract_key_points(context)
        
        # Comprimir a abstracto
        compressed = self._summarize(key_points)
        
        self.cache[context_hash] = compressed
        return compressed
    
    def _extract_key_points(self, context: List[str]) -> List[str]:
        """Extraer información más relevante"""
        key_points = []
        for item in context:
            # Score de relevancia
            score = self._relevance_score(item)
            if score > 0.5:
                key_points.append(item)
        
        return sorted(
            key_points,
            key=self._relevance_score,
            reverse=True
        )[:5]  # Top 5 puntos
    
    def _relevance_score(self, text: str) -> float:
        """Calcular relevancia del texto"""
        # Heurística: longitud, palabras clave, etc.
        keywords = ['importante', 'crítico', 'esencial', 'error', 'fallo']
        score = sum(1 for kw in keywords if kw in text.lower())
        return min(score / len(keywords), 1.0)
    
    def _summarize(self, points: List[str]) -> str:
        """Resumir puntos clave en menos tokens"""
        # Aquí usaría un modelo pequeño o template
        summary = "Resumen: " + "; ".join(points)
        return summary[:self.max_tokens]

class DynamicPromptBuilder:
    def __init__(self):
        self.base_prompt = """Eres un asistente experto en {domain}.
        Tu objetivo es {objective}.
        
        Contexto relevante:
        {context}
        
        {examples}
        
        Pregunta del usuario: {user_input}"""
    
    def build(self, domain: str, objective: str, context: str,
              user_input: str, examples: List[Dict] = None) -> str:
        """Construir prompt dinámico"""
        
        # Comprimirlo
        compressor = ContextCompressor()
        compressed_context = compressor.compress([context])
        
        # Seleccionar mejores ejemplos
        if examples:
            selected_examples = self._select_best_examples(
                examples,
                user_input
            )
            examples_text = self._format_examples(selected_examples)
        else:
            examples_text = ""
        
        # Construir prompt final
        prompt = self.base_prompt.format(
            domain=domain,
            objective=objective,
            context=compressed_context,
            examples=examples_text,
            user_input=user_input
        )
        
        return prompt
    
    def _select_best_examples(self, examples: List[Dict],
                              user_input: str) -> List[Dict]:
        """Seleccionar ejemplos más relevantes"""
        scored = []
        for ex in examples:
            similarity = self._semantic_similarity(
                ex['input'],
                user_input
            )
            scored.append((similarity, ex))
        
        return [ex for _, ex in sorted(
            scored,
            reverse=True
        )[:3]]  # Top 3
    
    def _semantic_similarity(self, text1: str, text2: str) -> float:
        """Calcular similitud semántica (simplificado)"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union
    
    def _format_examples(self, examples: List[Dict]) -> str:
        """Formatear ejemplos para el prompt"""
        if not examples:
            return ""
        
        text = "Ejemplos previos:\n"
        for i, ex in enumerate(examples, 1):
            text += f"{i}. Entrada: {ex['input']}\n"
            text += f"   Salida: {ex['output']}\n"
        
        return text
```

**Ejercicio Práctico:**
- Implementar compresor de contexto
- Crear evaluador de calidad de prompts
- Optimizar prompts para reducir tokens un 30%

**Evaluación Fase 2:** 4 ejercicios prácticos integrados

---

### **CHECKPOINT FASE 2**

**Quiz Acumulativo:** 30 preguntas (15 nuevas + 15 de repaso)

**4 Ejercicios Prácticos:**
1. Sistema multi-agente con coordinación
2. Pipeline CI/CD con canary deployment
3. Cadena de herramientas con circuit breaker
4. Optimización de contexto y costo

---

---

### **FASE 3: EXAM PREP (Semanas 9-12)**

---

#### **SEMANA 9: Escenarios de Examen 1-2**

**Escenario 1: Sistema de Atención al Cliente Escalable**

**Contexto:**
Una plataforma de e-commerce necesita un sistema de atención al cliente 24/7 que:
- Maneje 10,000 consultas/día en horario pico
- Responda en <2 segundos
- Escale automáticamente
- Maneje contexto de cliente (historial, preferencias)
- Deriye a humanos cuando sea necesario

**Pregunta central:**
Diseña la arquitectura completa del agente incluyendo:
- Estructura de bucles y orquestación
- Herramientas necesarias y sus especificaciones
- Estrategia de contexto (RAG)
- Prompts optimizados
- Pipeline CI/CD para canary deployments

**Desafíos específicos:**
- Cómo mantener contexto de 100k clientes simultáneamente
- Reducir latencia de búsqueda de contexto
- Manejar fallos de dependencias externas
- Monitoreo en tiempo real

**Respuesta esperada (estructura):**
```
1. Arquitectura General
   - Load balancer → Multi-agent pool
   - Agent pool con auto-scaling
   - Contexto distribuido en Redis/DynamoDB

2. Diseño de Herramientas
   - SearchCustomerContext (vector DB)
   - FetchOrderHistory (SQL DB)
   - CheckInventory (API externa)
   - EscalateToHuman (queue system)
   - LogInteraction (analytics)

3. Contexto Management
   - Embedding de perfiles de cliente
   - Cache L1 (Redis) + L2 (Vector DB)
   - TTL basado en actividad reciente

4. Prompts
   - System prompt sensible al contexto
   - Few-shot examples basados en categoría de consulta
   - Instrucciones de escalation

5. CI/CD
   - Tests de latencia
   - A/B testing de prompts
   - Canary a 10%, luego 50%, luego 100%
```

---

**Escenario 2: Pipeline de Análisis de Documentos Automatizado**

**Contexto:**
Un despacho legal necesita procesar 500 documentos/día:
- Extraer cláusulas clave
- Identificar riesgos legales
- Generar resumen ejecutivo
- Mantener audit trail
- Validación de calidad antes de entregar

**Pregunta central:**
Diseña un agente complejo que:
- Gestione workflow multi-paso
- Valide calidad en cada etapa
- Maneje errores con fallbacks
- Optimice costos (algunos docs son simples)
- Permita revisión humana de casos complejos

**Desafíos:**
- Documentos de 100+ páginas
- Contexto acumulativo entre pasos
- Precisión crítica
- Compliance y audit trail

---

#### **SEMANA 10: Escenarios de Examen 3-4**

**Escenario 3: Sistema de Recomendaciones Personalizado**

**Contexto:**
Plataforma de streaming con 50M usuarios necesita:
- Generar recomendaciones personalizadas
- Actualizar en tiempo real
- A/B testing continuo de algoritmos
- Explicar recomendaciones al usuario
- Detectar y prevenir sesgos

**Pregunta central:**
Arquitectura que balancee:
- Precisión vs latencia
- Personalización vs privacidad
- Costos de compute
- Actualización de modelos/prompts

---

**Escenario 4: Agente de Automatización de Procesos RPA**

**Contexto:**
Empresa Fortune 500 necesita automatizar procesos de back-office:
- Validar datos de proveedores
- Generar reportes de conformidad
- Interactuar con múltiples sistemas legacy
- Manejar excepciones complejas
- Mantener auditabilidad

**Pregunta central:**
Cómo diseñar agentes que:
- Integren sistemas heterogéneos
- Manejen excepciones sin intervención
- Proporcionen visibilidad completa
- Escalen a cientos de procesos paralelos

---

#### **SEMANA 11: Escenarios 5-6 + Examen de Práctica 1**

**Escenario 5: Sistema de Monitoreo y Alertas Inteligente**

**Contexto:**
SaaS DevOps observa 1M métricos en tiempo real:
- Detectar anomalías
- Correlacionar eventos
- Generar alerts accionables
- Evitar alert fatigue
- Root cause analysis automático

---

**Escenario 6: Asistente de Desarrollo para Ingenieros**

**Contexto:**
IDE con asistente que:
- Entienda código del proyecto
- Sugiera refactorings
- Ayude con debugging
- Genere tests
- Mantenga contexto de código vivo

**Desafío:** Context window limitado con codebase gigante

---

**Examen de Práctica 1: Full 50 preguntas (4 horas)**
- 20 preguntas de opción múltiple
- 15 preguntas de desarrollo corto
- 10 preguntas de diseño (requieren diagramas)
- Cálculo de puntaje y feedback

---

#### **SEMANA 12: Exámenes de Práctica 2-3 + Examen Final**

**Examen de Práctica 2:** (Similar estructura)

**Examen de Práctica 3:** (Similar estructura)

**EXAMEN FINAL OFFICIAL:**
- 50 preguntas
- 4 horas
- 75% mínimo para pasar
- Incluye:
  - Diseño de arquitectura (35%)
  - Implementación (40%)
  - Troubleshooting (15%)
  - Optimización (10%)

---

## 🎪 Escenarios de Examen (Resumen)

| # | Título | Dominio Principal | Dificultad | Tiempo |
|---|--------|-------------------|-----------|--------|
| 1 | Atención al Cliente a Escala | Agentic Loops + Context | Intermedia | 90 min |
| 2 | Pipeline Análisis Legal | Tool Design + CI/CD | Intermedia | 90 min |
| 3 | Recomendaciones Personalizado | Context + Prompting | Avanzada | 120 min |
| 4 | Automatización RPA | Agentic Loops + Tools | Avanzada | 120 min |
| 5 | Monitoreo Inteligente | Context + Prompting | Intermedia | 90 min |
| 6 | Asistente de Desarrollo | Todos los dominios | Experto | 150 min |

---

## ⚠️ Anti-patrones Arquitectónicos (18+)

### **Agentic Loops**

1. **Bucles sin condición de parada**
   - ❌ while True sin halt condition
   - ✅ max_iterations + halt_condition

2. **Falta de backtracking en bifurcaciones**
   - ❌ Agente toma rama sin opción de volver
   - ✅ Mantener alternativas viables

3. **Estado compartido sin sincronización**
   - ❌ Multi-agentes leyendo/escribiendo el mismo estado sin locks
   - ✅ Usar message queues o state management centralizado

4. **Condiciones de carrera en decisiones**
   - ❌ Dos agentes toman misma decisión simultáneamente
   - ✅ Tokenización de decisiones o mutual exclusion

---

### **Tool Design**

5. **Herramientas sin validación de entrada**
   - ❌ Aceptar cualquier parámetro
   - ✅ JSON-Schema con restricciones

6. **Retry logic sin backoff exponencial**
   - ❌ Reintentos inmediatos
   - ✅ Exponential backoff + jitter

7. **Falta de rate limiting**
   - ❌ Llamadas ilimitadas a APIs
   - ✅ Token bucket o sliding window

8. **Errores genéricos sin contexto**
   - ❌ "Error al ejecutar herramienta"
   - ✅ Error específico con detalles para debugging

9. **Dependencias circulares entre herramientas**
   - ❌ Tool A llama Tool B que llama Tool A
   - ✅ DAG de dependencias validado

---

### **CI/CD**

10. **Deployments sin tests de prompts**
    - ❌ Solo tests de código
    - ✅ Golden tests de prompts + evaluación de calidad

11. **No versionar prompts con código**
    - ❌ Prompts en variables de ambiente
    - ✅ Prompts versionados en Git

12. **Falta de canary deployments**
    - ❌ Deploy 100% a la vez
    - ✅ Gradual rollout con métricas

13. **Rollback manual en producción**
    - ❌ Intervención humana para revertir
    - ✅ Rollback automático basado en métricas

---

### **Prompt Engineering**

14. **Prompts sin ejemplos (few-shot)**
    - ❌ Esperar que el modelo adivin el formato
    - ✅ Proporcionar 2-5 ejemplos claros

15. **Context window utilizado al 100%**
    - ❌ Sin buffer para respuesta
    - ✅ Usar solo 60-70% del context disponible

16. **Prompts hardcodeados sin versionado**
    - ❌ Strings en código
    - ✅ Archivos de prompt separados

---

### **Context Management**

17. **Contexto nunca expira**
    - ❌ Memory leak de información antigua
    - ✅ TTL y limpieza periódica

18. **Recuperación de contexto sin ranking**
    - ❌ Devolver todos los resultados
    - ✅ Top-K con threshold de relevancia

19. **Embeddings sin normalización**
    - ❌ Comparar embeddings directamente
    - ✅ Normalizar y usar cosine similarity

20. **Cache sin invalidación**
    - ❌ Información obsoleta en caché
    - ✅ Cache invalidation strategy (TTL, eventos, etc.)

---

## 🔑 Puntos Clave por Módulo

### **AGENTIC LOOPS**

**Puntos clave:**
1. Ciclo básico: Percepción → Decisión → Acción
2. Estados: Idle, Processing, Halted, Error
3. Condiciones de parada: max_iterations, goal_reached, error_condition
4. Manejo de errores: retry logic, fallbacks, human escalation
5. Observabilidad: logging de cada estado, métricas de convergencia

**Ejemplos de código:**
```python
# Halt condition proper
while iteration < max_iterations and not goal_reached:
    try:
        decision = agent.decide()
        agent.act(decision)
    except CriticalError:
        agent.halt()
        break
    iteration += 1
```

---

### **TOOL DESIGN**

**Puntos clave:**
1. Especificar con JSON-Schema: tipos, rangos, validaciones
2. Versionar herramientas: mantener compatibilidad hacia atrás
3. Timeouts: siempre especificar máximo tiempo de ejecución
4. Errores explícitos: códigos de error, mensajes claros
5. Testing: unit tests, integration tests, performance tests

**Validación de parámetros:**
```python
# Usar Pydantic para validación
class APICallTool(BaseModel):
    endpoint: str = Field(..., regex=r"^https://")
    timeout: int = Field(30, ge=1, le=300)
    retry_count: int = Field(3, ge=0, le=10)
```

---

### **CI/CD**

**Puntos clave:**
1. Test pipeline: unit → integration → e2e
2. Prompt validation: golden tests, BLEU/ROUGE scores
3. Deployment stages: dev → staging → canary (5%) → prod (50%) → prod (100%)
4. Monitoring: error rate, latency, cost per call
5. Rollback: automático si error_rate > threshold

**Métricas a monitorear:**
- Error rate (debe < 0.1%)
- Latency p95 (debe < límite SLA)
- Cost per prediction
- Prompt quality score

---

### **PROMPT ENGINEERING**

**Puntos clave:**
1. Estructura: System prompt + Context + Examples + Query
2. Técnicas: CoT (chain-of-thought), Few-shot, Role-playing
3. Optimización: Menor contexto sin perder calidad
4. Evaluación: BLEU, ROUGE, custom metrics, human evaluation
5. A/B testing: Comparar prompts en producción

**Template efectivo:**
```
# System Prompt
Eres un experto en {domain}. 
Tu objetivo es {specific_goal}.
Formato de respuesta: {format_spec}

# Context
{retrieved_context}

# Examples (Few-shot)
Input: {example1_input}
Output: {example1_output}

# User Query
{user_input}
```

---

### **CONTEXT MANAGEMENT**

**Puntos clave:**
1. Embeddings: Convertir texto a vectores, similaridad semántica
2. Recuperación: Top-K con threshold, ranking
3. Caché multinivel: L1 (Redis) → L2 (Vector DB) → L3 (Original store)
4. TTL: Expiración automática de información antigua
5. Compresión: Resúmenes para contextos grandes

**Estrategia recomendada:**
```python
# Niveles de cache
cache_l1 = Redis(ttl=300)  # 5 minutos
cache_l2 = VectorDB(ttl=3600)  # 1 hora
source = PostgreSQL()

# Lookup
try:
    data = cache_l1.get(key)  # Rápido
except:
    try:
        data = cache_l2.search(embedding)  # Más lento
    except:
        data = source.query()  # Base de datos
        cache_l2.store(data)
```

---

## ✅ Checkpoints de Progreso

### **Semana 1**
- [ ] Entender ciclos percepción-decisión-acción
- [ ] Implementar agente simple con halt condition
- [ ] Quiz: 5/5 preguntas

### **Semana 2**
- [ ] Definir especificación JSON-Schema para 2 herramientas
- [ ] Implementar validación con Pydantic
- [ ] Quiz: 5/5 preguntas

### **Semana 3**
- [ ] Crear GitHub Actions workflow básico
- [ ] Versionar prompts en Git
- [ ] Quiz: 5/5 preguntas

### **Semana 4**
- [ ] Construir sistema de recuperación de contexto
- [ ] Mini-proyecto: Agent + Tool + Context
- [ ] Quiz: 5/5 preguntas

### **CHECKPOINT FASE 1** ✅
- [ ] Quiz acumulativo: 25/25 (75% mínimo)
- [ ] Mini-proyecto: Agent funcional end-to-end

---

### **Semana 5**
- [ ] Diseñar orquestador multi-agente
- [ ] Implementar comunicación entre agentes
- [ ] Quiz: 6/6 preguntas

### **Semana 6**
- [ ] Implementar tool chaining
- [ ] Agregar circuit breaker y rate limiter
- [ ] Quiz: 6/6 preguntas

### **Semana 7**
- [ ] Crear pipeline CI/CD con canary deployment
- [ ] Configurar monitoreo y alertas
- [ ] Quiz: 6/6 preguntas

### **Semana 8**
- [ ] Implementar context compressor
- [ ] Optimizar prompts para reducir tokens 30%
- [ ] Quiz: 6/6 preguntas

### **CHECKPOINT FASE 2** ✅
- [ ] Quiz acumulativo: 30/30 (75% mínimo)
- [ ] 4 ejercicios prácticos completos

---

### **Semana 9**
- [ ] Resolver escenarios 1-2
- [ ] Diseño documentado con diagramas
- [ ] Checkpoint: Escenarios completados

### **Semana 10**
- [ ] Resolver escenarios 3-4
- [ ] Documentación técnica completa
- [ ] Checkpoint: Escenarios completados

### **Semana 11**
- [ ] Resolver escenarios 5-6
- [ ] Examen de práctica 1: 50 preguntas (4h)
- [ ] Score mínimo 75%

### **Semana 12**
- [ ] Examen de práctica 2: 50 preguntas (4h)
- [ ] Examen de práctica 3: 50 preguntas (4h)
- [ ] **EXAMEN FINAL: 50 preguntas (4h)**
- [ ] **Puntuación mínima: 75% para Certificado**

---

## 📊 Matriz de Dominios vs Semanas

```
           S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12
Agentic    ██  ░░  ░░  ░░  ██  ░░  ░░  ░░  ██  ██  ░░  ░░
Tools      ░░  ██  ░░  ░░  ░░  ██  ░░  ░░  ██  ░░  ░░  ░░
CI/CD      ░░  ░░  ██  ░░  ░░  ░░  ██  ░░  ░░  ░░  ██  ░░
Prompting  ░░  ░░  ░░  ░░  ░░  ░░  ░░  ██  ██  ░░  ░░  ░░
Context    ░░  ░░  ░░  ██  ░░  ░░  ░░  ██  ░░  ██  ░░  ░░

██ = Enfoque principal
░░ = Refuerzo/integración
```

---

## 🎓 Recomendaciones Finales

**Dedicación horaria:**
- Teoría: 30 min/día
- Práctica: 20 min/día
- Proyectos: 10 min/día (fin de semana)

**Recursos complementarios:**
1. Documentación oficial de Claude API
2. Papers sobre multi-agent systems
3. Case studies de empresas usando agentes
4. Comunidad de desarrolladores Claude

**Después de certificarse:**
- Mantener conocimiento actualizado (cada trimestre)
- Contribuir a proyectos open source
- Mentoría a otros arquitectos
- Explorar especializaciones avanzadas

---

**Última revisión:** 21 de mayo de 2026  
**Próxima actualización:** Septiembre de 2026
