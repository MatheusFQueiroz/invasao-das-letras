(function(){
'use strict';

/* ======================================================================
   Dedos e teclas
   0 mindinho E · 1 anelar E · 2 médio E · 3 indicador E · 4 indicador D · 5 médio D · 6 anelar D · 7 mindinho D
   ====================================================================== */
var DEDO_DE={' ':8, q:0,a:0,z:0, w:1,s:1,x:1, e:2,d:2,c:2, r:3,f:3,v:3,t:3,g:3,b:3, y:4,h:4,n:4,u:4,j:4,m:4, i:5,k:5, o:6,l:6, p:7};
var NOME_DEDO=['mindinho','anelar','médio','indicador','indicador','médio','anelar','mindinho','polegar'];
var COR_DEDO=['#FF6B8A','#FFB347','#FFE24D','#6BE585','#5CD6FF','#7C9CFF','#C58BFF','#FF8AD8','#C9D1FF'];
var CASA={a:0,s:1,d:2,f:3,j:4,k:5,l:6};   // posição de descanso (o mindinho direito descansa no ç ou ;)
var LINHAS=['qwertyuiop','asdfghjkl','zxcvbnm'];
function mao(d){ return d===8?'que você preferir':d<4?'esquerda':'direita'; }
function nomeTecla(c){ return c===' '?'ESPAÇO':c.toUpperCase(); }
function dedoHtml(d){ return '<span class="dedo"><i style="background:'+COR_DEDO[d]+'"></i>'+NOME_DEDO[d]+' da mão '+mao(d)+'</span>'; }
function casaDoDedo(d){ for(var k in CASA) if(CASA[k]===d) return k.toUpperCase(); return d===7?'Ç (ou ;)':''; }
function dicaTecla(c){
  var d=DEDO_DE[c],up=c.toUpperCase();
  if(c===' ') return 'A barra de <b>espaço</b> é do '+dedoHtml(8)+'. Os polegares ficam descansando em cima dela, e qualquer um dos dois pode apertar.';
  if(CASA[c]!==undefined) return 'A letra <b>'+up+'</b> é a casa do '+dedoHtml(d)+'. Ele fica descansando em cima dela.';
  return 'A letra <b>'+up+'</b> é do '+dedoHtml(d)+'. Ele sai da casa <b>'+casaDoDedo(d)+'</b>, aperta o '+up+' e volta.';
}

/* ======================================================================
   Desenho das mãos (SVG): dedos coloridos, com os que estão em destaque acesos
   ====================================================================== */
function maos(destaque,opts){
  opts=opts||{}; var on={}; (destaque||[]).forEach(function(d){ on[d]=1; }); var todos=!destaque||!destaque.length;
  function dedo(x,y,w,h,idx,rot){
    var aceso=todos||on[idx],cor=aceso?COR_DEDO[idx]:'#3A4380';
    return '<g transform="rotate('+(rot||0)+' '+(x+w/2)+' '+(y+h)+')"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(w/2)+'" fill="'+cor+'" stroke="#0B0F2E" stroke-width="2.5"/>'+
      (aceso&&opts.numeros?'<circle cx="'+(x+w/2)+'" cy="'+(y+w/2+2)+'" r="'+(w/2-4)+'" fill="rgba(0,0,0,.35)"/><text x="'+(x+w/2)+'" y="'+(y+w/2+6.5)+'" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="13" fill="#fff">'+casaDoDedo(idx).charAt(0)+'</text>':'')+'</g>';
  }
  function umaMao(ox,esq){
    var s='';
    var palma='<rect x="'+(ox+22)+'" y="60" width="86" height="80" rx="26" fill="#4A54A0" stroke="#0B0F2E" stroke-width="2.5"/>';
    // polegar
    var corPol=(todos||on[8])?COR_DEDO[8]:'#4A54A0';
    var pol='<rect x="'+(esq?ox+96:ox+2)+'" y="86" width="22" height="52" rx="11" fill="'+corPol+'" stroke="#0B0F2E" stroke-width="2.5" transform="rotate('+(esq?-30:30)+' '+(esq?ox+107:ox+13)+' 138)"/>';
    var ordem=esq?[0,1,2,3]:[4,5,6,7]; if(!esq) ordem=[4,5,6,7];
    var xs=esq?[ox+24,ox+45,ox+66,ox+87]:[ox+24,ox+45,ox+66,ox+87];
    var alturas=esq?[52,66,74,64]:[64,74,66,52];
    var idxs=esq?[0,1,2,3]:[4,5,6,7];
    for(var i=0;i<4;i++){ var h=alturas[i]; s+=dedo(xs[i],70-h,19,h+10,idxs[i]); }
    return pol+palma+s;
  }
  return '<svg viewBox="0 -12 270 164" aria-hidden="true">'+umaMao(0,true)+umaMao(140,false)+'</svg>';
}

/* ======================================================================
   Missões e fases
   pool = letras ou palavras · total = meteoros · queda = segundos até o chão · intervalo = segundos entre meteoros
   ====================================================================== */
var PAL_CURTAS=['sol','mar','pai','rio','lua','boi','mel','dia','ovo','uva','sal','tia','rei','ave','asa','oi','tio','ilha','fada','dado'];
var PAL_MEDIAS=['bola','gato','pato','casa','mala','sapo','dedo','vaca','faca','lobo','rato','suco','pipa','sino','copo','luva','mesa','fogo','nuvem','livro','peixe','flor'];
var FRASES_1=['o sol brilha','a bola rola','o pato nada','o rio corre','a vaca come','eu amo ler','meu gato dorme','vamos brincar'];
var FRASES_2=['boa noite lua','a nave voa longe','o sapo pula alto','eu gosto de ler','a estrela brilha','o foguete sobe','a lua sorri','meu amigo chegou'];
var FRASES_3=['a escola e legal','o planeta gira devagar','eu sei digitar','o meteoro caiu no mar','a girafa come folhas','vamos salvar o planeta'];
var PAL_GRANDES=['escola','janela','caneta','boneca','cavalo','girafa','tomate','banana','sapato','camelo','planeta','foguete','estrela','teclado','meteoro','amigo'];
var MISSOES=[
 {nome:'A casa da mão esquerda',cor:'#FF6B8A',desc:'Os quatro dedos da mão esquerda descansam em A, S, D e F.',teclas:'asdf',dedos:[0,1,2,3],
  dicas:['Coloque a mão <b>esquerda</b> assim: mindinho no <b>A</b>, anelar no <b>S</b>, médio no <b>D</b> e indicador no <b>F</b>.','Sente o <b>risquinho</b> na tecla F com o indicador. Ele existe para você achar a casa sem olhar!','Os dedos ficam curvados, como se segurassem uma bolinha. O pulso não encosta na mesa.'],
  fases:[{pool:'ff',total:8,queda:20,intervalo:3},{pool:'fdsa',total:12,queda:18,intervalo:2.8},{pool:'asdf',total:14,queda:16,intervalo:2.5}]},
 {nome:'A casa da mão direita',cor:'#5CD6FF',desc:'Os quatro dedos da mão direita descansam em J, K, L e Ç.',teclas:'jkl',dedos:[4,5,6,7],
  dicas:['Agora a mão <b>direita</b>: indicador no <b>J</b>, médio no <b>K</b>, anelar no <b>L</b> e mindinho no <b>Ç</b> (ou no ponto e vírgula).','O <b>J</b> também tem risquinho. Com os dois indicadores nos risquinhos, as mãos estão no lugar certo.','Cada dedo cuida das próprias teclas. Não deixe o indicador fazer o trabalho dos outros!'],
  fases:[{pool:'jj',total:8,queda:20,intervalo:3},{pool:'jkl',total:12,queda:18,intervalo:2.8},{pool:'jkl',total:14,queda:16,intervalo:2.5}]},
 {nome:'As duas mãos juntas',cor:'#FFE24D',desc:'A linha do meio inteira: A S D F e J K L.',teclas:'asdfjkl',dedos:[0,1,2,3,4,5,6],
  dicas:['As duas mãos na casa: <b>A S D F</b> na esquerda e <b>J K L</b> na direita. Os polegares ficam em cima da barra de espaço.','Aperte e <b>volte</b> para a casa. O dedo dá um pulinho e retorna, sempre.','Olhe para a <b>tela</b>. A tecla acesa no teclado aqui embaixo mostra qual dedo usar.'],
  fases:[{pool:'asdfjkl',total:14,queda:16,intervalo:2.6},{pool:'asdfjkl',total:16,queda:14,intervalo:2.3},{pool:'asdfghjkl',total:18,queda:13,intervalo:2.1}]},
 {nome:'Os indicadores viajam',cor:'#6BE585',desc:'G e H ficam no meio. Os indicadores esticam até lá e voltam.',teclas:'fghj',dedos:[3,4],
  dicas:['O <b>G</b> é do indicador <b>esquerdo</b>: ele sai do F, aperta o G e volta para o F.','O <b>H</b> é do indicador <b>direito</b>: ele sai do J, aperta o H e volta para o J.','Só o indicador se mexe. Os outros três dedos continuam parados na casa.'],
  fases:[{pool:'fgfg',total:10,queda:17,intervalo:2.6},{pool:'jhjh',total:10,queda:17,intervalo:2.6},{pool:'fghj',total:16,queda:14,intervalo:2.2}]},
 {nome:'A linha de cima',cor:'#FFB347',desc:'Q W E R T e Y U I O P: cada dedo sobe uma linha.',teclas:'qwertyuiop',dedos:[0,1,2,3,4,5,6,7],
  dicas:['Cada dedo sobe <b>reto</b> a partir da casa: o mindinho esquerdo vai do A para o <b>Q</b>, o anelar do S para o <b>W</b>, o médio do D para o <b>E</b>.','O indicador esquerdo cuida de <b>R e T</b>. O indicador direito cuida de <b>Y e U</b>.','Na direita: médio do K para o <b>I</b>, anelar do L para o <b>O</b>, mindinho para o <b>P</b>.'],
  fases:[{pool:'qwert',total:12,queda:18,intervalo:2.8},{pool:'yuiop',total:12,queda:18,intervalo:2.8},{pool:'qwertyuiop',total:18,queda:15,intervalo:2.3}]},
 {nome:'A linha de baixo',cor:'#C58BFF',desc:'Z X C V B e N M: cada dedo desce uma linha.',teclas:'zxcvbnm',dedos:[0,1,2,3,4],
  dicas:['Agora cada dedo <b>desce</b> a partir da casa: mindinho do A para o <b>Z</b>, anelar do S para o <b>X</b>, médio do D para o <b>C</b>.','O indicador esquerdo cuida de <b>V e B</b>. O indicador direito desce do J para o <b>N</b> e o <b>M</b>.','A linha de baixo é a mais difícil de alcançar. Vá devagar e volte sempre para a casa.'],
  fases:[{pool:'zxcv',total:12,queda:18,intervalo:2.8},{pool:'bnm',total:12,queda:18,intervalo:2.8},{pool:'zxcvbnm',total:18,queda:15,intervalo:2.3}]},
 {nome:'O alfabeto inteiro',cor:'#FF8AD8',desc:'Todas as letras podem cair. Cada uma tem o seu dedo.',teclas:'abcdefghijklmnopqrstuvwxyz',dedos:[0,1,2,3,4,5,6,7],
  dicas:['Agora qualquer letra pode aparecer. Antes de apertar, pense: <b>qual dedo</b> cuida dela?','Se você se perder, pare, ache os <b>risquinhos</b> do F e do J e recomece dali.','Não precisa correr. O meteoro que você está mirando cai mais devagar.'],
  fases:[{pool:'abcdefghijklmnopqrstuvwxyz',total:16,queda:17,intervalo:2.6},{pool:'abcdefghijklmnopqrstuvwxyz',total:20,queda:15,intervalo:2.3},{pool:'abcdefghijklmnopqrstuvwxyz',total:24,queda:13,intervalo:2}]},
 {nome:'Palavras curtas',cor:'#4ADE80',desc:'Palavras de duas e três letras. Digite a palavra inteira.',teclas:'',dedos:[],palavras:true,
  dicas:['Agora caem <b>palavras</b>. Digite uma letra de cada vez, na ordem, e o meteoro explode no final.','Leia a palavra inteira antes de começar. Depois, uma letra por vez, sem pressa.','Quando terminar uma palavra, os dedos <b>voltam para a casa</b> antes da próxima.'],
  fases:[{pool:PAL_CURTAS,total:8,queda:20,intervalo:4.2},{pool:PAL_CURTAS,total:10,queda:18,intervalo:3.8},{pool:PAL_CURTAS,total:12,queda:16,intervalo:3.4}]},
 {nome:'Palavras médias',cor:'#5CD6FF',desc:'Palavras de quatro e cinco letras, com as duas mãos.',teclas:'',dedos:[],palavras:true,
  dicas:['Palavras maiores usam as <b>duas mãos</b> alternadas. Sinta o ritmo: esquerda, direita, esquerda…','Errou uma letra? Sem problema: a palavra continua de onde parou. É só apertar a letra certa.','Costas retas, cotovelos soltos, pés no chão. O corpo confortável ajuda os dedos.'],
  fases:[{pool:PAL_MEDIAS,total:8,queda:22,intervalo:5},{pool:PAL_MEDIAS,total:10,queda:20,intervalo:4.6},{pool:PAL_MEDIAS,total:12,queda:18,intervalo:4}]},
 {nome:'Palavras grandes',cor:'#FFB347',desc:'Palavras de seis e sete letras. A missão final!',teclas:'',dedos:[],palavras:true,
  dicas:['Palavras grandes são só palavras pequenas coladas: <b>fo-gue-te</b>. Digite pedaço por pedaço.','Respire antes de cada meteoro. Um por vez.','Você chegou até aqui usando os dez dedos. Isso é o mais importante!'],
  fases:[{pool:PAL_GRANDES,total:8,queda:26,intervalo:6},{pool:PAL_GRANDES,total:10,queda:23,intervalo:5.4},{pool:PAL_CURTAS.concat(PAL_MEDIAS,PAL_GRANDES),total:14,queda:19,intervalo:4}]},
 {nome:'Frases bônus',cor:'#FFD166',desc:'Frases inteiras, com a barra de espaço entre as palavras. O desafio final!',teclas:'',dedos:[8],palavras:true,frases:true,
  dicas:['Agora caem <b>frases</b>. Entre uma palavra e outra você aperta a <b>barra de espaço</b> com o polegar.','Os polegares ficam sempre descansando em cima da barra de espaço. Qualquer um dos dois pode apertar.','Leia a frase inteira primeiro. Depois digite palavra por palavra, com o espaço no meio. Sem pressa: a frase mirada cai bem devagar.'],
  fases:[{pool:FRASES_1,total:6,queda:34,intervalo:9},{pool:FRASES_2,total:8,queda:30,intervalo:8},{pool:FRASES_1.concat(FRASES_2,FRASES_3),total:10,queda:27,intervalo:7}]}
];
var FASES=[]; MISSOES.forEach(function(m,mi){ m.fases.forEach(function(f,fi){ f.m=mi; f.i=fi; FASES.push(f); }); });
var N_FIXAS=FASES.length;   // as fases das frases da turma vêm depois destas

/* ======================================================================
   Frases da turma: ficam num SERVIDOR (endereço em servidor.js; guia em servidor/LEIAME.md)
   Cada turma usa um código de sala. Quem escreve e quem joga entram na mesma sala.
   Contrato do servidor (Apps Script ou Cloudflare, os dois iguais):
     GET  ?acao=listar&sala=X              → {ok:true, frases:[{id,t,a}]}
     POST {acao:'enviar', sala, t, a}      → {ok:true, frase:{id,t,a}}  ou {ok:false, erro:'...'}
     POST {acao:'apagar', sala, id, senha} → {ok:true}
   ====================================================================== */
var SERVIDOR=(typeof SERVIDOR_FRASES==='string'?SERVIDOR_FRASES:'').replace(/\s+/g,'');
function temServidor(){ return /^https?:\/\/\S+$/.test(SERVIDOR); }
var QUERY={}; location.search.replace(/^\?/,'').split('&').forEach(function(p){ if(!p) return; var i=p.indexOf('='); try{ QUERY[decodeURIComponent(i<0?p:p.slice(0,i))]=decodeURIComponent(i<0?'':p.slice(i+1).replace(/\+/g,' ')); }catch(e){} });
var CHAVE_SALA='invasao-sala';
var sala={cod:'',frases:[],ts:0,senha:''};   // frases: [{id,t,a}] (cópia local do que está no servidor)
try{ var ss=JSON.parse(localStorage.getItem(CHAVE_SALA)||'null'); if(ss&&typeof ss.cod==='string'){ sala=ss; sala.frases=sala.frases||[]; sala.senha=sala.senha||''; } }catch(e){}
if(QUERY.sala!==undefined){ var cs=limpaSala(QUERY.sala); if(cs&&cs!==sala.cod){ sala.cod=cs; sala.frases=[]; sala.ts=0; } }
var salaMudou=false;
function salvaSala(){ try{ localStorage.setItem(CHAVE_SALA,JSON.stringify({cod:sala.cod,frases:sala.frases.slice(0,400),ts:sala.ts,senha:sala.senha||''})); }catch(e){} montaMissaoTurma(); }
function limpaSala(t){ return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'').slice(0,20); }
function limpaFrase(t){   // só letras sem acento e espaços, como o jogo pede
  return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ç/g,'c').replace(/[^a-z ]+/g,' ').replace(/\s+/g,' ').trim();
}
function limpaNome(t){ return String(t||'').replace(/[<>|\n\r]/g,' ').replace(/\s+/g,' ').trim().slice(0,20); }
function checaFrase(t,lista){
  var f=limpaFrase(t),p=f?f.split(' '):[];
  if(!f) return 'Escreva uma frase com letras.';
  if(p.length<2) return 'A frase precisa ter pelo menos 2 palavras.';
  if(p.length>6) return 'Até 6 palavras, para caber no meteoro.';
  if(f.length>40) return 'Frase grande demais: até 40 letras.';
  for(var i=0;i<p.length;i++) if(p[i].length>12) return 'A palavra "'+p[i]+'" é comprida demais (até 12 letras).';
  if((lista||[]).some(function(x){ return x.t===f; })) return 'Essa frase já está na sala.';
  return '';
}
/* conversa com o servidor: GET para listar, POST (texto simples, sem preflight) para enviar e apagar */
function chamada(params,corpo){
  var ctrl=(typeof AbortController!=='undefined')?new AbortController():null; var tm=setTimeout(function(){ if(ctrl) ctrl.abort(); },20000);
  var url=SERVIDOR+(SERVIDOR.indexOf('?')>=0?'&':'?')+params+'&_='+Date.now();
  var op=corpo?{method:'POST',body:JSON.stringify(corpo),headers:{'Content-Type':'text/plain;charset=utf-8'}}:{method:'GET'};
  op.cache='no-store'; op.redirect='follow'; op.credentials='omit'; if(ctrl) op.signal=ctrl.signal;
  return fetch(url,op).then(function(r){ return r.text(); }).then(function(tx){
    clearTimeout(tm); var j=null; try{ j=JSON.parse(tx); }catch(e){} if(!j||typeof j!=='object') throw new Error('resposta');
    if(!j.ok){ var e2=new Error(j.erro||'servidor'); e2.doServidor=true; throw e2; } return j;
  },function(e){ clearTimeout(tm); throw e; });
}
function arrumaFrases(lista){ var vistas={},out=[]; (lista||[]).forEach(function(f){ var t=limpaFrase(f&&f.t); if(!t||vistas[t]) return; vistas[t]=1; out.push({id:String(f.id||''),t:t,a:limpaNome(f.a)}); }); return out; }
function apiListar(cod){ return chamada('acao=listar&sala='+encodeURIComponent(cod)).then(function(j){ return arrumaFrases(j.frases); }); }
function apiEnviar(cod,t,a){ return chamada('acao=enviar',{acao:'enviar',sala:cod,t:t,a:a}); }
function apiApagar(cod,id,senha){ return chamada('acao=apagar',{acao:'apagar',sala:cod,id:id,senha:senha||''}); }
var buscando=null;
function atualizaSala(){   // busca as frases da sala no servidor e guarda a cópia local
  if(!temServidor()||!sala.cod) return Promise.resolve(sala.frases);
  if(buscando) return buscando;
  buscando=apiListar(sala.cod).then(function(fr){ buscando=null; var antes=sala.frases.map(function(f){ return f.id+f.t; }).join('|'); sala.frases=fr; sala.ts=Date.now(); salaMudou=antes!==fr.map(function(f){ return f.id+f.t; }).join('|'); salvaSala(); return fr; },function(e){ buscando=null; throw e; });
  return buscando;
}
function entraSala(valor,fim){ var cod=limpaSala(valor); if(!cod) return false; if(cod!==sala.cod){ sala.cod=cod; sala.frases=[]; sala.ts=0; } salvaSala(); atualizaSala().then(function(){ fim(null); },function(e){ fim(e); }); return true; }
function textoErro(e){ return e&&e.doServidor?e.message:'Não consegui falar com o servidor de frases. Veja se a internet está ligada e tente de novo.'; }
var MISSAO_TURMA={nome:'Frases dos colegas',cor:'#FF8AD8',desc:'',teclas:'',dedos:[8],palavras:true,frases:true,turma:true,
  dicas:['Estas frases foram <b>escritas pelos seus colegas</b> na Oficina de frases. Leia a frase inteira primeiro e depois digite palavra por palavra, com a <b>barra de espaço</b> no meio.','Os polegares ficam descansando na barra de espaço. Qualquer um dos dois pode apertar.','Sem pressa: a frase mirada cai bem devagar. Olhe para a tela, não para o teclado.'],
  fases:[]};
