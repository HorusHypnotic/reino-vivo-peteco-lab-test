# V18 | Pré-investigação para economizar créditos Work

Data: 2026-11-20. Status: pesquisa preliminar, não QA. Não acionar Work antes do gate.

## Achados verificados no motor
- index.html, função harvest(): agenda progress() após 1400ms, protege por epoch/phase/busy.
- progress(): incrementa ciclos e produção agregada por setores, inclusive forest; não existe evidência de golpe de machado individual gerar saldo.
- regionalCycle(): Vale Florestal pode acrescentar +2 wood sob condição de êxito.
- structureState(), damageStructures(), repairStructures(): integridade, ruínas e reconstrução já existem.
- V18 art-bridge.js cria trabalhadores por fórmula de população e posições artificiais. Não confundir com personagens autoritativos.
- V18 art-motion.js usa estados explícitos, mas não está ligado a eventos reais do motor.
- V18 village-scene.svg é fundo estático, não um atlas jogável.
- Arquivos de testes foram criados mas não comprovadamente executados.
- Saldo e saves são propriedade do motor. Renderer deve ser read-only.

## Pesquisa de soluções
1. Universal LPC Generator: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator ; https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/ . Exporta PNG e ZIP por animação. Licenças por camada podem incluir CC0, CC-BY, CC-BY-SA, OGA-BY, GPL. Atribuições por asset são obrigatórias salvo CC0; não presumir licença uniforme. Risco alto de incompatibilidade visual com cenário ilustrado.
2. Kenney Tiny Dungeon: https://kenney-assets.itch.io/tiny-dungeon . CC0, mais de 130 sprites, tilesheets e sprites separados. Bom para prova técnica de atlas, porém não comprova animações completas nem qualidade artística almejada.
3. Phaser animation docs: https://docs.phaser.io/phaser/concepts/animations . Técnica de frame-based spritesheets; NÃO justificar migração do motor atual sem benchmark e necessidade.
4. Kenney Roguelike Characters: https://kenney.nl/assets/roguelike-characters . CC0, mas catálogo aponta personagens frontais sem ciclos de caminhada. Não tratar como solução pronta.

## Dependências antes de execução cara
1. Localizar contrato autoritativo de produção, profissão e personagens em index.html, v7 e módulos; mapear quais eventos existem de fato.
2. Definir contrato de eventos visuais read-only (cycleStarted, sectorProduced, deliveryConfirmed, structureDamaged/Repaired) sem dupla contagem.
3. Escolher **uma** direção de arte e um atlas de 1 lenhador com pelo menos idle/walk/chop/carry. Decidir entre arte original e assets licenciados após teste de coerência com cenário.
4. Definir mapa mínimo casa→árvore→depósito e sincronização da duração do ciclo com 1,4s, sem prometer que cada golpe credita madeira.
5. Estabelecer baseline: scripts npm/node, testes disponíveis, viewport Android, FPS, saves e modo clássico.
6. Confirmar estratégia de evidência: screenshot/filmagem do ciclo, logs de eventos, saldo antes/depois, recarga sem regressão.
7. Identificar se browser QA Work consegue acessar branch experimental sem publicar em gh-pages. Se não, preview local por servidor do Work e evidência, sem publicar.
8. Definir limite de escopo: um personagem, uma região, uma tarefa, sem reescrever motor, sem dependências grandes.

## Gate de aceite para chamar Work
- Contrato técnico documentado e arquivo/função de cada evento identificado.
- Asset escolhido com licença e atribuição exatas.
- Plano de testes com comandos e critérios objetivos.
- Sem necessidade de dados adicionais do usuário.
- PR #9 existente e branch experiment/v18-art-production-v1 reutilizadas.
- Trabalho seguro e reversível, sem tocar gh-pages.

## Critério de sucesso do primeiro lote
Uma demonstração real de 1 lenhador: idle→walk→chop→carry→idle, sincronizada com evento produtivo real e atualização de saldo feita **somente pelo motor**; teste automático de não duplicação; evidência visual. O caminho pode representar o ciclo agregado, desde que isso seja declarado explicitamente.


