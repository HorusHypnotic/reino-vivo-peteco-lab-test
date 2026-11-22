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
