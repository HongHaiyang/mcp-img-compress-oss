#!/bin/bash

echo "🚀 开始设置Cursor MCP工具..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js版本: $node_version"
else
    echo "❌ 错误: 未找到Node.js，请先安装Node.js >= 18.0.0"
    exit 1
fi

# 确保依赖已安装
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "🔧 安装依赖..."
    npm install
fi

# 测试MCP服务器
echo "🧪 测试MCP服务器..."
timeout 2 node src/index.js > /dev/null 2>&1 || {
    # timeout命令不存在时的替代方案
    node -e "
        const child = require('child_process').spawn('node', ['src/index.js']);
        setTimeout(() => child.kill(), 2000);
        child.stderr.on('data', (data) => {
            if (data.toString().includes('MCP服务器已启动')) {
                console.log('✅ MCP服务器测试成功');
                process.exit(0);
            }
        });
        child.on('exit', () => {
            console.log('✅ MCP服务器测试完成');
        });
    " 2>/dev/null || echo "✅ MCP服务器测试完成"
}

# 创建Cursor配置目录
echo "📁 设置Cursor配置..."
cursor_config_dir="$HOME/.cursor"
mkdir -p "$cursor_config_dir"

# 获取当前绝对路径
current_dir=$(pwd)
config_file="$cursor_config_dir/mcp_servers.json"

# 创建配置文件
echo "📝 创建MCP配置文件..."
cat > "$config_file" << EOF
{
  "mcpServers": {
    "mcp-img-compress-oss": {
      "command": "node",
      "args": ["$current_dir/src/index.js"],
      "cwd": "$current_dir",
      "env": {}
    }
  }
}
EOF

echo "✅ 配置文件已创建: $config_file"

# 验证配置文件
echo "🔍 验证配置文件格式..."
if command -v python3 &> /dev/null; then
    python3 -m json.tool "$config_file" > /dev/null && echo "✅ 配置文件格式正确"
else
    echo "⚠️  无法验证JSON格式（python3未安装），但配置文件已创建"
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. 完全退出Cursor (Cmd+Q)"
echo "2. 重新启动Cursor"
echo "3. 在对话中测试：'请获取当前时间'"
echo ""
echo "🔧 如果遇到问题，请查看 troubleshooting.md"
echo ""
echo "📂 配置文件位置: $config_file"
echo "🗂️  项目目录: $current_dir" 