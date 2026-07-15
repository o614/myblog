import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content", "posts");
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGE_PATTERN = /(!\[[^\]]*\]\()([^\s)]+\.(?:png|jpe?g|webp))(\))/gi;
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 84;
const force = process.argv.includes("--force");

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(entryPath);
      return /\.mdx?$/i.test(entry.name) ? [entryPath] : [];
    })
  );
  return files.flat();
}

async function convertImage(publicUrl) {
  if (!publicUrl.startsWith("/") || publicUrl.startsWith("//")) return null;

  const outputUrl = publicUrl.replace(/\.(?:png|jpe?g|webp)$/i, ".webp");
  const outputPath = path.join(PUBLIC_DIR, outputUrl.replace(/^\/+/, ""));
  const sourceUrls = /\.webp$/i.test(publicUrl)
    ? [".png", ".jpg", ".jpeg"].map(extension =>
        publicUrl.replace(/\.webp$/i, extension)
      )
    : [publicUrl];

  let sourcePath;
  for (const sourceUrl of sourceUrls) {
    const candidate = path.join(PUBLIC_DIR, sourceUrl.replace(/^\/+/, ""));
    try {
      await stat(candidate);
      sourcePath = candidate;
      break;
    } catch {
      // Try the next source format.
    }
  }

  if (!sourcePath) return null;

  const sourceStats = await stat(sourcePath);
  let shouldConvert = true;
  try {
    const outputStats = await stat(outputPath);
    shouldConvert = force || outputStats.mtimeMs < sourceStats.mtimeMs;
  } catch {
    // The optimized file does not exist yet.
  }

  if (shouldConvert) {
    const optimizedImage = await sharp(sourcePath)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        height: MAX_WIDTH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
      .toBuffer();
    await writeFile(outputPath, optimizedImage);
  }

  const outputStats = await stat(outputPath);
  const metadata = await sharp(outputPath).metadata();
  if (
    (metadata.width && metadata.width > MAX_WIDTH) ||
    (metadata.height && metadata.height > MAX_WIDTH)
  ) {
    throw new Error(`Optimized image exceeds ${MAX_WIDTH}px: ${outputUrl}`);
  }

  return {
    outputUrl,
    savedBytes: Math.max(0, sourceStats.size - outputStats.size),
    sourceBytes: sourceStats.size,
    outputBytes: outputStats.size,
  };
}

const markdownFiles = await listMarkdownFiles(CONTENT_DIR);
const imageUrls = new Set();
const markdownByFile = new Map();

for (const file of markdownFiles) {
  const markdown = await readFile(file, "utf8");
  markdownByFile.set(file, markdown);
  for (const match of markdown.matchAll(IMAGE_PATTERN)) imageUrls.add(match[2]);
}

const conversions = new Map();
for (const imageUrl of imageUrls) {
  const result = await convertImage(imageUrl);
  if (result) conversions.set(imageUrl, result);
}

for (const [file, markdown] of markdownByFile) {
  const updated = markdown.replace(
    IMAGE_PATTERN,
    (fullMatch, prefix, imageUrl, suffix) => {
      const conversion = conversions.get(imageUrl);
      return conversion
        ? `${prefix}${conversion.outputUrl}${suffix}`
        : fullMatch;
    }
  );
  if (updated !== markdown) await writeFile(file, updated, "utf8");
}

const totals = [...conversions.values()].reduce(
  (result, image) => ({
    sourceBytes: result.sourceBytes + image.sourceBytes,
    outputBytes: result.outputBytes + image.outputBytes,
    savedBytes: result.savedBytes + image.savedBytes,
  }),
  { sourceBytes: 0, outputBytes: 0, savedBytes: 0 }
);

const megabytes = bytes => (bytes / 1024 / 1024).toFixed(2);
process.stdout.write(
  `Processed ${conversions.size} images: ${megabytes(totals.sourceBytes)} MB -> ${megabytes(totals.outputBytes)} MB (saved ${megabytes(totals.savedBytes)} MB).\n`
);
