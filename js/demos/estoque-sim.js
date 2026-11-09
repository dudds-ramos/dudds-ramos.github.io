// Simulação pura do controle de estoque (itens fictícios).
export const ITENS_INICIAIS = Object.freeze([
  { id: 'toner-preto', nome: 'Toner preto', quantidade: 3, minimo: 6 },
  { id: 'toner-colorido', nome: 'Toner colorido', quantidade: 8, minimo: 4 },
  { id: 'cabo-rede', nome: 'Cabo de rede', quantidade: 25, minimo: 10 },
  { id: 'mouse', nome: 'Mouse', quantidade: 12, minimo: 5 },
  { id: 'teclado', nome: 'Teclado', quantidade: 2, minimo: 4 },
  { id: 'fonte-notebook', nome: 'Fonte de notebook', quantidade: 6, minimo: 3 },
  { id: 'papel-a4', nome: 'Papel A4 (caixa)', quantidade: 9, minimo: 8 },
  { id: 'cilindro', nome: 'Cilindro de imagem', quantidade: 1, minimo: 2 },
].map(Object.freeze));

export function movimentar(itens, id, delta) {
  if (!itens.some((i) => i.id === id)) return itens;
  return itens.map((i) => (i.id === id ? { ...i, quantidade: Math.max(0, i.quantidade + delta) } : i));
}

export function abaixoDoMinimo(item) {
  return item.quantidade < item.minimo;
}

export function resumo(itens) {
  return { total: itens.length, abaixo: itens.filter(abaixoDoMinimo).length };
}
