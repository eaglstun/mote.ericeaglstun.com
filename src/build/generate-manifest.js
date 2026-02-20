import {
  readdir,
  readFile,
  stat,
  mkdir,
  copyFile,
  writeFile,
} from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "..");
const WORKSPACE = join(ROOT, "workspace-mote");
const PUBLIC = join(ROOT, "public");
const CONTENT_DIR = join(PUBLIC, "content");
const SITE_URL = "https://mote.ericeaglstun.com";

const allFiles = [];

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
        type: "directory",
        children: subtree,
      });
    } else {
      const dest = join(CONTENT_DIR, relPath);
      await mkdir(join(dest, ".."), { recursive: true });
      await copyFile(fullPath, dest);

      if (entry.name.endsWith(".md")) {
        const fileStat = await stat(fullPath);
        const content = await readFile(fullPath, "utf-8");
        const titleMatch = content.match(/^#\s+(.+)/m);
        const title = titleMatch
          ? titleMatch[1]
          : entry.name.replace(/\.md$/, "");

        const bodyLines = content
          .split("\n")
          .filter((l) => l && !l.startsWith("#") && !l.startsWith("**"));
        const excerpt = bodyLines.slice(0, 3).join(" ").slice(0, 280);

        allFiles.push({ path: relPath, title, excerpt, mtime: fileStat.mtime });

        children.push({
          name: entry.name,
          type: "file",
          path: relPath,
        });
      }
    }
  }

  return children;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRss(files) {
  const sorted = [...files].sort((a, b) => b.mtime - a.mtime);
  const items = sorted
    .map((f) => {
      const link = `${SITE_URL}/${f.path}`;
      const pubDate = f.mtime.toUTCString();
      return `    <item>
      <title>${escapeXml(f.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(f.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>mote</title>
    <link>${SITE_URL}</link>
    <description>mote — a collection of writings</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

async function main() {
  await mkdir(CONTENT_DIR, { recursive: true });
  const tree = await buildTree(WORKSPACE);
  await writeFile(
    join(PUBLIC, "manifest.json"),
    JSON.stringify({ tree }, null, 2),
  );
  await writeFile(join(PUBLIC, "rss.xml"), buildRss(allFiles));
  console.log("Generated manifest.json, rss.xml, and copied content files.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
