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

## V11.9 | Convergência incremental com Reino Vivo (VS Code)
Fonte inspecionada: `HorusHypnotic/reino-em-construcao`, branch `experiment/reino-vivo-v5-jornada`, `package.json` e `README.md`. Padrões aproveitados: impacto legível, HUD menos invasivo e consequência visual da simulação. Nenhum código de servidor Node, OBS ou TikTok foi copiado.
- Commit `67095dfc` no `gh-pages/index.html`: quando estoque alimentar de uma vila experimental fica abaixo de 10, o mercado aparece fechado. É visual, não muda saldo.
- Aviso de anomalia deslocado da região central (y=99) para faixa inferior (y=405), preservando espaço de casas.
- Atualização da versão visível para V11.9 na rota principal; sem novas rotas públicas e sem alteração das chaves localStorage.
- Sintaxe do script principal PASS. QA visual em Android e resposta HTTPS da raiz ainda pendentes de confirmação do usuário.
- Próximos lotes: ações com impacto visível e duração limitada; destaque contextual de construções; prioridades de câmera sem sobreposição; eventual ponte de eventos em módulo independente, sem serviços pagos.

## V12.0 | Consequência visual de construções
- Commit `901e3df0` na página principal `gh-pages/index.html`. Nenhuma alteração na main.
- Reutiliza `laborState.events` para detectar a última construção `action:'home'` em cada vila. A casa mais recente recebe contorno dourado e indicador de construção durante dois ciclos de trabalho; texto contextual `NOVA CASA` substitui temporariamente o status profissional.
- Não adiciona recursos, eventos ou casas fictícias, nem modifica chaves de persistência. Efeito visual deriva do estado existente.
- Script principal: sintaxe PASS. QA visual e verificação HTTP no Android ainda pendentes.
- Próximo P0: destaque de ação coletiva no mapa, hierarquia de avisos da câmera e verificação visual sem obstruir o cenário.

## V12.1 | Câmera contextual para ações coletivas
- Commit `53c22022`, exclusivamente `gh-pages/index.html`.
- Reutiliza `collectiveAction` bem-sucedida para criar cue transitório de 240 frames com facção, tipo (construir/comerciar/defender) e participante; câmera AUTO enquadra a vila alvo e mostra legenda curta na faixa inferior.
- O cue é somente memória transitória, sem novas chaves localStorage, sem modificar estoque, pontuação ou cadastro. Direção prioritária `director.focus` continua prevalecendo; fora de AUTO não força câmera.
- Script principal: sintaxe PASS. Sem QA Android da cena nem teste de integração de navegador; duração em frames depende do FPS.
- Próximo: validar legibilidade e ausência de colisão de legendas no Android; considerar agendamento de cues se eventos ocorrerem em sequência.

## V12.2 | Primeiro áudio do Arauto (opt-in)
- Commit `7e88fd34` em `gh-pages/index.html`: botões para ativar/desligar áudio e testar narração. Sem alteração de main ou armazenamento.
- SpeechSynthesis em `pt-BR` com preferência por voz brasileira do dispositivo; som curto via Web Audio API (oscilador e ganho baixo). Sem arquivos de áudio, serviços pagos ou backend.
- Eventos importantes do `say` narrados com intervalo de 11 s, máximo 170 caracteres; teste manual ignora intervalo. Inicialmente desligado, requer gesto do usuário; desligar cancela a fala.
- Sintaxe PASS. QA Android pendente; voz instalada, permissão de áudio e qualidade variam por aparelho/navegador. Não equivale à voz natural do estúdio VS Code.

## V12.3 | Paisagem sonora procedural
- Commit `ab79d628` na página principal `gh-pages/index.html`; nenhuma alteração em main, Supabase, TikTok ou serviços externos.
- Dois controles de volume separados para ambiente e efeitos. Ambiente original gerado por Web Audio (drones harmônicos, raízes alternadas), ativado somente após toque explícito e desligado com o áudio.
- Efeitos distintos para ações coletivas de construção/comércio/defesa, conclusão real de casa pelo trabalho autônomo e fase de acontecimento de anomalias. Limitador de 1,8 s entre efeitos para evitar excesso.
- Suspende áudio e cancela fala ao ocultar a página, retoma ambiente ao retornar se habilitado. Nenhuma alteração nos saldos, salvamentos ou mecânica.
- Sintaxe JavaScript PASS. Android visual/sonoro da V12.3 ainda não testado; qualidade e suporte variam conforme navegador e dispositivo.

