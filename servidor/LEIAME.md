# Servidor da Oficina de frases

A Oficina de frases precisa de um lugar na internet para guardar as frases que a turma escreve, para que a outra turma as veja em qualquer computador. O jogo fala com esse servidor por um contrato bem simples, e aqui há **duas opções prontas, as duas gratuitas**. Escolha uma.

| | Google Apps Script (recomendado) | Cloudflare Worker |
|---|---|---|
| Onde ficam as frases | Numa planilha do seu Google Drive | Num banco KV da sua conta Cloudflare |
| O que você precisa | Uma conta Google | Conta Cloudflare + 2 segredos no GitHub |
| Tempo de configuração | Uns 3 minutos, só cliques | Uns 5 minutos |
| Moderação | Botão Apagar no jogo ou apagar a linha na planilha | Botão Apagar no jogo |

Depois de publicar, cole o endereço do servidor no arquivo **`servidor.js`** do jogo (na raiz do repositório), entre as aspas:

```js
var SERVIDOR_FRASES = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Salve o arquivo no GitHub (botão do lápis no site do GitHub, depois "Commit changes"). Em um ou dois minutos o GitHub Pages republica o jogo e o botão **Abrir a oficina** passa a funcionar.

---

## Opção 1: Google Apps Script (planilha no seu Drive)

1. Abra <https://script.google.com> com a sua conta Google e clique em **Novo projeto**.
2. Apague o que estiver no editor, cole o conteúdo inteiro do arquivo [`apps-script.gs`](apps-script.gs) e salve (ícone de disquete). Pode dar um nome ao projeto, por exemplo "Frases Invasão das Letras".
3. Clique em **Implantar** (canto superior direito) > **Nova implantação** > ícone de engrenagem > **App da Web**.
   - **Executar como:** Eu
   - **Quem pode acessar:** **Qualquer pessoa** (não escolha "Qualquer pessoa com Conta do Google": as crianças não vão estar logadas)
4. Clique em **Implantar**. O Google pede autorização: **Autorizar acesso** > escolha sua conta > se aparecer "O Google não verificou este app", clique em **Avançado** > **Acessar ... (não seguro)** > **Permitir**. É o seu próprio script, só está sem o selo de verificação.
5. Copie o **URL do app da Web** (termina em `/exec`) e cole em `servidor.js`, como mostrado acima.

Pronto. Na primeira frase enviada, o script cria sozinho a planilha **"Invasão das Letras - frases"** no seu Google Drive, com as colunas id, sala, frase, nome e quando. Apagar uma linha da planilha apaga a frase do jogo.

**Senha para apagar pelo jogo (opcional):** no começo do código há `var SENHA_PROFESSOR = '';`. Se colocar uma senha ali, só quem digitar essa senha no Modo professor consegue apagar frases pelo jogo.

**Se mudar o código depois:** Implantar > **Gerenciar implantações** > lápis > em Versão escolha **Nova versão** > Implantar. Assim o endereço continua o mesmo. (Se criar uma "Nova implantação", o endereço muda e você precisa trocar em `servidor.js`.)

## Opção 2: Cloudflare Worker (publicado pelo GitHub Actions)

O repositório já traz o Worker ([`cloudflare/worker.js`](cloudflare/worker.js)) e um workflow que cria o banco KV, publica o Worker, testa e **grava o endereço em `servidor.js` sozinho**.

1. No painel da Cloudflare, abra **Workers & Pages**. Copie o **Account ID** (aparece na lateral direita).
2. Vá em **Manage Account > Account API Tokens** (ou perfil > API Tokens) > **Create Token** > modelo **Edit Cloudflare Workers** > Continue > Create Token. Copie o token (ele só aparece uma vez).
3. No GitHub, no repositório do jogo: **Settings > Secrets and variables > Actions > New repository secret**. Crie dois segredos:
   - `CLOUDFLARE_API_TOKEN` com o token
   - `CLOUDFLARE_ACCOUNT_ID` com o Account ID
4. Na aba **Actions** do repositório, abra o workflow **Servidor de frases (Cloudflare)** > **Run workflow**. Em um ou dois minutos ele termina e mostra o endereço do servidor no resumo. O próprio workflow faz o commit em `servidor.js`.

Se a conta ainda não tiver um subdomínio `workers.dev`, o workflow avisa: ative em Workers & Pages > Overview > "Set up a subdomain" e rode de novo.

**Senha para apagar pelo jogo (opcional):** em [`cloudflare/wrangler.toml`](cloudflare/wrangler.toml), preencha `SENHA_PROFESSOR = "..."` e rode o workflow de novo.

**Domínio próprio (opcional):** no painel do Worker `invasao-frases`, em Settings > Domains & Routes, adicione por exemplo `frases.cliick.dev` e troque o endereço em `servidor.js`.

---

## Como usar na aula

1. **Combine um código de sala** com as duas turmas, por exemplo `foguete`. Pode ser qualquer palavra, sem acento.
2. **Turma que escreve:** abra o jogo e toque em **Abrir a oficina**, digite o código da sala. Ou abra direto o link `https://invasao-das-letras.cliick.dev/?sala=foguete&oficina=1` em todos os computadores. Cada criança escreve o nome (opcional) e a frase e toca em **Enviar frase**. A lista mostra, ao vivo, as frases de todos os computadores.
3. **Turma que joga:** abra `https://invasao-das-letras.cliick.dev/?sala=foguete` (ou digite o código no cartão do mapa). Com 3 frases ou mais, a missão **Frases dos colegas** aparece no fim do mapa, e cada meteoro mostra "frase de Ana".
4. **Moderação:** na oficina, toque em **Modo professor**: aparece o botão Apagar em cada frase e os botões para copiar os dois links acima. Com o Apps Script, você também pode apagar linhas direto na planilha.

Cada sala é independente: outra turma pode usar outro código ao mesmo tempo. O jogo guarda uma cópia local das frases da sala, então, se a internet falhar na hora de jogar, a missão continua disponível com as últimas frases baixadas.

## Contrato do servidor (para quem quiser hospedar em outro lugar)

Qualquer servidor que responda assim funciona:

- `GET  {URL}?acao=listar&sala=foguete` → `{"ok":true,"frases":[{"id":"...","t":"o gato pulou o muro","a":"Ana"}]}`
- `POST {URL}` com corpo `{"acao":"enviar","sala":"foguete","t":"frase","a":"nome"}` → `{"ok":true,"frase":{...}}` ou `{"ok":false,"erro":"mensagem para a criança"}`
- `POST {URL}` com corpo `{"acao":"apagar","sala":"foguete","id":"...","senha":"..."}` → `{"ok":true}`

O corpo do POST vai como `text/plain` (sem preflight) e as respostas precisam de `Access-Control-Allow-Origin: *`.
