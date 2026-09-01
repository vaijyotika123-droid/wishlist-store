import { formatPrice } from '../data/products.js'
import ProductImage from './ProductImage.jsx'

export default function ProductCard({ product, onAddToWishlist }) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <ProductImage src={product.image} alt={product.name} />
      </div>
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
      </div>
      <div className="product-card__footer">
        <span className="product-card__price">{formatPrice(product.price)}</span>
        <button className="btn btn--small" onClick={() => onAddToWishlist(product)}>Add to wishlist</button>
      </div>
    </article>
  )
}
