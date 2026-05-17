/* EXPANDED SECTIONS WITH DETAILED CODE EXAMPLES */
/* This supplement adds comprehensive code blocks, workflows, and production patterns */

export const ALL_SECTIONS_CONTENT = {
  'agente-sdk': {
    codeBlocks: [
      {
        id: 'sdk-basic-agent',
        title: 'Agente básico con herramientas',
        lang: 'typescript',
        description: 'Un agente que puede leer archivos y ejecutar comandos bash',
        code: `import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: 'read_file',
    description: 'Lee el contenido de un archivo del sistema',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Ruta al archivo' }
      },
      required: ['path']
    }
  },
  {
    name: 'run_bash',
    description: 'Ejecuta un comando bash y devuelve stdout',
    input_schema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Comando a ejecutar' }
      },
      required: ['command']
    }
  }
];

async function runAgent(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage }
  ];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      tools,
      messages
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') break;

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          let result = 'Error: herramienta desconocida';
          try {
            if (block.name === 'read_file') {
              const input = block.input as { path: string };
              result = readFileSync(input.path, 'utf-8');
            } else if (block.name === 'run_bash') {
              const input = block.input as { command: string };
              result = execSync(input.command, { encoding: 'utf-8' });
            }
          } catch (error) {
            result = \`Error: \${(error as Error).message}\`;
          }

          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: result
          });
        }
      }

      messages.push({ role: 'user', content: toolResults });
    }
  }

  const text = messages[messages.length - 1];
  if (text.role === 'assistant' && Array.isArray(text.content)) {
    const textBlock = text.content.find(b => b.type === 'text');
    return textBlock?.type === 'text' ? textBlock.text : '';
  }
  return '';
}

// Uso
const resultado = await runAgent('¿Cuántas líneas de código hay en src/main.ts?');
console.log(resultado);`
      },
      {
        id: 'sdk-streaming',
        title: 'Agente con streaming de respuestas',
        lang: 'typescript',
        description: 'Mostrar respuestas parciales mientras Claude está procesando',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function agentWithStreaming(prompt: string) {
  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    stream: true,
    messages: [{ role: 'user', content: prompt }]
  });

  let fullResponse = '';

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        process.stdout.write(event.delta.text);
        fullResponse += event.delta.text;
      }
    }
    if (event.type === 'message_stop') {
      console.log('\\n--- Respuesta completa ---');
      console.log(fullResponse);
    }
  }

  return fullResponse;
}

