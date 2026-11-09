// Simulação pura do monitor de impressoras (dados fictícios).
const LOCAIS = ['Recepção', 'Financeiro', 'Almoxarifado', 'RH', 'Sala de reunião', 'Expedição'];

export function criarParque(rng, quantidade = 12) {
  return Array.from({ length: quantidade }, (_, i) => {
    const id = `IMP-${String(i + 1).padStart(2, '0')}`;
    return {
      id,
      nome: id,
      local: LOCAIS[i % LOCAIS.length],
      status: 'online',
      toner: 20 + Math.floor(rng() * 81),
      alertas: [],
    };
  });
}

function definirAlerta(alertas, tipo, aberto) {
  const existente = alertas.find((a) => a.tipo === tipo);
  if (existente) {
    const mudou = existente.aberto !== aberto;
    existente.aberto = aberto;
    return mudou;
  }
  if (!aberto) return false;
  alertas.push({ tipo, aberto: true });
  return true;
}

function avancarUma(original, rng, eventos) {
  const p = { ...original, alertas: original.alertas.map((a) => ({ ...a })) };
  const estavaOffline = p.status !== 'online';

  if (!estavaOffline && rng() < 0.03) {
    p.status = rng() < 0.5 ? 'sem-resposta' : 'falha-snmp';
    definirAlerta(p.alertas, 'offline', true);
    eventos.push(`${p.nome} parou de responder`);
  }

  if (estavaOffline && rng() < 0.3) {
    p.status = 'online';
    definirAlerta(p.alertas, 'offline', false);
    eventos.push(`${p.nome} voltou`);
  }

  if (p.status === 'online') {
    p.toner = Math.max(0, p.toner - Math.floor(rng() * 4));
    if (p.toner <= 5 && rng() < 0.25) {
      p.toner = 100;
      eventos.push(`${p.nome} teve toner trocado`);
    }
    // Só reavalia o alerta de toner com leitura válida (impressora online).
    const abriu = definirAlerta(p.alertas, 'toner-baixo', p.toner <= 10);
    if (abriu && p.toner <= 10) eventos.push(`${p.nome} com toner baixo`);
  }

  return p;
}

export function avancar(parque, rng) {
  const eventos = [];
  const novo = parque.map((p) => avancarUma(p, rng, eventos));
  return { parque: novo, eventos };
}

export function alertasAbertos(parque) {
  return parque.reduce((n, p) => n + p.alertas.filter((a) => a.aberto).length, 0);
}
