<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { watch } from "vue"
import { useRoute } from "vue-router";

const route = useRoute();

watch(() => route.path, to => document.title = `𝓐𝓵𝓮𝔁𝓪𝓷𝓭𝓮𝓻499${ to !== '/' ? ` \u00B7 ${ to.replace("/", "") }` : ""}`, { immediate: true });
</script>

<template>
  <Header/>
  <main>
    <RouterView v-slot="{ Component }">
      <component :is="Component"/>
    </RouterView>
  </main>
  <Footer/>
</template>

<style scoped>
main {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  padding: 128px 0 192px;
  counter-reset: topSongs topArtists;
}
</style>

<style>
main > section {
  display: flex;
  width: calc(100% - 32px);
  max-width: 960px;
}
</style>