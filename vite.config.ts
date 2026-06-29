import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // Proxy de desenvolvimento: tudo que comeca com /api e encaminhado
    // para o backend local, evitando problemas de CORS no navegador.
    proxy: {
      "/api": {
        target: "http://localhost:5073",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
