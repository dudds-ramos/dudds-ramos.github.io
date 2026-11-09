import { escapeHtml, estaPreenchido, linkWhatsApp, iniciais, urlExterna } from './util.js';

// Remove marcadores "[COMPLETAR: ...]" e devolve o texto que sobrar (ou '').
function limpar(texto) {
  return String(texto ?? '').replace(/\[COMPLETAR[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
}

function nomeExibido(nome) {
  return estaPreenchido(nome) ? nome : 'Seu Nome';
}

const tags = (lista) => lista.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');

const ICONES = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v5.4h-4v-4.8c0-1.2 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5v4.9h-4v-11Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8.1c-.1-1.6-.4-3-1.6-4.2S17.7 2.2 16 2.1C14.3 2 9.7 2 8 2.1c-1.6.1-3 .4-4.2 1.6S2.2 6.3 2.1 8C2 9.7 2 14.3 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.3 0-8Zm-2.1 9.8a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9a3.3 3.3 0 0 1 1.9-1.9C7.4 3.7 10.5 3.8 12 3.8s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9Z"/></svg>',
};

export function tituloPagina(pessoa) {
  if (!estaPreenchido(pessoa.nome)) return 'Portfólio';
  const nome = pessoa.nome.trim();
  return estaPreenchido(pessoa.cargo) ? `${nome} · ${pessoa.cargo.trim()}` : nome;
}

export function renderHero(pessoa) {
  const frase = limpar(pessoa.frase);
  return `
    <p class="saudacao revelar">Olá, eu sou</p>
    <h1 class="revelar"><span class="grad">${escapeHtml(nomeExibido(pessoa.nome))}</span></h1>
    ${frase ? `<p class="frase revelar">${escapeHtml(frase)}</p>` : ''}
    <div class="tags revelar">${tags(pessoa.tecnologias ?? [])}</div>
    <a class="btn revelar" href="#projetos">Ver projetos <span aria-hidden="true">↓</span></a>`;
}

export function renderProjetos(projetos) {
  return projetos
    .map(
      (p, i) => `
    <button type="button" class="card-vidro revelar" style="--i:${i}" data-projeto-id="${escapeHtml(p.id)}">
      <span class="card-num">0${i + 1}</span>
      <h3>${escapeHtml(p.titulo)}</h3>
      <p>${escapeHtml(limpar(p.resumo))}</p>
      <span class="card-tecs">${p.tecnologias.map(escapeHtml).join(' · ')}</span>
      ${p.demo ? '<span class="card-cta">Testar demo →</span>' : '<span class="card-cta">Ver detalhes →</span>'}
    </button>`,
    )
    .join('');
}

export function renderDetalhe(projeto) {
  const problema = limpar(projeto.problema);
  const itens = projeto.comoFeito.map(limpar).filter(Boolean);
  const demo = projeto.demo
    ? `
    <section class="demo" data-demo="${escapeHtml(projeto.demo)}">
      <h3>Teste você mesmo</h3>
      <p class="aviso-demo">Dados fictícios, só para demonstração.</p>
      <div class="demo-palco"></div>
    </section>`
    : '';
  return `
    <h2 id="detalhe-titulo"><span class="grad">${escapeHtml(projeto.titulo)}</span></h2>
    <div class="tags">${tags(projeto.tecnologias)}</div>
    ${problema ? `<h3>O problema</h3><p>${escapeHtml(problema)}</p>` : ''}
    ${itens.length ? `<h3>Como foi feito</h3><ul>${itens.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>` : ''}
    ${demo}`;
}

export function renderSobre(sobre, pessoa) {
  const nome = nomeExibido(pessoa.nome);
  const foto = estaPreenchido(pessoa.foto)
    ? `<img class="foto" src="${escapeHtml(pessoa.foto)}" alt="Foto de ${escapeHtml(nome)}" loading="lazy">`
    : `<div class="avatar" aria-hidden="true">${escapeHtml(iniciais(pessoa.nome))}</div>`;
  const paragrafos = sobre.paragrafos.map(limpar).filter(Boolean);
  const formacao = sobre.formacao
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
    <h2 class="revelar">Sobre mim</h2>
    <div class="sobre-grade">
      <div class="sobre-foto revelar">${foto}</div>
      <div class="sobre-texto revelar">
        ${paragrafos.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        ${formacao ? `<div class="formacao"><h3>Em formação</h3><ul>${formacao}</ul></div>` : ''}
      </div>
    </div>`;
}

export function renderContato(contato) {
  const whats = linkWhatsApp(contato.whatsapp?.numero, contato.whatsapp?.mensagem);
  const redes = [
    ['linkedin', 'LinkedIn', contato.linkedin],
    ['instagram', 'Instagram', contato.instagram],
  ]
    .map(([id, rotulo, url]) => [id, rotulo, urlExterna(url)])
    .filter(([, , url]) => url)
    .map(
      ([id, rotulo, url]) =>
        `<a class="rede" href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${rotulo}">${ICONES[id]}</a>`,
    )
    .join('');
  return `
    <h2 class="revelar">Vamos conversar?</h2>
    <p class="revelar">Curtiu algum projeto ou tem uma vaga em mente? Me chama.</p>
    ${whats ? `<a class="btn-whats revelar" href="${escapeHtml(whats)}" target="_blank" rel="noopener">${ICONES.whatsapp}Fale comigo no WhatsApp</a>` : ''}
    ${redes ? `<div class="redes revelar">${redes}</div>` : ''}`;
}
