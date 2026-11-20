# OPERAÇÃO REINO VIVO V11 | Plano de execução em grandes lotes
Data: 2026-11-20. Projeto: Peteco Lab · Vila Viva.
Branch de publicação: `gh-pages`. URL: https://horushypnotic.github.io/reino-vivo-peteco-lab-test/

## Tese
Deixar de apresentar dez facções como etiquetas em biomas genéricos. Criar dez sociedades com histórias simultâneas, progressão observável e consequências persistentes. A interação deve provocar mudanças reais, mas o mundo deve continuar vivo mesmo sem ações da plateia.

## Patrimônio verificado
- V5.4: vila original e progresso local; **não alterar** a chave `peteco-lab-vila-v2`.
- V9.x: plateia fictícia, economia coletiva, entregas, comércio, diplomacia, indicadores sociais e anomalias isolados.
- V10.3: dez assentamentos (duas facções por bioma), câmera AUTO por assentamento.
- V10.5: checkpoint único `peteco-lab-collective-checkpoint-v1` para economia, pontos e entregas; rollback em falha de armazenamento.
- Teste de regressão versionado: `tests/collective-regression.cjs`, sem GitHub Actions.
- V11.0, commit `9173a503`: primeiros moradores animados, vias, mercado aberto/fechado segundo alimento, estruturas conforme madeira/pedra; representação visual, não simulação independente de profissões.

## Restrições imutáveis
Sem alterar `main`, Supabase oficial, Vitrine Digital, TikTok real, GitHub Actions, créditos Lovable ou infraestrutura paga. Não reiniciar saves, exigir downloads, limpar localStorage ou substituir funcionalidades aprovadas. Publicar incrementalmente em `gh-pages`, com teste e evidência; não alegar QA Android sem execução Android real.

## Lote A | V11.0: cidade legível
- Identidade visual por facção, não só por bioma: composição de casas, marcos, mercado, armazém, paliçada, cores e elementos regionais.
- Personagens animados vinculados a atividades reais da simulação, não decoração aleatória.
- Variações de iluminação, ritmo, câmera e densidade populacional; HUD limpo para tela 360px.
- **Aceite:** todas as dez vilas distinguíveis em capturas; não bloquear original V5.4; sem anomalias fora do alvo.

## Lote B | V11.1: causalidade econômica
- Obras com materiais, prazo e resultado visual persistente; caravanas com origem, destino, carga e chegada.
- Alimentação, produção e consumo por vila; demanda social separada de acesso, frequência de compra e renda.
- Toda transição econômica deve ser determinística, auditável e recuperável após reload.
- **Aceite:** testes de falta de estoque, troca, entrega, duplicidade, restauração, idempotência e escassez.

## Lote C | V11.2: diplomacia e consequências
- Acordos, neutralidade, conflitos ficcionais, reconstrução e consequências territoriais.
- Eventos absurdos por assentamento, com presságio, impacto, recuperação e limite de partículas.
- **Aceite:** conflito e desastre deixam mudanças visuais, não só banners; limites contra ciclos destrutivos infinitos.

## Lote D | direção audiovisual e QA
- Transições naturais com duração suficiente para compreensão; foco somente em ação confirmada relevante.
- Arauto e destaques discretos para jogadores, sem ocultar cena; evitar rankings e propaganda simultâneos.
- Testes: sintaxe, integração de módulos, regressão dos saves, câmera das 10 paradas, eventos por vila, 30 min de estabilidade, performance e Chrome Android.
- **Aceite:** checklist PASS/FAIL/BLOQUEADO, capturas e métricas; publicar somente o que foi verificado.

## Operação autônoma
Cada lote: REBOBINE -> preservar patrimônio -> implementar alteração mínima de alto impacto -> testes -> commit -> evidência -> próximo lote. Nunca transformar progresso em apenas auditoria. Separar código implementado, testes executados e homologação pendente.

## Pendências de V11.0
1. Personagens atuais têm movimento visual, mas não profissões ou rotas persistentes.
2. Estruturas econômicas aparecem por limiar de estoque, mas não representam obras concluídas por facção.
3. Não foi executado smoke visual Android nem teste de 30 minutos.
4. Validar comportamento do checkpoint com interrupção de navegador e recuperação do estado.

