# React Component Architecture Map

This document provides a complete mapping of HTML elements to React components for converting the SPA to React.

---

## Component Hierarchy

```
<App>
  ├─ <Header>
  │  └─ Branding + Mode toggle (technical/accessible)
  │
  ├─ <Sidebar>
  │  └─ <NavLink /> × 31 sections
  │     ├─ Section 1: Fundamentos
  │     ├─ Section 2: Avanzado/MCP
  │     ├─ Section 3: Experto/Skills
  │     └─ ... (recursive groups)
  │
  ├─ <MainContent>
  │  ├─ <Router> (URL + section navigation)
  │  │
  │  ├─ <Dashboard />
  │  ├─ <Curso />
  │  ├─ <Desafios />
  │  ├─ <FlujosDev />
  │  ├─ <Nivel1 />
  │  ├─ <Nivel2 />
  │  ├─ <Nivel3 />
  │  ├─ <Nivel4 />
  │  ├─ <AgenteSDK />
  │  ├─ <ApiAnthropicGuide />
  │  ├─ <SkillsAvanzados />
  │  ├─ <CICD />
  │  ├─ <Cheatsheet />
  │  ├─ <Capstone />
  │  ├─ <CasosUso />
  │  ├─ <MejoresPracticas />
  │  ├─ <GitWorkflows />
  │  ├─ <MCPUseCases />
  │  ├─ <HooksProduction />
  │  ├─ <MultiMCPOrchestration />
  │  ├─ <Branching />
  │  ├─ <Rules />
  │  ├─ <Memory />
  │  ├─ <Patrones />
  │  ├─ <Memoria />
  │  ├─ <Seguridad />
  │  ├─ <Terminal />
  │  ├─ <IntroAcc />
  │  ├─ <CasosRol />
  │  └─ <Glosario />
  │
  └─ <Footer>
     └─ Links + metadata
```

---

## Base Components (Reusable)

### 1. **SectionHeader**
```tsx
interface SectionHeaderProps {
  breadcrumb: string;
  title: string;
  lead: string;
  subtitle?: string;
}

<SectionHeader
  breadcrumb="Inicio / Dashboard"
  title="Bienvenido a la Guía de Claude Code"
  lead="Domina la herramienta agéntica..."
/>
```
**Usage:** Every section has one  
**Render:** Breadcrumb, h2, p.section-lead  
**Styling:** CSS grid for alignment

---

### 2. **CodeBlock**
```tsx
interface CodeBlockProps {
  lang: 'bash' | 'json' | 'typescript' | 'markdown' | 'text';
  title?: string;
  code: string;
  copyable?: boolean;
  height?: number;
  showLineNumbers?: boolean;
}

<CodeBlock
  lang="bash"
  title="Instalación vía npm"
  code={`npm install -g @anthropic-ai/claude-code`}
/>
```
**Usage:** Every section with code  
**Features:**
- Syntax highlighting via language + regex patterns (SYNTAX_RULES)
- Copy button (auto-added)
- Optional title bar
- Line numbers (optional)
- Scrollable container
- Responsive sizing

**Implementation:**
```tsx
const CodeBlock: React.FC<CodeBlockProps> = ({
  lang,
  title,
  code,
  copyable = true
}) => {
  const highlightCode = (code: string, lang: string) => {
    // Apply SYNTAX_RULES[lang] regex patterns
    // Return highlighted HTML
  };

  return (
    <div className={`code-block code-block--${lang}`}>
      {title && <div className="code-block-title">{title}</div>}
      <pre><code dangerouslySetInnerHTML={{
        __html: highlightCode(code, lang)
      }} /></pre>
      {copyable && <CopyButton text={code} />}
    </div>
  );
};
```

---

### 3. **InfoBanner**
```tsx
interface InfoBannerProps {
  type: 'tip' | 'warn' | 'error' | 'info';
  title: string;
  text: string;
  children?: React.ReactNode;
}

<InfoBanner
  type="tip"
  title="Consejo del autor"
  text="No intentes hacer todo en una sola sesión..."
/>
```
**Usage:** Scattered throughout sections  
**Variants:** --tip, --warn, --error  
**Styling:** Icon + color-coded border/background

