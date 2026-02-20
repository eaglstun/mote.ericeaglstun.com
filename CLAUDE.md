# Mote

A two-panel markdown viewer. File browser on the left, rendered markdown on the right. Sidebar collapses on mobile.

## Stack

- React 19, Vite 7, Yarn
- `react-markdown` for rendering
- ESLint 10 (flat config), Prettier

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
    generate-manifest.js — Build script: scans workspace-mote/, generates manifest.json, rss.xml, copies .md files to public/content/
workspace-mote/     — Markdown content (git-tracked)
public/
  manifest.json     — Generated (gitignored)
  rss.xml           — Generated RSS feed (gitignored)
  content/          — Copied .md files (gitignored)
eslint.config.js    — ESLint flat config (Node globals scoped to src/build/)
.prettierrc         — Prettier config
```

## Commands

- `yarn dev` — Start dev server (auto-generates manifest via `predev`)
- `yarn build` — Production build (auto-generates manifest via `prebuild`)
- `yarn lint` / `yarn lint:fix` — Check/fix ESLint issues
- `yarn format` / `yarn format:fix` — Check/fix Prettier formatting
- `node src/build/generate-manifest.js` — Regenerate manifest manually

## Key Details

- URL paths match file paths (e.g. `/night-work/2026-02-18/01-2330-the-projectionist-stays-late.md`) for bookmarking/sharing
- Sidebar is always visible on desktop, collapsible via hamburger menu on mobile (<=768px)
- RSS feed at `/rss.xml` with titles and excerpts, sorted newest-first
- `public/content/`, `public/manifest.json`, and `public/rss.xml` are build artifacts, gitignored
- `package.json` has `"type": "module"` for ESM support in the build script
