// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// SITE_URL is set per environment in CI. Production domain is still TBC-04.
export default defineConfig({
  site: process.env.SITE_URL ?? "https://evora.pages.dev",
  output: "static",
  trailingSlash: "ignore",
  vite: { plugins: [tailwindcss()] },
});
