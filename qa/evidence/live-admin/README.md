# Evidências de LIVE e ADMIN

Ensaio de 23/11/2026 no Chromium 140 com Playwright. O ambiente headless usou uma fonte de fallback apenas para as capturas. O roteiro verificou o estado da cena e a caixa da fita de comandos no navegador.

| Captura | Resolução |
| --- | --- |
| [LIVE compacta](live-360x640.jpg) | 360 × 640 |
| [LIVE vertical](live-1080x1920.jpg) | 1080 × 1920 |
| [LIVE no desktop](live-desktop.jpg) | 1280 × 800 com palco 9:16 centralizado |
| [ADMIN local](admin-desktop.jpg) | 1280 × 800 |

| Verificação | Resultado |
| --- | --- |
| `node --test` na base inicial `dd02675` | 142 passaram |
| `node --test` na PR #20 | 145 passaram |
| `node --test` na candidata de Pages | 133 passaram |
| Browser na PR e na candidata | LIVE 9:16 sem controles, ADMIN público em QA, migração de save, câmera e combate, loop de áudio Web Audio, autor único, troca de autor, recarga do espectador e fallback |
| Economia territorial na PR #20 | O painel abre no ADMIN local com `?territory=1`, grava na chave experimental e fica fora da LIVE |
| Android físico, Windows e captura no TikTok LIVE Studio | Pendentes |

Para reproduzir o ensaio com Chromium e Playwright locais, execute `node tools/qa-live-admin.cjs`. O runner usa duas portas locais efêmeras e um perfil descartável. `PETECO_CHROMIUM` permite indicar o executável de Chromium e `PETECO_PLAYWRIGHT_MODULE` permite indicar uma instalação existente do Playwright.

A [candidata de Pages](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/tree/candidate/live-admin-pages-v1) parte de `3dd1b14976a1672d68daf569c15a1c96cfecca66`. Nenhum arquivo ou fluxo V36 entra na candidata. A árvore de arte da versão oficial é mantida. A comparação está disponível no [diff isolado](https://github.com/HorusHypnotic/reino-vivo-peteco-lab-test/compare/gh-pages...candidate/live-admin-pages-v1). Se um deploy futuro precisar de reversão, reverta os commits de publicação na `gh-pages` em ordem inversa e confira a árvore contra a base registrada.
