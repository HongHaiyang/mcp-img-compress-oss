# 🔧 阿里云OSS配置完整指南

本指南将帮助您快速配置MCP图片压缩与OSS上传工具。

## 🚀 配置方法

本工具推荐使用`npx`方式运行，它会自动下载并执行最新版本，无需本地安装。

### 在Cursor中配置环境变量

1.  **编辑MCP配置文件**
    打开或创建 `~/.cursor/mcp_servers.json` 文件。

2.  **添加配置**
    将以下内容复制到文件中，并替换为您的OSS凭证信息：

    ```json
    {
      "mcpServers": {
        "mcp-img-compress-oss": {
          "command": "npx",
          "args": ["-y", "mcp-img-compress-oss@latest"],
          "env": {
            "OSS_ENDPOINT": "oss-cn-hangzhou.aliyuncs.com",
            "OSS_ACCESS_KEY_ID": "您的访问密钥ID",
            "OSS_ACCESS_KEY_SECRET": "您的访问密钥密码",
            "OSS_BUCKET": "您的存储桶名称",
            "OSS_REGION": "oss-cn-hangzhou",
            "OSS_PATH": "images"
          }
        }
      }
    }
    ```

3.  **重启Cursor**
    完全退出Cursor (⌘+Q)，然后重新启动以使配置生效。

### OSS参数说明
| 参数 | 说明 | 示例值 |
|------|------|--------|
| `OSS_ENDPOINT` | OSS服务的接入点 | `oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` | 访问密钥ID | `LTAI5txxxxxxxxxxxxxx` |
| `OSS_ACCESS_KEY_SECRET`| 访问密钥密码 | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `OSS_BUCKET` | OSS存储桶名称 | `your-bucket-name` |
| `OSS_REGION` | OSS的地域 | `oss-cn-hangzhou` |
| `OSS_PATH` | 存储路径前缀（可选） | `images/project-name` |

## 📁 文件命名和存储

### 文件命名规则
工具会自动重命名上传的文件，以避免重名覆盖：
- **命名格式**: `8位随机字符串.原扩展名`
- **示例**: `a1b2c3d4.jpg`

### 存储结构
- 文件将上传到您在`OSS_PATH`环境变量中指定的路径前缀下。
- 如果`OSS_PATH`未设置，文件将直接上传到存储桶（Bucket）的根目录。

**示例结构** (`OSS_PATH`设置为`"images/avatars"`):
```
your-bucket/
└── images/
    └── avatars/
        ├── a1b2c3d4.jpg
        └── e5f6g7h8.png
```

## 🔍 故障排除

### 1. 工具未加载或OSS参数无效
**症状**: AI提示找不到工具，或每次都要求手动输入OSS参数。

**解决方案**:
1.  **检查配置文件路径**: 确保 `~/.cursor/mcp_servers.json` 文件存在且路径正确。
2.  **检查JSON格式**: 确保 `mcp_servers.json` 文件内容是有效的JSON格式。可以复制到在线JSON校验工具中检查。
3.  **检查环境变量**: 确认 `env` 中的OSS参数都已正确填写，没有遗漏。
4.  **完全重启Cursor**: 确保配置被重新加载。

### 2. 上传失败
**症状**: 返回 `AccessDenied` (权限拒绝) 或 `ConnectionTimeout` (连接超时) 等错误。

**解决方案**:
- **权限问题**: 检查您的`AccessKey`是否正确，以及它是否具有对目标Bucket的写入权限。
- **网络问题**: 检查`OSS_ENDPOINT`和`OSS_REGION`是否匹配，并确保您的网络可以访问阿里云服务。
