import { escapeHtml, estaPreenchido, linkWhatsApp, iniciais, urlExterna, emailValido } from './util.js';

// Remove marcadores "[COMPLETAR: ...]" e devolve o texto que sobrar (ou '').
function limpar(texto) {
  return String(texto ?? '').replace(/\[COMPLETAR[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
}

const nomeExibido = (nome) => (estaPreenchido(nome) ? nome : 'Seu Nome');
const tags = (lista) => lista.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
const numero = (i) => String(i + 1).padStart(2, '0');

// Ícones em traço (24x24), herdam a cor do texto.
const svg = (corpo) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${corpo}</svg>`;

const ICONES = {
  impressora: svg('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/><path d="M17 12h.01"/>'),
  documento: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'),
  email: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  caixa: svg('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
  seta: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  externo: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  github: svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
  linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'),
  instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
  whatsapp: svg('<path d="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z"/>'),
};

const projetoIcone = (nome) => ICONES[nome] ?? ICONES.documento;

// Esquema decorativo da abertura: o caminho dos dados nos sistemas que ela constrói
// (coleta → banco → API → painel, com alertas automáticos). Sem números inventados.
const NO = (x, y, w, rotulo, destaque = false) => `
  <g class="no${destaque ? ' no-destaque' : ''}">
    <rect x="${x}" y="${y}" width="${w}" height="36" rx="8"/>
    <text x="${x + 14}" y="${y + 23}">${rotulo}</text>
  </g>`;
const DIAGRAMA = `
<svg class="diagrama" viewBox="0 0 520 560" role="presentation" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="pontos" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1"/></pattern>
  </defs>
  <rect class="grade-pontos" width="520" height="560" fill="url(#pontos)"/>
  <g class="ligacoes">
    <path d="M140 108 C 180 108, 180 200, 210 200"/>
    <path d="M140 200 L 210 200"/>
    <path d="M140 292 C 180 292, 180 200, 210 200"/>
    <path d="M338 200 C 362 200, 362 108, 386 108"/>
    <path d="M440 126 L 440 182"/>
    <path d="M440 218 L 440 274"/>
    <path class="fluxo" d="M274 218 L 274 380"/>
  </g>
  ${NO(28, 90, 112, 'impressora')}
  ${NO(28, 182, 112, 'impressora')}
  ${NO(28, 274, 112, 'impressora')}
  ${NO(210, 182, 128, 'coletor.py', true)}
  ${NO(386, 90, 108, 'SQLite')}
  ${NO(386, 182, 108, 'FastAPI')}
  ${NO(386, 274, 108, 'painel')}
  ${NO(196, 380, 156, 'alerta → e-mail')}
  <circle class="pulso" cx="338" cy="200" r="4"/>
  <text class="legenda" x="28" y="500">coleta · monitoramento · automação</text>
  <line class="legenda-linha" x1="28" y1="516" x2="492" y2="516"/>
</svg>`;

export function tituloPagina(pessoa) {
  if (!estaPreenchido(pessoa.nome)) return 'Portfólio';
  const nome = pessoa.nome.trim();
  return estaPreenchido(pessoa.cargo) ? `${nome} · ${pessoa.cargo.trim()}` : nome;
}

export function renderLogo(pessoa) {
  return iniciais(pessoa.nome);
}

function linkExterno(url, rotulo, icone) {
  const href = urlExterna(url);
  return href
    ? `<a class="link-ext" href="${escapeHtml(href)}" target="_blank" rel="noopener">${ICONES[icone]}<span>${rotulo}</span></a>`
    : '';
}

export function renderHero(pessoa, contato = {}) {
  const titulo = limpar(pessoa.titulo);
  const frase = limpar(pessoa.frase);
  const nomeHtml = escapeHtml(nomeExibido(pessoa.nome).trim());
  return `
    <div class="hero-texto">
      <p class="rotulo revelar"><span class="ponto" aria-hidden="true"></span>Portfólio</p>
      <h1 class="hero-nome revelar">${nomeHtml}</h1>
      ${titulo ? `<p class="hero-titulo revelar">${escapeHtml(titulo)}</p>` : ''}
      ${frase ? `<p class="hero-frase revelar">${escapeHtml(frase)}</p>` : ''}
      <div class="hero-pe revelar">
        <div class="hero-acoes">
          <a class="btn btn-pri" href="#projetos">Visualizar projetos ${ICONES.seta}</a>
          ${linkExterno(contato.github, 'GitHub', 'github')}
          ${linkExterno(contato.linkedin, 'LinkedIn', 'linkedin')}
        </div>
        <div class="tags" aria-label="Tecnologias">${tags(pessoa.tecnologias ?? [])}</div>
      </div>
    </div>
    <div class="hero-visual revelar">${DIAGRAMA}</div>`;
}

function visualProjeto(p) {
  if (p.demo) {
    return `
      <div class="janela">
        <div class="janela-barra">
          <span class="janela-pontos" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="janela-titulo">${escapeHtml(p.titulo)}</span>
          <span class="janela-aviso">Dados fictícios · interativo</span>
        </div>
        <div class="janela-palco" data-vitrine="${escapeHtml(p.demo)}">
          <p class="vitrine-carregando">Carregando demonstração…</p>
        </div>
      </div>`;
  }
  if (estaPreenchido(p.imagem)) {
    return `
      <div class="janela">
        <div class="janela-barra"><span class="janela-pontos" aria-hidden="true"><i></i><i></i><i></i></span><span class="janela-titulo">${escapeHtml(p.titulo)}</span></div>
        <img src="${escapeHtml(p.imagem)}" alt="Interface de ${escapeHtml(p.titulo)}" loading="lazy">
      </div>`;
  }
  return '';
}

export function renderProjetos(projetos) {
  return projetos
    .map((p, i) => {
      const visual = visualProjeto(p);
      const classes = ['showcase', i % 2 ? 'invertido' : '', visual ? '' : 'sem-visual'].filter(Boolean).join(' ');
      return `
    <article class="${classes}" id="projeto-${escapeHtml(p.id)}">
      ${visual ? `<div class="showcase-visual revelar">${visual}</div>` : ''}
      <div class="showcase-texto revelar">
        <span class="showcase-num"><span class="projeto-icone">${projetoIcone(p.icone)}</span>${numero(i)}</span>
        <h3>${escapeHtml(p.titulo)}</h3>
        <p class="showcase-resumo">${escapeHtml(limpar(p.resumo))}</p>
        ${limpar(p.objetivo) ? `<p class="showcase-objetivo">${escapeHtml(limpar(p.objetivo))}</p>` : ''}
        <ul class="showcase-tecs" aria-label="Tecnologias">${p.tecnologias.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
        <button type="button" class="btn-link" data-projeto-id="${escapeHtml(p.id)}">Ver detalhes do projeto ${ICONES.seta}</button>
      </div>
    </article>`;
    })
    .join('');
}

export function renderDetalhe(projeto) {
  const objetivo = limpar(projeto.objetivo);
  const problema = limpar(projeto.problema);
  const itens = projeto.comoFeito.map(limpar).filter(Boolean);
  const github = urlExterna(projeto.github);
  const demo = projeto.demo
    ? `
    <section class="demo" data-demo="${escapeHtml(projeto.demo)}">
      <h3>Demonstração</h3>
      <p class="aviso-demo">Dados fictícios, só para demonstração.</p>
      <div class="demo-palco"></div>
    </section>`
    : '';
  return `
    <header class="detalhe-cabeca">
      <span class="projeto-icone">${projetoIcone(projeto.icone)}</span>
      <h2 id="detalhe-titulo">${escapeHtml(projeto.titulo)}</h2>
    </header>
    <div class="detalhe-grade">
      ${objetivo ? `<section><h3>Objetivo</h3><p>${escapeHtml(objetivo)}</p></section>` : ''}
      ${problema ? `<section><h3>O problema</h3><p>${escapeHtml(problema)}</p></section>` : ''}
    </div>
    ${itens.length ? `<section><h3>Principais funcionalidades</h3><ul class="lista-check">${itens.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul></section>` : ''}
    <section><h3>Tecnologias</h3><div class="tags">${tags(projeto.tecnologias)}</div></section>
    ${github ? `<a class="link-ext" href="${escapeHtml(github)}" target="_blank" rel="noopener">${ICONES.github}<span>Ver no GitHub</span></a>` : ''}
    ${demo}`;
}

export function renderSobre(sobre, pessoa) {
  const nome = nomeExibido(pessoa.nome);
  const subtitulo = limpar(pessoa.subtitulo);
  const foto = estaPreenchido(pessoa.foto)
    ? `<img class="foto" src="${escapeHtml(pessoa.foto)}" alt="Foto de ${escapeHtml(nome)}" loading="lazy">`
    : `<div class="avatar" aria-hidden="true">${escapeHtml(iniciais(pessoa.nome))}</div>`;
  const [lead, ...resto] = (sobre.paragrafos ?? []).map(limpar).filter(Boolean);
  const marcos = (sobre.linhaDoTempo ?? [])
    .map((m) => {
      const detalhe = limpar(m.detalhe);
      return `
        <li class="marco">
          <span class="marco-quando">${escapeHtml(m.quando)}</span>
          <strong>${escapeHtml(m.titulo)}</strong>
          ${detalhe ? `<p>${escapeHtml(detalhe)}</p>` : ''}
        </li>`;
    })
    .join('');
  const formacao = (sobre.formacao ?? [])
    .map((f) => {
      const detalhe = limpar(f.detalhe);
      return `
        <li class="formacao-item">
          <span class="selo">${escapeHtml(f.status)}</span>
          <strong>${escapeHtml(f.titulo)}</strong>
          ${detalhe ? `<span class="formacao-detalhe">${escapeHtml(detalhe)}</span>` : ''}
        </li>`;
    })
    .join('');
  return `
    <header class="secao-cabeca revelar"><span class="secao-num">02</span><h2>Sobre mim</h2></header>
    <div class="sobre-grade">
      ${lead ? `<p class="sobre-lead revelar">${escapeHtml(lead)}</p>` : ''}
      <div class="sobre-corpo revelar">
        <div class="perfil">
          ${foto}
          <div><strong class="perfil-nome">${escapeHtml(nome)}</strong>${subtitulo ? `<span class="perfil-sub">${escapeHtml(subtitulo)}</span>` : ''}</div>
        </div>
        ${resto.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
    </div>
    <div class="sobre-rodape">
      ${marcos ? `<div class="bloco revelar"><h3>Trajetória</h3><ol class="linha-tempo">${marcos}</ol></div>` : ''}
      ${formacao ? `<div class="bloco revelar"><h3>Formação e cursos</h3><ul class="formacao">${formacao}</ul></div>` : ''}
    </div>`;
}

export function renderContato(contato) {
  const chamada = limpar(contato.chamada);
  const canais = [];
  if (emailValido(contato.email)) {
    const email = contato.email.trim();
    canais.push(['email', 'E-mail', email, `mailto:${email}`]);
  }
  for (const [id, rotulo] of [['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['instagram', 'Instagram']]) {
    const url = urlExterna(contato[id]);
    if (url) canais.push([id, rotulo, url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''), url]);
  }
  const whats = linkWhatsApp(contato.whatsapp?.numero, contato.whatsapp?.mensagem);
  if (whats) canais.push(['whatsapp', 'WhatsApp', 'Enviar mensagem', whats]);

  const lista = canais
    .map(
      ([id, rotulo, texto, href]) => `
      <li><a class="canal" href="${escapeHtml(href)}"${href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"'}>
        <span class="canal-rotulo">${ICONES[id]}${rotulo}</span>
        <span class="canal-texto">${escapeHtml(texto)}</span>
        <span class="canal-seta">${ICONES.externo}</span>
      </a></li>`,
    )
    .join('');
  return `
    <header class="secao-cabeca revelar"><span class="secao-num">03</span><h2>Contato</h2></header>
    <div class="contato-grade">
      <div class="revelar">
        <p class="contato-titulo">Vamos construir algo juntos?</p>
        ${chamada ? `<p class="contato-chamada">${escapeHtml(chamada)}</p>` : ''}
      </div>
      ${lista ? `<ul class="canais revelar">${lista}</ul>` : ''}
    </div>`;
}
