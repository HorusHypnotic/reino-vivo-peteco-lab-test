# Contrato futuro: História, Arauto, participação e direção V7

Este documento preserva a arquitetura testada no Work do Reino Vivo sem importar o backend TikTok/SQLite para o Peteco Lab independente.

## Fonte de verdade
O motor `v7/life.js` produz eventos confirmados com `tick`, `actor`, `kind` e `detail`. A voz, a câmera e o HUD são consumidores desses eventos, nunca alteram estoque, saúde ou progresso. IDs de evento estáveis, deduplicação e persistência ainda precisam ser implementados antes de ligar narração.

## Narrativa em camadas
1. **Fato**: evento verificado, como `dispatch`, `delivery-confirmed`, `build`, `storm`, `weather-clear`.
2. **Enredo**: consequência de vários fatos, com protagonistas e objetivos persistentes.
3. **Arauto**: fala contextual em português brasileiro, com fila por prioridade, cooldown global e individual, sanitização de nomes, descarte de anúncios antigos, sem spam.
4. **Diretor**: enquadra o local físico do acontecimento, mantém combate ativo e retorna à cena principal. Transições não devem ser aceleradas ou acontecer sem causa.
5. **Participação**: comandos Fake já existentes geram solicitações; apenas ações confirmadas entram no enredo. Nunca presumir evento TikTok real.

## Referência do Work
Preservar o conceito do Arauto/voz que guia o jogo e seus testes: sincronização de fase, anúncio único por resultado, eventos atrasados/duplicados descartados, HUD limpo, câmera orientada por acontecimento e áudio contextual. O Peteco Lab não deve copiar diretamente o servidor do Reino Vivo.

## Limitações atuais
Clima V7.4 é ciclo determinístico simplificado, não previsão real. Bloqueia novas expedições por oito ciclos, mas não modela dano, tratamento, crise alimentar ou roteamento espacial. A direção V7 atual usa o último evento do ciclo, então alertas climáticos podem ser encobertos por eventos posteriores. Isso é P0 para a futura fila narrativa.
