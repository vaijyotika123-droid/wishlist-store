import { useState } from 'react'
import { formatPrice, getProductById } from '../data/products.js'
import { useWishlists } from '../context/WishlistContext.jsx'
import MoveProductModal from './MoveProductModal.jsx'
import AddProductsModal from './AddProductsModal.jsx'
import ProductImage from './ProductImage.jsx'

export default function WishlistCard({ wishlist, allWishlists }) {
  const { renameWishlist, deleteWishlist, removeProductFromWishlist, moveProduct, addProductToWishlist } = useWishlists()
  const [expanded, setExpanded] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [nameDraft, setNameDraft] = useState(wishlist.name)
  const [moveTarget, setMoveTarget] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const otherWishlists = allWishlists.filter((w) => w.id !== wishlist.id)

  const startRename = (e) => {
    e.stopPropagation()
    setNameDraft(wishlist.name)
    setRenaming(true)
    setExpanded(true)
  }

  const submitRename = (e) => {
    e.preventDefault()
    if (renameWishlist(wishlist.id, nameDraft)) setRenaming(false)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete “${wishlist.name}”? This cannot be undone.`)) deleteWishlist(wishlist.id)
  }

  const moveTargetProduct = moveTarget ? getProductById(moveTarget) : null

  return (
    <section className="wishlist-panel">
      <div className={`wishlist-panel__head ${expanded ? 'wishlist-panel__head--open' : ''}`}>
        {renaming ? (
          <form className="rename-form" onSubmit={submitRename}>
            <input type="text" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus onBlur={submitRename} />
            <button type="submit" className="btn--text">Save</button>
          </form>
        ) : (
          <button type="button" className="wishlist-panel__title-row" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            <svg className={`wishlist-panel__chevron ${expanded ? 'wishlist-panel__chevron--open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
            <h2 className="wishlist-panel__title">{wishlist.name}</h2>
            <span className="wishlist-panel__count">{wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'}</span>
          </button>
        )}

        {!renaming && (
          <div className="wishlist-panel__actions">
            <button className="btn--text" onClick={startRename}>Rename</button>
            <button className="btn--text btn--danger" onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      {expanded && (
        <div className="wishlist-panel__body">
          <div className="wishlist-panel__toolbar">
            <span>{wishlist.items.length ? 'Saved products' : 'This wishlist is empty'}</span>
            <button className="btn btn--small" onClick={() => setAddOpen(true)}>+ Add from catalogue</button>
          </div>

          {wishlist.items.length === 0 ? (
            <div className="wishlist-empty-row">
              <strong>Nothing here yet.</strong>
              <span>Choose products from the catalogue to start this wishlist.</span>
            </div>
          ) : (
            <ul className="wishlist-items">
              {wishlist.items.map((item) => {
                const product = getProductById(item.productId)
                if (!product) return null
                return (
                  <li key={item.productId} className="wishlist-item">
                    <ProductImage className="wishlist-item__image" src={product.image} alt="" />
                    <div className="wishlist-item__details">
                      <div className="wishlist-item__topline">
                        <div>
                          <span className="wishlist-item__name">{product.name}</span>
                          <span className="wishlist-item__meta">{product.category}</span>
                        </div>
                        <span className="wishlist-item__price">{formatPrice(product.price)}</span>
                      </div>
                      <p>{product.description}</p>
                      <div className="wishlist-item__actions">
                        <button className="btn--text" onClick={() => setMoveTarget(item.productId)} disabled={otherWishlists.length === 0}>Move</button>
                        <button className="btn--text btn--danger" onClick={() => removeProductFromWishlist(wishlist.id, item.productId)}>Remove</button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {moveTargetProduct && (
        <MoveProductModal
          product={moveTargetProduct}
          fromWishlist={wishlist}
          destinations={otherWishlists}
          onClose={() => setMoveTarget(null)}
          onMove={(toId) => {
            if (moveProduct(wishlist.id, toId, moveTargetProduct.id)) setMoveTarget(null)
          }}
        />
      )}

      {addOpen && (
        <AddProductsModal
          wishlist={wishlist}
          onClose={() => setAddOpen(false)}
          onAdd={(productId) => addProductToWishlist(wishlist.id, productId)}
        />
      )}
    </section>
  )
}
