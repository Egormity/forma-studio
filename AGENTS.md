# Forma Studio

A reusable 3D configurator example, with procedural house and furniture geometry.

- Keep plain document types, geometry and validation in `src/domain`, editor/history/persistence in `src/state`, Three.js presentation and controls in `src/scene`, and DOM controls in `src/components`.
- Metres are the world unit; Y is up and furniture positions use X/Z. Preserve the shared room constraint across every editing path.
- Commit one history entry per completed manipulation; cancellation restores the original pose. Camera state is not design history.
- Keep the current editor idle with demand rendering. A requested simulation needs a separate, explicit lifecycle and must not overwrite authored geometry every frame.
- Preserve malformed local saves before replacing them; validate imports before document replacement.
- Keep source readable with `pnpm format` and `pnpm format:check`. Split files over 500 lines and consider splitting above 300.
- Preserve Amazi's root Dockerfile, injected PORT, Node 22 compatibility and pinned package manager.
- Run focused unit tests and build for changes, and the browser suite for interactions or rendering.

Read [architecture](docs/architecture.md), [extension guidance](docs/extending.md) and [Amazi setup](docs/amazi.md) before substantial changes.
