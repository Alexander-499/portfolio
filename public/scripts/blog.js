document.querySelectorAll("section.articles ul a").forEach(link => {
  link.addEventListener("click", () => {
    link.querySelector("img").style.viewTransitionName = "article-image";
    link.querySelector("h2").style.viewTransitionName = "article-title";
    link.querySelector("p").style.viewTransitionName = "article-description";
  });
});