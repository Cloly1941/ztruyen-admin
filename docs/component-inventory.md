# UI Component Inventory & Design System

## Executive Summary
This document catalogs the UI component library and presentation layer architecture of **Ztruyện Admin**. The application implements a modern, accessible design system built on **Tailwind CSS v4**, **Radix UI / Base UI** primitives, and **shadcn/ui** styling patterns. Components are structured into three reusable tiers: low-level design system primitives (`src/components/ui/`), high-level reusable business widgets (`src/components/common/`), and domain-specific feature modules (`src/modules/`).

---

## 1. Design System Primitives (`src/components/ui/`)

The application includes 29 primitive UI components generated via `shadcn/ui` and customized with Tailwind CSS v4 utility classes. These components provide accessible keyboard navigation, WAI-ARIA compliance, and automatic dark/light theme styling.

| Component | File Path | Description & Usage |
| :--- | :--- | :--- |
| **Alert Dialog** | `ui/alert-dialog.tsx` | Modal dialogs for destructive or high-risk confirmations (e.g., banning users, deleting comics). |
| **Avatar** | `ui/avatar.tsx` | User profile image container with automatic initials fallback when images fail to load. |
| **Badge** | `ui/badge.tsx` | Small status tags (e.g., Active, Banned, Admin role badges) styled with `class-variance-authority`. |
| **Breadcrumb** | `ui/breadcrumb.tsx` | Navigation hierarchy links displayed at the top of admin pages. |
| **Button** | `ui/button.tsx` | Standard interactive button supporting variants (default, destructive, outline, secondary, ghost, link) and sizes. |
| **Calendar** | `ui/calendar.tsx` | Interactive date picker primitive powered by `react-day-picker` v9. |
| **Checkbox** | `ui/checkbox.tsx` | Form checkbox for multi-row selection in data tables and toggle inputs. |
| **Collapsible**| `ui/collapsible.tsx` | Interactive expandable/collapsible content panels. |
| **Command** | `ui/command.tsx` | Fast, composable command palette and autocomplete search primitive powered by `cmdk`. |
| **Dialog** | `ui/dialog.tsx` | Standard modal dialog windows used for creation and update forms. |
| **Dropdown Menu** | `ui/dropdown-menu.tsx` | Contextual action menus (e.g., row actions in tables: Edit, Delete, Frame, Avatar). |
| **Field** | `ui/field.tsx` | Form field wrappers combining label, input control, and validation error messaging. |
| **Input & Input Group** | `ui/input.tsx`, `ui/input-group.tsx` | Text inputs and grouped inputs with leading/trailing icons or add-ons. |
| **Kbd** | `ui/kbd.tsx` | Keyboard shortcut visual indicator badge. |
| **Label** | `ui/label.tsx` | Accessible form label associated with controls via Radix primitives. |
| **Popover** | `ui/popover.tsx` | Floating content popovers used for date pickers and custom filter dropdowns. |
| **Select** | `ui/select.tsx` | Custom styled select menus with searchable options. |
| **Separator** | `ui/separator.tsx` | Horizontal or vertical divider lines. |
| **Sheet** | `ui/sheet.tsx` | Slide-out side panels (drawers) used for mobile navigation and detail views. |
| **Sidebar** | `ui/sidebar.tsx` | Comprehensive admin sidebar navigation layout supporting collapsible states and mobile responsiveness. |
| **Skeleton** | `ui/skeleton.tsx` | Animated loading placeholders displayed while TanStack Query fetches data. |
| **Switch** | `ui/switch.tsx` | Toggle switch control used for boolean flags (e.g., `isActive` toggles). |
| **Table** | `ui/table.tsx` | HTML table primitives (Table, Header, Body, Row, Cell) styled for responsive layouts. |
| **Tabs** | `ui/tabs.tsx` | Tabbed navigation panels used for switching views within a domain module. |
| **Textarea** | `ui/textarea.tsx` | Multi-line text input control used for announcement content and guide descriptions. |
| **Toggle & Toggle Group** | `ui/toggle.tsx`, `ui/toggle-group.tsx` | Two-state toggle buttons and grouped option selectors. |
| **Tooltip** | `ui/tooltip.tsx` | Hover tooltips displaying descriptive text for icon buttons and truncated content. |

