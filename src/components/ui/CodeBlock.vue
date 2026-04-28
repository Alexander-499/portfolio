<script setup>
import { ref, onMounted } from "vue";
import { getHighlighter } from "@/scripts/shiki.js";

const props = defineProps({
  lang: { type: String, default: "text" },
  code: { type: String, required: true }
});

const highlightedHtml = ref("");
const codeCopied = ref(false);

let code = props.code.split("\n");
while (code.length && code[0].trim() === "") code.shift();
while (code.length && code[code.length - 1].trim() === "") code.pop();
if (code.length > 0) {
  const leadingSpaces = code[0].match(/^ */)[0].length;
  code = code.map(line => line.substring(leadingSpaces).replace(/\s+$/, ""));
}
code = code.join("\n").replace(/%([qbd])%/g, (match, key) => ({ q: "\"", b: "`", d: "$"})[key]);

onMounted(async () => highlightedHtml.value = (await getHighlighter()).codeToHtml(
  code,
  { lang: props.lang, theme: "dark-plus" }
));

function copyCode() {
  navigator.clipboard.writeText(code);
  codeCopied.value = true;
  setTimeout(() => codeCopied.value = false, 1000);
}
</script>

<template>
  <div class="shiki-block">
    <div class="code-header">
      <span class="language-label" :data-label="props.lang">
        <IconCode/>
      </span>
      <button class="copy-button" @click="copyCode">
        <IconCheck v-if="codeCopied"/>
        <IconCopy v-else/>
      </button>
    </div>
    <slot/>
    <div class="code-content" v-html="highlightedHtml"></div>
  </div>
</template>

<style scoped>
.shiki-block {
  background-color: var(--color-bg-primary2);
  border: 1px var(--color-bg-secondary) solid;
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;

  .code-header {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px var(--color-bg-secondary) solid;

    svg {
      height: 20px;
      stroke: gray;
    }

    &::before {
      height: 12px;
      width: 12px;
      content: "";
      display: inline-block;
      background-color: #ff5f56;
      border-radius: 50%;
      margin-left: 12px;
      box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
    }

    span {
      display: flex;
      align-items: center;
      gap: 4px;

      &::after {
        content: attr(data-label);
        font-size: 14px;
        font-weight: 600;
        color: gray;
      }
    }

    button {
      height: 28px;
      width: 28px;
      background-color: transparent;
      border: none;
      margin: 0 4px;
      cursor: pointer;
      transition-duration: 200ms;
      &:active { scale: 0.8; }
    }
  }

  &:deep(pre), &:deep(code) { background-color: var(--color-bg-primary2); }

  &:deep(code) {
    display: flex;
    flex-direction: column;
    font-family: "JetBrains Mono";
    font-size: 14px;
    line-height: 1.375;
    padding: 8px 4px;
    counter-reset: code;

    > span {
      white-space: pre-wrap;

      &::before {
        min-width: 22px;
        display: inline-block;
        text-align: right;
        content: counter(code);
        counter-increment: code;
        color: var(--color-text-tertiary);
        margin-right: 8px;
      }
    }
  }
}
</style>