---

### 4. **Card**
```tsx
interface CardProps {
  variant: 'path' | 'stat' | 'skill' | 'resource' | 'flow' | 'model' | 'course-tip';
  title: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
  badge?: string;
  children?: React.ReactNode;
}

<Card
  variant="path"
  title="Fundamentos"
  description="Instalación con npm..."
  icon="📚"
  href="#nivel-1"
/>
```
**Variants:**
- **PathCard:** Learning level cards (Nivel 1-4, SDK, API, CI/CD)
- **StatCard:** Metric display (commands count, cases, skills)
- **SkillCard:** Skill templates with code examples
- **ResourceCard:** External links with icons
- **FlowCard:** Multi-step workflow containers
- **ModelCard:** API model comparison
- **CourseTipCard:** Learning tips

---

### 5. **Button**
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

<Button variant="primary" size="lg">
  Comenzar Módulo 1
</Button>
```

---

### 6. **Table**
```tsx
interface TableProps {
  variant: 'reference' | 'comparison';
  columns: string[];
  rows: (string | React.ReactNode)[][];
  striped?: boolean;
  sortable?: boolean;
}

<Table
  variant="reference"
  columns={['Comando', 'Nivel', 'Uso', 'Ejemplo']}
  rows={commandRows}
/>
```

---

### 7. **Badge**
```tsx
interface BadgeProps {
  variant: 'easy' | 'medium' | 'hard' | 'expert';
  children: string;
}

<Badge variant="easy">Principiante</Badge>
```
**Variants:** Color-coded difficulty levels

---

### 8. **TerminalSimulator**
```tsx
interface TerminalSimulatorProps {
  scenario: string;
  autoPlay?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}

<TerminalSimulator scenario="mcpBuild" autoPlay={false} />
```
**Implementation:**
- Reads SCENARIOS[scenario] from data
- Renders lines with delays (type, text, delay)
- Play button triggers animation
- Simulates real terminal output

**Data Structure:**
```typescript
SCENARIOS: {
  mcpBuild: [
    { type: 'prompt', text: '$ mcpb init', delay: 200 },
    { type: 'output', text: 'Initializing MCP project...', delay: 400 },
    { type: 'success', text: '✓ manifest.json created', delay: 300 },
    // ... more lines
  ]
}
```

---

### 9. **ProgressBar**
```tsx
interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

<ProgressBar current={3} total={7} label="3 / 7 módulos completados" />
```
**Usage:** Course progress tracking (via localStorage)

---

### 10. **Tabs**
```tsx
interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  defaultTab?: string;
}

<Tabs tabs={[
  { id: 'bash', label: 'Bash', content: <CodeBlock lang="bash" ... /> },
  { id: 'ts', label: 'TypeScript', content: <CodeBlock lang="typescript" ... /> }
]} />
```
**Usage:** Language selection for code examples

---

## Section-Specific Components

### 1. **Dashboard**
```tsx
<Dashboard>
  <SectionHeader {...} />
  <StatsGrid stats={statsData} />
  <PathCardGrid paths={learningPaths} />
  <InfoBanner type="tip" {...} />
</Dashboard>

interface StatsGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    trend: string;
  }>;
}

interface PathCardGridProps {
  paths: Array<{
    level: '1' | '2' | '3' | 'SDK' | 'API' | 'CI/CD';
    title: string;
    description: string;
  }>;
}
```

---

### 2. **Curso**
```tsx
<Curso>
  <SectionHeader {...} />
  <CourseHero stats={heroStats} progress={courseProgress} />
  <Roadmap modules={modules} />
  <CourseTipsGrid tips={tips} />
</Curso>

interface CourseHeroProps {
  stats: Array<{ num: string; label: string }>;
  progress: { completed: number; total: number };
}

