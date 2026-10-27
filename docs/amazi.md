# Amazi application setup

This repository is one React/Vite application at its root: `package.json`, `Dockerfile`, `src/`, and `public/` are siblings. It does not need a backend or an additional project manifest. Application registration and runtime settings belong to Amazi, outside Git.

When the repository is the complete project workspace, register this application with source path `.`. When importing into an existing project, create an empty application and copy these files into the source path Amazi allocates; do not replace the project workspace root or another application's files. Connecting GitHub synchronizes the workspace tree and does not discover or register applications automatically. Preserve the registered source path when synchronizing later changes.

Forma's repository already has a `main` branch. Keep an existing Amazi connection, or import the source into a new application's allocated directory. Amazi's initial GitHub connection flow requires a repository without `main`; source compatibility does not change that connection requirement.

Configure the application with:

| Setting                         | Value                                                                |
| ------------------------------- | -------------------------------------------------------------------- |
| Development command             | `pnpm install --ignore-scripts && exec pnpm run dev`                 |
| Development and production port | `10000`                                                              |
| Runtime tools                   | `node-22`, `pnpm-10`                                                 |
| Preview, public URL, publishing | Enabled                                                              |
| Production command              | Empty; use the Dockerfile command                                    |
| Production build context        | `application`                                                        |
| Request adapter                 | `vite-http`                                                          |
| Editor adapters                 | Optional `vite-jsx-source-selection`; no TanStack navigation adapter |
| Persistent volumes              | None                                                                 |

The runtime tool names are Amazi catalog identifiers. Corepack uses this repository's pinned package manager. Amazi supplies `PORT` and its preview proxy configuration; do not hardcode a public hostname or disable Vite's host checks. The page uses anchors and local state, so it does not need TanStack Router to run.

The Dockerfile follows Amazi's `development`, `build`, and `production` stages, accepts `AMAZI_RUNTIME_BASE_IMAGE`, and builds using the committed lockfile. The final non-root image serves `dist` with SPA fallback on `0.0.0.0:$PORT`. The optional `application_environment` build secret is loaded only for the build and removed afterward. Only variables intentionally prefixed `VITE_` belong in browser code; this app requires none.

The local Python launcher is a convenience for the desktop and is not the production process. Scene storage remains in the browser; use JSON export to transfer a scene between the desktop and an Amazi URL.
