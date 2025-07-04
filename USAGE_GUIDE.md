# 图片压缩与OSS上传工具使用指南

专为Cursor、Windsurf等AI开发软件设计的图片处理工具。

## 🚀 快速开始

在Cursor或Windsurf中，重启软件后直接与Claude对话使用图片压缩和OSS上传功能。

## 💬 常用对话示例

### 基础功能
```
请帮我压缩这个图片：/Users/ls/Downloads/photo.jpg
```

```
请以90%的质量压缩并转换为WebP格式：/Users/ls/Pictures/photo.jpg
```

```
请批量压缩 /Users/ls/project/assets/images/ 文件夹中的所有图片，质量85
```

### 高级功能
```
请分析这个图片的详细信息：/Users/ls/Desktop/photo.jpg
```

```
请将图片压缩后上传到OSS：/Users/ls/Desktop/banner.jpg，质量85，存储在images/路径下
```

```
请批量处理 /Users/ls/project/images/ 中的所有图片：转换为WebP格式，质量80，然后上传到OSS
```

## 🎯 开发场景应用

### 前端项目优化
```
请批量压缩 /Users/ls/project/src/assets/images/ 中的所有图片，转换为WebP格式，质量85
```

### 移动端适配
```
请压缩这些移动端图片：/Users/ls/mobile-app/assets/，质量90，确保适合移动端加载
```

### 部署准备
```
请将网站图片资源压缩并上传到OSS：/Users/ls/website/public/images/，转换为WebP格式，质量85
```

## 💡 使用技巧

### 结合文件浏览器
- 在Cursor/Windsurf中直接复制文件路径
- 使用右键菜单获取完整路径

### 批量处理工作流
```
请为整个项目优化图片资源：
1. 压缩 /Users/ls/project/public/images/ 中的所有图片
2. 转换为WebP格式，质量85
3. 上传到OSS并生成访问链接
```

## 🎨 技术参数

### 格式选择
- **JPEG**: 适合照片
- **PNG**: 适合图标和透明图片
- **WebP**: 现代格式，推荐用于Web项目
- **AVIF**: 最新格式，压缩率最高

### 质量设置
- **95-100**: 专业/印刷用途
- **85-95**: 网站高质量显示
- **70-85**: 网页标准质量
- **50-70**: 缩略图或预览

## 🔍 故障排除

### MCP工具安装失败

如果在安装MCP工具时遇到问题，可以尝试清除npx缓存：

```bash
rm -rf ~/.npm/_npx
```

然后重新安装MCP工具。

### Cursor中显示 "0 tools enabled"

1. **检查配置文件**
```bash
ls -la ~/.cursor/mcp_servers.json
```

2. **创建配置文件**（如果不存在）
```bash
mkdir -p ~/.cursor
cp mcp_servers.json.example ~/.cursor/mcp_servers.json
```

3. **验证配置**
```bash
cat ~/.cursor/mcp_servers.json | python3 -m json.tool
```

4. **重启软件**
完全退出Cursor/Windsurf后重新启动

### 配置示例
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

## 🚨 注意事项

1. **备份原文件**：批量处理前先备份
2. **支持格式**：JPG, PNG, WebP, AVIF, TIFF
3. **权限检查**：确保对目标文件夹有写入权限
4. **OSS凭证**：生产环境中使用自己的OSS凭证

配置完成后，您就可以在AI开发环境中轻松使用图片压缩和OSS上传功能了！🎉 