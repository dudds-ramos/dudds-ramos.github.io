import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  renderHero, renderAbas, renderPainelProjeto, renderDetalhe, renderSobre, renderContato, tituloPagina, renderLogo,
} from '../js/render.js';
import { conteudo } from '../js/conteudo.js';

const contar = (txt, trecho) => txt.split(trecho).length - 1;
const pessoa = (extra) => ({
  nome: 'Ana Souza', titulo: 'Dados e automação.', frase: 'x & y', tecnologias: ['Python'], ...extra,
});
const semLinks = { linkedin: '', github: '', email: '', whatsapp: { numero: '', mensagem: '' } };

// ---------- Hero ----------
test('renderHero escapa texto do dono e mostra título, frase e tecnologias', () => {
  const html = renderHero(pessoa({ nome: 'Ana <b>' }), semLinks);
  assert.ok(html.includes('Ana &lt;b&gt;'));
  assert.ok(html.includes('Dados e automação.'));
  assert.ok(html.includes('x &amp; y'));
  assert.ok(html.includes('class="tag"'));
});

test('renderHero mostra "Seu Nome" enquanto o nome é placeholder', () => {
  const html = renderHero(pessoa({ nome: '[COMPLETAR: Seu Nome]' }), semLinks);
  assert.ok(html.includes('Seu Nome'));
  assert.ok(!html.includes('[COMPLETAR'));
});

test('renderHero sempre tem "Visualizar projetos" e só mostra GitHub/LinkedIn preenchidos', () => {
  const vazio = renderHero(pessoa(), semLinks);
  assert.ok(vazio.includes('href="#projetos"'));
  assert.ok(vazio.includes('Visualizar projetos'));
  assert.ok(!vazio.includes('GitHub'));
  assert.ok(!vazio.includes('LinkedIn'));
  const cheio = renderHero(pessoa(), { ...semLinks, github: 'github.com/ana', linkedin: 'https://linkedin.com/in/ana' });
  assert.ok(cheio.includes('href="https://github.com/ana"'));
  assert.ok(cheio.includes('href="https://linkedin.com/in/ana"'));
});

test('renderLogo usa as iniciais do nome', () => {
  assert.equal(renderLogo({ nome: 'Eduarda Ramos' }), 'ER');
});

// ---------- Projetos (abas + painel único) ----------
test('renderAbas cria uma aba por projeto e marca só a ativa', () => {
  const html = renderAbas(conteudo.projetos, 'notas');
  assert.equal(contar(html, 'role="tab"'), 4);
  assert.equal(contar(html, 'aria-selected="true"'), 1);
  assert.ok(html.includes('data-aba="notas" aria-selected="true"'));
  assert.equal(contar(html, 'aria-controls="painel-projeto"'), 4);
  assert.equal(contar(html, 'tabindex="-1"'), 3);
});

test('renderPainelProjeto mostra texto, funcionalidades, tecnologias e detalhes', () => {
  const p = conteudo.projetos[0];
  const html = renderPainelProjeto(p);
  assert.ok(html.includes(p.titulo));
  assert.ok(html.includes(p.comoFeito[0]));
  assert.ok(html.includes('class="tag"'));
  assert.ok(html.includes(`data-projeto-id="${p.id}"`));
  assert.ok(html.includes('Ver detalhes'));
});

test('renderPainelProjeto reserva a demo ao vivo, marcada como fictícia', () => {
  const html = renderPainelProjeto(conteudo.projetos[0]);
  assert.ok(html.includes('data-vitrine="impressoras"'));
  assert.ok(html.includes('dados fictícios'));
  assert.ok(!html.includes('<img'));
});

test('projeto sem demo usa a imagem como fallback, ou só o texto', () => {
  const base = { ...conteudo.projetos[0], demo: null };
  const com = renderPainelProjeto({ ...base, imagem: 'assets/projetos/x.webp' });
  assert.ok(com.includes('<img'));
  assert.ok(com.includes(`alt="Interface de ${base.titulo}`));
  assert.ok(!com.includes('data-vitrine'));
  const sem = renderPainelProjeto({ ...base, imagem: '' });
  assert.ok(!sem.includes('<img'));
  assert.ok(!sem.includes('data-vitrine'));
});

test('renderPainelProjeto escapa texto do dono', () => {
  const html = renderPainelProjeto({ ...conteudo.projetos[0], titulo: 'A <b> & B' });
  assert.ok(html.includes('A &lt;b&gt; &amp; B'));
});

// ---------- Detalhe ----------
test('renderDetalhe tem objetivo, problema, funcionalidades e tecnologias', () => {
  const html = renderDetalhe(conteudo.projetos[0]);
  for (const h of ['Objetivo', 'O problema', 'Principais funcionalidades', 'Tecnologias']) {
    assert.ok(html.includes(`>${h}<`), h);
  }
});

