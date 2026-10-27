# Interactive 3D scenes and configurators

Use this skill when a website needs an interactive 3D preview of a house, room, furniture, product, construction concept, or assembly: orbiting, selecting parts, changing finishes or dimensions, arranging objects, or inspecting a cutaway. Build actual scene geometry and connect the controls to it. A rotating image or prerecorded video does not support arbitrary viewpoints and object editing.

## Working example

- Source: [Forma Studio](https://github.com/Egormity/forma-studio), a public template maintained on `main`.
- The public production preview link will be added later. Until then, use the source repository as the working reference; do not present the authenticated project page as a public preview.
- Amazi project: [Forma Studio project](https://app.amazi.pro/projects/1ecb3d86-b1cb-4513-ba8d-cbee2d9794c1). This is the project management page, not the public scene preview.

Study the example's behavior and reusable boundaries; adapt its subject, layout, visual style, and object limits to the current task. The desktop launcher and Python server belong to that example's local packaging. An Amazi website should use its existing web build and deployment.

Read [architecture](https://github.com/Egormity/forma-studio/blob/main/docs/architecture.md), [extension guidance](https://github.com/Egormity/forma-studio/blob/main/docs/extending.md) and [Amazi setup](https://github.com/Egormity/forma-studio/blob/main/docs/amazi.md) as needed.

Useful source paths: `src/scene/Viewport.tsx`, `SceneCamera.tsx`, `MoveControls.tsx`, `FurnitureObject.tsx`, `Floor.tsx`; `src/domain/scene.ts` and `serialization.ts`; `src/state/useStudio.ts`; and `e2e/interaction.spec.ts`. Forma demonstrates procedural geometry, room boundaries, undo/redo, local persistence, and JSON exchange. It does not implement furniture collision detection, CAD editing, or structural calculations.

## Development flow

1. Inspect the existing app, document model, renderer, asset licenses and runtime. Define a short capability map: viewing, editing, measurement, constraints, simulation, effects, persistence and export. Mark each requested capability as implemented, to build or out of scope; the reference is not a complete engine for every domain.
2. Establish one representative end-to-end slice with real data: load an object, inspect/manipulate it, apply the domain rule, and save/reload or export the result. Set units, precision, target devices and realistic scene sizes before expanding the UI.
3. Implement and test domain rules independently. Add one complex system at a time with explicit ownership and lifecycle, debug views, adjustable parameters and a small reproducible fixture. Preserve existing interactions while replacing illustrative data with the user's actual domain.
4. Add polished rendering, physics or particles only after the core slice works. Profile representative stress scenes, tune quality to the target device and verify fallbacks. A successful build or attractive screenshot does not prove simulation stability or usable frame pacing.
5. Verify the complete interaction and recovery loop: input, cancellation, reset, import validation, persistence, export, resource disposal and deployment asset paths. Prove an extension by adding a representative object or rule through the documented boundaries; report exactly which systems are present and which remain extension guidance.

## Choose the scene and assets

1. Determine whether the task needs a viewer, a product configurator, or a spatial editor. Implement the requested interactions first; do not add a full editor to a simple viewer.
2. Use the existing framework. For a React project, Three.js with React Three Fiber and selected Drei helpers is a practical starting point. Check the installed versions and compatible APIs before copying imports; avoid introducing an experimental renderer merely to show a small scene.
3. Use procedural meshes for adjustable dimensions and repeated construction elements: walls, openings, floors, roofs, cabinets, desks, and simple furniture. Use licensed GLB/glTF assets when realistic shapes or product-specific detail matter. Combine both when useful.
4. For imported assets, inspect bounds, units, axes, origin, floor contact, mesh names, and material slots. Center and scale intentionally; preserve the meaning of measurements. Keep editable parts separately addressable. Clone materials when variants must not affect other objects sharing the same loaded asset.
5. Host assets and any required decoders with the project or an authorized stable asset service. Use Draco, Meshopt, or KTX2 only when the supplied asset needs the corresponding decoder and the load path is verified. Include loading, failure, and retry states. Do not turn a missing model into a permanently blank canvas.
6. Introduce IFC/BIM parsing only for actual building-information files and required semantic features. Describe illustrative models as visual previews; do not imply engineering accuracy from decorative geometry.

## Model data independently of rendering

- Define explicit units and coordinate conventions. A room editor can use metres, Y up, and X/Z for its floor; UI rotation may use degrees while Three.js uses radians.
- Store a versioned scene document containing stable object IDs, asset/type references, transforms, dimensions, and material choices. Keep selection, camera, hover, and drag state separate from saved design data.
- Split scene objects, camera controls, interaction controls, domain constraints, persistence/history, and UI into focused modules. Generate repeated elements from data rather than duplicating scene JSX.
- Decide placement rules explicitly: room boundaries, floor contact, snapping, valid dimensions, and whether objects may overlap. A rotated footprint must fit too. For a rectangular object, its floor bounds are `abs(cos θ) * width + abs(sin θ) * depth` and `abs(sin θ) * width + abs(cos θ) * depth`. Revalidate after resizing the room, rotating, duplicating, or importing.
- Keep normalization stable: repeated save/load cycles must not keep shrinking or moving objects through rounding. Preserve minimum dimensions when fitting oversized pieces.
- For editors, commit one undo step per completed drag. Undo room resizing and the resulting object adjustments together. Clearing redo after a new edit should be intentional. Save locally or remotely according to the product's actual persistence model and show failures honestly.
- Validate imported documents before replacing the scene: schema version, allowed types, finite bounded numbers, unique IDs, legal materials, and file/object limits. Reject malformed input while preserving the current scene. Treat imported data as data, never executable content.

## Build a useful viewport

- Provide one clearly sized canvas with an explicit height, responsive container, loading state, and a WebGL failure fallback that leaves useful HTML controls available.
- Compose a readable scene with correct scale, floor contact, restrained lighting, and clear material differences. Use modest shadows and a neutral backdrop before adding expensive effects. For buildings, real window openings, cutaway walls, roof visibility, and dimension markers often explain more than decorative animation.
- Start with a view that reveals the subject. Fit the camera to the scene bounds, viewport aspect ratio, and field of view; include roof height, base, labels, and control margins. Refit on preset changes and meaningful size/container changes, not every render or hover. Keep the camera target consistent with the subject and bound zoom/polar angles appropriately.
- Offer relevant presets such as Perspective, Top, Front, or Fit to scene. Use an orthographic camera when the task requires a floor-plan-like view without perspective distortion. Keep labels readable when zooming and resizing; they must not intercept pointer interaction.
- Provide clearly labelled controls and property fields outside the canvas. On small screens, stack or collapse panels while preserving a usable viewport and avoiding horizontal overflow. Explain orbit, pan, zoom, selection, and drag gestures near the viewer or in concise help.

## Make interaction reliable

- Use a single active camera controller, such as OrbitControls with damping. Distinguish click selection from camera dragging with a movement threshold. Provide a visible selected-object outline or footprint and an accessible way to choose objects or edit their properties without precision dragging.
- For transform gizmos, attach the selected object and use the intended axes/plane. In a floor editor, constrain movement to X/Z and keep Y on the floor; expose sensible snapping and finer numeric editing when needed. Three.js TransformControls provides explicit transform modes, axis visibility, and snapping options. [TransformControls API](https://threejs.org/docs/pages/TransformControls.html)
- Disable camera controls while transforming an object. Always restore them on pointer release, cancellation, object deletion, selection change, and component cleanup. Escape should restore the drag's original transform without creating an undo entry. Avoid click-through deselection immediately after dropping.
- During dragging, update the live mesh through refs and request rendering; save application state at the appropriate commit boundary. On drop, apply the constrained position directly to the mesh before committing it. If a boundary clamp returns the already-saved value, React may skip a render; the mesh must still return inside the room.
- Own the controls' lifecycle: remove listeners, detach the object, remove helpers, and dispose owned control instances on cleanup. Verify the installed wrapper's behavior; if it does not clean up correctly, integrate the official control explicitly. Do not suppress lifecycle warnings instead of addressing them.
- Numeric and name fields need editable drafts, explicit commit/cancel behavior, and reconciliation after external changes such as Undo. Sync incoming committed values before a new focus/edit can race them, and commit the actual current input value on blur. Test rapid Undo → edit as well as ordinary typing. Ignore editor keyboard shortcuts while users type into fields.

## Keep desktop and mobile interaction smooth

For a scene that can become still, start with `frameloop="demand"`. Call `invalidate()` after imperative camera or mesh changes; maintain updates while damping or animation is active, then let rendering stop. Drei controls handle this integration for supported controls. `invalidate()` requests a frame rather than rendering synchronously. [React Three Fiber performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

- Use a bounded pixel ratio; Forma starts at `dpr={[1, 1.5]}`. Profile the actual viewport/device before raising resolution or adding effects. Large displays and high-DPI screens can multiply the rendering cost.
- Instance repeated identical geometry such as floor planks, tiles, or posts. Reuse compatible geometries/materials, memoize costly generation, and avoid React state updates or allocations for every animation frame.
- Limit shadow-casting lights, shadow resolution, material complexity, and transparent layers. Load only the models needed for the current scene; add lower-detail variants when measured scene complexity warrants them.
- Dispose owned textures, geometries, materials, render targets, and controls when their lifetime ends; respect resources shared by several objects. Removing a mesh alone does not release its GPU resources. [Three.js resource cleanup](https://threejs.org/manual/pages/how-to-dispose-of-objects.html)
- Respect reduced-motion preferences for automatic movement. Do not force camera spin or hijack page scrolling. Wheel zoom should apply to deliberate viewport interaction; ordinary panels and the surrounding page must remain scrollable.
- Check frame pacing during orbit, zoom, and dragging, and check that an idle scene actually stops drawing. Do not promise a frame rate from a successful build or a screenshot. Software WebGL in headless tests may need longer to finish damping than a desktop GPU.

## Collisions, dynamics and complex effects

Choose the required behavior before adding a physics engine. Forma itself provides room containment and editing; collisions, gravity, particles, joints, animation clips and numerical solvers below are extension paths, not included features.

- For clash/clearance checks, separate visual meshes from logical collision geometry. Use bounding volumes for broad-phase filtering, then suitable shape intersections or mesh/BVH queries. Define contact tolerance, collision groups and intentional overlap (for example a rug below a chair). Scene queries can validate placement without running gravity. A raycast used to select an object is not a complete clash test.
- For dropping, stacking, mechanisms or walk-through contact, use a maintained engine such as Rapier with explicit metre/second units and gravity direction. Distinguish fixed, dynamic and kinematic bodies, collision shapes and sensors. Prefer simple/compound convex colliders for moving objects; reserve detailed concave geometry for suitable static scenes and verify engine limitations. Configure friction, restitution, mass/inertia, joints and limits from the requested behavior. Sleeping and collision filtering reduce unnecessary work.
- Give physics one fixed-step owner, cap catch-up after slow frames and reset elapsed time after suspension. Interpolate transforms for rendering if needed. Dynamic bodies own their simulated poses; move kinematic bodies through the engine and use a joint/target for simulated dragging. Avoid React, gizmos and physics simultaneously writing the same transform. Use continuous collision detection or substeps when measured fast-body tunneling requires them.
- Keep editable design, current simulation and recorded results distinct. A useful editor can enter play/pause/reset simulation while retaining the authored layout. Commit a simulation result to history only through an explicit bake/apply operation. Serialize durable body/joint settings by stable object IDs, never transient engine handles. Check dependencies when deleting an object and dispose bodies, colliders, joints and event queues on reset/unmount.
- Build particles with bounded emission, lifetime, maximum count, pooling and a reproducible seed where needed. Use points, instancing or a GPU simulation according to measured scale; reserve physical particles for interactions that matter. Avoid one component, draw call or rigid body per decorative particle. Budget transparent overdraw, fill rate, textures, post-processing and shadows as well as count. Disable or simplify decoration for reduced motion and low-power devices.
- For assembly animations, exploded views or imported skeletal clips, define timeline ownership and transitions. Keep animated visual pose separate from editable dimensions and collision pose, and provide pause/scrub/reset where useful. If contact matters during animation, specify how kinematic motion drives physics rather than assuming mesh animation updates colliders.
- Deformable materials, cloth, liquids, terrain, CAD/BIM semantics and structural analysis need domain-specific models, solvers or formats. State accuracy, solver and validation limits; a plausible animation is not engineering evidence. Use cancellable workers for expensive CPU computation and reject stale results after document changes.

Use [Rapier bodies](https://rapier.rs/docs/user_guides/javascript/rigid_bodies/), [colliders](https://rapier.rs/docs/user_guides/javascript/colliders/) and [scene queries](https://rapier.rs/docs/user_guides/javascript/scene_queries/) for the physics layer; check version-compatible APIs. Keep a debug collider view and fixtures for contact, sensors, constraints, fast motion, reset and resource release. This guidance applies only when those capabilities serve the requested product.

## Amazi application structure

Keep package files, lockfile, Dockerfile, source and assets together at the registered application's root. If importing this repository, use Amazi's empty application and its returned source path; GitHub synchronization does not register an app. Honor injected `PORT`, bind to `0.0.0.0`, retain the pinned package manager and Node 22 compatibility, and preserve Vite host checks. Actual production startup belongs to the Dockerfile. Keep readable source formatted; build output can be optimized. Browser-only scenes need no backend or persistent volume unless the requested product adds shared data or server computation. See [Amazi applications](https://docs.amazi.pro/en/applications) and [publishing](https://docs.amazi.pro/en/publishing-and-domains).

## Verify and deliver

Follow the current project's instructions and authorization for browser verification. Where browser checks are authorized, open the actual built app and inspect the scene. A canvas element existing in the DOM is not proof that geometry rendered correctly. Use focused tests, source inspection, and API evidence where manual browser verification is restricted.

Verify the implemented behaviors that matter: camera presets and framing; click selection; direct dragging; a single undo per drag; Escape cancellation followed by working orbit controls; boundary drops that leave saved state unchanged; room/object resizing; finish changes; duplication/removal; and persistence after reload. Exercise export/import and malformed input if provided. Test narrow screens, keyboard controls, loading/WebGL failures, and the browser console. Inspect a rendered screenshot and confirm relevant changes visibly affect the model. Add focused domain and browser tests for invariants and interaction bugs, not assertions that merely copy the implementation.

Before sharing a production preview, verify that its built assets and models load from the deployed origin, refresh works, and the intended interactions run there. Link to the verified public preview separately from the authenticated Amazi project page and source repository. Summarize working features and any material limitation, such as permitted object overlap or illustrative measurements.

Additional loader reference: [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html).