function montaMissaoTurma(){
  var i=MISSOES.indexOf(MISSAO_TURMA); if(i>=0){ MISSOES.splice(i,1); } FASES.length=N_FIXAS;
  var fr=sala.frases.map(function(f){ return f.t; }); if(fr.length<3) return;
  var pool=fr.slice(); var autor={}; sala.frases.forEach(function(f){ autor[f.t]=f.a; });
  var t1=Math.min(6,fr.length),t2=Math.min(8,fr.length),t3=Math.min(10,fr.length);
  MISSAO_TURMA.desc=fr.length+' frases escritas pela turma da sala '+sala.cod.toUpperCase()+'. Digite com a barra de espaço entre as palavras.';
  MISSAO_TURMA.fases=[{pool:pool,autor:autor,total:t1,queda:36,intervalo:9},{pool:pool,autor:autor,total:t2,queda:32,intervalo:8},{pool:pool,autor:autor,total:t3,queda:28,intervalo:7}];
  MISSOES.push(MISSAO_TURMA); var mi=MISSOES.length-1; MISSAO_TURMA.fases.forEach(function(f,fi){ f.m=mi; f.i=fi; FASES.push(f); });
}
montaMissaoTurma();

/* alertas de quando um meteoro pousa */
var LEMBRETES=[
 'Volte os dedos para a <b>casa</b>: A S D F na esquerda e J K L na direita. Sinta os risquinhos do F e do J.',
 'Olhe para a <b>tela</b>, não para o teclado. A tecla acesa aqui embaixo mostra qual dedo usar.',
 'Cada dedo cuida das próprias teclas. Deixe o dedo certo fazer o trabalho e <b>volte para a casa</b>.',
 'Dedos <b>curvados</b>, como segurando uma bolinha, e pulsos levantados da mesa.'
];

