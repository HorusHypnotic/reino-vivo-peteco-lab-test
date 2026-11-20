# V6 Mundo Orgânico — Lote 01 (experimental)
Base: gh-pages. Não publicar nem substituir o estado local V5.5 sem migração validada.

## Entregue
- Modelo isolado de edifícios físicos com ID, região, coordenadas, tipo, etapa (0–4), HP (0–100), histórico de revisões.
- Geração determinística inicial a partir do nível legado.
- Salvamento local em chave separada peteco-lab-physical-v1; validação e fallback seguro.
- Testes Node nativos (sem dependências): `node --test v6/physical-world.test.cjs`.

## Pendente para aceite
- Executar testes em runner real e guardar stdout; ainda não executados nesta entrega.
- Integrar ao renderizador existente com migração não destrutiva e backups.
- Substituir casas geradas a cada quadro por entidades persistentes.
- Teste real de Android, recarregamento, dano/reparo e captura antes/depois.
- Não elevar cobertura visual antes de QA.
## Riscos
- O estado atual de combate tem dano agregado, não dano por edifício.
- Persistência local pode ser apagada pelo navegador; export/import de save fica para etapa posterior.
- Regras de economia e construção precisam produzir eventos por ID, sem inferir história a partir do nível.
