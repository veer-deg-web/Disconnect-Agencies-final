import { createHash } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const BLOG_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blogs");
const BLOG_PLACEHOLDER_FILE = "blog-featured-placeholder.webp";

function cleanName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "blog-image";
}

export function isWebpImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes(".webp") || /[?&]fm=webp(?:&|$)/i.test(lower);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensurePlaceholderWebp(): Promise<string> {
  await mkdir(BLOG_UPLOAD_DIR, { recursive: true });
  const placeholderPath = path.join(BLOG_UPLOAD_DIR, BLOG_PLACEHOLDER_FILE);
  const exists = await fileExists(placeholderPath);
  if (!exists) {
    const buffer = await sharp({
      create: {
        width: 1600,
        height: 900,
        channels: 3,
        background: { r: 18, g: 18, b: 18 },
      },
    })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    await writeFile(placeholderPath, buffer);
  }

  return `/uploads/blogs/${BLOG_PLACEHOLDER_FILE}`;
}

async function readImageBuffer(imageUrl: string): Promise<Buffer> {
  if (imageUrl.startsWith("/")) {
    const localPath = path.join(process.cwd(), "public", imageUrl);
    return readFile(localPath);
  }

  const res = await fetch(imageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`);
  }
  const bytes = await res.arrayBuffer();
  return Buffer.from(bytes);
}

export async function ensureWebpImage(
  imageUrl: string,
  nameHint: string
): Promise<string> {
  if (!imageUrl || !imageUrl.trim()) return ensurePlaceholderWebp();

  const source = imageUrl.trim();
  if (source.startsWith("/") && isWebpImageUrl(source)) {
    const localPath = path.join(process.cwd(), "public", source);
    const exists = await fileExists(localPath);
    if (exists) return source;
    return ensurePlaceholderWebp();
  }
  if (isWebpImageUrl(source)) return source;

  try {
    const sourceBuffer = await readImageBuffer(source);
    const digest = createHash("sha1").update(sourceBuffer).digest("hex").slice(0, 12);
    const filename = `${cleanName(nameHint)}-${digest}.webp`;
    const outPath = path.join(BLOG_UPLOAD_DIR, filename);

    await mkdir(BLOG_UPLOAD_DIR, { recursive: true });
    const webpBuffer = await sharp(sourceBuffer)
      .rotate()
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    await writeFile(outPath, webpBuffer);

    return `/uploads/blogs/${filename}`;
  } catch {
    return ensurePlaceholderWebp();
  }
}
