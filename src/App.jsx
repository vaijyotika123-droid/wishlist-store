import { useState } from 'react'
import { useWishlists } from './context/WishlistContext.jsx'
import Storefront from './pages/Storefront.jsx'
import Wishlists from './pages/Wishlists.jsx'
import ToastStack from './components/ToastStack.jsx'

export default function App() {
  const [page, setPage] = useState('storefront')
  const { wishlists } = useWishlists()

  return (
    <>
      <header className="app-header">
        <div className="shell app-header__row">
          <div className="wordmark">Wishlist<span>Store</span></div>
          <nav className="tab-nav">
            <button aria-current={page === 'storefront' ? 'page' : undefined} onClick={() => setPage('storefront')}>
              Browse products
            </button>
            <button aria-current={page === 'wishlists' ? 'page' : undefined} onClick={() => setPage('wishlists')}>
              Wishlists
              {wishlists.length > 0 && <span className="badge">{wishlists.length}</span>}
            </button>
          </nav>
        </div>
      </header>
      <main>{page === 'storefront' ? <Storefront /> : <Wishlists />}</main>
      <ToastStack />
    </>
  )
}
