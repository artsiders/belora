<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Directives & Règles Projet Belora
Pour les règles détaillées de DA, typographie, composants et React Query, consulter `.agents/AGENTS.md`.

## Interdiction Formelle des Effets de Zoom / Agrandissement au Survol (`hover:scale`)
- **Ne jamais utiliser `hover:scale-*` ou `group-hover:scale-*`** (ex : `hover:scale-105`, `group-hover:scale-104`, `hover:scale-102`, `scale-105`, etc.) sur les images, cartes, icônes, conteneurs ou boutons.
- Les éléments doivent rester stables et fixes dans leur conteneur sans zoom ni effet de pulsation saccadé.
