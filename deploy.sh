#!/bin/bash
set -e

echo "=========================================="
echo "  时光记 · 一键部署脚本 (Ubuntu 22.04)"
echo "=========================================="

# 1. 创建 swap（1GB 内存不够 Docker 构建用）
echo ">>> [1/7] 检查并创建 swap..."
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
  echo "    swap 已创建 (2GB)"
else
  swapon /swapfile 2>/dev/null || true
  echo "    swap 已存在"
fi

# 2. 安装 Docker
echo ">>> [2/7] 安装 Docker..."
if command -v docker &> /dev/null; then
  echo "    Docker 已安装，跳过"
else
  apt-get update
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  systemctl enable docker
  systemctl start docker
  echo "    Docker 安装完成"
fi

# 3. 验证 Docker
echo ">>> [3/7] 验证 Docker..."
docker --version
docker compose version

# 4. 初始化项目目录
echo ">>> [4/7] 初始化数据目录..."
cd /opt/fengbao
mkdir -p data uploads nginx/ssl

# 复制初始数据（仅首次）
if [ ! -f data/events.json ]; then
  cp src/data/*.json data/
  echo "    初始数据已复制"
else
  echo "    数据目录已有数据，跳过"
fi

# 5. 创建环境变量
echo ">>> [5/7] 配置环境变量..."
if [ ! -f .env.local ]; then
  read -p "请输入管理后台密码 (默认 family2025): " ADMIN_PWD
  ADMIN_PWD=${ADMIN_PWD:-family2025}
  echo "ADMIN_PASSWORD=${ADMIN_PWD}" > .env.local
  echo "    密码已配置"
else
  echo "    .env.local 已存在，跳过"
fi

# 6. 构建并启动
echo ">>> [6/7] 构建并启动服务（首次约5-10分钟）..."
docker compose up -d --build

# 7. 检查状态
echo ">>> [7/7] 检查服务状态..."
sleep 5
docker compose ps

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  访问网站: http://$(curl -s ifconfig.me)"
echo "  管理后台: http://$(curl -s ifconfig.me)/admin"
echo "=========================================="