/* ======================================================================
   Memória e ajustes
   ====================================================================== */
var CHAVE='invasao-v2';
var est={feitas:{},som:false,anim:true,livre:false,lento:false};
try{ var sv=JSON.parse(localStorage.getItem(CHAVE)||'null'); if(sv) for(var k in sv) est[k]=sv[k]; }catch(e){}
try{ if(!localStorage.getItem(CHAVE)&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) est.anim=false; }catch(e){}
function salva(){ try{ localStorage.setItem(CHAVE,JSON.stringify(est)); }catch(e){} }
var $=function(i){return document.getElementById(i)};
function el(tag,cls,html){ var d=document.createElement(tag); if(cls) d.className=cls; if(html!=null) d.innerHTML=html; return d; }
function txt(tag,cls,t){ var d=el(tag,cls); d.textContent=t; return d; }
function aplicaAnim(){ document.body.classList.toggle('sem-animacao',!est.anim); }

var ctx=null;
function tom(freqs,tipo){
  if(!est.som) return;
  try{
    ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
    freqs.forEach(function(f,i){
      var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.1;
      o.type=tipo||'sine'; o.frequency.value=f; g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(.07,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.3);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+.32);
    });
  }catch(e){}
}

var CHECK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var ESTRELA='<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7z" fill="#0B0F2E"/></svg>';
var NAVE='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="gn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF1FF"/><stop offset="1" stop-color="#9AA5E6"/></linearGradient></defs>'+
 '<path d="M60 8c18 16 26 40 26 70v14H34V78c0-30 8-54 26-70Z" fill="url(#gn)" stroke="#0B0F2E" stroke-width="3"/><path d="M34 70 14 92v14l20-8ZM86 70l20 22v14l-20-8Z" fill="#FF6B8A" stroke="#0B0F2E" stroke-width="3" stroke-linejoin="round"/>'+
 '<circle cx="60" cy="52" r="13" fill="#5CD6FF" stroke="#0B0F2E" stroke-width="3"/><circle cx="56" cy="48" r="4" fill="#fff" opacity=".8"/><path d="M48 92h24l-4 10H52Z" fill="#3A4380" stroke="#0B0F2E" stroke-width="3"/>'+
 '<path d="M52 104c2 10 6 14 8 16 2-2 6-6 8-16Z" fill="#FFD166"/><path d="M56 104c1 6 3 9 4 10 1-1 3-4 4-10Z" fill="#FF9F43"/></svg>';

/* ======================================================================
   Telas e navegação
   ====================================================================== */
var telaAtual='mapa';
function mostra(id){
  ['mapa','jogo','ajustes','oficina'].forEach(function(t){ $(t).classList.toggle('oculto',t!==id); });
  $('janela').classList.add('oculto'); janelaAcao=null;
  $('btPausa').classList.toggle('oculto',id!=='jogo'); $('topoMeio').style.visibility=id==='jogo'?'visible':'hidden';
  telaAtual=id; if(id==='jogo') tam(); if(id!=='oficina'&&ofTimer){ clearInterval(ofTimer); ofTimer=null; }
}
function aberta(i){ if(i>=N_FIXAS) return est.livre||i===N_FIXAS||!!est.feitas[i-1]||!!est.feitas[i]; return est.livre||i===0||!!est.feitas[i-1]||!!est.feitas[i]; }
function proxima(){ for(var i=0;i<N_FIXAS;i++) if(!est.feitas[i]) return i; return -1; }
var janelaAcao=null;
function janela(html,acao,classe){
  var j=$('janela'); j.innerHTML='<div class="cartao '+(classe||'')+'">'+html+'</div>'; j.classList.remove('oculto'); janelaAcao=acao;
  var b=j.querySelector('.bt-principal'); if(b){ b.onclick=acao; setTimeout(function(){ b.focus(); },50); }
  return j;
}
function fecha(){ $('janela').classList.add('oculto'); janelaAcao=null; }

