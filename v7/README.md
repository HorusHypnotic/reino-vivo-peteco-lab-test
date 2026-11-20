# V7 · Mundo Vivo · Lote 01
Experimental isolated life engine. Based on the existing gh-pages spectator build; no production/main changes.
Run: `node --test v7/life.test.cjs`.
Model: three named persistent agents, bounded task history, wood gathering/depot/building conservation, house stages and occupation, trade consumption, deterministic simulation ticks. Save schema is **separate** from legacy `peteco-lab-vila-v2`; this module is not wired to the spectator UI yet.
Limitations: no walking pathfinding, real time, families, economy prices, battle damage, Android QA, or actual visual camera tracking. The engine is a tested foundation, not V7.1 acceptance.
Next: integrate into existing simulation using an additive save field with migration, coordinate-driven drawing, camera focus and browser regression tests. Protect legacy saved games and main.
