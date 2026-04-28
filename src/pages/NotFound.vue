<script setup>
import { useRoute } from "vue-router"

const route = useRoute();
</script>

<template>
  <section>
    <div>
      <h1>Not Found!?</h1>
      <p>The page you’re looking for doesn’t exist. Try checking the URL.</p>
      <div class="links">
        <RouterLink to="/"><IconHouse/> Return Home</RouterLink>
        <RouterLink :to="route.query.from"><IconRotateCw/>Reload</RouterLink>
      </div>
    </div>
    <span class="error-code">404</span>
  </section>
</template>

<style scoped>
section {
  height: 368px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 64px 0 -64px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    z-index: 1;

    h1, p {
      color: var(--color-text-secondary);
      text-align: center;
    }

    h1 {
      font-size: min(128px, 15vw);
      font-weight: 900;
      white-space: nowrap;
    }

    .links {
      display: flex;
      gap: 8px;

      a {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: var(--color-bg-secondary);
        text-decoration: none;
        border-radius: 12px;
        padding: 8px;
        transition: scale 200ms;
        &:hover { scale: 1.05; }
        &:active { scale: 0.95; }

        svg {
          height: 20px;
          width: 20px;
        }
      }
    }
  }

  .error-code {
    position: absolute;
    color: var(--color-text-tertiary);
    font-size: min(640px, 45vw);
    font-weight: 900;
    line-height: 0.8;
    opacity: 0.05;
    user-select: none;
  }
}
</style>