/* ---------- mapa ---------- */
function mapa(){
  G.rodando=false;
  var t=$('mapa'); t.innerHTML='';
  var p=proxima(),n=Object.keys(est.feitas).length;
  var intro=el('div','intro',NAVE.replace('<svg ','<svg class="nave" '));
  var tx=el('div'); tx.appendChild(txt('h1',null,n===0?'Meteoros com letras estão caindo!':p<0?'Você completou todas as missões!':'Bem-vindo de volta, piloto!'));
  tx.appendChild(txt('p',null,n===0?'Digite o que está escrito em cada meteoro para destruí-lo. Cada missão ensina qual dedo cuida de cada tecla. Comece pela estrela que está piscando.'
    :p<0?'Pode repetir qualquer missão para treinar mais. Quanto mais você joga, mais os dedos aprendem sozinhos.':'A estrela que pisca mostra onde você parou. Pode repetir uma missão anterior também.'));
  intro.appendChild(tx); t.appendChild(intro);
  t.appendChild(cardOficina());
  var grade=el('div','missoes');
  MISSOES.forEach(function(m,mi){
    var c=el('article','missao'); c.style.setProperty('--cor',m.cor); c.style.animationDelay=(mi*.05)+'s';
    var completa=m.fases.every(function(f){ return est.feitas[FASES.indexOf(f)]; });
    var temAberta=m.fases.some(function(f){ return aberta(FASES.indexOf(f)); });
    if(!temAberta) c.classList.add('fechada');
    if(m.fases.some(function(f){ return FASES.indexOf(f)===p; })) c.classList.add('atual');
    if(m.turma) c.classList.add('turma');
    var topo=el('div','missao-topo'); topo.appendChild(m.turma?el('div','missao-num',ESTRELA):txt('div','missao-num',String(mi+1)));
    var h=txt('h2',null,m.nome); topo.appendChild(h);
    if(completa) topo.appendChild(el('span','selo-ok',CHECK+'Completa'));
    c.appendChild(topo); c.appendChild(txt('p',null,m.desc));
    if(m.teclas){ var tk=el('div','teclas'); m.teclas.split('').forEach(function(k){ var i=txt('i',null,k); i.style.setProperty('--kc',COR_DEDO[DEDO_DE[k]]); tk.appendChild(i); }); c.appendChild(tk); }
    var cs=el('div','constel');
    m.fases.forEach(function(f,fi){
      var gi=FASES.indexOf(f);
      if(fi>0) cs.appendChild(el('span','fio'+(est.feitas[gi-1]&&est.feitas[gi]?' feito':'')));
      var b=el('button','estrela');
      if(est.feitas[gi]){ b.classList.add('feita'); b.innerHTML=ESTRELA; b.setAttribute('aria-label','Fase '+(fi+1)+', feita'); }
      else if(aberta(gi)){ b.classList.add(gi===p?'proxima':'aberta'); b.textContent=fi+1; b.setAttribute('aria-label','Fase '+(fi+1)); }
      else { b.classList.add('trancada'); b.textContent=fi+1; b.setAttribute('aria-label','Fase '+(fi+1)+', ainda fechada'); }
      b.onclick=function(){ if(aberta(gi)) abreFase(gi); };
      cs.appendChild(b);
    });
    c.appendChild(cs); grade.appendChild(c);
  });
  t.appendChild(grade); mostra('mapa');
  if(temServidor()&&sala.cod&&Date.now()-sala.ts>8000){ atualizaSala().then(function(){ if(salaMudou&&telaAtual==='mapa') mapa(); },function(){}); }
}

/* ---------- ajustes ---------- */
function ajustes(){
  G.rodando=false;
  var t=$('ajustes'); t.innerHTML='';
  t.appendChild(txt('h2','titulo-tela','Ajustes'));
  t.appendChild(txt('p','texto-tela','Os ajustes ficam guardados neste computador.'));
  var box=el('div','ajustes');
  function chave(nome,desc,prop,fn){
    var b=el('button','ajuste'); b.setAttribute('role','switch'); b.setAttribute('aria-checked',est[prop]?'true':'false');
    var tx=txt('div','txt',nome); tx.appendChild(txt('small',null,desc)); b.appendChild(tx); b.appendChild(el('div','chave'));
    b.onclick=function(){ est[prop]=!est[prop]; salva(); b.setAttribute('aria-checked',est[prop]?'true':'false'); if(fn) fn(); };
    box.appendChild(b);
  }
  chave('Meteoros mais lentos','Dá mais tempo para achar a tecla. Bom para quem está começando.','lento');
  chave('Sons','Sons baixinhos nos tiros e explosões.','som');
  chave('Animações','Estrelas, rastros e efeitos. Desligue se incomodar.','anim',aplicaAnim);
  chave('Todas as missões abertas','Para o professor escolher qualquer fase.','livre');
  var r=el('button','ajuste perigo'); var rt=txt('div','txt','Recomeçar do zero'); rt.appendChild(txt('small',null,'Apaga o progresso deste computador.')); r.appendChild(rt);
  r.onclick=function(){ if(confirm('Apagar todo o progresso deste computador?')){ est.feitas={}; salva(); mapa(); } };
  var rf=el('button','ajuste'); var rft=txt('div','txt','Sair da sala de frases'); rft.appendChild(txt('small',null,sala.cod?'Este computador está na sala '+sala.cod.toUpperCase()+'.':'Este computador não está em nenhuma sala.')); rf.appendChild(rft);
  rf.onclick=function(){ sala.cod=''; sala.frases=[]; sala.ts=0; salvaSala(); ajustes(); };
  box.appendChild(r); box.appendChild(rf); t.appendChild(box); mostra('ajustes');
}

/* ======================================================================
   Oficina de frases (as frases vão para o servidor da sala)
   ====================================================================== */
