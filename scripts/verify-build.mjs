import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const required = ['middleware.js', 'lib/viewer-access.ts', 'index.html', 'robots.txt', 'vercel.json'];

for (const f of required) {
  if (!existsSync(join(root, f))) {
    console.error('Fehlende Datei:', f);
    process.exit(1);
  }
}

console.log('Build-Check OK (Struktur).');