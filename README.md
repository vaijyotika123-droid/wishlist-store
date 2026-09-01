# Fieldstock — Wishlist Storefront

A small e-commerce storefront with multi-wishlist support and wishlist merging,
built with React + Vite. No backend, no accounts — everything is a static
product catalogue plus wishlists persisted to `localStorage`.

## Stack

- React 18
- Vite
- Plain CSS (no UI framework)
- `localStorage` for persistence
- GitHub Pages for deployment

## Run it locally

```bash
npm install
npm run dev
```

Vite will print a local address (typically `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview   # serve the built dist/ locally
```

## Project structure

```
src/
├── main.jsx                     # entry point
├── App.jsx                      # header nav + page switching
├── index.css                    # design tokens + all styling
├── data/
│   └── products.js              # static product catalogue
├── context/
│   └── WishlistContext.jsx      # wishlist state, operations, persistence
├── components/
│   ├── ProductCard.jsx
│   ├── AddToWishlistModal.jsx
│   ├── MoveProductModal.jsx
│   ├── WishlistCard.jsx
│   ├── MergePanel.jsx
│   └── ToastStack.jsx
└── pages/
    ├── Storefront.jsx
    └── Wishlists.jsx
```

`WishlistContext` is the single source of truth for wishlist state. It owns
create/rename/delete, add/remove product, move product, merge, and the
`localStorage` read/write — no component talks to `localStorage` directly.
The product catalogue lives only in `data/products.js`; wishlists store a
`productId` and look the product up from there, so nothing is duplicated.

## How wishlist data is stored

Everything is kept under one `localStorage` key (`wishlist-store:v1`) as:

```json
{
  "wishlists": [
    { "id": "...", "name": "Favorites", "items": [{ "productId": "p-01" }] }
  ],
  "nextWishlistNumber": 2
}
```

`nextWishlistNumber` is a counter used only to generate default names
(`Wishlist 1`, `Wishlist 2`, ...). It always advances, so numbers are never
reused after a wishlist is deleted.

## Merge behavior

Merging wishlist A and B (in that order) creates a **new** wishlist:

1. All items from A, in their existing order.
2. Then items from B whose `productId` isn't already present, in their
   existing order.

A and B are left untouched. The merged wishlist behaves like any other
wishlist afterwards — it can be renamed, deleted, merged again, etc.

## Deploying to GitHub Pages

Two ways to do this — pick one.

### Option A — GitHub Actions (recommended)

A workflow is already included at `.github/workflows/deploy.yml`. It builds
the app and deploys `dist/` on every push to `main`.

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys automatically.

### Option B — manual deploy with `gh-pages`

```bash
npm run deploy
```

This runs `npm run build` then publishes `dist/` to the `gh-pages` branch
using the `gh-pages` package (already in `devDependencies`).

### Important: the `base` path

`vite.config.js` sets:

```js
base: '/wishlist-store/'
```

This must match your repository name for a project page
(`https://<username>.github.io/<repo-name>/`). If your repo is named
something other than `wishlist-store`, update `base` to match — or set it to
`'/'` if you're deploying to a custom domain or a user/org page
(`<username>.github.io`).

## What's intentionally not here

Per the assignment brief, these are out of scope: authentication/accounts,
multi-user support, product variants, inventory/stock, search, filtering,
sorting, and any wishlist size limits.