interface RoadmapProps {
  modules: Array<{
    num: number;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    time: string;
    bullets: string[];
    project: string;
    ctaLink?: string;
  }>;
}

interface RoadmapModule {
  // Internal component
  num: number;
  // ... (all properties)
}
```

---

### 3. **Desafios**
```tsx
<Desafios>
  <SectionHeader {...} />
  <ChallengeStats stats={challengeStats} />
  <ChallengeFilters filters={filterCategories} onFilter={handleFilter} />
  <ChallengeContainer challenges={filteredChallenges} />
</Desafios>

interface ChallengeStatsProps {
  correct: number;
  attempted: number;
  accuracy: string;
  onReset: () => void;
}

interface ChallengeFilterProps {
  filters: Array<{ id: string; label: string }>;
  onFilter: (filterId: string) => void;
}
```
**State:** localStorage for saved answers  
**Data:** CHALLENGES_DATA array

---

### 4. **FlujosDev**
```tsx
<FlujosDev>
  <SectionHeader {...} />
  {flows.map(flow => (
    <FlowCard key={flow.id} flow={flow}>
      <FlowHeader tag={flow.tag} title={flow.title} context={flow.context} />
      <FlowSteps steps={flow.steps} />
      <FlowPitfalls pitfalls={flow.pitfalls} />
    </FlowCard>
  ))}
</FlujosDev>

interface FlowCardProps {
  id: string;
  tag: string; // "Flujo 01", "Flujo 02"
  title: string;
  context: string;
  steps: FlowStep[];
  pitfalls: string[];
}

interface FlowStep {
  num: number;
  title: string;
  prompt: string; // Code block content
  tip: string; // 💡 tip text
}
```
**Rendering:** 10 flow cards, each with 4-5 steps

---

### 5. **Nivel1, Nivel2, Nivel3, Nivel4**
```tsx
<NivelN>
  <SectionHeader {...} />
  <LessonIntro lesson={n} />
  {subsections.map(subsection => (
    <LessonSubsection
      number={`${n}.${subsection.num}`}
      title={subsection.title}
      content={subsection.content}
      codeBlocks={subsection.codeBlocks}
    />
  ))}
  <CommandTable commands={filteredByLevel} />
  <LessonOutro lesson={n} />
</NivelN>

interface LessonIntroProps {
  lesson: 1 | 2 | 3 | 4;
}

interface LessonOutroProps {
  lesson: 1 | 2 | 3 | 4;
  onMarkComplete: () => void;
}
```
**State:** Lesson completion via localStorage  
**Filtering:** CommandTable filters by level

---

### 6. **AgenteSDK**
```tsx
<AgenteSDK>
  <SectionHeader {...} />
  <ComparisonGrid
    items={[
      {
        title: "Claude Code CLI",
        features: [...]
      },
      {
        title: "Agent SDK",
        features: [...],
        accent: true
      }
    ]}
  />
  {sdkSections.map(section => (
    <SDKSection key={section.id} section={section}>
      <h3>{section.title}</h3>
      <p>{section.description}</p>
      {section.codeBlocks.map(block => (
        <CodeBlock key={block.id} {...block} />
      ))}
    </SDKSection>
  ))}
</AgenteSDK>

interface ComparisonGridProps {
  items: Array<{
    title: string;
    features: string[];
    accent?: boolean;
  }>;
}
```

---

### 7. **ApiAnthropicGuide**
```tsx
<ApiAnthropicGuide>
  <SectionHeader {...} />
  <ModelsGrid models={models} />
  {apiSections.map(section => (
    <APISection key={section.id} section={section}>
      <h3>{section.title}</h3>
      <p>{section.description}</p>
      {section.codeBlocks.map(block => (
        <CodeBlock key={block.id} {...block} />
      ))}
    </APISection>
  ))}
</ApiAnthropicGuide>

