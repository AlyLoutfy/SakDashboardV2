# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SAK Platform — a real estate CRM monorepo with two apps: a **Dashboard** (admin CRM) and a **Sales Tool** (agent-facing). Both are frontend-only React apps with mock/static data (no backend API). Uses npm workspaces.

## Commands

```bash
npm install                # install all workspace dependencies
npm run dev                # run dashboard dev server (Vite)
npm run build              # build dashboard (tsc -b && vite build)
npm run lint               # lint dashboard (eslint)
npm run preview            # preview production build

# Run a specific workspace:
npm run dev --workspace=@sak/sales
npm run build --workspace=@sak/sales
```

Deploy dashboard to GitHub Pages: `npm run deploy` (runs `predeploy` → build first, then `gh-pages -d apps/dashboard/dist`).

## Architecture

**Monorepo structure:** `apps/dashboard` (`@sak/dashboard`), `apps/sales` (`@sak/sales`), `packages/shared` (`@sak/shared` — scaffolded but not actively used yet).

**Tech stack:** React 19, Vite 7, TypeScript (strict mode), Tailwind CSS v4 (via `@tailwindcss/vite` plugin), Zustand for state, React Router v7 (HashRouter for gh-pages compatibility), Framer Motion, shadcn/ui (radix-mira style) with Lucide icons, @dnd-kit for drag-and-drop.

**Path alias:** `@/` maps to `./src/` in both apps (configured in tsconfig and vite).

### Dashboard app (`apps/dashboard/`)

- **Routing:** `App.tsx` defines all routes via HashRouter. Dashboard routes under `/` use `DashboardLayout`, sales routes under `/sales` use `SalesLayout`. Both layouts in `src/layouts/`.
- **Pages:** `src/pages/` — top-level CRM pages (Integrations, Reports, PaymentPlans, Cheques, BlockingRequests, ReservationRequests). Sales sub-pages in `src/pages/sales/`.
- **State:** `src/store/` — one Zustand store per domain (e.g., `chequesStore.ts`, `paymentPlansStore.ts`, `reservationRequestsStore.ts`). Stores contain mock data generators and domain logic. Exception: `integrationStore.ts` uses React useState + localStorage instead of Zustand.
- **Components:** `src/components/ui/` — shadcn primitives. `src/components/common/` — shared components (DatePicker, DateRangePicker). Feature-specific components organized into subdirectories (`cheques/`, `sales/`, `paymentPlans/`). Design exploration components named `*Designs.tsx` at components root.

### Sales app (`apps/sales/`)

Smaller standalone app with its own layouts, pages, and store. Shares no code with dashboard currently.

### Theming

Tailwind v4 with CSS variables defined in `apps/dashboard/src/index.css`. Theme uses OkLCH color space. Custom semantic tokens: `--color-success`, `--color-warning`, `--color-error`, `--color-info`. Dark mode via `@custom-variant dark (&:is(.dark *))`.

### Key domain workflows

- **Blocking Requests:** status flow: pending → active → expired → reserved. Supports approve, reject, extend, release.
- **Reservation Requests:** multi-step approval with individual/team/either-or approver types. Tracks history and rejection reasons.
- **Cheques:** collection tracking with client breakdown, confirmation flow, overdue aging.
- **Payment Plans:** SmartCalculator with down payment, installments, maintenance, balloon payments.

### shadcn/ui

Configured in `apps/dashboard/components.json`. Add components with:
```bash
cd apps/dashboard && npx shadcn add <component>
```
