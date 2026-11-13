# aset/ — brand source files

Design source files for the Evora website: high-fi frames and click prototype, and design tokens v1.1. Owner: Hasim ([NVA-8](/NVA/issues/NVA-8)). Light theme only.

> **Brand assets live in [`public/brand/`](../public/brand/README.md)** (Evora, NVA-11). The old "NOVA Lab" `logo/`, `favicon/` and `og/` folders were removed in NVA-48. Visual direction (palette, fonts, light theme) was confirmed for Evora in TBC-20, option (a). Rules: brand mini-kit v1.0 ([NVA-3](/NVA/issues/NVA-3#document-design)).

- This folder is **not deployed**. Only `public/` is served by Cloudflare Pages.
- Web-ready exports (e.g. `favicon.svg`, `og-default.png`) go to `public/` or `src/assets/`, in a separate commit/PR coordinated with the frontend (Al).
- Commit through a branch + PR to `main`. Do not push directly to `main`; CI (`verify`) must be green before merging (see `docs/ops/runbook.md`).
- Use lowercase kebab-case file names, ASCII only. Keep files < 5 MB each.

## Contents

| Path                                      | What                                     | Use                                                             |
| ----------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `tokens/tokens.json`, `tokens/tokens.css` | Design tokens v1.1                       | Source for the Tailwind theme                                   |
| `hifi/`                                   | High-fi frames + click prototype (NVA-8) | Design reference, **not** production code. See `hifi/README.md` |

Logo, favicon, app icon and OG image: use `public/brand/` only.

## Logo rules (summary of mini-kit v1.0 §1)

- One color only: `logo.ink #0B0B0F` on light backgrounds, `logo.paper #F4F4F5` on dark ones. Never on `primary` or other brand/accent colors.
- Accessible name "Evora": `<img alt="Evora">` inside the home link; don't add an extra `aria-label` on the link.
- Height: header 20 px (24 px from 1024 px), footer 32 px, minimum 16 px. Clear space ½ the wordmark height.
- Don't stretch, recolor, retype, or bring back the old "Ø"/"4Ø4" elements.
- The accent `#7A6CFF` (3.88:1 on white) is decorative only. Never use it for text.