interface ModelsGridProps {
  models: Array<{
    name: string;
    tier: string;
    features: string[];
    useCase: string;
  }>;
}
```

---

### 8. **CICD**
```tsx
<CICD>
  <SectionHeader {...} />
  {ciSections.map(section => (
    <CISectionBlock key={section.id} section={section}>
      <h3>{section.title}</h3>
      <p>{section.description}</p>
      {section.codeBlocks.map(block => (
        <CodeBlock key={block.id} {...block} />
      ))}
    </CISectionBlock>
  ))}
</CICD>
```

---

### 9. **Cheatsheet**
```tsx
<Cheatsheet>
  <SectionHeader {...} />
  {tables.map(table => (
    <CheatsheetTable key={table.id} table={table} />
  ))}
</Cheatsheet>

interface CheatsheetTableProps {
  title: string;
  columns: string[];
  rows: (string | React.ReactNode)[][];
}
```

---

### 10. **Others (Smaller Sections)**
```tsx
// Branching, Rules, Memory, Patrones, Seguridad, Terminal, etc.
// All follow same pattern:
<SectionName>
  <SectionHeader {...} />
  {subsections.map(subsection => (
    <SubsectionBlock key={subsection.id}>
      <h3>{subsection.title}</h3>
      <p>{subsection.content}</p>
      {subsection.codeBlocks?.map(block => <CodeBlock {...block} />)}
      {subsection.lists?.map(list => <ul>{...}</ul>)}
    </SubsectionBlock>
  ))}
</SectionName>
```

---

## Shared State Management

### Context API (Recommended)
```tsx
// contexts/CourseContext.tsx
interface CourseContextType {
  completedModules: number[];
  challengeAnswers: Record<string, string>;
  progress: {
    modules: number;
    challenges: number;
  };
  markModuleComplete: (moduleNum: number) => void;
  saveChallengeAnswer: (id: string, answer: string) => void;
}

const CourseContext = React.createContext<CourseContextType>(null);

