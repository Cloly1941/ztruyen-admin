# Project Overview: Ztruyện Admin

## Executive Summary
**Ztruyện Admin** is the modern administrative dashboard for the Ztruyện online comic reading platform. Built as a high-performance **Monolith Single Page Application (SPA)** using **React 18**, **TypeScript**, and **Vite 7**, it empowers platform administrators to manage users, ban lists, decorative avatar frames, user comments, emojis, system announcements, country comic rankings, and user guides.

---

## 1. Project Identification & Classification

* **Project Name:** `ztruyen-admin`
* **Repository Type:** **Monolith** (Single cohesive frontend application repository)
* **Project Type ID:** `web` (Modern Web Application SPA)
* **Primary Language:** TypeScript (`~5.9.3`)
* **Target Audience:** Platform Administrators and Moderation Staff
* **Backend Repository:** [ztruyen-be](https://github.com/nguyentrongbut/ztruyen-be)
* **User Frontend Repository:** [ztruyen-v1.1.0](https://github.com/Cloly1941/ztruyen-v1.1.0)

---

## 2. Technology Stack Summary

| Category | Core Technology | Key Libraries & Tools |
| :--- | :--- | :--- |
| **Framework & Build** | React 18, Vite 7 | `@vitejs/plugin-react`, TypeScript |
| **Routing & State** | React Router v7, TanStack Query v5 | `@tanstack/react-query`, `@tanstack/react-query-devtools` |
| **Styling & Design System**| Tailwind CSS v4, shadcn/ui | `@tailwindcss/vite`, Radix UI, Base UI, Lucide React icons |
| **Data Tables & Forms** | TanStack Table v8, React Hook Form | `@tanstack/react-table`, Zod schema validation |
| **HTTP & Security** | Axios, Cloudflare Turnstile | `async-mutex` (for token refresh locking), `react-helmet-async` |
| **Utilities & I/O** | `@dnd-kit`, `xlsx`, `dayjs` / `date-fns` | Drag-and-drop table row sorting, Excel spreadsheet import/export |

---

## 3. Architecture Classification

The application implements a **Layered Component & Module-Based SPA Architecture**:
* **Presentation Layer:** Separated into route-level wrappers (`src/pages/`), domain-specific feature modules (`src/modules/`), and reusable UI primitives (`src/components/ui/` and `src/components/common/`).
* **State & Caching Layer:** Leverages TanStack Query for asynchronous server-state caching, pagination metadata, and automatic refetching, combined with React Context for client authentication session and theme styling.
* **Service & Network Layer:** Decoupled Axios service wrappers (`src/services/`) communicating with the REST API, featuring an automated mutex-controlled JWT token renewal interceptor.

---

## 4. Repository Directory Structure Summary

```text
ztruyen-admin/
├── public/                  # Static web assets (icons, robots.txt)
├── src/
│   ├── components/          # Shared UI library (shadcn/ui primitives & common widgets)
│   ├── configs/             # Centralized constants (API paths, query keys, router URLs)
│   ├── context/             # Global client state (AuthContext, ThemeCustomizerContext)
│   ├── hooks/               # Custom React hooks (useDataTable, useAuth, useDragDropTable)
│   ├── layouts/             # Dashboard structure (Sidebar, Header, Panel, Search)
│   ├── lib/ & utils/        # Utility helpers (Tailwind class merger cn, query builder, Excel)
│   ├── modules/             # Domain feature modules (User, Ranking, Emoji, Frame, etc.)
│   ├── pages/               # Route-level page wrappers
│   ├── routes/              # Router tree definition & ProtectedRoute ADMIN guard
│   ├── services/            # Axios API communication wrappers & token refresh mutex
│   ├── styles/ & theme/     # Tailwind CSS v4 directives and Dark/Light mode provider
│   └── types/               # TypeScript interfaces (backend models, table columns)
├── netlify.toml             # Netlify SPA deployment & asset caching configuration
├── package.json             # Project scripts and dependency manifests
└── vite.config.ts           # Vite build and plugin configuration
```

---

## 5. Generated Documentation Index

The following comprehensive documentation files have been generated in the project knowledge repository (`docs/`):

* **[Master Index](./index.md)**: Primary retrieval source and AI navigation guide.
* **[Technical Architecture](./architecture.md)**: Deep dive into layered system design, TanStack Query caching, and security/token refresh mutex flows.
* **[Source Tree Analysis](./source-tree-analysis.md)**: Annotated directory breakdown, separation of concerns, and application bootstrap flow.
* **[UI Component Inventory](./component-inventory.md)**: Catalog of all 29 shadcn/ui primitives, common data tables, and domain feature modules.
* **[API Contracts Catalog](./api-contracts.md)**: Documentation of all internal REST endpoints, query parameters, payloads, and external OTruyen integrations.
* **[Data Models & Schemas](./data-models.md)**: TypeScript entity interfaces, ER relationship diagram, and client-side Zod validation rules.
* **[Developer Guide](./development-guide.md)**: Instructions for local environment setup, NPM commands, code style rules, and step-by-step module creation.
* **[Deployment Guide](./deployment-guide.md)**: Production build workflow, Netlify SPA hosting configuration, caching headers, and security checklist.
