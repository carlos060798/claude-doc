# Testing Asistido — Nivel 2

> TDD inverso. Generar tests de código existente. Métricas de cobertura. CI pipeline para tests automáticos.

## Introducción

Testing manual es tedioso. Testing por IA es rápido y confiable. Esta sección te enseña a:

- Generar tests de código existente (TDD inverso)
- Alcanzar 80%+ cobertura en 30 minutos
- Configurar CI automático para tests
- Documentar casos críticos

**Tiempo estimado:** 60 minutos  
**Requisitos:** Conocimiento de Jest/Vitest, CI básico  
**Nivel de dificultad:** Intermedio-avanzado

---

## 1. TDD Inverso (Código → Tests)

### Concepto

Tradicionalmente:
```
Tests PRIMERO → Código para pasar tests
```

Con IA:
```
Código EXISTENTE → Tests de cobertura
```

### Flujo típico

#### Paso 1: Prepara el código

```typescript
// src/utils/calculateDiscount.ts
export function calculateDiscount(
  price: number,
  discountPercent: number,
  minQuantity?: number,
  quantity: number = 1
): number {
  if (price < 0 || discountPercent < 0) {
    throw new Error('Invalid inputs');
  }
  
  if (minQuantity && quantity < minQuantity) {
    return price * quantity;
  }
  
  const discountAmount = price * (discountPercent / 100);
  return (price - discountAmount) * quantity;
}
```

#### Paso 2: Describe a Claude

```
CÓDIGO A TESTEAR:
[Pega función]

FRAMEWORK: Jest
COBERTURA OBJETIVO: 100% líneas, 90% branches

CASOS CRÍTICOS:
- Inputs válidos
- Edge cases (0, negativos, undefined)
- Errores esperados
- Branch logic (minQuantity)

ENTREGA:
[tests.ts con tests organizados por categoría]
```

#### Paso 3: Integra tests

```bash
npm test
# PASS  src/utils/__tests__/calculateDiscount.test.ts
#   calculateDiscount
#     ✓ Happy path: válido descuento
#     ✓ No aplica si cantidad < minQuantity
#     ✓ Lanza error si precio negativo
#     ✓ Lanza error si descuento negativo
#     ✓ Maneja undefined quantity
#
# Test Suites: 1 passed, 1 total
# Coverage: 100% lines, 100% branches
```

---

## 2. Generar Tests de Código Existente

### Template: Prompt para generar tests

```
# CONTEXTO
Framework: Jest
Testing library: React Testing Library (si es componente)
TypeScript: Sí
Ubicación: __tests__/[nombre].test.ts

# CÓDIGO A TESTEAR
[Pega función/componente completo]

# REQUISITOS
1. Cobertura: [80/90/100]% líneas
2. Cobertura branches: [70/80]%
3. Incluir: Happy path, edge cases, errores
4. Organized by: Feature/behavior (describe blocks)
5. Cada test: 1 expectation principal

# CASOS ESPECÍFICOS A VALIDAR
- [Caso 1: X debe retornar Y]
- [Caso 2: Si Z, entonces error W]
- [Caso 3: Cuando input edge, comportamiento especial]

# FORMATO
[Jest test file con imports, describe, it, expect]
```

### Ejemplo 1: Función pura

