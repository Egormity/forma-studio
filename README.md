# Forma Studio

A local, interactive 3D house and furniture studio. Explore a furnished space, change its dimensions and finishes, and arrange furniture directly in the scene.

The public template is maintained on `main` in [Egormity/forma-studio](https://github.com/Egormity/forma-studio).

This is a parametric visual demonstration for exploring the experience of a construction or furniture configurator. Measurements and geometry are illustrative; it is not a CAD, structural-engineering, or construction-documentation tool.

## Open the app

Double-click **Forma Studio** on the Ubuntu desktop. If Ubuntu asks, choose **Allow Launching** once. The shortcut starts a small local server and opens the app in its own Chrome window. If Chrome is unavailable, it opens the default browser.

The built app needs **Python 3** and a browser with WebGL support. Node.js and pnpm are only needed when developing or rebuilding it.

To launch from a terminal:

```bash
cd /home/egormity/Desktop/egormity-repos/Egormity/forma-studio
python3 scripts/launch.py
```

To start without opening a window:

```bash
python3 scripts/launch.py --no-open
```

The app is served at **http://127.0.0.1:4399**. Opening the shortcut again reuses the existing local server. If another app occupies that port, the launcher reports the conflict instead of using it.

Closing the window leaves the local server available for your next visit. To stop it:

```bash
python3 scripts/launch.py --stop
```

The launcher's process ID and startup log live in `~/.cache/forma-studio` (or `$XDG_CACHE_HOME/forma-studio`). Each new server replaces the previous startup log, and requests are not logged. The server listens only on `127.0.0.1`, serves files only from `dist`, and does not list directories.

## Explore a space

- Orbit and zoom around the house; switch to a top or front view for placement.
- Change the building's width, depth, and height, and choose materials and colors.
- Toggle the roof, cutaway walls, grid, and dimensions to inspect the interior.
- Add furniture, select a piece, and adjust its position, size, or color. Use move controls to drag a selected item on the floor.
- Rotate, duplicate, or remove furniture, and use undo and redo while experimenting.
- Export a scene as JSON to keep or share a copy. Import a scene JSON to continue editing it.

Furniture stays within the room boundary, including after rotation or resizing. Dragging snaps to 25 cm; the property fields allow finer placement. The scene supports up to 40 pieces. Objects can overlap one another; this demonstration does not calculate furniture collisions. Keyboard shortcuts: **Ctrl/Cmd+Z** to undo, **Ctrl/Cmd+Shift+Z** to redo, **Escape** to clear selection, and **Delete** to remove the selected piece.

The current scene is saved automatically in your browser's local storage. An unreadable existing save remains intact until a deliberate edit; before replacement the app preserves its raw content in a recovery key. If saving is blocked, export JSON to keep the current session. It is specific to that browser profile and address; clearing browser data removes it. Export JSON for a portable backup. There is no account, cloud service, or sign-in. All house and furniture geometry is created by the app; no external 3D assets are downloaded.

## Develop or rebuild

Use **Node.js 22.12 or newer** and the pinned **pnpm 11.7.0** through Corepack:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Development runs at `http://127.0.0.1:4398` and listens on all interfaces so Amazi's proxy can reach it. `PORT` overrides the development and Vite preview ports; without it, they remain 4398 and 4399. A `.env` file is optional; see `.env.example`. Invalid ports fail immediately instead of selecting another port. The Python desktop launcher remains loopback-only on 4399.

To produce the files used by the desktop app:

```bash
pnpm build
```

Refresh the app after rebuilding. The development address and desktop address have separate browser storage.

Run the application and local-server checks:

```bash
pnpm format:check
pnpm typecheck
pnpm test
python3 -m unittest discover -s scripts -p 'test_*.py'
```

After building, run the browser checks with `pnpm test:browser`. These use the installed Google Chrome, start a temporary server on port 4400, and exercise room edits, object edits, history, persistence, import/export, direct canvas selection and dragging, cancellation, boundary drops, idle rendering, and the narrow layout. Set `CHROME_PATH` to use another Chromium executable.

To run the static server in the foreground, optionally on a different port:

```bash
python3 scripts/serve.py --port 4399
```

Stop that foreground process with `Ctrl+C`. The launcher's `--stop` command stops only a server that the launcher itself started.

## Reuse as an Amazi template

- [Architecture](docs/architecture.md) explains document, geometry, editor, persistence and rendering ownership.
- [Extension guide](docs/extending.md) covers new objects, collision queries, optional physics and effects.
- [Amazi setup](docs/amazi.md) owns source-path registration, runtime ports and production packaging.
- [Interactive 3D skill](skill/agent-content.md) describes development flow and advanced visualization choices.

The skill's localized Admin metadata is in `skill/catalog.json`; custom skills receive their UUID in Amazi.
The editor implements procedural geometry and bounded room placement. Physics, gravity and particles
are documented extension paths, not hidden capabilities of this example.

Source is formatted with `pnpm format`; check it with `pnpm format:check`. Production assets may be
minified by the build, while files edited in Amazi remain readable.

## Implementation and references

React and TypeScript provide the interface. Three.js, React Three Fiber, and Drei render the procedural scene and provide camera and object controls. This project uses those libraries and adapts documented component patterns; it is not a copy of a complete third-party example application.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for source links and license notices. The desktop shortcut contains absolute paths; update its `Exec`, `Icon`, and `Path` fields if you move the app folder.
