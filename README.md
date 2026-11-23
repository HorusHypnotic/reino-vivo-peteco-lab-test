# Reino Vivo · Peteco Lab

Página de testes do Reino Vivo. A aplicação original permanece no projeto Lovable.

## Jornada da Cooperativa no PC da transmissão

Na pasta do repositório, execute `node tools/live-local.cjs` e mantenha o terminal aberto.

| Janela | Endereço |
| --- | --- |
| Chrome · direção | [127.0.0.1:8787/admin/](http://127.0.0.1:8787/admin/) |
| Edge · captura vertical | [127.0.0.1:8787](http://127.0.0.1:8787/) |

1. No Chrome, digite o código ADMIN que o Node mostrou no terminal. Na primeira abertura, comece uma vila ou importe o backup exportado pelo ADMIN público.
2. No Edge, clique uma vez no cenário para liberar o som. Selecione a janela do Edge no TikTok LIVE Studio.
3. No painel **Jornada da Cooperativa**, escolha **Jogar missão** para confirmar as ações conforme o relógio libera cada etapa, ou **Ensaiar 15 minutos** para que os dois perfis simulados façam as mesmas ações automaticamente. Durante o ensaio, **Controlar ações** devolve a direção das etapas para você.
4. **Salvar registro** baixa o estado da economia, as ações e o resultado do cerco. Após a nova missão aparecer, **Novo ensaio** arquiva a sessão anterior no Chrome e inicia outra.

O Node escuta apenas em `127.0.0.1`. A direção é exclusiva e grava no perfil do Chrome. A LIVE recebe imagem, placares e sinais de áudio por SSE. O backup da vila e o checkpoint da jornada usam chaves próprias. Se fechar o Chrome, reabra e use o código do servidor para continuar. Em fechamento abrupto, a concessão anterior expira em até 30 segundos. As vozes do Arauto dependem das vozes instaladas no navegador e no sistema.

## Verificação local

- `node --test` executa as regressões, incluindo o contrato HTTP do relay e a jornada salva e reaberta a cada etapa.
- `node tools/qa-live-admin.cjs` verifica projeção, formatos, migração e fallback no Chromium.
- `node tools/qa-journey.cjs` verifica a sessão em dois processos Chromium, em tempo real, com capturas e o registro final. Com `--resume-only`, o mesmo script testa a recarga do ADMIN e o relógio do relay com o ADMIN em segundo plano simulado. Os scripts de navegador aceitam `PETECO_PLAYWRIGHT_MODULE`, `PETECO_CHROMIUM`, `PETECO_QA_FONT` e `PETECO_QA_OUTPUT`.

A PR desta jornada é experimental. O endereço público continua pela publicação oficial.
