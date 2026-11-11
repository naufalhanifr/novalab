# High-fi frames + UF1 prototype (NVA-8)

Design reference for the NOVA Lab MVP website (PRD v0.2). **Not production code.** The frontend implements the pages in Astro + Tailwind using `aset/tokens/` and these frames as the spec.

## Open the prototype

Open `prototype/index.html` in a browser (works from the file system, no server needed). UF1 path:

1. **Home**, then "Explore our services →"
2. **Services**, then "Discuss a project →" (opens Contact with Topic = "Project inquiry")
3. **Contact**: submit empty to see validation, fill in, then "Send message"
4. Outcome comes from the yellow **"Prototype only: submit outcome"** panel (Success / Network/server error / Rate limited). The panel is design-only and must not be built.

Other pages: `about.html`, `privacy.html`, `404.html`. Component and state sheet: `design-system.html`.

Frame-rendering URL params: `?frame=1` (hides the prototype panel), `?menu=open`, `?scrolled=1`, `?topic=project-inquiry`, and on Contact `?state=filled|error|over|sending|success|fail|ratelimit`.

## Frames

`frames/` holds PNG exports at 1× (360, 768, and 1440 px wide, full page unless noted). `uf1-*` are the click-through steps. The full index with notes is in the NVA-8 issue document `hifi`.

## Placeholders

Only two remain, shown as orange dashed chips (design/staging only, must not ship):

- `[TBC-10: legal entity name]`: footer ©
- `[TBC-16: …]`: Privacy Policy text and date
