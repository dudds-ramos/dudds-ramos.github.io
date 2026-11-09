const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function estaPreenchido(valor) {
  if (typeof valor !== 'string') return valor != null && valor !== '';
  return valor.trim() !== '' && !valor.includes('[COMPLETAR');
}

export function linkWhatsApp(numero, mensagem) {
  if (!estaPreenchido(numero)) return null;
  const digitos = numero.replace(/\D/g, '');
  if (digitos.length < 12) return null;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem ?? '')}`;
}

// Link externo seguro: aceita http(s), completa "dominio.com/..." com https:// e rejeita o resto.
export function urlExterna(url) {
  if (!estaPreenchido(url)) return null;
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(u)) return `https://${u}`;
  return null;
}

export function iniciais(nome) {
  if (!estaPreenchido(nome)) return '?';
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
