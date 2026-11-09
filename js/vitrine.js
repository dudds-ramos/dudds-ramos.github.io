import { demos } from './demos/registro.js';

// Monta as demos interativas da vitrine de projetos quando chegam perto da tela
// e desmonta quando ficam longe, para não deixar timers rodando à toa.
// Usa o mesmo contrato das demos: montar(palco, { reduzirMovimento }) → desmontar().
export function iniciarVitrine(raiz = document) {
  const palcos = [...raiz.querySelectorAll('[data-vitrine]')];
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const estado = new Map();

  async function montar(palco) {
    if (estado.get(palco)?.ativo) return;
    const registro = { ativo: true, desmontar: null };
    estado.set(palco, registro);
    try {
      const carregar = demos[palco.dataset.vitrine];
      if (!carregar) throw new Error('demo desconhecida');
      const modulo = await carregar();
      if (!registro.ativo) return; // saiu da tela enquanto carregava
      palco.innerHTML = '';
      registro.desmontar = modulo.montar(palco, { reduzirMovimento });
      palco.style.minHeight = '';
    } catch {
      if (registro.ativo) palco.innerHTML = '<p class="demo-embreve">Demo em breve.</p>';
    }
  }

  function desmontar(palco) {
    const registro = estado.get(palco);
    if (!registro?.ativo) return;
    registro.ativo = false;
    if (registro.desmontar) {
      palco.style.minHeight = `${palco.offsetHeight}px`; // evita a página "pular"
      registro.desmontar();
      registro.desmontar = null;
    }
  }

  if (!('IntersectionObserver' in window)) {
    palcos.forEach(montar);
    return;
  }
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) (e.isIntersecting ? montar : desmontar)(e.target);
    },
    { rootMargin: '400px 0px' },
  );
  palcos.forEach((p) => obs.observe(p));
}
