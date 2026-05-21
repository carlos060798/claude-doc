# 💻 Ejemplos de Código - Certificación Claude Architect

Código completo y listo para usar durante el aprendizaje.

---

## 1. Agent Loop Básico

```python
from dataclasses import dataclass
from enum import Enum
from typing import Optional, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentState(Enum):
    IDLE = "idle"
    PROCESSING = "processing"
    HALTED = "halted"
    ERROR = "error"

@dataclass
class AgentDecision:
    action: str
    parameters: dict
    confidence: float

class BasicAgent:
    def __init__(self, name: str, max_iterations: int = 10):
        self.name = name
        self.state = AgentState.IDLE
        self.iteration = 0
        self.max_iterations = max_iterations
        self.goal_achieved = False
        self.error_count = 0
        self.max_errors = 3
    
    def run(self):
        """Ejecutar el loop del agente"""
        logger.info(f"Agent {self.name} iniciado")
        
        while (self.state != AgentState.HALTED and 
               self.iteration < self.max_iterations and
               self.error_count < self.max_errors):
            try:
                self.state = AgentState.PROCESSING
                
                # Fase 1: Percepción
                perception = self.perceive()
                
                # Fase 2: Decisión
                decision = self.decide(perception)
                
                # Fase 3: Acción
                result = self.act(decision)
                
                # Evaluar convergencia
                if self._check_goal_achieved(result):
                    self.goal_achieved = True
                    self.state = AgentState.HALTED
                    logger.info(f"Goal alcanzado en iteración {self.iteration}")
                    break
                
                self.iteration += 1
                self.state = AgentState.IDLE
                
            except Exception as e:
                self.error_count += 1
                self.state = AgentState.ERROR
                logger.error(f"Error en iteración {self.iteration}: {e}")
                
                if self.error_count >= self.max_errors:
                    self.state = AgentState.HALTED
                    logger.error("Max errores alcanzado. Deteniendo agente.")
    
    def perceive(self) -> dict:
        """Recopilar información del ambiente"""
        logger.info(f"[{self.iteration}] Percibiendo...")
        # Aquí iría lógica real: sensors, APIs, bases de datos
        return {"timestamp": self.iteration, "data": "sensed_data"}
    
    def decide(self, perception: dict) -> AgentDecision:
        """Tomar decisión basada en percepción"""
        logger.info(f"[{self.iteration}] Decidiendo...")
        # Aquí iría lógica real: LLM call, rules engine, ML model
        
        return AgentDecision(
            action="search",
            parameters={"query": perception},
            confidence=0.85
        )
    
    def act(self, decision: AgentDecision) -> dict:
        """Ejecutar acción decidida"""
        logger.info(f"[{self.iteration}] Actuando: {decision.action}")
        # Aquí iría lógica real: API calls, database updates
        return {"action": decision.action, "success": True}
    
    def _check_goal_achieved(self, result: dict) -> bool:
        """Verificar si se alcanzó el objetivo"""
        return result.get("success", False)

# Uso
if __name__ == "__main__":
    agent = BasicAgent("CustomerServiceAgent", max_iterations=5)
    agent.run()
    
    print(f"\nResultado final:")
    print(f"- Goal alcanzado: {agent.goal_achieved}")
    print(f"- Iteraciones: {agent.iteration}")
    print(f"- Errores: {agent.error_count}")
```

---

## 2. Tool Validation con Pydantic

