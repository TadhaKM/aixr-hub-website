# Vendored libraries

Self-hosted animation libraries (no CDN at runtime — the site must work offline
and on any static host). Both MIT licensed.

| File | Package | Source |
|---|---|---|
| `motion-13.1.0.min.js` | motion 13.1.0 (motion.dev) — IIFE build, exposes `window.Motion` | https://cdn.jsdelivr.net/npm/motion@13.1.0/dist/motion.js |
| `anime-4.5.0.esm.min.js` | animejs 4.5.0 (animejs.com) — self-contained ES module | https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.esm.min.js |

To upgrade: download the new dist file from jsDelivr with a pinned version in
the filename, update the `<script>` tags in every page and the import in
`animations.js`, and re-verify the degradation matrix in the repo's plan notes.
