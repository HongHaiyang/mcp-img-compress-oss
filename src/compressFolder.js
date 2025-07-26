import path from "path";
import { glob } from "glob";
import fs from "fs/promises";
import { compressImage, getFileSize, formatFileSize, SUPPORTED_FORMATS } from "./compressImage.js";

export async function compressFolder(inputFolder, outputFolder, options = {}) {
  const {
    quality = 90,
    format,
    recursive = true,
  } = options;

  // 检查输入文件夹是否存在
  try {
    const stat = await fs.stat(inputFolder);
    if (!stat.isDirectory()) {
      throw new Error(`路径不是文件夹: ${inputFolder}`);
    }
  } catch {
    throw new Error(`输入文件夹不存在: ${inputFolder}`);
  }

  // 生成输出文件夹路径
  const finalOutputFolder = outputFolder || `${inputFolder}_compressed`;
  await fs.mkdir(finalOutputFolder, { recursive: true });

  // 查找所有图片文件
  const pattern = recursive
    ? path.join(inputFolder, "**", `*{${SUPPORTED_FORMATS.join(",")}}`)
    : path.join(inputFolder, `*{${SUPPORTED_FORMATS.join(",")}}`);

  const imageFiles = await glob(pattern, { nocase: true });

  if (imageFiles.length === 0) {
    return {
      success: false,
      message: `⚠️ 在文件夹 ${inputFolder} 中没有找到支持的图片文件`,
    };
  }

  const results = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let successCount = 0;

  for (const inputPath of imageFiles) {
    let relativePath = path.relative(inputFolder, inputPath);
    if (format) {
      const ext = path.extname(relativePath);
      relativePath = relativePath.replace(ext, `.${format}`);
    }
    const outputPath = path.join(finalOutputFolder, relativePath);

    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    const result = await compressImage(inputPath, outputPath, {
      quality,
      format,
      keepMetadata: false,
      progressive: true,
    });

    results.push(result);

    if (result.success) {
      successCount++;
      const originalBytes = await getFileSize(inputPath);
      const compressedBytes = await getFileSize(outputPath);
      totalOriginalSize += originalBytes;
      totalCompressedSize += compressedBytes;
    }
  }

  const totalCompressionRatio =
    totalOriginalSize > 0
      ? (((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(2)
      : 0;

  const failedResults = results.filter((r) => !r.success);

  let resultText = `🎉 批量压缩完成！\n\n📊 处理统计:\n• 总文件数: ${imageFiles.length}\n• 成功: ${successCount}\n• 失败: ${results.length - successCount}\n• 总原始大小: ${formatFileSize(totalOriginalSize)}\n• 总压缩后大小: ${formatFileSize(totalCompressedSize)}\n• 总压缩率: ${totalCompressionRatio}%\n\n📁 输出文件夹: ${finalOutputFolder}`;

  if (failedResults.length > 0) {
    resultText += `\n\n❌ 失败的文件:\n${failedResults.map((r) => `• ${r.inputPath}: ${r.error}`).join("\n")}`;
  }

  return {
    success: true,
    message: resultText,
  };
} 