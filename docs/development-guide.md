# Developer Guide & Local Setup

## Executive Summary
This document provides complete instructions for setting up, running, developing, and extending **Ztruyện Admin**. The project uses **Vite 7**, **React 18**, and **TypeScript ~5.9**, enforced by strict linting rules and modular architectural conventions. Following this guide ensures consistent code quality and seamless integration when adding new administrative features.

---

## 1. Prerequisites & Environment Setup

### System Requirements
* **Node.js:** Version 18.x, 20.x, or higher (compatible with Vite 7).
* **Package Manager:** `npm` (v9+ recommended).
* **Git:** For version control and branch management.

### Environment Variables (.env)
Create a `.env` file in the root directory by copying the template:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Base URL of the Ztruyện Backend REST API
VITE_API_URL=http://localhost:8080/api/v1

# External OTruyen API base URL for fetching comic categories & images
VITE_OTRUYEN_IMG=https://otruyenapi.com

# Cloudflare Turnstile site key for login captcha verification
# Use dummy testing key '1x00000000000000000000AA' for local development
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

---

## 2. Local Development Commands

The repository includes standardized NPM scripts in `package.json`:

| Command | Script | Description |
| :--- | :--- | :--- |
| **Install Dependencies**| `npm install` | Downloads and links all NPM dependencies. |
| **Start Dev Server** | `npm run dev` | Launches Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`. |
| **Production Build** | `npm run build` | Executes TypeScript type-checking (`tsc -b`) followed by Vite production bundling into `/dist`. |
| **Lint Codebase** | `npm run lint` | Runs ESLint 9 across all `.ts`, `.tsx`, and `.js` files to check code style and React hook rules. |
| **Preview Build** | `npm run preview` | Boots a local static web server to test the production `/dist` bundle before deployment. |

---

## 3. Code Style & TypeScript Conventions

* **Path Aliases:** Always use the `@/` alias trated in `vite.config.ts` and `tsconfig.json` to reference the `src/` directory (e.g., `import { BASE_URL } from "@/configs/api";`). Avoid relative paths like `../../configs/api`.
* **TypeScript Strictness:** Do not use `any`. Define explicit interfaces in `src/types/backend.d.ts` for backend responses and payloads.
* **Tailwind Class Merging:** When creating reusable UI components that accept `className` props, always wrap class strings with the `cn()` utility from `@/lib/utils`:
  ```tsx
  import { cn } from "@/lib/utils";
  export const CustomBox = ({ className, ...props }) => (
      <div className={cn("p-4 bg-white rounded-lg shadow", className)} {...props} />
  );
  ```
* **Linting:** Ensure `npm run lint` passes without warnings or errors before submitting a pull request.

---

## 4. Step-by-Step Guide: Adding a New Feature Module

When adding a new administrative section (e.g., managing "Banners"), follow this strict 7-step checklist to maintain architectural consistency:

### Step 1: Define TypeScript Interfaces (`src/types/backend.d.ts`)
Add the entity model and form payload types:
```typescript
export interface IBanner {
    _id: string;
    title: string;
    image: IImage;
    link: string;
    isActive: boolean;
    createdAt: string;
}
```

### Step 2: Register API Endpoints & Query Keys (`src/configs/`)
1. In `src/configs/api/index.ts`, add the endpoint:
   ```typescript
   BANNER: { INDEX: 'banner', DETAIL: 'detail', UPDATE: 'update', DELETE: 'delete' }
   ```
2. In `src/configs/query-key/index.ts`, add cache keys:
   ```typescript
   BANNER: { LIST: 'list-banner', DETAIL: 'detail-banner' }
   ```
3. In `src/configs/router/index.ts`, add the route path:
   ```typescript
   BANNER: { INDEX: '/banners' }
   ```

### Step 3: Create the Service Wrapper (`src/services/banner/index.ts`)
Create an Axios wrapper encapsulating API calls:
```typescript
import axios from "@/services/axios-customize";
import { CONFIG_API } from "@/configs/api";
import type { IBanner } from "@/types/backend";
import type { TQueryParams } from "@/hooks/common/useDataTable";
import { buildQueryString } from "@/utils/buildQueryString";

export const BannerService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params);
        return await axios.get<IBackendRes<IModelPaginate<IBanner>>>(`${CONFIG_API.BANNER.INDEX}?${query}`);
    },
    add: async (payload: any) => axios.post<IBackendRes<IBanner>>(CONFIG_API.BANNER.INDEX, payload),
    delete: async (id: string) => axios.delete<IBackendRes<void>>(`${CONFIG_API.BANNER.INDEX}/${CONFIG_API.COMMON.DELETE}/${id}`)
};
```

### Step 4: Build the Feature Module (`src/modules/Banner/`)
Create a dedicated folder inside `src/modules/Banner/` containing:
* **`BannerTable.tsx`**: Uses `useDataTable` and `DataTableServer` to render the paginated grid.
* **`BannerColumns.tsx`**: Defines TanStack Table columns (title, image preview, active toggle, action dropdown).
* **`BannerCreateForm.tsx`**: Implements React Hook Form paired with a Zod schema for input validation:
  ```typescript
  const schema = z.object({
      title: z.string().min(1, "Title is required"),
      link: z.string().url("Invalid URL"),
      isActive: z.boolean().default(true)
  });
  ```

### Step 5: Create the Route Page Component (`src/pages/Banner/index.tsx`)
Create the route wrapper component setting Helmet title and breadcrumbs:
```tsx
import { Helmet } from "react-helmet-async";
import BannerTable from "@/modules/Banner/BannerTable";

const BannerPage = () => {
    return (
        <>
            <Helmet><title>Manage Banners - Ztruyện Admin</title></Helmet>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Banner Management</h1>
                <BannerTable />
            </div>
        </>
    );
};
export default BannerPage;
```

### Step 6: Register Route in Router (`src/routes/index.tsx`)
Mount the page inside the `ProtectedRoute` layout in `src/routes/index.tsx`:
```tsx
{
    path: CONFIG_ROUTER.BANNER.INDEX,
    element: <BannerPage />
}
```

### Step 7: Add Sidebar Navigation Link (`src/components/ui/sidebar.tsx` or Layout)
Add an entry to the admin sidebar menu referencing `CONFIG_ROUTER.BANNER.INDEX` with a Lucide icon.
