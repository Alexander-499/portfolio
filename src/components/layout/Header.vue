<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router";
import { currentLang, changeLang, t } from "@/scripts/i18n.js";

const route = useRoute();
const router = useRouter();

const isSuperheader = ref(localStorage.getItem("isSuperheader") !== "false");
const hideSuperheader = () => {
  isSuperheader.value = false;
  localStorage.setItem("isSuperheader", "false")
}

onMounted(() => {
  if (!localStorage.getItem("isSuperheader")) localStorage.setItem("isSuperheader", "true");
})
</script>

<template>
  <header id="header">
    <div v-if="isSuperheader" class="superheader">
      <p>Zpeedometer &ndash; the app that shows speed, altitude, compass, speed warning and a lot more (really) &ndash; has released! <a href="https://play.google.com/store/apps/details?id=com.alexander499.zpeedometer">Check it out!</a></p>
      <button title="Hide" @click="hideSuperheader"><IconX/></button>
      <div class="zigzag"></div>
    </div>
    <div class="main">
      <div class="left">
        <span>❤️‍🔥</span>
        <RouterLink to="/" exact-active-class="active">Alexander499</RouterLink>
      </div>
      <nav>
        <ul>
          <li class="home"><RouterLink to="/" exact-active-class="active">{{ t("home") }}</RouterLink></li>
          <li><RouterLink :class="{ active: route.path.startsWith('/blog') }" to="/blog">{{ t("blog") }}</RouterLink></li>
        </ul>
      </nav>
      <div class="right">
        <span @click="changeLang(route, router)">{{ currentLang === "en" ? "German" : "English" }}</span>
        <button id="colorThemeButton" onclick="alert('Out of service.')"><IconMoon/></button>
        <label for="navToggle">
          <IconMenu/>
          <input id="navToggle" type="checkbox">
        </label>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  position: fixed;
  inset: 0 0 auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1c1c1c44;
  border-bottom: 1px #3338 solid;
  backdrop-filter: blur(4px);
  user-select: none;
  z-index: 100;
  transition-duration: 500ms;

  .superheader {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: #ffcc33;
    font-weight: 700;
    text-align: center;
    padding-top: 4px;
    z-index: 101;

    p {
      text-wrap: balance;
      margin-right: 28px;
    }

    a { font-weight: 900; }

    button {
      position: absolute;
      right: 2px;
      display: grid;
      place-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: scale 200ms;
      &:hover svg { color: var(--color-accent-red) }
      &:active { scale: 0.8; }

      svg {
        height: 28px;
        width: 28px;
        color: black;
        transition: color 200ms;
      }
    }

    .zigzag {
      position: absolute;
      bottom: -16px;
      height: 16px;
      width: 100%;
      background-image: url("assets/images/superheader-zigzag.svg");
      background-size: contain;
    }
  }

  .main {
    height: 72px;
    width: min(100vw, 1280px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;

    @media (min-width: 840px) { div.left, div.right { min-width: 128px; } }

    a { text-decoration: none; }

    > div {
      display: flex;
      align-items: center;
    }

    div.left {
      font-size: 24px;

      a {
        font-family: Pacifico;
        @media (width <= 400px) { display: none; }
        &.active { color: var(--color-accent-blue); }
      }

      span {
        font-size: 36px;
        transition: scale 500ms;
        &:hover { scale: -1 1; }
      }
    }

    nav {
      padding-left: 16px;
      margin-right: auto;

      ul {
        display: flex;
        gap: 8px;
        list-style-type: none;
        font-size: 17px;
        font-weight: 700;
        text-transform: uppercase;

        li {
          padding: 0 12px;
          translate: 0 2px;

          &.home { @media (width > 400px) { display: none; }}

          a {
            transition: color 200ms;
            &.active { color: var(--color-accent-blue); }
          }
        }
      }
    }

    div.right {
      color: var(--color-text-secondary);
      justify-content: flex-end;

      > span {
        cursor: pointer;
        margin-right: 8px;
      }

      button, label {
        display: flex;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 8px;

        svg { stroke: var(--color-text-secondary); }
        input { display: none; }
      }

      label[for="navToggle"] { display: none; }
    }

    @media (width <= 640px) {
      nav {
        height: 100vh;
        position: absolute;
        inset: 100% 0 auto 100%;
        background: var(--color-bg-secondary);
        flex-direction: column;
        padding: 16px 0;
        overflow: hidden;
        transition: inset 200ms;

        ul { flex-direction: column; }
        li { display: flex; }
        li a { font-size: 20px; padding: 4px 12px; }
      }

      label[for="navToggle"] { display: flex !important; }
      &:has(#navToggle:checked) nav { inset: 100% 0 auto 0; }
    }
  }
}
</style>