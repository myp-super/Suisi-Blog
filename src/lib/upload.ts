import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function saveFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() || "bin";
  const hash = crypto.randomBytes(8).toString("hex");
  const filename = `${hash}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}
