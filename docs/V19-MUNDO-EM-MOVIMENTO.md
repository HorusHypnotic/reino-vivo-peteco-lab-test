# V19 · Vila Viva: mundo em movimento

## Estado deste lote

Lote 0 rebobinado e Lote 1 recebeu uma camada artística de floresta sobre o ciclo do lenhador existente. A alteração reutiliza o controlador V18.1 e observa apenas o ledger confirmado; não grava estado, não soma madeira e não cria habitantes. A PR #11 foi incorporada em `a23a8ff`; a URL oficial serve o HTML e os assets V19. O save V2 e a economia permaneceram sem alterações.

## Catálogo integrado

| Asset | Estados | Origem | Dimensão | Uso |
| --- | --- | --- | --- | --- |
| `v18/assets/woodcutter-atlas-original.png` | repouso, caminhada, corte, transporte | Recuperado e preservado da V18 | 1122×1402 RGBA; 4×4 | Ator lenhador, já integrado |
| `v19/assets/forest-cycle-atlas.png` | árvore, queda, toco/toras, broto | Gerado para este lote, sem fonte externa | 2172×724 RGBA; 4 células de 543×724 | Estado da árvore-alvo no bosque |
| `v18/assets/village-scene.svg` | cenário V18 | Asset existente | SVG | Fundo da vila existente |

O asset novo pesa aproximadamente 1,14 MiB comprimido e ocupa cerca de 6,3 MiB decodificado em RGBA. A imagem mantém transparência. A contribuição é original gerada para esta missão; não incorpora pacotes de terceiros e não requer atribuição externa. As licenças e atribuições dos assets V18 permanecem conforme documentadas em `docs/V18-LENHADOR-REAL.md`.

## Contrato visual validado em código

| Evento/estado do motor | Efeito | Fonte autoritativa |
| --- | --- | --- |
| Ator em repouso ou caminhada/corte sem entrega | Árvore adulta | Controlador transient V18; sem consequência econômica visual |
| `phase=carry` e `ledger.deliveryConfirmed=true` | Árvore caída durante o transporte | `progress()` confirmou a entrega e a mudança do contador de cargas |
| Entrega concluída | Toco e toras por 850 ms | Mesmo ciclo confirmado; renderização temporária |
| Regeneração visual | Broto entre 850 e 1900 ms; árvore adulta depois | Temporizador visual em memória; não altera setor, madeira ou save |
| Atlas não carregado/inválido | Fallback V18 existente | Carregamento seguro de asset |

O ciclo é visual e transitório. Uma recarga descarta somente a animação em andamento; o motor retoma a produção conforme o save V2 e executa uma nova sequência com eventos reais. Nenhuma chave de persistência foi adicionada.

## Lotes seguintes e contratos observados

O motor possui contadores agregados para floresta, fazenda, pedreira e oficina; o `progress()` credita cargas em paridade de ciclo e pode aplicar consumo, expansão e reparos no mesmo passo. A produção regional também pode alterar estoques. Portanto diferenças de saldo, isoladamente, não identificam qual profissão trabalhou. A próxima ponte deve consumir eventos/deltas do passo confirmado e não derivar trabalhadores de população, saldo final ou setores simulados separados.

Construções reais estão em `s.structures` com `stage` e `integrity`; guerras e danos têm estado próprio. Esses dados permitem efeitos de cenário somente quando o evento que os alterou for observado. A camada V18 `art-motion.js` ainda tem atores geométricos; não será usada como substituta dos sprites de profissões.

| Lote | Estado |
| --- | --- |
| 0 · inventário/contratos | Concluído nesta retomada; V2, eventos agregados, estruturas e guerra identificados |
| 1 · bosque V18.1 | Atlas ilustrado integrado e publicado; suíte automatizada passa; a aba do navegador conectado manteve uma resposta antiga |
| 2 · pacote artístico | Parcial: atlas ambiental do bosque catalogado. Outros personagens/biomas/construções ainda não produzidos |
| 3 · economia viva | Pendente: sem ponte confirmada para atores de fazenda, pedreira, oficina e entrega |
| 4 · vila em transformação | Pendente: ligar estados reais de estruturas a arte de estágio, dano e reparo |
| 5 · guerra visual | Pendente: revisar apresentação atual e acrescentar efeitos sem comandar o resultado do combate |
| 6 · direção cinematográfica | Pendente; guerra ativa e interação confirmada continuam prioridades |
| 7 · QA/publicação | HTML, módulo e atlas verificados por HTTP 200 na URL oficial; QA visual/runtime dessa aba e Android real continuam pendentes |

## Verificações desta retomada

- `node --test`: PASS, 7/7 arquivos, incluindo a regressão do atlas V19 e posição fixa da árvore.
- `node tests/collective-regression.cjs`: PASS, 8 checks.
- `node tests/live-command-regression.cjs`: PASS, 49/49.
- `node --check v18/bosque-vivo.js`: PASS.
- `git diff --check`: PASS antes das alterações V19.
- `tests/forest-art-v19.test.cjs`: PASS; testa decode PNG, canais alfa, os quatro estados, gate de entrega e fallback.
- URL oficial canônica: HTML HTTP 200, 142627 bytes, SHA-256 idêntico ao `index.html` em `gh-pages` (`2c7842f45fadd539caf7aaedfd8943a89d3ca8b10211b9d4f1b7698ad48fa670`). O documento serve as referências `PetecoForestArtV19`, `v19/forest-art.js` e `v19/assets/forest-cycle-atlas.png`.
- O atlas oficial e o módulo retornam HTTP 200; SHA-256 do atlas publicado coincide com o asset do branch (`422978a6e7c430d7fcd7e30aebd0fec7e51a71af79f18ad659922a282faf4a1f`). A aba de navegador conectada reteve um HTML anterior mesmo após navegação com cache bust; por isso não comprova o runtime atualizado. Captura visual do runtime, viewport móvel e Android real não foram homologados.

## Gate de publicação

A publicação controlada ocorreu após validação automatizada e conferência de HTTP/SHA na mesma URL oficial. Rollback preparado: `gh-pages` anterior era `edca0cec8cd058c0e9cb577ad3dccdcbe9461a4f`; para reverter somente o merge `a23a8ff`, usar `git revert -m 1 a23a8ff660b950d71dcea60564842f8d0f0ba612` em `gh-pages`. QA visual/runtime no navegador atualizado, save/reload real, viewport móvel e Android real permanecem pendentes; portanto não há homologação visual/Android.
