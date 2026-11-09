import { gerarPedidos, diasParado, estaParado, filtrar, avancarEtapa, ETAPAS } from './notas-sim.js';
import { criarRng } from '../rng.js';
import { escapeHtml } from '../util.js';

const ROTULO = { entrada: 'Entrada', saida: 'Saída', solicitacao: 'Solicitação', concluido: 'Concluídos' };
const PROXIMA = { entrada: 'Enviar para saída', saida: 'Pedir solicitação', solicitacao: 'Concluir' };

export function montar(palco) {
  const hoje = new Date();
  let pedidos = gerarPedidos(criarRng(Date.now()), hoje);
  let etapa = 'entrada';
  let busca = '';

  palco.innerHTML = `
    <div class="notas">
      <div class="notas-alerta"></div>
      <div class="notas-abas" role="tablist"></div>
      <input class="notas-busca" type="search" placeholder="Buscar por pedido, filial ou tipo…" aria-label="Buscar pedidos">
      <ul class="notas-lista"></ul>
    </div>`;
  const $ = (s) => palco.querySelector(s);

  function desenhar() {
    const parados = pedidos.filter((p) => estaParado(p, hoje)).length;
    $('.notas-alerta').innerHTML = `<b>${parados}</b> pedido${parados === 1 ? '' : 's'} parado${parados === 1 ? '' : 's'} há mais de 15 dias`;
    $('.notas-alerta').classList.toggle('zerado', parados === 0);

    $('.notas-abas').innerHTML = ETAPAS.map((e) => {
      const n = pedidos.filter((p) => p.etapa === e).length;
      return `<button type="button" role="tab" aria-selected="${e === etapa}" class="notas-aba" data-etapa="${e}">${ROTULO[e]} <span>${n}</span></button>`;
    }).join('');

    const lista = filtrar(pedidos, { etapa, busca }).sort((a, b) => a.desde - b.desde);
    $('.notas-lista').innerHTML = lista.length
      ? lista
          .map((p) => {
            const dias = diasParado(p, hoje);
            const parado = estaParado(p, hoje);
            return `
        <li class="nota ${parado ? 'parada' : ''}">
          <div class="nota-info">
            <strong>${escapeHtml(p.id)}</strong>
            <span>${escapeHtml(p.filial)} · ${escapeHtml(p.tipo)}</span>
            ${parado ? `<em class="nota-selo">Parado há ${dias} dias</em>` : `<small>há ${dias} dia${dias === 1 ? '' : 's'}</small>`}
          </div>
          ${PROXIMA[p.etapa] ? `<button type="button" class="demo-btn" data-avancar="${escapeHtml(p.id)}">${PROXIMA[p.etapa]}</button>` : ''}
        </li>`;
          })
          .join('')
      : '<li class="nota-vazia">Nenhum pedido encontrado.</li>';
  }

  const aoClicar = (ev) => {
    const aba = ev.target.closest('[data-etapa]');
    if (aba) {
      etapa = aba.dataset.etapa;
      desenhar();
      return;
    }
    const id = ev.target.closest('[data-avancar]')?.dataset.avancar;
    if (id) {
      pedidos = pedidos.map((p) => (p.id === id ? avancarEtapa(p, hoje) : p));
      desenhar();
    }
  };
  const aoBuscar = (ev) => {
    busca = ev.target.value;
    desenhar();
  };
  palco.addEventListener('click', aoClicar);
  $('.notas-busca').addEventListener('input', aoBuscar);

  desenhar();

  return () => {
    palco.removeEventListener('click', aoClicar);
    palco.innerHTML = '';
  };
}
