import { criarParque, avancar, alertasAbertos } from './impressoras-sim.js';
import { criarRng } from '../rng.js';
import { escapeHtml } from '../util.js';

const ROTULO = { online: 'Online', 'sem-resposta': 'Sem resposta', 'falha-snmp': 'Falha SNMP' };
const hora = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });

export function montar(palco, { reduzirMovimento }) {
  const rng = criarRng(Date.now());
  let parque = criarParque(rng);
  let log = [];
  let passos = 0;

  palco.innerHTML = `
    <div class="imp">
      <div class="imp-resumo"></div>
      <div class="imp-grade"></div>
      <div class="imp-acoes">
        ${reduzirMovimento ? '<button type="button" class="demo-btn" data-acao="avancar">Avançar</button>' : '<span class="imp-ao-vivo"><i></i>Ao vivo</span>'}
        <button type="button" class="demo-btn" data-acao="derrubar">Derrubar uma impressora</button>
      </div>
      <ol class="imp-log" aria-live="polite"></ol>
    </div>`;
  const $ = (s) => palco.querySelector(s);

  function registrar(eventos) {
    log = [...eventos.map((e) => `${hora()} · ${e}`).reverse(), ...log].slice(0, 6);
  }

  function desenhar() {
    const online = parque.filter((p) => p.status === 'online').length;
    const tonerBaixo = parque.filter((p) => p.alertas.some((a) => a.tipo === 'toner-baixo' && a.aberto)).length;
    $('.imp-resumo').innerHTML = `
      <div><b>${online}/${parque.length}</b><span>Online</span></div>
      <div><b>${alertasAbertos(parque)}</b><span>Alertas abertos</span></div>
      <div><b>${tonerBaixo}</b><span>Toner baixo</span></div>`;
    $('.imp-grade').innerHTML = parque
      .map(
        (p) => `
      <div class="imp-card ${p.status}">
        <div class="imp-topo"><span class="imp-bola" title="${ROTULO[p.status]}"></span><strong>${escapeHtml(p.nome)}</strong></div>
        <span class="imp-local">${escapeHtml(p.local)}</span>
        <div class="imp-barra ${p.toner <= 10 ? 'baixo' : ''}" role="img" aria-label="Toner ${p.toner}%"><i style="width:${p.toner}%"></i></div>
        <span class="imp-status">${ROTULO[p.status]} · ${p.toner}%</span>
      </div>`,
      )
      .join('');
    $('.imp-log').innerHTML = log.length
      ? log.map((l) => `<li>${escapeHtml(l)}</li>`).join('')
      : '<li class="vazio">Aguardando eventos…</li>';
    palco.dataset.passos = String(passos);
  }

  function passo() {
    const r = avancar(parque, rng);
    parque = r.parque;
    passos++;
    registrar(r.eventos);
    desenhar();
  }

  function derrubar() {
    const i = parque.findIndex((p) => p.status === 'online');
    if (i < 0) return;
    parque = parque.map((p, j) =>
      j === i
        ? { ...p, status: 'sem-resposta', alertas: [...p.alertas.filter((a) => a.tipo !== 'offline'), { tipo: 'offline', aberto: true }] }
        : p,
    );
    registrar([`${parque[i].nome} parou de responder`]);
    desenhar();
  }

  const aoClicar = (ev) => {
    const acao = ev.target.closest('[data-acao]')?.dataset.acao;
    if (acao === 'avancar') passo();
    if (acao === 'derrubar') derrubar();
  };
  palco.addEventListener('click', aoClicar);

  desenhar();
  const timer = reduzirMovimento ? null : setInterval(passo, 1500);

  return () => {
    if (timer) clearInterval(timer);
    palco.removeEventListener('click', aoClicar);
    palco.innerHTML = '';
  };
}