## Contrato técnico confirmado por leitura direta de index.html

**Produção:** `harvest()` agenda `progress()` em 1400 ms e protege callbacks com `epoch`, `s.busy` e `s.phase==='vila'`. `progress()` incrementa `s.cycles` e adiciona produção bruta a `s.sectors.forest` **em todo ciclo**, mas credita `s.wood` somente em ciclos pares. Em ciclos pares, processa o setor florestal, incrementa `s.deliveries`, zera os acumuladores e pode haver consumo de madeira por construção, defesa, reparos ou outros sistemas na mesma chamada. Portanto `s.wood` pode não aumentar mesmo com trabalho real. A região florestal também pode gerar madeira em `regionalCycle()` a cada quarto ciclo, conforme sucesso regional.

**Eventos recomendados, somente leitura:**
- `onHarvestStart({epoch, cycle:s.cycles+1})` após definir `busy`, para preparar caminho/animação. Não cria saldo.
- `onProgressCommitted({cycle, forestBefore, forestAfter, woodBefore, woodAfter, deliveriesBefore, deliveriesAfter, phase})` após `progress()` e seus efeitos, apenas observação. Não inferir madeira entregue por delta final porque há consumo concorrente.
- `onHarvestAbort({epoch})` quando reset, troca de fase ou cancelamento invalidar callback. Animação volta a idle sem modificar recursos.
- `onStructureChanged({id, before, after})` apenas quando `damageStructures()`/`repairStructures()` realmente alterarem integridade/stage.
- Eventualmente criar um registro `producedWood` calculado dentro de `progress()` no ponto exato da produção, sem reexecutar regra de negócio.

**Problema de tempo:** 1400 ms não comportam automaticamente quatro etapas completas (casa→árvore→corte→depósito) com leitura natural. Primeira prova deve tratar um ciclo como um segmento de animação e permitir sequência visual distribuída entre ciclos, sem atrasar nem duplicar a produção. A animação NÃO é autoridade contábil.

**Persistência:** `save()` grava `STORE='peteco-lab-vila-v2'`, com versão `v:2`, recursos, setores, entregas, população, estruturas e demais dados. Não acrescentar campos V18 ao save nem sobrescrever `restore()` sem migração. Estado visual transitório pode ser derivado de `s.cycles`/`s.busy` e reiniciar em idle após reload.

**Construções:** `structureState()` inicializa três estruturas autoritativas; `damageStructures()` reduz `integrity` e pode zerar `stage`; `repairStructures()` consome madeira/pedra e melhora `integrity`/`stage` a cada quatro ciclos quando elegível. O `art-bridge.js` atual projeta até 38 edifícios fictícios repetindo o array de três estruturas, o que não deve ser apresentado como dezenas de casas reais destruídas.

**Gate atualizado:** antes de Work, escolher visual e verificar licenças exatas. O contrato de produção já está localizado, mas não há prova de sprite atlas adequado nem testes executados. Propor lote inicial com um lenhador visual read-only, sem economia duplicada, e só depois ampliar elenco.


## Pesquisa adicional: seleção de sprites (20/11/2026)

**Candidato preferencial para primeira prova: Universal LPC, sem migração de motor.**
- Fonte oficial: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator
- Editor: https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/
- A documentação confirma animações walk, idle, slash e outras; animações customizadas de ferramenta incluem `tool_axe` com quadros de 128px, enquanto o padrão é 64px. Portanto, a integração não pode assumir todas as linhas com quadros de 64px.
- A licença do *código do gerador* (GPL-3.0) NÃO define a licença uniforme das imagens. Arte individual pode ser CC0, CC-BY, CC-BY-SA, OGA-BY ou GPL. A seleção final deve exportar e preservar CREDITS.csv/credits.txt específicos e conferir obrigações de cada camada.
- **Não está aprovado copiar assets específicos ainda**: falta gerar um personagem com peças definidas e validar créditos e visual em jogo.

**Ferramenta potencial para exportação headless:** https://github.com/kanishka-namdeo/lpc-spritesheet-mcp . O projeto declara exportar sprites e atlas em formatos Phaser, Godot, Aseprite etc., além de créditos. É candidato de automação, NÃO dependência aprovada; antes de instalar, verificar licença, procedência, manutenção e riscos de execução de terceiros. Não requer IA paga segundo documentação.

