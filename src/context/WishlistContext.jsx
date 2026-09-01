import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'wishlist-store:v1'

function inferAutoName(wishlist) {
  return wishlist.autoName === true || /^Wishlist \d+$/.test(wishlist.name || '')
}

function normalizeState(parsed) {
  const wishlists = Array.isArray(parsed?.wishlists)
    ? parsed.wishlists.map((w) => ({ ...w, autoName: inferAutoName(w) }))
    : []

  // Auto-generated names follow the current wishlist order. Custom names are
  // never changed. This also fixes older saved data created by the previous
  // counter-based implementation.
  let autoIndex = 0
  const normalized = wishlists.map((w) => {
    if (!w.autoName) return w
    autoIndex += 1
    return { ...w, name: `Wishlist ${autoIndex}` }
  })

  return { wishlists: normalized }
}

function loadInitialState() {
  const fallback = { wishlists: [] }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.wishlists)) return fallback
    return normalizeState(parsed)
  } catch (err) {
    console.warn('Could not read saved wishlists, starting empty.', err)
    return fallback
  }
}

function makeId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function WishlistProvider({ children }) {
  const stateRef = useRef(loadInitialState())
  const [version, bumpVersion] = useState(0)
  const [toasts, setToasts] = useState([])
  const toastTimers = useRef(new Map())

  const commit = useCallback((nextState) => {
    stateRef.current = nextState
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    } catch (err) {
      console.warn('Could not save wishlists to localStorage.', err)
    }
    bumpVersion((v) => v + 1)
  }, [])

  const notify = useCallback((message, variant = 'info') => {
    const id = makeId('toast')
    setToasts((prev) => [...prev, { id, message, variant }])
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      toastTimers.current.delete(id)
    }, 3200)
    toastTimers.current.set(id, timer)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = toastTimers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      toastTimers.current.delete(id)
    }
  }, [])

  useEffect(() => () => {
    toastTimers.current.forEach((t) => clearTimeout(t))
  }, [])

  const createWishlist = useCallback((rawName) => {
    const trimmed = (rawName || '').trim()
    const prev = stateRef.current
    const isAutoNamed = !trimmed
    const autoNumber = prev.wishlists.length + 1
    const wishlist = {
      id: makeId('wl'),
      name: trimmed || `Wishlist ${autoNumber}`,
      autoName: isAutoNamed,
      items: [],
    }

    commit({ wishlists: [...prev.wishlists, wishlist] })
    return wishlist
  }, [commit])

  const renameWishlist = useCallback((wishlistId, rawName) => {
    const trimmed = (rawName || '').trim()
    if (!trimmed) {
      notify('A wishlist name cannot be empty.', 'warn')
      return false
    }
    const prev = stateRef.current
    commit({
      wishlists: prev.wishlists.map((w) =>
        w.id === wishlistId ? { ...w, name: trimmed, autoName: false } : w
      ),
    })
    return true
  }, [commit, notify])

  const deleteWishlist = useCallback((wishlistId) => {
    const prev = stateRef.current
    let autoIndex = 0
    const wishlists = prev.wishlists
      .filter((w) => w.id !== wishlistId)
      .map((w) => {
        if (!w.autoName) return w
        autoIndex += 1
        return { ...w, name: `Wishlist ${autoIndex}` }
      })
    commit({ wishlists })
  }, [commit])

  const addProductToWishlist = useCallback((wishlistId, productId) => {
    const prev = stateRef.current
    const target = prev.wishlists.find((w) => w.id === wishlistId)
    if (!target) return false

    if (target.items.some((item) => item.productId === productId)) {
      notify('That product is already in this wishlist.', 'warn')
      return false
    }

    commit({
      wishlists: prev.wishlists.map((w) =>
        w.id === wishlistId
          ? { ...w, items: [...w.items, { productId, addedAt: Date.now() }] }
          : w
      ),
    })
    notify('Added to wishlist.')
    return true
  }, [commit, notify])

  const removeProductFromWishlist = useCallback((wishlistId, productId) => {
    const prev = stateRef.current
    commit({
      wishlists: prev.wishlists.map((w) =>
        w.id === wishlistId
          ? { ...w, items: w.items.filter((item) => item.productId !== productId) }
          : w
      ),
    })
  }, [commit])

  const moveProduct = useCallback((fromWishlistId, toWishlistId, productId) => {
    const prev = stateRef.current
    const destination = prev.wishlists.find((w) => w.id === toWishlistId)
    if (destination?.items.some((item) => item.productId === productId)) {
      notify('That product already exists in the destination wishlist.', 'warn')
      return false
    }

    commit({
      wishlists: prev.wishlists.map((w) => {
        if (w.id === fromWishlistId) {
          return { ...w, items: w.items.filter((item) => item.productId !== productId) }
        }
        if (w.id === toWishlistId) {
          return { ...w, items: [...w.items, { productId, addedAt: Date.now() }] }
        }
        return w
      }),
    })
    notify('Product moved.')
    return true
  }, [commit, notify])

  const mergeWishlists = useCallback((firstId, secondId, rawName) => {
    if (!firstId || !secondId || firstId === secondId) {
      notify('Choose two distinct wishlists to merge.', 'warn')
      return null
    }

    const prev = stateRef.current
    const first = prev.wishlists.find((w) => w.id === firstId)
    const second = prev.wishlists.find((w) => w.id === secondId)
    if (!first || !second) return null

    const seen = new Set()
    const mergedItems = []
    for (const item of [...first.items, ...second.items]) {
      if (seen.has(item.productId)) continue
      seen.add(item.productId)
      mergedItems.push({ productId: item.productId, addedAt: item.addedAt })
    }

    const trimmed = (rawName || '').trim()
    const merged = {
      id: makeId('wl'),
      name: trimmed || `${first.name} + ${second.name}`,
      autoName: false,
      items: mergedItems,
    }

    commit({ wishlists: [...prev.wishlists, merged] })
    notify('Wishlists merged.')
    return merged
  }, [commit, notify])

  const value = useMemo(() => ({
    wishlists: stateRef.current.wishlists,
    toasts,
    dismissToast,
    notify,
    createWishlist,
    renameWishlist,
    deleteWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    moveProduct,
    mergeWishlists,
  }), [version, toasts, dismissToast, notify, createWishlist, renameWishlist, deleteWishlist,
      addProductToWishlist, removeProductFromWishlist, moveProduct, mergeWishlists])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlists() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlists must be used within a WishlistProvider')
  return ctx
}
