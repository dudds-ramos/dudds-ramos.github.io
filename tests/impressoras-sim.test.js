import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarParque, avancar, alertasAbertos } from '../js/demos/impressoras-sim.js';
import { criarRng } from '../js/rng.js';

// rng roteirizado: devolve os valores em ordem e depois repete o último (ou `resto`).
const roteiro = (valores, resto = valores[valores.length - 1]) => {
  let i = 0;
  return () => (i < valores.length ? valores[i++] : resto);
};

const imp = (extra) => ({ id: 'IMP-03', nome: 'IMP-03', local: 'RH', status: 'online', toner: 50, alertas: [], ...extra });

test('criarParque gera 12 impressoras online com toner entre 20 e 100 e ids únicos', () => {
  const parque = criarParque(criarRng(1));
  assert.equal(parque.length, 12);
  assert.equal(new Set(parque.map((p) => p.id)).size, 12);
  for (const p of parque) {
    assert.equal(p.status, 'online');
    assert.ok(p.toner >= 20 && p.toner <= 100, `toner ${p.toner}`);
  }
});

test('avancar não altera o parque recebido', () => {
  const parque = criarParque(criarRng(2));
  const antes = structuredClone(parque);
  avancar(parque, criarRng(3));
  assert.deepEqual(parque, antes);
});

test('impressora online cai e abre alerta offline', () => {
  const { parque, eventos } = avancar([imp()], () => 0.01);
  assert.notEqual(parque[0].status, 'online');
  assert.deepEqual(parque[0].alertas, [{ tipo: 'offline', aberto: true }]);
  assert.match(eventos[0], /parou de responder$/);
});

test('impressora offline não gasta toner', () => {
  const { parque } = avancar([imp({ status: 'sem-resposta' })], () => 0.99);
  assert.equal(parque[0].toner, 50);
  assert.equal(parque[0].status, 'sem-resposta');
});

test('impressora offline volta com rng baixo', () => {
  const alertas = [{ tipo: 'toner-baixo', aberto: true }, { tipo: 'offline', aberto: true }];
  const { parque } = avancar([imp({ status: 'sem-resposta', toner: 5, alertas })], () => 0.1);
  assert.equal(parque[0].status, 'online');
  assert.equal(parque[0].alertas.find((a) => a.tipo === 'offline').aberto, false);
});

test('alerta de toner baixo não é resolvido com a impressora offline', () => {
  const alertas = [{ tipo: 'toner-baixo', aberto: true }, { tipo: 'offline', aberto: true }];
  const { parque } = avancar([imp({ status: 'sem-resposta', toner: 5, alertas })], () => 0.99);
  assert.equal(parque[0].status, 'sem-resposta');
  assert.equal(parque[0].alertas.find((a) => a.tipo === 'toner-baixo').aberto, true);
});

test('toner cruzando 10 abre alerta de toner baixo', () => {
  const { parque, eventos } = avancar([imp({ toner: 11 })], roteiro([0.9, 0.9], 0.99));
  assert.equal(parque[0].toner, 8);
  assert.equal(parque[0].alertas.find((a) => a.tipo === 'toner-baixo')?.aberto, true);
  assert.ok(eventos.some((e) => e.endsWith('com toner baixo')));
});

test('alertasAbertos conta só os abertos', () => {
  const parque = [
    imp({ alertas: [{ tipo: 'offline', aberto: true }, { tipo: 'toner-baixo', aberto: false }] }),
    imp({ id: 'IMP-04', alertas: [{ tipo: 'toner-baixo', aberto: true }] }),
  ];
  assert.equal(alertasAbertos(parque), 2);
});

test('toner fica sempre entre 0 e 100 ao longo de 500 passos', () => {
  const rng = criarRng(7);
  let parque = criarParque(rng);
  for (let i = 0; i < 500; i++) {
    parque = avancar(parque, rng).parque;
    for (const p of parque) assert.ok(p.toner >= 0 && p.toner <= 100, `toner ${p.toner}`);
  }
});
