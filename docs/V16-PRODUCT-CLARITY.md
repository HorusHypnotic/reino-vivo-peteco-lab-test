# Vila Viva — clareza do primeiro minuto

Base deste lote: `gh-pages` em `aad905efa61835b375e80881fc6bcaae23e3890b`.

## O que mudou

- O sítio da muralha volta a ter uma única fonte visual: `PetecoConstructionV20` (com o fallback já existente). Removidos o rótulo/medidor repetidos e o segundo andaime sobreposto.
- Moradores ambientais ficam limitados a três e em repouso. Deslocamentos de trabalho continuam a vir dos controladores V18/V20 após ciclos econômicos confirmados.
- Nenhuma chave ou estrutura de save foi alterada.

## Módulos e contratos preservados

- `v18/woodcutter-controller.js` e `v18/woodcutter-renderer.js`: corte e entrega de madeira associados ao ledger de produção confirmado.
- `v20/economy-bridge.js` e `v20/actor-controller.js`: agricultores/mineradores reagem a deltas observados; animação não credita recursos.
- `v20/construction-state.js`: etapas derivadas de `project`, `projectGoal` e `projectCount`; contribuição aceita é o gatilho do construtor.
- `v7/delivery.js` e `v7/narrative.js`: mantidos como sistemas próprios, sem duplicar sua economia no motor principal.

## Verificação e limite

Suíte Node nativa: `node --test` (50/50), `node tests/collective-regression.cjs` (8/8), `node tests/live-command-regression.cjs` (49/49), `git diff --check` (PASS).

A página oficial anterior ao lote foi aberta em navegador. O ambiente não carregou este ramo em navegador local; portanto não há captura “depois”, homologação Android ou aprovação visual final deste commit. A publicação permanece no SHA base até revisão e QA visual.

## Ponte de LIVE

O conector observado em `reino-em-construcao` é um cliente Node local (PirateTok Live JS) com normalização/deduplicação e WebSocket do próprio servidor. GitHub Pages, sozinho, não mantém a conexão de LIVE. Nenhum evento TikTok real foi recebido nesta execução; o modo simulado não conta como homologação.

## Continuação da PR #17

- `v7/life.js` já executa o ciclo isolado lenhador → depósito → logística confirmada → construtor; o construtor consome madeira registrada e altera etapas da casa persistidas no estado V7. `v7/actor-renderer.js` passa a desenhar o lenhador com o atlas V18 e o construtor com o renderizador V20. Os rótulos de atividade aparecem apenas durante trabalho/transporte. Isso não mistura o estoque V7 com a economia principal nem altera o Save V2.
- `v20/live-event-gateway.js` recebe o envelope `{type:'fx', payload, seq}` do servidor Node local e encaminha eventos normalizados, com deduplicação e estados de conexão. É um adaptador, não uma conexão iniciada pela página; comentários, curtidas, presentes, follows e shares ainda dependem do servidor local e de integração de comandos específica.
- QA automatizado após a integração: `node --test` (56/56), regressão coletiva (8/8), comandos simulados (49/49), sintaxe dos dois módulos novos e `git diff --check` (PASS).
- Captura “depois”: prévia HTTPS isolada da branch em Chrome desktop, modo espectador. A execução avançou a vila sem salvamento oficial e apresentou a crônica V7 de entrega à obra. Não é homologação Android físico nem evento TikTok real.
