import { conteudo } from './conteudo.js';
import { renderHero, renderProjetos, renderSobre, renderContato, tituloPagina } from './render.js';
import { abrirDetalhe, iniciarDetalhe } from './detalhe.js';

const $ = (sel) => document.querySelector(sel);

function renderizar() {
  $('#hero').innerHTML = renderHero(conteudo.pessoa);
  $('#projetos .grade').innerHTML = renderProjetos(conteudo.projetos);
  $('#sobre').innerHTML = renderSobre(conteudo.sobre, conteudo.pessoa);
  $('#contato').innerHTML = renderContato(conteudo.contato);
  document.title = tituloPagina(conteudo.pessoa);
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
    { threshold: 0.12 },
  );
  elementos.forEach((el) => obs.observe(el));
}

function ligarProjetos() {
  iniciarDetalhe();
  $('#projetos .grade').addEventListener('click', (ev) => {
    const card = ev.target.closest('[data-projeto-id]');
    if (!card) return;
    const projeto = conteudo.projetos.find((p) => p.id === card.dataset.projetoId);
    if (projeto) abrirDetalhe(projeto);
  });
  // Link compartilhável: site.com/#notas abre direto o detalhe.
  const doHash = conteudo.projetos.find((p) => p.id === decodeURIComponent(location.hash.slice(1)));
  if (doHash) abrirDetalhe(doHash, { daUrl: true });
}

renderizar();
animarEntrada();
ligarProjetos();