// Uso: muestra el texto mientras se genera, útil para UIs
await agentWithStreaming('Explica qué es el patrón Factory en un párrafo');`
      },
      {
        id: 'sdk-multi-agent',
        title: 'Múltiples agentes en paralelo',
        lang: 'typescript',
        description: 'Orquesta sub-agentes especializados que trabajan en paralelo',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function runSpecialistAgent(
  role: string,
  task: string,
  context: string
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: \`Eres un experto en \${role}. Responde de forma concisa y técnica.\`,
    messages: [{
      role: 'user',
      content: \`Contexto: \${context}\\n\\nTarea: \${task}\`
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

async function orchestrateReview(prDiff: string) {
  const tasks = [
    { role: 'seguridad', task: 'Identifica vulnerabilidades y problemas de seguridad' },
    { role: 'calidad de código', task: 'Evalúa legibilidad, naming y patrones' },
    { role: 'performance', task: 'Detecta cuellos de botella y optimizaciones' }
  ];

  const results = await Promise.all(
    tasks.map(({ role, task }) =>
      runSpecialistAgent(role, task, prDiff)
    )
  );

  return {
    security: results[0],
    quality: results[1],
    performance: results[2]
  };
}

// Uso
const review = await orchestrateReview(prDiff);
console.log('Análisis de seguridad:', review.security);
console.log('Calidad del código:', review.quality);
console.log('Performance:', review.performance);`
      },
      {
        id: 'sdk-vision',
        title: 'Agente que analiza imágenes',
        lang: 'typescript',
        description: 'Procesa screenshots, diagramas y documentos visuales',
        code: `import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const client = new Anthropic();

async function analyzeScreenshot(imagePath: string, task: string): Promise<string> {
  const imageBuffer = readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');

  // Detectar tipo mime desde extensión
  const ext = imagePath.split('.').pop()?.toLowerCase();
  const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64
          }
        },
        {
          type: 'text',
          text: task
        }
      ]
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Uso
const analysis = await analyzeScreenshot(
  './error-screenshot.png',
  'Describe todos los errores visibles en esta screenshot de la app y propón fixes.'
);
console.log(analysis);`
      }
    ],
    workflows: [
      {
        id: 'workflow-pr-reviewer',
        title: 'Revisor automático de PRs con sub-agentes',
        steps: [
          {
            num: 1,
            title: 'Obtener diff del PR',
            command: 'git diff origin/main...HEAD'
          },
          {
            num: 2,
            title: 'Lanzar 3 agentes en paralelo',
            description: 'Seguridad, Calidad de código, Performance analizan simultáneamente'
          },
          {
            num: 3,
            title: 'Consolidar hallazgos',
            description: 'Agrupar por criticidad y generar reporte estructurado'
          },
          {
            num: 4,
            title: 'Comentar en GitHub',
            description: 'Usar GitHub API para publicar feedback automáticamente'
          }
        ]
      }
    ],
    commonPitfalls: [
      'No manejar timeouts en agentes lentos',
      'No usar tool_choice para forzar herramientas cuando sea necesario',
      'No verificar el stop_reason (puede ser "tool_use", "end_turn" o "max_tokens")',
      'No persistir estado entre llamadas cuando se necesita memoria'
    ]
  },

  'api-anthropic': {
    codeBlocks: [
      {
        id: 'api-tool-use',
        title: 'Tool Use completo',
        lang: 'typescript',
        description: 'Implementación de tool use con loop iterativo',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Obtiene el clima actual para una ciudad',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'Nombre de la ciudad' },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Unidad de temperatura'
        }
      },
      required: ['city']
    }
  },
  {
    name: 'search_database',
    description: 'Busca registros en la base de datos',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', default: 10 }
      },
      required: ['query']
    }
  }
];

function get_weather(city: string, unit = 'celsius') {
  return { city, temp: 22, unit, condition: 'soleado' };
}

function search_database(query: string, limit = 10) {
  return { results: [\`Resultado para: \${query}\`], total: 1 };
}

async function chat(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage }
  ];

  let response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    tools,
    messages
  });

  while (response.stop_reason === 'tool_use') {
    messages.push({ role: 'assistant', content: response.content });

    const results: Anthropic.ToolResultBlockParam[] = response.content
      .filter(b => b.type === 'tool_use')
      .map(block => {
        const b = block as Anthropic.ToolUseBlock;
        const input = b.input as Record<string, any>;

        const result = b.name === 'get_weather'
          ? get_weather(input.city, input.unit)
          : search_database(input.query, input.limit);

        return {
          type: 'tool_result' as const,
          tool_use_id: b.id,
          content: JSON.stringify(result)
        };
      });

    messages.push({ role: 'user', content: results });

    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools,
      messages
    });
  }

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : '';
}

const respuesta = await chat('¿Qué clima hace en Madrid? Usa Celsius.');
console.log(respuesta);`
      },
      {
        id: 'api-streaming',
        title: 'Streaming con manejo de eventos',
        lang: 'typescript',
        description: 'Procesar respuestas parciales en tiempo real',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function streamingExample(prompt: string) {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });

  // Escuchar eventos del stream
  stream.on('text', (text) => {
    process.stdout.write(text);  // Mostrar texto conforme llega
  });

  stream.on('message', (message) => {
    console.log('\\n--- Mensaje completo ---');
    console.log('Stop reason:', message.stop_reason);
    console.log('Tokens entrada:', message.usage.input_tokens);
    console.log('Tokens salida:', message.usage.output_tokens);
  });

  // O usar async iterator
  let fullText = '';
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullText += chunk.delta.text;
    }
  }

  return fullText;
}

