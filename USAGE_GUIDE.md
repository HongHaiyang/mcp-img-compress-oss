# 📖 图片压缩与OSS上传工具使用指南

这是图片压缩与OSS上传MCP工具的完整使用指南，包含AI对话示例、使用技巧和故障排除。

## 🚀 快速开始

重启Cursor后，你可以直接与Claude对话来使用图片压缩和OSS上传功能。

## ⚠️ 重要：必须使用绝对路径

当AI调用此MCP工具时，**所有文件和文件夹路径都必须使用绝对路径**。

### 📝 正确的路径格式

#### ✅ 正确示例

**macOS/Linux:**
```
/Users/username/Desktop/photo.jpg
/Users/username/Pictures/vacation/
/home/user/documents/images/screenshot.png
```

**Windows:**
```
C:\Users\username\Desktop\photo.jpg
C:\Users\username\Pictures\vacation\
D:\Photos\family\wedding.png
```

#### ❌ 错误示例

**相对路径（不要使用）:**
```
./photo.jpg
../images/photo.png
~/Desktop/photo.jpg          # 波浪号在工具中不会被展开
photo.jpg                    # 当前目录相对路径
```

## 💬 常用对话示例

### 1. 基础图片压缩

#### 单个图片压缩
```
请帮我压缩这个图片：/Users/ls/Downloads/photo.jpg
```

#### 指定压缩质量
```
请以90%的质量压缩：/Users/ls/Desktop/image.png，输出为/Users/ls/Desktop/compressed.png
```

#### 格式转换 + 压缩
```
请将 /Users/ls/Pictures/photo.jpg 转换为WebP格式并压缩，质量设为85
```

### 2. 批量处理

#### 批量压缩文件夹
```
请批量压缩 /Users/ls/Downloads/images/ 文件夹中的所有图片
```

#### 批量格式转换
```
请将 /Users/ls/Desktop/photos/ 文件夹中的所有图片转换为AVIF格式，质量80
```

#### 高级批量处理
```
请递归处理 /Users/ls/Pictures/vacation/ 文件夹（包括子文件夹），将所有图片压缩为质量85的WebP格式，输出到 /Users/ls/Pictures/vacation_optimized/
```

### 3. 图片信息分析

#### 获取图片详细信息
```
请分析这个图片文件的详细信息：/Users/ls/Desktop/photo.jpg
```

#### 压缩前后对比
```
请先分析 /Users/ls/original.jpg 的详细信息，然后压缩它，最后对比压缩效果
```

### 4. OSS上传功能

#### 上传单张图片到OSS
```
请将这张图片上传到阿里云OSS：/Users/ls/Desktop/product.jpg
```

#### 批量上传到OSS
```
请将 /Users/ls/Pictures/gallery/ 文件夹中的所有图片上传到OSS
```

#### 自定义OSS配置上传
```
请将图片上传到OSS：/Users/ls/Desktop/logo.png，存储路径为marketing/logos，自定义文件名为company-logo
```

#### 压缩后上传到OSS
```
请将这张图片压缩后上传到OSS：/Users/ls/Desktop/banner.jpg，质量85，转换为WebP格式，存储在banners/2024/路径下
```

## 🎯 实际使用场景

### 网站优化
```
我有一个网站项目，请批量压缩 /Users/ls/project/assets/images/ 中的所有图片，转换为WebP格式，质量85，用于网页优化
```

### 社交媒体准备
```
请压缩这张照片：/Users/ls/Desktop/selfie.jpg，质量90，准备上传到社交媒体
```

### 存储空间清理
```
我的照片文件夹占用太多空间，请批量压缩 /Users/ls/Pictures/2024/ 中的所有照片，保持较高质量(90)但减少文件大小
```

### 邮件附件准备
```
这个图片文件太大了：/Users/ls/Desktop/document.png，请压缩到适合邮件发送的大小
```

### 电商产品图片处理
```
请将这些产品图片压缩后上传到OSS：/Users/ls/Products/，质量90，存储在product-images路径下
```

### 网站资源部署
```
请将网站的图片资源压缩并上传到OSS：/Users/ls/website/images/，转换为WebP格式，质量85
```

## 💡 专业用法

### 保留元数据的高质量压缩
```
请压缩这张专业照片：/Users/ls/work/product_photo.jpg，质量95，保留所有元数据信息
```

### 批量格式标准化
```
请将 /Users/ls/project/assets/ 中的所有图片统一转换为JPEG格式，质量90，用于项目标准化
```

### 多格式对比测试
```
请将 /Users/ls/test.png 分别转换为JPEG、WebP和AVIF格式，质量都设为85，然后告诉我哪种格式最小
```

### 一键博客图片准备
```
我要写博客，请批量处理 /Users/ls/blog_images/ 中的所有图片：转换为WebP格式，质量80，适合网页显示，然后上传到OSS的blog/posts/路径下
```

## 🛠️ AI调用最佳实践

