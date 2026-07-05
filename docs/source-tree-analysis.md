# Source Tree Analysis & Directory Architecture

## Executive Summary
This document provides an annotated analysis of the codebase structure for **Ztruyện Admin**. The repository is organized as a **Monolith Single Page Application (SPA)** built with React 18, Vite 7, and TypeScript. The source tree follows a modular, domain-driven frontend architecture that separates routing, business feature modules, API communication services, shared UI primitives, and server-state caching.

---

## 1. Annotated Directory Tree

```text
ztruyen-admin/
├── public/                  # Static assets (favicons, public logos, robots.txt)
├── src/                     # Main application source code
│   ├── components/          # Reusable UI primitives and shared components
│   │   ├── ui/              # shadcn/ui primitives (Button, Dialog, Table, Input, etc.)
│   │   └── ...              # Theme toggles, Avatar frame overlays, common widgets
│   ├── configs/             # Centralized application configurations and constants
│   │   ├── api/             # API endpoint paths (BASE_URL, CONFIG_API)
│   │   ├── field-excel/     # Excel import/export column mappings and headers
│   │   ├── local-storage/   # Local storage key names (e.g., access token key ZTC_ATK)
│   │   ├── query-key/       # TanStack Query cache keys (CONFIG_QUERY_KEY)
│   │   ├── role/            # Role definitions and permissions
│   │   └── router/          # Application route paths (CONFIG_ROUTER)
│   ├── context/             # React Context providers for global client state
│   │   ├── AuthContext.tsx  # Authentication state, user profile, login/logout actions
│   │   └── ThemeCustomizerContext.tsx # Theme styling, sidebar layouts, scale presets
│   ├── hooks/               # Custom React hooks
│   │   ├── auth/            # Authentication hooks (useLogin)
│   │   ├── common/          # Reusable table and API hooks (useDataTable, useDragDropTable, usePostMethod, usePatchMethod, etc.)
│   │   └── use-mobile.ts    # Responsive mobile breakpoint detection hook
│   ├── layouts/             # Page structure layouts
│   │   └── ...              # Default admin layout containing Sidebar, Header, Search, Panel
│   ├── lib/                 # Core utilities and helper libraries
│   │   └── utils.ts         # Tailwind CSS class merger (cn using clsx + tailwind-merge)
│   ├── modules/             # Domain-specific business feature modules (Tables, Forms, Dialogs)
│   │   ├── Announcement/    # Announcement management UI (Create/Update forms, Table)
│   │   ├── Comment/         # Comment moderation UI and data table
│   │   ├── Emoji/           # Emoji & Emoji Category management UI and reordering
│   │   ├── Frame/           # Avatar frame management UI and upload forms
│   │   ├── Guide/           # Guide article editor and platform filter tables
│   │   ├── Ranking/         # Comic country ranking management and JSON import
│   │   └── User/            # User CRUD, ban/restore, Excel import/export, avatar frames
│   ├── pages/               # Route-level page components (mapped to React Router)
│   │   ├── ...              # Home/Dashboard, Login, Users, Ban Users, Frames, Comments, Emojis, Categories, Ranking, Announcements, Guides, 403 Forbidden
│   ├── routes/              # Application route configuration and guards
│   │   ├── index.tsx        # Router tree definition using React Router v7
│   │   └── ProtectedRoute.tsx # Route guard enforcing ADMIN role authentication
│   ├── services/            # Backend communication layer (Axios API wrappers)
│   │   ├── axios-customize/ # Custom Axios instance with interceptors and token refresh mutex
│   │   ├── auth/            # Login, logout, token refresh API calls
│   │   ├── comic/           # Comic ranking and JSON import API calls
│   │   ├── comment/         # Comment listing and deletion API calls
│   │   ├── emoji/           # Emoji & category CRUD API calls
│   │   ├── export/          # Excel download and template export service
│   │   ├── frame/           # Avatar frame CRUD API calls
│   │   ├── guide/           # Guide article CRUD API calls
│   │   ├── otruyen/         # External OTruyen API client for comic categories
│   │   ├── upload/          # Single and multi-image upload API calls
│   │   └── user/            # User CRUD, ban, restore, and Excel import API calls
│   ├── styles/              # Global stylesheet
│   │   └── index.css        # Tailwind CSS v4 directives and custom utility classes
│   ├── theme/               # Theme management
│   │   └── ThemeProvider.tsx # Dark/Light mode DOM attribute controller
│   ├── types/               # TypeScript type declarations
│   │   ├── backend.d.ts     # Backend API models and entity interfaces
│   │   ├── axios.d.ts       # Axios custom config type extensions
│   │   ├── columns.d.ts     # TanStack Table column definitions
│   │   └── global.d.ts      # Global window/utility types
│   ├── utils/               # General utility functions
│   │   ├── buildQueryString.ts # URL search param builder for table pagination/sorting
│   │   └── ...              # Date formatters (dayjs/date-fns), Excel helpers, badge renderers
│   ├── App.tsx              # Root application setup (QueryClient, RouterProvider, Toaster)
│   └── main.tsx             # Application bootstrap entry point
├── .env.example             # Environment variable template
├── components.json          # shadcn/ui configuration file
├── eslint.config.js         # ESLint 9 flat configuration
├── index.html               # Main HTML host template
├── netlify.toml             # Netlify deployment and SPA redirect configuration
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript compiler configurations
└── vite.config.ts           # Vite build and plugin configurations
```

