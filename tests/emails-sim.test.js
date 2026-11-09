import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FILIAIS, MODELOS, montarEmail } from '../js/demos/emails-sim.js';

const HOJE = new Date('2026-11-09T12:00');

test('todas as filiais usam e-mails do domínio fictício exemplo.com', () => {
  assert.equal(FILIAIS.length, 5);
  for (const f of FILIAIS) {
    assert.ok(f.email.endsWith('@exemplo.com'), f.email);
    for (const c of f.cc) assert.ok(c.endsWith('@exemplo.com'), c);
  }
});

test('existem os modelos lembrete e relatorio', () => {
  assert.deepEqual(MODELOS.map((m) => m.id), ['lembrete', 'relatorio']);
});

test('montarEmail de lembrete usa nome da filial, data e primeiro nome do responsável', () => {
  const email = montarEmail('aurora', 'lembrete', HOJE);
  const aurora = FILIAIS.find((f) => f.id === 'aurora');
  assert.equal(email.assunto, 'Lembrete: pendências da Filial Aurora — 09/11/2026');
  assert.ok(email.corpo.startsWith('Olá, Carla,'));
  assert.equal(email.para, aurora.email);
  assert.deepEqual(email.cc, aurora.cc);
});

test('montarEmail de relatório tem o assunto do relatório semanal', () => {
  assert.equal(montarEmail('aurora', 'relatorio', HOJE).assunto, 'Relatório semanal — Filial Aurora — 09/11/2026');
});

test('montarEmail devolve null para filial ou modelo inexistente', () => {
  assert.equal(montarEmail('xyz', 'lembrete', HOJE), null);
  assert.equal(montarEmail('aurora', 'xyz', HOJE), null);
});