**Entrada:**
```javascript
// Función: validar email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Salida (generada por Claude):**
```javascript
describe('isValidEmail', () => {
  describe('válidos', () => {
    it('acepta email estándar', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });
    
    it('acepta email con números', () => {
      expect(isValidEmail('user123@example.co.uk')).toBe(true);
    });
    
    it('acepta email con caracteres especiales permitidos', () => {
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });
  });
  
  describe('inválidos', () => {
    it('rechaza sin @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });
    
    it('rechaza sin dominio', () => {
      expect(isValidEmail('user@')).toBe(false);
    });
    
    it('rechaza espacios', () => {
      expect(isValidEmail('user @example.com')).toBe(false);
    });
    
    it('rechaza string vacío', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });
  
  describe('edge cases', () => {
    it('rechaza null/undefined', () => {
      expect(() => isValidEmail(null)).toThrow();
      expect(() => isValidEmail(undefined)).toThrow();
    });
  });
});
```

### Ejemplo 2: Componente React

**Entrada:**
```jsx
function Button({ onClick, disabled, children, variant = 'primary' }) {
  const className = `btn btn--${variant} ${disabled ? 'btn--disabled' : ''}`;
  
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${variant} button`}
    >
      {children}
    </button>
  );
}
```

**Salida (generada por Claude):**
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  describe('rendering', () => {
    it('renderiza con texto', () => {
      render(<Button>Haz clic</Button>);
      expect(screen.getByText('Haz clic')).toBeInTheDocument();
    });
    
    it('aplica className por variant', () => {
      const { container } = render(<Button variant="secondary">Test</Button>);
      expect(container.querySelector('.btn--secondary')).toBeInTheDocument();
    });
    
    it('aplica clase disabled cuando disabled=true', () => {
      const { container } = render(<Button disabled>Test</Button>);
      expect(container.querySelector('.btn--disabled')).toBeInTheDocument();
    });
  });
  
  describe('interacción', () => {
    it('llama onClick cuando se hace clic', () => {
      const mockClick = jest.fn();
      render(<Button onClick={mockClick}>Click</Button>);
      fireEvent.click(screen.getByText('Click'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
    
    it('no llama onClick si disabled', () => {
      const mockClick = jest.fn();
      render(<Button disabled onClick={mockClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(mockClick).not.toHaveBeenCalled();
    });
  });
  
  describe('a11y', () => {
    it('tiene aria-label', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });
    
    it('tiene atributo disabled cuando disabled=true', () => {
      render(<Button disabled>Test</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
```

---

## 3. Métricas de Cobertura

### Configurar reporte de cobertura

#### Jest (package.json)

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/index.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### Ejecutar

```bash
npm test -- --coverage

# Output:
# ─────────────────────────────────────────────────────────────────────────────
# File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
# ─────────────────────────────────────────────────────────────────────────────
# All files    |   87.5  |   85.0   |   90.0  |   87.5  |
#  calculateDiscount.ts |  100    |   100    |   100   |   100    |
#  validateEmail.ts     |   75    |   60     |   80    |   75     | 12,18-22
# ─────────────────────────────────────────────────────────────────────────────
```

### Interpretar métricas

| Métrica | Qué mide | Objetivo |
|---------|----------|----------|
| **Lines** | Líneas de código ejecutadas | 80%+ |
| **Statements** | Sentencias ejecutadas | 80%+ |
| **Branches** | Caminos if/else ejecutados | 75%+ (más difícil) |
| **Functions** | Funciones llamadas | 80%+ |

**Regla:** Si branches < lines, tienes lógica condicional sin testear.

### Mejorar cobertura

```javascript
// Cobertura inicial: 75% (falta branch cuando x < 0)

function process(x) {
  if (x < 0) {
    throw new Error('Negativo');
  }
  return x * 2;
}

// Agregando test para rama no cubierta:
test('lanza error si negativo', () => {
  expect(() => process(-5)).toThrow('Negativo');
});

// Cobertura final: 100%
```

---

## 4. CI Pipeline para Tests Automáticos

### GitHub Actions (ejemplo)

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          fail_ci_if_error: true
      
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | grep '"lines"' | head -1 | grep -o '[0-9]*\.[0-9]*' | head -1)
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% es menor a 80%"
            exit 1
          fi
      
      - name: Report results
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            core.notice('Tests completados. Ver workflow para cobertura.')
```

### Ejecución local antes de push

```bash
# Ejecutar tests + coverage
npm test -- --coverage

# Fallar si no cumple threshold
# (Jest falla automáticamente si threshold no se cumple)
```

---

## 5. Test Suite Completo por Tipo

### Suite 1: Función matemática

```typescript
describe('calculateDiscount', () => {
  test.each([
    { price: 100, discount: 10, quantity: 1, expected: 90 },
    { price: 100, discount: 10, quantity: 2, expected: 180 },
    { price: 50, discount: 0, quantity: 1, expected: 50 },
  ])('calcula $price - $discount% × $quantity = $expected', 
    ({ price, discount, quantity, expected }) => {
      expect(calculateDiscount(price, discount, 1, quantity)).toBe(expected);
    }
  );
  
  test('lanza si precio negativo', () => {
    expect(() => calculateDiscount(-100, 10, 1, 1)).toThrow();
  });
  
  test('retorna precio sin descuento si cantidad < minQuantity', () => {
    expect(calculateDiscount(100, 10, 10, 5)).toBe(500);
  });
});
```

### Suite 2: API endpoint

```javascript
describe('POST /users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('crea usuario con email válido', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'Pass123!' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });
  
  test('retorna 400 si email inválido', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'invalid-email', password: 'Pass123!' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('email');
  });
  
  test('retorna 409 si email ya existe', async () => {
    // Primero crear usuario
    await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'Pass123!' });
    
    // Intentar crear duplicado
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'Pass123!' });
    
    expect(response.status).toBe(409);
  });
  
  test('no retorna password en respuesta', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'Pass123!' });
    
    expect(response.body).not.toHaveProperty('password');
  });
});
```

### Suite 3: Componente con estado

```jsx
describe('LoginForm', () => {
  test('renderiza campos de email y password', () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
  
  test('valida email en tiempo real', async () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    const emailInput = screen.getByLabelText(/email/i);
    
    await userEvent.type(emailInput, 'invalid');
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'test@example.com');
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });
  
  test('desabilita submit si formulario inválido', () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
  
  test('habilita submit si válido y llama onSubmit', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Pass123!');
    
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Pass123!'
    });
  });
});
```

---

## 6. Checklist para Tests Generados

Antes de agregar tests al código:

- [ ] ¿Cubren happy path?
- [ ] ¿Cubren edge cases (null, undefined, 0, "")?
- [ ] ¿Cubren errores esperados?
- [ ] ¿Cubren branches principales?
- [ ] ¿Cobertura >= 80%?
- [ ] ¿Tests son independientes?
- [ ] ¿Nombres son descriptivos?
- [ ] ¿Sin lógica duplicada?
- [ ] ¿Sin mocks innecesarios?
- [ ] ¿Ejecutan localmente sin fallos?

---

## Resumen

**4 ideas clave:**
1. **TDD inverso** (código → tests) es más rápido con IA
2. **Cobertura 80%+** alcanzable en 1-2 horas
3. **CI automático** previene regresiones
4. **Métricas claras** (lines, branches, functions)

**Próximo:** Nivel 2 → Gobernanza y Políticas

**Estado:** Lección completada. Próximo checkpoint: Quiz Nivel 2.
