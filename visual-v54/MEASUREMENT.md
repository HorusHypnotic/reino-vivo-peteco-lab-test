# Cobertura visual V5.4 — protocolo de medição

Este experimento é **uma fatia visual independente**, não uma atualização da aplicação Lovable V5.3. Não substitui o motor, o inventário ou o estado persistido do jogo.

## Linha de base (estimativas, não medidas)

| Sistema | Estimativa inicial |
|---|---:|
| Economia e produção | 25% |
| Expansão territorial | 10% |
| Construção progressiva | 15% |
| Destruição física | 5% |
| Biomas e clima | 10% |
| Combate e facções | 10% |
| Modo espectador | 10% |

## Rubrica de avaliação (cada dimensão, 0 a 100)

Cada sistema recebe até 25 pontos por **estado de simulação**, 25 por **manifestação gráfica**, 25 por **mudança visual observável durante eventos** e 25 por **persistência e regressão testada**. Avaliar por evidências reproduzíveis, não por contagem de botões.

O protótipo visual contém: cinco terrenos com estilos próprios, desbloqueio de fronteiras, obras com três estágios, dano e reparo em edifícios, mudança de estação e modo espectador com HUD reduzido. **Não** implementa clima físico completo, facções em batalha, câmera animada, salvamento ou economia profunda. O indicador da interface exibe a estimativa histórica e a evidência acionada; não recalcula percentuais por simples clique.

## Gate de QA

1. Abrir `visual-v54/index.html` em navegador desktop e Android.
2. Expandir quatro vezes e verificar 5/5 biomas desbloqueados.
3. Construir e observar andaimes, depois completar três etapas.
4. Invadir e verificar danos gráficos; reconstruir e verificar recuperação.
5. Alternar estação e modo espectador, verificar alteração real do HUD.
6. Recarregar e registrar que a simulação reinicia (persistência pendente).
7. Registrar capturas antes/depois e atualizar a rubrica por sistema.

## Segurança

Sem TikTok real, Supabase, login, GitHub Actions ou dependências externas. A branch main permanece intocada. Publicação no GitHub Pages exige etapa de promoção/revisão separada.
