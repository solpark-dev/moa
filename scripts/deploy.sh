#!/bin/bash
# EC2에서 최신 코드 배포 (업데이트 시마다 실행)

set -e

APP_DIR=~/moa

echo "=== 1. 최신 코드 pull ==="
cd $APP_DIR
git pull origin main

echo "=== 2. 이미지 빌드 & 컨테이너 재시작 ==="
docker-compose -f docker-compose.prod.yml up --build -d

echo "=== 3. 헬스 체크 ==="
sleep 10
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health)
if [ "$STATUS" = "200" ]; then
  echo "배포 성공: 백엔드 정상 응답"
else
  echo "경고: 백엔드 응답 코드 $STATUS — 로그를 확인하세요"
  docker-compose -f docker-compose.prod.yml logs backend --tail=50
fi

echo "=== 4. 사용하지 않는 이미지 정리 ==="
docker image prune -f

echo "=== 배포 완료 ==="
