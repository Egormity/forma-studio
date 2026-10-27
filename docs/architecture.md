# Architecture

Forma is one React/Vite application. Its source document describes a rectangular room and furniture;
React Three Fiber presents that document as procedural meshes. Rendering, camera movement and drag
previews do not become the saved design by themselves.

| Owner                               | Responsibility                                                      |
| ----------------------------------- | ------------------------------------------------------------------- |
| `src/domain/types.ts`, `catalog.ts` | Versioned plain document, units and supported object defaults       |
| `src/domain/scene.ts`               | Shared dimension limits, rotated footprint and room containment     |
| `src/domain/serialization.ts`       | Validation/normalization and JSON exchange                          |
| `src/state/history.ts`              | Bounded snapshots, no-op suppression, undo and redo                 |
| `src/state/persistence.ts`          | Browser storage and preservation of unreadable saves                |
| `src/state/useStudio.ts`            | Editor commands, current document, selection and view preferences   |
| `src/scene`                         | Procedural geometry, camera framing, picking and drag previews      |
| `src/components`                    | DOM controls, draft fields, library, inspector and status           |
| `src/styles`                        | Base, header, layout, panels, inspector and responsive presentation |

## Data and geometry

World units are metres. Y points upward; the room's floor is X/Z and is centered on the origin.
Furniture position stores `[x, z]`, dimensions are unrotated logical sizes, and rotation is in degrees.
Three.js conversions occur at presentation boundaries. Decorations do not silently redefine footprints.

The room ranges are width 4–12 m, depth 4–10 m and height 2.2–4 m. Up to 40 furniture pieces are
supported. `fitItemToRoom` accounts for rotation, keeps a wall margin, limits height and shrinks
oversized furniture while preserving minimum dimensions. Pointer drops, numeric edits, duplication,
room changes and imported documents use that same rule. Import intentionally normalizes valid,
out-of-bounds data into the supported room; it rejects malformed types, versions, IDs and values.

These are concept-editor rules. Furniture can overlap, and the scene has no collision solver,
gravity, particles, building topology, engineering calculations or real-time collaboration.

## Interaction and history

Selection and camera preferences are transient. `MoveControls` owns temporary gizmo movement and
restores camera control after completion/cancellation. A drop passes through the domain constraint
before one history commit. Cancelled drags restore their initial pose. Imperative mesh updates also
invalidate the demand-rendered viewport, including a constrained drop whose saved value is unchanged.

History stores at most 60 past snapshots and discards redo after a new document change. No-op edits
do not add a step. Undoing room resizing restores furniture and room together. Numeric fields keep
editable drafts and reconcile them with incoming values after undo or another editor action.

## Persistence and presentation

Valid scenes save under `forma-studio.scene.v1` for the current browser origin. A malformed save
remains untouched on initial load. Before a deliberate edit replaces it, its raw content is copied
to `forma-studio.scene.recovery.v1`; a failed backup prevents replacement. Export is the portable
JSON backup and remains available when storage is blocked. This is local persistence, not cloud sync.

`Viewport` uses demand rendering and a bounded pixel ratio. Controls invalidate while active and
then let the scene idle. Scene objects own presentation; they do not own document mutation. Keep
shared geometry/material lifetime distinct from per-object resources when extending the scene.
WebGL failure preserves useful DOM editing and JSON export.

The [extension guide](extending.md) describes optional complex systems. The [Amazi guide](amazi.md)
owns application registration and deployment details; the Python server is only local packaging.
