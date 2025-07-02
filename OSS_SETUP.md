# 🔧 阿里云OSS配置完整指南

这是图片压缩与OSS上传MCP工具的完整OSS配置文档，包含所有配置方法、故障排除和使用说明。

## 📋 配置要求

使用OSS上传功能时，您需要提供以下必要参数：

| 参数 | 说明 | 示例值 |
|------|------|--------|
| endpoint | OSS服务的接入点 | `oss-cn-hangzhou.aliyuncs.com` |
| region | OSS的地域 | `oss-cn-hangzhou` |
| accessKeyId | 访问密钥ID | `LTAI5txxxxxxxxxxxxxx` |
| accessKeySecret | 访问密钥密码 | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| bucket | OSS存储桶名称 | `your-bucket-name` |
| ossPath | 存储路径前缀（可选） | `images/project-name` |

## 🚀 自动配置方法（推荐）

### 1. 在MCP配置中添加环境变量

编辑 `~/.cursor/mcp_servers.json` 文件：

```json
{
  "mcpServers": {
    "mcp-img-compress-oss": {
      "command": "node",
      "args": ["/Users/ls/Documents/mcp-img-compress-oss/src/index.js"],
      "cwd": "/Users/ls/Documents/mcp-img-compress-oss",
      "env": {
        "OSS_ENDPOINT": "oss-cn-hangzhou.aliyuncs.com",
        "OSS_ACCESS_KEY_ID": "您的访问密钥ID",
        "OSS_ACCESS_KEY_SECRET": "您的访问密钥密码",
        "OSS_BUCKET": "您的存储桶名称",
        "OSS_REGION": "oss-cn-hangzhou",
        "OSS_PATH": "images/your-project"
      }
    }
  }
}
```

### 2. 配置步骤

1. **获取OSS凭证**：
   - 登录[阿里云控制台](https://home.console.aliyun.com/)
   - 进入对象存储OSS服务
   - 创建存储空间（Bucket）或使用现有存储空间
   - 在右上角头像下拉菜单中选择"AccessKey管理"
   - 创建AccessKey并记录ID和Secret

2. **修改配置文件**：
   - 打开或创建 `~/.cursor/mcp_servers.json` 文件
   - 按照上述示例添加OSS环境变量
   - 保存文件

3. **重启Cursor**：
   - 完全退出Cursor (Cmd+Q 或 Alt+F4)
   - 重新启动Cursor

### 3. 验证配置

配置完成后，您可以使用调试脚本验证：

```bash
node debug_env.js
```

如果配置正确，您将看到"✅ OSS环境变量配置正确！"的消息。

## 🔧 手动参数配置

如果不使用环境变量，可以在每次调用时手动提供参数：

```json
{
  "imagePath": "/path/to/image.jpg",
  "endpoint": "oss-cn-beijing.aliyuncs.com",
  "accessKeyId": "YOUR_ACCESS_KEY_ID",
  "accessKeySecret": "YOUR_ACCESS_KEY_SECRET",
  "bucket": "your-bucket-name",
  "region": "oss-cn-beijing",
  "ossPath": "images/product"
}
```

## 📁 文件命名规则

上传到OSS的文件命名规则：

1. **默认命名**：`原文件名_时间戳.扩展名`
   - 例如：`image_1640001234567.jpg`

2. **自定义文件名**：`自定义名称_时间戳.扩展名`
   - 使用方法：添加 `customFilename` 参数
   - 例如：`custom-name_1640001234567.jpg`

3. **存储路径前缀**：`前缀/文件名_时间戳.扩展名`
   - 使用方法：添加 `ossPath` 参数
   - 例如：`images/product/image_1640001234567.jpg`

## 🔍 故障排除

### 常见问题

#### 1. 环境变量未生效
**症状**：AI仍然要求手动提供OSS参数

**解决方案**：
- 确认环境变量名称正确（`OSS_ENDPOINT`、`OSS_ACCESS_KEY_ID`等）
- 检查`mcp_servers.json`格式是否正确
- 完全重启Cursor
- 运行`node debug_env.js`验证环境变量

#### 2. 上传失败：无法连接到OSS
**可能原因**：
- 网络连接问题
- 端点(endpoint)配置错误

**解决方案**：
- 检查网络连接
- 验证endpoint格式：`oss-[region-id].aliyuncs.com`

#### 3. 上传失败：AccessDenied
**可能原因**：
- AccessKey无效或已过期
- 没有存储桶的写入权限

**解决方案**：
- 验证AccessKeyId和AccessKeySecret是否正确
- 检查存储桶的访问权限设置

#### 4. 上传成功但无法访问图片
**可能原因**：
- 存储桶未设置公共读取权限
- 图片上传到了错误的路径

**解决方案**：
- 在阿里云控制台中设置存储桶的读取权限为公共读取
- 检查ossPath参数是否正确

### 调试方法

1. **检查服务器日志**：
   ```bash
   cd /Users/ls/Documents/mcp-img-compress-oss
   node src/index.js
   ```

2. **查看Cursor开发者工具**：
   - 在Cursor中按`Cmd+Option+I`打开开发者工具
   - 查看控制台中的错误信息

3. **验证环境变量传递**：
   在`src/index.js`文件开头添加调试代码：
   ```javascript
   console.error('OSS配置:', {
     endpoint: process.env.OSS_ENDPOINT,
     accessKeyId: process.env.OSS_ACCESS_KEY_ID ? '已设置' : '未设置',
     accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET ? '已设置' : '未设置',
     bucket: process.env.OSS_BUCKET,
     region: process.env.OSS_REGION,
     ossPath: process.env.OSS_PATH
   });
   ```

## 🔒 安全最佳实践

1. **使用最小权限原则**：
   - 为上传操作创建专用的RAM用户
   - 仅授予必要的权限

2. **定期轮换AccessKey**：
   - 建议定期更新AccessKey
   - 发现泄露时立即更换

3. **设置合理的存储桶权限**：
   - 根据实际需求设置读写权限
   - 避免不必要的公开访问

4. **保护配置文件**：
   - 确保`mcp_servers.json`文件权限设置正确
   - 在共享设备上使用时要注意凭证安全

## 💡 高级用法示例

### 压缩后上传
```
请将图片压缩后再上传到OSS：/path/to/image.jpg，质量设为85，格式转为webp
```

### 批量处理并上传
```
请将/path/to/images/文件夹中的所有图片压缩后上传到OSS，质量设为90，存储在product/banner路径下
```

### 自定义OSS路径和文件名
```
请将图片上传到OSS：/path/to/image.jpg，存储路径为marketing/campaign，文件名为promotion
```

配置完成后，您就可以在Cursor中直接使用OSS上传功能，无需每次手动提供参数！ 