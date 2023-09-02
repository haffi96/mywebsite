import { defineConfig } from "astro/config";

// Plugins
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
    markdown: {
        gfm: true,
    },
    server: { port: 8000 },
    integrations: [
        mdx(),
        tailwind(),
        preact({ compat: true })
    ],
});
