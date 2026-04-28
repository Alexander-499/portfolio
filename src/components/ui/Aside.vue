<script setup>
defineProps({
  type: { type: String, default: "info" },
  title: String
})
</script>

<template>
  <aside class="aside" :class="[type]">
    <IconInfo v-if="type === 'info'"/>
    <IconCheck v-else-if="type === 'check'"/>
    <IconTriangleAlert v-else-if="type === 'warning'"/>
    <IconCircleX v-else-if="type === 'error'"/>
    <div class="main">
      <strong>{{ title }}</strong>
      <div>
        <slot/>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.aside {
  position: relative;
  background-color: hsl(from var(--accent-color) h calc(s * 0.5) calc(l * 0.5) / 0.3);
  border: 2px hsl(from var(--accent-color) h s calc(l * 0.5)) solid;
  border-radius: 24px 12px 12px;
  corner-top-left-shape: scoop;
  padding: 12px 12px 12px 32px;
  margin: 1.5rem 0 1rem;

  svg {
    height: 32px;
    width: 32px;
    position: absolute;
    left: -16px;
    top: -16px;
    color: hsl(from var(--accent-color) h s calc(l * 0.5));
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 4px;

    strong { font-size: 22px; }
  }
}

aside.info { --accent-color: var(--color-accent-blue); }
aside.check { --accent-color: var(--color-accent-green); }
aside.warning { --accent-color: var(--color-accent-yellow); }
aside.error { --accent-color: var(--color-accent-red); }
</style>