```python
from pydantic import BaseModel, Field, validator, root_validator
from typing import List, Optional, Union
from datetime import datetime
import json

class QueryParameter(BaseModel):
    name: str = Field(..., description="Nombre del parámetro")
    type: str = Field(..., description="Tipo: string, int, float, bool")
    required: bool = Field(True, description="¿Es requerido?")
    default: Optional[Union[str, int, float, bool]] = None

class ToolSchema(BaseModel):
    """Especificación de una herramienta para agents"""
    
    name: str = Field(..., description="Nombre único de la herramienta")
    version: str = Field("1.0.0", description="Versión semantic")
    description: str = Field(..., description="Descripción clara")
    
    parameters: List[QueryParameter]
    
    timeout_seconds: int = Field(30, ge=1, le=300)
    retry_count: int = Field(3, ge=0, le=10)
    
    required_capabilities: List[str] = Field(
        default_factory=list,
        description="APIs o servicios requeridos"
    )
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @validator('name')
    def validate_name(cls, v):
        if not v.replace('_', '').isalnum():
            raise ValueError("Nombre debe ser alphanumeric o underscore")
        if len(v) > 50:
            raise ValueError("Nombre máximo 50 caracteres")
        return v.lower()
    
    @validator('version')
    def validate_version(cls, v):
        parts = v.split('.')
        if len(parts) != 3:
            raise ValueError("Version debe ser semantic (X.Y.Z)")
        try:
            [int(p) for p in parts]
        except ValueError:
            raise ValueError("Componentes de version deben ser numéricos")
        return v
    
    @root_validator()
    def validate_parameters(cls, values):
        """Validar que parámetros requeridos no tengan defaults conflictivos"""
        parameters = values.get('parameters', [])
        for param in parameters:
            if param.required and param.default is not None:
                raise ValueError(
                    f"Parámetro requerido '{param.name}' no puede tener default"
                )
        return values
    
    def to_json_schema(self) -> dict:
        """Convertir a JSON Schema para OpenAI API"""
        properties = {}
        required = []
        
        for param in self.parameters:
            properties[param.name] = {
                "type": param.type,
                "description": param.name
            }
            if param.required:
                required.append(param.name)
        
        return {
            "type": "object",
            "properties": properties,
            "required": required
        }

# Ejemplos de uso

# Herramienta válida
search_tool = ToolSchema(
    name="search_database",
    description="Buscar en base de datos de productos",
    parameters=[
        QueryParameter(
            name="query",
            type="string",
            required=True,
            description="Término de búsqueda"
        ),
        QueryParameter(
            name="limit",
            type="int",
            required=False,
            default=10,
            description="Máximo de resultados"
        )
    ],
    timeout_seconds=5,
    retry_count=2,
    required_capabilities=["postgres", "elasticsearch"]
)

print(f"✅ Tool válido: {search_tool.name}")
print(f"JSON Schema:\n{json.dumps(search_tool.to_json_schema(), indent=2)}")

# Intentar crear herramienta inválida (fallará)
try:
    invalid_tool = ToolSchema(
        name="invalid-tool!!!",  # Caracteres inválidos
        description="Test",
        parameters=[],
        timeout_seconds=400  # Mayor que máximo permitido
    )
except ValueError as e:
    print(f"❌ Validación fallida: {e}")
```

---

## 3. Rate Limiter y Circuit Breaker

