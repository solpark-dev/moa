import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    https: {
      pfx: fs.readFileSync("./moa-ssl.p12"),
      passphrase: "moa1234",
    },

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,

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
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