test('renderDetalhe só inclui a área de demo quando o projeto tem demo', () => {
  const p = conteudo.projetos[1];
  assert.ok(!renderDetalhe({ ...p, demo: null }).includes('class="demo"'));
  const comDemo = renderDetalhe({ ...p, demo: 'notas' });
  assert.ok(comDemo.includes('data-demo="notas"'));
  assert.ok(comDemo.includes('Dados fictícios'));
});

test('renderDetalhe mostra link do GitHub só quando existe', () => {
  const p = conteudo.projetos[0];
  assert.ok(!renderDetalhe({ ...p, github: '' }).includes('github.com'));
  assert.ok(renderDetalhe({ ...p, github: 'https://github.com/ana/x' }).includes('href="https://github.com/ana/x"'));
});

// ---------- Sobre ----------
const sobreBase = {
  paragrafos: ['Oi'],
  linhaDoTempo: [
    { quando: '2023', titulo: 'Curso', detalhe: 'd' },
    { quando: 'Hoje', titulo: 'Atual', detalhe: '[COMPLETAR: x]' },
  ],
  formacao: [{ titulo: 'ADS', status: 'Cursando', detalhe: '[COMPLETAR: x]' }],
};

test('renderSobre mostra avatar, nome, subtítulo, linha do tempo e formação', () => {
  const html = renderSobre(sobreBase, { nome: 'Ana Souza', foto: '', subtitulo: 'Estudante de ADS' });
  assert.ok(html.includes('class="avatar"'));
  assert.ok(html.includes('AS'));
  assert.ok(html.includes('Ana Souza'));
  assert.ok(html.includes('Estudante de ADS'));
  assert.equal(contar(html, 'class="marco"'), 2);
  assert.ok(html.includes('Formação e cursos'));
  assert.ok(html.includes('Cursando'));
  assert.ok(!html.includes('[COMPLETAR'));
});

test('renderSobre remove só o marcador de um parágrafo com texto real', () => {
  const html = renderSobre({ ...sobreBase, paragrafos: ['Gosto de sistemas. [COMPLETAR: algo]'] }, { nome: 'Ana', foto: '' });
  assert.ok(html.includes('Gosto de sistemas.'));
  assert.ok(!html.includes('[COMPLETAR'));
});

test('renderSobre usa a foto quando preenchida', () => {
  const html = renderSobre(sobreBase, { nome: 'Ana Souza', foto: 'assets/foto.jpg' });
  assert.ok(html.includes('<img'));
  assert.ok(html.includes('alt="Foto de Ana Souza"'));
});

// ---------- Contato ----------
test('renderContato omite links não preenchidos e mantém a chamada', () => {
  const html = renderContato({ ...semLinks, chamada: 'Aberta a oportunidades', instagram: 'https://instagram.com/ana' });
  assert.ok(html.includes('Aberta a oportunidades'));
  assert.ok(!html.includes('wa.me'));
  assert.ok(!html.includes('mailto:'));
  assert.ok(!html.includes('linkedin'));
  assert.ok(html.includes('instagram.com/ana'));
});

test('renderContato monta e-mail, GitHub, LinkedIn e WhatsApp quando preenchidos', () => {
  const html = renderContato({
    email: 'ana@exemplo.com',
    github: 'github.com/ana',
    linkedin: 'https://linkedin.com/in/ana',
    whatsapp: { numero: '5511988887777', mensagem: 'oi' },
  });
  assert.ok(html.includes('href="mailto:ana@exemplo.com"'));
  assert.ok(html.includes('href="https://github.com/ana"'));
  assert.ok(html.includes('href="https://linkedin.com/in/ana"'));
  assert.ok(html.includes('https://wa.me/5511988887777?text=oi'));
});

test('renderContato ignora e-mail inválido e esquemas perigosos', () => {
  const html = renderContato({ ...semLinks, email: 'nao-e-email', linkedin: 'javascript:alert(1)', instagram: 'instagram.com/ana' });
  assert.ok(!html.includes('mailto:'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes('href="https://instagram.com/ana"'));
});

// ---------- Título ----------
test('tituloPagina usa nome e cargo quando preenchidos e nunca mostra o marcador', () => {
  assert.equal(tituloPagina({ nome: 'Ana Souza', cargo: 'Desenvolvedora' }), 'Ana Souza · Desenvolvedora');
  assert.equal(tituloPagina({ nome: 'Ana Souza', cargo: '' }), 'Ana Souza');
  assert.equal(tituloPagina({ nome: '[COMPLETAR: Seu Nome]', cargo: 'Desenvolvedora' }), 'Portfólio');
});
