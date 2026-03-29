#!/bin/bash
# SSL 인증서 최초 발급 (EC2에서 1회 실행)
# 실행 전: nginx 설정 파일이 /etc/nginx/conf.d/onesun.shop.conf 에 있어야 함

set -e

DOMAIN="onesun.shop"
EMAIL="your-email@example.com"   # ← 본인 이메일로 변경

echo "=== nginx 설정 복사 ==="
sudo cp ~/moa/nginx/onesun.shop.conf /etc/nginx/conf.d/onesun.shop.conf
sudo nginx -t
sudo systemctl reload nginx

echo "=== SSL 인증서 발급 ==="
sudo certbot --nginx \
  -d ${DOMAIN} \
  -d www.${DOMAIN} \
  --email ${EMAIL} \
  --agree-tos \
  --non-interactive

echo "=== 자동 갱신 확인 ==="
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer

echo "=== 완료 ==="
echo "https://${DOMAIN} 접속 확인하세요."