// useLocalStorage hook for persistence
function useCourseProgress() {
  const [completed, setCompleted] = useState<number[]>(() => {
    const saved = localStorage.getItem('course-completed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('course-completed', JSON.stringify(completed));
  }, [completed]);

  return { completed, setCompleted };
}
```

### Router Context (for Navigation)
```tsx
// contexts/NavigationContext.tsx
interface NavigationContextType {
  currentSection: string;
  goToSection: (sectionId: string) => void;
  sectionHistory: string[];
}

// Use React Router v6
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/:sectionId" element={<MainContent />} />
  </Routes>
</BrowserRouter>
```

---

## Data Structures (in data/ directory)

### commands.ts
```typescript
export interface Command {
  cmd: string;
  level: 1 | 2 | 3 | 4;
  category: string;
  desc: string;
  example: string;
}

export const COMMANDS_DATA: Command[] = [
  {
    cmd: '/help',
    level: 1,
    category: 'basics',
    desc: 'Ver ayuda completa',
    example: '/help'
  },
  // ... 50+ more commands
];
```

### challenges.ts
```typescript
export interface Challenge {
  id: string;
  level: 1 | 2 | 3 | 4;
  category: string;
  question: string;
  options: Array<{ id: string; text: string; correct: boolean }>;
  explanation: string;
  timeEstimate: string;
}

export const CHALLENGES_DATA: Challenge[] = [
  {
    id: 'ch-1',
    level: 1,
    category: 'basics',
    question: '¿Cuál es el primer comando para iniciar Claude Code?',
    options: [
      { id: 'a', text: 'claude', correct: true },
      { id: 'b', text: 'claude start', correct: false },
      // ...
    ],
    explanation: 'El comando `claude` inicia...',
    timeEstimate: '2 min'
  },
  // ... 25 more challenges
];
```

### scenarios.ts
```typescript
export interface ScenarioLine {
  type: 'prompt' | 'user' | 'output' | 'success' | 'error' | 'warning' | 'info';
  text: string;
  delay: number;
}

export interface Scenario {
  id: string;
  name: string;
  lines: ScenarioLine[];
}

export const SCENARIOS: Record<string, Scenario> = {
  mcpBuild: {
    id: 'mcp-build',
    name: 'MCP Build & Package',
    lines: [
      { type: 'prompt', text: '$ mcpb init', delay: 200 },
      { type: 'output', text: 'Initializing MCP project...', delay: 500 },
      // ...
    ]
  },
  // ... more scenarios
};
```

### syntaxRules.ts
```typescript
export const SYNTAX_RULES: Record<string, Array<{
  re: RegExp;
  cls: string;
}>> = {
  bash: [
    { re: /^(\$|#).*/gm, cls: 'tok-prompt' },
    { re: /(?:npm|git|claude|docker|curl)/g, cls: 'tok-command' },
    { re: /--([\w-]+)/g, cls: 'tok-flag' },
    { re: /'[^']*'|"[^"]*"/g, cls: 'tok-string' },
    { re: /\d+/g, cls: 'tok-number' },
  ],
  json: [
    { re: /"([^"]+)":/g, cls: 'tok-key' },
    { re: /:\s*"[^"]*"/g, cls: 'tok-string' },
    { re: /:\s*(\d+|true|false|null)/g, cls: 'tok-value' },
  ],
  // ... more languages
};
```

---

## Component Usage Summary

| Component | Usage Count | Complexity |
|-----------|------------|-----------|
| CodeBlock | ~150+ | Medium (highlighting) |
| Card | ~100+ | Low |
| SectionHeader | 31 | Low |
| InfoBanner | ~50+ | Low |
| Table | ~12 | Medium |
| TerminalSimulator | ~10 | High |
| Button | ~40 | Low |
| Badge | ~30 | Low |
| ProgressBar | 1 | Low |
| Tabs | ~5 | Low |
| **Custom Section Components** | 31 | Low-Medium |

---

## Migration Priority

### Phase 1 (Foundation)
1. `<SectionHeader>` — Used everywhere
2. `<CodeBlock>` — Heavy usage throughout
3. `<InfoBanner>` — Callouts
4. `<Button>` — Navigation & actions
5. `<Card>` — Base card component

### Phase 2 (Core Sections)
1. `<Dashboard>` + `<StatsGrid>` + `<PathCardGrid>`
2. `<Curso>` + `<Roadmap>` + `<CourseHero>`
3. `<Desafios>` + `<ChallengeContainer>`
4. `<FlujosDev>` + `<FlowCard>` + `<FlowStep>`

### Phase 3 (Deep Dives)
1. `<AgenteSDK>` + `<ComparisonGrid>`
2. `<ApiAnthropicGuide>` + `<ModelsGrid>`
3. `<CICD>` + code examples
4. `<SkillsAvanzados>` + skill cards

### Phase 4 (Supporting)
1. `<Nivel1>`, `<Nivel2>`, `<Nivel3>`, `<Nivel4>`
2. `<Cheatsheet>` + table rendering
3. `<Capstone>`
4. Smaller sections (Branching, Rules, Memory, etc.)

### Phase 5 (Polish)
1. `<TerminalSimulator>` — Complex animations
2. Search & filtering logic
3. localStorage persistence
4. Responsive design refinement

---

## Key Implementation Notes

1. **Syntax Highlighting:** Implement as client-side regex-based (current approach works well)
2. **Terminal Animations:** Use `setInterval` with queue of lines + types
3. **Search:** Filter `COMMANDS_DATA` in real-time from input
4. **Routing:** Use React Router v6 with nested routes
5. **Persistence:** localStorage for course progress + challenge answers
6. **Performance:** Lazy-load heavy sections (nivel-4, flujos-dev, api-anthropic)
7. **Accessibility:** Semantic HTML + ARIA labels for interactive elements
8. **Responsive:** Mobile-first CSS Grid + flexbox

---

## File Structure (Recommended)

```
src/
├─ components/
│  ├─ Base/
│  │  ├─ SectionHeader.tsx
│  │  ├─ CodeBlock.tsx
│  │  ├─ InfoBanner.tsx
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ Table.tsx
│  │  ├─ Badge.tsx
│  │  ├─ TerminalSimulator.tsx
│  │  └─ ProgressBar.tsx
│  │
│  ├─ Grid/
│  │  ├─ StatsGrid.tsx
│  │  ├─ PathCardGrid.tsx
│  │  ├─ CardGrid.tsx
│  │  ├─ ComparisonGrid.tsx
│  │  └─ ModelsGrid.tsx
│  │
│  ├─ Sections/
│  │  ├─ Dashboard.tsx
│  │  ├─ Curso.tsx
│  │  ├─ Desafios.tsx
│  │  ├─ FlujosDev.tsx
│  │  ├─ Nivel1.tsx
│  │  ├─ Nivel2.tsx
│  │  ├─ Nivel3.tsx
│  │  ├─ Nivel4.tsx
│  │  ├─ AgenteSDK.tsx
│  │  ├─ ApiAnthropicGuide.tsx
│  │  ├─ SkillsAvanzados.tsx
│  │  ├─ CICD.tsx
│  │  ├─ Cheatsheet.tsx
│  │  ├─ Capstone.tsx
│  │  └─ ... (more sections)
│  │
│  ├─ Layout/
│  │  ├─ Header.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ MainContent.tsx
│  │  └─ Footer.tsx
│  │
│  └─ Helpers/
│     ├─ CopyButton.tsx
│     ├─ FlowCard.tsx
│     ├─ FlowStep.tsx
│     ├─ CommandTable.tsx
│     └─ ... (shared components)
│
├─ contexts/
│  ├─ CourseContext.tsx
│  ├─ NavigationContext.tsx
│  └─ ThemeContext.tsx
│
├─ hooks/
│  ├─ useLocalStorage.ts
│  ├─ useCourseProgress.ts
│  ├─ useNavigation.ts
│  └─ useSyntaxHighlight.ts
│
├─ data/
│  ├─ commands.ts
│  ├─ challenges.ts
│  ├─ scenarios.ts
│  ├─ syntaxRules.ts
│  ├─ flows.ts
│  └─ sections.ts
│
├─ styles/
│  ├─ globals.css
│  ├─ components.css
│  ├─ variables.css
│  └─ responsive.css
│
├─ utils/
│  ├─ highlighter.ts
│  ├─ router.ts
│  ├─ storage.ts
│  └─ validation.ts
│
├─ App.tsx
├─ main.tsx
└─ index.html
```

---

## Estimated Development Effort

| Task | Hours | Notes |
|------|-------|-------|
| Base components | 12 | CodeBlock, Card, SectionHeader, etc. |
| Dashboard + Curso | 4 | Grid layouts, basic components |
| Desafios | 3 | Challenge rendering + local storage |
| FlujosDev | 6 | 10 flow cards, complex nesting |
| Niveles (1-4) | 10 | Lesson sections, command tables |
| AgenteSDK + API | 8 | Code blocks, comparison grids |
| CICD + Skills | 6 | Code examples, hook configs |
| Other sections | 8 | Cheatsheet, resources, smaller sections |
| Routing + State | 4 | React Router, Context API |
| Search + Filter | 3 | Command/challenge search |
| TerminalSimulator | 5 | Animation logic, timing |
| Styling + Polish | 10 | Responsive design, themes |
| Testing | 8 | Unit + integration tests |
| **Total** | **87 hours** | ~2 weeks for solo dev, 1 week for team of 2 |

---

## Next Steps

1. **Extract data:** Convert HTML data to JSON files (commands, challenges, scenarios, flows)
2. **Build base components:** Start with reusable components
3. **Implement sections:** Work through priority phases
4. **Connect routing:** Wire up navigation
5. **Add interactivity:** Terminal simulators, search, filtering
6. **Style & polish:** Responsive design, animations
7. **Test & deploy:** Unit tests, build optimization, deployment
