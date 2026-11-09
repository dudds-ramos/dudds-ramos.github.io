import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHero, renderProjetos, renderDetalhe, renderSobre, renderContato, tituloPagina } from '../js/render.js';
import { conteudo } from '../js/conteudo.js';

const contar = (txt, trecho) => txt.split(trecho).length - 1;

test('renderHero escapa texto do dono e mostra as tecnologias como tags', () => {
  const html = renderHero({ nome: 'Ana <b>', frase: 'x & y', tecnologias: ['Python'] });
  assert.ok(html.includes('Ana &lt;b&gt;'));
  assert.ok(html.includes('x &amp; y'));
  assert.ok(html.includes('class="tag"'));
});

test('renderHero mostra "Seu Nome" enquanto o nome é placeholder', () => {
  const html = renderHero({ nome: '[COMPLETAR: Seu Nome]', frase: 'f', tecnologias: [] });
  assert.ok(html.includes('Seu Nome'));
  assert.ok(!html.includes('[COMPLETAR'));
});

test('renderProjetos gera um card por projeto', () => {
  assert.equal(contar(renderProjetos(conteudo.projetos), 'data-projeto-id='), 4);
});

test('renderDetalhe só inclui a área de demo quando o projeto tem demo', () => {
  const p = conteudo.projetos[1];
  assert.ok(!renderDetalhe({ ...p, demo: null }).includes('class="demo"'));
  const comDemo = renderDetalhe({ ...p, demo: 'notas' });
  assert.ok(comDemo.includes('data-demo="notas"'));
  assert.ok(comDemo.includes('Dados fictícios'));
});

test('renderSobre mostra avatar com iniciais e omite marcadores COMPLETAR', () => {
  const html = renderSobre(
    { paragrafos: ['Oi'], formacao: [{ titulo: 'ADS', status: 'Cursando', detalhe: '[COMPLETAR: x]' }] },
    { nome: 'Ana Souza', foto: '' },
  );
  assert.ok(html.includes('class="avatar"'));
  assert.ok(html.includes('AS'));
  assert.ok(html.includes('Em formação'));
  assert.ok(html.includes('Cursando'));
  assert.ok(!html.includes('[COMPLETAR'));
});

test('renderSobre remove só o marcador de um parágrafo com texto real', () => {
  const html = renderSobre(
    { paragrafos: ['Gosto de sistemas. [COMPLETAR: algo]'], formacao: [] },
    { nome: 'Ana', foto: '' },
  );
  assert.ok(html.includes('Gosto de sistemas.'));
  assert.ok(!html.includes('[COMPLETAR'));
});

test('renderSobre usa a foto quando preenchida', () => {
  const html = renderSobre({ paragrafos: [], formacao: [] }, { nome: 'Ana Souza', foto: 'assets/foto.jpg' });
  assert.ok(html.includes('<img'));
  assert.ok(html.includes('alt="Foto de Ana Souza"'));
});

test('renderContato omite links não preenchidos', () => {
  const html = renderContato({
    whatsapp: { numero: '[COMPLETAR: x]', mensagem: 'oi' },
    linkedin: '',
    instagram: 'https://instagram.com/ana',
  });
  assert.ok(!html.includes('wa.me'));
  assert.ok(!html.includes('linkedin'));
  assert.ok(html.includes('instagram.com/ana'));
});

test('renderContato monta o botão do WhatsApp com número válido', () => {
  const html = renderContato({ whatsapp: { numero: '5511988887777', mensagem: 'oi' }, linkedin: '', instagram: '' });
  assert.ok(html.includes('https://wa.me/5511988887777?text=oi'));
});

test('tituloPagina usa o nome quando preenchido e nunca mostra o marcador', () => {
  assert.equal(tituloPagina({ nome: 'Ana Souza' }), 'Ana Souza · Desenvolvedor');
  assert.equal(tituloPagina({ nome: '[COMPLETAR: Seu Nome]' }), 'Portfólio');
});

test('renderContato completa link sem https e ignora esquemas perigosos', () => {
  const html = renderContato({
    whatsapp: { numero: '', mensagem: '' },
    linkedin: 'javascript:alert(1)',
    instagram: 'instagram.com/ana',
  });
  assert.ok(html.includes('href="https://instagram.com/ana"'));
  assert.ok(!html.includes('javascript:'));
});
