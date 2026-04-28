<script setup>
import Giscus from "@giscus/vue";
import { ref, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { blogArticles } from "@/scripts/blogLoader";

const route = useRoute();
const toc = ref([]);
const activeSection = ref("");

const article = blogArticles.find(a => a.slug === route.params.slug);
const articlePath = window.location.origin + route.path;
const copyArticleLink = () => navigator.clipboard.writeText(articlePath);

const getHeadings = () => [...document.querySelectorAll(".markdown :is(h2, h3)")]
const observeHeadings = () => {
  const headings = getHeadings();
  if (!headings.length) return activeSection.value = "";
  let ticking = false;

  const update = () => {
    let current = "";
    for (const h of headings)
      if (h.getBoundingClientRect().top <= 80) current = h.id;
      else break;
    activeSection.value = current;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
  return () => window.removeEventListener("scroll", onScroll);
};

watch(() => route.params.slug, async () => {
  await nextTick();
  toc.value = getHeadings().map(h => ({ id: h.id, text: h.textContent.trim(), depth: +h.tagName[1]}))
  observeHeadings();
}, { immediate: true });
</script>

<template>
  <section class="article">
    <article>
      <header>
        <h1 :style="{ viewTransitionName: `blog-article-title-${article.slug}` }">{{ article.meta.title }}</h1>
        <p v-if="article.meta.description" :style="{ viewTransitionName: `blog-article-description-${article.slug}` }">{{ article.meta.description }}</p>
        <time>{{ new Date(article.meta.date).toLocaleDateString("en-GB") }}</time>
        <span class="divider">{{ "&nbsp;".repeat(24) }}</span>
        <div v-if="article.meta.image" class="cover-image">
          <a :href="article.meta.image">
            <img :style="{ viewTransitionName: `blog-article-image-${article.slug}`}" :src="article.meta.image">
          </a>
        </div>
      </header>
      <div class="content">
        <component :is="article.component" class="markdown"/>
      </div>
      <Giscus
        repo="Alexander-499/portfolio"
        repoId="R_kgDOQvYAGQ"
        category="Blog"
        categoryId="DIC_kwDOQvYAGc4C0RIs"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="1"
        inputPosition="top"
        theme="dark"
        lang="en"
        loading="lazy"
      />
    </article>
    <div class="sidebar">
      <ul class="links">
        <li><a :href="`https://www.x.com/intent/post?url=${article.meta.title}:%20${articlePath}`" target="_blank" title="Share on X"><img src="https://cdn.simpleicons.org/x/ccc" draggable="false" alt="X Icon"></a></li>
        <li><a :href="`mailto:?subject=${article.meta.title}&body=${articlePath}`" title="Share via email"><IconMail/></a></li>
        <li><button @click="copyArticleLink" title="Copy link"><IconLink/></button></li>
      </ul>
      <div class="table-of-contents">
        <h2>Table of Contents</h2>
        <a
          v-for="item in toc"
          :key="item.id"
          :href="`#${item.id}`"
          :class="[`depth-${item.depth}`, { active: item.id === activeSection, anchored: item.id === route.hash.replace(/^#/, '') }]"
        >
          {{ item.text }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped src="@/styles/pages/blog/article.css"></style>