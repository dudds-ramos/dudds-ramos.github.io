import { FILIAIS, MODELOS, montarEmail } from './emails-sim.js';
import { escapeHtml } from '../util.js';

export function montar(palco, { reduzirMovimento }) {
  let timer = null;

  palco.innerHTML = `
    <div class="mail">
      <div class="mail-form">
        <label>Filial
          <select class="mail-filial">${FILIAIS.map((f) => `<option value="${f.id}">${escapeHtml(f.nome)}</option>`).join('')}</select>
        </label>
        <label>Modelo
          <select class="mail-modelo">${MODELOS.map((m) => `<option value="${m.id}">${escapeHtml(m.nome)}</option>`).join('')}</select>
        </label>
        <button type="button" class="demo-btn mail-gerar">Gerar e-mail</button>
      </div>
      <div class="mail-janela" hidden>
        <div class="mail-linha"><span>Para</span><b class="mail-para"></b></div>
        <div class="mail-linha"><span>Cc</span><b class="mail-cc"></b></div>
        <div class="mail-linha"><span>Assunto</span><b class="mail-assunto"></b></div>
        <pre class="mail-corpo"></pre>
      </div>
      <p class="mail-selo">Nada é enviado — é só demonstração.</p>
    </div>`;
  const $ = (s) => palco.querySelector(s);

  function gerar() {
    if (timer) clearInterval(timer);
    timer = null;
    const email = montarEmail($('.mail-filial').value, $('.mail-modelo').value, new Date());
    if (!email) return;
    $('.mail-janela').hidden = false;
    $('.mail-para').textContent = email.para;
    $('.mail-cc').textContent = email.cc.join(', ');
    $('.mail-assunto').textContent = email.assunto;
    const corpo = $('.mail-corpo');
    if (reduzirMovimento) {
      corpo.textContent = email.corpo;
      return;
    }
    let i = 0;
    corpo.textContent = '';
    timer = setInterval(() => {
      i += 2;
      corpo.textContent = email.corpo.slice(0, i);
      if (i >= email.corpo.length) {
        clearInterval(timer);
        timer = null;
      }
    }, 15);
  }

  const botao = $('.mail-gerar');
  botao.addEventListener('click', gerar);

  return () => {
    if (timer) clearInterval(timer);
    botao.removeEventListener('click', gerar);
    palco.innerHTML = '';
  };
}
