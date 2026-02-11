# 时光记 · 部署指南

## 服务器要求

- **系统**：Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **配置**：1核 1G 内存起步（推荐 2核 2G）
- **软件**：Docker + Docker Compose
- **带宽**：1Mbps+（国内云服务器推荐 3Mbps+）

## 推荐服务器

| 平台 | 配置 | 价格 |
|------|------|------|
| 阿里云 ECS | 2核2G | ≈50元/月 |
| 腾讯云轻量 | 2核2G | ≈40元/月 |
| 华为云 HECS | 1核2G | ≈30元/月 |

## 一、安装 Docker（如果没有）

```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker
sudo systemctl start docker

# 安装 Docker Compose（新版 Docker 已内置）
docker compose version
```

## 二、上传代码到服务器

### 方式 A：Git 拉取（推荐）
```bash
# 在服务器上
cd /opt
git clone <你的仓库地址> fengbao
cd fengbao
```

### 方式 B：本地打包上传
```bash
# 在本地电脑
tar -czf fengbao.tar.gz --exclude=node_modules --exclude=.next .

# 上传到服务器
scp fengbao.tar.gz root@你的服务器IP:/opt/

# 在服务器上解压
cd /opt
mkdir fengbao && cd fengbao
tar -xzf ../fengbao.tar.gz
```

## 三、配置环境变量

```bash
cd /opt/fengbao

# 创建环境变量文件
cat > .env.local << 'EOF'
ADMIN_PASSWORD=你的管理密码
EOF
```

## 四、初始化数据目录

```bash
# 首次部署需要把数据文件复制到挂载目录
mkdir -p data uploads nginx/ssl
cp src/data/*.json data/
```

## 五、启动服务

```bash
# 构建并启动
docker compose up -d --build

# 查看日志
docker compose logs -f

# 查看状态
docker compose ps
```

启动后访问 `http://你的服务器IP` 即可看到网站。

## 六、配置域名（可选）

1. 购买域名（如 family.example.com）
2. 在域名 DNS 中添加 A 记录指向服务器 IP
3. 修改 `nginx/default.conf` 中的 `server_name`：
```nginx
server_name family.example.com;
```
4. 重启 nginx：
```bash
docker compose restart nginx
```

## 七、配置 HTTPS（可选）

### 使用 Let's Encrypt 免费证书

```bash
# 在服务器上安装 certbot
apt install certbot -y

# 先停掉 nginx
docker compose stop nginx

# 申请证书
certbot certonly --standalone -d family.example.com

# 复制证书到项目目录
cp /etc/letsencrypt/live/family.example.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/family.example.com/privkey.pem nginx/ssl/
```

然后修改 `nginx/default.conf`，在 server 块里加上：
```nginx
listen 443 ssl;
ssl_certificate /etc/nginx/ssl/fullchain.pem;
ssl_certificate_key /etc/nginx/ssl/privkey.pem;
```

重启：
```bash
docker compose up -d
```

## 常用运维命令

```bash
# 停止服务
docker compose down

# 重启服务
docker compose restart

# 重新构建（代码更新后）
docker compose up -d --build

# 查看实时日志
docker compose logs -f fengbao

# 备份数据
tar -czf backup-$(date +%Y%m%d).tar.gz data/ uploads/

# 进入容器调试
docker exec -it fengbao sh
```

## 更新代码

```bash
cd /opt/fengbao
git pull                          # 如果用 Git
docker compose up -d --build      # 重新构建
```

## 注意事项

- **修改密码**：编辑 `.env.local` 中的 `ADMIN_PASSWORD`，然后 `docker compose restart fengbao`
- **数据安全**：`data/` 和 `uploads/` 目录是持久化挂载的，不会因为重新部署而丢失
- **定期备份**：建议设置 crontab 定期备份数据目录
- **图片大小**：Nginx 限制上传文件最大 20MB，如需调整修改 `nginx/default.conf` 的 `client_max_body_size`
