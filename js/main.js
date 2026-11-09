import { conteudo } from './conteudo.js';
import { renderHero, renderProjetos, renderSobre, renderContato, tituloPagina, renderLogo } from './render.js';
import { abrirDetalhe, iniciarDetalhe } from './detalhe.js';
import { estaPreenchido } from './util.js';
import { iniciarVitrine } from './vitrine.js';

const $ = (sel) => document.querySelector(sel);

function renderizar() {
  const { pessoa, contato } = conteudo;
  $('#inicio').innerHTML = renderHero(pessoa, contato);
  $('#projetos .grade').innerHTML = renderProjetos(conteudo.projetos);
  $('#sobre').innerHTML = renderSobre(conteudo.sobre, pessoa);
  $('#contato').innerHTML = renderContato(contato);
  $('.logo-texto').textContent = renderLogo(pessoa);
  $('.rodape-nome').textContent = estaPreenchido(pessoa.nome) ? `© ${new Date().getFullYear()} ${pessoa.nome}` : '';
  document.title = tituloPagina(pessoa);
}

function animarEntrada() {
  const elementos = document.querySelectorAll('.revelar');
  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visivel'));
    return;
  }
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('visivel');
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.1 },
  );
  elementos.forEach((el) => obs.observe(el));
}

function ligarMenu() {
  const topo = $('.topo');
  const botao = $('.menu-botao');
  const menu = $('#menu');
  const links = [...menu.querySelectorAll('a')];

  const definirAberto = (aberto) => {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };
  botao.addEventListener('click', () => definirAberto(!menu.classList.contains('aberto')));
  links.forEach((a) => a.addEventListener('click', () => definirAberto(false)));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && menu.classList.contains('aberto')) {
      definirAberto(false);
      botao.focus();
    }
  });
  document.addEventListener('click', (ev) => {
    if (menu.classList.contains('aberto') && !ev.target.closest('.nav')) definirAberto(false);
  });

  // Borda do menu depois de rolar + destaque da seção atual:
  // a seção ativa é a última cujo topo já passou de 40% da altura da tela.
  const secoes = links
    .map((a) => [a, document.getElementById(a.getAttribute('href').slice(1))])
    .filter(([, s]) => s);
  let agendado = false;
  const atualizar = () => {
    agendado = false;
    topo.classList.toggle('rolou', window.scrollY > 8);
    const linha = window.innerHeight * 0.4;
    let ativo = secoes[0]?.[0];
    for (const [a, s] of secoes) if (s.getBoundingClientRect().top <= linha) ativo = a;
    // No fim da página, o último item fica ativo mesmo que a seção seja curta.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) ativo = secoes.at(-1)?.[0];
    links.forEach((a) => a.classList.toggle('ativo', a === ativo));
  };
  const aoRolar = () => {
    if (!agendado) {
      agendado = true;
      requestAnimationFrame(atualizar);
    }
  };
  window.addEventListener('scroll', aoRolar, { passive: true });
  window.addEventListener('resize', aoRolar);
  atualizar();
}

function ligarProjetos() {
  iniciarDetalhe();
  $('#projetos .grade').addEventListener('click', (ev) => {
    const botao = ev.target.closest('[data-projeto-id]');
    if (!botao) return;
    const projeto = conteudo.projetos.find((p) => p.id === botao.dataset.projetoId);
    if (projeto) abrirDetalhe(projeto);
  });
  // Link compartilhável: site.com/#notas abre direto o detalhe.
  const doHash = conteudo.projetos.find((p) => p.id === decodeURIComponent(location.hash.slice(1)));
  if (doHash) abrirDetalhe(doHash, { daUrl: true });
}

renderizar();
animarEntrada();
ligarMenu();
ligarProjetos();
iniciarVitrine($('#projetos'));
