// --- Leonida Legend Development Server ---
// A minimal static server for local development.
// Serves `app/` files on http://localhost:8080 (or specified port).
// Features: MIME type support, path restriction, no-store caching for immediate updates.
// Note: This is for development convenience only.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve root directory
const root = resolve(fileURLToPath(new URL('./app', import.meta.url)));

// Parse command line arguments for custom port
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const requested = portIndex === -1 ? 8080 : Number(args[portIndex + 1]);
const port = Number.isInteger(requested) && requested > 0 && requested < 65536 ? requested : 8080;

// Supported MIME types
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

// Start server
createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let pathname: string;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  // Default to index.html for root path
  if (pathname.endsWith('/')) pathname += 'index.html';
  
  // Resolve and sanitize path
  const file = resolve(join(root, normalize(pathname)));
  
  // Security check: ensure path is within root
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  // Check if file exists
  let size: number;
  try {
    const stats = statSync(file);
    if (!stats.isFile()) throw new Error('Not a file');
    size = stats.size;
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }

  // Serve file
  response.writeHead(200, {
    'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': size,
    'cache-control': 'no-store', // Disable caching for development
  });
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Development server running at: http://localhost:${port}`);
});

// Leonida Legend refresh pass: server helpers verified