---

## 2. Shared Common Widgets (`src/components/common/`)

Located in `src/components/common/`, these components combine primitives into rich, reusable business solutions used across multiple admin pages.

### A. Data Table Ecosystem (TanStack Table v8)
The admin dashboard relies heavily on tabulated data. Three specialized wrappers provide consistent data grid capabilities:
* **`DataTableServer`**: The primary table component for server-side pagination, sorting, and filtering. It binds TanStack Table state directly to URL search parameters (using `buildQueryString`), ensuring that page refreshes or shared links preserve table filters and page numbers.
* **`DataTableClient`**: Used for smaller, client-side datasets where pagination and filtering happen in memory.
* **`DragDropTable`**: Combines `@dnd-kit` (`SortableContext`, `useSortable`) with TanStack Table to allow drag-and-drop row reordering. Used in **Emoji Categories** and **Avatar Frames** to adjust display order (`order` field) with automatic backend sync.
* **`DataTableColumnHeader`**: Standardized column header supporting ascending/descending sort toggles and visibility hiding.

### B. Business & Utility Widgets
* **`AvatarWithFrame`**: Composes `<Avatar />` with an avatar frame overlay (`IFrame`), dynamically scaling and positioning decorative PNG frames over user profile pictures.
* **`ImportDialog`**: An interactive file dropzone and modal dialog that accepts `.xlsx` Excel files or `.json` payloads, parses them, displays preview counts, and submits import mutations.
* **`ExportButton`**: A standardized trigger button that invokes `ExportService` to generate and download Excel (`.xlsx`) spreadsheets from current table filters.
* **`InputPassword`**: A specialized text input wrapping an eye/eye-off toggle icon to show/hide password text during user creation or password change.
* **`ModeToggle`**: A dropdown toggle allowing administrators to switch between Light, Dark, and System color themes.
* **`MultiSelectDropdown`**: An interactive checklist dropdown allowing selection of multiple tags or authors.
* **`Toast`**: Custom styling wrappers around `react-hot-toast` for success and error alert popups.

---

## 3. Domain Feature Modules (`src/modules/`)

Feature modules encapsulate domain-specific business logic, table column definitions, and modal forms. Each module represents an administrative section:

1. **`User/`**: Contains `UserTable` (columns: avatar with frame, email, role badge, status), `UserCreateForm`, `UserUpdateForm`, `ChangePasswordForm`, `UserAvatarFrameDialog` (assigning frames to users), and Excel import/export modals.
2. **`Ranking/`**: Contains `RankingTable`, `RankingCreateForm`, and `RankingImportJsonDialog` (importing country comic leaderboards from JSON data).
3. **`Frame/`**: Contains `FrameTable` and `FrameCreateForm` for uploading decorative avatar frame image assets.
4. **`Emoji/` & `EmojiCategory/`**: Contains drag-and-drop reorderable tables (`DragDropTable`), category filtering tabs, and image/text emoji creation forms.
5. **`Comment/`**: Contains `CommentTable` displaying user comments with comic slug and chapter links, and deletion moderation actions.
6. **`Announcement/`**: Contains `AnnouncementTable` and rich text forms for system broadcast notifications.
7. **`Guide/`**: Contains `GuideTable` and editor forms categorized by platform (`Android`, `IOS`, `PC`).
8. **`Login/`**: Contains the admin authentication form integrated with Cloudflare Turnstile captcha verification.

---

## 4. Reusability & Styling Patterns

* **Tailwind CSS v4 (`src/styles/index.css`)**: Utilizes modern CSS variables and utility-first styling without runtime CSS-in-JS overhead.
* **Class Merging (`src/lib/utils.ts`)**: Every component utilizes the `cn()` helper function (combining `clsx` and `tailwind-merge`) to allow parent components to safely override or extend utility classes without specificity conflicts.
* **Variant Management (`class-variance-authority`)**: Components like Buttons and Badges define strict visual variants (e.g., `variant: "destructive" | "outline" | "ghost"`) and sizes, guaranteeing visual consistency across the entire admin dashboard.
