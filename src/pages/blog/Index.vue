<script setup>
import { blogArticles } from "@/scripts/blogLoader";

const publishedArticles = blogArticles.filter(a => !a.meta.draft);
</script>

<template>
  <section class="articles">
    <div class="header">
      <h1>Articles</h1>
      <a href="/blog/rss.xml" target="_blank"><IconRss/></a>
    </div>
    <ul class="blog-list">
      <li v-for="article in publishedArticles" :key="article.slug">
        <RouterLink :to="`/blog/${article.slug}`">
          <div>
            <time :datetime="article.meta.date">
              <span class="year">{{ article.meta.date.split("-")[0] }}</span>
              <span class="month">
                <span v-for="char in new Date(0, parseInt(article.meta.date.split('-')[1]) - 1).toLocaleString('en-US', { month: 'short' })" :key="char">{{ char }}</span>
              </span>
              <span class="day">
                <span v-for="char in article.meta.date.split('-')[2]">{{ char }}</span>
              </span>
            </time>
          </div>
          <div v-if="article.meta.image" class="cover-image">
            <img :style="{ viewTransitionName: `blog-article-image-${article.slug}` }" :src="article.meta.image">
          </div>
          <div class="content">
            <h2 :style="{ viewTransitionName: `blog-article-title-${article.slug}` }">{{ article.meta.title }}</h2>
            <p v-if="article.meta.description" :style="{ viewTransitionName: `blog-article-description-${article.slug}` }">{{ article.meta.description }}</p>
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped src="@/styles/pages/blog/index.css"></style>