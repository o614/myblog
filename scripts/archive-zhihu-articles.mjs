import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("archive/zhihu");
const articleIds = [
  "2001668824802534136",
  "2020194112008136084",
  "2028772835124855042",
  "2030568958005351764",
];

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function toPlainText(fragment) {
  return decodeHtml(
    fragment
      .replace(/<\/(h[1-6]|p|blockquote|figure|li|ul|ol)>/gi, "\n")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function imageExtension(url) {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)
    ? extension
    : ".jpg";
}

async function download(url, destination) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; 290935.xyz archive)" },
  });
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

for (const id of articleIds) {
  const articleDir = path.join(root, id);
  const imageDir = path.join(articleDir, "images");
  await mkdir(imageDir, { recursive: true });

  const source = await readFile(path.join(articleDir, "source.html"), "utf8");
  const titleMatch = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const bodyMatch = source.match(
    /<div class="RichText[^>]*" id="contentRoot">([\s\S]*?)<\/div><div class="ContentItem-time"/i
  );
  if (!titleMatch || !bodyMatch) {
    throw new Error(`Could not find article content for ${id}`);
  }

  const title = toPlainText(titleMatch[1]);
  let content = bodyMatch[1];
  const imageUrls = [...content.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/gi)].map(
    match => decodeHtml(match[1])
  );
  const uniqueImageUrls = [...new Set(imageUrls)];
  const archivedImages = [];

  for (const [index, url] of uniqueImageUrls.entries()) {
    const filename = `${String(index + 1).padStart(2, "0")}${imageExtension(url)}`;
    await download(url, path.join(imageDir, filename));
    content = content.replaceAll(url, `./images/${filename}`);
    content = content.replaceAll(
      url.replaceAll("&", "&amp;"),
      `./images/${filename}`
    );
    archivedImages.push({ source: url, file: `images/${filename}` });
  }

  content = content.replace(/<img\b[^>]*>/gi, tag => {
    const localSource = tag.match(/src="(\.\/images\/[^"]+)"/i)?.[1];
    if (!localSource) return tag;
    return tag.replace(
      /data-original="[^"]*"/i,
      `data-original="${localSource}"`
    );
  });
  content = content.replace(/\sdata-draft-cover="[^"]*"/gi, "");

  const authorMatch = source.match(/"authorId":(\d+),"name":"([^"]+)"/);
  const createdMatch = source.match(/"created":(\d+)/);
  const editedMatch = source.match(
    /<div class="ContentItem-time">编辑于\s*([^·<]+)/
  );
  const sourceUrl = `https://www.zhihu.com/tardis/jm/art/${id}`;
  const archivedAt = new Date().toISOString();

  const readableHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { max-width: 760px; margin: 48px auto; padding: 0 20px; color: #1d1d1f; font: 17px/1.75 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      img { display: block; max-width: 100%; height: auto; margin: 24px auto; }
      blockquote { margin: 24px 0; padding: 1px 20px; border-left: 4px solid #d2d2d7; color: #515154; }
      a { color: #06c; }
    </style>
  </head>
  <body>
    <p><small>原文：<a href="${sourceUrl}">${sourceUrl}</a> · 归档于 ${archivedAt}</small></p>
    <h1>${title}</h1>
    ${content}
  </body>
</html>
`;

  const metadata = {
    id,
    title,
    author: authorMatch
      ? { id: Number(authorMatch[1]), name: decodeHtml(authorMatch[2]) }
      : null,
    sourceUrl,
    createdAt: createdMatch
      ? new Date(Number(createdMatch[1]) * 1000).toISOString()
      : null,
    editedAt: editedMatch ? editedMatch[1].trim() : null,
    archivedAt,
    images: archivedImages,
    files: {
      rawSource: "source.html",
      readableCopy: "article.html",
      plainText: "article.txt",
    },
  };

  await writeFile(path.join(articleDir, "article.html"), readableHtml, "utf8");
  await writeFile(
    path.join(articleDir, "article.txt"),
    toPlainText(content),
    "utf8"
  );
  await writeFile(
    path.join(articleDir, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8"
  );

  process.stdout.write(`${id}: ${title} (${archivedImages.length} images)\n`);
}
