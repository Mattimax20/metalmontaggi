// ─── Costanti ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'mm_cookie_consent'
const CONSENT_VERSION = '2' // incrementa se cambi le categorie

const GA_ID = 'G-883TJ2C6K4'        // ← sostituisci con il tuo Measurement ID GA4
const META_PIXEL_ID = 'XXXXXXXXXXXXXXXX' // ← sostituisci con il tuo Pixel ID

// ─── Lettura / Scrittura ──────────────────────────────────────────────────────
export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Invalida se versione cambiata (nuove categorie)
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function hasDecided() {
  return getConsent() !== null
}

export function saveConsent({ analytics, marketing }) {
  const consent = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    analytics: Boolean(analytics),
    marketing: Boolean(marketing),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  _applyConsent(consent)
  return consent
}

export function revokeConsent() {
  localStorage.removeItem(STORAGE_KEY)
  _applyConsent({ analytics: false, marketing: false })
}

// ─── Applicazione consenso ────────────────────────────────────────────────────
// Chiamata all'avvio (se c'era già un consenso salvato) e dopo ogni scelta utente
export function applyStoredConsent() {
  const consent = getConsent()
  if (consent) _applyConsent(consent)
}

function _applyConsent({ analytics, marketing }) {
  _updateGoogleConsentMode(analytics, marketing)
  if (analytics) _loadGoogleAnalytics()
  if (marketing) _loadMetaPixel()
}

// ─── Google Consent Mode v2 ───────────────────────────────────────────────────
// Aggiorna i segnali di consenso. Funziona sia prima che dopo il caricamento di gtag.js
function _updateGoogleConsentMode(analytics, marketing) {
  if (typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', {
    analytics_storage:  analytics  ? 'granted' : 'denied',
    ad_storage:         marketing  ? 'granted' : 'denied',
    ad_user_data:       marketing  ? 'granted' : 'denied',
    ad_personalization: marketing  ? 'granted' : 'denied',
  })
}

// ─── Google Analytics 4 ───────────────────────────────────────────────────────
function _loadGoogleAnalytics() {
  if (window.__mm_ga_loaded) return
  window.__mm_ga_loaded = true

  // gtag e dataLayer possono già esistere (GCM default in index.html)
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments) }
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  script.onload = () => {
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, {
      anonymize_ip: true,         // GDPR
      cookie_flags: 'SameSite=None;Secure',
    })
    // Aggiorna consenso dopo caricamento effettivo del tag
    _updateGoogleConsentMode(true, window.__mm_marketing_granted ?? false)
  }
}

// ─── Meta Pixel ───────────────────────────────────────────────────────────────
function _loadMetaPixel() {
  if (window.__mm_pixel_loaded || !META_PIXEL_ID || META_PIXEL_ID.includes('X')) return
  window.__mm_pixel_loaded = true
  window.__mm_marketing_granted = true

  /* eslint-disable */
  ;(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq('consent', 'grant')
  window.fbq('init', META_PIXEL_ID)
  window.fbq('track', 'PageView')
}
