# Project Documentation Index: Ztruyện Admin

Welcome to the canonical AI retrieval and development documentation index for **Ztruyện Admin**. This index serves as the primary entry point for AI assistants, developers, and product managers working on codebase enhancements, feature extensions, and brownfield PRDs.

---

## 1. Project Overview

* **Project Name:** `ztruyen-admin`
* **Repository Type:** **Monolith** (Single cohesive frontend SPA repository)
* **Project Type ID:** `web` (Modern Web Application)
* **Primary Language:** TypeScript (`~5.9.3`)
* **Core Framework:** React (`18.3.1`), Vite (`~7.3.1`)
* **Architecture Style:** Layered Component & Module-Based SPA with TanStack Query Server-State Management
* **Target Audience:** Platform Administrators and Moderation Staff

---

## 2. Quick Reference

* **Tech Stack Summary:** React 18, Vite 7, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query v5, TanStack Table v8, React Router v7, React Hook Form + Zod, Axios, `@dnd-kit`, `xlsx`, Cloudflare Turnstile.
* **Application Entry Points:** `index.html` → `src/main.tsx` → `src/App.tsx` → `src/routes/index.tsx`.
* **State Management:** TanStack Query v5 (server state & caching), React Context (`AuthContext` & `ThemeCustomizerContext`), Axios token refresh mutex lock (`async-mutex`).
* **Styling & UI:** Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI / Base UI primitives, Class Variance Authority (`cva`), class merging utility (`cn` via `clsx` + `tailwind-merge`).

---

## 3. Generated Documentation

The following specialized documents have been generated from an exhaustive analysis of the codebase:

* **[Project Overview](./project-overview.md)**: Executive summary, project classification, tech stack table, and architecture overview.
* **[Technical Architecture](./architecture.md)**: In-depth analysis of the 4-tier layered architecture, TanStack Query caching, security controls, and mutex-locked JWT token renewal flow.
* **[Source Tree Analysis](./source-tree-analysis.md)**: Complete annotated directory breakdown, separation of concerns (`pages/` vs `modules/` vs `services/`), and application bootstrap sequence.
* **[UI Component Inventory](./component-inventory.md)**: Detailed catalog of all 29 shadcn/ui primitives (`src/components/ui/`), common data table wrappers (`DataTableServer`, `DragDropTable`), and domain feature modules (`src/modules/`).
* **[API Contracts Catalog](./api-contracts.md)**: Exhaustive catalog of internal REST API endpoints (`VITE_API_URL`), query parameters, request/response structures, and external OTruyen integrations (`VITE_OTRUYEN_API`).
* **[Data Models & Schemas](./data-models.md)**: TypeScript entity definitions (`src/types/backend.d.ts`), Mermaid ER relationship diagram, and client-side Zod form validation rules.
* **[Developer Guide](./development-guide.md)**: Local development setup, environment variables (`.env`), NPM commands, code style rules, and a step-by-step walkthrough for adding new feature modules.
* **[Deployment Guide](./deployment-guide.md)**: Production build pipeline (`tsc -b && vite build`), Netlify SPA hosting configuration (`netlify.toml`), immutable caching headers, and production security checklist.

---

## 4. Existing Documentation

* **[README.md](../README.md)**: Original repository documentation covering project introduction, key features, technology list, directory overview, route table, environment variables, and NPM scripts.

---

## 5. Getting Started

### For Human Developers
1. **Clone & Install:**
   ```bash
   git clone <repository-url>
   cd ztruyen-admin
   npm install
   ```
2. **Configure Environment:** Copy `.env.example` to `.env` and set `VITE_API_URL`, `VITE_OTRUYEN_IMG`, and `VITE_TURNSTILE_SITE_KEY`.
3. **Start Development Server:**
   ```bash
   npm run dev
   ```
4. **Read Guidelines:** Refer to the [Developer Guide](./development-guide.md) for architectural conventions before creating new modules or components.

### For AI Assistants & Brownfield PRD Workflows
When creating brownfield Product Requirement Documents (PRDs), feature specifications, or code implementation plans:
1. **Start Here:** Always load this `index.md` first to understand project scope and structure.
2. **For UI & Styling Tasks:** Reference [UI Component Inventory](./component-inventory.md) and [Source Tree Analysis](./source-tree-analysis.md) to reuse existing shadcn/ui primitives and table wrappers.
3. **For API & Data Flow Tasks:** Reference [API Contracts Catalog](./api-contracts.md) and [Data Models & Schemas](./data-models.md) to ensure correct endpoint paths, payload types, and Zod validation rules.
4. **For Architecture & Security Tasks:** Reference [Technical Architecture](./architecture.md) to align with TanStack Query caching and Axios interceptor token renewal behaviors.
