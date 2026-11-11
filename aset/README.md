# aset/ — brand source files

Design source files for the Evora website: high-fi frames and click prototype, design tokens v1.0, and favicon/OG/logo masters. Owner: Hasim ([NVA-8](/NVA/issues/NVA-8)). Light theme only.

> **Rebrand status (NVA-18):** the files here were produced before the rebrand to Evora (NVA-10), so `logo/`, `favicon/`, `og/` and the `hifi/` prototype still show the old "NOVA Lab" / "NØVA Lab" name. They are kept as design reference only. The approved Evora brand assets live in [`public/brand/`](../public/brand/README.md) (NVA-11). Which set becomes the source for `public/` favicons and OG images is decided in E07 ([NVA-20](/NVA/issues/NVA-20)). Do not ship anything from `aset/logo`, `aset/favicon` or `aset/og` as-is.

- This folder is **not deployed**. Only `public/` is served by Cloudflare Pages.
- Web-ready exports (e.g. `favicon.svg`, `og-default.png`) go to `public/` or `src/assets/`, in a separate commit/PR coordinated with the frontend (Al).
- Commit through a branch + PR to `main`. Do not push directly to `main`; CI (`verify`) must be green before merging (see `docs/ops/runbook.md`).
- Use lowercase kebab-case file names, ASCII only. Keep files < 5 MB each.

## Contents

| Path                                                                     | What                                     | Use                                                             |
| ------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------- |
| `logo/novalab-logo-color.svg`                                            | Wordmark, ink + accent Ø slash           | Default, on `paper`/`surface`                                   |
| `logo/novalab-logo-mono.svg`                                             | Wordmark, one color (ink)                | Single-color print, embossing; recolor to one color only        |
| `logo/novalab-logo-mono-white.svg`                                       | Wordmark, white                          | Dark or photo backgrounds (with scrim ≥ 4.5:1)                  |
| `logo/novalab-logo-inverse.svg`                                          | Wordmark, on-dark + accent-on-dark       | Footer / `ink` bands                                            |
| `logo/novalab-mark-color.svg`, `logo/novalab-mark-inverse.svg`           | Ø monogram, no background                | Small brand marks, avatars                                      |
| `favicon/favicon.svg`                                                    | Ø on ink tile (master)                   | `<link rel="icon" type="image/svg+xml">`                        |
| `favicon/favicon.ico`                                                    | 16 + 32 + 48 px                          | Legacy `/favicon.ico`                                           |
| `favicon/favicon-32.png`                                                 | 32 px                                    | PNG fallback                                                    |
| `favicon/apple-touch-icon.png`                                           | 180 px, full bleed                       | `<link rel="apple-touch-icon">`                                 |
| `favicon/icon-192.png`, `favicon/icon-512.png`                           | Rounded tile                             | Web manifest `purpose: "any"`                                   |
| `favicon/icon-maskable-512.png` (+ `app-icon-maskable.svg`)              | Glyph inside safe zone                   | Web manifest `purpose: "maskable"`                              |
| `og/og-template.svg`                                                     | Editable 1200×630 social card            | Designers; needs Space Grotesk + Inter installed                |
| `og/og-template.html`                                                    | Same card as HTML, `?eyebrow=&title=`    | Render per page at 1200×630                                     |
| `og/og-default.png`, `og-about.png`, `og-services.png`, `og-contact.png` | Exported cards                           | `og:image` / `twitter:image`                                    |
| `tokens/tokens.json`, `tokens/tokens.css`                                | Design tokens v1.0                       | Source for the Tailwind theme                                   |
| `hifi/`                                                                  | High-fi frames + click prototype (NVA-8) | Design reference, **not** production code. See `hifi/README.md` |

## Logo rules

- Every logo SVG has `role="img"`, `aria-label="NOVA Lab"`, and `<title>NOVA Lab</title>`. When inlining, keep them; as `<img>`, use `alt="NOVA Lab"`.
- Glyphs are outlined from Space Grotesk 700/400 (SIL OFL 1.1), so no font is needed to render them.
- Clear space: at least the cap height of "N" on all sides. Minimum cap height 16 px (header: 20 px mobile, 24 px desktop; image height ≈ cap × 1.25).
- Don't stretch, skew, retype, add effects, color the whole wordmark accent, or place it on photos without a scrim.
- The accent `#7A6CFF` (3.88:1 on white) is decorative only. Never use it for text.
