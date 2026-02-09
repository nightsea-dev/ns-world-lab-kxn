# NS-WORLD-LAB-knx

Nx-based monorepo containing frontend applications and shared libraries
for spatial graph / board-style UI experimentation.

This repository separates **runtime logic**, **type contracts**, and **UI components**
into explicit workspace packages, consumed by one or more apps.

## Technical notes

A concise technical review describing the main structural and architectural
decisions made during delivery is available here:


* [Technical Review & Delivery Notes](./docs/202602021407-KNX-Technical_Review_Delivery_Notes.md)


## Repository layout

```
apps/
  web-app/         Primary React application (Vite)
packages/
  logic/           Runtime logic (graph state, factories, utils)
  types/           Types-only package (contracts, composites, primitives)
  web/             Shared React UI components and hooks
```


## Design rules (important)

### 1. Types vs runtime are strictly separated

- `@ns-world-lab-knx/types`
  - Types only
  - Never used at runtime

- `@ns-world-lab-knx/logic`
  - Runtime library
  - Emits JavaScript + types
  - Contains graph state, factories, utilities

- `@ns-world-lab-knx/web`
  - Runtime React components and hooks
  - Depends on `logic` and `types`


### 2. No TS path aliases at runtime

Bundlers (Rspack / Vite) do **not** resolve TypeScript path aliases.

All runtime resolution must go through:
- `node_modules`
- `package.json` `exports` / `main` fields
- compiled output in `dist/`

Never rely on TS-only path mapping for runtime imports.


### 3. No self-imports inside a package

Inside a package:
- ❌ `import { X } from "@ns-world-lab-knx/web"` (from within `packages/web`)
- ✅ relative imports only

Each package must be buildable in isolation.


## Build and clean

Canonical clean (from repo root):

```bash
nx reset
tsc -b tsconfig.build.json --clean
```

Build order is handled via TypeScript project references.
Applications consume **built package outputs**, not source files.


## Styling (Tailwind CSS)

Tailwind is configured once at the repo root:

- `tailwind.config.mjs`
- `postcss.config.mjs`

Each app imports its own CSS entry file, for example:

```
apps/web/src/styles/styles.css
```


## Dependency graphs

#### apps/
* [web-app](./docs/web-app.svg)

#### packages/
* [types](./docs/types.svg)
* [logic](./docs/logic.svg)
* [web](./docs/web.svg)






## Status

This repository is under active development and serves as an
experimental foundation for spatial UI and graph-based interaction models.

## License
MIT
