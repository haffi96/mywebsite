import { defineConfig } from 'astro/config';

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    // rehypePlugins: ["rehype-slug", ["rehype-autolink-headings", {
    //   behavior: "append"
    // }], ["rehype-toc", {
    //   headings: ["h1", "h2", "h3"]
    // }]],
  },
  integrations: [mdx()]
});