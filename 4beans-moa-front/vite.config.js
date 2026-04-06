import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],

  // 프로덕션 빌드 시 console.log/warn/error 자동 제거
  esbuild: {
    drop: ["console", "debugger"],
  },

  // 로컬 개발: 프로젝트 루트의 .env 파일을 자동으로 로드
  // GitHub Actions 빌드 시: VITE_* 환경변수를 직접 주입하므로 envDir 무관
  envDir: process.env.VITE_ENV_DIR ?? path.resolve(__dirname, "."),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    https: true,  // WebAuthn requires secure context — matches app.webauthn.allowed-origins=https://localhost:5173

    proxy: {
      "/api": {
        target: "https://localhost:8443",  // backend: SSL on port 8443 (application-local.properties)
        changeOrigin: true,
        secure: false,  // self-signed cert 허용

        rewrite: (path) => {
          return path;
        },

        configure: (proxy, _options) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });

          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request:", req.method, req.url);
          });

          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("Received Response:", proxyRes.statusCode, req.url);
          });
        },
      },

      "/uploads": {
        target: "https://localhost:8443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