## V12.4 | Correção após QA Android do usuário
- Feedback: apenas o teste de voz do Arauto foi audível na V12.3. Ambiente e efeitos NÃO homologados.
- Commit `07e31d94`: níveis iniciais de volume ambiente 45% e efeitos 65%, ganho procedural aumentado, botão de teste direto que dispara ambiente, construção, comércio e defesa em sequência, sem aguardar eventos reais.
- Nenhuma alteração em recursos, salvamentos, `main`, TikTok, Supabase ou serviços externos. Sintaxe JS PASS.
- **Pendente**: confirmação auditiva da V12.4 no Android; teste automatizado de sintaxe não comprova áudio físico.

## V12.5 | Troca do motor de efeitos após falhas Android
- Usuário reprovou V12.3 e V12.4: somente voz de teste funcionou; experiência distante do VS Code.
- Commit `bb8bcb40`: efeitos/ambiente passam a gerar WAV PCM mono 16 kHz em memória e tocar com `HTMLAudioElement`, sem depender de `AudioContext` para esses canais. Preserva `speechSynthesis` do Arauto.
- Botão de teste inicia WAV simples e registra falha de `play()` com nome do erro no status; os eventos mantêm efeitos próprios e volumes. Limpa mídias ao desligar/ocultar página. Nenhum novo arquivo, serviço pago, alteração em main ou mudança de saves.
- JS sintaxe PASS. **Não homologado no Android**: o mecanismo de mídia pode sofrer bloqueio por política de autoplay, mesmo com toque inicial. Ainda não reproduz o pipeline audiovisual do projeto VS Code; requer inspeção e adaptação de componentes específicos.

## V12.6 | Portabilidade real do áudio do VS Code
- Origem verificada: `HorusHypnotic/reino-em-construcao`, branch `experiment/reino-vivo-v5-jornada`, arquivo `public/sound.js`. O módulo original gera música em ré dórico em buffer de 32 segundos, efeitos proceduralmente, compressor, mixer com buses separados e análise RMS.
- Copiado sem reconstrução para `v7/reino-sound.js` (commit `0c105187`) e integrado a `gh-pages/index.html` (commit `b6ee0b86`). Substituiu o experimento WAV/Web Audio anterior no caminho ativo. O controle do usuário chama `Sound.unlock()` no gesto e o status informa `locked/suspended/running`; os volumes controlam os buses reais.
- Eventos coletivos de construção/comércio/defesa e anomalias usam efeitos do motor original. O Arauto `speechSynthesis` permanece separado. Sem TikTok, Node, Supabase, GitHub Actions, serviço pago ou mudança na main.
- Verificação de sintaxe do script principal PASS. **QA Android pendente**; o usuário já reprovou V12.3-V12.5, e esta integração não deve ser declarada audível antes da confirmação.

## V12.7 | QA de comandos da plateia e áudio contextual
- Inspeção direta de `index.html`, `v7/factions.js`, `v7/civic.js`, `v7/delivery.js` e `public/sound.js` do Reino Vivo VS Code.
- Primeira rodada 47/48: falha na restauração de facção `!pais EUA` (ID com espaço). Corrigido em `v7/factions.js` para `EXT-ESTADOS_UNIDOS` (commit `29ef67ec`). Regressão após correção: **48/48 PASS**, incluindo 27 UFs, 5 países, 5 comandos inválidos, duplicata, bloqueio de troca, nome inválido, 3 ações coletivas, ações rejeitadas, ciclo de entrega, ranking e restauração. Teste permanente `tests/live-command-regression.cjs` (commit `2900509c`).
- Commit `25f2c29c`: corrige silêncio do Arauto após primeira fala em eventos de plateia, narrando entrada em facção, simulação de 100 espectadores, primeira ação coletiva da rodada e comércio confirmado. Preserva intervalo de 11 s para evitar sobreposição; efeitos de teste agora sequenciais e não simultâneos.
- Escopo verdadeiro: comandos de chat disponíveis no Lab são `!estado UF` e `!pais país`; construir/comerciar/defender são ações simuladas por botões e não comandos TikTok reais.
- **Limitação de QA**: 48/48 são testes de lógica JavaScript, não áudio físico nem reprodução Android. Música, saída de som e eventos visuais ao vivo ainda aguardam teste no dispositivo do usuário.
