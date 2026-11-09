// Simulação pura da automação de e-mails (filiais e pessoas fictícias).
export const FILIAIS = [
  { id: 'aurora', nome: 'Filial Aurora', responsavel: 'Carla Mendes', email: 'carla.mendes@exemplo.com', cc: ['coordenacao.aurora@exemplo.com'] },
  { id: 'horizonte', nome: 'Filial Horizonte', responsavel: 'Rafael Lima', email: 'rafael.lima@exemplo.com', cc: ['coordenacao.horizonte@exemplo.com'] },
  { id: 'porto-novo', nome: 'Filial Porto Novo', responsavel: 'Juliana Rocha', email: 'juliana.rocha@exemplo.com', cc: ['coordenacao.portonovo@exemplo.com', 'suporte@exemplo.com'] },
  { id: 'serra-azul', nome: 'Filial Serra Azul', responsavel: 'Bruno Teixeira', email: 'bruno.teixeira@exemplo.com', cc: ['coordenacao.serraazul@exemplo.com'] },
  { id: 'vale-verde', nome: 'Filial Vale Verde', responsavel: 'Marina Costa', email: 'marina.costa@exemplo.com', cc: ['coordenacao.valeverde@exemplo.com', 'suporte@exemplo.com'] },
];

export const MODELOS = [
  { id: 'lembrete', nome: 'Lembrete de pendências' },
  { id: 'relatorio', nome: 'Relatório semanal' },
];

const data = (d) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

export function montarEmail(filialId, modeloId, hoje) {
  const filial = FILIAIS.find((f) => f.id === filialId);
  if (!filial || !MODELOS.some((m) => m.id === modeloId)) return null;
  const primeiroNome = filial.responsavel.split(' ')[0];
  const dia = data(hoje);

  if (modeloId === 'lembrete') {
    return {
      para: filial.email,
      cc: filial.cc,
      assunto: `Lembrete: pendências da ${filial.nome} — ${dia}`,
      corpo:
        `Olá, ${primeiroNome},\n\n` +
        `Passando para lembrar que a ${filial.nome} tem pendências em aberto no sistema.\n` +
        `Quando puder, confira a lista e atualize o status de cada item.\n\n` +
        `Qualquer dúvida, é só responder este e-mail.\n\nObrigado!`,
    };
  }
  return {
    para: filial.email,
    cc: filial.cc,
    assunto: `Relatório semanal — ${filial.nome} — ${dia}`,
    corpo:
      `Olá, ${primeiroNome},\n\n` +
      `Segue o resumo semanal da ${filial.nome}, gerado automaticamente em ${dia}.\n` +
      `Os números completos estão no painel.\n\n` +
      `Bom trabalho e até a próxima semana!`,
  };
}
