# API Integration Guide — FASE 7 Agent SDK

## 🔗 Backend Integration (Unified Project)

El backend del Agent SDK está ahora integrado en el mismo proyecto Next.js usando **Next.js API Routes**.

### Architecture

```
localhost:3000
├── / (Frontend - SPA)
│   ├── index.html
│   ├── script.js (quiz-engine.js)
│   └── styles.css
│
└── /api/quiz (Backend - API Routes)
    └── /evaluate (POST)
        └── Evaluator Agent
```

---

## 📡 API Endpoint

### **POST /api/quiz/evaluate**

Evaluate a quiz answer with intelligent feedback.

**Request:**
```typescript
interface EvaluatorInput {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  questionContext: {
    level: 1 | 2 | 3 | 4;
    topic: string;
    category: string;
    expectedKeywords?: string[];
  };
  options?: string[];
}
```

**Response:**
```typescript
interface EvaluatorOutput {
  questionId: string;
  verdict: "correct" | "incorrect" | "partial" | "needs_review";
  confidence: number;
  explanation: string;
  sourceUrl?: string;
  keyPoints: string[];
  remedials?: {
    gap: string;
    resources: Array<{
      type: "lesson" | "docs" | "example" | "practice";
      url: string;
      description: string;
    }>;
    practiceHint: string;
  };
  processingTimeMs: number;
}
```

---

## 🔧 Integration with quiz-engine.js

Update `modules/quiz-engine.js` to call the API:

```javascript
// In quiz-engine.js, add new method:

async submitQuizWithAgent(level, answers) {
  const quiz = this.QUIZZES[level];
  if (!quiz) return null;

  const feedback = [];
  
  for (let i = 0; i < answers.length; i++) {
    const userAnswer = answers[i];
    const question = quiz[i];
    
    try {
      // Call API endpoint
      const response = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question.id,
          userAnswer: quiz[question.correct].toString(),
          correctAnswer: question.correct.toString(),
          questionContext: {
            level,
            topic: 'Claude Code',
            category: 'quiz',
            expectedKeywords: question.keywords || [],
          },
          options: question.options,
        }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const evaluation = await response.json();
      feedback.push(evaluation);
    } catch (error) {
      console.error('Agent evaluation failed:', error);
      // Fallback to local evaluation
      feedback.push({
        verdict: userAnswer === question.correct ? 'correct' : 'incorrect',
        explanation: 'Local evaluation (agent unavailable)',
        confidence: 0.5,
      });
    }
  }

  // Save result with agent feedback
  const progress = this.getProgress();
  progress.quizResults[level] = {
    timestamp: new Date().toISOString(),
    score: feedback.filter(f => f.verdict === 'correct').length,
    total: quiz.length,
    feedback: feedback, // Agent feedback included
    answers: answers,
  };
  
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  return progress.quizResults[level];
}
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs Next.js, React, and the Anthropic SDK.

### 2. Set API Key

Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
```

Get your key from: https://console.anthropic.com/

### 3. Start Development Server

```bash
npm run dev
```

Server runs on http://localhost:3000

### 4. Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/quiz/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "q-L1-install-001",
    "userAnswer": "0",
    "correctAnswer": "0",
    "questionContext": {
      "level": 1,
      "topic": "Installation",
      "category": "fundamentals"
    },
    "options": [
      "npm install -g @anthropic-ai/claude-code",
      "pip install claude-code",
      "brew install claude-code",
      "apt-get install claude-code"
    ]
  }'
```

Expected response:
```json
{
  "questionId": "q-L1-install-001",
  "verdict": "correct",
  "confidence": 0.99,
  "explanation": "Correct! npm install -g @anthropic-ai/claude-code is the official installation method...",
  "keyPoints": ["npm is Node Package Manager", "Global flag -g installs CLI tool"],
  "processingTimeMs": 1234
}
```

---

## 📊 Frontend Integration

The quiz system can use either:

1. **Local Evaluation** (current)
   - Hardcoded feedback
   - No API calls
   - Fast but static

2. **Agent Evaluation** (NEW)
   - Call `/api/quiz/evaluate`
   - Intelligent feedback
   - Slower but dynamic

### Switching to Agent Evaluation

In `index.html`, change the quiz submission:

```html
<!-- BEFORE: Local evaluation -->
<button onclick="quizEngine.submitQuiz(currentLevel, 'quizContainer-' + currentLevel)">
  Enviar Quiz
</button>

<!-- AFTER: Agent evaluation -->
<button onclick="quizEngine.submitQuizWithAgent(currentLevel, getSelectedAnswers())">
  Enviar Quiz (con IA)
</button>
```

---

## 🔄 Deployment to Vercel

Since everything is in one Next.js project:

```bash
vercel deploy --prod
```

Vercel automatically:
- ✅ Builds the Next.js app
- ✅ Deploys API routes to `/api/*`
- ✅ Sets up environment variables from `.env.local`

---

## 📈 Next Steps

### PHASE 1.4: Testing
- [ ] Unit tests for API endpoint
- [ ] Integration tests with frontend
- [ ] Load testing

### PHASE 2: Coach Agent
- [ ] Create `/api/quiz/coach` endpoint
- [ ] Analyze user progress
- [ ] Recommend next steps

### PHASE 3: Generator Agent
- [ ] Create `/api/quiz/generate` endpoint
- [ ] Generate adaptive questions

---

## ✅ Checklist

- [ ] `.env.local` created with API key
- [ ] `npm install` completed
- [ ] `npm run dev` running without errors
- [ ] `/api/quiz/evaluate` endpoint tested
- [ ] Frontend integrated with API calls
- [ ] Ready to deploy to Vercel

---

**Status**: ✅ PHASE 1 Backend integrated into Next.js  
**Next**: PHASE 1.4 Testing & Frontend integration
