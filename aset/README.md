# aset/ — brand source files

Source files for the Evora brand (logo SVG, favicon masters, OG image templates). Owner: Hasim ([NVA-8](/NVA/issues/NVA-8)).

- This folder is **not deployed**. Only `public/` is served by Cloudflare Pages.
- Web-ready exports (e.g. `favicon.svg`, `og-default.png`) go to `public/` or `src/assets/`, in a separate commit/PR coordinated with the frontend (Al).
- Commit through a branch + PR to `main` (direct pushes to `main` are blocked). CI must be green.
- Suggested layout: `aset/logo/`, `aset/favicon/`, `aset/og/`. Use lowercase kebab-case file names, ASCII only.
- Keep files reasonably small (< 5 MB each). For large design sources (e.g. `.fig`, `.psd`), commit an export and link the original instead.
