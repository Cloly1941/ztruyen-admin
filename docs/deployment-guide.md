# Deployment & Production Architecture Guide

## Executive Summary
This document outlines the production build process, hosting architecture, and deployment configurations for **Ztruyện Admin**. The application is optimized as a static **Single Page Application (SPA)** deployed on **Netlify**, utilizing Vite 7 for high-performance ES-module bundling, long-term asset caching headers, and SPA routing redirects.

---

## 1. Production Build Architecture

When preparing for production, Vite compiles the TypeScript codebase and bundles static assets into the `/dist` directory.

### Build Workflow (`npm run build`)
Executing `npm run build` triggers a two-stage pipeline:
1. **Type Checking (`tsc -b`)**: The TypeScript compiler verifies type correctness across the entire workspace (`tsconfig.app.json` and `tsconfig.node.json`). If any type errors exist, the build halts immediately, preventing broken code from reaching production.
2. **Vite Bundling (`vite build`)**: Vite utilizes Rollup under the hood to tree-shake unused code, minify CSS/JS, and generate content-hashed filenames (e.g., `assets/index-B3j9kL2p.js`) for optimal browser caching.

---

## 2. Netlify SPA Deployment Configuration (`netlify.toml`)

The repository includes a root-level `netlify.toml` file configured specifically for hosting React Single Page Applications on Netlify CDN infrastructure.

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Deep link redirect rule for React Router SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# MIME type specification for ES Module scripts
[[headers]]
  for = "/*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"

# Long-term Immutable Caching for Vite static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Key Configuration Highlights
1. **SPA Redirect Rule (`status = 200`)**: Because React Router manages routing on the client side, direct requests to deep URLs (e.g., `https://admin.ztruyen.com/users`) would normally result in a `404 Not Found` from a static CDN. The `[[redirects]]` rule catches all incoming requests (`/*`) and rewrites them to `/index.html` with an HTTP status of `200 OK`, allowing React Router to take over navigation.
2. **Immutable Asset Caching**: Files emitted into `/assets/*` receive a `Cache-Control` max-age of 1 year (`31536000` seconds) marked as `immutable`. Because Vite appends unique content hashes to asset filenames upon change, browsers can safely cache these files indefinitely without stale content issues.
3. **MIME Type Enforcement**: Guarantees that JavaScript bundles are served with `application/javascript; charset=utf-8` headers, preventing browser module execution blockers.

---

## 3. Environment Variables in Production

When deploying to Netlify or any CI/CD hosting platform (e.g., Vercel, Cloudflare Pages, AWS Amplify), you must configure production environment variables in the hosting provider's dashboard:

| Variable Name | Production Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://api.ztruyen.com/api/v1` | Production HTTPS endpoint of the Ztruyện Backend REST API. |
| `VITE_OTRUYEN_IMG` | `https://otruyenapi.com` | Base URL for fetching comic images and category lists. |
| `VITE_TURNSTILE_SITE_KEY`| `0x4AAAAAAABk9...` | Live production site key for Cloudflare Turnstile captcha verification. |

> [!IMPORTANT]
> **Rebuild Required on Change:** Because Vite statically embeds `import.meta.env.*` variables into JavaScript bundles during build time, changing an environment variable in Netlify requires triggering a fresh deployment rebuild for changes to take effect.

---

## 4. Security & Production Checklist

Before promoting a release to live production, verify the following checklist items:

* **HTTPS Enforcement:** Ensure SSL/TLS is active on the hosting domain. The Ztruyện Backend API must also run over HTTPS (`https://`) to prevent mixed-content blockers and secure JWT token transmissions.
* **HTTP-Only Cookies & CORS:** Ensure the production backend API CORS policy explicitly whitelists the admin dashboard domain (`https://admin.ztruyen.com`) with `credentials: true` enabled to support secure refresh token cookies.
* **Turnstile Production Key:** Replace any dummy testing Turnstile keys (`1x000...`) with the live Cloudflare Turnstile site key tied to your production domain.
* **SEO & Indexing Protection:** Verify that administrative pages include `react-helmet-async` meta tags with `<meta name="robots" content="noindex, nofollow" />` (or check `public/robots.txt`) to prevent search engines from indexing internal admin dashboards.
