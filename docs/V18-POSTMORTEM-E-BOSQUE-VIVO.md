# V18 → V18.1 | Memória operacional e bosque vivo

Data: 2026-11-20/21. Repositório: HorusHypnotic/reino-vivo-peteco-lab-test.

## Resultado observado pelo usuário
A PR #9 foi incorporada a gh-pages pelo merge edca0cec8cd058c0e9cb577ad3dccdcbe9461a4f. Capturas fornecidas pelo usuário no Chrome Android mostram a mesma página oficial, o lenhador com machado em duas poses distintas, nível 78, 80 moradores, ciclos 6452→6471, e mensagem de vila restaurada. Isto comprova carregamento visual e continuidade observável de sessão, mas não comprova por si só toda a cadeia de corte/entrega nem QA completo de save, guerra e economia.

## Linha do tempo factual
1. V14.6/V17: motor existente com economia, facções, plateia, construções, persistência V2 e cena primitiva.
2. Issue #10 e PR #9, branch experiment/v18-art-production-v1: pesquisa documentada em docs/V18-PRE-WORK-RESEARCH.md. Objetivo: um lenhador pintado animado sem alterar economia.
3. V18: v18/woodcutter-controller.js e renderer, atlas 4×4, ponte visual, cena SVG e integração com harvest()/progress(). Caminhada, trabalho, transporte e repouso são estados visuais transitórios; somente progress() produz madeira. Não se deve inventar recursos ou personagens persistidos.
4. Testes anteriores: node --test 5/5; regressão coletiva 8; comandos live 49/49; validação de sintaxe. Esses testes não eram QA visual de navegador.
5. Erro de entrega: criada uma rota secundária preview-v18 em gh-pages, anunciada sem GET público. Usuário recebeu 404. A rota secundária foi removida. Aprendizado: commit não é publicação; uma única URL oficial.
6. Erros detectados: HUD lia campo inexistente forestOutput, corrigido para producedWood; cenário podia aparecer antes de carregar o atlas, corrigido com gate de ready e fallback V17; atlas PNG corrompido/truncado, restaurado no commit ca020d1 e coberto por teste de integridade.
7. Work confirmou HTML oficial HTTP 200 e correspondência byte a byte com gh-pages, mas não conseguiu navegador local por socket() failed Operation not permitted. Não houve QA runtime completo.
8. Após autorização explícita do usuário para publicação controlada e reversível sem Work, PR #9 marcada ready e merged em gh-pages, commit edca0cec. Fetch do index.html oficial confirmou referências V18 e fallback V17.
9. Capturas reais do usuário mostram lenhador e cenário na URL usual, com estado persistido visível. Vitória parcial real: personagem aparece e muda de pose. Problema remanescente: ele atua no centro da vila, sem árvore-alvo identificável, e a cena permanece estática por muitos ciclos.

## Diagnóstico do produto
- Cenário SVG é uma composição visual quase estática; não basta aumentar quantidade de sprites.
- Lenhador caminha de DEPOT (200,404) para TREE (118,290), mas o cenário não garante árvore-alvo na posição. Isso quebra a causalidade percebida.
- O estado visual é proxy de produção florestal agregada, não profissão persistida de um indivíduo. A V18.1 não deve fingir que cada golpe produz recurso.
- HUD continua rotulando motor V14.6. Diferenciar versão visual da versão econômica.
- Imagens do usuário demonstram estados de pose diferentes, não validam o ciclo completo.

## Regras aprendidas / não repetir
- Uma página oficial: https://horushypnotic.github.io/reino-vivo-peteco-lab-test/
- Não criar links de preview nem depender de Work para concluir lotes seguros.
- Preservar save V2, guerra, modo clássico e economia; toda camada artística é read-only.
- GitHub Pages: verificar URL pública real após merge, sem afirmar publicação apenas por commit.
- Priorizar observabilidade no Android real e feedback do usuário; registrar bloqueios sem falsos PASS.
- Reutilizar atlas, controlador, ponte, SVG e testes; não reconstruir motor.

## Plano V18.1 | Bosque vivo
1. Bosque visual com árvores-alvo na área florestal e posicionamento coerente com o lenhador.
2. Árvore inclinando/queda/toco e toras após entrega confirmada; não creditar madeira pela animação.
3. Depósito e regeneração visual por ciclos, determinística, sem persistência nova.
4. Sincronizar os eventos com o controlador existente e manter fallback.
5. Testes unitários de cena/produção e verificação real na única URL após liberação.
6. Evitar obstruir HUD e construções. Mudanças pequenas, reversíveis.

## Critérios de aceite V18.1
- O lenhador chega a uma árvore visível.
- Corte e consequência visual têm causa legível.
- Entrega só aparece quando ledger.deliveryConfirmed.
- O bosque regenera sem duplicar recursos nem mudar save V2.
- A cena não congela nem monopoliza a direção; guerra e eventos têm prioridade.
- Atualização na mesma URL; prova por captura Android antes de declarar homologação final.
