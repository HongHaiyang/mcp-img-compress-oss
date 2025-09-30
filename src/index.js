#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import path from "path";
import fs from "fs/promises";
import { compressImage, SUPPORTED_FORMATS } from "./compressImage.js";
import { compressFolder } from "./compressFolder.js";
import { getImageInfo } from "./getImageInfo.js";
import uploadToOSS from "./uploadToOSS.js";
import uploadFolderToOSS from "./uploadFolderToOSS.js";

// 从环境变量读取OSS配置
const ossConfig = {
  endpoint: process.env.OSS_ENDPOINT || '',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.OSS_BUCKET || '',
  region: process.env.OSS_REGION || '',
  ossPath: process.env.OSS_PATH || ''
};

// 创建MCP服务器实例
const server = new Server(
  {
    name: "mcp-img-compress-oss",
    version: "1.4.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "compress_image",
        description:
          "压缩单个图片文件，支持JPEG、PNG、WebP、AVIF等格式。⚠️ 重要：请使用绝对路径指定图片文件位置。",
        inputSchema: {
          type: "object",
          properties: {
            inputPath: {
              type: "string",
              description:
                "要压缩的图片文件路径（必须使用绝对路径，如：/Users/username/Desktop/photo.jpg）",
            },
            outputPath: {
              type: "string",
              description:
                "压缩后的输出文件路径（可选，默认为原文件名_compressed，建议使用绝对路径）",
            },
            quality: {
              type: "number",
              description: "压缩质量 (1-100)，默认85（高质量压缩）",
              minimum: 1,
              maximum: 100,
              default: 85,
            },
            format: {
              type: "string",
              description: "输出格式（可选）：jpeg, png, webp, avif",
              enum: ["jpeg", "png", "webp", "avif"],
            },
            keepMetadata: {
              type: "boolean",
              description: "是否保留图片元数据，默认 false",
              default: false,
            },
          },
          required: ["inputPath"],
        },
      },
      {
        name: "compress_folder",
        description:
          "批量压缩文件夹中的所有图片文件。⚠️ 重要：请使用绝对路径指定文件夹位置。",
        inputSchema: {
          type: "object",
          properties: {
            inputFolder: {
              type: "string",
              description:
                "要压缩的图片文件夹路径（必须使用绝对路径，如：/Users/username/Pictures/）",
            },
            outputFolder: {
              type: "string",
              description:
                "压缩后的输出文件夹路径（可选，默认为原文件夹_compressed，建议使用绝对路径）",
            },
            quality: {
              type: "number",
              description: "压缩质量 (1-100)，默认85（高质量压缩）",
              minimum: 1,
              maximum: 100,
              default: 85,
            },
            format: {
              type: "string",
              description: "统一输出格式（可选）：jpeg, png, webp, avif",
              enum: ["jpeg", "png", "webp", "avif"],
            },
            recursive: {
              type: "boolean",
              description: "是否递归处理子文件夹，默认true",
              default: true,
            },
          },
          required: ["inputFolder"],
        },
      },
      {
        name: "get_image_info",
        description:
          "获取图片文件的详细信息（尺寸、格式、大小等）。⚠️ 重要：请使用绝对路径指定图片文件位置。",
        inputSchema: {
          type: "object",
          properties: {
            imagePath: {
              type: "string",
              description:
                "图片文件路径（必须使用绝对路径，如：/Users/username/Desktop/photo.jpg）",
            },
          },
          required: ["imagePath"],
        },
      },
      {
        name: "upload_to_oss",
        description:
          "将图片上传到阿里云OSS并获取访问链接。⚠️ 重要：请使用绝对路径指定图片文件位置。",
        inputSchema: {
          type: "object",
          properties: {
            imagePath: {
              type: "string",
              description:
                "图片文件路径（必须使用绝对路径，如：/Users/username/Desktop/photo.jpg）",
            },
            endpoint: {
              type: "string",
              description: "OSS端点",
              default: ossConfig.endpoint,
            },
            accessKeyId: {
              type: "string",
              description: "访问密钥ID",
              default: ossConfig.accessKeyId,
            },
            accessKeySecret: {
              type: "string",
              description: "访问密钥密码",
              default: ossConfig.accessKeySecret,
            },
            bucket: {
              type: "string",
              description: "OSS存储桶名称",
              default: ossConfig.bucket,
            },
            region: {
              type: "string",
              description: "OSS区域",
              default: ossConfig.region,
            },
            ossPath: {
              type: "string",
              description: "OSS中的存储路径前缀",
              default: ossConfig.ossPath,
            },
          },
          required: ["imagePath"],
        },
      },
      {
        name: "upload_folder_to_oss",
        description:
          "批量上传文件夹中的图片到阿里云OSS。⚠️ 重要：请使用绝对路径指定文件夹位置。",
        inputSchema: {
          type: "object",
          properties: {
            inputFolder: {
              type: "string",
              description:
                "图片文件夹路径（必须使用绝对路径，如：/Users/username/Pictures/）",
            },
            recursive: {
              type: "boolean",
              description: "是否递归处理子文件夹，默认true",
              default: true,
            },
            endpoint: {
              type: "string",
              description: "OSS端点",
              default: ossConfig.endpoint,
            },
            accessKeyId: {
              type: "string",
              description: "访问密钥ID",
              default: ossConfig.accessKeyId,
            },
            accessKeySecret: {
              type: "string",
              description: "访问密钥密码",
              default: ossConfig.accessKeySecret,
            },
            bucket: {
              type: "string",
              description: "OSS存储桶名称",
              default: ossConfig.bucket,
            },
            region: {
              type: "string",
              description: "OSS区域",
              default: ossConfig.region,
            },
            ossPath: {
              type: "string",
              description: "OSS中的存储路径前缀",
              default: ossConfig.ossPath,
            },
          },
          required: ["inputFolder"],
        },
      },
    ],
  };
});

