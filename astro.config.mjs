import { defineConfig } from 'astro/config';
import astroRemark from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
    markdown: {
        extendDefaultPlugins: true,
        rehypePlugins: [
            "rehype-slug",
            [
                "rehype-autolink-headings",
                { behavior: "append"},
            ],
            [
                "rehype-toc",
                { headings: ["h1", "h2", "h3"] }
            ]
        ],
    },
});
