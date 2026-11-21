# V20.0 | Fábrica de Mundos Vivos

## Motivo
O lenhador e a árvore V19 foram homologados visualmente pelo usuário no Chrome Android. A próxima escala deve reutilizar contratos e não produzir controladores artesanais isolados. A PR #12 (Obra Viva) permanece experimental e não é pré-requisito de merge da fábrica.

## Contratos encontrados
- Estado de economia existente: `s.sectors.forest`, `s.sectors.farm`, `s.sectors.quarry`, `s.project`, `s.projectGoal`.
- `progress()` atualiza setores, recursos e entregas; o renderizador nunca deve fazê-lo.
- `PetecoWoodcutterV18` é patrimônio existente, não substituir.
- O cenário ilustrado inclui obra decorativa; `s.project` representa projeto coletivo, não necessariamente aquela obra específica. Não exibir seu percentual sobre a construção até validar vínculo real.
- O save V2, facções, guerra, modo clássico e gh-pages não podem ser alterados por este lote.

## Entrega V20.0
- `v20/factory-core.js`: manifesto inicial de profissões (forest/farm/quarry/construction), leitura read-only, contrato de eventos confirmados e fila determinística priorizada.
- `tests/factory-v20.test.cjs`: contratos, deduplicação, ordenação e rejeição de eventos não confirmados.
- **Sem integração ao index.html ainda**: não emitir eventos artificiais ou mostrar trabalhadores sem origem real.

## Portões antes de produção em massa
1. Testes completos e regressões executados (sem GitHub Actions).
2. Inventário de eventos reais do motor por profissão, com `source`, `confirmed` e `cycle` fundamentados.
3. Mapa de posições, alvos e zonas sem sobreposição com HUD.
4. Atlas e manifesto de frames, dimensões, checksum e licença de uso.
5. Controller universal com cancelamento, reload, prioridade de guerra e fallback.
6. Renderização Android e medição de FPS/memória.
7. Integração gradual com PR #12 somente após vincular obra ao estado correto.

## Escala planejada
V20.1: lenhador + agricultor + minerador + construtor; V20.2: oficina, transporte e serviços; V20.3: comércio, defesa e vida civil. Cada profissão deve ter alvo, ação, consequência e prova visual.

## Situação
Fundação técnica em branch experimental. Nenhuma publicação, QA Android ou suíte completa reivindicados.

## Incremento: controlador universal
- `v20/actor-controller.js` implementa caminhada → trabalho → retorno, cancelamento e uma ação pendente.
- `tests/actor-v20.test.cjs` cobre rejeição de evento não confirmado, sequência, retorno ao depósito, cancelamento e fila.
- **Limitação deliberada:** não há integração com o motor, spritesheets das novas profissões nem prova de navegador. O controlador não deve criar eventos por conta própria.
- O lenhador V18/V19 permanece com seu controlador homologado.

## Integração real incremental (V20.0)
- `index.html` agora carrega os quatro módulos V20 antes do jogo.
- `progress()` captura o estado antes do cálculo econômico e traduz diferenças somente depois do commit original do lenhador; aciona atores de agricultura, mineração e construção sem mutar economia.
- `frame()` avança o controlador genérico e `reset` cancela os atores. O lenhador e seu atlas continuam independentes.
- **Não há sprites ou renderização das novas profissões:** a ponte funciona internamente, sem criar figuras provisórias na página. Os novos atores não devem ser apresentados como homologados.
- `tests/integration-v20.test.cjs` verifica a integração textual. Suíte completa e navegador ainda pendentes.
- Observação: setor farm/quarry zera nos ciclos de entrega; o adaptador só emite trabalho quando observa acúmulo positivo, e não deduz entrega individual a partir do total agregado.

## V20.0: protótipo visual opt-in
- `v20/profession-renderer.js`: rig Canvas 2D reutilizável para agricultor, minerador e construtor, com roupa/ferramenta configuradas por profissão.
- Em `index.html`, desenha somente se `?v20=1` e o cenário V18 estiver ativo; `?classic=1` continua clássico. Nenhuma alteração do save ou da economia.
- O rig é **provisório e procedural**, não um atlas final de qualidade V19. Ele serve para validar coordenadas, gatilhos e sobreposições. Não declarar arte final.
- `tests/profession-renderer-v20.test.cjs`: contrato de desenho e flag de prévia.
- **Ainda pendente:** executar testes Node, verificar layout e performance em navegador Android, gerar atlas artístico licenciado e substituir o rig após aprovação visual. Branch não publicada.

## QA incremental 21/11/2026
- Cinco módulos V20 carregados e nove verificações funcionais aprovadas em sandbox JavaScript.
- Cinco arquivos de testes V20 executados com simulação de `require`, `fs`, `vm` e `path`: 5/5 PASS. **Não é execução nativa do Node.**
- Smoke Canvas simulado com três profissões e fallback sem `roundRect` PASS; teste de regressão persistido no commit 9b39a58.
- Integração textual no HTML verificada: ordem de scripts, captura econômica, commit, reset e flag `?v20=1`.
- Ainda bloqueado: suíte completa `node --test` real, renderização em browser, inspeção visual, FPS Android, autorização para publicação.

## 21/11/2026 · Robustez da fila por trabalhador
- Corrigido `actor-controller.js`: rejeita ciclos duplicados/antigos, conserva o evento pendente de maior ciclo e limpa marcação no reset. Commits 294cbd4, a2af185.
- Cinco testes V20 novamente PASS em execução JS com dependências Node simuladas. A suíte Node nativa e QA Android continuam pendentes.
- Nota: eventos de trabalho são observados na economia, mas não equivalem a entregas individuais confirmadas. Não usar o rótulo 'entrega' para farm/quarry sem comprovação adicional.

## 21/11/2026 · Portão de batalha e obra
- Commit 3d206d5: frame cancela atores V20 quando a fase deixa de ser vila ou a guerra ocupa a cena; prioridade de guerra preservada.
- O construtor segue no catálogo e recebe eventos econômicos, mas **não é desenhado** sobre a obra ilustrada sem vínculo comprovado. Renderização experimental opt-in apenas de farm/quarry.
- Commit 547c322: teste de integração cobre os dois contratos.
- Execução simulada de cinco testes V20 após correções: 5/5 PASS; sem alegação de suíte Node nativa ou QA Android.
