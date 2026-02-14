# ns-world-lab

Monorepo demonstrating structured front-end and system design using Nx,
React (Vite), and modular packages.

This repository is a self-contained engineering sample. It focuses on
clarity of structure, separation of concerns, and delivery-ready
software rather than production infrastructure.

------------------------------------------------------------------------

## Demos

### 1. Dashboard / Spatial Board Demo

Location: `apps/web-app`

Run locally:

    npm install
    npx nx serve web-app

This demo shows: - Modular UI composition - Typed payload contracts -
Runtime separation between UI, logic, and shared types - Structured
state management without unnecessary abstraction



------------------------------------------------------------------------

## Repository Structure

    apps/
      web-app/        → Main demo application

    packages/
      types/          → Shared contracts and payload definitions
      logic/          → Runtime logic, pure functions
      web/            → Shared UI components

    docs/
      dependency graphs and notes

------------------------------------------------------------------------

## Architectural Principles

This repository follows a few strict rules:

-   No runtime TypeScript path aliases.
-   No self-imports inside packages.
-   Clear separation between:
    -   Types (contracts)
    -   Runtime logic
    -   UI components
-   Minimal dependency surface.
-   Shared packages consumed through built outputs.

The goal is navigability and long-term maintainability rather than
abstraction for its own sake.

------------------------------------------------------------------------

## Technical Review Notes

For a structured overview of the architectural corrections and delivery decisions applied in this implementation, see:

* [KNX_Technical_Review](KNX_Technical_Review.md)


------------------------------------------------------------------------

## Engineering Stance

This sample reflects a practical engineering approach:

-   Prefer standards over heavy abstraction.
-   Keep dependency surface small unless a library materially reduces
    risk or delivery time.
-   Structure-first design: clarity of contracts and boundaries before
    adding features.
-   Optimise for delivery readiness rather than production
    infrastructure.

This repository is intended as an evaluative artefact demonstrating how
complexity is reduced and shaped into coherent, runnable software.

------------------------------------------------------------------------

## Install & Build

Install dependencies:

    npm install

Build all packages:

    npx nx build

Serve an application:

    npx nx serve web-app

------------------------------------------------------------------------

## Notes

-   This is a demonstration repository.
-   No production infrastructure or secrets are included.
-   All code is self-contained for evaluation purposes.


------------------------------------------------------------------------


## License
MIT
