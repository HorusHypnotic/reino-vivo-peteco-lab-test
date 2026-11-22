# Reino Vivo · Fábrica Visual

Memória operacional canônica para recuperar e industrializar a produção visual sem recriar os motores do jogo. Atualizada em 22/11/2026.

## Estado desta retomada

| Campo | Valor |
| --- | --- |
| Missão | Industrialização visual e recuperação da fábrica de design |
| PR | [#17](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/pull/17), mantida em Draft |
| Issue de produto | [#16](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/issues/16) |
| Branch | `experiment/v16-product-first-minute` |
| HEAD inicial verificado | `6cda2561ead7fa0d3353580834c2944e3de9fa87` |
| Base `gh-pages` verificada | `aad905efa61835b375e80881fc6bcaae23e3890b` |
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

QA de navegador: BLOQUEADO com causa observada. O Playwright não encontrou seu binário `chromium_headless_shell`; a tentativa direta com Chromium 156 no servidor local encerrou com `FATAL ... socket() failed: Operation not permitted (1)` e erro de `ptrace` do crashpad. A captura produzida, portanto, vem do renderizador Canvas usado nos fixtures, não de Chromium. Nenhuma validação em aparelho Android foi feita. Nenhuma publicação oficial foi feita.

## Situação e continuidade

- **Entregue e comprovável:** contrato industrial reutilizável para os dois atlases existentes, integração retrocompatível dos renderizadores e verificador nativo de PNG/licença/proveniência.
- **Implementado e testado:** captura de composição e suíte Node completa. Revisão visual em navegador e em aparelho Android permanecem sem comprovação.
- **Não recuperado:** prompt exato e sessão/ferramenta originais da geração do lenhador; continuam identificados como fonte ausente.
- **Preservado:** V18, V19, V20, V21, V31–V34, economia, guerra e formato Save V2; `gh-pages`, `main`, publicação oficial e Supabase não foram modificados.
- **Próxima ação executável:** terminar a prancha de estados, executar toda a suíte/regressões, revisar o render em navegador da branch e atualizar a PR #17. Não iniciar novas profissões ou assets até revisar esse pacote.
