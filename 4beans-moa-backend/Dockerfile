# ── Stage 1: Build ──────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# 의존성 캐싱 (pom.xml만 먼저 복사)
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

# 소스 빌드 (테스트 제외)
COPY src ./src
RUN mvn package -DskipTests -q

# ── Stage 2: Run ─────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.war app.war

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.war", "--spring.profiles.active=prod"]
