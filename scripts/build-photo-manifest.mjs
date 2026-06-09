import fs from "node:fs";
import path from "node:path";

const pageDir = path.join(
  process.cwd(),
  "p",
  "b3a84384cd134556a3c4e661c5073caa"
);
const photoDir = path.join(pageDir, "daily-photos");
const uploadDir = path.join(photoDir, "uploads");
const manifestPath = path.join(photoDir, "manifest.json");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

fs.mkdirSync(uploadDir, { recursive: true });

const photos = fs
  .readdirSync(uploadDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .filter((entry) => allowedExtensions.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => {
    const absolutePath = path.join(uploadDir, entry.name);
    const stats = fs.statSync(absolutePath);

    return {
      path: `./daily-photos/uploads/${entry.name}`,
      alt: "今天的照片",
      version: `${stats.mtimeMs}-${stats.size}`,
      updatedAt: stats.mtime.toISOString()
    };
  })
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

const manifest = {
  updatedAt: new Date().toISOString(),
  photos
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
