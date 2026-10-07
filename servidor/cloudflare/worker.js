/* ============================================================================
   Servidor de frases do Invasão das Letras — versão Cloudflare Worker + KV
   Publicado automaticamente pelo GitHub Actions (.github/workflows/servidor-cloudflare.yml)
   quando os segredos CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID existem no repositório.
   Guia: servidor/LEIAME.md
   ============================================================================ */
const MAX_POR_SALA = 300;

export default {
  async fetch(req, env) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' } });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      const url = new URL(req.url);
      const p = Object.fromEntries(url.searchParams);
      let corpo = {};
      if (req.method === 'POST') { try { corpo = JSON.parse(await req.text()) || {}; } catch (e) { corpo = {}; } }
      const acao = String(corpo.acao || p.acao || 'listar');
      const sala = limpaSala(corpo.sala || p.sala);
      if (!sala) return json({ ok: false, erro: 'Informe o código da sala.' });
      if (acao === 'listar') return json({ ok: true, sala, frases: await listar(env, sala) });
      if (acao === 'enviar') return json(await enviar(env, sala, corpo.t ?? p.t, corpo.a ?? p.a));
      if (acao === 'apagar') return json(await apagar(env, sala, corpo.id ?? p.id, corpo.senha ?? p.senha));
      return json({ ok: false, erro: 'Ação desconhecida.' });
    } catch (err) {
      return json({ ok: false, erro: 'Erro no servidor: ' + (err && err.message ? err.message : err) });
    }
  }
};

/* cada frase é uma chave do KV: "sala:<sala>:<id>"; o texto e o nome ficam nos metadados,
   assim uma única listagem devolve tudo e duas crianças enviando ao mesmo tempo não se atropelam */
async function listar(env, sala) {
  const prefix = 'sala:' + sala + ':';
  const out = []; let cursor;
  do {
    const r = await env.FRASES.list({ prefix, limit: 1000, cursor });
    for (const k of r.keys) { const m = k.metadata || {}; if (m.t) out.push({ id: k.name.slice(prefix.length), t: String(m.t), a: String(m.a || ''), ts: m.ts || 0 }); }
    cursor = r.list_complete ? undefined : r.cursor;
  } while (cursor);
  out.sort((x, y) => (x.ts || 0) - (y.ts || 0) || (x.id < y.id ? -1 : 1));
  return out.map(({ id, t, a }) => ({ id, t, a }));
}
async function enviar(env, sala, t, a) {
  const f = limpaFrase(t), nome = limpaNome(a);
  const erro = checaFrase(f); if (erro) return { ok: false, erro };
  const atuais = await listar(env, sala);
  if (atuais.length >= MAX_POR_SALA) return { ok: false, erro: 'Esta sala já tem frases demais.' };
  if (atuais.some(x => x.t === f)) return { ok: false, erro: 'Essa frase já está na sala.' };
  const ts = Date.now();
  const id = ts.toString(36) + Math.random().toString(36).slice(2, 6);
  await env.FRASES.put('sala:' + sala + ':' + id, '1', { metadata: { t: f, a: nome, ts } });
  return { ok: true, frase: { id, t: f, a: nome } };
}
async function apagar(env, sala, id, senha) {
  const senhaCerta = (env.SENHA_PROFESSOR || '').trim();
  if (senhaCerta && String(senha || '') !== senhaCerta) return { ok: false, erro: 'Senha do professor errada.' };
  const chave = 'sala:' + sala + ':' + String(id || '').replace(/[^a-z0-9]/gi, '');
  if (!id) return { ok: false, erro: 'Frase não encontrada.' };
  await env.FRASES.delete(chave);
  return { ok: true };
}

/* as mesmas regras do jogo */
function limpaSala(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 20); }
function limpaFrase(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ç/g, 'c').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function limpaNome(t) { return String(t || '').replace(/[<>|\n\r]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 20); }
function checaFrase(f) {
  const p = f ? f.split(' ') : [];
  if (!f) return 'Escreva uma frase com letras.';
  if (p.length < 2) return 'A frase precisa ter pelo menos 2 palavras.';
  if (p.length > 6) return 'Até 6 palavras, para caber no meteoro.';
  if (f.length > 40) return 'Frase grande demais: até 40 letras.';
  for (const w of p) if (w.length > 12) return 'A palavra "' + w + '" é comprida demais (até 12 letras).';
  return '';
}