```python
from time import time, sleep
from collections import deque
from typing import Callable, Any, Optional
from functools import wraps
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    """Token bucket rate limiter"""
    
    def __init__(self, max_calls: int, time_window: int):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = deque()
    
    def is_allowed(self) -> bool:
        now = time()
        
        # Remover llamadas fuera de la ventana
        while self.calls and self.calls[0] < now - self.time_window:
            self.calls.popleft()
        
        # Verificar si hay capacidad
        if len(self.calls) < self.max_calls:
            self.calls.append(now)
            return True
        
        return False
    
    def get_wait_time(self) -> float:
        """Retorna cuántos segundos esperar"""
        if not self.calls:
            return 0
        
        oldest = self.calls[0]
        now = time()
        wait = (oldest + self.time_window) - now
        return max(0, wait)

class CircuitBreaker:
    """Circuit breaker pattern para fallos en dependencias"""
    
    class State:
        CLOSED = "closed"      # Normal
        OPEN = "open"          # Fallando
        HALF_OPEN = "half_open"  # Probando recuperación
    
    def __init__(self, 
                 failure_threshold: int = 5,
                 recovery_timeout: int = 60,
                 expected_exception = Exception):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = self.State.CLOSED
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Ejecutar función con protección de circuit breaker"""
        
        if self.state == self.State.OPEN:
            # Verificar si tiempo para recuperación ha pasado
            if time() - self.last_failure_time > self.recovery_timeout:
                self.state = self.State.HALF_OPEN
                logger.info(f"Circuit breaker en HALF_OPEN, probando...")
            else:
                raise Exception(
                    f"Circuit breaker abierto. "
                    f"Reintentar en {self.get_time_to_retry():.1f}s"
                )
        
        try:
            result = func(*args, **kwargs)
            
            # Éxito - reset
            if self.state == self.State.HALF_OPEN:
                self._on_success()
            
            return result
        
        except self.expected_exception as e:
            self._on_failure()
            raise
    
    def _on_success(self):
        """Manejar llamada exitosa"""
        self.failure_count = 0
        self.state = self.State.CLOSED
        logger.info("Circuit breaker resetado a CLOSED")
    
    def _on_failure(self):
        """Manejar llamada fallida"""
        self.failure_count += 1
        self.last_failure_time = time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = self.State.OPEN
            logger.warning(
                f"Circuit breaker abierto después de "
                f"{self.failure_count} fallos"
            )
    
    def get_time_to_retry(self) -> float:
        """Cuánto falta para poder reintentar"""
        if self.state != self.State.OPEN or not self.last_failure_time:
            return 0
        
        elapsed = time() - self.last_failure_time
        return max(0, self.recovery_timeout - elapsed)

class ResilientToolExecutor:
    """Ejecutor de herramientas con rate limiting y circuit breaker"""
    
    def __init__(self, max_calls_per_min: int = 10):
        self.rate_limiter = RateLimiter(
            max_calls=max_calls_per_min,
            time_window=60
        )
        self.circuit_breaker = CircuitBreaker(
            failure_threshold=3,
            recovery_timeout=30
        )
    
    def execute(self, tool_func: Callable, *args, **kwargs) -> Any:
        """Ejecutar herramienta de forma resiliente"""
        
        # Verificar rate limit
        if not self.rate_limiter.is_allowed():
            wait_time = self.rate_limiter.get_wait_time()
            logger.warning(f"Rate limit alcanzado. Esperando {wait_time:.1f}s")
            sleep(wait_time)
        
        # Ejecutar con circuit breaker
        try:
            return self.circuit_breaker.call(tool_func, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error ejecutando herramienta: {e}")
            # Aquí iría fallback logic
            return None

# Ejemplo de uso
def example_api_call():
    """Simular llamada a API que a veces falla"""
    import random
    if random.random() < 0.3:  # 30% de fallos
        raise Exception("API error")
    return {"status": "ok"}

executor = ResilientToolExecutor(max_calls_per_min=5)

for i in range(10):
    try:
        result = executor.execute(example_api_call)
        print(f"✅ Llamada {i+1}: {result}")
    except Exception as e:
        print(f"❌ Llamada {i+1}: {e}")
    
    sleep(0.5)  # Pequeña pausa entre llamadas
```

---

## 4. Context Manager con Vector DB

