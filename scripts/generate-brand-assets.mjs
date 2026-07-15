import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve("public");
const iconsDir = path.join(publicDir, "icons");
const source = await readFile(path.join(publicDir, "favicon.svg"));
const brandYellow = "#FFE60F";

await mkdir(iconsDir, { recursive: true });

async function renderSquareIcon(size, outputPath, inset = 0) {
  const markSize = size - inset * 2;
  const mark = await sharp(source).resize(markSize, markSize).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandYellow,
    },
  })
    .composite([{ input: mark, left: inset, top: inset }])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

function wrapPngAsIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size === 256 ? 0 : size, 6);
  header.writeUInt8(size === 256 ? 0 : size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);
  return Buffer.concat([header, png]);
}

await Promise.all([
  renderSquareIcon(180, path.join(publicDir, "apple-touch-icon.png")),
  renderSquareIcon(192, path.join(iconsDir, "icon-192.png")),
  renderSquareIcon(512, path.join(iconsDir, "icon-512.png")),
  renderSquareIcon(512, path.join(iconsDir, "icon-maskable-512.png"), 52),
]);

const faviconPng = await sharp(source).resize(48, 48).png().toBuffer();
await writeFile(
  path.join(publicDir, "favicon.ico"),
  wrapPngAsIco(faviconPng, 48)
);