// 工具调用分发
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "compress_image": {
        const {
          inputPath,
          outputPath,
          quality = 85,
          format,
          keepMetadata = false,
        } = args;

        try {
          await fs.access(inputPath);
        } catch {
          throw new Error(`输入文件不存在: ${inputPath}`);
        }

        const ext = path.extname(inputPath).toLowerCase();
        if (!SUPPORTED_FORMATS.includes(ext)) {
          throw new Error(
            `不支持的文件格式: ${ext}. 支持的格式: ${SUPPORTED_FORMATS.join(
              ", "
            )}`
          );
        }

        let finalOutputPath = outputPath;
        if (!finalOutputPath) {
          const dir = path.dirname(inputPath);
          const name = path.basename(inputPath, ext);
          const outputExt = format ? `.${format}` : ext;
          finalOutputPath = path.join(dir, `${name}_compressed${outputExt}`);
        }

        const outputDir = path.dirname(finalOutputPath);
        await fs.mkdir(outputDir, { recursive: true });

        const result = await compressImage(inputPath, finalOutputPath, {
          quality,
          format,
          keepMetadata,
          progressive: true,
        });

        if (result.success) {
          return {
            content: [
              {
                type: "text",
                text: `✅ 图片压缩成功！\n\n📁 输入文件: ${result.inputPath}\n📁 输出文件: ${result.outputPath}\n📊 原始大小: ${result.originalSize}\n📊 压缩后大小: ${result.compressedSize}\n📈 压缩率: ${result.compressionRatio}\n🖼️  格式: ${result.format}\n📐 尺寸: ${result.dimensions}`,
              },
            ],
          };
        } else {
          throw new Error(result.error);
        }
      }

      case "compress_folder": {
        const {
          inputFolder,
          outputFolder,
          quality = 90,
          format,
          recursive = true,
        } = args;

        const result = await compressFolder(inputFolder, outputFolder, {
          quality,
          format,
          recursive,
        });

        if (result.success) {
          return {
            content: [
              {
                type: "text",
                text: result.message,
              },
            ],
          };
        } else {
          throw new Error(result.message);
        }
      }

      case "get_image_info": {
        const { imagePath } = args;
        try {
          const info = await getImageInfo(imagePath);
          return {
            content: [
              {
                type: "text",
                text: `📷 图片信息\n\n📁 文件路径: ${
                  info.filePath
                }\n📊 文件大小: ${info.fileSize}\n🖼️  格式: ${
                  info.format
                }\n📐 尺寸: ${info.dimensions}\n🎨 颜色通道: ${
                  info.channels
                }\n📏 像素密度: ${info.density} DPI\n🔄 是否有透明通道: ${
                  info.hasAlpha ? "是" : "否"
                }\n📱 颜色空间: ${info.colorSpace}`,
              },
            ],
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }

      case "upload_to_oss": {
        const {
          imagePath,
          endpoint = ossConfig.endpoint,
          accessKeyId = ossConfig.accessKeyId,
          accessKeySecret = ossConfig.accessKeySecret,
          bucket = ossConfig.bucket,
          region = ossConfig.region,
          ossPath = ossConfig.ossPath,
        } = args;

        try {
          const result = await uploadToOSS({
            imagePath,
            endpoint,
            accessKeyId,
            accessKeySecret,
            bucket,
            region,
            ossPath,
          });

          if (result.success) {
            return {
              content: [
                {
                  type: "text",
                  text: `✅ 图片上传成功！\n\n📁 本地文件: ${result.originalPath}\n🔗 访问链接: ${result.url}\n📊 文件大小: ${result.size} 字节\n🖼️  格式: ${result.format}\n OSS路径: ${result.ossPath}`,
                },
              ],
            };
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          throw new Error(`上传失败: ${error.message}`);
        }
      }

      case "upload_folder_to_oss": {
        const {
          inputFolder,
          recursive = true,
          endpoint = ossConfig.endpoint,
          accessKeyId = ossConfig.accessKeyId,
          accessKeySecret = ossConfig.accessKeySecret,
          bucket = ossConfig.bucket,
          region = ossConfig.region,
          ossPath = ossConfig.ossPath,
        } = args;

        try {
          const result = await uploadFolderToOSS({
            inputFolder,
            recursive,
            endpoint,
            accessKeyId,
            accessKeySecret,
            bucket,
            region,
            ossPath,
          });

          if (result.success) {
            // 生成上传结果摘要
            const successList = result.results.filter((r) => r.success);
            const failedList = result.results.filter((r) => !r.success);
            
            let summaryText = `✅ 文件夹上传完成\n\n📁 文件夹: ${inputFolder}\n📊 总文件数: ${result.totalFiles}\n✅ 上传成功: ${result.uploadedFiles}\n❌ 上传失败: ${result.failedFiles}\n\n`;
            
            if (successList.length > 0) {
              summaryText += `成功上传的文件:\n`;
              successList.slice(0, 10).forEach((item, index) => {
                summaryText += `${index + 1}. ${item.originalPath} -> ${item.url}\n`;
              });
              
              if (successList.length > 10) {
                summaryText += `...等共 ${successList.length} 个文件\n`;
              }
            }
            
            if (failedList.length > 0) {
              summaryText += `\n上传失败的文件:\n`;
              failedList.slice(0, 5).forEach((item, index) => {
                summaryText += `${index + 1}. ${item.originalPath}: ${item.error}\n`;
              });
              
              if (failedList.length > 5) {
                summaryText += `...等共 ${failedList.length} 个文件\n`;
              }
            }
            
            // 添加完整的 JSON 数据
            const jsonData = JSON.stringify({
              summary: {
                inputFolder,
                totalFiles: result.totalFiles,
                uploadedFiles: result.uploadedFiles,
                failedFiles: result.failedFiles
              },
              successList: successList.map(item => ({
                localPath: item.originalPath,
                ossUrl: item.url,
                ossPath: item.ossPath,
                size: item.size,
                format: item.format
              })),
              failedList: failedList.map(item => ({
                localPath: item.originalPath,
                error: item.error
              }))
            }, null, 2);
            
            summaryText += `\n\n📋 完整的上传结果数据（JSON格式）:\n\`\`\`json\n${jsonData}\n\`\`\``;
            
            return {
              content: [
                {
                  type: "text",
                  text: summaryText,
                },
              ],
            };
          } else {
            throw new Error(result.message || "上传失败");
          }
        } catch (error) {
          throw new Error(`批量上传失败: ${error.message}`);
        }
      }

      default:
        throw new Error(`未知的工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ 错误: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("图片处理与OSS上传MCP服务器已启动");
}

main().catch((error) => {
  console.error("服务器启动失败:", error);
  process.exit(1);
});
