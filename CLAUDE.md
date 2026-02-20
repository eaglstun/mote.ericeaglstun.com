# Mote

A two-panel markdown viewer. File browser on the left, rendered markdown on the right.

## Stack

- React 19, Vite 7, Yarn
- `react-markdown` for rendering

## Project Structure

```
src/
  App.jsx           — Root component, two-panel layout, URL routing via History API
  App.css           — All styles (BEM naming)
  index.jsx         — Entry point
  components/
    FileTree.jsx    — Collapsible directory tree, fetches manifest.json
    MarkdownViewer.jsx — Fetches and renders markdown files
  build/
    generate-manifest.js — Build script: scans workspace-mote/, generates public/manifest.json, copies .md files to public/content/
workspace-mote/     — Markdown content (git-tracked)
public/
  manifest.json     — Generated (gitignored)
  content/          — Copied .md files (gitignored)
```

## Commands

- `yarn dev` — Start dev server (auto-generates manifest via `predev`)
- `yarn build` — Production build (auto-generates manifest via `prebuild`)
- `node src/build/generate-manifest.js` — Regenerate manifest manually

## Key Details

- URL paths match file paths (e.g. `/night-work/2026-02-18.md`) for bookmarking/sharing
- `public/content/` and `public/manifest.json` are build artifacts, gitignored
- `package.json` has `"type": "module"` for ESM support in the build script
