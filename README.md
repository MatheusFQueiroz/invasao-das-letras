# Invasão das Letras

Jogo de **digitação** para crianças: meteoros com letras, palavras e frases caem do céu, e a criança digita para destruí-los antes que cheguem ao planeta. Ensina qual dedo cuida de cada tecla. Sem pontos, sem vidas, sem recorde.

🎮 **Jogar:** https://invasao-das-letras.cliick.dev (precisa de teclado físico)

## Oficina de frases (frases escritas pela turma)

Uma turma escreve frases e a outra digita no jogo. Tudo sem servidor: as frases ficam guardadas no navegador de cada computador.

**Como a turma escreve**
1. No mapa, toque em **Abrir a oficina**.
2. Cada criança escreve o nome (opcional) e a frase (2 a 6 palavras). O jogo tira acentos e pontuação sozinho e mostra como vai aparecer no meteoro.
3. Com 3 frases ou mais, aparece no fim do mapa a missão **Frases dos colegas** (3 fases). Cada meteoro mostra "frase de Ana".

**Como levar para a outra turma**
- **Mesmos computadores**: não precisa fazer nada. As frases já estão lá no dia seguinte.
- **Computadores diferentes** (no botão **Modo professor** da oficina):
  - **Copiar link com as frases**: abra esse link nos outros computadores e as frases entram sozinhas.
  - **Copiar código** / **Juntar frases**: para juntar as frases de vários computadores, copie o código de cada um, cole todos de uma vez na caixa "Colar códigos", toque em Juntar e copie o link final.
  - **Baixar arquivo** / **Abrir arquivo**: o mesmo, por pendrive.
- No Modo professor também dá para apagar frases e dar nome à turma que escreveu.

## Como funciona

- **11 missões e 33 fases**, do F sozinho até frases inteiras: casa da mão esquerda, casa da mão direita, duas mãos, G e H, linha de cima, linha de baixo, alfabeto inteiro, palavras curtas, médias, grandes e frases bônus (com a barra de espaço). Dá mais de 30 minutos de aula.
- **Dicas de dedos:** cada missão começa com telas de dica e um desenho das mãos com os dedos coloridos. O teclado na tela e a próxima letra do meteoro usam a cor do dedo, com a etiqueta "F · indicador da mão esquerda".
- **Meteoro pousou:** o jogo pausa e mostra qual dedo era daquela letra, com um lembrete de postura. No terceiro, uma parada mais firme com passo a passo para recolocar as mãos, e a fase recomeça.
- **Sem pontos:** cada fase acende uma estrela na constelação da missão.
- Só letras sem acento e sem ç; se a criança esbarrar numa tecla de acento, a letra seguinte continua valendo.

## Para o professor

- Em **Ajustes**: **Meteoros mais lentos** para quem está começando, **Todas as missões abertas** para escolher qualquer fase, sons e animações.
- Esc pausa, Enter avança. O jogo pausa sozinho se a janela perder o foco.
- O progresso fica salvo no próprio computador.

## Rodar localmente

Site estático. Sirva a pasta com um servidor simples:

```bash
npx serve .
```

## Estrutura

| Arquivo | O que é |
|---|---|
| `index.html` | A página do jogo |
| `estilo.css` | Visual e animações |
| `jogo.js` | Missões, palavras, dicas de dedos e a lógica do jogo |
| `fontes/` | Fredoka e Nunito |
| `CNAME` | Domínio do GitHub Pages |

Para mudar palavras e frases, edite `PAL_CURTAS`, `PAL_MEDIAS`, `PAL_GRANDES` e `FRASES_1` a `FRASES_3` em `jogo.js` (só letras de a a z e espaço). As missões ficam em `MISSOES`.

## Créditos e licenças

Veja [CREDITOS.md](CREDITOS.md). Fontes [Fredoka](https://fonts.google.com/specimen/Fredoka) e [Nunito](https://fonts.google.com/specimen/Nunito) (OFL). Os desenhos são próprios.

Faz parte de uma coleção de jogos educativos: [Qual vem depois?](https://github.com/MatheusFQueiroz/padroes), [Qual tecnologia resolve?](https://github.com/MatheusFQueiroz/qual-tecnologia), [Pode ou não pode?](https://github.com/MatheusFQueiroz/pode-ou-nao-pode) e [A casa das máquinas](https://github.com/MatheusFQueiroz/casa-das-tecnologias).
