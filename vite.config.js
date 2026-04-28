import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Markdown from "unplugin-vue-markdown/vite";
import MarkdownItAnchor from "markdown-it-anchor";
import slugify from "@sindresorhus/slugify";

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueDevTools(),
    Markdown({
      frontmatter: true,
      exportFrontmatter: true,
      markdownItOptions: {
        html: true,
        linkify: true
      },
      markdownItSetup(md) {
        md.use(MarkdownItAnchor, {
          slugify,
          level: [2, 3],
          permalink: MarkdownItAnchor.permalink.linkInsideHeader({
            symbol: `<IconHash/>`,
            placement: "before",
            class: "anchor-link"
          })
        })
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    }
  }
});