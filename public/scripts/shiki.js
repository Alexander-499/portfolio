import fs from "fs";
import path from "path";
import { getHighlighter } from "shiki";

const CONTENT_DIR = "content";

const highlighter = await getHighlighter({
  theme: "dark-plus"
});

function highlightFile(filePath) {
  let md = fs.readFileSync(filePath, "utf8");

  md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return highlighter.codeToHtml(code, {
      lang: lang || "text"
    });
  });

  fs.writeFileSync(filePath, md);
}

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".md")) {
      highlightFile(fullPath);
    }
  }
}

walk(CONTENT_DIR);