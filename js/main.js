import { conteudo } from './conteudo.js';
import { renderHero, renderProjetos, renderSobre, renderContato, tituloPagina, renderLogo } from './render.js';
import { abrirDetalhe, iniciarDetalhe } from './detalhe.js';
import { estaPreenchido } from './util.js';

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

  // Borda do menu aparece depois de rolar.
  const aoRolar = () => topo.classList.toggle('rolou', window.scrollY > 8);
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // Destaca a seção visível no menu.
  if ('IntersectionObserver' in window) {
    const porId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          links.forEach((a) => a.classList.remove('ativo'));
          porId.get(e.target.id)?.classList.add('ativo');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    porId.forEach((_, id) => {
      const secao = document.getElementById(id);
      if (secao) obs.observe(secao);
    });
  }
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
