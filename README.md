# 🖼️ MCP图片压缩与OSS上传工具

这是一个专业的图片处理MCP (Model Context Protocol) 工具，专为Cursor编辑器设计，支持多种格式的高质量无损压缩和阿里云OSS上传功能。

## 🎯 功能特性

### 🖼️ 支持格式
- **JPEG/JPG** - 使用MozJPEG算法优化
- **PNG** - 调色板优化和最高压缩级别
- **WebP** - 近无损和无损压缩
- **AVIF** - 新一代图像格式
- **TIFF** - 专业图像格式支持

### ⚡ 核心功能

1. **单图压缩** (`compress_image`)
   - 智能格式检测和优化
   - 可自定义压缩质量 (1-100)
   - 支持格式转换
   - 保持或移除元数据选项

2. **批量压缩** (`compress_folder`)
   - 递归处理文件夹及子文件夹
   - 批量格式转换
   - 压缩进度统计
   - 最多支持100个文件批量处理

3. **图片信息** (`get_image_info`)
   - 详细的图片元数据
   - 文件大小和尺寸
   - 颜色空间和通道信息

4. **OSS上传** (`upload_to_oss`)
   - 单图上传到阿里云OSS
   - 自动生成唯一文件名
   - 返回完整访问链接

5. **批量OSS上传** (`upload_folder_to_oss`)
   - 批量上传文件夹中的图片
   - 递归处理子文件夹
   - 详细的上传统计
   - 最多支持100个文件批量上传
   - 显示完整文件路径映射关系，返回结构化的JSON格式结果

## 🚀 安装方式

### 方式一：使用npm包（推荐）

#### 直接使用npx
在Cursor的MCP配置中：
```json
{
  "mcpServers": {
    "mcp-img-compress-oss": {
      "command": "npx",
      "args": ["-y", "mcp-img-compress-oss@latest"],
      "env": {
        "OSS_ENDPOINT": "your_oss_endpoint",
        "OSS_ACCESS_KEY_ID": "your_access_key_id",
        "OSS_ACCESS_KEY_SECRET": "your_access_key_secret",
        "OSS_BUCKET": "your_bucket_name",
        "OSS_REGION": "your_oss_region",
        "OSS_PATH": "your_storage_path"
      }
    }
  }
}
```
##### OSS参数说明
| 参数 | 说明 | 示例值 |
|------|------|--------|
| `OSS_ENDPOINT` | OSS服务的接入点 | `oss-cn-beijing.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` | 访问密钥ID | `LTAI5txxxxxxxxxxxxxx` |
| `OSS_ACCESS_KEY_SECRET`| 访问密钥密码 | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `OSS_BUCKET` | OSS存储桶名称 | `your-bucket-name` |
| `OSS_REGION` | OSS的地域 | `oss-cn-beijing` |
| `OSS_PATH` | 存储路径前缀（可选） | `images/project-name` 或留空 `""` |

### 方式二：本地开发安装

#### 1. 克隆项目
```bash
git clone https://github.com/HongHaiyang/mcp-img-compress-oss.git
cd mcp-img-compress-oss
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 自动化配置
```bash
./setup.sh
```

或手动启动：
```bash
npm start
```

#### 4. 在Cursor中配置

配置文件已自动创建在：`~/.cursor/mcp_servers.json`

如需手动配置：
```json
{
  "mcpServers": {
    "mcp-img-compress-oss": {
      "command": "node",
      "args": ["/path/to/mcp-img-compress-oss/src/index.js"],
      "cwd": "/path/to/mcp-img-compress-oss",
      "env": {}
    }
  }
}
```

## 💡 快速使用

配置完成后，在Cursor中与Claude对话：

### 基础压缩
```
请压缩这个图片：/path/to/image.jpg，质量设为90
```

### 批量处理
```
请批量压缩 /path/to/images/ 文件夹中的所有图片，转换为WebP格式
```

### 上传到OSS
```
请将这个图片上传到OSS：/path/to/image.jpg
```

### 高级用法
```
请压缩 /path/to/input.jpg，输出为 /path/to/output.webp，质量95，保留元数据，然后上传到OSS
```

## 📊 压缩效果

### 典型压缩率
- **JPEG**: 10-30% 大小缩减
- **PNG**: 20-50% 大小缩减  
- **WebP**: 25-35% 比JPEG更小
- **AVIF**: 50% 比JPEG更小

### 质量设置建议
- **95-100**: 无损或近无损，适合专业用途
- **85-95**: 高质量，适合网站和印刷
- **70-85**: 中等质量，适合网页展示
- **50-70**: 压缩优先，适合缩略图

## 🛠️ 项目结构

```
mcp-img-compress-oss/
├── package.json          # 项目配置和依赖
├── src/
│   ├── index.js          # MCP服务器主文件
│   ├── compressImage.js  # 图片压缩模块
│   ├── compressFolder.js # 批量压缩模块
│   ├── getImageInfo.js   # 图片信息模块
│   ├── uploadToOSS.js    # OSS上传模块
│   └── uploadFolderToOSS.js # 批量OSS上传模块
├── README.md             # 主说明文档
├── OSS_SETUP.md          # OSS配置完整指南
├── USAGE_GUIDE.md        # 使用指南和故障排除
├── DEFAULT_PARAMS.md     # 技术参数说明
├── CHANGELOG.md          # 变更日志
└── setup.sh              # 自动化安装脚本
```

## 📚 详细文档

- **[OSS配置指南](OSS_SETUP.md)** - 阿里云OSS完整配置说明
- **[使用指南](USAGE_GUIDE.md)** - 详细使用示例和故障排除
- **[技术参数](DEFAULT_PARAMS.md)** - 默认参数和无损压缩说明
- **[变更日志](CHANGELOG.md)** - 版本更新记录

## 🔍 开发和调试

### 开发模式
```bash
npm run dev  # 文件变化时自动重启
```

### 测试服务器
```bash
node src/index.js
```

### 环境变量验证
```bash
node debug_env.js
```

## 💪 技术栈

- **Node.js 18+** - 运行环境
- **Sharp** - 高性能图像处理
- **MozJPEG** - JPEG优化编码器
- **Ali-OSS** - 阿里云对象存储
- **MCP Protocol** - Model Context Protocol

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 📄 许可证

MIT License

---

**开始使用**: 按照上述安装步骤配置后，就可以在Cursor中享受高效的图片压缩和OSS上传功能了！

有问题请查看 **[使用指南](USAGE_GUIDE.md)** 和 **[OSS配置指南](OSS_SETUP.md)**。 