// Mapa id da demo → carregamento sob demanda do módulo.
// Contrato: cada módulo exporta montar(palco, { reduzirMovimento }) → desmontar()
export const demos = {
  impressoras: () => import('./impressoras.js'),
  notas: () => import('./notas.js'),
  emails: () => import('./emails.js'),
  estoque: () => import('./estoque.js'),
};
