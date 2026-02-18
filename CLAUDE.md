# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build → dist/
```

No lint or test scripts are configured.

## Architecture

**Stack:** React 18 + TypeScript, React Router v7, Tailwind CSS v4, Vite 6, shadcn/ui (Radix UI), deployed on Netlify.

**Entry:** `src/main.tsx` → `src/app/App.tsx` (routing + layout shell)

**Routing:** All routes defined in `App.tsx` with lazy-loaded pages. Three WIP pages (`/our-work`, `/faqs`, `/resources`) use `<Navigate to="/" replace />` on `main` branch to hide them from production. To re-enable a page: remove the redirect, add the nav link back in `Navigation.tsx` and `Footer.tsx`.

**Pages** live in `src/app/pages/`. **Shared UI primitives** (shadcn/ui) live in `src/app/components/ui/`. **Layout components** (Navigation, Footer, ErrorBoundary) live in `src/app/components/`.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite`. CSS variables for the design tokens (colors, etc.) are defined in `src/styles/theme.css` and consumed by Tailwind via `@theme` in `src/styles/tailwind.css`. To retheme the site, edit those CSS variables.

**Images:** A custom Vite plugin (`figmaAssetPlugin` in `vite.config.ts`) resolves `figma:asset/` imports to `src/assets/`. Use this pattern when importing images from the assets folder. The `@` alias maps to `./src`.

**SEO:** Each page calls the `useSEO` hook (`src/app/hooks/useSEO.ts`) to set page title and meta description dynamically.

**Email:** Contact and Resources pages use `@emailjs/browser`. Credentials (service ID, template ID, public key) are placeholders — these need to be configured for the forms to send.

## Branch / Deploy Strategy

- `main` → production at sanctuarydc.org (WIP pages hidden)
- `preview` → Netlify branch deploy at `https://preview--sanctuarydc.netlify.app/` (all pages visible)

`netlify.toml` handles the SPA redirect (`/* → /index.html`) and branch deploy build config.
