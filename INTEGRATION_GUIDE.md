# Integration Guide: Restoring Practical Content

## Overview
This guide shows how to integrate the restored practical content from `allSectionsContent-expanded.js` back into your application.

## Quick Start

### 1. Import the Expanded Sections
```javascript
// In your main app file (e.g., script.js or app.js)
import { EXPANDED_SECTIONS } from './lib/allSectionsContent-expanded.js';

// Make available globally for rendering
window.EXPANDED_SECTIONS = EXPANDED_SECTIONS;
```

### 2. Render Code Blocks in Sections

#### For `agente-sdk` Section
```html
<!-- In your HTML template or rendering code -->
<section data-section="agente-sdk">
  <h2>🤖 Claude Agent SDK</h2>
  
  <!-- Dynamically render code blocks -->
  <div id="sdk-code-blocks"></div>
</section>

<script>
function renderSDKSection() {
  const container = document.getElementById('sdk-code-blocks');
  const blocks = EXPANDED_SECTIONS['agente-sdk'].codeBlocks;
  
  blocks.forEach(block => {
    const html = `
      <div class="code-block-wrapper">
        <h4>${block.title}</h4>
        <p class="description">${block.description}</p>
        <pre><code class="language-${block.lang}">${escapeHtml(block.code)}</code></pre>
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
      </div>
    `;
    container.innerHTML += html;
  });
  
  // Re-highlight syntax if using prism/highlight
  if (window.Prism) Prism.highlightAllUnder(container);
}

renderSDKSection();
</script>
```

