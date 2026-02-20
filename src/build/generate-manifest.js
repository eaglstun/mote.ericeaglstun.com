import { readdir, stat, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..', '..');
const WORKSPACE = join(ROOT, 'workspace-mote');
const PUBLIC = join(ROOT, 'public');
const CONTENT_DIR = join(PUBLIC, 'content');

async function buildTree(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const children = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = join(dir, entry.name);
    const relPath = relative(WORKSPACE, fullPath);

    if (entry.isDirectory()) {
      const subtree = await buildTree(fullPath);
      children.push({
        name: entry.name,
        type: 'directory',
        children: subtree,
      });
    } else if (entry.name.endsWith('.md')) {
      const dest = join(CONTENT_DIR, relPath);
      await mkdir(join(dest, '..'), { recursive: true });
      await copyFile(fullPath, dest);

      children.push({
        name: entry.name,
        type: 'file',
        path: relPath,
      });
    }
  }

  return children;
}

async function main() {
  await mkdir(CONTENT_DIR, { recursive: true });
  const tree = await buildTree(WORKSPACE);
  await writeFile(join(PUBLIC, 'manifest.json'), JSON.stringify({ tree }, null, 2));
  console.log('Generated manifest.json and copied content files.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