var prof=false, ofTimer=null, rascunho={a:'',t:''};
function cardOficina(){
  var of=el('div','oficina-chamada'); var n=sala.frases.length;
  if(!temServidor()){
    of.innerHTML='<div class="of-txt"><b>Oficina de frases</b><span>O servidor de frases ainda não foi configurado. É rápido: veja o guia em <code>servidor/LEIAME.md</code>.</span></div>';
    var b0=el('button','bt-leve of-bt','Como configurar'); b0.onclick=function(){ oficina(); }; of.appendChild(b0); return of;
  }
  if(!sala.cod){
    of.innerHTML='<div class="of-txt"><b>Frases dos colegas</b><span>Digite o código da sala que a professora combinou. As frases escritas pela turma ficam lá.</span></div>';
    var f=el('form','of-sala'); f.innerHTML='<input id="salaMapa" maxlength="20" placeholder="código da sala" autocomplete="off" autocapitalize="off" aria-label="Código da sala"><button class="bt-leve of-bt" type="submit">Entrar</button>';
    f.onsubmit=function(e){ e.preventDefault(); var inp=f.querySelector('input'); if(!entraSala(inp.value,function(err){ mapa(); if(err) avisoRapido(textoErro(err)); })){ inp.focus(); } else { f.querySelector('button').textContent='Entrando...'; } };
    of.appendChild(f); return of;
  }
  of.innerHTML='<div class="of-txt"><b>Sala '+escapa(sala.cod.toUpperCase())+'</b><span>'+(n?n+(n===1?' frase escrita':' frases escritas')+' pela turma'+(n>=3?'. A missão <b>Frases dos colegas</b> está no fim do mapa.':'. Com 3 frases a missão aparece no mapa.'):'Ainda não há frases nesta sala. Abra a oficina para escrever.')+'</span></div>';
  var bts=el('div','of-bts');
  var bo=el('button','bt-leve of-bt','Abrir a oficina'); bo.onclick=function(){ oficina(); }; bts.appendChild(bo);
  var bt=el('button','bt-leve of-bt pequeno','Trocar sala'); bt.onclick=function(){ sala.cod=''; sala.frases=[]; sala.ts=0; salvaSala(); mapa(); }; bts.appendChild(bt);
  of.appendChild(bts); return of;
}
function avisoRapido(t){ var av=el('div','of-aviso erro flutua',t); document.body.appendChild(av); setTimeout(function(){ av.remove(); },4000); }
function oficina(msg,tipo){
  G.rodando=false; if(ofTimer){ clearInterval(ofTimer); ofTimer=null; }
  var t=$('oficina'); t.innerHTML='';
  var cab=el('div','intro of-intro',NAVE.replace('<svg ','<svg class="nave" '));
  var tx=el('div'); tx.appendChild(txt('h1',null,'Oficina de frases'));
  tx.appendChild(el('p',null,'Escreva uma frase para os colegas digitarem no jogo. Use só <b>letras e espaços</b>: o jogo tira acentos e pontos sozinho. De 2 a 6 palavras.'));
  cab.appendChild(tx); t.appendChild(cab);
  var volta=el('div','linha-bts'); var bv=el('button','bt-leve','Voltar às missões'); bv.onclick=mapa; volta.appendChild(bv);
  if(!temServidor()){
    var cfg=el('div','of-prof');
    cfg.innerHTML='<h2 class="titulo-tela">Falta configurar o servidor de frases</h2>'+
      '<p class="texto-tela">As frases da turma precisam de um lugar na internet para ficar. O guia <b>servidor/LEIAME.md</b> no repositório do jogo mostra duas opções, as duas gratuitas:</p>'+
      '<ul class="lista"><li><span class="n">1</span><span><b>Google Apps Script</b> (recomendado): cole o código em script.google.com, publique como app da web e as frases ficam numa planilha do seu Google Drive.</span></li>'+
      '<li><span class="n">2</span><span><b>Cloudflare Worker</b>: dois segredos no GitHub e o GitHub Actions publica o servidor sozinho.</span></li></ul>'+
      '<p class="texto-tela">Depois, cole o endereço do servidor no arquivo <b>servidor.js</b> do jogo. Pronto: o botão da oficina aparece para todo mundo.</p>';
    t.appendChild(cfg); t.appendChild(volta); mostra('oficina'); return;
  }
  if(!sala.cod){
    var fs=el('form','of-form');
    fs.innerHTML='<label class="of-campo grande"><span>Código da sala (a professora combina com a turma)</span><input id="ofSala" maxlength="20" autocomplete="off" autocapitalize="off" placeholder="foguete" required></label><div class="linha-bts esq"><button class="bt-principal" type="submit">Entrar na sala</button></div>';
    fs.onsubmit=function(e){ e.preventDefault(); var inp=fs.querySelector('input'); var b=fs.querySelector('.bt-principal'); b.disabled=true; b.textContent='Entrando...'; if(!entraSala(inp.value,function(err){ oficina(err?textoErro(err):null,err?'erro':null); })){ b.disabled=false; b.textContent='Entrar na sala'; inp.focus(); } };
    t.appendChild(fs); t.appendChild(volta); mostra('oficina'); setTimeout(function(){ fs.querySelector('input').focus(); },80); return;
  }
  var barra=el('div','of-salabar'); barra.innerHTML='<span>Sala <b>'+escapa(sala.cod.toUpperCase())+'</b></span>';
  var ba=el('button','bt-leve pequeno','Atualizar'); ba.onclick=function(){ ba.textContent='Atualizando...'; atualizaSala().then(function(){ oficina(); },function(e){ oficina(textoErro(e),'erro'); }); }; barra.appendChild(ba);
  var bt=el('button','bt-leve pequeno','Trocar sala'); bt.onclick=function(){ sala.cod=''; sala.frases=[]; sala.ts=0; salvaSala(); oficina(); }; barra.appendChild(bt);
  t.appendChild(barra);
  if(msg){ t.appendChild(el('div','of-aviso '+(tipo||'bom'),msg)); }
  var form=el('form','of-form');
  form.innerHTML='<label class="of-campo"><span>Seu nome (pode deixar em branco)</span><input id="ofNome" maxlength="20" autocomplete="off" placeholder="Ana"></label>'+
    '<label class="of-campo grande"><span>A frase</span><input id="ofFrase" maxlength="60" autocomplete="off" placeholder="o gato pulou o muro" required></label>'+
    '<div class="of-previa" id="ofPrevia"><span>No meteoro vai aparecer:</span><b>...</b></div>'+
    '<div class="linha-bts esq"><button class="bt-principal" type="submit">Enviar frase</button></div>';
  t.appendChild(form);
  var inN=form.querySelector('#ofNome'),inF=form.querySelector('#ofFrase'),pv=form.querySelector('#ofPrevia'),bE=form.querySelector('.bt-principal');
  inN.value=rascunho.a; inF.value=rascunho.t;
  function previa(){ var f=limpaFrase(inF.value),erro=inF.value.trim()?checaFrase(inF.value,sala.frases):''; pv.querySelector('b').textContent=f?f.toUpperCase():'...'; pv.classList.toggle('erro',!!erro); pv.querySelector('span').textContent=erro||'No meteoro vai aparecer:'; }
  inF.oninput=previa; previa();
  form.onsubmit=function(e){
    e.preventDefault(); var erro=checaFrase(inF.value,sala.frases); if(erro){ previa(); inF.focus(); tom([220],'triangle'); return; }
    var fr=limpaFrase(inF.value),nome=limpaNome(inN.value); rascunho={a:nome,t:inF.value};
    bE.disabled=true; bE.textContent='Enviando...'; form.classList.add('enviando');
    function deuCerto(){ rascunho.t=''; tom([523,659,784]); oficina('Frase enviada! Ela vai cair como meteoro para os colegas. Já são '+sala.frases.length+' frases na sala.','bom'); setTimeout(function(){ var i=$('ofFrase'); if(i) i.focus(); },50); }
    apiEnviar(sala.cod,fr,nome).then(function(){ return atualizaSala().then(deuCerto,deuCerto); },function(err){
      if(err&&err.doServidor){ oficina(err.message,'erro'); return; }
      // a resposta pode ter se perdido no caminho: confere se a frase chegou
      atualizaSala().then(function(fr2){ if(fr2.some(function(x){ return x.t===fr; })) deuCerto(); else oficina(textoErro(err),'erro'); },function(){ oficina(textoErro(err),'erro'); });
    });
  };
  var lt=el('div','of-lista-topo'); var h2=txt('h2','titulo-tela',''); lt.appendChild(h2);
  var bp=el('button','bt-leve',prof?'Fechar modo professor':'Modo professor'); bp.onclick=function(){ prof=!prof; oficina(); }; lt.appendChild(bp); t.appendChild(lt);
  var dica=txt('p','texto-tela',''); t.appendChild(dica);
  var ul=el('ul','of-lista'); t.appendChild(ul);
  function desenhaLista(){
    var n=sala.frases.length; h2.textContent=n?n+(n===1?' frase na sala':' frases na sala'):'Nenhuma frase na sala ainda';
    dica.textContent=n<3?'Com 3 frases ou mais, aparece no mapa a missão "Frases dos colegas".':'A lista atualiza sozinha. As frases novas dos colegas aparecem aqui.';
    ul.innerHTML='';
    sala.frases.slice().reverse().forEach(function(f,k){
      var li=el('li'); li.style.animationDelay=(Math.min(k,12)*.03)+'s'; li.innerHTML='<span class="of-met">'+ESTRELA+'</span><div class="of-txt2"><b>'+escapa(f.t.toUpperCase())+'</b><small>'+(f.a?'de '+escapa(f.a):'sem nome')+'</small></div>';
      if(prof){ var bx=el('button','of-x','Apagar'); bx.setAttribute('aria-label','Apagar a frase '+f.t); bx.onclick=function(){ bx.disabled=true; bx.textContent='...'; apiApagar(sala.cod,f.id,sala.senha).then(function(){ return atualizaSala(); }).then(function(){ oficina('Frase apagada.','bom'); },function(e){ oficina(textoErro(e),'erro'); }); }; li.appendChild(bx); }
      ul.appendChild(li);
    });
  }
  desenhaLista();
  if(prof){
    var cx2=el('div','of-prof');
    cx2.innerHTML='<h2 class="titulo-tela">Modo professor</h2>'+
      '<p class="texto-tela">As frases desta sala ficam no servidor: qualquer computador que entrar na sala <b>'+escapa(sala.cod.toUpperCase())+'</b> vê as mesmas frases. Para apagar uma frase, use o botão Apagar na lista. No Google Apps Script, elas também aparecem na planilha "Invasão das Letras - frases" do seu Drive.</p>'+
      '<label class="of-campo"><span>Senha do professor (só se você definiu uma no servidor)</span><input id="ofSenha" type="password" maxlength="40" autocomplete="off" value="'+escapa(sala.senha||'')+'"></label>'+
      '<div class="linha-bts esq"><button class="bt-leve" id="ofLinkSala" type="button">Copiar link da sala para jogar</button><button class="bt-leve" id="ofLinkOf" type="button">Copiar link da oficina</button></div>'+
      '<p class="of-msg" id="ofMsg" aria-live="polite"></p>';
    t.appendChild(cx2);
    var msgEl=cx2.querySelector('#ofMsg'); var diz=function(m){ msgEl.textContent=m; };
    cx2.querySelector('#ofSenha').onchange=function(){ sala.senha=this.value; salvaSala(); diz('Senha guardada neste computador.'); };
    var copia=function(texto,ok){ var feito=function(){ diz(ok+' '+texto); }; if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(texto).then(feito,function(){ diz('Copie este endereço: '+texto); }); } else diz('Copie este endereço: '+texto); };
    var base=location.origin+location.pathname;
    cx2.querySelector('#ofLinkSala').onclick=function(){ copia(base+'?sala='+encodeURIComponent(sala.cod),'Link copiado. Abra nos computadores da turma que vai jogar:'); };
    cx2.querySelector('#ofLinkOf').onclick=function(){ copia(base+'?sala='+encodeURIComponent(sala.cod)+'&oficina=1','Link copiado. Abra nos computadores da turma que vai escrever:'); };
  }
  t.appendChild(volta);
  mostra('oficina'); setTimeout(function(){ if(!msg||tipo==='erro') inF.focus(); },80);
  // a lista se atualiza sozinha enquanto a oficina está aberta
  ofTimer=setInterval(function(){ if(telaAtual!=='oficina'){ clearInterval(ofTimer); ofTimer=null; return; } atualizaSala().then(function(){ if(salaMudou&&telaAtual==='oficina') desenhaLista(); },function(){}); },15000);
}
function escapa(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }

