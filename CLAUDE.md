# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Org Mind is a client-side mindmap viewer for Emacs org-mode files. It parses org-mode text into a tree structure and renders it as an interactive, expandable/collapsible mindmap. There is no backend — it's a static SPA deployed to GitHub Pages.

Live at: https://blog.crazyfraggle.com/org-mind/

## Commands

- `npm run dev` — start dev server (no base path)
- `npm run build` — build for GitHub Pages (output to `docs/`, base path `/org-mind`)
- `npm run preview` — preview production build
- `npm test` — run tests with vitest (watch mode by default; `npm test -- --run` for single run)
- `npm run check` — svelte-kit sync + svelte-check (type checking)
- `npm run lint` — prettier check + eslint
- `npm run format` — auto-format with prettier

## Tech Stack

- SvelteKit 2 + Svelte 4, TypeScript, Vite 5, SCSS
- Node 18 (see `.nvmrc`)
- `svelte-adapter-github` for static GitHub Pages deployment
- No runtime dependencies — everything is devDependencies

## Architecture

### Data Flow

1. User opens an org file via File Picker API or fetches a URL
2. `orgTextToMindMap()` in `src/lib/orgTextToMindMap.ts` parses raw text line-by-line into an `OrgNode` tree
3. The component tree renders this recursively as a mindmap

### Core Types (`src/lib/types.ts`)

- `OrgNode` — tree node with title, state (todo/done/none), body elements, and children
- `OrgBodyElement` — union type: text, table, preformatted, source, unorderedList, orderedList
- Type guard functions (`isText()`, `isTable()`, etc.) for narrowing body elements

### Component Hierarchy

```
+page.svelte          — file/URL input controls, calls parser
  └─ Mindmap          — root container
      ├─ Breadcrumb   — navigation trail for sub-navigation
      └─ Topic        — top-level node (left/right layout)
          └─ Subtopic — recursive; renders children, expander, body
              ├─ Expander     — toggle + Canvas API connector lines
              └─ OrgNodeBody  — renders body elements
                  └─ OrgNodeText — inline text with org markup
```

### Key Technical Details

- **Connector lines** are drawn with the Canvas API (not SVG), redrawn via ResizeObserver
- **Left/right layout mirroring** uses CSS Container Queries: `@container style(--rol: left)` reverses flex direction for nodes on the left side of the map
- **Subtopic is self-recursive** — it includes itself to render arbitrary nesting depth
- The base path differs between dev (empty) and production (`/org-mind`), configured in `svelte.config.js`

## Code Style

- Tabs, single quotes, no trailing commas, 100 char print width (see `.prettierrc`)
- Svelte components use `<style lang="scss">` for scoped styles
