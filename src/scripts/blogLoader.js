const modules = import.meta.glob("../blog/*.md", { eager: true });

export const blogArticles = Object.entries(modules).map(([path, module]) => {
  return {
    slug: path.split("/").pop().replace(".md", ""),
    component: module.default,
    meta: {
      title: module.title,
      date: module.date,
      description: module.description,
      draft: module.draft,
      image: module.image,
    },
  };
});