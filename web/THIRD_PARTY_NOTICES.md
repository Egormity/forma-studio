# Third-party software and references

Forma Studio creates its own procedural house and furniture geometry. It does not bundle downloaded 3D models, photographic textures, or a copied example application. The desktop icon is an original SVG created for this project.

## 3D libraries

- **Three.js** — MIT license. [Source and license](https://github.com/mrdoob/three.js). Provides the rendering engine, geometry, lighting, and materials.
- **React Three Fiber** — MIT license. [Source and license](https://github.com/pmndrs/react-three-fiber). Provides React bindings for Three.js.
- **Drei** — MIT license. [Source and license](https://github.com/pmndrs/drei). Provides reusable scene helpers and controls.

Official documentation informed the integration of reusable components:

- [Drei controls introduction](https://drei.docs.pmnd.rs/controls/introduction)
- [Three.js OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
- [Drei CameraControls](https://drei.docs.pmnd.rs/controls/camera-controls)
- [Drei TransformControls](https://drei.docs.pmnd.rs/gizmos/transform-controls)
- [React Three Fiber documentation](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Three.js documentation](https://threejs.org/docs/)

The application uses these dependencies and documented patterns rather than copying a full third-party repository. Relevant package license files are included with installed dependencies in `node_modules`; retain their copyright and license notices when redistributing this application or its dependencies.

## Other dependencies

- [React](https://github.com/facebook/react) — MIT license.
- [Lucide](https://github.com/lucide-icons/lucide) — ISC license for the icon library; see the project's license for icon provenance.
- [Vite](https://github.com/vitejs/vite) — MIT license (build and development tooling).
- [TypeScript](https://github.com/microsoft/TypeScript) — Apache-2.0 license (development tooling).
- [Vitest](https://github.com/vitest-dev/vitest) — MIT license (test tooling).
- [Playwright](https://github.com/microsoft/playwright) — Apache-2.0 license (test tooling).

The desktop launcher and static server use Python's standard library. No additional Python packages are required.
