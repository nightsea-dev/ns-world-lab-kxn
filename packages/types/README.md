# @ns-world-lab-kxn/types

Types-only library.

## Purpose

- Shared TypeScript contracts and type utilities used across the repo

## Build output

- Emits declarations only (d.ts) to dist/
- Must never be required at runtime

## Import rules

Always use type-only imports:

- import type { Something } from "@ns-world-lab-kxn/types"

If you see runtime imports from this package, treat it as a build-breaking bug.
