import { useState } from 'react'

export default function AddToWishlistModal({ product, wishlists, onAdd, onCreateWishlist, onClose }) {
  const [selectedId, setSelectedId] = useState(wishlists[0]?.id ?? '')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(wishlists.length === 0)

  if (!product) return null

  const handleConfirm = () => {
    if (creating) {
      const created = onCreateWishlist(newName)
      onAdd(created.id)
    } else if (selectedId) {
      onAdd(selectedId)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="add-modal-title">
        <h2 id="add-modal-title">Add “{product.name}” to a wishlist</h2>

        {wishlists.length === 0 ? (
          <>
            <p className="hint">You don't have any wishlists yet. Create one to get started.</p>
            <div className="modal-new-name">
              <input
                type="text"
                placeholder="Wishlist name (optional)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </div>
          </>
        ) : (
          <>
            <p className="hint">Choose a wishlist, or start a new one.</p>
            <div className="modal-options">
              {wishlists.map((w) => (
                <label className="modal-option" key={w.id}>
                  <input
                    type="radio"
                    name="wishlist"
                    checked={!creating && selectedId === w.id}
                    onChange={() => {
                      setCreating(false)
                      setSelectedId(w.id)
                    }}
                  />
                  {w.name}
                  <span className="wishlist-item__meta">({w.items.length})</span>
                </label>
              ))}
              <label className="modal-option">
                <input type="radio" name="wishlist" checked={creating} onChange={() => setCreating(true)} />
                New wishlist…
              </label>
            </div>
            {creating && (
              <div className="modal-new-name">
                <input
                  type="text"
                  placeholder="Wishlist name (optional)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </>
        )}

        <div className="modal-actions" style={{ marginTop: 18 }}>
          <button className="btn btn--ghost btn--small" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--small" onClick={handleConfirm} disabled={!creating && !selectedId}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
