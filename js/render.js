import { escapeHtml, estaPreenchido, linkWhatsApp, iniciais, urlExterna, emailValido } from './util.js';

// Remove marcadores "[COMPLETAR: ...]" e devolve o texto que sobrar (ou '').
function limpar(texto) {
  return String(texto ?? '').replace(/\[COMPLETAR[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
}

const nomeExibido = (nome) => (estaPreenchido(nome) ? nome : 'Seu Nome');
const tags = (lista) => lista.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');

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

export function tituloPagina(pessoa) {
  if (!estaPreenchido(pessoa.nome)) return 'Portfólio';
  const nome = pessoa.nome.trim();
  return estaPreenchido(pessoa.cargo) ? `${nome} · ${pessoa.cargo.trim()}` : nome;
}

export function renderLogo(pessoa) {
  return iniciais(pessoa.nome);
}

function botaoExterno(url, rotulo, icone) {
  const href = urlExterna(url);
  return href
    ? `<a class="btn btn-sec" href="${escapeHtml(href)}" target="_blank" rel="noopener">${ICONES[icone]}${rotulo}</a>`
    : '';
}

export function renderHero(pessoa, contato = {}) {
  const titulo = limpar(pessoa.titulo);
  const frase = limpar(pessoa.frase);
  return `
    <span class="chip revelar">Portfólio</span>
    <h1 class="hero-nome revelar">${escapeHtml(nomeExibido(pessoa.nome).trim())}</h1>
    ${titulo ? `<p class="hero-titulo revelar">${escapeHtml(titulo)}</p>` : ''}
    ${frase ? `<p class="hero-frase revelar">${escapeHtml(frase)}</p>` : ''}
    <div class="hero-acoes revelar">
      <a class="btn btn-pri" href="#projetos">Visualizar projetos ${ICONES.seta}</a>
      ${botaoExterno(contato.github, 'GitHub', 'github')}
      ${botaoExterno(contato.linkedin, 'LinkedIn', 'linkedin')}
    </div>
    <div class="tags centro revelar" aria-label="Tecnologias">${tags(pessoa.tecnologias ?? [])}</div>`;
}

// Abas dos projetos (padrão WAI-ARIA tabs: só a aba ativa entra no Tab).
export function renderAbas(projetos, ativoId) {
  return projetos
    .map((p) => {
      const ativo = p.id === ativoId;
      return `<button type="button" role="tab" class="aba" id="aba-${escapeHtml(p.id)}" data-aba="${escapeHtml(p.id)}" aria-selected="${ativo}" aria-controls="painel-projeto"${ativo ? '' : ' tabindex="-1"'}>${projetoIcone(p.icone)}<span>${escapeHtml(p.titulo)}</span></button>`;
    })
    .join('');
}

function visualProjeto(p) {
  if (p.demo) {
    return `
      <div class="demo-janela">
        <div class="demo-barra">
          <span class="janela-pontos" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="demo-ao-vivo">ao vivo · dados fictícios</span>
        </div>
        <div class="demo-area" data-vitrine="${escapeHtml(p.demo)}">
          <p class="vitrine-carregando">Carregando demonstração…</p>
        </div>
      </div>`;
  }
  if (estaPreenchido(p.imagem)) {
    return `<div class="demo-janela"><img src="${escapeHtml(p.imagem)}" alt="Interface de ${escapeHtml(p.titulo)}" loading="lazy"></div>`;
  }
  return '';
}

export function renderPainelProjeto(p) {
  const itens = p.comoFeito.map(limpar).filter(Boolean);
  const visual = visualProjeto(p);
  return `
    <div class="painel-projeto${visual ? '' : ' sem-visual'}">
      <div class="projeto-info">
        <span class="projeto-icone grande">${projetoIcone(p.icone)}</span>
        <h3>${escapeHtml(p.titulo)}</h3>
        <p class="projeto-resumo">${escapeHtml(limpar(p.resumo))}</p>
        ${itens.length ? `<ul class="lista-check">${itens.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>` : ''}
        <div class="tags">${tags(p.tecnologias)}</div>
        <button type="button" class="btn-link" data-projeto-id="${escapeHtml(p.id)}">Ver detalhes do projeto ${ICONES.seta}</button>
      </div>
      ${visual ? `<div class="projeto-visual">${visual}</div>` : ''}
    </div>`;
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
  const paragrafos = (sobre.paragrafos ?? []).map(limpar).filter(Boolean);
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
          <div><strong>${escapeHtml(f.titulo)}</strong>${detalhe ? `<span>${escapeHtml(detalhe)}</span>` : ''}</div>
          <span class="selo">${escapeHtml(f.status)}</span>
        </li>`;
    })
    .join('');
  return `
    <h2 class="titulo-secao revelar">Sobre mim</h2>
    <div class="painel sobre-painel revelar">
      <div class="sobre-texto">
        <div class="perfil">
          ${foto}
          <div><strong class="perfil-nome">${escapeHtml(nome)}</strong>${subtitulo ? `<span class="perfil-sub">${escapeHtml(subtitulo)}</span>` : ''}</div>
        </div>
        ${paragrafos.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
      <div class="sobre-lado">
        ${marcos ? `<div class="bloco"><h3>Trajetória</h3><ol class="linha-tempo">${marcos}</ol></div>` : ''}
        ${formacao ? `<div class="bloco"><h3>Formação e cursos</h3><ul class="formacao">${formacao}</ul></div>` : ''}
      </div>
    </div>`;
}

export function renderContato(contato) {
  const chamada = limpar(contato.chamada);
  const canais = [];
  if (emailValido(contato.email)) {
    const email = contato.email.trim();
    canais.push(['email', 'E-mail', `mailto:${email}`]);
  }
  for (const [id, rotulo] of [['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['instagram', 'Instagram']]) {
    const url = urlExterna(contato[id]);
    if (url) canais.push([id, rotulo, url]);
  }
  const whats = linkWhatsApp(contato.whatsapp?.numero, contato.whatsapp?.mensagem);
  if (whats) canais.push(['whatsapp', 'WhatsApp', whats]);

  const lista = canais
    .map(
      ([id, rotulo, href]) =>
        `<a class="btn btn-sec" href="${escapeHtml(href)}"${href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"'}>${ICONES[id]}${rotulo}</a>`,
    )
    .join('');
  return `
    <div class="painel contato-painel revelar">
      <h2 class="titulo-secao">Vamos conversar?</h2>
      ${chamada ? `<p class="contato-chamada">${escapeHtml(chamada)}</p>` : ''}
      ${lista ? `<div class="canais">${lista}</div>` : ''}
    </div>`;
}
