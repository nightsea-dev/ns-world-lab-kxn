# KNX-Technical Review & Delivery Notes

[20260202]




## Scope

This document summarises the issues observed in the original take-home repository and the changes applied in the delivered version.

The objective was to restore a coherent build, correct dependency direction, and align the architecture with React and Nx best practices.



## 1) Initial state

- The repository, as received, **did not compile**.
- The first step was a **direct inspection of the repository structure**, `package.json` files, and **TypeScript configuration (`tsconfig*`)**, using only a text editor and without relying on tooling.



## 2) Structural issue: invalid dependency direction

### Observation

- By **reading the TypeScript project references in the `tsconfig` files**, it was clear that the dependency direction was incorrect.
- Library-level projects were configured in a way that made them **depend on an application project**.

### Why it matters

- Applications are **entry points** and composition roots.
- Libraries must remain **portable and reusable**.
- A library depending on an application breaks architectural layering and typically leads to:
    - unstable build order
    - circular references
    - reduced reusability of shared code

### Change

- Dependency direction was corrected so that:
    - **applications depend on libraries**
    - any shared concern is extracted into a library rather than referenced from another application



## 3) TypeScript configuration issue: tsconfig layering

### Observation

- Target-specific configs (`tsconfig.app.json`, `tsconfig.lib.json`) were extending **directly** from the root `tsconfig.base.json`.
- The intermediate, project-level `tsconfig.json` was bypassed.

This was visible by simply opening and comparing the `extends` chains in the configuration files.

### Why it matters

- Proper tsconfig layering ensures:
    - a single, well-defined compilation contract per project
    - consistent project references
    - controlled specialisation for app vs lib targets
- Skipping the project-level layer leads to duplicated configuration and fragile builds.

### Change

- Restored conventional layering:
    - root `tsconfig.base.json` defines shared defaults
    - each project `tsconfig.json` extends the base and defines project-specific references and scope
    - `tsconfig.app.json` / `tsconfig.lib.json` extend their **immediate project tsconfig**



## 4) Repository organisation and application consolidation

### Observation

- The original repository contained **two separate web applications**.
- Both were frontend web UIs (not a web + server split).

### Change

- Consolidated to a **single web application** for delivery clarity.
- Shared logic and primitives were placed below the application boundary in libraries.
- The structure now reflects a clear entrypoint → library flow.



## 5) Tooling adjustment: Rspack → Vite

### Observation

- The intended workflow required:
    - developing UI components in one area
    - iterating the application UI in parallel
- Rspack’s development and hot-update behaviour was not effective for this multi-package iteration workflow.

### Change

- Switched the dev/build toolchain to **Vite**.
- With Vite, changes made in shared packages (e.g. `packages/web`) are correctly picked up and hot-updated when developing the web application.

With the previous setup, updates made in shared packages while running the application were **not reflected in the browser during development**, which broke the expected feedback loop for component iteration.

The decision was driven by **development workflow correctness and reliability**, rather than tooling preference.



## 6) Architectural refactor: composition over inheritance

### Observation

- Generalisation in the original code leaned toward **inheritance-based hierarchies**.
- Behaviour was expressed through subclassing rather than assembly.

### Why it matters

- React and modern frontend architecture are **composition-first**.
- Inheritance introduces:
    - rigid coupling
    - fragile override chains
    - harder-to-reason-about behaviour

### Change

- Refactored toward **composition-based design**:
    - behaviour is assembled explicitly
    - responsibilities are separated into small, composable units
    - reuse is achieved by combination rather than subclassing



## 7) Graph semantics: node vs payload separation

### Observation

- Node identity, spatial concerns, and payload data were mixed.
- Position and size were treated as primary properties rather than being owned by a single spatial concept.

### Change

- Clarified the model so that:
    - a **node is a spatial carrier**
    - spatial concerns are owned by a **Transformation**
    - payload data is independent of node identity

Conceptually:

```
Node = Transformation + Payload

```

Position and size are preserved but are derived from the transformation owned by the node.

This keeps the graph model clean and extensible.



## 8) Reactivity scope and dependency hygiene

### Observation

- MobX was present in the codebase, but the reactive scope required for this exercise was limited and local.
- React’s rendering model and explicit update triggers were sufficient to achieve the required behaviour.

### Change

- MobX was not required for the scope of reactivity involved and was therefore not used in the delivered implementation.
- Reactivity is localised to **spatial transformations**, which trigger re-renders where needed.
- This avoids introducing unnecessary state-management complexity while keeping future extension possible if broader reactivity becomes necessary.

Dependencies are introduced only where they are strictly required.



## 9) Nx boundary enforcement (final state)

### Project tagging

- Application: `layer:app`
- Libraries: `layer:lib`
    - `lib:web`
    - `lib:logic`
    - `lib:types`

### Enforced dependency rules

- applications → libraries only
- web → logic, types
- logic → types
- types → none

These rules are enforced via `@nx/enforce-module-boundaries` in ESLint.



## 10) Result

- The repository builds and runs with a coherent dependency structure.
- Dependency direction is explicit and consistently enforced.
- Architecture aligns with:
    - Nx workspace principles
    - React’s compositional model
    - portable, layered libraries
- Tooling supports fast, reliable iteration for the intended development workflow.

---