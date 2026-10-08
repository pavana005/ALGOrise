import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { adminApiMiddleware } from './src/server/adminServer';

function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api-server',
    configureServer(server) {
      server.middlewares.use(adminApiMiddleware);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminApiPlugin()],
  server: {
    port: 5173,
    host: true,
    open: true,
  }
});