/* ======================================================================
   Teclado na tela
   ====================================================================== */
var TK={};
(function(){
  var tec=$('teclado');
  LINHAS.forEach(function(l){
    var d=el('div','linha');
    l.split('').forEach(function(c){
      var k=el('button','tecla'+((c==='f'||c==='j')?' casa':''),c); k.style.setProperty('--k',COR_DEDO[DEDO_DE[c]]);
      k.setAttribute('aria-label','tecla '+c.toUpperCase()); k.tabIndex=-1; k.disabled=true; TK[c]=k; d.appendChild(k);
    });
    tec.appendChild(d);
  });
  var le=el('div','linha'); var ke=el('button','tecla espaco','espaço'); ke.style.setProperty('--k',COR_DEDO[8]); ke.setAttribute('aria-label','barra de espaço'); ke.tabIndex=-1; ke.disabled=true; TK[' ']=ke; le.appendChild(ke); tec.appendChild(le);
  var lg=$('legenda');
  lg.innerHTML='<span><b style="background:'+COR_DEDO[0]+'"></b>mindinho</span><span><b style="background:'+COR_DEDO[1]+'"></b>anelar</span><span><b style="background:'+COR_DEDO[2]+'"></b>médio</span><span><b style="background:'+COR_DEDO[3]+'"></b>indicador</span><span class="sep"></span><span>mão esquerda</span>'+
    '<span class="sep"></span><span><b style="background:'+COR_DEDO[8]+'"></b>polegar (espaço)</span><span class="sep"></span><span>mão direita</span><span class="sep"></span><span><b style="background:'+COR_DEDO[4]+'"></b>indicador</span><span><b style="background:'+COR_DEDO[5]+'"></b>médio</span><span><b style="background:'+COR_DEDO[6]+'"></b>anelar</span><span><b style="background:'+COR_DEDO[7]+'"></b>mindinho</span>';
})();
function visivel(m){ return m.y-m.r>=0; }   // o meteoro inteiro já entrou na tela
function marcaProx(){
  var c=null;
  if(G.alvo) c=G.alvo.pal[G.alvo.dig];
  else { var baixo=null; G.met.forEach(function(m){ if(!m.morto&&visivel(m)&&(!baixo||m.y>baixo.y)) baixo=m; }); if(baixo) c=baixo.pal[0]; }
  if(c===G.proxMarcada) return; G.proxMarcada=c;
  for(var k in TK) TK[k].classList.remove('prox');
  if(c&&TK[c]) TK[c].classList.add('prox');
  var av=$('avisoDedo');
  if(c&&DEDO_DE[c]!==undefined){ var d=DEDO_DE[c]; av.innerHTML='<span class="bola" style="background:'+COR_DEDO[d]+'"></span><span><b>'+nomeTecla(c)+'</b> · '+NOME_DEDO[d]+(d===8?'':' da mão '+mao(d))+'</span>'; av.classList.add('ver'); }
  else av.classList.remove('ver');
}
function piscaTecla(c,cls){ var k=TK[c]; if(!k) return; k.classList.remove(cls); void k.offsetWidth; k.classList.add(cls); setTimeout(function(){ k.classList.remove(cls); },300); }

/* ======================================================================
   O jogo
   ====================================================================== */
