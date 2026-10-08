/* ============================================================================
   Servidor de frases do Invasão das Letras — versão Google Apps Script
   As frases ficam numa planilha do SEU Google Drive ("Invasão das Letras - frases").

   Como publicar (uma vez só, uns 3 minutos):
   1. Abra https://script.google.com e clique em "Novo projeto".
   2. Apague o que estiver no editor, cole este arquivo inteiro e salve (ícone de disquete).
   3. Clique em "Implantar" > "Nova implantação" > engrenagem > "App da Web".
      - Executar como: "Eu"
      - Quem pode acessar: "Qualquer pessoa"   (importante: NÃO "qualquer pessoa com Conta do Google")
      Clique em "Implantar" e autorize (em "Avançado" > "Acessar ... (não seguro)" se o Google avisar).
   4. Copie o "URL do app da Web" (termina em /exec) e cole no arquivo servidor.js do jogo.
   Para alterar este código depois: "Implantar" > "Gerenciar implantações" > lápis > Versão: "Nova versão" > Implantar.
   Assim o endereço continua o mesmo.
   ============================================================================ */

var SENHA_PROFESSOR = '';        // opcional: senha para apagar frases pelo jogo. Em branco = sem senha.
var NOME_PLANILHA = 'Invasão das Letras - frases';
var MAX_POR_SALA = 300;

function doGet(e){ return responde(trata(e, null)); }
function doPost(e){
  var corpo = {};
  try { corpo = JSON.parse((e && e.postData && e.postData.contents) || '{}') || {}; } catch (x) { corpo = {}; }
  return responde(trata(e, corpo));
}
function responde(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function trata(e, corpo){
  try {
    var p = (e && e.parameter) || {}; corpo = corpo || {};
    var acao = String(corpo.acao || p.acao || 'listar');
    var sala = limpaSala(corpo.sala || p.sala);
    if (acao === 'ping') return { ok: true, ping: true, hora: String(new Date()) };   // teste sem tocar na planilha
    if (!sala) return { ok: false, erro: 'Informe o código da sala.' };
    if (acao === 'listar') return { ok: true, sala: sala, frases: listar(sala) };
    if (acao === 'enviar') return enviar(sala, corpo.t || p.t, corpo.a || p.a);
    if (acao === 'apagar') return apagar(sala, corpo.id || p.id, corpo.senha || p.senha);
    return { ok: false, erro: 'Ação desconhecida.' };
  } catch (err) {
    return { ok: false, erro: 'Erro no servidor: ' + (err && err.message ? err.message : err) };
  }
}

/* ---------- teste dentro do editor ----------
   Selecione "testarNoEditor" na barra de cima e clique em "Executar". Na primeira vez o Google pede
   autorização (Revisar permissões > sua conta > Avançado > Acessar... > Permitir). No fim, o registro
   de execução mostra "OK" e a planilha aparece no seu Drive. Depois publique uma nova versão. */
function testarNoEditor(){
  var sala = 'teste-do-editor';
  var r1 = trata({ parameter: { acao: 'listar', sala: sala } }, null);
  var r2 = trata({ parameter: {} }, { acao: 'enviar', sala: sala, t: 'teste feito no editor', a: 'professor' });
  var r3 = trata({ parameter: { acao: 'listar', sala: sala } }, null);
  var id = r2.ok ? r2.frase.id : (r3.frases[0] ? r3.frases[0].id : '');
  var r4 = trata({ parameter: {} }, { acao: 'apagar', sala: sala, id: id, senha: SENHA_PROFESSOR });
  var tudoOk = r1.ok && (r2.ok || /já está/.test(r2.erro || '')) && r3.ok && r4.ok;
  Logger.log((tudoOk ? 'OK: o servidor está funcionando. ' : 'ALGO FALHOU. ') + JSON.stringify({ listar: r1, enviar: r2, listarDeNovo: r3, apagar: r4 }));
  return tudoOk;
}

/* ---------- planilha ---------- */
function planilha(){
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('planilhaId'), ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (x) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(NOME_PLANILHA);
    var sh = ss.getSheets()[0]; sh.setName('frases');
    sh.appendRow(['id', 'sala', 'frase', 'nome', 'quando']);
    props.setProperty('planilhaId', ss.getId());
  }
  return ss;
}
function aba(){ var ss = planilha(); return ss.getSheetByName('frases') || ss.getSheets()[0]; }
function linhas(){ var sh = aba(); var n = sh.getLastRow(); if (n < 2) return []; return sh.getRange(2, 1, n - 1, 5).getValues(); }

function listar(sala){
  var out = [];
  linhas().forEach(function (l) {
    if (String(l[1]) === sala && String(l[2] || '').trim()) out.push({ id: String(l[0]), t: String(l[2]), a: String(l[3] || '') });
  });
  return out;
}
function enviar(sala, t, a){
  var f = limpaFrase(t), nome = limpaNome(a);
  var erro = checaFrase(f); if (erro) return { ok: false, erro: erro };
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (x) { return { ok: false, erro: 'Muita gente enviando ao mesmo tempo. Tente de novo.' }; }
  try {
    var vals = linhas(), atuais = 0, agora = new Date().getTime();
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][1]) !== sala) continue;
      atuais++;
      if (String(vals[i][2]) === f) {
        // a mesma frase chegou duas vezes em poucos segundos (clique repetido ou reenvio da rede): conta como sucesso
        var quando = vals[i][4] instanceof Date ? vals[i][4].getTime() : new Date(vals[i][4]).getTime();
        if (quando && agora - quando < 30000) return { ok: true, frase: { id: String(vals[i][0]), t: f, a: String(vals[i][3] || '') }, repetida: true };
        return { ok: false, erro: 'Essa frase já está na sala.' };
      }
    }
    if (atuais >= MAX_POR_SALA) return { ok: false, erro: 'Esta sala já tem frases demais.' };
    var id = 'f' + Utilities.getUuid().replace(/-/g, '').slice(0, 12);   // começa com letra para a planilha não virar número
    aba().appendRow([id, sala, f, nome, new Date()]);
    return { ok: true, frase: { id: id, t: f, a: nome } };
  } finally { lock.releaseLock(); }
}
function apagar(sala, id, senha){
  if (SENHA_PROFESSOR && String(senha || '') !== SENHA_PROFESSOR) return { ok: false, erro: 'Senha do professor errada.' };
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (x) { return { ok: false, erro: 'Servidor ocupado. Tente de novo.' }; }
  try {
    var sh = aba(), vals = linhas();
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][0]) === String(id) && String(vals[i][1]) === sala) { sh.deleteRow(i + 2); return { ok: true }; }
    }
    return { ok: false, erro: 'Frase não encontrada (talvez já tenha sido apagada).' };
  } finally { lock.releaseLock(); }
}

/* ---------- as mesmas regras do jogo ---------- */
function limpaSala(t){ return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 20); }
function limpaFrase(t){ return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ç/g, 'c').replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function limpaNome(t){ return String(t || '').replace(/[<>|\n\r]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 20); }
function checaFrase(f){
  var p = f ? f.split(' ') : [];
  if (!f) return 'Escreva uma frase com letras.';
  if (p.length < 2) return 'A frase precisa ter pelo menos 2 palavras.';
  if (p.length > 6) return 'Até 6 palavras, para caber no meteoro.';
  if (f.length > 40) return 'Frase grande demais: até 40 letras.';
  for (var i = 0; i < p.length; i++) if (p[i].length > 12) return 'A palavra "' + p[i] + '" é comprida demais (até 12 letras).';
  return '';
}
