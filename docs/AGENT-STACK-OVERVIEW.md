# AGENT STACK OVERVIEW (Audit Phase)

_Gerado em 12 Nov 2025 pelo agente de modernização._

## Plataforma & Runtime
- **Framework:** React 18 (SPA) com Vite 5 (build & dev server)
- **Linguagem:** TypeScript (tsconfig dividido em app/node)
- **Node Target:** Type module + ESNext

## UI & Design System
- **Tailwind CSS 3.4** com presets Shadcn
- Biblioteca de componentes Radix adaptada em `src/components/ui/*`
- Temas através de `theme-provider.tsx` e `theme-toggle.tsx`
- Ícones `lucide-react`

## Estado & Dados
- **React Context:** `AuthContext`, `UserContext`
- **TanStack Query 5** para cache/requests (limitado)
- **Hooks customizados:** `useClientes`, `useRevendas`, `useDashboardData`, `useRealtime`, etc.
- **Drizzle ORM:** configurado em `drizzle.config.ts` + `db/schema.ts`
- **Supabase:** cliente em `src/lib/supabase.ts`, integrações adicionais em `src/integrations/supabase`

## Autenticação & Segurança
- Supabase Auth (PKCE) com fluxos de e-mail/senha + Google OAuth
- Tipagens geradas em `src/types/supabase.types.ts`
- Scripts auxiliares de CLI e SQL na raiz (vários guias)

## Estrutura de Pastas
- `src/pages` – roteamento via React Router DOM (Dashboard + páginas públicas)
- `src/components` – UI modular (modal, sidebars, formulários, WhatsApp)
- `src/services` – integrações externas (API Brasil, Whatsapp socket)
- `supabase/` – config local com migrations/seed
- `db/` – Drizzle schema/index (Neon / Postgres)
- `migrations/` – scripts SQL legados

## Ferramentas & Scripts
- `npm` scripts para Vite, Supabase CLI, Drizzle, ESLint
- ESLint + Typescript ESLint + Tailwind + PostCSS
- Tests legacy via scripts JS simples (RLS checker)

## Observações da Auditoria
1. **Alta dependência** do Supabase direto via client; Drizzle utilizado parcialmente.
2. Grande volume de manuais `.md`/`.sql` na raiz documentando correções manuais.
3. Projeto orientado a dashboards admin (multi-cliente, revendas, WhatsApp, cobrança).
4. Espaço para modernização: realtime avançado, edge caching, AI insights ainda inexistentes.
5. Estrutura atual é compatível com incrementos “non-destructive” por meio de arquivos `*.agent.*`.

✅ Auditoria concluída — nenhum arquivo existente alterado.