```python
from typing import List, Optional, Tuple
from dataclasses import dataclass
import hashlib

@dataclass
class ContextItem:
    """Un item de contexto"""
    id: str
    text: str
    embedding: List[float]
    metadata: dict
    relevance_score: float = 0.0

class ContextManager:
    """Gestor de contexto con embeddings y cache"""
    
    def __init__(self, max_context_size: int = 4000):
        self.max_context_size = max_context_size
        self.context_store: List[ContextItem] = []
        self.memory_cache = {}
    
    def add_context(self, text: str, metadata: dict = None) -> str:
        """Agregar texto a contexto y embeddearlo"""
        
        # Generar ID
        context_id = hashlib.md5(text.encode()).hexdigest()[:12]
        
        # Simular embedding (en prod usar OpenAI embeddings)
        embedding = self._generate_embedding(text)
        
        # Crear item
        item = ContextItem(
            id=context_id,
            text=text,
            embedding=embedding,
            metadata=metadata or {}
        )
        
        # Agregar a store
        self.context_store.append(item)
        self.memory_cache[context_id] = item
        
        return context_id
    
    def retrieve_relevant(self, query: str, top_k: int = 3) -> List[ContextItem]:
        """Recuperar contexto relevante para query"""
        
        query_embedding = self._generate_embedding(query)
        
        # Calcular similitud con todos los items
        scored = []
        for item in self.context_store:
            score = self._cosine_similarity(query_embedding, item.embedding)
            item.relevance_score = score
            scored.append(item)
        
        # Ordenar y filtrar por threshold
        scored.sort(key=lambda x: -x.relevance_score)
        
        threshold = 0.5
        relevant = [
            item for item in scored[:top_k]
            if item.relevance_score > threshold
        ]
        
        return relevant
    
    def compress_context(self, items: List[ContextItem]) -> str:
        """Comprimir múltiples items en texto conciso"""
        
        if not items:
            return ""
        
        # Agrupar por tipo de metadata
        summary_parts = []
        
        for item in items:
            # Truncar textos largos
            text = item.text[:200] + "..." if len(item.text) > 200 else item.text
            
            summary_parts.append(
                f"[{item.relevance_score:.2%}] {text}"
            )
        
        return "\n".join(summary_parts)
    
    def get_context_for_prompt(self, query: str) -> str:
        """Obtener contexto listo para usar en prompt"""
        
        relevant_items = self.retrieve_relevant(query, top_k=5)
        
        if not relevant_items:
            return "(No hay contexto relevante)"
        
        # Estimar tokens (aproximado: 1 token ≈ 4 caracteres)
        compressed = self.compress_context(relevant_items)
        
        if len(compressed) > self.max_context_size:
            # Truncar si es muy largo
            compressed = compressed[:self.max_context_size] + "..."
        
        return compressed
    
    def _generate_embedding(self, text: str) -> List[float]:
        """Simular generación de embedding"""
        # En prod: usar OpenAI API, Hugging Face, etc.
        hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
        # Generar vector pseudoaleatorio pero determinista
        import random
        random.seed(hash_val % 2**32)
        return [random.random() for _ in range(384)]  # Ejemplo: 384 dimensiones
    
    @staticmethod
    def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Calcular similitud coseno"""
        import math
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = math.sqrt(sum(a**2 for a in vec1))
        magnitude2 = math.sqrt(sum(b**2 for b in vec2))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)

# Ejemplo de uso
manager = ContextManager()

# Agregar contexto
manager.add_context(
    "El proceso de compra requiere verificación de identidad",
    metadata={"category": "security", "importance": "high"}
)

manager.add_context(
    "El tiempo de envío es de 3-5 días hábiles",
    metadata={"category": "logistics", "importance": "medium"}
)

manager.add_context(
    "Los clientes VIP obtienen 20% de descuento",
    metadata={"category": "promotions", "importance": "low"}
)

# Recuperar contexto
query = "¿Cuánto tiempo tarda el envío?"
context = manager.get_context_for_prompt(query)
print(f"Contexto para query '{query}':\n{context}")
```

---

## 5. GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/agent-deploy.yml

name: Deploy Agent with Validation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/agent
  PYTHONUNBUFFERED: "1"