**Alternativa CC0 para experimento:** https://kenney.nl/assets/platformer-characters (150 arquivos, CC0) e https://kenney-assets.itch.io/pixel-platformer (mais de 200 sprites, CC0). Apesar da segurança de licença, são visuais de plataforma lateral, incompatíveis com a câmera da Vila Viva em 3/4. **Rejeitados como arte final do lenhador**. Kenney Roguelike Characters é compatível com perspectiva, mas não tem ciclos de caminhada confirmados, então não resolve a animação.

**Decisão:** preservar Canvas; usar LPC como principal candidato técnico e testar visualmente **um único personagem** com licença/atribuição verificada. Não comprometer todo o cenário ao estilo LPC antes de comparar proporções e perspectiva com a V18 ilustrada.

## Preparação mínima para Work, sem pesquisa repetida
1. Ler este arquivo e index.html; não repetir descoberta de harvest/progress.
2. Fazer prova de atlas de um lenhador LPC com export de créditos e frame metadata; se a arte ficar incoerente com o cenário, parar antes de implementar uma vila inteira.
3. Criar adaptador visual read-only para harvest/progress, sem dupla contagem e sem alterar save v2.
4. Criar teste de produção em ciclos ímpares/pares, cancelamento/reset, consumo simultâneo e transições idle/walk/chop/carry.
5. Capturar pelo menos 2 imagens comparáveis e relatório de licenças antes de pedir publicação.

**Bloqueio remanescente:** personagem LPC específico ainda não foi exportado nem inspecionado em cena; QA Android e execução de testes seguem pendentes. A pesquisa é suficiente para um lote de prova técnica estritamente delimitado, mas não para declarar arte aprovada.

## Correção incremental sem Work: remover estados fictícios

- Commit 2d43d5f5: `v18/art-bridge.js` deixou de multiplicar casas por nível e população. Agora `buildings` contém somente estruturas explicitamente presentes em `s.structures`; cenário ilustrado continua decorativo e separado. `workers` só é populado por `s.artWorkers` explícito, sem atribuição de profissão por fórmula.
- Commit 63de9f8f: testes do art-bridge atualizados para exigir zero casas/trabalhadores sem fonte autoritativa e correspondência 1:1 quando fornecidos.
- **Ressalva:** `s.artWorkers` é contrato visual proposto, não campo confirmado no motor; não está integrado. Portanto, trabalhadores dinâmicos podem desaparecer no experimento até integração de eventos reais. Não alterar save para adicionar esse campo.
- **QA:** commits realizados, testes não executados neste ciclo; sem homologação visual.

## Revisão de integração e HUD (commit 708b6640)
- A chamada real em `index.html` é `PetecoArtBridgeV18.scene(s,Math.floor(s.t/900)%5)` e `PetecoArtMotionV18.draw(g,art,s.t)` somente sob `cinematicMap` e cena V18 carregada. Fora disso, usa fallback V17. Guerra tem prioridade de tela.
- HUD anterior dizia `N construções · M trabalhadores`; esses números não eram garantidos por estado autoritativo e, após correção do bridge, frequentemente seriam zero. HUD agora diz `N estruturas registradas · produção em andamento/em espera` com base em `s.structures` e `s.busy`. Isto NÃO significa que exista lenhador animado real.
- **Bloqueio visual maior:** imagem `v18/assets/village-scene.svg` é cena estática de uma vila específica, enquanto a chamada do bridge alterna biomas a cada 900 frames. É necessário atlas/cenários por bioma ou manter rótulo consistente; não alegar que a imagem representa os cinco biomas.
- **Bloqueio funcional:** `s.artWorkers` não é preenchido no motor; logo a V18 não possui trabalhadores dinâmicos comprovados após remoção dos falsos. O próximo lote deve introduzir adaptador read-only derivado de eventos, sem forjar jobs individuais.
- **Validação:** alteração no GitHub, sem execução de browser/testes neste ciclo.