---

## 2. Key Architectural Patterns by Directory

### A. Separation of Concerns: `pages/` vs `modules/` vs `services/`
To maintain scalability and clean code separation, the project follows a strict 3-tier presentation structure:
1. **Route Pages (`src/pages/`):** Thin wrapper components responsible for page title rendering (via `React Helmet Async`), breadcrumb setup, and mounting feature modules.
2. **Feature Modules (`src/modules/`):** Heavy business logic resides here. Each admin domain (e.g., `User`, `Ranking`, `Emoji`) has its own dedicated folder containing TanStack Table column definitions, data table wrappers, creation/update modals, and Zod form validation schemas.
3. **API Services (`src/services/`):** Fully decoupled from UI components. All HTTP communication is encapsulated in service objects (e.g., `UserService`, `ComicService`) that invoke the customized Axios instance.

### B. Configuration-Driven Architecture (`src/configs/`)
Rather than hardcoding API paths, route URLs, or cache keys across components, the application centralizes all constants in `src/configs/`:
* **`CONFIG_API`**: Ensures zero typos in backend endpoint paths.
* **`CONFIG_QUERY_KEY`**: Provides strongly typed string constants for TanStack Query caching and invalidation.
* **`CONFIG_ROUTER`**: Single source of truth for frontend navigation.

### C. Reusable Table & Mutation Hooks (`src/hooks/common/`)
To eliminate boilerplate across administrative CRUD pages, custom hooks wrap TanStack Query:
* **`useDataTable`**: Handles server-side pagination, searching, sorting, and query string generation automatically.
* **`useDragDropTable`**: Combines `@dnd-kit` with TanStack Table for drag-and-drop row reordering (used in Emoji Categories and Avatar Frames).
* **`usePostMethod` / `usePatchMethod` / `useActionMutation`**: Standardizes form submission loading states, success toasts, and query cache invalidation.

---

## 3. Application Entry Points & Bootstrap Flow

1. **`index.html`**: The single HTML page loaded by the browser. It imports `/src/main.tsx`.
2. **`src/main.tsx`**: Mounts `<App />` inside the DOM root (`#root`) with React 18 Strict Mode.
3. **`src/App.tsx`**: Initializes global application providers:
   * **`QueryClientProvider`**: Sets up TanStack Query cache and default stale times.
   * **`HelmetProvider`**: Manages document headers and SEO meta tags.
   * **`AuthProvider` & `ThemeCustomizerProvider`**: Supplies authentication state and theme preferences.
   * **`RouterProvider`**: Mounts the routing tree defined in `src/routes/index.tsx`.
   * **`Toaster`**: Renders global notification toasts (via `react-hot-toast`).
4. **`src/routes/index.tsx` & `ProtectedRoute.tsx`**: Intercepts navigation. If a user visits an administrative route without an active session or `ADMIN` role, they are redirected to `/login` or `/403`.