jobs:
  validate-code:
    runs-on: ubuntu-latest
    name: Validate Code Quality
    
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          pip install --upgrade pip
          pip install -r requirements-dev.txt
      
      - name: Lint with flake8
        run: |
          flake8 src/ --count --select=E9,F63,F7,F82 --show-source --statistics
      
      - name: Type check with mypy
        run: mypy src/ --ignore-missing-imports
      
      - name: Security check with bandit
        run: bandit -r src/ -f json -o bandit-report.json || true

  validate-prompts:
    runs-on: ubuntu-latest
    name: Validate Prompts Quality
    
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Check prompt syntax
        run: python scripts/validate_prompts.py
      
      - name: Run golden tests
        run: |
          python -m pytest tests/prompts/ -v --cov=src
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Evaluate prompt quality
        run: |
          python scripts/evaluate_prompts.py \
            --metric=bleu,rouge \
            --baseline=0.75 \
            --output=quality-report.json

  test-agent:
    runs-on: ubuntu-latest
    name: Test Agent Logic
    
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run unit tests
        run: pytest tests/unit/ -v --cov=src --cov-report=xml
      
      - name: Run integration tests
        run: pytest tests/integration/ -v
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml

  build-docker:
    needs: [validate-code, validate-prompts, test-agent]
    runs-on: ubuntu-latest
    name: Build Docker Image
    if: github.event_name == 'push'
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:buildcache,mode=max

  canary-deploy:
    needs: build-docker
    runs-on: ubuntu-latest
    name: Canary Deployment (5%)
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure kubectl
        run: |
          mkdir -p $HOME/.kube
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config
      
      - name: Deploy to canary
        run: |
          kubectl set image deployment/agent-canary \
            agent=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
      
      - name: Wait for canary rollout
        run: |
          kubectl rollout status deployment/agent-canary \
            -n production --timeout=5m
      
      - name: Monitor canary metrics (15 min)
        run: |
          python scripts/monitor_canary.py \
            --duration=900 \
            --error-rate-threshold=1.0 \
            --latency-threshold=1000
      
      - name: Check canary health
        run: |
          HEALTH=$(python scripts/get_canary_metrics.py --format=json)
          echo $HEALTH > canary-metrics.json
          
          # Verificar error rate
          ERROR_RATE=$(jq '.error_rate' canary-metrics.json)
          if (( $(echo "$ERROR_RATE > 1.0" | bc -l) )); then
            echo "❌ Error rate demasiado alto: $ERROR_RATE%"
            exit 1
          fi
      
      - name: Rollback if needed
        if: failure()
        run: |
          kubectl rollout undo deployment/agent-canary -n production
          echo "Canary rollback completado"

  prod-deploy:
    needs: canary-deploy
    runs-on: ubuntu-latest
    name: Production Deployment (100%)
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure kubectl
        run: |
          mkdir -p $HOME/.kube
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > $HOME/.kube/config
      
      - name: Deploy to production
        run: |
          kubectl set image deployment/agent \
            agent=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
      
      - name: Verify deployment
        run: |
          kubectl rollout status deployment/agent \
            -n production --timeout=10m
      
      - name: Run smoke tests
        run: python scripts/smoke_tests.py --environment=production
      
      - name: Create deployment annotation
        run: |
          kubectl annotate deployment agent \
            deployment.kubernetes.io/revision=${{ github.sha }} \
            --overwrite=true -n production
```

---

## 6. Prompt Optimization

```python
import re
from typing import List, Dict

