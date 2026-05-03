# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Claude Code Mastery Guide** is an interactive, single-page application (SPA) that teaches users about Claude Code commands, Model Context Protocol (MCP), and custom Skills. It's built with vanilla HTML/CSS/JavaScript—no build tools, no dependencies, no framework. The site is entirely static and ready to serve as-is.

## Running and Development

- **Run locally**: Open `index.html` in a browser. The app runs entirely client-side.
- **No build step**: This is static content; any changes to HTML/CSS/JS take effect on reload.
- **No dependencies**: Pure vanilla JavaScript with no npm packages.
- **Search**: Press `Ctrl + K` to open the command search in the dashboard.

## Architecture: Data-Driven & Extensible

The app follows a simple, data-first design that makes adding content trivial:

### 1. **Navigation & Sections**
- Sidebar nav links (in HTML) use `data-section="name"` attributes.
- Main content has `<section data-section="name">` elements.
- The router automatically links them: clicking a nav link shows/hides the matching section.
- **To add a new section**: Create a `<section data-section="new-section">` in the HTML and add `<a data-section="new-section">` to the sidebar nav. The routing handles the rest.

### 2. **Commands Database**
- All commands live in `COMMANDS_DATA` array (script.js, ~line 31).
- Structure: `{ cmd, level, category, desc, example }`
- **To add a command**: Just add an entry to COMMANDS_DATA. The search, tables, and sidebar badges update automatically on next page load.
- **Levels**:
  - **1**: Fundamentos (Basics) — CLI setup, /help, /init, /model, file mentions (@)
  - **2**: Avanzado (Advanced) — /compact, /context, /usage, /mcp, MCP commands
  - **3**: Experto (Expert) — /skill-name, /fork, /team-onboarding, placeholders, skill syntax

### 3. **Terminal Simulator Scenarios**
- Live in `SCENARIOS` object (script.js, ~line 111).
- Each scenario is an array of lines: `{ type, text, delay }`.
- **Types**: prompt, user, output, success, warning, error, comment, info.
- **To add a scenario**: Add a key (e.g., `myScenario: [...]`) to SCENARIOS. Then reference it in HTML elements with `data-scenario="myScenario"`.

### 4. **Syntax Highlighting**
- Rules live in `SYNTAX_RULES` object (script.js, ~line 254).
- Supports: bash, json, markdown, gitignore, text.
- Each rule is a regex + CSS class.
- **To add language support**: Add a new key (e.g., `python: [{ re: /pattern/g, cls: 'tok-className' }, ...]`) to SYNTAX_RULES.
- Applied via `data-lang="bash"` on `<code>` blocks.

### 5. **Styling & Theming**
- All design tokens (colors, spacing, fonts, shadows) are CSS custom properties in `styles.css:root`.
- Dark theme is the default.
- **To create a light theme**: Override tokens under `[data-theme="light"]` selector.
- Component structure: Reset → Layout → Components → Utilities → Responsive.

## Key Code Patterns

### Adding a New Section with a Command Table

**HTML** (in the main content area):
```html
<section class="content-section" data-section="my-feature">
  <h2>My Feature</h2>
  <div class="commands-table" data-section="my-feature"></div>
</section>
```

**JavaScript** (script.js): Ensure your commands have the matching category or level, or manually render the table.

### Adding a Code Block with Syntax Highlighting

```html
<pre><code data-lang="bash">
npm install -g @anthropic-ai/claude-code
</code></pre>
```

The highlighting is automatic based on `data-lang`.

### Adding a Copy Button

Code blocks with `data-lang` get a copy button automatically (see the `initCodeBlocks()` function).

## Content Guidelines

- **Commands**: Keep descriptions concise (one line). Include a practical example.
- **Sections**: Use clear headings (h2/h3). Break content into card-like chunks for scannability.
- **Syntax**: Use `data-lang="bash"` or `data-lang="json"` for readability. Inline code uses backticks.
- **Scenarios**: Use realistic examples; include delays (200–1500ms) to show realistic typing/output speed.

## File Structure

```
.
├── index.html          # SPA shell + all sections + sidebar nav
├── script.js           # COMMANDS_DATA, SCENARIOS, routing, search, highlighter
├── styles.css          # Design tokens, layout, components, animations
└── CLAUDE.md           # (This file)
```

## Performance Notes

- Search is instant (regex + filter on COMMANDS_DATA).
- Terminal simulator uses `delay` per line for animation.
- No lazy loading needed; total file sizes are small.
- Syntax highlighting is regex-based, not AST-based—fast but best for short snippets.

## Future Enhancements

- **Dark/Light Toggle**: Add a theme toggle in the topbar; listen for `data-theme` attribute changes.
- **Localization**: Extract strings into a locale object; template them into HTML.
- **Export/Print**: CSS `@media print` rules to make sections printable or exportable as PDF.
- **Offline**: Service Worker to cache assets for offline access.
