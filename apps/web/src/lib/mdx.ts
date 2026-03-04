import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDir = path.join(process.cwd(), "..", "..", "content");

export interface MdxArticle {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
  content: string;
}

export interface MdxArticleMeta {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
}

function getFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursive(fullPath));
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontmatter(filePath: string): MdxArticleMeta | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  if (!data.title || !data.slug) return null;

  return {
    slug: data.slug,
    title: data.title,
    category: data.category ?? "TECHNIQUE",
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? null,
    publishedAt: data.publishedAt
      ? new Date(data.publishedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function getAllMdxArticles(): MdxArticleMeta[] {
  const files = getFilesRecursive(contentDir);
  const articles: MdxArticleMeta[] = [];

  for (const file of files) {
    const meta = parseFrontmatter(file);
    if (meta) articles.push(meta);
  }

  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getMdxArticleBySlug(
  slug: string,
): Promise<MdxArticle | null> {
  const files = getFilesRecursive(contentDir);

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content: mdContent } = matter(raw);

    if (data.slug === slug) {
      const result = await remark().use(html).process(mdContent);

      return {
        slug: data.slug,
        title: data.title,
        category: data.category ?? "TECHNIQUE",
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? "",
        coverImage: data.coverImage ?? null,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt).toISOString()
          : new Date().toISOString(),
        content: result.toString(),
      };
    }
  }

  return null;
}

export function getMdxArticlesByCategory(
  category: string,
): MdxArticleMeta[] {
  return getAllMdxArticles().filter((a) => a.category === category);
}
