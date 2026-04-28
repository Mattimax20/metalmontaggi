'use strict'

/**
 * Ricava l'URL pubblico di un'immagine da un campo media Strapi (populate=*).
 * Restituisce sempre un URL assoluto usando window.location.origin come base
 * oppure il campo url direttamente se già assoluto.
 */
export function getStrapiImageUrl(imageField) {
  if (!imageField) return null
  // populate=* → { data: { attributes: { url, ... } } }
  const attrs =
    imageField?.data?.attributes ??
    imageField?.attributes ??
    imageField

  const url = attrs?.url
  if (!url) return null
  if (url.startsWith('http')) return url
  // URL relativo (/uploads/...) — funziona via Nginx proxy
  return url
}

export function getFirstImageUrl(mediaField) {
  if (!mediaField?.data) return null
  const first = Array.isArray(mediaField.data)
    ? mediaField.data[0]
    : mediaField.data
  return first?.attributes?.url ?? null
}

export const CATEGORY_LABELS = {
  fabbro: 'Fabbro',
  serramenti: 'Serramenti',
  carpenteria: 'Carpenteria',
}

export function getCategoryLabel(cat) {
  return CATEGORY_LABELS[cat] ?? cat ?? ''
}
