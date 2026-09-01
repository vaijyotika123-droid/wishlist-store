import { useState } from 'react'
import { getProductById } from '../data/products.js'
import { useWishlists } from '../context/WishlistContext.jsx'

export default function MergeModal({ wishlists, onClose }) {
  const { mergeWishlists } = useWishlists()
  const [firstId, setFirstId] = useState('')
  const [secondId, setSecondId] = useState('')
  const [name, setName] = useState('')

  const first = wishlists.find((w) => w.id === firstId)
  const second = wishlists.find((w) => w.id === secondId)
  const canMerge = Boolean(first && second && first.id !== second.id)

  let previewNames = []
  if (canMerge) {
    const seen = new Set()
    for (const item of [...first.items, ...second.items]) {
      if (seen.has(item.productId)) continue
      seen.add(item.productId)
      const product = getProductById(item.productId)
      if (product) previewNames.push(product.name)
    }
  }

  const handleMerge = () => {
    if (!canMerge) return
    const created = mergeWishlists(first.id, second.id, name)
    if (created) onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="merge-modal-title">
        <h2 id="merge-modal-title">Merge wishlists</h2>
        <p className="hint">
          Pick two distinct wishlists. Products from the first list come first, then any new products from
          the second.
        </p>

        <div className="merge-modal-fields">
          <div className="merge-field">
            <label htmlFor="merge-first">First wishlist</label>
            <select id="merge-first" value={firstId} onChange={(e) => setFirstId(e.target.value)}>
              <option value="">Select…</option>
              {wishlists.map((w) => (
                <option key={w.id} value={w.id} disabled={w.id === secondId}>
                  {w.name} ({w.items.length})
                </option>
              ))}
            </select>
          </div>
          <div className="merge-field">
            <label htmlFor="merge-second">Second wishlist</label>
            <select id="merge-second" value={secondId} onChange={(e) => setSecondId(e.target.value)}>
              <option value="">Select…</option>
              {wishlists.map((w) => (
                <option key={w.id} value={w.id} disabled={w.id === firstId}>
                  {w.name} ({w.items.length})
                </option>
              ))}
            </select>
          </div>
          <div className="merge-field">
            <label htmlFor="merge-name">New wishlist name (optional)</label>
            <input
              id="merge-name"
              type="text"
              placeholder={canMerge ? `${first.name} + ${second.name}` : 'e.g. Merged'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {canMerge && (
          <p className="merge-preview">
            Result will contain <strong>{previewNames.length}</strong>{' '}
            {previewNames.length === 1 ? 'product' : 'products'}
            {previewNames.length > 0 ? `: ${previewNames.join(', ')}` : ''}
          </p>
        )}

        <div className="modal-actions" style={{ marginTop: 18 }}>
          <button className="btn btn--ghost btn--small" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--small" onClick={handleMerge} disabled={!canMerge}>
            Merge
          </button>
        </div>
      </div>
    </div>
  )
}
