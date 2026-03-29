#!/bin/bash
# EC2 Amazon Linux 2023 초기 1회 실행 스크립트

set -e

echo "=== 1. 시스템 업데이트 ==="
sudo dnf update -y

echo "=== 2. Docker 설치 ==="
sudo dnf install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

echo "=== 3. Docker Compose 설치 ==="
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "=== 4. nginx 설치 ==="
sudo dnf install -y nginx
sudo systemctl enable nginx

echo "=== 5. Certbot 설치 (Let's Encrypt) ==="
sudo dnf install -y python3-certbot-nginx

echo "=== 6. Git 설치 ==="
sudo dnf install -y git

echo "=== 완료 ==="
echo "재로그인 후 docker 명령어를 사용할 수 있습니다."
echo "다음 단계: scripts/init-ssl.sh 실행"
