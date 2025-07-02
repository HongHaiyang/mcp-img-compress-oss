import sharp from "sharp";
import fs from "fs/promises";
import { getFileSize, formatFileSize } from "./compressImage.js";

export async function getImageInfo(imagePath) {
  try {
    await fs.access(imagePath);
  } catch {
    throw new Error(`图片文件不存在: ${imagePath}`);
  }

  const metadata = await sharp(imagePath).metadata();
  const fileSize = await getFileSize(imagePath);

  return {
    filePath: imagePath,
    fileSize: formatFileSize(fileSize),
    format: metadata.format,
    dimensions: `${metadata.width}x${metadata.height}`,
    channels: metadata.channels,
    density: metadata.density || "N/A",
    hasAlpha: !!metadata.hasAlpha,
    colorSpace: metadata.space || "N/A",
  };
} 