await streamingExample('Genera un plan de 5 pasos para aprender TypeScript');`
      },
      {
        id: 'api-batch-processing',
        title: 'Batch API para procesamiento masivo',
        lang: 'typescript',
        description: 'Procesar 10K solicitudes con 50% de descuento',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function processBatch(tickets: string[]) {
  // Crear batch con múltiples solicitudes
  const batch = await client.messages.batches.create({
    requests: tickets.map((ticket, idx) => ({
      custom_id: \`ticket-\${idx}\`,
      params: {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: \`Clasifica la severidad (critica/alta/media/baja): "\${ticket}"\`
        }]
      }
    }))
  });

  console.log('Batch ID:', batch.id);
  console.log('Estado inicial:', batch.processing_status);

  // Polling hasta completación
  let result = batch;
  let pollCount = 0;
  while (result.processing_status === 'processing') {
    await new Promise(r => setTimeout(r, 10000));  // Esperar 10s
    result = await client.messages.batches.retrieve(batch.id);
    pollCount++;
    console.log(\`Poll \${pollCount}: procesadas \${result.request_counts.succeeded} de \${tickets.length}\`);
  }

  // Descargar resultados
  const classifications = new Map();
  for await (const item of client.messages.batches.results(batch.id)) {
    if (item.result.type === 'succeeded') {
      const content = item.result.message.content[0];
      const text = content.type === 'text' ? content.text : '';
      classifications.set(item.custom_id, text);
    } else if (item.result.type === 'errored') {
      console.error(\`Error en \${item.custom_id}:\`, item.result.error);
    }
  }

  return classifications;
}

// Uso
const tickets = [
  'App crashes on login',
  'Button text is slightly misaligned',
  'Database connection timeout',
  'Typo in welcome message'
];

const results = await processBatch(tickets);
results.forEach((classification, id) => {
  console.log(\`\${id}: \${classification}\`);
});`
      },
      {
        id: 'api-files',
        title: 'Files API para documentos persistentes',
        lang: 'typescript',
        description: 'Subir documentos una sola vez y reutilizarlos',
        code: `import Anthropic from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const client = new Anthropic();

async function analyzeDocumentWithFileAPI() {
  // Subir documento una sola vez
  const file = await client.beta.files.upload({
    file: createReadStream('./arquitectura-sistema.pdf')
  });

  console.log('File ID creado:', file.id);

  // Función para reutilizar el archivo sin re-subir
  async function queryDocument(question: string) {
    const response = await client.beta.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: file.id
            }
          },
          {
            type: 'text',
            text: question
          }
        ]
      }],
      betas: ['files-api-2025-04-14']
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  // Múltiples preguntas sobre el mismo documento
  const q1 = await queryDocument('¿Cuál es la arquitectura general del sistema?');
  console.log('Pregunta 1:', q1);

  const q2 = await queryDocument('¿Cuáles son los componentes críticos?');
  console.log('Pregunta 2:', q2);

  const q3 = await queryDocument('¿Cómo se maneja la autenticación?');
  console.log('Pregunta 3:', q3);

  // Limpiar cuando ya no se necesita
  await client.beta.files.delete(file.id);
  console.log('Archivo eliminado');
}

await analyzeDocumentWithFileAPI();`
      },
      {
        id: 'api-prompt-caching',
        title: 'Prompt Caching para ahorrar costos (90%)',
        lang: 'typescript',
        description: 'Reutilizar prompts largos sin volver a procesarlos',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Un prompt base muy largo (ej: especificación del sistema)
const SYSTEM_SPECIFICATION = \`
# Especificación del Sistema E-commerce

## Stack técnico
- Frontend: Next.js 14 con TypeScript
- Backend: Node.js con Fastify
- Database: PostgreSQL 16
- Cache: Redis
- Search: Elasticsearch

## Módulos principales
1. Auth: OAuth2 + JWT
2. Products: Catálogo con búsqueda
3. Cart: Carrito persistente
4. Checkout: Procesamiento de pagos
5. Orders: Historial y tracking
6. Admin: Panel de gestión

[... 50 páginas más de especificaciones ...]\`;

async function analyzeWithCaching(question: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: 'Eres un arquitecto de sistemas experto.'
      },
      {
        type: 'text',
        text: SYSTEM_SPECIFICATION,
        cache_control: { type: 'ephemeral' }  // CACHE!
      }
    ],
    messages: [{
      role: 'user',
      content: question
    }]
  });

  console.log('Cache creado:', response.usage.cache_creation_input_tokens);
  console.log('Cache leído:', response.usage.cache_read_input_tokens);
  console.log('Tokens nuevos:', response.usage.input_tokens);

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Primera llamada: crear caché
const ans1 = await analyzeWithCaching('¿Cómo funciona la autenticación?');
console.log(ans1);

// Segunda llamada: REUTILIZA caché (ahorro 90%)
const ans2 = await analyzeWithCaching('¿Cuál es el flujo de checkout?');
console.log(ans2);`
      },
      {
        id: 'api-vision',
        title: 'Vision API con imágenes y PDFs',
        lang: 'typescript',
        description: 'Analizar screenshots, diagramas y documentos visuales',
        code: `import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

const client = new Anthropic();

async function analyzeImage(imagePath: string, task: string) {
  const imageBuffer = readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');

  const ext = imagePath.split('.').pop()?.toLowerCase();
  const mediaType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64
          }
        },
        {
          type: 'text',
          text: task
        }
      ]
    }]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Analizar un screenshot de UI
const uiAnalysis = await analyzeImage(
  './dashboard-screenshot.png',
  'Describe el layout, colores, accesibilidad. ¿Tiene problemas visuales?'
);
console.log('Análisis de UI:', uiAnalysis);

// Analizar un diagrama de arquitectura
const archAnalysis = await analyzeImage(
  './architecture-diagram.png',
  'Explica los componentes y flujos de comunicación que ves en este diagrama.'
);
console.log('Análisis de arquitectura:', archAnalysis);`
      },
      {
        id: 'api-error-handling',
        title: 'Manejo robusto de errores y retry',
        lang: 'typescript',
        description: 'Estrategia de reintentos exponencial y manejo de errores',
        code: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  maxRetries: 3,
  timeout: 30_000
});

