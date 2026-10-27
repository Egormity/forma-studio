# Amazi application setup

This repository contains one standalone React/Vite application in `web/`. Its package manifest, lockfile, Dockerfile, source, assets, tests, and app documentation stay together inside that directory. No build or runtime file is required from the repository root. Application registration and runtime settings belong to Amazi, outside Git.

The example repository uses `web/` as its application directory. To import, create an `empty_application` and copy only the contents of the template's `web/` into the application source path Amazi returns. Do not copy the repository wrapper into that directory or replace other applications. Preserve the allocated source path; its name does not have to be `web`. GitHub synchronization copies the workspace tree and does not discover or register applications automatically.

Forma's public template uses `main` as its default branch. Keep an existing Amazi connection, or import the application source from `main` into a new application's allocated directory. Amazi's initial GitHub connection flow requires a repository without `main`; use a separate repository for a new synchronization connection. Source compatibility does not change that connection requirement.

Configure the application with the settings below. Commands run inside its registered source path. Production build context `application` uses only that directory and its Dockerfile (`web/Dockerfile` in this repository).

To keep the exact `web` name in a new project, configure the empty allocated application's source path before copying, only while the target directory does not already exist. Changing `sourcePath` moves its allocated directory and rejects an existing target; it does not register a populated directory. Keep the returned application catalog authoritative.

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

From the repository root, verify the independent build context with:

```bash
docker build -t forma-studio ./web
docker run --rm -e PORT=10000 -p 127.0.0.1:4401:10000 forma-studio
```

After copying `web/` elsewhere, run the same build from that application directory with `docker build -t forma-studio .`.