### 3. Render Workflows and Pitfalls
```javascript
function renderWorkflows() {
  const workflows = EXPANDED_SECTIONS['agente-sdk'].workflows;
  
  workflows.forEach(wf => {
    const stepsHtml = wf.steps.map((step, idx) => `
      <li>
        <strong>Step ${step.num}: ${step.title}</strong>
        <p>${step.description || step.command}</p>
      </li>
    `).join('');
    
    console.log(`
      <div class="workflow-card">
        <h4>${wf.id}: ${wf.title}</h4>
        <ol>${stepsHtml}</ol>
      </div>
    `);
  });
}

function renderPitfalls() {
  const pitfalls = EXPANDED_SECTIONS['agente-sdk'].commonPitfalls;
  
  const html = `
    <div class="pitfalls-section">
      <h4>⚠️ Common Pitfalls</h4>
      <ul>
        ${pitfalls.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
  `;
  
  return html;
}
```

## Detailed Integration for Each Section

### Agent SDK Section

**What to add:**
1. 4 code blocks (basic agent, streaming, multi-agent, vision)
2. 1 workflow (PR reviewer)
3. 4 common pitfalls

**How to integrate:**
```javascript
function populateAgentSDKSection() {
  const section = document.querySelector('[data-section="agente-sdk"]');
  
  // Add code blocks
  const codeContainer = document.createElement('div');
  codeContainer.className = 'agent-sdk-code-blocks';
  
  EXPANDED_SECTIONS['agente-sdk'].codeBlocks.forEach((block, idx) => {
    const blockEl = createCodeBlockElement(block);
    codeContainer.appendChild(blockEl);
  });
  
  // Add workflows
  const workflowsHtml = EXPANDED_SECTIONS['agente-sdk'].workflows
    .map(wf => createWorkflowElement(wf))
    .join('');
  
  // Add pitfalls
  const pitfallsHtml = `
    <div class="pitfalls-section">
      <h3>⚠️ Common Pitfalls</h3>
      <ul>${EXPANDED_SECTIONS['agente-sdk'].commonPitfalls
        .map(p => `<li>${p}</li>`)
        .join('')}</ul>
    </div>
  `;
  
  section.innerHTML += codeContainer.innerHTML + workflowsHtml + pitfallsHtml;
}

function createCodeBlockElement(block) {
  const el = document.createElement('div');
  el.className = 'code-block';
  el.innerHTML = `
    <h4>${block.title}</h4>
    <p class="code-description">${block.description}</p>
    <div class="code-wrapper">
      <pre><code data-lang="${block.lang}">${escapeHtml(block.code)}</code></pre>
      <button class="copy-code-btn" onclick="copyToClipboard(this)">Copy</button>
    </div>
  `;
  return el;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyToClipboard(btn) {
  const code = btn.parentElement.querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}
```

### Anthropic API Section

**What to add:**
1. 6 code blocks (tool use, streaming, batch, files, caching, vision)
2. 1 workflow (batch classification)
3. 6 common pitfalls

**Structure:**
```javascript
// In your API section renderer
EXPANDED_SECTIONS['api-anthropic'].codeBlocks.forEach(block => {
  renderCodeBlock(block, 'api-anthropic');
});

// Add workflows section
const workflows = EXPANDED_SECTIONS['api-anthropic'].workflows;
workflows.forEach(wf => {
  renderWorkflow(wf);
});

// Add pitfalls/tips
showCommonPitfalls(EXPANDED_SECTIONS['api-anthropic'].commonPitfalls);
```

### Level 4 Section

**What to add:**
1. 3 sub-sections (production patterns, scaling strategies, security hardening)
2. 2 code blocks (production agent, rate limiting)

**Structure:**
```javascript
function populateLevel4Section() {
  const sections = EXPANDED_SECTIONS['nivel-4'].sections;
  
  sections.forEach(sec => {
    // Render patterns/strategies/checklist
    if (sec.patterns) {
      renderPatternCards(sec.patterns);
    }
    if (sec.strategies) {
      renderStrategyCards(sec.strategies);
    }
    if (sec.checklist) {
      renderSecurityChecklist(sec.checklist);
    }
  });
  
  // Render code blocks at end
  EXPANDED_SECTIONS['nivel-4'].codeBlocks.forEach(block => {
    renderCodeBlock(block, 'nivel-4');
  });
}

function renderSecurityChecklist(items) {
  return `
    <div class="security-checklist">
      <h3>🔐 Security Hardening Checklist</h3>
      <ul>
        ${items.map((item, i) => `
          <li>
            <input type="checkbox" id="security-${i}">
            <label for="security-${i}">${item}</label>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}
```

## CSS for Code Blocks

Add these styles to enhance code display:

```css
.code-block {
  background: var(--bg-secondary, #1e1e1e);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border-left: 4px solid var(--accent, #0ea5e9);
}

.code-block h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary, #fff);
  font-size: 14px;
  font-weight: 600;
}

.code-description {
  color: var(--text-secondary, #999);
  font-size: 13px;
  margin: 0 0 12px 0;
  font-style: italic;
}

.code-wrapper {
  position: relative;
  background: var(--bg-tertiary, #141414);
  border-radius: 4px;
  overflow: hidden;
}

pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

code {
  font-family: 'Courier New', monospace;
  color: var(--text-code, #e0e0e0);
}

.copy-code-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 12px;
  background: var(--accent, #0ea5e9);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.code-wrapper:hover .copy-code-btn {
  opacity: 1;
}

.copy-code-btn:hover {
  background: var(--accent-dark, #0284c7);
}

.workflow-card {
  background: var(--bg-secondary, #1e1e1e);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.workflow-card ol {
  margin: 12px 0 0 20px;
  padding: 0;
}

.workflow-card li {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border, #333);
}

.workflow-card li:last-child {
  border-bottom: none;
}

.pitfalls-section {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 16px;
  border-radius: 4px;
  margin-top: 20px;
}

.pitfalls-section h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.pitfalls-section ul {
  margin: 0;
  padding-left: 20px;
}

.pitfalls-section li {
  color: #333;
  margin-bottom: 8px;
}

.security-checklist {
  background: var(--bg-secondary, #1e1e1e);
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.security-checklist ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-checklist li {
  padding: 8px 0;
  display: flex;
  align-items: center;
}

.security-checklist input[type="checkbox"] {
  margin-right: 12px;
  cursor: pointer;
}

.security-checklist label {
  cursor: pointer;
  flex: 1;
}
```

## JavaScript Helpers

### Syntax Highlighting Integration

```javascript
// If using Highlight.js
function highlightCodeBlocks() {
  document.querySelectorAll('code[data-lang]').forEach(block => {
    const lang = block.getAttribute('data-lang');
    block.classList.add(`language-${lang}`);
    hljs.highlightElement(block);
  });
}

// Or Prism.js
function initPrismHighlighting() {
  if (window.Prism) {
    Prism.highlightAllUnder(document.querySelector('[data-section="agente-sdk"]'));
    Prism.highlightAllUnder(document.querySelector('[data-section="api-anthropic"]'));
  }
}
```

### Search and Filter

```javascript
function filterCodeBlocks(query) {
  const blocks = document.querySelectorAll('.code-block');
  
  blocks.forEach(block => {
    const title = block.querySelector('h4')?.textContent.toLowerCase();
    const description = block.querySelector('.code-description')?.textContent.toLowerCase();
    const code = block.querySelector('code')?.textContent.toLowerCase();
    
    const matches = title?.includes(query) || 
                   description?.includes(query) || 
                   code?.includes(query);
    
    block.style.display = matches ? 'block' : 'none';
  });
}

// Usage
document.getElementById('search-code').addEventListener('input', (e) => {
  filterCodeBlocks(e.target.value.toLowerCase());
});
```

## Migration Checklist

- [ ] Copy `allSectionsContent-expanded.js` to `lib/` directory
- [ ] Import expanded sections in main script file
- [ ] Update section rendering functions to use expanded content
- [ ] Add CSS styles for code blocks and workflows
- [ ] Test code highlighting (Highlight.js or Prism)
- [ ] Add copy-to-clipboard functionality
- [ ] Verify all 13 code examples render correctly
- [ ] Test responsive layout on mobile
- [ ] Add performance tracking for code block views
- [ ] Create navigation between related code examples
- [ ] Add bookmarking/favorites for code blocks
- [ ] Test on all target browsers

## Deployment Notes

1. **Bundle size**: `allSectionsContent-expanded.js` is ~65KB
   - Consider code-splitting or lazy-loading if size is concern
   
2. **Performance**: 
   - Don't highlight all code blocks on page load
   - Use intersection observer to highlight visible blocks
   
3. **Accessibility**:
   - Add `aria-label` to code blocks
   - Ensure keyboard navigation works
   - Use semantic HTML for workflows

4. **Mobile optimization**:
   - Make code blocks horizontally scrollable
   - Adjust syntax highlighting for small screens
   - Stack workflow steps vertically

---

## Support

For questions about specific code blocks, refer to:
- **Agent SDK**: See `EXPANDED_SECTIONS['agente-sdk'].codeBlocks`
- **API Examples**: See `EXPANDED_SECTIONS['api-anthropic'].codeBlocks`
- **Production Patterns**: See `EXPANDED_SECTIONS['nivel-4'].sections`
