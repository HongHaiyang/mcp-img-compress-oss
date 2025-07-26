import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".avif"];

export async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function compressImage(inputPath, outputPath, options = {}) {
  try {
    const {
      quality = 90,
      format = null,
      keepMetadata = false,
      progressive = true,
    } = options;

    let sharpInstance = sharp(inputPath);
    const metadata = await sharpInstance.metadata();
    const originalSize = await getFileSize(inputPath);

    if (!keepMetadata) {
      sharpInstance = sharpInstance.withMetadata({});
    }

    const outputFormat = format || metadata.format;
    switch (outputFormat.toLowerCase()) {
      case "jpeg":
      case "jpg":
        sharpInstance = sharpInstance.jpeg({
          quality,
          progressive,
          mozjpeg: true,
        });
        break;
      case "png":
        sharpInstance = sharpInstance.png({
          quality,
          compressionLevel: 9,
          progressive,
          palette: true,
          adaptiveFiltering: true,
        });
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({
          quality,
          lossless: quality >= 90,
          nearLossless: quality >= 85 && quality < 90,
        });
        break;
      case "avif":
        sharpInstance = sharpInstance.avif({
          quality,
          lossless: quality >= 90,
        });
        break;
    }

    await sharpInstance.toFile(outputPath);
    let compressedSize = await getFileSize(outputPath);

    if (compressedSize >= originalSize) {
      await fs.copyFile(inputPath, outputPath);
      compressedSize = originalSize;
    }

    const compressionRatio = (
      ((originalSize - compressedSize) / originalSize) * 100
    ).toFixed(2);

    return {
      success: true,
      inputPath,
      outputPath,
      originalSize: formatFileSize(originalSize),
      compressedSize: formatFileSize(compressedSize),
      compressionRatio: `${compressionRatio}%`,
      format: outputFormat,
      dimensions: `${metadata.width}x${metadata.height}`,
    };
  } catch (error) {
    return {
      success: false,
      inputPath,
      error: error.message,
    };
  }
}

export { SUPPORTED_FORMATS }; 