import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. Automatically load .env or .env.local if available (Node 20.6+)
if (typeof process.loadEnvFile === 'function') {
  if (fs.existsSync('.env')) {
    try { process.loadEnvFile('.env'); } catch {}
  }
  if (fs.existsSync('.env.local')) {
    try { process.loadEnvFile('.env.local'); } catch {}
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5173;

// 2. Ensure compiled server API bundle exists; compile dynamically if needed
const serverDistPath = path.join(__dirname, 'dist-server', 'adminServer.js');
if (!fs.existsSync(serverDistPath)) {
  console.log('[Server] Compiling server backend API bundle...');
  const { buildSync } = await import('esbuild');
  buildSync({
    entryPoints: [path.join(__dirname, 'src', 'server', 'adminServer.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: serverDistPath,
    packages: 'external'
  });
  console.log('[Server] Server backend API compiled successfully.');
}

const { adminApiMiddleware } = await import('./dist-server/adminServer.js');

const app = express();

// 3. Mount Backend API Middleware (Auth, Compiler, Admin CMS, User Progress)
app.use(adminApiMiddleware);

// 4. Serve Built Frontend Static Files
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 5. Client-Side Routing Fallback (SPA)
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Algorise frontend is not built yet. Run "npm run build" first.');
  }
});

// 6. Start Production Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Algorise Production Server running on port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
