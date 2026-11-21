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
