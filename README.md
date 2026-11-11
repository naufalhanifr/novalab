# NOVA Lab Website

Official website of NØVA Lab.

## Technology Stack

- Astro (static output) + TypeScript + Tailwind CSS (decision D1, NVA-4)
- Hosting: Cloudflare Pages (D2), contact form via Pages Function (D3)
- Light visual theme; English-only MVP (`lang="en"`), UI strings in `src/i18n/ui.ts` (PRD v0.2)

## Repository layout

- `src/` site source, `public/` static files served as-is (incl. `_headers`), `functions/` Pages Functions
- `aset/` brand source files (not deployed), see [aset/README.md](aset/README.md)
- `docs/ops/` runbook

## Development

Requires Node 24 (`.nvmrc`) and pnpm via Corepack (`corepack enable`).

```bash
pnpm install
pnpm dev            # local dev server
pnpm run build      # static build to dist/
pnpm run preview    # serve dist/ + functions with wrangler (headers, 404, form)
pnpm run lint && pnpm run check && pnpm run format:check
```

## Deployment

See [docs/ops/runbook.md](docs/ops/runbook.md) for CI/CD, preview, production, and rollback.

Repository: https://github.com/naufalhanifr/novalab