var cv=$('cv'),cx=cv.getContext('2d'),W=800,H=500,chao=460,DPR=1;
var G={fase:0,met:[],alvo:null,lancados:0,destruidos:0,caidos:0,t:0,proxLanc:0,rodando:false,pausado:false,part:[],lasers:[],ondas:[],proxMarcada:null,lembrete:0};
function tam(){
  var r=cv.parentNode.getBoundingClientRect(); if(!r.width) return;
  DPR=Math.min(2,window.devicePixelRatio||1); W=r.width; H=r.height; chao=H-46;
  cv.width=W*DPR; cv.height=H*DPR; cx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize',function(){ tam(); tamFundo(); });

function abreFase(i){
  G.fase=i; var F=FASES[i],M=MISSOES[F.m];
  if(F.i===0) return dicasMissao(M,0,function(){ preparaFase(i); });
  preparaFase(i);
}
function dicasMissao(M,pag,fim){
  var d=M.dicas[pag],ult=pag===M.dicas.length-1;
  var teclasHtml='';
  if(M.teclas&&pag===0){ teclasHtml='<div class="teclas-grandes">'+M.teclas.split('').slice(0,10).map(function(k){ return '<i style="--kc:'+COR_DEDO[DEDO_DE[k]]+'">'+k+'</i>'; }).join('')+'</div>'; }
  janela('<div class="rotulo">'+(M.turma?'Frases dos colegas':'Missão '+(MISSOES.indexOf(M)+1))+' · dica '+(pag+1)+' de '+M.dicas.length+'</div><h2 id="janelaTit">'+M.nome+'</h2>'+teclasHtml+
    '<div class="dica"><div class="maos">'+maos(M.dedos.length?M.dedos:null,{numeros:true})+'</div><div class="txt">'+d+'</div></div>'+
    '<div class="linha-bts">'+(pag>0?'<button class="bt-leve" id="btAnt">Voltar</button>':'')+'<button class="bt-principal'+(ult?'':' sol')+'">'+(ult?'Começar a missão':'Próxima dica')+'</button></div>'+
    '<div class="atalho">Aperte <kbd>Enter</kbd> para continuar</div>',
    function(){ if(ult) fim(); else dicasMissao(M,pag+1,fim); });
  var ba=$('btAnt'); if(ba) ba.onclick=function(){ dicasMissao(M,pag-1,fim); };
  $('janela').querySelector('.cartao').style.setProperty('--cor',M.cor);
}
function preparaFase(i){
  G.fase=i; var F=FASES[i],M=MISSOES[F.m];
  mostra('jogo'); G.rodando=false; G.met=[]; G.alvo=null; G.part=[]; G.lasers=[]; G.ondas=[]; hud();
  var oque=M.palavras?'Digite a <b>palavra inteira</b> de cada meteoro, uma letra por vez.':'Digite a <b>letra</b> de cada meteoro antes que ele chegue ao planeta.';
  janela('<div class="rotulo">'+(M.turma?'Frases dos colegas':'Missão '+(F.m+1))+' · fase '+(F.i+1)+' de '+M.fases.length+'</div><h2 id="janelaTit">'+M.nome+'</h2><p>'+oque+' São <b>'+F.total+' meteoros</b>. O meteoro que você está mirando cai mais devagar.</p>'+
    (F.i>0?'<div class="dica"><div class="maos">'+maos(M.dedos.length?M.dedos:null)+'</div><div class="txt">'+M.dicas[F.i%M.dicas.length]+'</div></div>':'')+
    '<div class="linha-bts"><button class="bt-principal">Começar</button><button class="bt-leve" id="btMapaJ">Missões</button></div><div class="atalho">Aperte <kbd>Enter</kbd> para começar · <kbd>Esc</kbd> pausa</div>',comecaFase);
  $('btMapaJ').onclick=mapa; $('janela').querySelector('.cartao').style.setProperty('--cor',M.cor);
}
function comecaFase(){
  fecha(); tam(); G.met=[]; G.alvo=null; G.lancados=0; G.destruidos=0; G.caidos=0; G.t=0; G.proxLanc=.3; G.part=[]; G.lasers=[]; G.ondas=[]; G.proxMarcada=null;
  G.rodando=true; G.pausado=false; hud(); marcaProx();
}
function hud(){
  var F=FASES[G.fase],M=MISSOES[F.m];
  $('chipMissao').innerHTML='<span style="width:12px;height:12px;border-radius:50%;background:'+M.cor+'"></span>'; $('chipMissao').appendChild(txt('span',null,M.turma?M.nome:'Missão '+(F.m+1)+': '+M.nome));
  var ps=$('passos'); ps.innerHTML=''; M.fases.forEach(function(f,fi){ var d=el('i'); if(est.feitas[FASES.indexOf(f)]) d.className='f'; if(fi===F.i) d.className='a'; ps.appendChild(d); });
  var falta=F.total-G.destruidos; $('restam').innerHTML='<span>Meteoros</span><b>'+falta+'</b><span class="barra"><i style="width:'+(G.destruidos/F.total*100)+'%"></i></span>';
}
function fator(){ return est.lento?1.25:.85; }
function lanca(){
  var F=FASES[G.fase],pool=typeof F.pool==='string'?F.pool.split(''):F.pool;
  var usadas={}; G.met.forEach(function(m){ if(!m.morto) usadas[m.pal[0]]=1; });
  var ops=pool.filter(function(p){ return !usadas[p[0]]&&p!==G.ultima; }); if(!ops.length) ops=pool;
  var pal=ops[Math.floor(Math.random()*ops.length)]; G.ultima=pal;
  var frase=pal.indexOf(' ')>=0;
  var raio=frase?46:Math.max(30,16+pal.length*10);
  var marg=Math.max(raio,pal.length*8)+30;
  var x=marg+Math.random()*Math.max(1,W-2*marg);
  G.met.push({pal:pal,autor:F.autor?F.autor[pal]:'',dig:0,x:x,y:-raio,r:raio,vel:(chao+raio)/(F.queda*fator()),morto:false,giro:Math.random()*6.28,vgiro:(Math.random()-.5)*.8,tom:Math.random()});
  G.lancados++;
}
function tecla(c){
  if(!G.rodando||G.pausado) return;
  if(!G.alvo){
    var cand=null; G.met.forEach(function(m){ if(!m.morto&&visivel(m)&&m.pal[0]===c&&(!cand||m.y>cand.y)) cand=m; });
    if(!cand){ piscaTecla(c,'ops'); tom([220],'triangle'); return; }
    G.alvo=cand; G.alvo.dig=1; tiro(cand);
  } else {
    if(G.alvo.pal[G.alvo.dig]===c){ G.alvo.dig++; tiro(G.alvo); }
    else { piscaTecla(c,'ops'); tom([220],'triangle'); return; }
  }
  piscaTecla(c,'apertou'); tom([660]);
  if(G.alvo.dig>=G.alvo.pal.length){ explode(G.alvo); G.alvo.morto=true; G.alvo=null; G.destruidos++; tom([523,784]); hud(); }
}
function tiro(m){ G.lasers.push({x:m.x,y:m.y,v:.18}); }
function explode(m){
  for(var i=0;i<26;i++){ var a=Math.random()*6.28,s=80+Math.random()*200; G.part.push({x:m.x,y:m.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,v:.8,cor:i%3===0?'#FFD166':i%3===1?'#FF9F43':'#FFF'}); }
  G.ondas.push({x:m.x,y:m.y,r:m.r,v:.5});
}
function pousou(m){
  m.morto=true; if(G.alvo===m) G.alvo=null; G.caidos++; G.rodando=false; tom([196,147],'triangle');
  G.ondas.push({x:m.x,y:chao,r:m.r,v:.6,poeira:true});
  var c=m.dig<m.pal.length?m.pal[m.dig]:m.pal[0],d=DEDO_DE[c],F=FASES[G.fase],M=MISSOES[F.m];
  if(G.caidos>=3){
    janela('<div class="rotulo">Vamos parar um pouquinho</div><h2 id="janelaTit">Três meteoros pousaram</h2>'+
      '<p>Tudo bem, isso acontece. Antes de continuar, vamos <b>arrumar as mãos</b> com calma. Faça cada passo:</p>'+
      '<div class="maos-grande">'+maos(null,{numeros:true})+'</div>'+
      '<ul class="lista"><li><span class="n">1</span><span>Tire as mãos do teclado, sacuda os dedos e respire fundo.</span></li>'+
      '<li><span class="n">2</span><span>Ache os <b>risquinhos</b> do F e do J com os indicadores, sem olhar.</span></li>'+
      '<li><span class="n">3</span><span>Encoste os outros dedos: A S D na esquerda e K L Ç na direita. Polegares na barra de espaço.</span></li>'+
      '<li><span class="n">4</span><span>Olhe para a <b>tela</b>. A tecla acesa embaixo mostra o dedo certo, com a cor dele.</span></li></ul>'+
      '<div class="linha-bts"><button class="bt-principal">Mãos no lugar, recomeçar a fase</button><button class="bt-leve" id="btMapaJ">Missões</button></div><div class="atalho">Aperte <kbd>Enter</kbd> quando estiver pronto</div>',
      function(){ comecaFase(); },'firme');
    $('btMapaJ').onclick=mapa; return;
  }
  var lembrete=LEMBRETES[G.lembrete++%LEMBRETES.length];
  janela('<div class="rotulo">Um meteoro pousou · '+G.caidos+' de 3</div><h2 id="janelaTit">Sem problema. Vamos ajeitar as mãos!</h2>'+
    '<div class="dica"><div class="maos">'+maos(d!==undefined?[d]:M.dedos,{numeros:true})+'</div><div class="txt">'+(d!==undefined?dicaTecla(c)+'<br><br>':'')+lembrete+'</div></div>'+
    '<p>Quando as mãos estiverem no lugar, continue. O jogo segue de onde parou.</p>'+
    '<div class="linha-bts"><button class="bt-principal">Mãos no lugar, continuar</button></div><div class="atalho">Aperte <kbd>Enter</kbd> quando estiver pronto</div>',
    function(){ fecha(); G.rodando=true; G.pausado=false; },'alerta');
}
function fimFase(){
  G.rodando=false; var F=FASES[G.fase],M=MISSOES[F.m],novo=!est.feitas[G.fase]; est.feitas[G.fase]=1; salva(); tom([523,659,784,1046]);
  var ult=G.fase===N_FIXAS-1||G.fase===FASES.length-1,fimMissao=F.i===M.fases.length-1;
  var tit=fimMissao?'Missão completa!':'Fase completa!';
  var sub=fimMissao?(ult?(M.turma?'Você digitou as frases escritas pelos seus colegas. Que tal escrever as suas na Oficina de frases?':'Você terminou todas as missões, até as frases bônus, usando os dez dedos. Isso é o que importa!'):'A próxima missão ensina um pedaço novo do teclado.'):'Mais uma estrela na sua constelação.';
  var msgCaidos=G.caidos===0?'Nenhum meteoro pousou nesta fase!':G.caidos===1?'Um meteoro pousou, e você ajeitou as mãos e seguiu em frente.':'Alguns meteoros pousaram e você continuou. Isso é treinar!';
  janela('<div class="rotulo">Missão '+(F.m+1)+' · fase '+(F.i+1)+'</div><div class="medalha">'+ESTRELA+'</div><h2 id="janelaTit">'+tit+'</h2><p>'+sub+'</p><p>'+msgCaidos+'</p>'+
    '<div class="linha-bts"><button class="bt-principal">'+(ult?'Ver as missões':'Continuar')+'</button>'+(ult?'':'<button class="bt-leve" id="btMapaJ">Missões</button>')+'</div><div class="atalho">Aperte <kbd>Enter</kbd></div>',
    function(){ if(ult) mapa(); else abreFase(G.fase+1); });
  var bm=$('btMapaJ'); if(bm) bm.onclick=mapa;
  $('janela').querySelector('.cartao').style.setProperty('--cor',M.cor);
  confete();
}
function pausa(){
  if(!G.rodando) return;
  G.pausado=true;
  janela('<div class="rotulo">Pausa</div><h2 id="janelaTit">O jogo está parado</h2><p>Aproveite para colocar os dedos na casa: A S D F e J K L.</p><div class="maos-grande">'+maos(null,{numeros:true})+'</div>'+
    '<div class="linha-bts"><button class="bt-principal">Continuar</button><button class="bt-leve" id="btMapaJ">Missões</button></div><div class="atalho">Aperte <kbd>Enter</kbd> ou <kbd>Esc</kbd></div>',
    function(){ fecha(); G.pausado=false; });
  $('btMapaJ').onclick=mapa;
}
function confete(){
  if(!est.anim) return;
  for(var i=0;i<40;i++){ var a=Math.random()*6.28,s=100+Math.random()*260; G.part.push({x:W/2,y:H*.4,vx:Math.cos(a)*s,vy:Math.sin(a)*s-120,v:1.6,cor:COR_DEDO[i%8]}); }
}

function passo(dt){
  G.part.forEach(function(p){ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=160*dt; p.v-=dt; }); G.part=G.part.filter(function(p){ return p.v>0; });
  G.lasers.forEach(function(l){ l.v-=dt; }); G.lasers=G.lasers.filter(function(l){ return l.v>0; });
  G.ondas.forEach(function(o){ o.v-=dt; }); G.ondas=G.ondas.filter(function(o){ return o.v>0; });
  if(!G.rodando||G.pausado) return;
  var F=FASES[G.fase]; G.t+=dt; G.proxLanc-=dt;
  var vivos=G.met.filter(function(m){ return !m.morto; }).length;
  if(G.proxLanc<=0&&G.lancados<F.total&&vivos<4){ lanca(); G.proxLanc=F.intervalo*fator(); }
  for(var i=0;i<G.met.length;i++){ var m=G.met[i]; if(m.morto) continue;
    var lento=(G.alvo===m)?.35:1; m.y+=m.vel*dt*lento; m.giro+=m.vgiro*dt;
    if(m.y+m.r*.4>=chao){ pousou(m); break; }
  }
  G.met=G.met.filter(function(m){ return !m.morto; });
  if(G.lancados>=F.total&&G.met.length===0&&G.rodando) fimFase();
}

/* ---------- desenho ---------- */
var IMG_NAVE=new Image(); IMG_NAVE.src='data:image/svg+xml;utf8,'+encodeURIComponent(NAVE);
function desenha(){
  cx.clearRect(0,0,W,H);
  // planeta
  var g=cx.createLinearGradient(0,chao-10,0,H); g.addColorStop(0,'#2FB86A'); g.addColorStop(1,'#146B3A');
  cx.fillStyle=g; cx.beginPath(); cx.moveTo(0,H); cx.lineTo(0,chao+8); cx.quadraticCurveTo(W/2,chao-26,W,chao+8); cx.lineTo(W,H); cx.closePath(); cx.fill();
  cx.fillStyle='rgba(255,255,255,.12)'; for(var x=20;x<W;x+=70){ cx.beginPath(); cx.ellipse(x,chao+4-Math.sin(x/W*3.14)*14,14,4,0,0,6.28); cx.fill(); }
  // nave
  var bx=W/2,by=chao-6; if(IMG_NAVE.complete) cx.drawImage(IMG_NAVE,bx-34,by-62,68,68);
  // lasers
  G.lasers.forEach(function(l){ var a=l.v/.18; cx.strokeStyle='rgba(255,209,102,'+a+')'; cx.lineWidth=5; cx.lineCap='round'; cx.beginPath(); cx.moveTo(bx,by-50); cx.lineTo(l.x,l.y); cx.stroke();
    cx.strokeStyle='rgba(255,255,255,'+a*.8+')'; cx.lineWidth=2; cx.stroke(); });
  // meteoros
  G.met.forEach(function(m){
    var mir=(G.alvo===m);
    if(est.anim){ // rastro
      var tr=cx.createLinearGradient(m.x,m.y-m.r*2.4,m.x,m.y); tr.addColorStop(0,'rgba(255,159,67,0)'); tr.addColorStop(1,mir?'rgba(255,209,102,.55)':'rgba(255,159,67,.35)');
      cx.fillStyle=tr; cx.beginPath(); cx.moveTo(m.x-m.r*.55,m.y); cx.lineTo(m.x,m.y-m.r*2.4); cx.lineTo(m.x+m.r*.55,m.y); cx.closePath(); cx.fill();
    }
    var rg=cx.createRadialGradient(m.x-m.r*.35,m.y-m.r*.35,m.r*.1,m.x,m.y,m.r);
    if(mir){ rg.addColorStop(0,'#FFB870'); rg.addColorStop(1,'#C2410C'); } else { rg.addColorStop(0,'#B08968'); rg.addColorStop(1,'#5C3D22'); }
    cx.fillStyle=rg; cx.beginPath(); cx.arc(m.x,m.y,m.r,0,6.28); cx.fill();
    cx.fillStyle='rgba(0,0,0,.22)'; [[.4,-.3,.22],[-.15,.45,.16],[.45,.35,.12]].forEach(function(cr){ var a=m.giro; var px=m.x+(cr[0]*Math.cos(a)-cr[1]*Math.sin(a))*m.r,py=m.y+(cr[0]*Math.sin(a)+cr[1]*Math.cos(a))*m.r; cx.beginPath(); cx.arc(px,py,m.r*cr[2],0,6.28); cx.fill(); });
    if(mir){ cx.strokeStyle='#FFD166'; cx.lineWidth=4; cx.setLineDash([8,6]); cx.lineDashOffset=-G.t*40; cx.beginPath(); cx.arc(m.x,m.y,m.r+8,0,6.28); cx.stroke(); cx.setLineDash([]); }
    // etiqueta
    var fs=m.pal.length>1?Math.min(28,Math.max(20,m.r*.7)):Math.max(28,m.r*.95); if(m.pal.length>9) fs=Math.min(fs,24);
    cx.font='700 '+fs+'px Fredoka, Nunito, sans-serif'; cx.textBaseline='middle'; cx.textAlign='left';
    var larg=cx.measureText(m.pal.toUpperCase()).width,x0=m.x-larg/2;
    cx.fillStyle='rgba(11,15,46,.55)'; roundRect(x0-10,m.y-fs*.7,larg+20,fs*1.4,10); cx.fill();
    var feito=m.pal.slice(0,m.dig).toUpperCase(),falta=m.pal.slice(m.dig).toUpperCase();
    // o espaço que falta aparece como um tracinho, para a criança ver que precisa apertar a barra
    if(falta.charAt(0)===' '){ falta='_'+falta.slice(1); }
    cx.fillStyle='#FFD166'; cx.fillText(feito,x0,m.y+1);
    var wf=cx.measureText(feito).width;
    // próxima letra na cor do dedo
    var prox=falta.charAt(0),resto=falta.slice(1),d=DEDO_DE[prox==='_'?' ':prox.toLowerCase()];
    cx.fillStyle=d!==undefined?COR_DEDO[d]:'#fff'; cx.fillText(prox,x0+wf,m.y+1);
    cx.fillStyle='#fff'; cx.fillText(resto,x0+wf+cx.measureText(prox).width,m.y+1);
    if(m.autor){ cx.font='800 13px Nunito, sans-serif'; cx.textAlign='center'; cx.fillStyle='rgba(11,15,46,.55)'; var la=cx.measureText('frase de '+m.autor).width; roundRect(m.x-la/2-8,m.y+fs*.75,la+16,20,8); cx.fill(); cx.fillStyle='#FF8AD8'; cx.fillText('frase de '+m.autor,m.x,m.y+fs*.75+10); }
  });
  G.ondas.forEach(function(o){ var k=1-o.v/(o.poeira?.6:.5); cx.strokeStyle=o.poeira?'rgba(180,200,220,'+(1-k)*.7+')':'rgba(255,209,102,'+(1-k)+')'; cx.lineWidth=o.poeira?6:4;
    cx.beginPath(); if(o.poeira){ cx.ellipse(o.x,o.y,o.r*(1+k*2),o.r*.35*(1+k),0,0,6.28); } else cx.arc(o.x,o.y,o.r*(1+k*1.6),0,6.28); cx.stroke(); });
  G.part.forEach(function(p){ cx.globalAlpha=Math.max(0,Math.min(1,p.v)); cx.fillStyle=p.cor; cx.beginPath(); cx.arc(p.x,p.y,4,0,6.28); cx.fill(); }); cx.globalAlpha=1;
}
function roundRect(x,y,w,h,r){ cx.beginPath(); cx.moveTo(x+r,y); cx.arcTo(x+w,y,x+w,y+h,r); cx.arcTo(x+w,y+h,x,y+h,r); cx.arcTo(x,y+h,x,y,r); cx.arcTo(x,y,x+w,y,r); cx.closePath(); }

/* fundo: estrelas que piscam */
var fc=$('fundo'),fx=fc.getContext('2d'),ESTRELAS=[];
function tamFundo(){ fc.width=innerWidth; fc.height=innerHeight; ESTRELAS=[]; for(var i=0;i<140;i++) ESTRELAS.push({x:Math.random()*fc.width,y:Math.random()*fc.height,r:Math.random()*1.5+.4,f:Math.random()*6.28,v:.5+Math.random()*1.5}); }
function desenhaFundo(t){
  fx.clearRect(0,0,fc.width,fc.height);
  ESTRELAS.forEach(function(s){ var a=est.anim?.35+.45*(.5+.5*Math.sin(t/1000*s.v+s.f)):.6; fx.globalAlpha=a; fx.fillStyle='#fff'; fx.beginPath(); fx.arc(s.x,s.y,s.r,0,6.28); fx.fill(); });
  fx.globalAlpha=1;
}
var ultT=0,acumFundo=0;
function loop(t){
  var dt=Math.min(.05,(t-ultT)/1000||0); ultT=t;
  if(telaAtual==='jogo'){ passo(dt); desenha(); marcaProx(); }
  acumFundo+=dt; if(acumFundo>.08){ acumFundo=0; desenhaFundo(t); }
  requestAnimationFrame(loop);
}

/* ---------- teclado físico ---------- */
document.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&janelaAcao&&!(e.target&&e.target.tagName==='TEXTAREA')){ e.preventDefault(); janelaAcao(); return; }
  if(e.key==='Escape'){ if(G.pausado&&janelaAcao){ janelaAcao(); } else if(G.rodando) pausa(); return; }
  if(telaAtual!=='jogo'||janelaAcao) return;
  if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')) return;
  if(e.key&&e.key.length===1){ var c=e.key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); /* se a criança esbarrar no acento, a letra ainda vale */ if(c>='a'&&c<='z'){ e.preventDefault(); tecla(c); } else if(c===' '){ e.preventDefault(); tecla(' '); } else if(c==='ç') e.preventDefault(); }
  if(e.key==='Backspace') e.preventDefault();
});
window.addEventListener('blur',function(){ if(G.rodando&&!G.pausado) pausa(); });

$('btInicio').onclick=mapa; $('btMapa').onclick=mapa; $('btAjustes').onclick=ajustes; $('btPausa').onclick=pausa;
window.__jogo={G:G,FASES:FASES,MISSOES:MISSOES,tecla:tecla,est:est,sala:function(){return sala;},oficina:oficina,atualizaSala:atualizaSala,limpaFrase:limpaFrase,checaFrase:checaFrase,temServidor:temServidor};
aplicaAnim(); tamFundo(); if(QUERY.oficina==='1'&&temServidor()) oficina(); else mapa(); requestAnimationFrame(loop);
if(temServidor()&&sala.cod){ atualizaSala().then(function(){ if(telaAtual==='mapa'&&salaMudou) mapa(); else if(telaAtual==='oficina'&&salaMudou) oficina(); },function(){}); }
})();
