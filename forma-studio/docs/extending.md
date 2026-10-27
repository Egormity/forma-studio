# Extend Forma Studio

Read [architecture](architecture.md) first. Reuse document, command, interaction and rendering
boundaries while replacing the example's subject and UI with the requested product. A furniture
configurator is one workflow; this is not a universal CAD or physics engine.

## Add an object or editable property

1. Add a supported kind to `src/domain/types.ts` and its defaults to `src/domain/catalog.ts`.
2. Implement procedural geometry under `src/scene` and route it in `FurnitureGeometry.tsx`. Keep
   logical bounds independent from decorative meshes. For a GLB, normalize units, axes, pivot,
   material ownership and loading/error behavior before treating it as editable furniture.
3. Give the catalog entry a useful UI illustration in `FurnitureLibrary.tsx`. Keep inspectors
   driven by the domain value; do not save Three.js objects or materials in the document.
4. For a new persisted property, extend validation and serialization deliberately. Choose an
   additive compatible change or a new schema version with an explicit migration.
5. Test add, numeric editing, rotated containment, duplicate, undo, import/export and reload.

A minimal new kind such as a display plinth can reuse a box mesh while having its own default
dimensions and label. It should appear through the existing library and commands without adding
a second editor or bypassing shared geometry.

## Collisions and clearance

First decide whether overlap is permitted, advisory or prohibited. A rug below a chair is different
from two cabinets occupying the same space. Give collision proxies explicit shape/layer data and
test broad-phase bounds before more precise oriented-box, convex or mesh queries. A selection ray
is not a placement test. Apply enforced rules to every mutation/import path, including room changes,
and expose a useful reason for rejection. This example currently allows object-to-object overlap.

For static layout checks, geometric queries can be sufficient. Do not introduce a running gravity
simulation merely to answer whether two footprints intersect. [Rapier scene queries](https://rapier.rs/docs/user_guides/javascript/scene_queries/)
is one optional engine-backed approach when the scene's shapes justify it.

## Optional simulation and effects

If the requested product needs dropping/stacking, an assembly mechanism or contact-aware movement,
create a focused `src/simulation` owner for engine setup, fixed stepping, object/handle mapping,
events and disposal. Keep authored scene settings separate from transient body state. Entering
play clones the design into simulation; pause/reset and explicit bake-to-document are distinct
commands. A frame of motion must not create an undo entry.

Define metre/second units, gravity direction, fixed/dynamic/kinematic bodies, collision proxies,
sensor layers, material coefficients and joint limits. Drive a simulated drag through an appropriate
kinematic target or constraint, not concurrent gizmo/physics writes. Clamp accumulated elapsed time,
bound substeps, and test fast motion, contacts, sleeping, reset and teardown. Validate accuracy for
the requested purpose; attractive contact animation is not structural verification.

Particles belong to a bounded presentation owner unless they carry actual domain behavior. Specify
emitter lifetime/count, pooling, seed, transparency budget and reduced-motion behavior. Use points
or instancing for many repeated visuals. Connect animation to the existing frame owner only while
active, and return to idle afterward. Do not add a permanent second animation loop to the editor.

Cloth, fluids, deformable solids, BIM semantics and engineering solvers are separate additions with
their own formats and numerical validation. Route to an appropriate solver rather than extending
the furniture data model until unrelated domains fit poorly.

## Development and verification loop

Build one complete representative interaction first, from document data through editing and saved
result. Add constraints, simulation and effects incrementally with fixtures and debug views. Keep
rendering and simulation replaceable without replacing document/history ownership. Profile a
realistic stress scene before selecting a more complex engine, worker or asset pipeline.

Run `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and the relevant browser checks.
Exercise the new object through actual input and export/import, including cancellation and reload.
Confirm teardown and demand-rendering behavior after effects stop. Keep the [Amazi contract](amazi.md)
and readable source intact. A public preview must be verified independently after deployment.
