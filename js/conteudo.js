// ============================================================
//  CONTEÚDO DO SITE: este é o único arquivo que você precisa editar.
//  Procure por "[COMPLETAR" e troque pelos seus dados.
//  Campos que continuarem com [COMPLETAR] simplesmente não aparecem no site
//  (botões e links sem endereço ficam escondidos).
// ============================================================

export const conteudo = {
  // O título da aba é montado a partir do nome e do cargo. A prévia do link
  // (LinkedIn/WhatsApp) é configurada no index.html — veja o README, seção "Publicar".
  pessoa: {
    nome: "Eduarda Ramos",
    cargo: "Desenvolvedora", // aparece no título da aba: "Eduarda Ramos · Desenvolvedora"
    titulo: "Tecnologia, dados e automação.",
    subtitulo: "Estudante de Análise e Desenvolvimento de Sistemas",
    frase:
      "Estudante de Análise e Desenvolvimento de Sistemas, com experiência em suporte de TI, monitoramento e desenvolvimento de soluções para automatização de processos.",
    foto: "", // ex.: "assets/foto.jpg" (vazio mostra as iniciais)
    tecnologias: ["Python", "SQL", "JavaScript", "Power BI", "FastAPI", "Automação", "Ciência de Dados"],
  },

  // Para adicionar um projeto sem demonstração, use demo: null.
  // icone: "impressora" | "documento" | "email" | "caixa"
  // github: link do repositório (vazio = o botão não aparece)
  // imagem: usada só quando o projeto não tem demo (as demos aparecem ao vivo na vitrine)
  projetos: [
    {
      id: "impressoras",
      titulo: "Monitoramento de Impressoras",
      icone: "impressora",
      demo: "impressoras",
      imagem: "assets/projetos/impressoras.webp",
      github: "",
      resumo: "Painel que acompanha o status e o toner de cada impressora e gera alertas automáticos.",
      objetivo: "Monitorar automaticamente o parque de impressoras e avisar sobre falhas e suprimentos antes que virem problema.",
      problema: "Descobrir que uma impressora estava sem toner ou fora da rede só quando alguém reclamava.",
      comoFeito: [
        "Coletor independente que varre cada impressora via SNMP a cada poucos minutos, mesmo sem ninguém com a tela aberta",
        "Cliente SNMP escrito do zero, sem bibliotecas externas",
        "Alertas que abrem e fecham sozinhos, separando 'sem resposta' de 'falha de SNMP'",
        "API em FastAPI e interface web lendo o mesmo banco SQLite",
      ],
      tecnologias: ["Python", "FastAPI", "SQLite", "SNMP"],
    },
    {
      id: "notas",
      titulo: "Monitoramento de Notas",
      icone: "documento",
      demo: "notas",
      imagem: "assets/projetos/notas.webp",
      github: "",
      resumo: "Acompanha cada pedido de equipamento da entrada até a conclusão.",
      objetivo: "Acompanhar cada pedido de equipamento por etapas, da entrada até a conclusão, sem perder nenhum de vista.",
      problema: "Pedidos parados por semanas sem ninguém perceber, espalhados em planilhas e e-mails.",
      comoFeito: [
        "Fluxo por etapas: entrada, saída, solicitação e concluído",
        "Busca em todas as telas e dashboard com os números do dia",
        "E-mail diário automático com os pedidos parados há mais de 15 dias",
        "Acesso restrito com login de administrador",
      ],
      tecnologias: ["Python", "FastAPI", "Jinja2", "SQLite"],
    },
    {
      id: "emails",
      titulo: "Automação de E-mails",
      icone: "email",
      demo: "emails",
      imagem: "assets/projetos/emails.webp",
      github: "",
      resumo: "Monta e prepara e-mails para várias filiais com um clique.",
      objetivo: "Padronizar e agilizar o envio de e-mails recorrentes para várias filiais.",
      problema: "Escrever o mesmo e-mail várias vezes, trocando destinatários e dados à mão.",
      comoFeito: [
        "Configuração central com destinatários e cópias de cada filial",
        "Geração do e-mail direto no Outlook, revisado antes do envio",
        "Proteções para nunca disparar e-mail real durante testes",
      ],
      tecnologias: ["Python", "Outlook (win32com)", "JSON"],
    },
    {
      id: "estoque",
      titulo: "Controle de Estoque",
      icone: "caixa",
      demo: "estoque",
      imagem: "assets/projetos/estoque.webp",
      github: "",
      resumo: "Mostra na hora o que está acabando no estoque.",
      objetivo: "Dar visibilidade imediata aos itens que precisam de reposição.",
      problema: "Itens acabando sem aviso porque o controle vivia em planilhas soltas.",
      comoFeito: [
        "Leitura e consolidação das planilhas de estoque",
        "Regra de estoque mínimo por item com destaque do que precisa reposição",
      ],
      tecnologias: ["Python", "Excel"],
    },
  ],

  sobre: {
    paragrafos: [
      "Tenho 20 anos e sou estudante de Análise e Desenvolvimento de Sistemas. Meu interesse por tecnologia vem desde cedo e, em 2023, logo após concluir o ensino médio, iniciei um curso de informática que definiu minha trajetória profissional.",
      "Em poucos meses, passei de aluna a monitora e, em seguida, a instrutora de informática. Nesse período, ampliei minha formação com cursos de programação, Power BI, AutoCAD e gestão empresarial, além de desenvolver a habilidade de explicar tecnologia de forma clara para diferentes públicos.",
      "Atualmente, atuo em uma empresa de TI com suporte e monitoramento de ambientes tecnológicos e desenvolvo sistemas internos para automatizar processos. Meu interesse está em desenvolvimento, automação e dados, área que venho aprofundando com estudos em Ciência de Dados.",
    ],
    // Linha do tempo: do mais antigo para o mais recente.
    linhaDoTempo: [
      { quando: "2023", titulo: "Curso de informática", detalhe: "Concluí o ensino médio e iniciei o curso que definiu minha trajetória." },
      { quando: "Meses depois", titulo: "Monitora de informática", detalhe: "Passei a atuar como monitora no mesmo lugar onde estudava." },
      { quando: "Em seguida", titulo: "Instrutora de informática", detalhe: "Ensino de informática e cursos de programação, Power BI, AutoCAD e gestão empresarial." },
      { quando: "Hoje", titulo: "TI, monitoramento e automação", detalhe: "Suporte, monitoramento de ambientes e desenvolvimento de sistemas internos em uma empresa de TI." },
      { quando: "Hoje", titulo: "Graduação e Ciência de Dados", detalhe: "Cursando Análise e Desenvolvimento de Sistemas e começando em Ciência de Dados." },
    ],
    formacao: [
      { titulo: "Análise e Desenvolvimento de Sistemas", status: "Cursando", detalhe: "[COMPLETAR: instituição · semestre]" },
      { titulo: "Cursos livres", status: "Concluídos", detalhe: "Programação, Power BI, AutoCAD e gestão empresarial" },
      { titulo: "Ciência de Dados", status: "Começando", detalhe: "[COMPLETAR: o que está estudando agora]" },
    ],
  },

  contato: {
    chamada: "Estou aberta a oportunidades profissionais e a projetos em desenvolvimento, automação e dados.",
    // Links: pode colar com ou sem https:// (ex.: "linkedin.com/in/seu-perfil").
    linkedin: "https://www.linkedin.com/in/eduarda-ramos-4bb7242b2",
    github: "[COMPLETAR: https://github.com/...]",
    email: "[COMPLETAR: seu@email.com]",
    instagram: "[COMPLETAR: https://www.instagram.com/...]",
    // Número com DDI e DDD, só dígitos ou com espaços: ex. "55 11 98888-7777"
    whatsapp: { numero: "55 21 97461-4350", mensagem: "Oi! Vi seu portfólio e queria conversar." },
  },
};
