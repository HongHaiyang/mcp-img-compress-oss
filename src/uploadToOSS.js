import OSS from 'ali-oss';
import fs from 'fs';
import path from 'path';

/**
 * 生成简单的UUID（8位随机字符串）
 * @returns {string} 8位随机字符串
 */
function generateSimpleUUID() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 上传图片到阿里云OSS
 * @param {Object} options - 上传选项
 * @param {string} options.imagePath - 图片文件路径（必须使用绝对路径）
 * @param {string} [options.endpoint] - OSS端点
 * @param {string} [options.accessKeyId] - 访问密钥ID
 * @param {string} [options.accessKeySecret] - 访问密钥密码
 * @param {string} [options.bucket] - OSS存储桶名称
 * @param {string} [options.region] - OSS区域
 * @param {string} [options.ossPath=''] - OSS中的存储路径前缀
 * @returns {Promise<Object>} 上传结果
 */
async function uploadToOSS(options) {
  const {
    imagePath,
    endpoint,
    accessKeyId,
    accessKeySecret,
    bucket,
    region,
    ossPath = ''
  } = options;

  if (!imagePath) {
    throw new Error('图片路径不能为空');
  }

  if (!fs.existsSync(imagePath)) {
    throw new Error(`文件不存在: ${imagePath}`);
  }

  if (!accessKeyId || !accessKeySecret || !bucket || !region || !endpoint) {
    throw new Error('OSS配置参数不完整，请提供accessKeyId、accessKeySecret、bucket、region和endpoint');
  }

  // 创建OSS客户端
  const client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    endpoint,
  });

  // 获取文件扩展名
  const extname = path.extname(imagePath);
  
  // 生成UUID作为文件名
  const filename = generateSimpleUUID();
  
  // 生成OSS对象名称
  const objectName = `${ossPath}${ossPath ? '/' : ''}${filename}${extname}`;

  try {
    // 上传文件到OSS
    const result = await client.put(objectName, imagePath);
    
    // 确保URL使用HTTPS
    let url = result.url;
    if (url && url.startsWith('http:')) {
      url = 'https:' + url.substring(5);
    }
    
    return {
      success: true,
      url: url,
      ossPath: result.name,
      size: fs.statSync(imagePath).size,
      format: extname.slice(1),
      originalPath: imagePath
    };
  } catch (error) {
    console.error('上传到OSS失败:', error);
    return {
      success: false,
      error: error.message,
      originalPath: imagePath
    };
  }
}

export default uploadToOSS; 