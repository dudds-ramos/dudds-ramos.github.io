import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITENS_INICIAIS, movimentar, abaixoDoMinimo, resumo } from '../js/demos/estoque-sim.js';

test('estoque inicial tem 8 itens e ao menos 2 abaixo do mínimo', () => {
  assert.equal(ITENS_INICIAIS.length, 8);
  assert.ok(resumo(ITENS_INICIAIS).abaixo >= 2);
  assert.equal(resumo(ITENS_INICIAIS).total, 8);
});

test('baixa maior que o estoque para em zero', () => {
  const itens = movimentar(ITENS_INICIAIS, 'mouse', -1000);
  assert.equal(itens.find((i) => i.id === 'mouse').quantidade, 0);
});

test('movimentar não altera a lista original', () => {
  const antes = structuredClone(ITENS_INICIAIS);
  movimentar(ITENS_INICIAIS, 'mouse', 5);
  assert.deepEqual(ITENS_INICIAIS, antes);
});

test('movimentar soma a entrada no item certo', () => {
  const mouse = ITENS_INICIAIS.find((i) => i.id === 'mouse');
  const itens = movimentar(ITENS_INICIAIS, 'mouse', 5);
  assert.equal(itens.find((i) => i.id === 'mouse').quantidade, mouse.quantidade + 5);
});

test('id desconhecido não muda nada', () => {
  assert.deepEqual(movimentar(ITENS_INICIAIS, 'nao-existe', 5), ITENS_INICIAIS);
});

test('abaixoDoMinimo é estritamente menor que o mínimo', () => {
  assert.equal(abaixoDoMinimo({ quantidade: 4, minimo: 5 }), true);
  assert.equal(abaixoDoMinimo({ quantidade: 5, minimo: 5 }), false);
});
