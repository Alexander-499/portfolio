import { createRouter, createWebHistory } from "vue-router"
import { blogArticles } from "@/scripts/blogLoader";

const pages = import.meta.glob("./pages/**/*.vue");
const load = path => pages[`./pages/${path}.vue`];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: load("Index") },
    { path: "/blog", component: load("blog/Index") },
    { path: "/blog/:slug", component: load("blog/Article"), props: true, beforeEnter: (to, from, next) => next(blogArticles.some(a => a.slug === to.params.slug) ? undefined : { path: "/404" })},
    { path: "/404", component: load("NotFound") },
    { path: "/:pathMatch(.*)*", redirect: "/404" },
  ]
});

let isTransitioning = false;

router.beforeEach((to, from, next) => {
  if (from.query.lang && !to.query.lang) {
    next({ ...to, query: { ...to.query, lang: from.query.lang } });
    return;
  }

  if (to.path === "/404" || to.redirectedFrom) {
    const originalPath = to.redirectedFrom?.fullPath || to.fullPath;
    if (!to.query.from && originalPath !== "/404") return next({
      path: "/404",
      query: { ...to.query, from: originalPath.replace(/^\//, "")},
      replace: true
    });
  }

  if (!document.startViewTransition || isTransitioning) return next();
  isTransitioning = true;

  document.startViewTransition(async () => {
    next();
  }).finished.finally(() => isTransitioning = false)
});

export default router;