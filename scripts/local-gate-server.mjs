/**
 * Lokaler Static-Server mit derselben Zugangslogik wie middleware.ts (für curl/Screenshots).
 * Env: VIEWER_PASSWORD, VIEWER_SESSION_TOKEN (nur lokal, nicht committen).
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize } from 'node:path';
const root = join(import.meta.dirname, '..');
const port = Number(process.env.PORT || 4173);

const mod = await import('../lib/viewer-access.ts');

const env = () => ({
  VIEWER_PASSWORD: process.env.VIEWER_PASSWORD,
  VIEWER_SESSION_TOKEN: process.env.VIEWER_SESSION_TOKEN,
});

function nodeRequestToWeb(req) {
  const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
  return new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
  });
}

async function sendWebResponse(res, webRes) {
  res.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));
  const buf = Buffer.from(await webRes.arrayBuffer());
  res.end(buf);
}

async function serveStatic(pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = normalize(join(root, rel.replace(/^\//, '')));
  if (!file.startsWith(root)) return null;
  try {
    const st = await stat(file);
    if (!st.isFile()) return null;
    const data = await readFile(file);
    const ext = file.split('.').pop()?.toLowerCase();
    const types = {
      html: 'text/html; charset=utf-8',
      css: 'text/css',
      js: 'text/javascript',
      json: 'application/json',
      pdf: 'application/pdf',
      glb: 'model/gltf-binary',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      wasm: 'application/wasm',
      ifc: 'application/x-step',
      txt: 'text/plain',
    };
    return { data, type: types[ext] || 'application/octet-stream' };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const secure = false;
  const request = nodeRequestToWeb(req);

  if (req.method === 'POST') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);
    const ct = req.headers['content-type'] || 'application/x-www-form-urlencoded';
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
    }
    headers.set('content-type', ct);
    const webReq = new Request(request.url, { method: 'POST', headers, body });
    const login = await mod.tryLoginFromPost(webReq, env(), secure);
    if (login) {
      await sendWebResponse(res, login);
      return;
    }
  }

  if (!mod.isAuthorized(request, env())) {
    await sendWebResponse(res, mod.loginResponse(false, secure));
    return;
  }

  const url = new URL(request.url);
  const asset = await serveStatic(url.pathname);
  if (!asset) {
    res.writeHead(404, mod.SECURITY_HEADERS);
    res.end('Not found');
    return;
  }
  const headers = { ...mod.SECURITY_HEADERS, 'Content-Type': asset.type };
  res.writeHead(200, headers);
  res.end(asset.data);
}).listen(port, () => {
  console.log(`Local gate server http://127.0.0.1:${port}/`);
});