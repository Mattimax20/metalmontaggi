import { useState, useEffect } from 'react'
import { hasDecided, saveConsent, applyStoredConsent } from '../../utils/cookieConsent'
import CookiePreferencesModal from './CookiePreferencesModal'

export default function CookieBanner() {
  const [visible, setVisible]     = useState(false)   // banner
  const [showModal, setShowModal] = useState(false)   // modal preferenze

  useEffect(() => {
    if (!hasDecided()) {
      // Piccolo delay per non bloccare il LCP
      const t = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(t)
    } else {
      // Riapplica il consenso salvato ad ogni caricamento pagina
      applyStoredConsent()
    }
  }, [])

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true })
    setVisible(false)
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false })
    setVisible(false)
  }

  function openPreferences() {
    setShowModal(true)
  }

  function onModalSave() {
    setShowModal(false)
    setVisible(false)
  }

  if (!visible && !showModal) return null

  return (
    <>
      {/* ── Banner principale ───────────────────────────────────────────────── */}
      {visible && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Informativa sui cookie"
          className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6 animate-slide-up"
        >
          <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl
                          flex flex-col lg:flex-row lg:items-center gap-5 p-5 sm:p-6">

            {/* Testo */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold mb-1 text-sm sm:text-base flex items-center gap-2">
                <span>🍪</span> Usiamo i cookie
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Questo sito utilizza cookie tecnici (necessari) e, previo consenso, cookie analytics
                e di marketing per migliorare la tua esperienza e mostrarti contenuti personalizzati.
                Puoi accettare tutto, rifiutare i facoltativi o scegliere categoria per categoria.{' '}
                <a href="/cookie-policy" className="text-brand hover:underline whitespace-nowrap">
                  Cookie Policy
                </a>
              </p>
            </div>

            {/* Pulsanti — tutti della stessa dimensione, nessuna gerarchia visiva scorretta */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 shrink-0">
              <button
                onClick={rejectAll}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-zinc-600
                           text-zinc-300 hover:border-zinc-400 hover:text-white transition-colors
                           whitespace-nowrap min-w-[130px] text-center"
              >
                Rifiuta
              </button>
              <button
                onClick={openPreferences}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-zinc-600
                           text-zinc-300 hover:border-brand/50 hover:text-brand transition-colors
                           whitespace-nowrap min-w-[130px] text-center"
              >
                Personalizza
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-brand
                           text-white hover:bg-brand/90 transition-colors
                           whitespace-nowrap min-w-[130px] text-center"
              >
                Accetta tutti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal preferenze ────────────────────────────────────────────────── */}
      {showModal && (
        <CookiePreferencesModal
          onClose={() => {
            setShowModal(false)
            // Se l'utente chiude il modal senza scegliere, torna il banner
          }}
          onSave={onModalSave}
        />
      )}
    </>
  )
}
