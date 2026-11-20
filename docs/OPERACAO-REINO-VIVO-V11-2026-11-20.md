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
