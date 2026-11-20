# Peteco Lab V15 — auditoria e baseline

## Escopo e origem

- Repositório: `HorusHypnotic/reino-vivo-peteco-lab-test` (público; Pages usa `gh-pages`).
- HEAD verificado em 20/11/2026: `9fba80f7b7c6fbdb3def4cc63132fdf31684e799`, V14.3.
- `main` observado separadamente em `03c52c649b0835aa2dc3b193eeaa0b0176d057b2`; não foi alterado.
- A árvore publicada tem um `index.html` autocontido de interface/lógica e módulos JS em `v7/`; não há `package.json`.
- A publicação declara simulação independente (sem TikTok real, login ou Supabase). A URL canônica permanece `https://horushypnotic.github.io/reino-vivo-peteco-lab-test/`.

## Inventário executável

| Área | Implementação encontrada | Persistência/observação |
|---|---|---|
| Vila legada | Canvas e estado central em `index.html`; mapa, regiões, habitantes/construções | Chave histórica `peteco-lab-vila-v2`; preservar sem migração |
| Mundo V7 | `life`, `roads`, `labor`, `trade`, `social`, `delivery`, `civic`, `anomalies` | Chaves separadas; checkpoints coletivos têm rollback testado |
| Plateia/facções | `v7/factions.js`, comandos simulados em `index.html` | Chaves separadas para plateia/facções; sem plataforma real |
| Guerra/diplomacia | combate em `index.html`, relatórios em `v7/diplomacy.js`; consequências em território e reparos | guerra, território e estoques gravados em chaves distintas |
| Direção audiovisual | canvas de vila e canvas isolado de combate, diretor automático, `v7/reino-sound.js`, Arauto | áudio Web Audio desbloqueado por gesto; não validado em aparelho Android real |
| Narrativa | `v7/narrative.js` e crônica/eventos centrais | limites de histórico no código; persistência varia por subsistema |

## Baseline e evidências

- Histórico de `gh-pages` inspecionado até V14.3: inclui isolamento da cena de guerra V13.8/V13.9 e correções de ruínas/reparo V14.1–V14.3.
- Referências locais em `index.html`: 15, todas resolvidas no diretório publicado; módulo inline: 107.809 bytes.
- `node --check` passou nos módulos `v7/*.js`, testes `tests/*.cjs` e módulo inline extraído.
- `node tests/live-command-regression.cjs`: PASS 49/49.
- `node tests/collective-regression.cjs`: PASS 8 cenários, incluindo rollback após falha de armazenamento.
- `node tests/war-resume-regression.cjs`: PASS; guerra salva reconstrói a fase de alerta e pode percorrer alerta → aproximação → combate.
- Achado P0 corrigido nesta branch: guerra ativa era persistida, mas o diretor reiniciava como `idle`; `warTick()` só executa ações em `combat`, congelando uma guerra recarregada. A retomada agora reconstrói o alerta cinematográfico usando o estado salvo, sem alterar nenhuma chave ou dado persistido.

## Matriz de riscos

| Risco | Nível | Evidência/mitigação |
|---|---|---|
| Guerra retomada sem fase do diretor | Alto | Corrigido e coberto por regressão permanente |
| Guerra, território e estoque não compartilham commit atômico | Alto | Escritas em chaves separadas; falhas são em geral capturadas. Ainda precisa de plano transacional/recuperação antes de mudanças maiores |
| Validação incompleta do objeto salvo da guerra/território | Médio | `warLoad` valida campos centrais, mas não todos os valores e históricos; sem migração proposta neste lote |
| Vários subsistemas iniciam no mesmo HTML e alguns controles possuem listeners distribuídos | Médio | Integração central; sem dependência circular detectada nos módulos UMD inspecionados, mas a cobertura de browser não é integral |
| FPS, memória, longa sessão e suspensão Android | Alto/aberto | Não medidos neste ambiente; sem evidência de homologação Chrome Android |

## Pendências de aceite

Este lote fecha auditoria e uma correção P0 específica; não declara V15 concluída. Permanecem: cobertura de vitória/derrota/encerramento e comandos nas transições; restauração visual em navegador real; economia de múltiplas guerras/rotas e falhas entre chaves; QA visual vertical/Android e áudio suspenso; testes de carga, FPS, memória e salvamentos antigos; lotes P1 de física, narrativa e direção. Nenhuma mudança foi publicada em `gh-pages`.
