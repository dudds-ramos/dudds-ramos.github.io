import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, estaPreenchido, linkWhatsApp, iniciais, urlExterna } from '../js/util.js';

test('escapeHtml escapa caracteres especiais de HTML', () => {
  assert.equal(escapeHtml('<a href="x">&\''), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});

test('estaPreenchido rejeita vazio, espaços, undefined e marcador COMPLETAR', () => {
  assert.equal(estaPreenchido(''), false);
  assert.equal(estaPreenchido('   '), false);
  assert.equal(estaPreenchido(undefined), false);
  assert.equal(estaPreenchido('[COMPLETAR: x]'), false);
  assert.equal(estaPreenchido('Ana'), true);
});

test('linkWhatsApp monta link wa.me só com dígitos e mensagem codificada', () => {
  assert.equal(
    linkWhatsApp('+55 (11) 98888-7777', 'Oi! Tudo bem?'),
    'https://wa.me/5511988887777?text=Oi!%20Tudo%20bem%3F',
  );
});

test('linkWhatsApp devolve null para placeholder ou número curto', () => {
  assert.equal(linkWhatsApp('[COMPLETAR: 55DDDNUMERO]', 'x'), null);
  assert.equal(linkWhatsApp('98888', 'x'), null);
});

test('iniciais usa primeira e última palavra, ou ? se não preenchido', () => {
  assert.equal(iniciais('Ana Maria Souza'), 'AS');
  assert.equal(iniciais('Ana'), 'A');
  assert.equal(iniciais('[COMPLETAR: Seu Nome]'), '?');
});

test('urlExterna aceita http(s), completa domínio sem esquema e rejeita o resto', () => {
  assert.equal(urlExterna('https://x.com/a'), 'https://x.com/a');
  assert.equal(urlExterna('  linkedin.com/in/ana '), 'https://linkedin.com/in/ana');
  assert.equal(urlExterna('www.instagram.com/ana'), 'https://www.instagram.com/ana');
  assert.equal(urlExterna('javascript:alert(1)'), null);
  assert.equal(urlExterna('data:text/html,oi'), null);
  assert.equal(urlExterna('[COMPLETAR: https://...]'), null);
  assert.equal(urlExterna(''), null);
});
