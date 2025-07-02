#!/usr/bin/env node

console.log('========== OSS环境变量调试信息 ==========');
console.log('OSS_ENDPOINT:', process.env.OSS_ENDPOINT || '未设置');
console.log('OSS_ACCESS_KEY_ID:', process.env.OSS_ACCESS_KEY_ID ? '已设置' : '未设置');
console.log('OSS_ACCESS_KEY_SECRET:', process.env.OSS_ACCESS_KEY_SECRET ? '已设置' : '未设置');
console.log('OSS_BUCKET:', process.env.OSS_BUCKET || '未设置');
console.log('OSS_REGION:', process.env.OSS_REGION || '未设置');
console.log('OSS_PATH:', process.env.OSS_PATH || '未设置');
console.log('==========================================');

// 如果所有必需的OSS参数都已设置，则显示成功消息
if (
  process.env.OSS_ENDPOINT &&
  process.env.OSS_ACCESS_KEY_ID &&
  process.env.OSS_ACCESS_KEY_SECRET &&
  process.env.OSS_BUCKET &&
  process.env.OSS_REGION
) {
  console.log('✅ OSS环境变量配置正确！');
} else {
  console.log('❌ OSS环境变量配置不完整，请检查mcp_servers.json文件中的env部分。');
}
