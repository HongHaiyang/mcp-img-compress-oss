import fs from 'fs';
import path from 'path';
import uploadToOSS from './uploadToOSS.js';

/**
 * 获取文件夹中的所有图片文件
 * @param {string} folderPath - 文件夹路径
 * @param {boolean} recursive - 是否递归处理子文件夹
 * @param {Array<string>} supportedFormats - 支持的图片格式扩展名
 * @returns {Array<string>} 图片文件路径数组
 */
function getImageFiles(folderPath, recursive = true, supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']) {
  const files = [];
  
  if (!fs.existsSync(folderPath)) {
    throw new Error(`文件夹不存在: ${folderPath}`);
  }
  
  const items = fs.readdirSync(folderPath);
  
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory() && recursive) {
      // 递归处理子文件夹
      const subFiles = getImageFiles(itemPath, recursive, supportedFormats);
      files.push(...subFiles);
    } else if (stat.isFile()) {
      // 检查文件扩展名
      const ext = path.extname(itemPath).toLowerCase();
      if (supportedFormats.includes(ext)) {
        files.push(itemPath);
      }
    }
  }
  
  return files;
}

/**
 * 批量上传文件夹中的图片到阿里云OSS
 * @param {Object} options - 上传选项
 * @param {string} options.inputFolder - 图片文件夹路径（必须使用绝对路径）
 * @param {boolean} [options.recursive=true] - 是否递归处理子文件夹
 * @param {string} [options.endpoint] - OSS端点
 * @param {string} [options.accessKeyId] - 访问密钥ID
 * @param {string} [options.accessKeySecret] - 访问密钥密码
 * @param {string} [options.bucket] - OSS存储桶名称
 * @param {string} [options.region] - OSS区域
 * @param {string} [options.ossPath=''] - OSS中的存储路径前缀
 * @returns {Promise<Object>} 上传结果
 */
async function uploadFolderToOSS(options) {
  const {
    inputFolder,
    recursive = true,
    endpoint,
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
    ossPath = ''
  } = options;

  if (!inputFolder) {
    throw new Error('文件夹路径不能为空');
  }

  if (!fs.existsSync(inputFolder)) {
    throw new Error(`文件夹不存在: ${inputFolder}`);
  }

  if (!accessKeyId || !accessKeySecret || !bucket || !region || !endpoint) {
    throw new Error('OSS配置参数不完整，请提供accessKeyId、accessKeySecret、bucket、region和endpoint');
  }

  // 获取所有图片文件
  const imageFiles = getImageFiles(inputFolder, recursive);
  
  if (imageFiles.length === 0) {
    return {
      success: true,
      message: '没有找到可上传的图片文件',
      totalFiles: 0,
      uploadedFiles: 0,
      failedFiles: 0,
      results: []
    };
  }

  // 检查文件数量是否超过限制
  if (imageFiles.length > 100) {
    throw new Error(`文件数量超出限制！检测到 ${imageFiles.length} 个图片文件，超过了 100 个文件的限制。请减少文件数量后重试。`);
  }

  // 上传结果
  const results = [];
  let uploadedCount = 0;
  let failedCount = 0;

  // 批量上传图片
  for (const imagePath of imageFiles) {
    try {
      const result = await uploadToOSS({
        imagePath,
        endpoint,
        accessKeyId,
        accessKeySecret,
        bucket,
        region,
        ossPath
      });
      
      results.push(result);
      
      if (result.success) {
        uploadedCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error(`上传失败: ${imagePath}`, error);
      results.push({
        success: false,
        error: error.message,
        originalPath: imagePath
      });
      failedCount++;
    }
  }

  return {
    success: true,
    totalFiles: imageFiles.length,
    uploadedFiles: uploadedCount,
    failedFiles: failedCount,
    results
  };
}

export default uploadFolderToOSS; 