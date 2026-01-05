'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { revalidatePath } from 'next/cache';

// When running from frontend directory, process.cwd() is the frontend root
const guidesDirectory = path.join(process.cwd(), 'src/content/guides');

type GuideActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createGuideAction(formData: FormData): Promise<GuideActionState> {
  const title = formData.get('title') as string | null;
  const content = formData.get('content') as string | null;

  if (!title || !content) {
    return { ok: false, message: 'Title and content are required' };
  }

  const slug = slugify(title);
  const fullPath = path.join(guidesDirectory, `${slug}.md`);

  // Check if file already exists
  if (fs.existsSync(fullPath)) {
    return { ok: false, message: `A guide with slug "${slug}" already exists` };
  }

  try {
    // Ensure directory exists
    if (!fs.existsSync(guidesDirectory)) {
      fs.mkdirSync(guidesDirectory, { recursive: true });
    }

    // Create frontmatter and content
    const frontmatter = {
      title,
      date: new Date().toISOString(),
    };

    const fileContent = matter.stringify(content, frontmatter);

    // Write file
    fs.writeFileSync(fullPath, fileContent, 'utf8');

    revalidatePath('/admin/guides');
    revalidatePath('/guides');
    revalidatePath(`/guides/${slug}`);

    return { ok: true, message: 'Guide created successfully' };
  } catch (error) {
    console.error('createGuideAction error', error);
    return { ok: false, message: 'Failed to create guide file' };
  }
}

export async function updateGuideAction(formData: FormData): Promise<GuideActionState> {
  const slug = formData.get('slug') as string | null;
  const title = formData.get('title') as string | null;
  const content = formData.get('content') as string | null;

  if (!slug || !title || !content) {
    return { ok: false, message: 'Slug, title, and content are required' };
  }

  const fullPath = path.join(guidesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return { ok: false, message: 'Guide not found' };
  }

  try {
    // Read existing file to preserve date
    const existingContent = fs.readFileSync(fullPath, 'utf8');
    const { data: existingData } = matter(existingContent);

    // Create new frontmatter, preserving original date
    const frontmatter = {
      title,
      date: existingData.date || new Date().toISOString(),
    };

    const fileContent = matter.stringify(content, frontmatter);

    // Write updated file
    fs.writeFileSync(fullPath, fileContent, 'utf8');

    revalidatePath('/admin/guides');
    revalidatePath('/guides');
    revalidatePath(`/guides/${slug}`);

    return { ok: true, message: 'Guide updated successfully' };
  } catch (error) {
    console.error('updateGuideAction error', error);
    return { ok: false, message: 'Failed to update guide file' };
  }
}

export async function deleteGuideAction(formData: FormData): Promise<GuideActionState> {
  const slug = formData.get('slug') as string | null;

  if (!slug) {
    return { ok: false, message: 'Slug is required' };
  }

  const fullPath = path.join(guidesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return { ok: false, message: 'Guide not found' };
  }

  try {
    fs.unlinkSync(fullPath);

    revalidatePath('/admin/guides');
    revalidatePath('/guides');
    revalidatePath(`/guides/${slug}`);

    return { ok: true, message: 'Guide deleted successfully' };
  } catch (error) {
    console.error('deleteGuideAction error', error);
    return { ok: false, message: 'Failed to delete guide file' };
  }
}