## Atualização V11.1 | 2026-11-20
- Commit `774bc210`: `PetecoTrade.sync` aceita assentamentos explícitos, mantendo compatibilidade com chamadas antigas e sem sobrescrever estoque salvo.
- Commit `d048958e`: dez facções recebem economia inicial independentemente de cadastro da plateia; três pontos de sincronização atualizados; ocupação econômica e alerta de escassez visíveis no assentamento.
- Testes executados em JavaScript isolado: 10 vilas sem jogadores PASS; estoque previamente salvo preservado PASS; restore de dez vilas PASS; sintaxe do script principal PASS.
- Limite: ocupação é derivada do estoque e a animação é decorativa; ainda não existe motor de profissões ou movimentação de trabalhadores por tarefas. QA Android e estabilidade prolongada continuam pendentes.

## Atualização V11.2 | Trabalho autônomo e construções
- Commit `f45224ac`: novo módulo `v7/labor.js`, com dez vilas, ciclos determinísticos de produção/consumo, custo de casas, eventos e restauração validada.
- Commit `b3c08170`: integração a cada 900 frames, checkpoint conjunto `peteco-lab-labor-trade-v1` (comércio + trabalho), rollback em falha de armazenamento, casas concluídas representadas no mapa.
- Evidência: sete verificações PASS (10 vilas, produção, construção, restore, JSON inválido, estoques não negativos em 80 ciclos, sintaxe do script principal).
- Limites: ciclo depende de frames com a página aberta, não de relógio real; moradores ainda não possuem rotas individuais; o checkpoint de comércio e trabalho não unifica o checkpoint cívico; sem QA visual Android.
- Próximos P0: testar recarregamento com checkpoint, resolver coexistência de snapshots do comércio após ações manuais, validar a câmera e estabilidade no Chrome Android.

## Atualização V11.5 | Correção territorial e persistência
- Commit `38b05881`: a posição de anomalias agora é obtida de `settlementStops`; corrigidas as associações incorretas de BR-PE (bioma 3) e BR-RS (bioma 4).
- Comércio manual e produção autônoma compartilham a função `persistLaborTrade`, com rollback da alteração em memória quando o navegador recusa a gravação.
- Sintaxe do script principal: PASS; verificação da posição BR-PE/BR-RS: PASS.
- Verificação remota HTTPS pelo ambiente de execução: **BLOQUEADA** (falha de resolução de DNS); não confundir commit GitHub com confirmação de carregamento no Android.
- P0 pendente: smoke real no navegador Android; teste de armazenamento cheio e recarga real; eventual reconciliação do relatório comercial com ciclos de produção independentes.

## Atualização V11.6 | Direção de câmera do espectador
- Commit `e198e8c8`: AUTO alterna a cada 480 frames (~8s a 60 FPS), em vez de 900; zoom nominal de 0,64 para 0,72.
- Redução de casas decorativas de até 42 para até 13 por bioma. Construções persistentes das dez vilas continuam desenhadas separadamente.
- Sintaxe do script principal PASS; nenhum save key alterado.
- Limites: o tempo depende da taxa de quadros, sem cronômetro real; não foi realizado QA visual em Android nem medida de FPS.
- Próximo P0: verificar com capturas reais a passagem por dez vilas, evitar mudança de câmera durante evento prioritário e medir estabilidade.

## V11.7 | Diagnóstico de entrega GitHub Pages
- Evidência do usuário: Chrome Android ainda mostra V11.1 no cabeçalho e V11.0 no admin, embora o `gh-pages/index.html` do GitHub esteja em V11.6.
- Inspeção de repositório: `main/index.html` inexistente; `gh-pages/index.html` contém V11.6 e `.nojekyll` existe. Configuração efetiva de Pages não verificável com as ferramentas disponíveis.
- Commit `121f0e58`: cópia versionada `release-v11-7/index.html` com 12 caminhos relativos de módulos corrigidos; preserva origem, chaves localStorage e jogo original. URL de diagnóstico: https://horushypnotic.github.io/reino-vivo-peteco-lab-test/release-v11-7/
- Sintaxe JS da rota versionada: PASS. Acesso HTTPS externo: bloqueado por falha DNS neste ambiente. Não declarar URL funcional até teste HTTP real.
- Interpretação: se a rota nova abrir com V11.7, a distribuição de arquivos novos funciona e o problema provável é cache/navegação na rota raiz. Se retornar 404, investigar origem do Pages/deploy da branch gh-pages; se abrir versão antiga, investigar cache do navegador/proxy ou redirecionamento.
- Sem resets, GitHub Actions, alteração da main, Supabase ou TikTok real.
