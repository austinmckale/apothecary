import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const guidesDirectory = path.join(process.cwd(), 'src/content/guides');

export type Guide = {
  slug: string;
  title: string;
  date: string;
  contentHtml: string;
  excerpt: string;
};

export function getGuideSlugs() {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }
  return fs.readdirSync(guidesDirectory);
}

export function getGuideBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(guidesDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Ensure content is a string
  const safeContent = typeof content === 'string' ? content : '';

  // Extract title from first H1 if not in frontmatter
  let title = data.title;
  let cleanContent = safeContent;
  
  if (!title) {
    const titleMatch = safeContent.match(/^#\s+(.*)/);
    if (titleMatch) {
      title = titleMatch[1];
      // Remove the title from the content so it doesn't repeat
      cleanContent = safeContent.replace(/^#\s+(.*)/, '').trim();
    } else {
      // Fallback to slug title case
      title = realSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  return {
    slug: realSlug,
    title,
    date: data.date || new Date().toISOString(),
    content: cleanContent,
    ...data,
  };
}

export async function getGuideData(slug: string): Promise<Guide | null> {
  const guide = getGuideBySlug(slug);
  if (!guide) return null;

  const processedContent = await remark()
    .use(html)
    .process(guide.content);
  
  const contentHtml = processedContent.toString();

  return {
    slug: guide.slug,
    title: guide.title,
    date: guide.date,
    contentHtml,
    excerpt: guide.content.slice(0, 200) + '...',
  };
}

export function getAllGuides(): Guide[] {
  const slugs = getGuideSlugs();
  const guides = slugs
    .filter(slug => slug.endsWith('.md'))
    .map(slug => {
      const guide = getGuideBySlug(slug);
      if (!guide) return null;
      const content = guide.content || '';
      const excerpt = content.slice(0, 150).replace(/[#*_]/g, '') + '...';
      return {
        slug: guide.slug,
        title: guide.title,
        date: guide.date,
        contentHtml: '', // Not needed for list
        excerpt,
      };
    })
    .filter((guide) => guide !== null) as Guide[];

  return guides.sort((a, b) => (a.title > b.title ? 1 : -1));
}
