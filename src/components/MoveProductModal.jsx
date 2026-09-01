import { useState } from 'react'

export default function MoveProductModal({ product, fromWishlist, destinations, onMove, onClose }) {
  const [selectedId, setSelectedId] = useState(destinations[0]?.id ?? '')

  if (!product) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="move-modal-title">
        <h2 id="move-modal-title">Move “{product.name}”</h2>
        <p className="hint">
          From <strong>{fromWishlist.name}</strong> to:
        </p>

        {destinations.length === 0 ? (
          <p className="hint">Create another wishlist first to move products into it.</p>
        ) : (
          <div className="modal-options">
            {destinations.map((w) => (
              <label className="modal-option" key={w.id}>
                <input
                  type="radio"
                  name="destination"
                  checked={selectedId === w.id}
                  onChange={() => setSelectedId(w.id)}
                />
                {w.name}
                <span className="wishlist-item__meta">({w.items.length})</span>
              </label>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn--ghost btn--small" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--small"
            onClick={() => onMove(selectedId)}
            disabled={destinations.length === 0 || !selectedId}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  )
}
