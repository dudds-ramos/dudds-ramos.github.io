import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarPedidos, diasParado, estaParado, filtrar, avancarEtapa } from '../js/demos/notas-sim.js';
import { criarRng } from '../js/rng.js';

const HOJE = new Date('2026-11-09');
const diasAtras = (n) => new Date(HOJE.getTime() - n * 86400000);
const ped = (extra) => ({ id: 'PED-1001', filial: 'Filial Aurora', tipo: 'Remanejamento', etapa: 'entrada', desde: diasAtras(3), ...extra });

test('gerarPedidos cria 18 pedidos com ids únicos e ao menos 3 parados', () => {
  const pedidos = gerarPedidos(criarRng(3), HOJE);
  assert.equal(pedidos.length, 18);
  assert.equal(pedidos[0].id, 'PED-1001');
  assert.equal(new Set(pedidos.map((p) => p.id)).size, 18);
  assert.ok(pedidos.filter((p) => estaParado(p, HOJE)).length >= 3);
  for (const p of pedidos) assert.ok(diasParado(p, HOJE) >= 0 && diasParado(p, HOJE) <= 40);
});

test('gerarPedidos garante 3 parados para qualquer semente', () => {
  for (let s = 0; s < 50; s++) {
    assert.ok(gerarPedidos(criarRng(s), HOJE).filter((p) => estaParado(p, HOJE)).length >= 3, `semente ${s}`);
  }
});

test('diasParado conta dias inteiros', () => {
  assert.equal(diasParado({ desde: new Date('2026-10-20') }, HOJE), 20);
});

test('estaParado exige mais de 15 dias e etapa não concluída', () => {
  assert.equal(estaParado(ped({ etapa: 'concluido', desde: diasAtras(30) }), HOJE), false);
  assert.equal(estaParado(ped({ desde: diasAtras(15) }), HOJE), false);
  assert.equal(estaParado(ped({ desde: diasAtras(16) }), HOJE), true);
});

test('filtrar por etapa e busca sem acento nem maiúsculas', () => {
  const pedidos = [
    ped({ id: 'PED-1001', tipo: 'Devolução' }),
    ped({ id: 'PED-1002', tipo: 'Devolução', etapa: 'saida' }),
    ped({ id: 'PED-1003', filial: 'Filial Horizonte' }),
  ];
  assert.deepEqual(filtrar(pedidos, { etapa: 'entrada', busca: 'devolucao' }).map((p) => p.id), ['PED-1001']);
  assert.deepEqual(filtrar(pedidos, { etapa: 'entrada', busca: 'AURORA' }).map((p) => p.id), ['PED-1001']);
  assert.deepEqual(filtrar(pedidos, { etapa: 'entrada', busca: '' }).map((p) => p.id), ['PED-1001', 'PED-1003']);
  assert.deepEqual(filtrar(pedidos, { etapa: 'saida', busca: '1002' }).map((p) => p.id), ['PED-1002']);
});

test('avancarEtapa move para a próxima etapa e reinicia a data', () => {
  const p = ped({ etapa: 'solicitacao', desde: diasAtras(20) });
  const novo = avancarEtapa(p, HOJE);
  assert.equal(novo.etapa, 'concluido');
  assert.equal(novo.desde.getTime(), HOJE.getTime());
  assert.equal(p.etapa, 'solicitacao');
});

test('avancarEtapa mantém pedido concluído', () => {
  const p = ped({ etapa: 'concluido' });
  assert.deepEqual(avancarEtapa(p, HOJE), p);
});
