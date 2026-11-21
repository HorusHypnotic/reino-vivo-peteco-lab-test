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
