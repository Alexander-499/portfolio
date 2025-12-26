// Lucide icons
lucide.createIcons();

// Language
languageSelector = document.getElementById("languageSelector");
const lang = window.location.search.replace("?", "").split("&").find(s => s.startsWith("lang="))?.split("=")[1] || "en";
languageSelector.innerText = lang === "en" ? "Deutsch" : "English";
document.documentElement.lang = lang;
languageSelector.addEventListener("click", () => {
  const params = new URLSearchParams(window.location.search);
  params.set("lang", lang === "en" ? "de" : "en");
  window.location.search = params.toString();
})

document.querySelectorAll("[data-lang]").forEach(el => {
  const key = el.getAttribute("data-lang");
  let value = langData[lang];
  for (const k of key.split(".")) { value = value?.[k] || langData["en"]?.[key]; }
  if (value) el.innerHTML = value;
});

// Visit Count
const visitCount = document.getElementById("visitCount");
fetch("https://alexander499.goatcounter.com/counter/all.json")
  .then(r => r.json())
  .then(data => { visitCount.textContent = data.count.toLocaleString(); });