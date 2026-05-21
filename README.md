# Ztruyện Admin

<div align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000000" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query">
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui">
</div>

## Giới thiệu

**Ztruyện Admin** là trang quản trị cho hệ thống đọc truyện tranh online Ztruyện, được xây dựng bằng **React**, **TypeScript** và **Vite**.

Dự án tập trung vào các nghiệp vụ quản trị như đăng nhập admin, quản lý người dùng, người dùng bị cấm, khung avatar, bình luận, emoji, danh mục emoji, thông báo, bảng xếp hạng truyện và hướng dẫn sử dụng. Giao diện sử dụng Tailwind CSS, shadcn/ui, TanStack Table và React Query để tạo trải nghiệm quản trị nhanh, rõ ràng và dễ mở rộng.

Backend repository: [ztruyen-be](https://github.com/nguyentrongbut/ztruyen-be)

Frontend user repository: [ztruyen-v1.1.0](https://github.com/Cloly1941/ztruyen-v1.1.0)

---

## Tính năng chính

- Đăng nhập admin và bảo vệ route theo quyền `ADMIN`.
- Tự động gắn access token vào request và refresh token khi gặp lỗi `401`.
- Quản lý người dùng: danh sách, tạo mới, cập nhật, xem chi tiết, đổi mật khẩu, cập nhật avatar, cập nhật khung avatar, cấm nhiều người dùng, import/export Excel.
- Quản lý danh sách người dùng bị cấm và khôi phục tài khoản.
- Quản lý khung avatar: thêm, sửa, xóa, sắp xếp và thao tác hàng loạt.
- Quản lý bình luận trong hệ thống.
- Quản lý emoji và danh mục emoji: CRUD, lọc theo trạng thái/danh mục và thao tác hàng loạt.
- Quản lý thông báo: tạo, cập nhật, xóa, lọc theo trạng thái và loại thông báo.
- Quản lý bảng xếp hạng truyện theo quốc gia: CRUD, tìm kiếm theo tên truyện, lọc theo quốc gia/trạng thái/top và nhập JSON.
- Quản lý hướng dẫn: CRUD, xem chi tiết, lọc theo nền tảng và trạng thái.
- Data table dùng server-side query, phân trang, tìm kiếm, lọc, sort, ẩn/hiện cột và chọn nhiều dòng.
- Import/export dữ liệu bằng file Excel qua `xlsx`.
- Tùy chỉnh giao diện: light/dark mode, theme preset, scale, border radius và chế độ sidebar.
- Tích hợp Cloudflare Turnstile cho form đăng nhập.
- Cấu hình SPA deploy trên Netlify với redirect về `index.html`.

---

## Tech Stack

- [Vite](https://vite.dev/) – Build tool và development server cho React.
- [React 18](https://react.dev/) – Xây dựng giao diện người dùng.
- [TypeScript](https://www.typescriptlang.org/) – Static typing giúp code an toàn và dễ bảo trì hơn.
- [React Router](https://reactrouter.com/) – Điều hướng phía client.
- [Tailwind CSS 4](https://tailwindcss.com/) – Utility-first CSS framework.
- [shadcn/ui](https://ui.shadcn.com/) – Component UI tái sử dụng dựa trên Radix UI và Tailwind CSS.
- [Radix UI](https://www.radix-ui.com/) / [Base UI](https://base-ui.com/) – Primitive UI components.
- [TanStack Query](https://tanstack.com/query/latest) – Data fetching, cache và mutation state.
- [TanStack Table](https://tanstack.com/table/latest) – Xây dựng data table linh hoạt.
- [Axios](https://axios-http.com/) – HTTP client và interceptor xử lý auth token.
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) – Quản lý form và validation.
- [dnd kit](https://dndkit.com/) – Kéo thả và sắp xếp dữ liệu.
- [xlsx](https://www.npmjs.com/package/xlsx) – Import/export Excel.
- [React Helmet Async](https://www.npmjs.com/package/react-helmet-async) – Quản lý title/meta theo trang.
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) – Xác thực chống bot ở trang đăng nhập.

---

## Cấu trúc thư mục

```text
src/
├── components/          # Component dùng chung và shadcn/ui components
├── configs/             # Cấu hình API, route, query key, local storage, field Excel
├── context/             # Auth context và theme customizer context
├── hooks/               # Custom hooks cho auth, data table và API methods
├── layouts/             # Default layout, header, panel, search và sidebar
├── lib/                 # Tiện ích nền tảng
├── modules/             # Module UI/form/table theo từng nghiệp vụ quản trị
├── pages/               # Các trang route-level của ứng dụng admin
├── routes/              # Khai báo route và ProtectedRoute
├── services/            # Service gọi API backend, upload, export và OTruyen
├── theme/               # Theme provider
├── types/               # TypeScript declaration/types
└── utils/               # Hàm tiện ích xử lý query, date, Excel, badge/status render
```

---

## Các route chính

| Route                    | Mô tả                                      |
| ------------------------ | ------------------------------------------ |
| `/`                      | Dashboard admin                            |
| `/login`                 | Đăng nhập admin                            |
| `/403`                   | Trang không có quyền truy cập              |
| `/users`                 | Quản lý người dùng                         |
| `/users/ban`             | Quản lý người dùng bị cấm                  |
| `/frames`                | Quản lý khung avatar                       |
| `/comments`              | Quản lý bình luận                          |
| `/emojis`                | Quản lý emoji                              |
| `/emojis/category`       | Quản lý danh mục emoji                     |
| `/announcements`         | Quản lý thông báo                          |
| `/ranking`               | Quản lý bảng xếp hạng truyện theo quốc gia |
| `/guides`                | Quản lý hướng dẫn                          |

---

## Cài đặt & chạy dự án

### Yêu cầu

- Node.js phiên bản tương thích với Vite 7
- npm
- Backend API chính của Ztruyện
- Cloudflare Turnstile site key nếu bật xác thực Turnstile ở trang đăng nhập
- API/OTruyen image host nếu dùng dữ liệu ảnh truyện từ OTruyen

### Cài đặt dependencies

```bash
npm install
```

### Chạy development

```bash
npm run dev
```

Ứng dụng Vite mặc định chạy tại:

```bash
http://localhost:5173
```

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Environment Variables

Tạo file `.env` ở thư mục gốc và cấu hình các biến môi trường cần thiết:

```env
VITE_API_URL=
VITE_OTRUYEN_IMG=
VITE_TURNSTILE_SITE_KEY=
```

| Biến môi trường           | Mô tả                                      |
| ------------------------- | ------------------------------------------ |
| `VITE_API_URL`            | Base URL của backend API Ztruyện           |
| `VITE_OTRUYEN_IMG`        | Base URL ảnh truyện lấy từ OTruyen         |
| `VITE_TURNSTILE_SITE_KEY` | Site key Cloudflare Turnstile cho login    |

---

## Scripts

| Script            | Mô tả                                      |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Chạy Vite development server               |
| `npm run build`   | Type-check bằng `tsc -b` và build Vite     |
| `npm run lint`    | Chạy ESLint toàn bộ dự án                  |
| `npm run preview` | Preview bản build production bằng Vite     |

---

## Ghi chú triển khai

- `vite.config.ts` cấu hình alias `@` trỏ về `src` và dùng plugin React + Tailwind CSS.
- `netlify.toml` build bằng `npm run build`, publish thư mục `dist` và redirect mọi route về `/index.html` để hỗ trợ React Router SPA.
- `netlify.toml` cấu hình MIME type cho file JavaScript/module và cache dài hạn cho asset trong `/assets`.
- Axios instance dùng `VITE_API_URL`, gửi cookie với `withCredentials: true`, lưu access token trong localStorage key `ZTC_ATK` và tự refresh token qua endpoint `/auth/refresh`.
- `ProtectedRoute` yêu cầu người dùng đã đăng nhập và có role `ADMIN`; nếu không sẽ chuyển về `/login` hoặc `/403`.
- Các trang quản trị đều set metadata bằng `react-helmet-async` và đánh dấu `noindex, nofollow`.

---

## License

Dự án được phát triển với mục đích học tập, nghiên cứu và thực hành xây dựng hệ thống quản trị cho nền tảng đọc truyện tranh online Ztruyện.
