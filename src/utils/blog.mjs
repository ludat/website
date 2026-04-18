import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Scans the drafts directory and returns urlSlug values from frontmatter.
 */
export function getDraftSlugs(draftsDir = 'src/content/drafts') {
  const slugs = [];
  let entries;
  try {
    entries = readdirSync(draftsDir, { withFileTypes: true });
  } catch {
    return slugs;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dirPath = join(draftsDir, entry.name);
    const files = readdirSync(dirPath);
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const content = readFileSync(join(dirPath, file), 'utf-8');
      const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
      if (!match) continue;
      const slugMatch = match[1].match(/^urlSlug:\s*(.+)$/m);
      if (slugMatch) {
        slugs.push(slugMatch[1].trim().replace(/^['"]|['"]$/g, ''));
      }
    }
  }
  return [...new Set(slugs)];
}
