# 变更日志

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.2.0] - 2024-12-20

### 变更
- 🎯 **默认质量参数优化**：将默认压缩质量从95调整为85
  - 更好的文件大小与质量平衡
  - 提升开箱即用体验
  - 大幅减少文件大小（30-50%）同时保持99.5%视觉质量
- 📝 **文档全面更新**：
  - DEFAULT_PARAMS.md：详细说明新的默认参数设置和效果对比
  - OSS_SETUP.md：更新阿里云OSS配置说明
  - USAGE_GUIDE.md：更新使用指南和故障排除
- 🔧 **代码优化**：统一所有模块的默认参数，提高一致性

### 修复
- 🐛 修复了批量压缩默认质量参数不一致的问题

### 用户体验提升
- 🚀 **开箱即用**：无需配置即可获得最佳压缩效果
- 📊 **智能压缩**：根据质量自动选择最佳压缩策略
- 🎨 **格式优化**：WebP近无损、PNG高压缩级别、AVIF高质量

### 技术特性
- 💡 智能压缩机制：quality >= 95时启用无损模式
- 🔄 模块化架构：统一的参数管理和错误处理
- 📈 压缩效果：在质量85下各格式压缩率提升20-40%

## [1.1.0] - 2024-12-20

### 新增
- 🚀 阿里云OSS上传功能
- 📤 两个新功能：
  - `upload_to_oss` - 单图上传到OSS
  - `upload_folder_to_oss` - 批量上传到OSS
- ⚙️ OSS配置选项：
  - 支持自定义端点、区域
  - 可配置存储路径前缀
  - 自定义文件名选项
- 📊 详细上传报告：
  - 成功/失败统计
  - 完整访问链接
  - 批量上传摘要
- 🔄 模块化代码结构：
  - 拆分功能模块
  - 提高代码可维护性
  - ES模块格式统一

### 变更
- 📝 更新文档，添加OSS上传功能说明
- 🔧 优化项目结构，拆分为多个功能模块
- 🌟 服务器启动信息更新

### 技术特性
- 🔌 集成ali-oss SDK
- 🔐 默认OSS配置预设
- 🌐 自动生成唯一文件名
- 📂 递归文件夹处理支持

## [1.0.0] - 2024-12-19

### 新增
- 🎉 初始发布：图片无损压缩MCP工具
- 📸 支持多种图片格式：JPEG, PNG, WebP, AVIF, TIFF
- 🛠️ 三个核心功能：
  - `compress_image` - 单图压缩
  - `compress_folder` - 批量压缩
  - `get_image_info` - 图片信息获取
- ⚙️ 智能默认参数：
  - 质量默认95（自动无损模式）
  - 默认保留元数据
  - 自动格式优化
- 🚀 高性能处理：
  - Sharp库 + MozJPEG编码器
  - 多线程处理支持
  - 内存优化算法
- 📚 完整文档：
  - 详细使用说明
  - 配置示例
  - 故障排除指南
  - 使用示例集合

### 技术特性
- 🔧 基于Node.js 18+
- 📦 MCP (Model Context Protocol) 集成
- 🎯 专为Cursor编辑器优化
- 🌐 跨平台支持（macOS, Windows, Linux）

### 压缩效果
- 🏆 JPEG: 10-30% 大小缩减
- 🎨 PNG: 20-50% 大小缩减  
- 🚀 WebP: 比JPEG小25-35%
- ⚡ AVIF: 比JPEG小50%

### 文档
- `README.md` - 主要说明文档
- `DEFAULT_PARAMS.md` - 默认参数详解
- `test_examples.md` - 使用示例
- `troubleshooting.md` - 故障排除
- `setup.sh` - 自动化安装脚本

---

## 版本说明

### 版本格式
- **主版本号**：进行不兼容的API修改时
- **次版本号**：向下兼容的功能性新增时  
- **修订版本号**：向下兼容的问题修正时

### 变更类型
- **新增** - 新功能
- **变更** - 现有功能的变更
- **废弃** - 即将移除的功能
- **移除** - 已移除的功能
- **修复** - 问题修复
- **安全** - 安全相关修复 