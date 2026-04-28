import { createHighlighter } from "shiki";

let highlighterPromise = null;

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["dark-plus"],
      langs: ["html", "css", "javascript", "python", "bash", "json", "yaml", "toml", "go", "java", "c", "cpp", "rust","php", "ruby", "swift", "kotlin", "typescript"]
    });
  }
  return highlighterPromise;
}