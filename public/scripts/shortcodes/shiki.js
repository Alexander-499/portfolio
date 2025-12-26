import { createHighlighter } from "https://esm.sh/shiki";

const highlighter = await createHighlighter({
  themes: ["dark-plus"],
  langs: ["html", "css", "javascript", "python", "bash", "json", "yaml", "toml", "go", "java", "c", "cpp", "rust", "php", "ruby", "swift", "kotlin", "typescript"],
});

document.querySelectorAll(".shiki-block").forEach((block) => {
  const source = block.querySelector(".source").value;
  const lang = block.dataset.lang || "text";
  const html = highlighter.codeToHtml(source.trim(), { lang, theme: "dark-plus" });
  block.querySelector(".source").remove();
  block.insertAdjacentHTML("beforeend", html);

  const languageLabel = block.querySelector(".code-header .language-label");
  if (languageLabel) languageLabel.setAttribute("data-label", lang);
  
  const copyButton = block.querySelector(".code-header .copy-button");
  copyButton.addEventListener("click", () => {
    console.log("Copying code to clipboard:", source);
    navigator.clipboard.writeText(source);
    copyButton.innerHTML = `<i data-lucide="check"></i>`;
    lucide.createIcons();
    setTimeout(() => {
      copyButton.innerHTML = `<i data-lucide="copy"></i>`;
      lucide.createIcons();
    }, 1000);
  });
});

