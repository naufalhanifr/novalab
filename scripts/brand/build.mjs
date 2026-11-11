// Generates Evora brand assets (SVG source + PNG exports) into public/brand.
// Usage: node scripts/brand/build.mjs   (requires @resvg/resvg-js resolvable via NODE_PATH)
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Resvg } = require("@resvg/resvg-js");

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = join(root, "public", "brand");
mkdirSync(out, { recursive: true });

// Palette — monochrome, matches the existing dark identity.
const INK = "#0B0B0F"; // background / dark
const PAPER = "#F4F4F5"; // foreground on dark
const STROKE = 16; // stroke weight on a 100-unit x-height

// Glyphs drawn on a 100-unit x-height grid (geometric, monoline).
const glyph = {
  e: {
    w: 100,
    d: `<path d="M8 50H92A42 42 0 1 0 79.7 79.7" fill="none" stroke-width="${STROKE}"/>`,
  },
  v: { w: 90, d: `<path d="M0 0H18L45 74L72 0H90L54 100H36Z" stroke="none"/>` },
  o: { w: 100, d: `<circle cx="50" cy="50" r="42" fill="none" stroke-width="${STROKE}"/>` },
  r: { w: 60, d: `<path d="M8 100V50A42 42 0 0 1 50 8H60" fill="none" stroke-width="${STROKE}"/>` },
  a: {
    w: 100,
    d: `<circle cx="50" cy="50" r="42" fill="none" stroke-width="${STROKE}"/><path d="M92 0V100" fill="none" stroke-width="${STROKE}"/>`,
  },
};
const TRACK = 14;

function wordmarkGroup(color) {
  let x = 0;
  const parts = [];
  for (const ch of "evora") {
    parts.push(`<g transform="translate(${x} 0)">${glyph[ch].d}</g>`);
    x += glyph[ch].w + TRACK;
  }
  return { width: x - TRACK, g: `<g fill="${color}" stroke="${color}">${parts.join("")}</g>` };
}

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const files = {};

// 1. Wordmark (transparent background), dark-bg and light-bg variants.
for (const [name, color] of [
  ["evora-wordmark-on-dark", PAPER],
  ["evora-wordmark-on-light", INK],
]) {
  const { width, g } = wordmarkGroup(color);
  files[`${name}.svg`] = svg(width, 100, g, "Evora");
}

// 2. Symbol: the "e" glyph alone (transparent), both variants.
for (const [name, color] of [
  ["evora-symbol-on-dark", PAPER],
  ["evora-symbol-on-light", INK],
]) {
  files[`${name}.svg`] = svg(
    100,
    100,
    `<g fill="${color}" stroke="${color}">${glyph.e.d}</g>`,
    "Evora",
  );
}

// 3. App icon: symbol on a dark rounded square (used for favicon / touch / PWA).
const appIcon = (radius) =>
  svg(
    512,
    512,
    `<rect width="512" height="512" rx="${radius}" fill="${INK}"/>` +
      `<g transform="translate(136 136) scale(2.4)" fill="${PAPER}" stroke="${PAPER}">${glyph.e.d}</g>`,
    "Evora",
  );
files["evora-app-icon.svg"] = appIcon(112);
files["evora-app-icon-square.svg"] = appIcon(0); // iOS applies its own mask

// 4. Open Graph image 1200x630.
{
  const { width, g } = wordmarkGroup(PAPER);
  const scale = 1.3;
  const tx = (1200 - width * scale) / 2;
  const ty = (630 - 100 * scale) / 2;
  const body =
    `<defs><radialGradient id="glow" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#1C1C24"/><stop offset="1" stop-color="${INK}"/></radialGradient>` +
    `<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1"/></pattern></defs>` +
    `<rect width="1200" height="630" fill="url(#glow)"/><rect width="1200" height="630" fill="url(#grid)"/>` +
    `<g transform="translate(${tx} ${ty}) scale(${scale})">${g}</g>`;
  files["evora-og.svg"] = svg(1200, 630, body, "Evora");
}

for (const [f, content] of Object.entries(files)) writeFileSync(join(out, f), content);

// PNG exports.
const png = (src, dest, width, bg) => {
  const r = new Resvg(files[src], { fitTo: { mode: "width", value: width }, background: bg });
  writeFileSync(join(out, dest), r.render().asPng());
};
png("evora-app-icon.svg", "favicon-32.png", 32);
png("evora-app-icon-square.svg", "apple-touch-icon-180.png", 180);
png("evora-app-icon.svg", "evora-app-icon-512.png", 512);
png("evora-og.svg", "evora-og-1200x630.png", 1200);
png("evora-wordmark-on-dark.svg", "evora-wordmark-on-dark.png", 1012);
png("evora-wordmark-on-light.svg", "evora-wordmark-on-light.png", 1012);
png("evora-symbol-on-dark.svg", "evora-symbol-on-dark.png", 512);
png("evora-symbol-on-light.svg", "evora-symbol-on-light.png", 512);

// Review preview sheet (not shipped to site).
{
  const dark = wordmarkGroup(PAPER),
    light = wordmarkGroup(INK);
  const body =
    `<rect width="1200" height="900" fill="#FFFFFF"/>` +
    `<rect x="0" y="0" width="1200" height="300" fill="${INK}"/><g transform="translate(${(1200 - dark.width) / 2} 100)">${dark.g}</g>` +
    `<rect x="0" y="300" width="1200" height="300" fill="${PAPER}"/><g transform="translate(${(1200 - light.width) / 2} 400)">${light.g}</g>` +
    `<rect x="0" y="600" width="1200" height="300" fill="#2A2A33"/>` +
    `<g transform="translate(140 650)"><rect width="200" height="200" rx="44" fill="${INK}"/><g transform="translate(53 53) scale(0.94)" fill="${PAPER}" stroke="${PAPER}">${glyph.e.d}</g></g>` +
    `<g transform="translate(420 700)"><rect width="100" height="100" rx="22" fill="${INK}"/><g transform="translate(26.5 26.5) scale(0.47)" fill="${PAPER}" stroke="${PAPER}">${glyph.e.d}</g></g>` +
    `<g transform="translate(600 734)"><rect width="32" height="32" rx="7" fill="${INK}"/><g transform="translate(8.5 8.5) scale(0.15)" fill="${PAPER}" stroke="${PAPER}">${glyph.e.d}</g></g>` +
    `<g transform="translate(720 700)"><rect width="100" height="100" fill="${PAPER}"/><g transform="translate(20 20) scale(0.6)" fill="${INK}" stroke="${INK}">${glyph.e.d}</g></g>` +
    `<g transform="translate(900 700)"><rect width="100" height="100" fill="${INK}" stroke="#55556A"/><g transform="translate(20 20) scale(0.6)" fill="${PAPER}" stroke="${PAPER}">${glyph.e.d}</g></g>`;
  const r = new Resvg(svg(1200, 900, body, "Evora preview"), {
    fitTo: { mode: "width", value: 1200 },
  });
  writeFileSync(
    join(process.env.PREVIEW_DIR || out, "evora-brand-preview.png"),
    r.render().asPng(),
  );
}

console.log("Wrote", Object.keys(files).length, "SVGs + PNG exports to", out);
