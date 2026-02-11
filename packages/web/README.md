# @ns-world-lab/web

Shared **runtime React library** providing UI components, layout primitives,
and graph-related visual components for the ns-world-lab workspace.

This package contains **no application logic** and **no domain state**.
It is a consumer of `@ns-world-lab/logic` and `@ns-world-lab/types`.

---

## Purpose

This package provides:

### Layout primitives
Reusable structural components that handle layout concerns only:

- Header / Footer
- Main / Page / View containers

Layout components must not contain feature or domain logic.

---

### UI primitives
Small, reusable UI components:

- Buttons and toggles
- Close buttons
- Utility widgets
- RSuite / Tailwind wrappers

---

### Graph & spatial components
React components and hooks used to render and interact with spatial / graph data:

- SurfaceNode / SpatialNode components
- BoardSurface and related controls
- Graph-related hooks (position tracking, rerender triggers)

These components **render and interact** with graph state, but do not own it.

---

## Build output

- Emits JavaScript and declaration files to `dist/`
- `package.json` runtime entrypoints must always point to `dist/*.js`
- Applications and other packages consume **built output**, never source files

---

## Import rules (do not break)

### Runtime imports

- May import runtime logic from:
  ```ts
  import { ... } from "@ns-world-lab/logic"