### 路径获取建议
1. **询问用户完整路径**：
   - "请提供图片的完整路径"
   - "请告诉我文件夹的绝对路径位置"

2. **路径验证提醒**：
   - 确认路径格式正确
   - 包含完整的目录结构

3. **常见路径模式识别**：
   - 桌面：`/Users/[用户名]/Desktop/`
   - 文档：`/Users/[用户名]/Documents/`
   - 图片：`/Users/[用户名]/Pictures/`
   - 下载：`/Users/[用户名]/Downloads/`

### 对话示例

**用户**: "我想压缩桌面上的照片"

**AI**: "好的！请提供照片的完整绝对路径，例如：`/Users/您的用户名/Desktop/照片名.jpg`"

**用户**: "/Users/ls/Desktop/vacation.jpg"

**AI**: "收到！我来为您压缩这张图片..."

## 🎨 技术参数说明

### 格式选择建议
- **JPEG**: 适合照片，支持渐进式加载
- **PNG**: 适合图标和透明图片，支持调色板优化
- **WebP**: 现代格式，支持无损和有损压缩
- **AVIF**: 最新格式，压缩率最高但兼容性有限

### 质量设置建议
- **95-100**: 专业/印刷用途（无损压缩）
- **85-95**: 网站高质量显示
- **70-85**: 网页标准质量
- **50-70**: 缩略图或预览

### OSS路径建议
- 使用有意义的路径前缀，如 `images/product/`
- 为不同类型内容使用不同路径，如 `marketing/`、`blog/`
- 考虑添加日期路径，如 `events/2024/05/`

## 🔍 故障排除

### Cursor MCP问题：显示 "0 tools enabled"

如果在Cursor中看到"0 tools enabled"，按照以下步骤排查：

#### 1. 检查Cursor版本和MCP支持
- 确保Cursor版本 >= 0.42.0
- 确保在设置中启用了"Claude Desktop Integration"或"MCP Servers"

#### 2. 检查配置文件
**macOS配置文件位置：**
```bash
~/.cursor/mcp_servers.json
```

**检查配置文件是否存在：**
```bash
ls -la ~/.cursor/mcp_servers.json
```

**如果文件不存在，创建它：**
```bash
mkdir -p ~/.cursor
cp mcp_servers.json.example ~/.cursor/mcp_servers.json
```

#### 3. 验证配置文件格式
```bash
cat ~/.cursor/mcp_servers.json | python3 -m json.tool
```

#### 4. 测试MCP服务器
```bash
cd /Users/ls/Documents/mcp-img-compress-oss
node src/index.js
```

如果看到"MCP服务器已启动"消息，说明服务器正常。

#### 5. 检查路径和权限
```bash
# 检查文件是否存在
ls -la /Users/ls/Documents/mcp-img-compress-oss/src/index.js

# 检查是否可执行
node /Users/ls/Documents/mcp-img-compress-oss/src/index.js --help
```

#### 6. 重启Cursor
配置修改后，必须完全重启Cursor：
1. 完全退出Cursor (Cmd+Q)
2. 重新启动Cursor
3. 等待几秒让MCP服务器连接

#### 7. 查看调试信息
在Cursor中按 `Cmd+Option+I` 打开开发者工具，查看Console标签页中的MCP相关错误信息。

### 备用配置方案

#### 选项A：使用相对路径
```json
{
  "mcpServers": {
    "mcp-img-compress-oss": {
      "command": "node",
      "args": ["src/index.js"],
      "cwd": "/Users/ls/Documents/mcp-img-compress-oss"
    }
  }
}
```

#### 选项B：使用绝对路径
```json
{
  "mcpServers": {
    "mcp-img-compress-oss": {
      "command": "/usr/local/bin/node",
      "args": ["/Users/ls/Documents/mcp-img-compress-oss/src/index.js"],
      "cwd": "/Users/ls/Documents/mcp-img-compress-oss"
    }
  }
}
```

### 常见错误和解决方案

#### 错误：Module not found
- 确保运行了 `npm install`
- 检查package.json中的type: "module"设置

#### 错误：Permission denied  
- 确保文件有执行权限：`chmod +x src/index.js`

#### 错误：Command not found
- 检查Node.js是否正确安装：`which node`
- 使用Node.js的完整路径

## 🚨 注意事项

1. **备份原文件**：批量处理前先备份重要文件
2. **路径格式**：必须使用绝对路径
3. **支持格式**：JPG, PNG, WebP, AVIF, TIFF
4. **内存使用**：大文件处理需要足够内存
5. **权限检查**：确保对目标文件夹有写入权限
6. **OSS凭证安全**：生产环境中使用自己的OSS凭证
7. **网络连接**：OSS上传需要稳定的网络连接
8. **存储成本**：注意OSS存储和流量的成本控制

## 📞 获取支持

如果以上步骤都不能解决问题，请提供：
1. Cursor版本号
2. 操作系统版本
3. 配置文件内容
4. 开发者工具中的错误信息

配置完成后，您就可以轻松使用图片压缩和OSS上传功能了！🎉 