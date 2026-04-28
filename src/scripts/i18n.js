import { ref, computed } from "vue";

const langData = {
  "en": {
    "home": "Home",
    "blog": "Blog",
    "commissions": "Commissions",
    "location": "Germany",
    "aboutText": "I'm a <em>teenage</em> developer, designer, gamer – basically doing much on my PC. I've been coding websites, apps and programs since <time datetime='2023'>2023</time>. My <b>goal</b> is to design <em>beautiful</em> and <em>aesthetically</em> pleasing user interfaces, with a focus on <em>front-end</em> development and a <em>design-driven</em> approach.",
    "stack": "What I've worked with",
    "totalCodingTime": "Total Coding Time*:",
    "projectsTitle": "Selected Projects",
    "projectDescriptions": {
      "zpeedometer": "Speedometer etc. dashboard on your phone for your car",
      "fluidftp": "Fluent FTP client using Electron with modern design",
      "cityCountryRiver": "Online party game similar to the categories game"
    },
    "allProjects": "All Projects",
    "whatIListenTo": "What I Listen To",
    "shortTerm": "4 Weeks",
    "mediumTerm": "6 Months",
    "longTerm": "All Time",
    "howThisWorks": "How this works",
    "subscribers": "Subscribers",
    "views": "Views",
    "videos": "Videos",
    "allProjectsTitle": "All Public Projects"
  },
  "de": {
    "home": "Start",
    "blog": "Blog",
    "commissions": "Aufträge",
    "location": "Deutschland",
    // "aboutText": "",
    "stack": "Was ich benutzt habe",
    "totalCodingTime": "Gesamte Coding Zeit*:",
    "projectsTitle": "Ausgewählte Projekte",
    "projectDescriptions": {
      "zpeedometer": "Speedometer etc. dashboard auf deinem Handy für dein Auto",
      "fluidftp": "Fluent FTP Client mit Electron und modernem Design",
      "cityCountryRiver": "Online party Spiel ähnlich zu Stadt Land Fluss"
    },
    "allProjects": "Alle Projekte",
    "whatIListenTo": "Was Ich So Höre",
    "shortTerm": "4 Wochen",
    "mediumTerm": "6 Monate",
    "longTerm": "Gesamt",
    "howThisWorks": "Wiese es funktioniert",
    "subscribers": "Abonnenten",
    "views": "Aufrufe",
    "videos": "Videos",
    "allProjectsTitle": "Alle Öffentlichen Projekte"
  }
}

export let currentLang = ref(new URLSearchParams(window.location.search).get("lang") || "en");
document.documentElement.lang = currentLang.value;

export function changeLang(route, router) {
  const newLang = currentLang.value === "en" ? "de" : "en";
  currentLang.value = newLang;

  router.push({
    path: route.path,
    query: { ...route.query, lang: newLang }
  });

  document.documentElement.lang = currentLang.value;
}

export function t(key) {
  return computed(() => {
    return langData[currentLang.value]?.[key] ?? langData["en"]?.[key] ?? "";
  });
}