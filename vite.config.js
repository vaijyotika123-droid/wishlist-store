import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: base must match your GitHub repository name for GitHub Pages
// e.g. if your repo is github.com/yourname/wishlist-store, keep '/wishlist-store/'
// If you deploy to a custom domain or a user/org page, set base to '/'
export default defineConfig({
  plugins: [react()],
  base: '/wishlist-store/',
})
