# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm (`packageManager: pnpm@12.3.4` in [package.json](package.json)).

```bash
pnpm dev      # start dev server (http://localhost:3000)
pnpm build    # production build (standalone output)
pnpm start    # run the production build
pnpm lint     # eslint
```

There is no test runner configured in this repo (no test script, no test framework dependency).

## Architecture

Next.js 16 App Router project (React 19, TypeScript, Tailwind CSS v4) bootstrapped from `create-next-app`, with shadcn/ui added on top.

- **Routing**: pages live under [app/](app/) using the App Router convention — [app/page.tsx](app/page.tsx) is `/`, and each subdirectory (`app/about/`, `app/hello-nextjs/`, `app/shadcn/`) is its own route via `page.tsx`. [app/layout.tsx](app/layout.tsx) is the single root layout for the whole app: it loads the Geist fonts, sets `lang="ja"`, and wraps all children in `ThemeProvider`.
- **Theming**: [components/theme-provider.tsx](components/theme-provider.tsx) wraps `next-themes` and is applied globally in the root layout with `attribute="class"` and `defaultTheme="dark"`. Dark-mode styling throughout the app follows Tailwind's `dark:` variant tied to this class.
- **UI components**: shadcn/ui components live in `components/ui/` (e.g. [components/ui/button.tsx](components/ui/button.tsx), [components/ui/input.tsx](components/ui/input.tsx), [components/ui/dropdown-menu.tsx](components/ui/dropdown-menu.tsx)). Configuration for the shadcn CLI is in [components.json](components.json): style `base-nova`, base color `neutral`, icon library `lucide`, path aliases `@/components`, `@/components/ui`, `@/lib`, `@/hooks`. Use `pnpm dlx shadcn@latest add <component>` to add new primitives rather than hand-writing them, so they stay consistent with this config.
- **Path aliases**: `@/*` maps to the repo root (see [tsconfig.json](tsconfig.json)), matching the shadcn aliases above (e.g. `@/lib/utils`, `@/components/ui/button`).
- **Utilities**: [lib/utils.ts](lib/utils.ts) re-exports `cn` from the `cn` package for conditional className composition — the standard shadcn helper.
- **Linting**: [eslint.config.mjs](eslint.config.mjs) extends `eslint-config-next` (core-web-vitals + typescript) with one project-specific override: double quotes are enforced (`quotes: ["error", "double"]`).
- **Docker/deployment**: [next.config.ts](next.config.ts) sets `output: "standalone"` specifically to support the multi-stage [Dockerfile](Dockerfile) (deps → builder → runner), which copies `.next/standalone` and `.next/static` into a minimal `node:24-alpine` runtime image and runs `node server.js`.
