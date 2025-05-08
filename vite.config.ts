import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: "https://self-manager-backend.onrender.com",
        ws: true,
      },
    },
  },
});
