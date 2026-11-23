# Peteco Lab · Vila Viva | Patrimônio e contexto consolidado
**Data:** 20/11/2026 · **Publicação:** V9.7 · **Status:** laboratório experimental, sem TikTok real, login ou Supabase.

## 1. Diretriz e escopo
- Um único endereço público oficial: https://horushypnotic.github.io/reino-vivo-peteco-lab-test/?utm_source=chatgpt.com
- Repositório: `HorusHypnotic/reino-vivo-peteco-lab-test`; publicação em `gh-pages`; não alterar `main`.
- Sem GitHub Actions, Lovable, serviços pagos, downloads obrigatórios, terminais do usuário ou dependência de PC.
- Preservar a experiência V5.4, inclusive a chave `peteco-lab-vila-v2`, sem limpar localStorage nem reiniciar o mundo.
- REBOBINE: recuperar patrimônio; INFORMODINÂMICA: reduzir retrabalho e registrar evidências; CUIDA: executar lotes seguros.
- Não confundir testes de sintaxe/isolados com homologação real no Chrome Android.

## 2. Patrimônio original V5.4
Vila autônoma com setores de madeira, agricultura, pedra e oficina; habitantes, muralhas comunitárias, mercado, enfermaria, ataques, defesa, progresso de nível e ciclos. Cinco territórios com estações, saberes e dificuldades; visitantes fictícios, profissões, corte e intrigas; simulador TikTok Fake desconectado; crônica e observabilidade local. Modo espectador, direção de cena, Arauto, câmera e áudio preexistentes. A batalha e os recursos originais não devem ser substituídos pelos sistemas experimentais.

Última evidência enviada pelo usuário: nível 58, 60 moradores, 3.113 ciclos, 5 muralhas completas, 7 invasões e 3 vitórias; recursos da vila principal 192 madeira, 147 alimentos e 949 pedras. São valores do relato, **não leitura atual do navegador**.

## 3. Evolução implementada
| Versão | Entrega | Evidência / ressalva |
|---|---|---|
| V8.4 | Plateia fictícia de 100 participantes distribuídos em 10 facções brasileiras | Usuário confirmou 100 no Chrome |
| V8.5–V8.7 | HUD, edificações cívicas, carroça e visual de obra coletiva | Revisões visuais incrementais |
| V8.8 | Fila logística `v7/delivery.js`: queued → transit → building → done | Teste isolado de transição e restore; validação Android pendente |
| V8.9 | Redução de sobreposição visual | Commit `3d010f12` |
| V9.0 | Botão de rodada de até 3 ações da plateia, consumo experimental e pedidos de carga | Usuário confirmou rodada 1: PA build, SP trade, BA defend; saldo 73 madeira, 57 alimentos, 33 pedras |
| V9.1 | Contabilização de novas obras somente após entrega, sem retroagir resultados antigos | Commit `0ead22ce`; teste completo de recuperação transacional pendente |
| V9.2 | Ranking de 3 facções na cena do espectador | Commit `80e2c907` |
| V9.3 | Ranking periódico com relógio real, animação e supressão durante destaques | Commit `aecd7f4e`; QA visual pendente |
| V9.4 | `v7/trade.js`: estoques próprios, produção/consumo, escambo por escassez | Teste de 20 rodadas, 5 trocas e restore aprovado; commit `cf636916` |
| V9.5 | `v7/diplomacy.js`: acordos, pedidos de ajuda, confiança e relatório contextual | Teste isolado de pedido, acordo e restore aprovado; commit `eeb01080` |
| V9.6 | `v7/social.js`: visitas fictícias ao mercado, 10 famílias/vila, janelas de 7 e 30 rodadas, demanda não atendida | Teste isolado de visitas, escassez e restore aprovado; commit `20facdc9` |
| V9.7 | `v7/anomalies.js`: chuva de peixes, tornado impossível, gravidade invertida; fases e efeitos limitados | Teste isolado de 3 eventos, bloqueio de sobreposição, estoques não negativos e restore aprovado; commit `783a8109` |

## 4. Chaves locais isoladas
- `peteco-lab-vila-v2`: V5.4, patrimônio **intocável**.
- `peteco-lab-factions-crowd-v1`: plateia fictícia.
- `peteco-lab-civic-v1`, `peteco-lab-civic-economy-v1`: ações e estoque cívico.
- `peteco-lab-delivery-v1`: pedidos e etapas logísticas.
- `peteco-lab-crowd-round-v1`: contador de rodadas.
- `peteco-lab-village-trade-v1`: estoques e trocas entre vilas.
- `peteco-lab-diplomacy-v1`: confiança e histórico diplomático.
- `peteco-lab-social-market-v1`: frequência de visitas fictícias.
- `peteco-lab-anomalies-v1`: eventos absurdistas.

## 5. Visão de jogo e regras
**A interação manda.** O público deve alterar consequências verificáveis, não assistir a cenas aleatórias. A estética é medieval/fantasia; fenômenos modernos e impossíveis podem acontecer. O absurdismo vem do contraste entre Arauto solene e eventos inesperados, mas deve respeitar presságio → acontecimento → consequência → recuperação.

A economia deve distinguir estoque agregado, acesso das famílias, frequência de compra e demanda não atendida. Frequência não prova riqueza ou pobreza. Comércio deve anteceder conflito; guerra deve ter custo, limites de saque, cessar-fogo e reconstrução. Nenhuma facção deve ser inferiorizada por sua identidade geográfica/cultural.

**V9.7 não contém guerra, exércitos, destruição física persistente, chuva animada ou desastres automáticos.** Anomalias são acionadas por botões e alteram somente a economia territorial experimental; a gravidade invertida é registrada, ainda sem física visual.

## 6. Pendências por prioridade
1. **P0:** homologar V9.1–V9.7 no Chrome Android real; verificar restauração e persistência, incluindo recarga durante carga pendente ou anomalia ativa.
2. **P0:** reforçar consistência transacional entre estoque, pontos cívicos e fila logística. Evitar dupla contabilização, perda de fila e operações parciais.
3. **P1:** trazer anomalias para o canvas: presságios, efeitos visuais limitados, reações do Arauto, marcas de dano e recuperação; não bloquear câmera, ranking nem batalha.
4. **P1:** mostrar caravanas, diplomacia e indicadores sociais em cenas, sem transformar o modo espectador num painel administrativo.
5. **P1:** conferir se relatório social acompanha efetivamente as rodadas econômicas, inclusive ao restaurar e adicionar novas facções.
6. **P2:** alianças, tratados, conflitos territoriais e paz com consequências reais e testáveis.
7. **P2:** introduzir preços, renda fictícia, estoque doméstico, distância e acessibilidade antes de interpretar frequência de compras como indicador social robusto.
8. **P2:** balanceamento econômico e limites para crescimento infinito, eventos raros e gatilhos de crise.
9. **P2:** teste automatizado de integração no navegador e regressão visual Android.

## 7. Operação e evidência
Toda entrega deve citar commit, arquivo, testes executados e lacunas. Sem afirmar publicação HTTPS funcional ou homologação Android somente porque o commit foi aceito no GitHub. A única URL a compartilhar com o usuário é a oficial acima. Evitar limpeza de dados e troca de origem, que perderiam os salvamentos locais.

## 8. Próximo lote recomendado
V9.8: direção de cena dos eventos absurdistas, com indicadores visuais e Arauto, integrando `PetecoAnomalies` ao canvas e aos relatórios sem tocar na V5.4. Antes, testar a continuidade dos estados salvos e os limites da logística.
