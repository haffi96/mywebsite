import { defineConfig } from "astro/config";

// Plugins
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  markdown: {},
  server: { port: 8000 },
  integrations: [mdx({ gfm: true }), tailwind(), preact({ compat: true })],
});
