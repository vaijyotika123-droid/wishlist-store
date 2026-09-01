import { useEffect, useState } from 'react'

// A data-URI fallback means even a missing local asset cannot create a broken image.
const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#f4f1eb"/><g fill="none" stroke="#77756d" stroke-width="18"><rect x="155" y="155" width="290" height="290" rx="24"/><path d="M205 395l80-95 55 60 45-55 60 75"/><circle cx="250" cy="235" r="28"/></g><text x="300" y="500" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="#77756d">Product image unavailable</text></svg>`
export const PRODUCT_IMAGE_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_SVG)}`

function resolveImageSrc(src) {
  if (!src) return PRODUCT_IMAGE_FALLBACK
  // Root-relative public assets must include Vite's base path on GitHub Pages.
  if (src.startsWith('/')) return `${import.meta.env.BASE_URL}${src.slice(1)}`
  return src
}

export default function ProductImage({ src, alt = '', className = '', ...props }) {
  const [imageSrc, setImageSrc] = useState(() => resolveImageSrc(src))
  const [failed, setFailed] = useState(!src)

  useEffect(() => {
    setImageSrc(resolveImageSrc(src))
    setFailed(!src)
  }, [src])

  const handleError = () => {
    setImageSrc(PRODUCT_IMAGE_FALLBACK)
    setFailed(true)
  }

  return (
    <img
      {...props}
      className={`${className}${failed ? ' product-image--fallback' : ''}`.trim()}
      src={imageSrc}
      alt={alt}
      onError={handleError}
    />
  )
}