class PromptOptimizer:
    """Optimizar prompts para reducir tokens y mejorar claridad"""
    
    def __init__(self, max_tokens: int = 2000):
        self.max_tokens = max_tokens
    
    def optimize(self, prompt: str) -> Dict[str, any]:
        """Ejecutar todas las optimizaciones"""
        
        results = {
            "original_length": len(prompt),
            "optimizations": {}
        }
        
        # 1. Remover espacios excesivos
        optimized = self._remove_extra_whitespace(prompt)
        results["optimizations"]["remove_whitespace"] = {
            "before": len(prompt),
            "after": len(optimized),
            "saved": len(prompt) - len(optimized)
        }
        prompt = optimized
        
        # 2. Remover palabras innecesarias
        optimized = self._remove_filler_words(prompt)
        results["optimizations"]["remove_filler"] = {
            "before": len(prompt),
            "after": len(optimized),
            "saved": len(prompt) - len(optimized)
        }
        prompt = optimized
        
        # 3. Comprimir instrucciones
        optimized = self._compress_instructions(prompt)
        results["optimizations"]["compress_instructions"] = {
            "before": len(prompt),
            "after": len(optimized),
            "saved": len(prompt) - len(optimized)
        }
        prompt = optimized
        
        # 4. Truncar si es necesario
        if len(prompt) > self.max_tokens:
            optimized = self._intelligent_truncate(prompt)
            results["optimizations"]["truncate"] = {
                "before": len(prompt),
                "after": len(optimized),
                "saved": len(prompt) - len(optimized)
            }
            prompt = optimized
        
        results["optimized_prompt"] = prompt
        results["final_length"] = len(prompt)
        results["reduction_percentage"] = (
            (results["original_length"] - results["final_length"]) / 
            results["original_length"] * 100
        )
        
        return results
    
    @staticmethod
    def _remove_extra_whitespace(text: str) -> str:
        """Remover múltiples espacios, tabs, newlines"""
        # Remover espacios al inicio/final de líneas
        text = '\n'.join(line.strip() for line in text.split('\n'))
        # Remover líneas vacías múltiples
        text = re.sub(r'\n\n+', '\n', text)
        # Remover espacios múltiples
        text = re.sub(r'  +', ' ', text)
        return text.strip()
    
    @staticmethod
    def _remove_filler_words(text: str) -> str:
        """Remover palabras que no agregan valor"""
        filler_words = [
            r'\bpor favor\b', r'\bgracias\b', r'\bsi\b',
            r'\bbueno\b', r'\basí que\b', r'\bsimplemente\b'
        ]
        
        result = text
        for pattern in filler_words:
            result = re.sub(pattern, '', result, flags=re.IGNORECASE)
        
        return PromptOptimizer._remove_extra_whitespace(result)
    
    @staticmethod
    def _compress_instructions(text: str) -> str:
        """Comprimir instrucciones sin perder claridad"""
        
        # Cambiar "Es muy importante que..." por "Debes..."
        text = re.sub(
            r'Es muy importante que\s+',
            'Debes ',
            text,
            flags=re.IGNORECASE
        )
        
        # Cambiar "Por lo tanto," por "Por tanto,"
        text = re.sub(r'\bPor lo tanto,\b', 'Por tanto,', text)
        
        # Abreviar enumeraciones
        text = re.sub(r'Primer paso:\s*', '1. ', text)
        text = re.sub(r'Segundo paso:\s*', '2. ', text)
        
        return text
    
    def _intelligent_truncate(self, text: str) -> str:
        """Truncar manteniendo contenido importante"""
        
        lines = text.split('\n')
        
        # Prioritizar líneas por importancia
        scored_lines = []
        for i, line in enumerate(lines):
            score = self._line_importance_score(line)
            # Penalizar líneas al final
            score *= (1 - i / len(lines) * 0.3)
            scored_lines.append((score, line))
        
        # Ordenar por importancia
        scored_lines.sort(reverse=True)
        
        # Reconstruir manteniendo orden original
        important_lines = set(line for _, line in scored_lines[:len(lines)//2])
        result = '\n'.join(
            line for line in lines if line in important_lines
        )
        
        return result[:self.max_tokens]
    
    @staticmethod
    def _line_importance_score(line: str) -> float:
        """Puntuar importancia de una línea"""
        
        score = 0.0
        
        # Marcadores de importancia
        importance_markers = {
            'CRÍTICO': 5.0,
            'IMPORTANTE': 3.0,
            'RECUERDA': 2.5,
            'ERROR': 3.0,
            'NUNCA': 2.0,
            'SIEMPRE': 1.5
        }
        
        for marker, points in importance_markers.items():
            if marker in line.upper():
                score += points
        
        # Penalizar comentarios muy largos
        if len(line) > 200:
            score *= 0.7
        
        return score

# Ejemplo de uso
prompt_original = """
Por favor, por lo tanto, es muy importante que lleves a cabo las siguientes tareas.

Primer paso: Debes analizar cuidadosamente la entrada del usuario.
Segundo paso: Debes verificar que los datos sean válidos.
Tercer paso: Debes procesar la información.

Recuerda que es crítico mantener la precisión.
Nunca ignores errores.
"""

optimizer = PromptOptimizer(max_tokens=500)
result = optimizer.optimize(prompt_original)

print(f"Reducción: {result['reduction_percentage']:.1f}%")
print(f"Original: {result['original_length']} chars")
print(f"Optimizado: {result['final_length']} chars")
print(f"\nPrompt optimizado:\n{result['optimized_prompt']}")
```

---

**Continúa leyendo el archivo principal `PLAN_CERTIFICACION_ARCHITECT.md` para más detalles.**
