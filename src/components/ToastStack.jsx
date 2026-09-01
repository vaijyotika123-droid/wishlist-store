import { useWishlists } from '../context/WishlistContext.jsx'

export default function ToastStack() {
  const { toasts, dismissToast } = useWishlists()

  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.variant === 'warn' ? 'toast--warn' : ''}`}
          onClick={() => dismissToast(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
