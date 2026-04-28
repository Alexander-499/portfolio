import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router.js";

import * as LucideIcons from "lucide-vue-next";

import "@/styles/general.css";

import CodeBlock from "@/components/ui/CodeBlock.vue";
import Aside from "@/components/ui/Aside.vue";

const app = createApp(App);

app.use(router);

for (const [name, component] of Object.entries(LucideIcons)) app.component(`Icon${name}`, component);

app.component("CodeBlock", CodeBlock);
app.component("Aside", Aside);

app.mount("#app");