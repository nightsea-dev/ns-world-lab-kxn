# KNX -- Technical Review & Delivery Notes

Date: 2026‑02‑02

This document summarises the structural issues identified in the
original repository and the technical decisions applied in the delivered
version.

The objective was to restore build integrity, correct dependency
direction, simplify architecture where possible, and align the project
with Nx and React best practices.

------------------------------------------------------------------------

## 1. Initial State

-   The repository, as received, did not compile.
-   Initial assessment was performed through direct inspection of:
    -   repository structure
    -   `package.json` files
    -   TypeScript configuration (`tsconfig*`)
-   No assumptions were made based on tooling output; configuration was
    reviewed manually to identify structural inconsistencies.

------------------------------------------------------------------------

## 2. Structural Issue: Invalid Dependency Direction

### Observation

Library-level projects were configured in a way that caused them to
depend on an application project.

### Why It Matters

Applications are composition roots and entry points.\
Libraries must remain reusable and portable.

When a library depends on an application, architectural layering is
broken, which typically results in:

-   unstable build order
-   circular references
-   reduced reusability
-   long-term maintenance friction

### Change

Dependency direction was corrected so that:

-   Applications depend only on libraries.
-   Shared concerns are extracted into libraries rather than referenced
    from applications.

------------------------------------------------------------------------

## 3. TypeScript Configuration Layering

### Observation

Target-specific configs (`tsconfig.app.json`, `tsconfig.lib.json`)
extended directly from the root `tsconfig.base.json`, bypassing
project-level `tsconfig.json` files.

### Why It Matters

Proper layering ensures:

-   clear compilation boundaries
-   consistent project references
-   controlled specialisation between app and lib targets

Skipping the project-level configuration leads to fragile and duplicated
configuration.

### Change

Restored conventional layering:

-   `tsconfig.base.json` defines shared defaults.
-   Each project `tsconfig.json` extends the base and defines project
    scope.
-   Target configs extend their immediate project-level configuration.

------------------------------------------------------------------------

## 4. Repository Organisation

### Observation

Two separate frontend applications were present in the original
repository.

### Change

Consolidated to a single web application for clarity of delivery.

Shared logic and primitives were extracted into libraries below the
application boundary, producing a clear:

Application → Libraries dependency flow.

------------------------------------------------------------------------

## 5. Tooling Adjustment: Rspack → Vite

### Observation

The intended workflow required iterative development across shared
packages and the application layer.

Rspack did not provide reliable hot update behaviour in this
multi-package context.

### Change

Replaced Rspack with Vite for development and build.

Vite correctly reflects changes made in shared packages during active
development, restoring a predictable feedback loop.

The change was made strictly for workflow correctness and reliability.

------------------------------------------------------------------------

## 6. Architectural Refactor: Composition over Inheritance

### Observation

Behaviour in the original implementation leaned toward inheritance-based
hierarchies.

### Why It Matters

Modern React architecture favours composition:

-   clearer responsibility boundaries
-   lower coupling
-   easier reasoning about behaviour

Inheritance introduces rigid coupling and fragile override chains.

### Change

Refactored to a composition-first design:

-   Behaviour is assembled explicitly.
-   Responsibilities are separated into small composable units.
-   Reuse is achieved via composition rather than subclassing.

------------------------------------------------------------------------

## 7. Graph Semantics: Node vs Payload Separation

### Observation

Spatial identity and payload data were intermixed.

### Change

Clarified the model:

Node = Transformation + Payload

-   A node acts as a spatial carrier.
-   Spatial concerns are owned by a Transformation.
-   Payload data remains independent.

This improves extensibility and conceptual clarity of the graph model.

------------------------------------------------------------------------

## 8. Reactivity Scope & Dependency Hygiene

### Observation

MobX was present in the original dependency graph.

For the scope of this exercise, the required reactivity was limited and
localised.

React's native rendering behaviour and explicit state updates were
sufficient to achieve the intended functionality.

### Decision

MobX was intentionally not used in the delivered implementation.

The goal was to avoid introducing unnecessary state-management
complexity when the reactive requirements were limited.

Reactivity is confined to spatial transformations that trigger
predictable React updates.

Dependencies are introduced only when they materially improve
correctness or delivery velocity.

------------------------------------------------------------------------

## 9. Nx Boundary Enforcement

Project tagging:

-   Application: `layer:app`
-   Libraries: `layer:lib`
    -   `lib:web`
    -   `lib:logic`
    -   `lib:types`

Enforced rules:

-   Applications depend only on libraries.
-   `web` depends on `logic` and `types`.
-   `logic` depends on `types`.
-   `types` depends on none.

These rules are enforced using `@nx/enforce-module-boundaries`.

------------------------------------------------------------------------

## 10. Result

The delivered repository:

-   Builds and runs successfully.
-   Enforces explicit dependency direction.
-   Aligns with Nx workspace conventions.
-   Uses composition-based React architecture.
-   Maintains a minimal and intentional dependency surface.
-   Supports reliable multi-package development workflow.

This document reflects the reasoning and engineering decisions applied
in the delivered implementation.