async function robustRequest(prompt: string, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      });
      return response;
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        // 429: Rate limit, 529: Server overloaded
        if (error.status === 429 || error.status === 529) {
          if (attempt < maxAttempts) {
            const delay = Math.pow(2, attempt) * 1000;  // Backoff exponencial
            console.log(\`Reintentando en \${delay}ms...\`);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
        }
        // 401: Autenticación fallida
        if (error.status === 401) {
          throw new Error('API Key inválida o expirada');
        }
        // 500: Error del servidor
        if (error.status >= 500) {
          if (attempt < maxAttempts) {
            const delay = 5000 * attempt;
            console.log(\`Error \${error.status}, reintentando...\`);
            await new Promise(r => setTimeout(r, delay));
            continue;
          }
        }
      }
      // Otros errores: no reintentar
      throw error;
    }
  }
}

try {
  const result = await robustRequest('¿Hola?');
  console.log(result);
} catch (error) {
  console.error('Falló después de reintentos:', error);
}`
      }
    ],
    workflows: [
      {
        id: 'workflow-batch-classification',
        title: 'Clasificación masiva de tickets con Batch API',
        steps: [
          {
            num: 1,
            title: 'Preparar dataset',
            description: 'Cargar 1000+ tickets de soporte desde BD'
          },
          {
            num: 2,
            title: 'Crear batch request',
            description: 'Generar JSON con 1000 solicitudes a Claude Haiku'
          },
          {
            num: 3,
            title: 'Enviar y esperar',
            description: 'Puede tardar minutos; usar webhook o polling'
          },
          {
            num: 4,
            title: 'Procesar resultados',
            description: 'Guardar clasificaciones en BD con timestamp'
          }
        ],
        benefits: [
          '50% de ahorro en tokens',
          'Procesamiento de 10K solicitudes',
          'Ideal para tareas off-peak'
        ]
      }
    ],
    commonPitfalls: [
      'No verificar stop_reason (puede causar loops infinitos)',
      'Olvidar que tool_use requiere un loop iterativo',
      'No manejar streaming.message_stop correctamente',
      'Intentar reutilizar File IDs después de eliminarlos',
      'No usar cache_control en prompts largos (perder ahorros)',
      'Timeout muy bajo para tareas complejas (>120s recomen)'
    ]
  },

  'nivel-4': {
    title: 'Nivel 4: Maestría Práctica en Producción',
    sections: [
      {
        id: 'production-patterns',
        title: 'Patrones de producción',
        patterns: [
          {
            name: 'Multi-region deployments',
            description: 'Distribuir agentes Claude en múltiples regiones para baja latencia',
            example: 'Usar API endpoints en us-east, eu-west, ap-southeast con fallover'
          },
          {
            name: 'Rate limiting inteligente',
            description: 'Controlar concurrencia por usuario y prioridad',
            example: 'VIP users: 1000 req/min, Standard: 100 req/min'
          },
          {
            name: 'Telemetría y observabilidad',
            description: 'Medir tokens, latencia, costo por sesión',
            example: 'Enviar métricas a DataDog/NewRelic cada 30s'
          }
        ]
      },
      {
        id: 'scaling-strategies',
        title: 'Estrategias de escalado',
        strategies: [
          {
            name: 'Vertical: usar Batch API',
            description: 'Para tareas asincrónicas, procesar 10K req a la vez',
            when: 'Procesamiento nocturno, análisis masivo'
          },
          {
            name: 'Horizontal: múltiples workers',
            description: 'Desplegar 10+ instancias del agente detrás de queue',
            when: 'Picos de tráfico impredecibles'
          },
          {
            name: 'Híbrido: cache + streaming',
            description: 'Prompt caching para prompts comunes, streaming para UX',
            when: 'Aplicación web con chat activo'
          }
        ]
      },
      {
        id: 'security-hardening',
        title: 'Hardening de seguridad',
        checklist: [
          'No guardar API keys en env archivos versionados',
          'Rotar secrets cada 90 días',
          'Usar IAM roles en lugar de API keys estáticas',
          'Loguear todas las llamadas con user ID y timestamp',
          'Rate limit por API key: máx 100 req/min',
          'Validar y escapar inputs antes de pasar a Claude',
          'Monitorear tokens consumidos por usuario (potencial abuso)',
          'Usar .claudeignore para excluir secretos y código privado'
        ]
      }
    ],
    codeBlocks: [
      {
        id: 'level4-production-agent',
        title: 'Agente production-ready con logging y observabilidad',
        lang: 'typescript',
        code: `import Anthropic from '@anthropic-ai/sdk';
import * as winston from 'winston';

// Logger centralizado
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  maxRetries: 2,
  timeout: 30_000
});

interface SessionMetrics {
  userId: string;
  startTime: number;
  tokensInput: number;
  tokensOutput: number;
  estimatedCost: number;
  duration: number;
}

async function productionAgent(userId: string, prompt: string): Promise<string> {
  const startTime = Date.now();
  let metrics: SessionMetrics = {
    userId,
    startTime,
    tokensInput: 0,
    tokensOutput: 0,
    estimatedCost: 0,
    duration: 0
  };

  try {
    logger.info('Session start', { userId, timestamp: new Date().toISOString() });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
    });

    // Capturar métricas
    metrics.tokensInput = response.usage.input_tokens;
    metrics.tokensOutput = response.usage.output_tokens;
    // Sonnet: ~$3 / 1M input, ~$15 / 1M output
    metrics.estimatedCost = (
      (metrics.tokensInput / 1_000_000) * 3 +
      (metrics.tokensOutput / 1_000_000) * 15
    );
    metrics.duration = Date.now() - startTime;

    logger.info('Session complete', { userId, metrics });

    // Enviar a observabilidad (Datadog, etc)
    sendMetrics(metrics);

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return text;
  } catch (error) {
    metrics.duration = Date.now() - startTime;
    logger.error('Session failed', {
      userId,
      error: error instanceof Error ? error.message : String(error),
      metrics
    });
    throw error;
  }
}

function sendMetrics(metrics: SessionMetrics) {
  // Enviar a Datadog/NewRelic
  console.log('📊 Métricas:', \`
    Usuario: \${metrics.userId}
    Tokens entrada: \${metrics.tokensInput}
    Tokens salida: \${metrics.tokensOutput}
    Costo estimado: \$\${metrics.estimatedCost.toFixed(4)}
    Duración: \${metrics.duration}ms
  \`);
}

// Uso
await productionAgent('user-12345', 'Refactoriza este código a TypeScript...');`
      },
      {
        id: 'level4-rate-limiting',
        title: 'Rate limiting y quota management',
        lang: 'typescript',
        code: `import Anthropic from '@anthropic-ai/sdk';

interface UserQuota {
  userId: string;
  tokensUsedToday: number;
  dailyLimit: number;  // p.ej. 100_000
  lastReset: Date;
}

const quotaStore = new Map<string, UserQuota>();

async function checkAndUpdateQuota(userId: string, estimatedTokens: number) {
  let quota = quotaStore.get(userId);

  // Inicializar si no existe
  if (!quota) {
    quota = {
      userId,
      tokensUsedToday: 0,
      dailyLimit: 100_000,  // Default
      lastReset: new Date()
    };
    quotaStore.set(userId, quota);
  }

  // Reset si pasó un día
  const now = new Date();
  if (now.getTime() - quota.lastReset.getTime() > 24 * 60 * 60 * 1000) {
    quota.tokensUsedToday = 0;
    quota.lastReset = now;
  }

  // Verificar límite
  if (quota.tokensUsedToday + estimatedTokens > quota.dailyLimit) {
    throw new Error(
      \`Cuota diaria excedida. Usado: \${quota.tokensUsedToday}, Límite: \${quota.dailyLimit}\`
    );
  }

  // Usar tier personalizado para VIP
  if (userId.startsWith('vip_')) {
    quota.dailyLimit = 1_000_000;
  }

  return quota;
}

async function safeLimitedRequest(userId: string, prompt: string) {
  const estimatedTokens = prompt.length / 4;  // Aproximación rápida

  const quota = await checkAndUpdateQuota(userId, estimatedTokens);
  console.log(\`Tokens disponibles: \${quota.dailyLimit - quota.tokensUsedToday}\`);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });

  // Actualizar quota con tokens reales
  quota.tokensUsedToday += response.usage.input_tokens + response.usage.output_tokens;
  console.log(\`Tokens después: \${quota.tokensUsedToday} / \${quota.dailyLimit}\`);

  return response;
}

// Uso
try {
  await safeLimitedRequest('user-12345', 'Tu prompt...');
} catch (error) {
  if ((error as Error).message.includes('Cuota')) {
    console.log('Usuario agotó su cuota hoy');
  }
}`
      }
    ]
  }
};


export default ALL_SECTIONS_CONTENT;
