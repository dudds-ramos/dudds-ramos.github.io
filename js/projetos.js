import { renderAbas, renderPainelProjeto } from './render.js';
import { demos } from './demos/registro.js';

// Seção de projetos: abas + um painel único com a demo ao vivo do projeto escolhido.
// A demo só roda enquanto o painel está perto da tela (economiza bateria no celular).
export function iniciarProjetos(secao, projetos, idInicial) {
  const lista = secao.querySelector('.abas');
  const painel = secao.querySelector('#painel-projeto');
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ativo = projetos.some((p) => p.id === idInicial) ? idInicial : projetos[0].id;
  let desmontar = null;
  let versao = 0; // invalida carregamentos que terminam depois de trocar de aba
  let visivel = !('IntersectionObserver' in window);

  async function montar() {
    const area = painel.querySelector('[data-vitrine]');
    if (!area || desmontar) return;
    const minha = ++versao;
    try {
      const carregar = demos[area.dataset.vitrine];
      if (!carregar) throw new Error('demo desconhecida');
      const modulo = await carregar();
      if (minha !== versao) return;
      area.innerHTML = '';
      desmontar = modulo.montar(area, { reduzirMovimento });
    } catch {
      if (minha === versao) area.innerHTML = '<p class="demo-embreve">Demo em breve.</p>';
    }
  }

  function parar() {
    versao++;
    if (desmontar) {
      desmontar();
      desmontar = null;
    }
  }

  function desenhar() {
    parar();
    const projeto = projetos.find((p) => p.id === ativo);
    lista.innerHTML = renderAbas(projetos, ativo);
    painel.setAttribute('aria-labelledby', `aba-${ativo}`);
    painel.innerHTML = renderPainelProjeto(projeto);
    if (visivel) montar();
  }

  function selecionar(id, focar = false) {
    if (id !== ativo) {
      ativo = id;
      desenhar();
    }
    if (focar) lista.querySelector(`[data-aba="${CSS.escape(id)}"]`)?.focus();
  }

  lista.addEventListener('click', (ev) => {
    const aba = ev.target.closest('[data-aba]');
    if (aba) selecionar(aba.dataset.aba);
  });
  lista.addEventListener('keydown', (ev) => {
    const i = projetos.findIndex((p) => p.id === ativo);
    const destino = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: projetos.length - 1 }[ev.key];
    if (destino === undefined) return;
    ev.preventDefault();
    const n = projetos.length;
    selecionar(projetos[(destino + n) % n].id, true);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel) montar();
        else parar();
      },
      { rootMargin: '300px 0px' },
    ).observe(painel);
  }

  desenhar();
  return { selecionar };
}
