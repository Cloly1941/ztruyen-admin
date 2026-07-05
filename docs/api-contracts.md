# API Contracts & Integration Catalog

## Executive Summary
This document catalogs the API integrations and data communication contracts used in **Ztruyện Admin**. The frontend application communicates primarily with the Ztruyện Backend REST API (`VITE_API_URL`) using an authenticated Axios instance with automatic token refresh capabilities. Additionally, it integrates with an external comic database API (**OTruyen** via `VITE_OTRUYEN_API`) to retrieve comic categories and metadata.

---

## 1. Base Configuration & Authentication

### Base URLs
* **Internal Backend API:** Configured via `import.meta.env.VITE_API_URL` (stored in `BASE_URL`).
* **External OTruyen API:** Configured via `import.meta.env.VITE_OTRUYEN_API`.

### HTTP Client & Interceptor Behavior (`src/services/axios-customize/index.ts`)
The application utilizes a custom Axios instance configured with `withCredentials: true` to support HTTP-only cookies where applicable.

#### Request Interceptor
* Automatically retrieves the JWT access token from `localStorage` under key `ZTC_ATK`.
* Injects `Authorization: Bearer <access_token>` into request headers unless overridden by the `skipAuth: true` flag (used during login).

#### Response & Token Refresh Interceptor
* Automatically unwraps response bodies by returning `response.data`.
* **Automatic Refresh Flow:**
  1. When an API request fails with status `401 Unauthorized` and has not been retried (`!originalRequest._retry`), the interceptor triggers token renewal.
  2. **Concurrency Control:** Utilizes `async-mutex` (`refreshTokenMutex`) to ensure that if multiple concurrent requests fail with 401, only one refresh request is sent to `${BASE_URL}/auth/refresh`.
  3. If another request has already updated the token during lock acquisition, the retried request immediately uses the newly updated token.
  4. Upon successful refresh, the new token is saved to `localStorage`, defaults are updated, and failed requests are retried.
  5. If token renewal fails, `localStorage` is cleared and the user is redirected to `/login`.

---

## 2. API Endpoints Catalog

### A. Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Admin login (`email`, `password`, `cfToken` for Turnstile) | No (`skipAuth: true`) |
| `POST` | `/auth/logout` | Logout current admin session | Yes |
| `GET` | `/auth/refresh` | Refresh JWT access token using previous token/cookie | Yes |

### B. User Management (`/user`)
| Method | Endpoint | Description | Query / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/user/profile` | Get current logged-in admin profile | None |
| `PATCH` | `/user/profile/frame` | Update current admin's avatar frame | `{ avatar_frame: string }` |
| `GET` | `/user` | List users with pagination, sorting, filtering | `current`, `pageSize`, `query`, `sort` |
| `GET` | `/user/detail/:id` | Get detailed user information | URL Param: `id` |
| `POST` | `/user` | Create a new user | Form payload (name, email, role, etc.) |
| `PATCH` | `/user/update/:id` | Update user details or avatar | Form payload or `{ avatar: string }` |
| `PATCH` | `/user/frame/:id` | Assign avatar frame to a user | `{ avatar_frame: string }` |
| `PATCH` | `/user/change-password/:id` | Change user password | `{ password, confirmPassword }` |
| `DELETE`| `/user/delete/:id` | Ban / soft-delete a single user | URL Param: `id` |
| `DELETE`| `/user/delete-multi` | Batch ban / soft-delete users | `{ ids: string[] }` |
| `GET` | `/user/trash` | List banned / deleted users | Pagination query params |
| `GET` | `/user/trash/:id` | Get details of a banned user | URL Param: `id` |
| `DELETE`| `/user/trash/delete/:id` | Permanently delete a user | URL Param: `id` |
| `DELETE`| `/user/trash/delete-multi` | Permanently delete multiple users | `{ ids: string[] }` |
| `PATCH` | `/user/restore/:id` | Restore a banned / deleted user | URL Param: `id` |
| `PATCH` | `/user/restore-multi` | Batch restore banned users | `{ ids: string[] }` |
| `POST` | `/user/import` | Import users from Excel file | `FormData` (`file: File`) |
| `GET` | `/user/export` | Export user list to Excel | Query params (returns blob/file) |
| `GET` | `/user/template` | Download Excel import template | None |

### C. Comic Ranking Management (`/comic/admin`)
| Method | Endpoint | Description | Query / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/comic/admin` | List ranking comics | Pagination and country filter query |
| `GET` | `/comic/admin/:id` | Get comic ranking details | URL Param: `id` |
| `POST` | `/comic/admin` | Add comic to ranking | Ranking creation payload |
| `PATCH` | `/comic/admin/:id` | Update comic ranking metadata | Ranking update payload |
| `DELETE`| `/comic/admin/:id` | Remove comic from ranking | URL Param: `id` |
| `DELETE`| `/comic/admin/delete-multi` | Batch remove comics from ranking | `{ data: { ids: string[] } }` |
| `POST` | `/comic/admin/import` | Import ranking list from JSON | `{ items: TImportComicPayload[] }` |

### D. Avatar Frames (`/frame`)
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/frame` | List all avatar frames | Supports pagination and sorting |
| `POST` | `/frame` | Create new avatar frame | Payload includes name & image object |
| `PATCH` | `/frame/:id` | Update frame details | URL Param: `id` |
| `DELETE`| `/frame/:id` | Delete frame | URL Param: `id` |

### E. Comments (`/comment`)
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/comment` | List user comments across comics | Supports pagination and search |
| `DELETE`| `/comment/:id` | Delete an inappropriate comment | URL Param: `id` |

### F. Emojis & Categories (`/emoji`, `/emoji-category`)
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/emoji-category` | List emoji categories | Includes order and active status |
| `POST` / `PATCH` / `DELETE` | `/emoji-category` | CRUD operations for categories | Supports reordering and toggling status |
| `GET` | `/emoji` | List emojis | Filterable by category and type |
| `POST` / `PATCH` / `DELETE` | `/emoji` | CRUD operations for emojis | Supports image upload and text emojis |

### G. Announcements (`/announcement`)
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/announcement` | List system announcements | Filterable by type (`info`, `warning`, etc.) |
| `POST` | `/announcement` | Create announcement | `{ title, content, type, isActive }` |
| `PATCH` | `/announcement/:id` | Update announcement | URL Param: `id` |
| `DELETE`| `/announcement/:id` | Delete announcement | URL Param: `id` |

### H. Guides (`/guide`)
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/guide` | List user guides | Filterable by platform (`Android`, `IOS`, `PC`) |
| `POST` | `/guide` | Create guide article | `{ title, slug, description, platform, content }` |
| `PATCH` | `/guide/:id` | Update guide article | URL Param: `id` |
| `DELETE`| `/guide/:id` | Delete guide article | URL Param: `id` |

### I. File & Image Uploads (`/upload`)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/upload` | Upload single image | `FormData` (`file`) |
| `POST` | `/upload-multiple` | Upload multiple images | `FormData` (`files`) |

### J. OTruyen External API (`VITE_OTRUYEN_API`)
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/the-loai` | Fetch comic categories | Used when importing/selecting comic genres |

---

## 3. Standard Response Structures

All internal API responses adhere to a unified wrapper structure (`IBackendRes<T>`):

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

For paginated lists (`IModelPaginate<T>`), the `data` payload contains:

```json
{
  "meta": {
    "current": 1,
    "pageSize": 10,
    "pages": 5,
    "total": 50
  },
  "result": [ ... ]
}
```
