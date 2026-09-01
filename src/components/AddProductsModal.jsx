import { useMemo, useState } from 'react'
import { formatPrice, products } from '../data/products.js'
import ProductImage from './ProductImage.jsx'

export default function AddProductsModal({ wishlist, onAdd, onClose }) {
  const existingIds = useMemo(() => new Set(wishlist.items.map((item) => item.productId)), [wishlist.items])
  const [selectedIds, setSelectedIds] = useState(new Set())

  const toggle = (id) => {
    if (existingIds.has(id)) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAdd = () => {
    selectedIds.forEach((id) => onAdd(id))
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="catalog-modal-title">
        <div className="modal-heading">
          <div>
            <h2 id="catalog-modal-title">Add products to {wishlist.name}</h2>
            <p className="hint">Choose one or more products from the catalogue.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="catalog-picker">
          {products.map((product) => {
            const alreadyAdded = existingIds.has(product.id)
            const selected = selectedIds.has(product.id)
            return (
              <button
                type="button"
                className={`catalog-picker__item ${selected ? 'catalog-picker__item--selected' : ''} ${alreadyAdded ? 'catalog-picker__item--disabled' : ''}`}
                key={product.id}
                onClick={() => toggle(product.id)}
                disabled={alreadyAdded}
                aria-pressed={selected}
              >
                <ProductImage src={product.image} alt="" />
                <span className="catalog-picker__copy">
                  <strong>{product.name}</strong>
                  <small>{formatPrice(product.price)} · {product.category}</small>
                  {alreadyAdded && <em>Already added</em>}
                </span>
                <span className="catalog-picker__check">{alreadyAdded ? '✓' : selected ? '✓' : '+'}</span>
              </button>
            )
          })}
        </div>

        <div className="modal-actions">
          <button className="btn btn--ghost btn--small" onClick={onClose}>Cancel</button>
          <button className="btn btn--small" onClick={handleAdd} disabled={selectedIds.size === 0}>
            Add {selectedIds.size ? `${selectedIds.size} ` : ''}{selectedIds.size === 1 ? 'product' : 'products'}
          </button>
        </div>
      </div>
    </div>
  )
}
