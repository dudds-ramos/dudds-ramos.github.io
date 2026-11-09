import { test } from 'node:test';
import assert from 'node:assert/strict';
import { conteudo } from '../js/conteudo.js';

test('os 4 projetos estão na ordem combinada', () => {
  assert.deepEqual(conteudo.projetos.map((p) => p.id), ['impressoras', 'notas', 'emails', 'estoque']);
});

test('todo projeto tem os campos de texto preenchidos', () => {
  for (const p of conteudo.projetos) {
    assert.ok(p.titulo && p.resumo && p.problema, p.id);
    assert.ok(p.comoFeito.length >= 2, p.id);
    assert.ok(p.tecnologias.length >= 1, p.id);
  }
});

test('conteudo não tem campos que o site não usa', () => {
  assert.equal(conteudo.site, undefined);
});
