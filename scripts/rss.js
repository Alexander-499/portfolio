import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import RSS from "rss";
import { fileURLToPath } from "url";

const dirName = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(dirName, "../src/blog");
const outputPath = path.join(dirName, "../public/blog/rss.xml");

const siteUrl = "http://localhost:5173";
const blogUrl = `${siteUrl}/blog`;

function getBlogPosts() {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith(".md"));

  return files.map(file => {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { data } = matter(raw);
    return { slug: file.replace(".md", ""), ...data };
  }).filter(post => !post.draft);
}

function generateRssFeed() {
  const feed = new RSS({
    title: "Alexander499's Blog",
    description: "Keep up-to-date on the latest blog posts from Alexander.",
    feed_url: `${blogUrl}/rss.xml`,
    site_url: siteUrl,
    language: "en",
    pubDate: new Date()
  });

  const posts = getBlogPosts();

  posts.forEach(post => {
    const url = `${blogUrl}/${post.slug}`;

    feed.item({
      title: post.title,
      description: post.description || "",
      url,
      guid: url,
      date: post.date
    });
  });

  const rss = feed.xml({ indent: true });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rss);

  console.log(`RSS feed generated with ${posts.length} post${posts.length > 1 ? "s" : ""}.`);
}

chokidar.watch("src/blog").on("change", () => generateRssFeed());
generateRssFeed();