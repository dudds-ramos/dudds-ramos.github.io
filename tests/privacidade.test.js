import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Guarda de privacidade: nenhum arquivo do repositório pode conter termos de uso interno.
// Os termos ficam só como hash (nunca em texto), para que este arquivo possa ser público.
const PROIBIDOS = new Set([
  '35a949fff5700140', '04813c5d6df2b5c8', '1a124dc92c5e6c08', '5a0fa72a1b293377',
  'a9959d28d9598c1b', 'b68bda5317b0b311', 'e2aa1524ced28087', '797276551ab4feb0',
]);

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = (t) => createHash('sha256').update(t).digest('hex').slice(0, 16);

export function palavras(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function termosProibidos(texto) {
  const p = palavras(texto);
  const achados = [];
  for (let i = 0; i < p.length; i++) {
    if (PROIBIDOS.has(hash(p[i]))) achados.push(p[i]);
    if (i + 1 < p.length && PROIBIDOS.has(hash(`${p[i]} ${p[i + 1]}`))) achados.push(`${p[i]} ${p[i + 1]}`);
  }
  return achados;
}

function arquivosDoRepositorio() {
  const tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: raiz, encoding: 'utf8' });
  return tracked.split('\n').filter(Boolean);
}

test('nenhum arquivo do repositório contém termos de uso interno', () => {
  const arquivos = arquivosDoRepositorio();
  assert.ok(arquivos.length > 10);
  for (const rel of arquivos) {
    const buf = fs.readFileSync(path.join(raiz, rel));
    if (buf.includes(0)) continue; // binário (imagens)
    const achados = termosProibidos(buf.toString('utf8'));
    assert.deepEqual(achados, [], `${rel} contém termo proibido`);
  }
});
