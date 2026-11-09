// Simulação pura do monitoramento de pedidos (dados fictícios).
export const FILIAIS = ['Filial Aurora', 'Filial Horizonte', 'Filial Porto Novo', 'Filial Serra Azul', 'Filial Vale Verde'];
export const TIPOS = ['Remanejamento', 'Devolução', 'Manutenção'];
export const ETAPAS = ['entrada', 'saida', 'solicitacao', 'concluido'];

const DIA = 86400000;
const escolher = (rng, lista) => lista[Math.floor(rng() * lista.length)];

export function gerarPedidos(rng, hoje, n = 18) {
  return Array.from({ length: n }, (_, i) => {
    const garantirParado = i < 3;
    const etapa = garantirParado ? escolher(rng, ETAPAS.slice(0, 3)) : escolher(rng, ETAPAS);
    const dias = garantirParado ? 16 + Math.floor(rng() * 25) : Math.floor(rng() * 41);
    return {
      id: `PED-${1001 + i}`,
      filial: escolher(rng, FILIAIS),
      tipo: escolher(rng, TIPOS),
      etapa,
      desde: new Date(hoje.getTime() - dias * DIA),
    };
  });
}

export function diasParado(pedido, hoje) {
  return Math.floor((hoje.getTime() - pedido.desde.getTime()) / DIA);
}

export function estaParado(pedido, hoje) {
  return pedido.etapa !== 'concluido' && diasParado(pedido, hoje) > 15;
}

const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function filtrar(pedidos, { etapa, busca }) {
  const termo = normalizar((busca ?? '').trim());
  return pedidos.filter(
    (p) => p.etapa === etapa && (!termo || normalizar(`${p.id} ${p.filial} ${p.tipo}`).includes(termo)),
  );
}

export function avancarEtapa(pedido, hoje) {
  const i = ETAPAS.indexOf(pedido.etapa);
  if (i < 0 || i === ETAPAS.length - 1) return pedido;
  return { ...pedido, etapa: ETAPAS[i + 1], desde: new Date(hoje.getTime()) };
}
