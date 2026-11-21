# V18 — Lenhador Vivo: implementação e QA

Data: 21/11/2026  
Issue: [#10](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/issues/10)  
PR: [#9](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/pull/9)  
Branch: `experiment/v18-art-production-v1`

## Resultado deste lote

Foi acrescentado um único ator visual para representar a atividade agregada do setor florestal. O ator permanece em repouso no depósito, caminha até a área de corte, anima o machado durante o ciclo e só leva a carga de volta quando `progress()` confirma produção florestal e aumento de entregas.

O motor ainda não possui entidade individual de lenhador, atribuição de profissão ou árvore persistente. Portanto, o personagem é uma **representação visual temporária do setor**, não um morador novo nem uma profissão gravada. Ele não cria nem altera recursos, não entra em `s.people` e não é salvo.

O ciclo econômico foi preservado. `harvest()` continua agendando `progress()` após 1.400 ms, com as proteções existentes de `epoch`, `busy` e fase. `progress()` continua acumulando produção florestal em ciclos ímpares e creditando a transformação em madeira apenas nos ciclos pares. A variável `forestWoodProduced` apenas nomeia o valor já creditado no ponto original da regra, para observação posterior. Consumo simultâneo continua sendo do motor; o HUD diferencia produção florestal do saldo final.

## Código

- `v18/woodcutter-controller.js`: estados transitórios `idle`, `walk`, `work` e `carry`; rota, cancelamento por época, espera de entrega confirmada e reinício do ciclo enfileirado.
- `v18/woodcutter-renderer.js`: recorte dos quadros reais do atlas; não desenha o personagem com primitivas geométricas.
- `v18/assets/woodcutter-atlas-original.png`: atlas RGBA 1122×1402, 4×4 quadros: repouso, caminhada, corte e transporte. A animação de repouso também alterna quadros.
- `index.html`: inicia o controlador junto ao `harvest()`, envia o resumo depois de `progress()` e desenha o ator apenas na cena V18. O modo clássico continua no fallback V17 e a guerra mantém prioridade visual.
- Testes novos: `tests/woodcutter-v18.test.cjs` e `tests/economy-woodcutter-v18.test.cjs`.

O reset e a pausa invalidam a animação transitória. Estado V18 não foi acrescentado ao `save()` nem ao `restore()`: permanece válido o schema `peteco-lab-vila-v2`. Ao recarregar, a animação deriva do ciclo atual e recomeça em repouso/produção normal.

## Sprite e licenças

### Universal LPC avaliado

Fonte: [Universal LPC Spritesheet Character Generator](https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator) e [gerador público](https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/). No checkout consultado, HEAD `86a3719ee`. O gerador fornece PNG, ZIPs separados por animação/item e créditos em TXT/CSV. A documentação informa `tool_axe` como animação especial com quadros de 128 px; não se deve assumir que todas as linhas usam 64 px.

A prévia examinada usou corpo masculino, cabeça humana, rosto neutro e camisa de manga curta marrom. O painel do gerador mostrou estas fontes/atribuições e licenças para aquela composição de teste:

| Camada examinada | Fonte/atribuição mostrada pelo gerador | Licenças mostradas |
| --- | --- | --- |
| Corpo | `body/bodies/male/walk.png`; base LPC; contribuições de bluecarrot16, JaidynReiman, BenCreating, Evert, ElizaWy, TheraHedwig, MuffinElZangano, Durrani, wulax e Redshrike | OGA-BY 3.0, CC-BY-SA 3.0, GPL 3.0 |
| Cabeça humana | `head/heads/human/male/walk.png`; original de Redshrike, modularização de bluecarrot16 | OGA-BY 3.0, CC-BY-SA 3.0, GPL 3.0 |
| Rosto neutro | `head/faces/male/neutral/walk.png`; original de Redshrike, expressões de ElizaWy, adaptação de quadros de JaidynReiman | OGA-BY 3.0 |
| Camisa | `torso/clothes/shortsleeve/shortsleeves/male/walk.png`; original de wulax, ajustes/recolor de bluecarrot16, limpeza e adaptação de JaidynReiman | OGA-BY 3.0, CC-BY-SA 3.0, GPL 3.0 |

A licença do **código do gerador** é GPL-3.0; ela não é a licença única das imagens. A licença e os autores variam por camada, e o README exige atribuição conforme a licença individual. Não exportei nem copiei essas quatro camadas, o machado, nem créditos LPC para o jogo. O estilo pixel art e as proporções do personagem não combinaram com a cena ilustrada em perspectiva 3/4. Por isso, LPC foi rejeitado para a arte deste lote; a seleção de teste não é um sprite aprovado para uso.

### Arte usada

O atlas usado foi gerado especificamente para esta prova e não contém imagens LPC ou outros assets de terceiros. Nenhuma atribuição externa de arte foi incorporada. O PNG preserva transparência e quadros separados. A imagem fonte está em [woodcutter-atlas-original.png](../v18/assets/woodcutter-atlas-original.png).

## Testes executados

Comandos efetivamente executados na branch:

- `node --test` — **PASS**, 5 arquivos, 5 pass, 0 fail. Inclui os três testes V18 anteriores e os dois testes novos.
- `node tests/collective-regression.cjs` — **PASS**, 8 checks.
- `node tests/live-command-regression.cjs` — **PASS**, 49/49.
- `node --check v18/woodcutter-controller.js` — **PASS**.
- `node --check v18/woodcutter-renderer.js` — **PASS**.
- `node --check /tmp/v18-inline.mjs` — **PASS**, script inline extraído do `index.html` desta versão.
- `git diff --check` — **PASS**.

Os testes novos cobrem par/ímpar no contrato do controlador, estados dos quadros, entrega confirmada, não mutação do estoque pelo controlador, cancelamento, reinício/enfileiramento, recorte de atlas, proteções do `epoch`, saldo no ponto de crédito original, schema do save, prioridade da guerra e fallback clássico.

## QA visual e limitações verificadas

**QA em navegador da branch: BLOQUEADO neste executor.** O navegador visual disponível está em outro ambiente: `127.0.0.1` recusou a conexão com o servidor local. A tentativa de abrir o arquivo diretamente foi bloqueada pela política da organização para `file://`. Chromium headless no executor encerrou antes de abrir a página com `socket() failed: Operation not permitted`. Assim, não foi possível capturar quadros do runtime, conferir console ou medir FPS.

Consequências para a revisão:

- Não há captura de antes/depois do runtime nesta entrega; o atlas PNG é a evidência visual dos 16 quadros, não prova de integração no navegador.
- A inspeção do atlas encontrou pequenas franjas/pixels coloridos em algumas bordas das silhuetas; limpar ou aprovar esses pixels faz parte da revisão da arte.
- Viewports Android simulada 360×800 e desktop não foram validados. Android real não foi testado.
- Ciclos econômicos pares/ímpares, cancelamento, reset e save foram cobertos por unidade e inspeção estática; não houve ensaio runtime nem recarga real do navegador.
- As coordenadas da rota e a escala do sprite precisam de revisão visual no runtime local. A cena de fundo V18 continua estática; nenhum corte/dano de árvore foi inventado.
- Não existe comando de build declarado no repositório (`package.json` ausente nesta branch); build não executado.

## Pendências para completar o gate visual

1. Abrir esta branch em servidor local no navegador desktop e em viewport 360×800.
2. Capturar caminhada, corte, transporte, estado ocioso e HUD com saldo/log após ciclos 1 e 2; verificar console e FPS aproximado.
3. Recarregar a página e confirmar runtime de save V2, fallback V17, modo clássico e guerra no navegador.
4. Ajustar posição/escala com base nas capturas. Fazer teste em aparelho Android real antes de declarar homologação Android.
5. Validar a composição visual com revisão técnica/visual; não fazer merge ou publicar nesta etapa.

## Commit na branch da PR

- `ac4ce61c0af9af924915cd3bbbd87cc79d57d6ca` — `feat(v18): deliver animated woodcutter tied to forest production` (árvore completa baseada no HEAD `5f738479c77cd9ac544ca5a9e109fbab157515d7`).

PR #9 permanece draft e sem merge; `gh-pages`, `main` e publicação oficial não foram alterados.

## Retomada P0 de publicação (21/11/2026)

Rebobinei para o HEAD informado `be2762013db63f87fddb7959579b04d2d804deb9` e confirmei que ele já contém os ajustes recentes de HUD e de fallback: o renderizador só troca da V17 para V18 quando cena e atlas sinalizam `ready`. Encontrei, porém, o atlas do próprio HEAD corrompido: `identify` falhou com `IDAT: invalid distance code`. Isso acionava o fallback e impedia o lenhador de aparecer.

Recuperei o arquivo gerado existente `Atlas de sprites do lenhador em poses.png`, sem redesenhar o personagem, e restaurei o caminho já usado pelo renderizador. O asset validado mede 1122×1402, é RGBA com transparência, contém 4×4 quadros e tem SHA-256 `ad8aea4d0c7606c472689d334a6b71ba240e658ac12ca306eb588eca19e75b0d`. Acrescentei uma regressão que decodifica os dados IDAT com o `zlib` nativo do Node, confirma dimensões/canal alfa e mapeia as quatro linhas aos estados idle/walk/work/carry.

**Verificação local:** HTTP smoke em servidor estático retornou 200 para `index.html` (142046 bytes) e para o atlas (200, 1409701 bytes, `image/png`). Sintaxe do módulo inline, sintaxe dos scripts e suíte automatizada passaram.

**Página oficial:** `https://horushypnotic.github.io/reino-vivo-peteco-lab-test/` respondeu HTTP 200 e mostrou “Publicação oficial · V14.6”. O HTML servido (138850 bytes) é byte a byte igual ao `index.html` de `gh-pages` no commit `a8011c9`; portanto a página oficial continua apontando para esse conteúdo antigo. A API pública de configurações do Pages retornou 404, então a associação é confirmada pela igualdade do conteúdo servido, não por leitura da configuração do projeto.

**Publicação ainda bloqueada:** tentei executar a branch em Chromium via Playwright; o Chromium empacotado não está instalado e `/usr/bin/chromium` aborta com `socket() failed: Operation not permitted`. A aba de navegador conectada não consegue acessar o servidor local: devolveu `Missing or invalid bearer token`. Não obtive captura de runtime nem conferi animações, console, FPS, reload, batalha ou viewport 360×800. Assim, não fiz merge de #9 nem alterei `gh-pages`. Publicar agora impediria validar previamente o critério central e não atende ao gate definido.

O diagnóstico visual estático confirmou a grade de 16 poses e a transparência, mas há pequenas franjas coloridas nas bordas de algumas silhuetas. A posição/escala da rota ainda não foi validada no runtime. Salvamentos continuam com o mesmo schema V2 no código; como não houve teste real de recarga nesta rodada, a preservação funcional em navegador segue sem homologação.
