# QA da Jornada da Cooperativa

## Ensaio em tempo real

A sessão registrou 23 etapas em 900,266 segundos de relógio, da primeira entrada à missão de reconstruir a passagem. Os checkpoints, eventos da economia e placar foram exportados em [sessao.json](sessao.json).

| Tempo da LIVE | Marco |
| --- | --- |
| 0:00 | [Aurora entrou como agricultora](01-entrada.png). Bento entrou como carreteiro aos 0:20. |
| 3:15 | [Lote comprado, registrado e plantado](02-plantio.png). O navegador da LIVE foi recarregado neste ponto. |
| 6:20 | Colheita de 8 sacas após 4 ciclos da lavoura. |
| 9:10–10:10 | [Partida](03-transporte.png), [estrada](carga/carroca-estrada.png) e [chegada ao armazém](carga/carroca-armazem.png). |
| 10:35 | [Liquidação única de 45 moedas](04-pagamento.png), 40 para Aurora e 5 para Bento. |
| 12:01 | [A guarda entrou no cerco](05-defesa.png) após receber 2 sacas do armazém. |
| 13:10 | [Consequência territorial visível](06-territorio.png), com fortificação registrada. |
| 15:00 | [Próxima missão anunciada na LIVE](07-nova-missao.png). |

Ao final, a cooperativa tinha 5 moedas, reserva zerada e 6 sacas. Aurora terminou com 115 moedas e Bento com 180. O [registro da carga](carga/carga.json) guarda o estado de retirada, chegada e liquidação.

A chegada e o mapa também foram revalidados em testes focados após os ajustes finais de legenda. Esses dois recortes usam checkpoints gerados pelas mesmas ações da V36. A exportação, o arquivamento da sessão finalizada e a abertura de um novo ensaio independente foram exercitados no navegador.

## Regressões de código e navegador

| Verificação | Resultado |
| --- | --- |
| Base da PR #20 | 145 testes aprovados |
| Candidata desta PR | 148 testes aprovados com Node 24.22.3 |
| Projeção Chromium 140.0.7339.16 | LIVE pública, ADMIN público de QA, migração, autor único, retomada, áudio Web Audio e fallback aprovados |
| Formatos | 360×640, 1080×1920 e 1280×800. Palco 9:16 sem controles administrativos |
| Retomada da jornada | O ADMIN reaplicou a mesma sessão após recarga. A LIVE avançou com o ADMIN em segundo plano simulado. A confirmação manual apareceu na LIVE. [Registro](retomada/retomada.json) |
| Retomada do cerco | O ADMIN reabriu a guerra ativa. A guarda consumiu duas sacas uma vez e o território gravou um resultado. A vila derrotada aplicou cinco unidades de madeira e três de pedra em reparos. [Registro](retomada/retomada-cerco.json) |

O ensaio usou dois processos separados do Chromium. A LIVE iniciou Web Audio após interação e ficou com o armazenamento local vazio. A autenticação do ADMIN, o bloqueio via servidor de uma segunda direção e a inexposição dos controles na LIVE foram observados no navegador. Os testes HTTP também cobrem origem, credenciais, tamanho, limitação de cadência, quadros repetidos e reconexão. As capturas usam fonte de fallback do ambiente Linux.

A validação física com Chrome, Edge e TikTok LIVE Studio no Windows segue pendente. A narração usa as vozes disponíveis no sistema. O QA confirmou propagação de estado e controles do Web Audio.

## Reproduzir

A partir da raiz da branch, execute `node --test`, `node tools/qa-live-admin.cjs` e `node tools/qa-journey.cjs`. O último comando roda o ensaio em tempo real. O modo `--resume-only` concentra a validação na recarga do ADMIN, na direção em segundo plano simulada e na confirmação manual. Consulte o [README do projeto](../../../README.md) para abrir a LIVE e a direção no PC.
