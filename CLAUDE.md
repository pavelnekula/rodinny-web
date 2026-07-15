# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A private Czech-language family website (`rodinny-web` — "Nekulovi") built with Next.js App Router. It hosts standalone learning mini-apps for the kids (Tinuška, Teo) — math drills, physics lessons, English vocabulary games — plus a small wine pre-order form for a family vineyard (`Sklep u Kapličky`). There is no CMS or blog; each section under `app/` is its own self-contained feature area.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is no test suite/framework configured in this repo (no jest/vitest/playwright). Don't assume one exists; verify UI changes by running `npm run dev` and exercising the page in a browser.

`node_modules` is not pre-installed in a fresh checkout — run `npm install` before `dev`/`build`/`lint`.

One-off data-migration scripts live in `scripts/` (plain `.mjs`, run directly with `node scripts/<name>.mjs`) — used historically to patch generated data in `components/tinuska/anglictina/VocabularyData.ts`. They are not part of the build.

## Architecture

**Routing.** Standard Next.js App Router under `app/`. Each top-level family member/section is its own route subtree with its own `layout.tsx` that wraps children in `SiteChrome` (`components/site/SiteChrome.tsx`) with a section `accent` color:

- `/matematika` — blue — math exercises (shared by both kids)
- `/tinuska`, `/tinuska/anglictina` — purple — Tinuška's Czech/English section
- `/teo`, `/fyzika-teodor`, `/teo/pokemon` — green — Teo's Czech/physics/Pokémon section
- `/sklep-u-kaplicky` — orange — wine pre-order form (public-facing, not kid content)

`SiteChrome` is the single shared chrome (fixed top nav) — don't add a second nav bar to a page. `lib/subjects.ts` defines the subject nav data (`tinuskaSubjects`, `teoSubjects`) used by hub pages to link into `/matematika`, `/tinuska/anglictina`, etc.

**Feature module shape.** Each learning feature (fyzika-teodor, matematika, tinuska/anglictina) follows the same three-layer split:
- `data/<feature>/` — static Czech-language content (lessons, exercises, pexeso pairs, vocabulary), typed via a `types.ts` in the same folder. `data/fyzika/index.ts` re-exports content keyed by topic slug (`getTopicContent(slug)`).
- `lib/<feature>*.ts` — pure logic: exercise generators (`mathGenerators.ts`, `delitelnostGenerators.ts`), scoring/answer-normalization (`fyzika/normalizeAnswer.ts`), and **localStorage-backed persistence** (`mathStorage.ts`, `fyzika/storage.ts`, `delitelnostProgress.ts`). These storage helpers guard every read/write with `typeof window === "undefined"` checks since they're imported from both client components and (transitively) server code — follow that pattern for any new persisted stat.
- `components/<feature>/` — client components (`"use client"`) consuming the data + lib layers. Game/exercise components are the largest files in the repo; sub-behavior is split into `hooks/`, `modes/`, `shared/`, and `utils/` subfolders (see `components/tinuska/anglictina/`).

**Progress/scores are entirely client-side.** There is no backend for game scores — everything is `window.localStorage`, namespaced by key prefix per feature (`math_*`, etc.). When adding a new persisted value, add read/write helpers next to the existing ones in that feature's storage module rather than calling `localStorage` directly from components.

**Supabase is used only for the Pokémon card collection** (`app/teo/pokemon/`). `lib/supabase.ts` exports a client built from `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, with `isSupabaseConfigured` as a guard and a placeholder client so the module doesn't throw at build/import time without env vars. Always check `isSupabaseConfigured` before querying (see `app/teo/pokemon/page.tsx`) and render a Czech-language config-missing message instead of crashing. Server components in this route use `export const dynamic = "force-dynamic"` since data isn't statically cacheable. Schema/seed lives in `supabase/pokemon_cards.sql`, run manually in the Supabase SQL editor (no migration tooling).

**Email is sent via Resend** from the single API route `app/api/send-wine-order/route.ts`, using shared validation/pricing logic from `lib/wine-order.ts` (wine list, delivery options, price calc, `isValidEmail`) so client (`components/sklep-u-kaplicky/WineOrderForm.tsx`) and server share one source of truth. Requires `RESEND_API_KEY` env var; the route 500s with a Czech error message if it's missing. `parseBody` in the route does full manual validation/merging of line items — extend it rather than trusting client input if you add fields.

**Styling** is Tailwind v4 (`@import "tailwindcss"` in `app/globals.css`, no separate config file — tokens defined via CSS custom properties and `@theme inline`). Design system rules are enforced by `.cursor/rules/page-style-consistency.mdc` (Czech-language, `alwaysApply: true`) — **read it before touching any page's visuals**:
- Dark, Apple-inspired look; page background is always black (`--app-bg`/`bg-app-bg`), no light full-page backgrounds.
- Only use color via the `--app-*` CSS variables / `app-*` Tailwind tokens (e.g. `bg-app-bg`, `text-app-muted`, `text-app-accent`) — never hardcode hex colors.
- Cards use `.app-card` (+ `.app-card-interactive` for hover) — 18px radius.
- Buttons use `.app-btn-pill` combined with `.app-btn-primary` or `.app-btn-secondary`.
- Section accent color is set once via `data-accent` on `SiteChrome` (`blue` = intro/math, `purple` = Tinuška/English, `green` = Teo/physics, `orange` = Sklep) — don't hardcode accent colors per-page.
- Keep the shared `SiteChrome` nav; don't build a second bespoke top nav.
- Preserve focus rings (`ring-app-accent`) and `aria-label`s for accessibility.

**Language.** All user-facing copy, comments in data/content files, and commit messages in this repo's history are Czech. Match that for any new content/UI strings; code identifiers are a mix of Czech domain terms (`petiminutovky`, `delitelnost`, `bleskovky`) and English — follow the existing naming already used in the surrounding feature, don't translate existing identifiers.

## Important: this is not a stock Next.js version

`next.config.ts` and `tsconfig.json` are otherwise standard, but per `AGENTS.md`, the installed Next.js version in this repo has breaking changes vs. the Next.js you may know from training data — conventions and APIs may differ. Once `node_modules` is installed, check `node_modules/next/dist/docs/` for the current APIs and heed any deprecation notices before writing App Router code, especially around routing, data fetching, or config.
