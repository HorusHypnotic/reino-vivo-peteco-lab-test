# Reino Vivo · Fábrica Visual

Memória operacional canônica para recuperar e industrializar a produção visual sem recriar os motores do jogo. Atualizada em 22/11/2026.

## Estado desta retomada

| Campo | Valor |
| --- | --- |
| Missão | Industrialização visual e recuperação da fábrica de design |
| PR | [#17](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/pull/17), mantida em Draft |
| Issue de produto | [#16](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/issues/16) |
| Branch | `experiment/v16-product-first-minute` |
| HEAD inicial verificado nesta retomada | `bde9e6261cd02e879c46682c8fdf56e08da23c79` |
| Commit desta etapa na PR #17 | registrado no commit final desta retomada |
| Base `gh-pages` verificada | `aad905efa61835b375e80881fc6bcaae23e3890b` |
| Estado da PR | aberta, Draft; branch verificada no HEAD de referência |
| Publicação | não alterada nesta etapa |

## Última etapa comprovada

PR #17 já contém a vila V21, a fábrica/controladores V20, economia/logística V7, o lenhador V18, o ciclo da floresta V19 e as correções visuais V31–V34. Os commits V31–V34 no HEAD corrigem o tronco alcançável no renderizador real, alinham a aproximação e os cavacos à árvore, removem uma árvore duplicada, compactam identidade do visitante e mantêm a guerra prioritária. Foram preservados; esta etapa não reimplementa esses comportamentos.

Fontes recuperadas: `docs/V18-PRE-WORK-RESEARCH.md`, `docs/V18-LENHADOR-REAL.md`, `docs/V18-POSTMORTEM-E-BOSQUE-VIVO.md`, `docs/V19-MUNDO-EM-MOVIMENTO.md` e `docs/V20-FABRICA-MUNDOS-VIVOS.md`. PR #9 e issue #10 são citadas pelo histórico V18 e seus registros permanecem disponíveis na branch.

## Recuperação da fábrica de design — etapa zero

| Item | Recuperado e conferido |
| --- | --- |
| Arte do lenhador | `v18/assets/woodcutter-atlas-original.png`, arte original da prova V18; 1122×1402, RGBA transparente, 4×4 células: repouso, caminhada, corte e transporte, quatro quadros por estado. |
| Arte da árvore | `v19/assets/forest-cycle-atlas.png`, arte ilustrada original; 2172×724, RGBA, quatro células: árvore, queda, toco/toras e broto. |
| Renderizadores | `v18/woodcutter-renderer.js` recorta o personagem; `v19/forest-art.js` desenha o alvo ambiental. Permanecem ligados aos controladores/economia existentes. |
| Integração | `v18/woodcutter-controller.js` recebe resumo após `progress()`; a madeira só é visualizada como carga depois da confirmação contábil. `v19/forest-art.js` reage ao ledger confirmado. |
| Licenças | `docs/V18-LENHADOR-REAL.md` registra a avaliação LPC e informa que camadas LPC não foram exportadas; a arte do lenhador é original do projeto. O documento V19 registra o atlas original da árvore. O código do gerador LPC não acompanha nem licencia esses PNGs. |
| Fonte criativa | A imagem de origem e sua composição foram recuperadas. **Prompt exato, ferramenta/sessão de geração e parâmetros de amostragem não estão versionados**; não são apresentados como patrimônio recuperado. |

O teste do Universal LPC já está documentado: as licenças variam por camada, e a estética pixel art/proporção não combinou com o cenário pintado 3/4. Nenhum recurso LPC foi incorporado. A decisão continua sendo manter a arte original compatível com a cena.

### Brief reprodutível — equivalente documentado, não prompt histórico

Para novos pacotes no mesmo padrão, produzir ilustração 2D medieval pintada, perspectiva 3/4, volumes e iluminação quente coerentes com a cena de Vila Viva; personagem inteiro, silhueta legível em escala de 72×90, pés alinhados à âncora, fundo transparente; atlas de 4 colunas × 4 linhas e fundo alpha limpo; linhas na ordem `idle`, `walk`, `work`, `carry`, quatro poses distintas por linha, ferramenta visível na linha de trabalho e carga visível somente na linha de transporte; não inserir texto, moldura, chão, sombra externa ou elemento que invada a célula vizinha. Exportar PNG RGBA sem redimensionar o atlas e guardar créditos/licenças de cada fonte junto ao pacote. Este brief orienta novas produções, mas não reproduz nem reivindica o prompt ou a ferramenta históricos.

## Etapa 1 — contrato reutilizável e primeiro pacote

Implementado nesta continuação:

- `v18/visual-factory.js`: catálogo de pacotes com dimensão, grade, estados, escala, âncora, direção, contato/oclusão, proveniência, licença e SHA-256. Registra apenas os dois atlases existentes; não cria trabalhadores, eventos, produção nem estado persistente.
- `v18/woodcutter-renderer.js` e `v19/forest-art.js`: recortes de quadros passaram a usar o contrato comum, mantendo fallback local para carregamento sem catálogo.
- `index.html`: carrega o catálogo antes dos renderizadores.
- `tools/validate-visual-assets.cjs`: validador Node sem dependências externas, confere chunks/CRC, decodificação PNG, RGBA, dimensões, células ocupadas, hash e contato compartilhado.
- `tests/visual-factory-v18.test.cjs`: prova catálogo, geometria de recorte, uso nos renderizadores e integridade de ambos os atlases.
- `tests/render-visual-factory-v18.cjs`: gera uma prancha reproduzível dos quadros/artes reais. Os estados de ator da prancha são sintéticos e **não** constituem homologação do ciclo econômico no navegador.

Evidências: [`woodcutter-forest-states.png`](evidence/visual-factory/woodcutter-forest-states.png) e [`before-hardcoded-renderers.png`](evidence/visual-factory/before-hardcoded-renderers.png). A segunda é o baseline do mapa de quadros anterior ao catálogo; a primeira usa o catálogo novo. As duas composições foram comparadas byte a byte pelo PNG e ficaram idênticas, preservando a aparência enquanto os metadados se tornam reutilizáveis. Ambas mostram composição de renderizadores com assets reais e estados sintéticos; não são captura de navegador, save real nem homologação Android.

## Processo industrializado para o próximo pacote

1. Declarar a identidade/estilo, uso real no motor e alvo de cena no manifesto.
2. Produzir/exportar somente as poses necessárias ao contrato já existente; preservar PNG fonte e créditos por camada.
3. Registrar hash, dimensões, grade, estados, escala, âncora, direção e contato em `v18/visual-factory.js`.
4. Executar `node tools/validate-visual-assets.cjs`; nenhum pacote com frame vazio, dimensões diferentes, CRC inválido ou hash divergente é aprovado.
5. Ligar o pacote ao renderizador e controlador existentes; eventos não confirmados não acionam efeito econômico.
6. Executar teste do controlador/asset e `node --test`, gerar a prancha, revisar legibilidade e oclusão; depois fazer QA do runtime em navegador. Não ampliar elenco até esse gate.

## Validação desta etapa

Inicialmente executados após a integração:

- `node --test` — PASS, 91/91, depois de sincronizar cinco asserções anteriores com as correções V31–V34 já presentes (remoção da árvore duplicada e coordenadas V34) e corrigir dois testes que não compilavam por aspas dentro da string.
- `node --test tests/visual-factory-v18.test.cjs tests/woodcutter-v18.test.cjs tests/forest-art-v19.test.cjs` — PASS, 5/5.
- `node tests/collective-regression.cjs` — PASS, 8/8.
- `node tests/live-command-regression.cjs` — PASS, 49/49.
- `node tools/validate-visual-assets.cjs` — PASS, 11 verificações estruturais; 16 células do lenhador e quatro da floresta ocupadas, SHA-256 confirmado.
- `node tests/render-visual-factory-v18.cjs` — PASS, gerou a prancha renderer-only com cinco quadros de estado, sem escrita de save/economia.
- `git diff --check` — PASS.

QA de navegador: BLOQUEADO com causa observada. O Playwright não encontrou seu binário `chromium_headless_shell`; a tentativa direta com Chromium 156 no servidor local encerrou com `FATAL ... socket() failed: Operation not permitted (1)` e erro de `ptrace` do crashpad. A prévia HTTPS de branch abriu após o commit, mas, mesmo depois de uma recarga, exibiu uma interface identificada como V21 e não expôs `PetecoVisualFactoryV18`, `PetecoWoodcutterAtlasV18` nem `PetecoForestAtlasV19` no runtime. O HTML da branch e a referência do script foram confirmados via GitHub; essa prévia não provou o carregamento dos assets da PR, e a causa entre cache/loader não foi discriminada. Não classifico a captura como QA do runtime. Não interagi com os controles; a simulação avançou automaticamente no armazenamento próprio da prévia. Nenhum save oficial ou do aparelho do usuário foi aberto. Nenhuma validação em aparelho Android foi feita. Nenhuma publicação oficial foi feita.

## Situação e continuidade

- **Entregue e comprovável:** contrato industrial reutilizável para os dois atlases existentes, integração retrocompatível dos renderizadores e verificador nativo de PNG/licença/proveniência.
- **Implementado e testado:** captura de composição e suíte Node completa. Revisão visual do runtime e em aparelho Android permanecem sem comprovação; a prévia HTTPS atual não carrega os assets da branch no contexto observado.
- **Não recuperado:** prompt exato e sessão/ferramenta originais da geração do lenhador; continuam identificados como fonte ausente.
- **Preservado:** V18, V19, V20, V21, V31–V34, economia, guerra e formato Save V2; `gh-pages`, `main`, publicação oficial e Supabase não foram modificados.
- **Próxima ação executável:** terminar a prancha de estados, executar toda a suíte/regressões, revisar o render em navegador da branch e atualizar a PR #17. Não iniciar novas profissões ou assets até revisar esse pacote.


## Continuação de produção artística — 22/11/2026

**Resultado implementado nesta rodada:** `v20/profession-renderer.js` agora aceita `registerAtlas(job,image,{width,height})` para agricultor, minerador e construtor. O adaptador usa quatro colunas e quatro linhas (`idle/walk/work/carry`) por profissão, preserva a simulação e retorna ao desenho procedural anterior quando a imagem não estiver pronta. Teste adicionado em `tests/profession-painted-atlas-v20.test.cjs`. Commits `2edefab` e `a43dadf`.

**Arte em produção, ainda não integrada:** foi produzida uma primeira prancha de direção visual contendo agricultor, minerador e construtor em quatro estados. Essa prancha foi gerada fora do repositório, com três linhas e quatro colunas, e **não** é um atlas V20 4×4 por profissão, nem tem transparência alfa comprovada. Não declarar sprites integrados, validação PNG ou QA visual por causa dessa prancha. É necessário recortar, limpar transparência, completar poses e exportar atlases individuais antes do registro.

**Validação:** a integração do código foi gravada na branch experimental. O teste novo ainda não foi executado em Node nesta rodada; o QA de navegador e Android continua bloqueado/não realizado. A página oficial e os salvamentos não foram alterados.

**Próxima ação executável:** exportar três atlases PNG RGBA reais (4×4 por profissão), validar células/CRC/sha256, registrar metadados e carregamento experimental no `index.html`, executar testes e capturar a cena de profissões em ação. Não transformar a prancha preliminar em asset de produção sem essas verificações.


## Correção de rumo: produção não é geração avulsa (22/11/2026)

Revisados diretamente `docs/V18-PRE-WORK-RESEARCH.md`, `docs/V18-LENHADOR-REAL.md` e `docs/V18-POSTMORTEM-E-BOSQUE-VIVO.md`. A prova original usou **um atlas de arte original gerado para o projeto**, posteriormente recuperado de um arquivo chamado `Atlas de sprites do lenhador em poses.png` após corrupção do PNG versionado. O registro **não contém** prompt original, ferramenta, sessão, automação de geração nem transformação reproduzível da imagem. Portanto **não existe evidência suficiente para afirmar que a etapa de geração artística original está industrializada**. O contrato V18 industrializa catalogação/validação/renderização, não a criação artística.

**Não usar** as pranchas de geração avulsa desta conversa como produto da fábrica nem registrá-las como assets aprovados. O adaptador opcional V20 do commit `2edefab` não constitui prova de arte produzida.

**Novo portão de entrada reproduzível:** `tools/prepare-profession-atlas.cjs` verifica que o candidato seja PNG RGBA 4×4 com dezesseis células ocupadas, quatro estados (`idle/walk/work/carry`), dimensões divisíveis, hash opcional, proveniência, fonte e licença. Reutiliza o decoder de PNG do projeto e não altera o jogo. `tests/profession-atlas-intake.test.cjs` verifica rejeições de entradas incompletas. Commits `b9652ad`, `e260dfe`. **Os testes desta rodada não foram executados em Node.**

**Bloqueio honesto e objetivo:** a fábrica ainda não possui mecanismo comprovado de produção automatizada de novos quadros artísticos coerentes com a arte original. Não converter o gate técnico em substituto dessa capacidade. Próxima execução deve recuperar a ferramenta de geração original se houver evidência verificável, ou implementar e demonstrar um processo novo reproduzível com fonte/licença e comparação visual, antes de afirmar que as três profissões foram fabricadas. QA Android permanece pendente; PR experimental não foi publicada.

## Etapa 2 — fábrica executável e lote de três profissões (22/11/2026)

**Estado inicial:** PR #17/branch `experiment/v16-product-first-minute`, HEAD `bde9e6261cd02e879c46682c8fdf56e08da23c79`; base `gh-pages` observada em `aad905efa61835b375e80881fc6bcaae23e3890b`. A PR permanecia aberta em Draft. Nenhuma branch de produção, página oficial ou salvamento foi alterado.

**Recuperação:** a busca limitada confirmou o que já constava no histórico: o PNG do lenhador e sua composição foram recuperados, mas prompt, sessão e identificador do gerador original não foram versionados. Não atribuímos retrospectivamente uma ferramenta ao lenhador. Para este novo lote, as três especificações registram o uso do gerador de imagem integrado disponível nesta execução; o modelo específico não foi informado pela ferramenta.

**Implementação:** `tools/build-profession-atlas.cjs` executa o processamento determinístico de uma prancha RGBA 4×4: recorte por célula, remoção dos pixels de halo vermelho/amarelo mais extremos, normalização pela maior pose para que nenhum quadro invada a linha vizinha, escala comum e âncora de pés, composição de PNG 1120×1400 e manifesto com hashes, prompt, proveniência, referência, ferramenta e licença. `tools/build-profession-batch.cjs` processa os três pacotes com um único comando. `tools/prepare-profession-atlas.cjs` agora rejeita quadro vazio, pose duplicada e pés desalinhados. O pipeline usa Node e `zlib` nativos, sem instalar motor ou dependência.

**Assets produzidos e origem:**

| Trabalho | Fonte RGBA | Atlas de jogo | Estados por linha |
| --- | --- | --- | --- |
| Agricultora | `v20/art-source/farmer-source.png` · SHA-256 `7ed8b581692680fe6a6015d9902e92de8c47bad30ba638009629695b0acf01ff` | `v20/assets/professions/farmer.png` · SHA-256 `9a4e600a9fc14f8c2788571350751638ac0bc252f3281d83dee070095fc2aa98` | repouso, caminhada, trabalho, transporte |
| Mineira | `v20/art-source/miner-source.png` · SHA-256 `b91028b5af9aa0d92aa5227cb776df5de63a7524e731bdff463d5a2f3df05326` | `v20/assets/professions/miner.png` · SHA-256 `f6d3d14b8b5b0ffa5905ff2c75dc9c8f74b93fc73fe87f948d1a2e6aeebc0b1e` | repouso, caminhada, trabalho, transporte |
| Construtora | `v20/art-source/builder-source.png` · SHA-256 `4cc073e70cf7ec42e8b50c01c1838a722f7fc346506fca9e8988e879b43e9ae9` | `v20/assets/professions/builder.png` · SHA-256 `53305edcb4aefc6bf242a8322a9eabe7be2e16f76a89d629c83e9174fc4bc79e` | repouso, caminhada, trabalho, transporte |

Cada entrada mantém a especificação/prompt completo em `v20/art-manifests/`. O catálogo `v18/visual-factory.js` registra dimensões, grade, escala, âncora, estado, interação visual, hash e licença. A referência LPC foi avaliada na pesquisa existente e continua fora do pacote porque estilo pixel-art e licenças de camadas não correspondem ao cenário. Para mineradora e construtora, a arte original do lenhador foi usada apenas como referência de estilo/escala. A agricultora foi gerada sem imagem de referência.

**Licença e atribuição:** os PNGs deste lote são saídas geradas, não assets LPC nem imagens de terceiros. Os manifestos registram os Termos de Uso da OpenAI consultados em 22/11/2026: a titularidade da saída é atribuída ao usuário entre as partes, na medida permitida por lei; saídas podem não ser únicas e isso não constitui garantia contra direitos de terceiros. Fonte: https://openai.com/policies/terms-of-use/. Não há licença SPDX independente a declarar para essas imagens; a origem e as limitações estão junto de cada asset.

**Integração:** as imagens só são solicitadas por `index.html` quando `?v20=1`; esse canário abre o mesmo mapa ilustrado V18 e registra os pacotes no `PetecoProfessionRendererV20`. O renderizador desenha repouso animado lentamente e estados walk/work/carry a partir dos snapshots existentes. Os controladores V20 só iniciam com eventos confirmados (`harvest`, `mine`, `build`); carga visual aparece no retorno. Nenhum recurso ou save é escrito pelo renderer. Três pontos de espera ao longo da frente do depósito evitam que os sprites em repouso se empilhem; são coordenadas visuais, não logística/economia nova. Fallback procedural anterior permanece caso um PNG falhe ao carregar.

**Evidências:** `docs/evidence/profession-factory/three-profession-atlases.png` mostra os 48 quadros processados; `three-workers-confirmed-v20-scene.png` mostra a composição com o cenário V18 e três snapshots em fases distintas, após aceitar eventos sintéticos confirmados pelos controladores. O manifesto de evidência marca os dados como sintéticos, informa que não leu nem escreveu save e que não é captura de navegador. A composição renderizada foi revisada; homologação de navegador, Android físico e economia em runtime ainda não foram declaradas.

**Testes executados nesta etapa:** `node tools/build-profession-batch.cjs` — PASS, 3 atlases determinísticos; `node tools/validate-visual-assets.cjs` — PASS, 5 pacotes e 26 verificações; `node --test` — PASS, 97/97; `node tests/collective-regression.cjs` — PASS, 8/8; `node tests/live-command-regression.cjs` — PASS, 49/49; `git diff --check` — PASS. Inclui reprocessamento byte-a-byte, dezesseis células, variação de quadros nos quatro estados, alinhamento de pés, alfa, licença/proveniência, registro no catálogo, eventos confirmados, fallback e regressões de guerra/economia/save.

**Limitação concreta:** o gerador original do lenhador continua desconhecido. A etapa de geração de uma nova ilustração depende do gerador integrado desta ferramenta; o processo local versionado reproduz exatamente o tratamento/exportação desde as fontes preservadas, mas não invoca esse serviço nem promete geração pixel-a-pixel de novas fontes. Essa distinção permanece explícita para não chamar a geração por prompt de automação determinística.

**QA do navegador:** tentativa real com Chromium do executor. O `curl` local para `127.0.0.1:8765` retornou `connection refused`; o Chromium de QA está em outro ambiente e a política da organização bloqueou `file:///tmp/vila-pr17-current/index.html` (“This page is blocked”). Portanto esta execução não comprova renderização no navegador, viewport Android ou carregamento do canário. Não há homologação Android físico. A evidência produzida é um render sintético com os mesmos módulos Canvas e controladores, claramente identificado como tal.

**Resultado:** os três atlases foram produzidos, validados e integrados ao renderizador/controladores experimentais. QA automatizado e composição renderizada passaram; navegador/Android continuam pendentes pelo bloqueio acima. PR #17 deve seguir em Draft até revisão técnica/visual do canário. A publicação oficial permanece intocada.

**Commit de implementação desta etapa:** `a6cb2ff23e6b002cabe148e8d0c9efda9b5fa31d`. A sincronização da branch remota da PR foi confirmada no SHA `7ed802a2a0a8df0e02be587d40ae6fc4d7d8d16d` via atualização compare-and-swap da referência existente. O commit local correspondente é `a6cb2ff23e6b002cabe148e8d0c9efda9b5fa31d`; a árvore verificada é idêntica.


## Primeiro QA de quadros com evidências enviadas (22/11/2026)

Cinco PNGs fornecidos pelo usuário foram inspecionados localmente por leitura RGBA e comparação entre quadros, **sem navegador**. Ordem das imagens: atlas de personagem com chapéu, mineradora, construtora, agricultora, composição dos três. Dimensões respectivamente 1122×1402, 1072×1467, 1122×1402, 1247×1261, 1942×809. Os PNGs exibem resíduos vermelhos visíveis ao redor das silhuetas. Critério de triagem cromática: R>150, R>1,8G, R>1,6B e alfa>0. Contagens por imagem: 31.655; 38.336; 186.998; 27.570; 90.929 pixels. Pixels da mesma classe com alfa>=128: 861; 7.376; 31.608; 2.339; 14.156. **Essas contagens incluem possíveis cores legítimas de roupa, portanto não representam defeitos certificados.** As diferenças médias de RGB entre quadros consecutivos variam entre 11,6 e 44,2 em uma amostra 128×128, mostrando variação de poses, mas não comprovando animação natural. A terceira prancha apresenta a maior concentração de vermelho, inclusive em roupas legítimas, exigindo revisão localizada antes de remover cores.

Novo script de QA `tools/qa-profession-frames.cjs` (commit `d42972c`) mede vermelho, alfa e diferenças de quadros dos **atlases versionados** por profissão. O script não altera imagens e não aprova a arte automaticamente. O teste local de RGBA e variação de quadros foi executado sobre os uploads; **o script Node versionado não foi executado nesta rodada**. O navegador e o Android continuam não homologados.

**Gate seguinte:** executar o diagnóstico Node sobre os atlases reais; investigar a máscara de resíduos externos em separado das roupas; corrigir a limpeza na etapa de fonte, sem apagar figurino; reconstruir o lote, validar hashes/catálogo, testar os movimentos e só depois integrar uma cena runtime.


## Android real e correção do gate V20 (22/11/2026)

Captura do usuário em Chrome Android mostra a página oficial `horushypnotic.github.io/reino-...`, vila nível 96, 98 moradores e seis muralhas. O cenário exibido usa a arte geométrica V17/V21; os novos trabalhadores ilustrados não são identificáveis nessa captura. **A captura não prova que a branch experimental esteja carregada**, nem que os atlases tenham falhado.

Investigação direta do `index.html` da PR #17 identificou bloqueio concreto: o carregador de `PetecoProfessionAtlasesV20` só inicializava quando `?v20=1`. No commit `182e110`, a branch experimental passa a carregar os atlases por padrão, com `?v20=0` como opt-out. A mesma regra foi aplicada à cena cinematográfica; o desenho da vila normal já chamava o renderer V20 com base no estado dos controladores. Teste de regressão estático `tests/v20-painted-default.test.cjs` criado no commit `06eb053`; **ainda não executado em Node**.

**Limites:** a página oficial e os saves não foram alterados. Não há preview de branch nem homologação de navegador/Android. A mudança não resolve a estética geométrica do cenário, as etiquetas sobrepostas ou os resíduos vermelhos. Próxima ação: disponibilizar uma prévia isolada multi-arquivo da PR #17, validar carregamento de imagens com rede e console, capturar a vila com profissões e testar estados reais; só então ajustar escala/oclusão e direção artística.

## Verificação direta da prévia HTTPS (22/11/2026)

**URL observada:** https://htmlpreview.github.io/?https://raw.githubusercontent.com/HorusHypnotic/reino-vivo-peteco-lab-test/experiment/v16-product-first-minute/index.html

A página abriu no Chrome desta execução e exibiu a interface V21, a vila em Canvas e trabalhadores ilustrados em cena. Entre duas observações, a simulação avançou do ciclo 572 ao 581 e do nível 21 ao 22; isso é evidência de que o runtime continuou executando, não de que cada animação ou atividade profissional foi homologada. A prévia exibiu três trabalhadores próximos entre si; a captura com o mapa ligado também mostrou etiquetas e camadas competindo pela leitura. Com o mapa desligado, árvores e construções continuam geométricas e a identidade do cenário ainda diverge da arte dos personagens. Portanto a composição não satisfaz o critério visual de publicação.

**Escopo da verificação:** a URL é uma prévia isolada da branch, não o destino oficial. O Canvas observado foi 360×480 CSS pixels no modo normal (proporção 9:11); não foi demonstrado o modo vertical 9:16 nem o viewport de Chrome Android. O armazenamento pertence à prévia e a simulação automática alterou os valores exibidos nela. Nenhum save oficial, produção, Supabase ou aparelho do usuário foi acessado. A captura da prévia não é teste Android físico.

**Resultado do gate:** parcialmente verificado: URL HTTPS da prévia carregou e a simulação permaneceu ativa; trabalhadores ilustrados estavam visíveis. Não verificado: carregamento individual e estados econômicos confirmados de cada um dos quatro trabalhadores, contatos com setores, compatibilidade de saves, regressão completa a partir deste ambiente e viewport 9:16. Reprovado visualmente para publicação: cenário majoritariamente geométrico, agrupamento/oclusão dos trabalhadores e rótulos/camadas com leitura concorrente. Esta execução não executou build ou suíte Node porque o checkout do repositório não está presente no ambiente; não atribui novos resultados aos testes já registrados no histórico. Nenhuma alteração de código ou publicação oficial foi feita.

A branch permanece em Draft. O próximo trabalho precisa corrigir a composição no renderizador existente e comprovar quatro profissões/atividades, depois executar os testes no checkout e revisar a cena 9:16 antes de qualquer publicação.

## Retomada executiva e gate de publicação (22/11/2026)

**Checkout e continuidade:** a branch alvo foi rechecado antes das alterações; o checkout de trabalho preserva a sequência recebida e a PR #17 continua sendo a única PR. A correção no commit local `a6e43d4` mantém a aldeia ilustrada ativa durante o modo espectador quando a direção automática seleciona close-up de evento. O teste `tests/v35-spectator-illustrated.test.cjs` cobre esse contrato e a leitura das 16 células fracionárias do atlas do lenhador. A correção foi levada à branch da PR por commits GitHub subsequentes; o HEAD remoto deve ser consultado junto à PR antes de qualquer nova gravação.

**Testes executados nesta retomada:** `node --test` — 112/112 passou; `node tests/collective-regression.cjs` — 8/8 passou; `node tests/live-command-regression.cjs` — 49/49 passou; `node tools/prepare-village-environment.cjs --check` passou; `node tools/clean-forest-atlas.cjs --check` passou; `node tools/validate-visual-assets.cjs` aprovou 30 verificações estruturais, incluindo 16 quadros por atlas e hashes; `node tools/qa-profession-frames.cjs` confirmou diferenças entre quadros nos quatro estados. Os resíduos vermelhos fortes detectados foram 8 no lenhador, 2.597 na agricultora, 6.022 na mineradora e 28.792 na construtora. A leitura de cor isolada não justifica apagar pixels que pertencem às roupas, ferramentas ou materiais; apenas o halo externo de baixa opacidade da floresta foi removido pelo limpador V19 já existente.

**Navegador e preview:** a branch abriu via `raw.githack.com` e o HUD visual reportou `READY` para ambiente V18, lenhador V18, floresta V19, as três casas e os atlases de agricultora, mineradora e construtora. Não houve erro de execução JavaScript da página; o único registro de erro visto era de uma extensão do Chrome. A captura da cena real confirma quatro trabalhadores ilustrados e ciclo econômico em avanço. Também reprova o gate artístico: cenário permanece majoritariamente composto por árvores, casas, lavoura, pedreira e terreno vetoriais/geométricos; há uma área extensa de fragmentos amarelos no setor florestal e agrupamento/oclusão entre trabalhadores e casas. A atividade e persistência visual dos quatro estados não foram comprovadas com quatro eventos econômicos independentes nesta sessão. O palco CSS de espectador é 9:16, mas isso não é teste em Android físico.

**HTTP da prévia:** a página e os recursos abaixo responderam HTTP 200 via HTTPS em `raw.githack.com`; esta é uma prévia gratuita multi-arquivo da branch, não a publicação oficial. `index.html`, `v20/assets/professions/{farmer,miner,builder}.png`, `v19/assets/forest-cycle-atlas-clean.png` e `v18/assets/village-environment.svg`. URL direta de prévia: `https://raw.githack.com/HorusHypnotic/reino-vivo-peteco-lab-test/experiment/v16-product-first-minute/index.html`. Ela não deve ser apresentada como publicação oficial.

**Gate final:** entrega bloqueada para merge/publicação oficial. A cena observada ainda não cumpre a qualidade visual explicitamente exigida, mesmo com todos os atlases carregando e os testes automatizados aprovados. `gh-pages`, `main`, Supabase oficial e salvamentos oficiais não foram alterados; não houve homologação física Android. Na consulta final, a PR #17 permaneceu aberta em Draft, com HEAD `ba1a7b757913c329dbcd78237c407b91a9fe260f`, base `gh-pages` em `aad905efa61835b375e80881fc6bcaae23e3890b`, 95 commits à frente, 0 atrás e `mergeable: false` reportado pela API. O comparador não informou atraso da base. Na leitura seguinte à gravação desta documentação, a API recalculou `mergeable: true`; PR segue em Draft e aberta. A mudança de estado não elimina o gate visual reprovado, portanto não foi mesclada nem publicada. Continuidade exata: substituir/remanufaturar os assets de terreno e setores geométricos pelo pipeline artístico existente, refinar a camada de fragmentos/oclusões com evidência de origem, repetir o preview interativo e capturas, e só depois avaliar merge/publicação oficial.

## Integração da casa medieval V18 (22/11/2026)

**Fonte recuperada:** arquivo `reino-vivo-casa-estados-v1.png` localizado pela busca de nome exato na Library e materializado no checkout como `v18/art-source/medieval-house-states-original.png`. SHA-256 `46e3423bed91b646e3fa9a30f6abaac29c59e2d7de962498ed05271feaa0d211`; PNG RGBA 2172×724, grade 4×1, alfa mínimo/máximo 0/255, 802.164 pixels totalmente transparentes e 21.223 pixels com alfa parcial. Os quatro quadros correspondem a fundação, construção, concluída e danificada.

**Processamento reprodutível:** `tools/prepare-house-atlas.cjs` preserva a resolução e a pintura, aplica uma regra conservadora de defringe apenas a pixels neutros quase brancos de alfa baixo, corrigiu a cor de fringe em 2.337/2.679/2.685/2.869 pixels por quadro, preservando alfa e conteúdo opaco e retirou um único componente de 229 pixels cortado na borda do quadro da fundação. Cada silhueta foi centralizada e alinhada à linha de base y=700. A saída `v18/assets/structures/medieval-house-atlas.png` mede 2172×724 RGBA e tem SHA-256 `110f97944b50a85ca732d48d9ab7559420159955bf7443cbdc37ca4f3ba3761e`. Regras, proveniência, hashes, dimensões, âncora, interação e fallback estão em `v18/manifests/medieval-house.json`.

**Integração canônica:** `v18/structure-renderer.js` seleciona quadros sem mutar estado: `stage=0` → fundação; `stage=1/2` → construção; `stage=3` e integridade ≥70 → concluída; integridade <70 → danificada. O primeiro pacote ocupa somente o encaixe noroeste real do renderizador principal; os outros dois seguem com seus assets existentes até a aprovação visual desta primeira casa. O atlas é carregado por padrão. Em falha, o QA registra erro e a casa retorna ao V18 SVG/construção anterior. Nenhuma chave ou migração de save foi adicionada.

**Testes locais antes do preview:** `node --test` — 115/115; `node tests/collective-regression.cjs` — 8/8; `node tests/live-command-regression.cjs` — 49/49; `node tools/prepare-house-atlas.cjs --check` — PASS; `node tools/validate-visual-assets.cjs` — 37 verificações estruturais, quatro estados e integridade/hash; `node --check v18/structure-renderer.js` e `node --check tools/prepare-house-atlas.cjs` — PASS; `git diff --check` — PASS. O checkout não declara `package.json` nem comando de build.

**Gate visual pendente:** este bloco registra implementação e QA de arquivo, não aprovação visual no runtime. A próxima atualização precisa relatar a prévia HTTPS e a captura real da casa na aldeia, cobrindo os quatro estados, escala, perspectiva, contato com o terreno, oclusão e proporção do espectador. A PR #17 permanece em Draft; publicação oficial continua inalterada até esse gate.


**Integração canônica:** `v18/structure-renderer.js` seleciona quadros sem mutar estado: `stage=0` → fundação; `stage=1/2` → construção; `stage=3` e integridade ≥70 → concluída; integridade <70 → danificada. O primeiro pacote ocupa somente o encaixe noroeste real do renderizador principal; os outros dois seguem com seus assets existentes até a aprovação visual desta primeira casa. O atlas é carregado por padrão. Em falha, o QA registra erro e a casa retorna ao V18 SVG/construção anterior. Nenhuma chave ou migração de save foi adicionada.

**Testes locais antes do preview:** `node --test` — 115/115; `node tests/collective-regression.cjs` — 8/8; `node tests/live-command-regression.cjs` — 49/49; `node tools/prepare-house-atlas.cjs --check` — PASS; `node tools/validate-visual-assets.cjs` — 37 verificações estruturais, quatro estados e integridade/hash; `node --check v18/structure-renderer.js` e `node --check tools/prepare-house-atlas.cjs` — PASS; `git diff --check` — PASS. O checkout não declara `package.json` nem comando de build.

**Gate visual pendente:** este bloco registra implementação e QA de arquivo, não aprovação visual no runtime. A próxima atualização precisa relatar a prévia HTTPS e a captura real da casa na aldeia, cobrindo os quatro estados, escala, perspectiva, contato com o terreno, oclusão e proporção do espectador. A PR #17 permanece em Draft; publicação oficial continua inalterada até esse gate.

## Primeiro pacote de estrutura — QA no jogo (22/11/2026)

**Preview fixado:** `https://raw.githack.com/HorusHypnotic/reino-vivo-peteco-lab-test/e3d089e8e47f38be99c94d8009af220f3f8081f5/index.html?visualqa=1`. A versão foi aberta diretamente no Chrome do executor e o palco espectador mediu 456×810,66 CSS px (razão 0,5625 ≈ 9:16); o Canvas permaneceu 360×480. O HUD mostrou `painted house atlas: READY 2172x724`, atlases de trabalhadores `READY`, e não houve erro JavaScript da página. As mensagens de erro presentes no log eram do content-script da extensão do navegador.

**Leitura visual da primeira integração:** captura em runtime mostrou a casa pintada concluída no encaixe noroeste, com os pés na linha do caminho, perspectiva e tamanho próximos da arquitetura vizinha, sem retângulo de fundo nem recorte visivelmente quebrado. Os quatro trabalhadores ilustrados ficaram visíveis no quadro. O renderizador seleciona os quatro estados a partir de `s.structures.stage/integrity`; os testes cobrem os mapeamentos sem mutar o save. Nesta captura real, somente o estado concluído esteve ativo — não se afirma que os quatro estados tenham sido capturados em quatro saves/runtime states independentes.

**Causa e correção dos quadrados amarelos:** a captura inicial mostrou dispersão amarela sobre a floresta. A inspeção rastreou dois emissores do renderizador, não pixels do atlas: `harvest()` lançava 25 partículas sem relação com a entrega e o loop da cena lançava 3 partículas a cada 14 frames enquanto `s.busy`. Ambos os efeitos foram removidos no índice; cavacos do lenhador continuam restritos à fase real `cut` e a simulação/trabalhadores continuam animados. O teste `tests/v21-profession-scene-coherence.test.cjs` impede que esses emissores voltem. A captura no commit fixado mostra o setor sem a nuvem de quadrados.

**Regressões executadas após as correções:** `node --test` — 116/116 passou; `node tests/collective-regression.cjs` — 8/8; `node tests/live-command-regression.cjs` — 49/49; `node tools/prepare-house-atlas.cjs --check` — PASS; `node tools/clean-forest-atlas.cjs --check` — PASS; `node tools/prepare-village-environment.cjs --check` — PASS; `node tools/validate-visual-assets.cjs` — 37 verificações PASS; `node tools/qa-profession-frames.cjs` confirmou variação dos 16 quadros nas quatro profissões; `git diff --check` — PASS. O projeto não declara build/package script.

**Limite do smoke HTTP:** a página e os oito recursos essenciais apareceram carregados como `READY` na aba Chrome, incluindo HTML, atlas da casa, renderizador, catálogo, floresta e os três pacotes de profissão. A tentativa de `curl -I` pelo executor recebeu HTTP 403 do Cloudflare em `raw.githack.com`; por isso não registramos status 200 via cliente HTTP do executor. A navegação HTTPS real no Chrome e os carregamentos READY são a evidência disponível, não um certificado de resposta HTTP 200 independente.

**Estado de integração/publicação:** PR #17 segue aberta em Draft; esta rodada não mesclou a PR nem alterou `gh-pages`, `main`, Supabase ou salvamentos oficiais. Os salvamentos permanecem compatíveis: nenhum campo/migração foi introduzido; renderer lê `structures` sem escrita. A captura mostrou a correção local da casa e dos fragmentos, mas as outras casas, setores, caminhos e terreno ainda aparecem majoritariamente geométricos, e a cena mantém trabalhadores relativamente agrupados. A casa validada autoriza continuar a receita, mas **não aprova a aldeia inteira para merge/publicação oficial**. Não houve teste em Android físico.

**Commits remotos da rodada:** integração da casa `521ee4a9a57465cad5ec91bc70895c77667e3f6a`; remoção da dispersão no fechamento do ciclo `f32a0282b80742d63216e477036ec78c7b504a4b`; remoção da dispersão contínua em `busy` `e3d089e8e47f38be99c94d8009af220f3f8081f5`. O último commit usado pela prévia é o terceiro SHA acima; o commit subsequente `32e6506de474f937b06055eac014ddc3aabbc11f` adiciona a regressão automatizada contra os dois emissores. O conteúdo visual de `v18/assets/structures/medieval-house-atlas.png` preserva os quatro quadros da fonte aprovada e permanece limitado a um encaixe até novo QA.

## V36 — primeiro ciclo territorial jogável

**Implementação na branch experimental:** o motor `v36/economy-core.js` agora inclui trabalho remunerado em moedas virtuais uma vez por ciclo, compra e regularização de lote, ciclos de cultivo, colheita, adesão e aporte à cooperativa, reserva de produção/caixa, contrato, despacho, transporte, recebimento em armazém e liquidação única. A restauração aceita snapshots V1 do protótipo anterior e valida antes de reabrir a sessão.

**Integração no jogo canônico:** `index.html` carrega o painel V36 somente com `?territory=1`. O painel é inserido junto ao canvas do jogo; trabalho, plantio e colheita confirmados chamam o ator agrícola V20 existente e atualizam a narrativa da vila. A viagem usa um indicador de carga animado enquanto há uma remessa `in-transit`. Em modo espectador, o painel fica oculto para preservar o enquadramento vertical. Os participantes desse corte são perfis simulados no mesmo aparelho; não há sincronização multiplayer ou identidade de chat nesta implementação.

**Preservação do progresso:** o painel salva em `peteco-v36-territory-qa-v1`. A chave canônica `peteco-lab-vila-v2` não foi modificada nem usada pelo motor V36. Nenhuma alteração foi feita em `main`, `gh-pages`, Supabase ou produção.

**Resultados executados nesta rodada:** `node --test` — 139/139; `node tests/collective-regression.cjs` — 8/8; `node tests/live-command-regression.cjs` — 49/49; `node --test tests/v36-economy.test.cjs tests/v36-playable-integration.test.cjs` — 10/10; `git diff --check` — passou. Smoke HTTP via servidor local no mesmo processo: 200 para `/?territory=1`, `v36/economy-core.js`, `v36/territory-ui.js` e `v20/factory-core.js`.

**Limite de homologação observado:** a tentativa de abrir `http://127.0.0.1:8765/?territory=1` no Chromium remoto recebeu `ERR_CONNECTION_REFUSED`; em seguida, a política do navegador negou observação desse endereço local. Não houve captura visual de runtime, medição de performance de navegador nem verificação no Android nesta rodada. A versão continua candidata experimental e não foi publicada.
