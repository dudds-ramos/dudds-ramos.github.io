import { ITENS_INICIAIS, movimentar, abaixoDoMinimo, resumo } from './estoque-sim.js';
import { escapeHtml } from '../util.js';

export function montar(palco) {
  let itens = ITENS_INICIAIS;

  palco.innerHTML = `
    <div class="est">
      <div class="est-topo">
        <p class="est-resumo"></p>
        <button type="button" class="demo-btn" data-acao="restaurar">Restaurar</button>
      </div>
      <div class="est-cabecalho" aria-hidden="true"><span>Item</span><span>Qtd.</span><span>Mín.</span><span></span></div>
      <ul class="est-lista"></ul>
    </div>`;
  const $ = (s) => palco.querySelector(s);

  function desenhar() {
    const r = resumo(itens);
    $('.est-resumo').innerHTML = `${r.total} itens · <b class="${r.abaixo ? 'ruim' : 'bom'}">${r.abaixo} abaixo do mínimo</b>`;
    $('.est-lista').innerHTML = itens
      .map((i) => {
        const baixo = abaixoDoMinimo(i);
        return `
      <li class="est-item ${baixo ? 'baixo' : ''}">
        <span class="est-nome">${escapeHtml(i.nome)}${baixo ? '<em class="est-selo">Repor</em>' : ''}</span>
        <span class="est-qtd"><small>Qtd.</small>${i.quantidade}</span>
        <span class="est-min"><small>Mín.</small>${i.minimo}</span>
        <span class="est-botoes">
          <button type="button" class="demo-btn" data-id="${i.id}" data-delta="-1" aria-label="Dar baixa de 1 em ${escapeHtml(i.nome)}">−1</button>
          <button type="button" class="demo-btn" data-id="${i.id}" data-delta="5" aria-label="Dar entrada de 5 em ${escapeHtml(i.nome)}">+5</button>
        </span>
      </li>`;
      })
      .join('');
  }

  const aoClicar = (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.acao === 'restaurar') itens = ITENS_INICIAIS;
    else if (b.dataset.id) itens = movimentar(itens, b.dataset.id, Number(b.dataset.delta));
    else return;
    desenhar();
  };
  palco.addEventListener('click', aoClicar);
  desenhar();

  return () => {
    palco.removeEventListener('click', aoClicar);
    palco.innerHTML = '';
  };
}
