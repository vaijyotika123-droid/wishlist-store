import { useState } from 'react'
import { useWishlists } from '../context/WishlistContext.jsx'
import WishlistCard from '../components/WishlistCard.jsx'
import MergeModal from '../components/MergeModal.jsx'

export default function Wishlists() {
  const { wishlists, createWishlist } = useWishlists()
  const [newName, setNewName] = useState('')
  const [mergeOpen, setMergeOpen] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    createWishlist(newName)
    setNewName('')
  }

  return (
    <div className="shell">
      <div className="page-intro">
        <h1>Your wishlists</h1>
        <p>Create wishlists, add products from the catalogue, and keep everything you want to save in one place.</p>
      </div>

      <div className="wishlists-toolbar">
        <form className="wishlists-toolbar__left" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="New wishlist name (optional)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="btn btn--small">
            Create wishlist
          </button>
        </form>

        <button
          className="btn btn--ghost btn--small merge-trigger"
          onClick={() => setMergeOpen(true)}
          disabled={wishlists.length < 2}
        >
          Merge wishlists
        </button>
      </div>

      {wishlists.length === 0 ? (
        <div className="empty-state">
          <h3>No wishlists yet</h3>
          <p>Create your first wishlist above, or browse products to add something to a wishlist.</p>
        </div>
      ) : (
        <div className="wishlist-list">
          {wishlists.map((w) => (
            <WishlistCard key={w.id} wishlist={w} allWishlists={wishlists} />
          ))}
        </div>
      )}

      {mergeOpen && <MergeModal wishlists={wishlists} onClose={() => setMergeOpen(false)} />}
    </div>
  )
}
