import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarRng } from '../js/rng.js';

test('mesma semente gera a mesma sequência', () => {
  const a = criarRng(42), b = criarRng(42);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test('semente diferente gera primeira saída diferente', () => {
  assert.notEqual(criarRng(42)(), criarRng(43)());
});

test('saídas ficam em [0, 1)', () => {
  const r = criarRng(9);
  for (let i = 0; i < 1000; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1, `fora do intervalo: ${v}`);
  }
});
