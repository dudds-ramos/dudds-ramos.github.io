import { renderDetalhe } from './render.js';
import { demos } from './demos/registro.js';

const dialogo = () => document.getElementById('detalhe');

let desmontar = null;
let aberturaAtual = 0; // invalida demos que terminam de carregar depois do fechamento
let elementoAnterior = null;

function reduzirMovimento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function montarDemo(projeto, minhaAbertura) {
  const palco = dialogo().querySelector('.demo-palco');
  if (!palco || !projeto.demo) return;
  try {
    const carregar = demos[projeto.demo];
    if (!carregar) throw new Error('demo desconhecida');
    const modulo = await carregar();
    if (minhaAbertura !== aberturaAtual) return; // já fechou
    desmontar = modulo.montar(palco, { reduzirMovimento: reduzirMovimento() });
  } catch {
    if (minhaAbertura === aberturaAtual) palco.innerHTML = '<p class="demo-embreve">Demo em breve.</p>';
  }
}

function limpar() {
  aberturaAtual++;
  if (desmontar) {
    desmontar();
    desmontar = null;
  }
  const d = dialogo();
  if (d.open) d.close();
  d.innerHTML = '';
  document.body.style.overflow = '';
  elementoAnterior?.focus?.({ preventScroll: true });
  elementoAnterior = null;
}

export async function abrirDetalhe(projeto, { daUrl = false } = {}) {
  if (dialogo().open) limpar();
  const minhaAbertura = ++aberturaAtual;
  elementoAnterior = document.activeElement;

  const d = dialogo();
  d.innerHTML = `
    <div class="detalhe-conteudo">
      <button type="button" class="detalhe-fechar" aria-label="Fechar">✕</button>
      ${renderDetalhe(projeto)}
    </div>`;
  d.showModal();
  d.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  // Garante que "voltar" fecha o detalhe em vez de sair do site.
  if (daUrl) history.replaceState(null, '', location.pathname + location.search);
  history.pushState({ detalhe: projeto.id }, '', '#' + projeto.id);

  await montarDemo(projeto, minhaAbertura);
}

export function fecharDetalhe() {
  if (!dialogo().open) return;
  limpar();
  if (history.state?.detalhe) history.back();
}

export function iniciarDetalhe() {
  const d = dialogo();
  d.addEventListener('click', (ev) => {
    if (ev.target === d || ev.target.closest('.detalhe-fechar')) fecharDetalhe();
  });
  d.addEventListener('cancel', (ev) => {
    ev.preventDefault();
    fecharDetalhe();
  });
  window.addEventListener('popstate', () => {
    if (d.open) limpar();
  });
}
