// ============================================================
//  CONTEÚDO DO SITE: este é o único arquivo que você precisa editar.
//  Procure por "[COMPLETAR" e troque pelos seus dados.
//  Campos que continuarem com [COMPLETAR] simplesmente não aparecem no site.
// ============================================================

export const conteudo = {
  // O título da aba é montado a partir do nome. A prévia do link (LinkedIn/WhatsApp)
  // é configurada no index.html — veja o README, seção "Publicar".
  pessoa: {
    nome: "Eduarda Ramos",
    cargo: "Desenvolvedora", // aparece no título da aba: "Eduarda Ramos · Desenvolvedora"
    foto: "", // ex.: "assets/foto.jpg" (vazio mostra as iniciais)
    frase: "Estudante de ADS · crio sistemas que automatizam o dia a dia",
    tecnologias: ["Python", "FastAPI", "SQL", "JavaScript", "Power BI", "Automação", "Ciência de Dados"],
  },

  // Para adicionar um projeto sem demonstração, use demo: null.
  projetos: [
    {
      id: "impressoras",
      titulo: "Monitor de Impressoras",
      demo: "impressoras",
      resumo: "Painel que vigia dezenas de impressoras sozinho e avisa antes de dar problema.",
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
      demo: "notas",
      resumo: "Acompanha cada pedido de equipamento da entrada até a conclusão.",
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
      demo: "emails",
      resumo: "Monta e prepara e-mails para várias filiais com um clique.",
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
      demo: "estoque",
      resumo: "Mostra na hora o que está acabando no estoque.",
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
      "Terminei a escola em 2023 sem saber muito bem que caminho seguir. Mas a tecnologia sempre esteve por perto: cresci jogando, curiosa com tudo, e era eu quem ajudava meus pais sempre que algo no computador ou no celular dava problema.",
      "Para eu não ficar parada, meus pais me matricularam em um curso de informática, e foi ali que me apaixonei de vez. Comecei a estudar e, poucos meses depois, já trabalhava no mesmo lugar como monitora. Continuei aprendendo até me tornar instrutora de informática, passando por cursos de programação, Power BI, AutoCAD, gestão empresarial e muito mais.",
      "Hoje desenvolvo sistemas internos em uma empresa de TI onde atuo. Não importa a área: o que me move é fazer a tecnologia trabalhar a nosso favor, seja para automatizar processos demorados, seja para aprender aquilo que ainda não sabemos.",
    ],
    formacao: [
      { titulo: "Análise e Desenvolvimento de Sistemas", status: "Cursando", detalhe: "[COMPLETAR: instituição · semestre]" },
      { titulo: "Instrutora de informática", status: "Experiência", detalhe: "De aluna a monitora e depois instrutora, ensinando e aprendendo todos os dias" },
      { titulo: "Cursos livres", status: "Concluídos", detalhe: "Programação, Power BI, AutoCAD e gestão empresarial" },
      { titulo: "Ciência de Dados", status: "Começando", detalhe: "[COMPLETAR: o que está estudando agora]" },
    ],
  },

  contato: {
    // Número com DDI e DDD, só dígitos ou com espaços: ex. "55 11 98888-7777"
    whatsapp: { numero: "[COMPLETAR: 55DDDNUMERO]", mensagem: "Oi! Vi seu portfólio e queria conversar." },
    // Links: pode colar com ou sem https:// (ex.: "linkedin.com/in/seu-perfil").
    linkedin: "[COMPLETAR: https://www.linkedin.com/in/...]",
    instagram: "[COMPLETAR: https://www.instagram.com/...]",
  },
};
