import { useState } from 'react'
import { products } from '../data/products.js'
import { useWishlists } from '../context/WishlistContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import AddToWishlistModal from '../components/AddToWishlistModal.jsx'

export default function Storefront() {
  const { wishlists, createWishlist, addProductToWishlist } = useWishlists()
  const [activeProduct, setActiveProduct] = useState(null)

  return (
    <div className="shell">
      <div className="page-intro">
        <h1>Browse products</h1>
        <p>Explore the catalogue and save products to any wishlist.</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToWishlist={setActiveProduct} />
        ))}
      </div>

      {activeProduct && (
        <AddToWishlistModal
          product={activeProduct}
          wishlists={wishlists}
          onClose={() => setActiveProduct(null)}
          onCreateWishlist={createWishlist}
          onAdd={(wishlistId) => {
            addProductToWishlist(wishlistId, activeProduct.id)
            setActiveProduct(null)
          }}
        />
      )}
    </div>
  )
}
