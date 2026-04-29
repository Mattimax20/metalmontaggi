import { useState, useEffect } from 'react'
import { getConsent, saveConsent } from '../../utils/cookieConsent'

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-zinc-800 ${
        disabled
          ? 'bg-brand/50 cursor-not-allowed'
          : checked
          ? 'bg-brand cursor-pointer'
          : 'bg-zinc-600 cursor-pointer'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// ─── Singola categoria ────────────────────────────────────────────────────────
function CategoryRow({ title, badge, description, examples, checked, onChange, disabled }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-zinc-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4 bg-zinc-800/50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2 text-left flex-1 min-w-0 hover:text-brand transition-colors"
          >
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
              disabled ? 'bg-brand/20 text-brand' : 'bg-zinc-700 text-zinc-300'
            }`}>
              {badge}
            </span>
            <span className="text-white font-semibold text-sm truncate">{title}</span>
            <svg
              className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <Toggle checked={checked} onChange={onChange} disabled={disabled} />
      </div>

      {open && (
        <div className="px-4 pb-4 pt-2 bg-zinc-900/50 border-t border-zinc-700/50">
          <p className="text-zinc-400 text-sm leading-relaxed mb-3">{description}</p>
          {examples && (
            <div className="flex flex-wrap gap-1.5">
              {examples.map(ex => (
                <span key={ex} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-md">
                  {ex}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Modal principale ─────────────────────────────────────────────────────────
export default function CookiePreferencesModal({ onClose, onSave }) {
  const [analytics, setAnalytics]   = useState(false)
  const [marketing, setMarketing]   = useState(false)

  // Pre-popola con le scelte precedenti
  useEffect(() => {
    const saved = getConsent()
    if (saved) {
      setAnalytics(saved.analytics)
      setMarketing(saved.marketing)
    }
  }, [])

  function handleSaveSelected() {
    saveConsent({ analytics, marketing })
    onSave?.()
  }

  function handleAcceptAll() {
    setAnalytics(true)
    setMarketing(true)
    saveConsent({ analytics: true, marketing: true })
    onSave?.()
  }

  function handleRejectAll() {
    setAnalytics(false)
    setMarketing(false)
    saveConsent({ analytics: false, marketing: false })
    onSave?.()
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-pref-title"
    >
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-800">
          <div>
            <h2 id="cookie-pref-title" className="text-white font-bold text-lg">
              Preferenze Cookie
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Scegli quali cookie accettare. Puoi modificare queste preferenze in qualsiasi momento.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors shrink-0 mt-0.5"
            aria-label="Chiudi"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categorie */}
        <div className="p-6 space-y-3 overflow-y-auto">

          <CategoryRow
            title="Cookie Tecnici"
            badge="Sempre attivi"
            description="Indispensabili per il funzionamento del sito: navigazione, accesso alle pagine, sicurezza delle sessioni. Non raccolgono dati personali e non possono essere disattivati."
            examples={['Sessione utente', 'Sicurezza CSRF', 'Preferenze display']}
            checked={true}
            onChange={() => {}}
            disabled={true}
          />

          <CategoryRow
            title="Cookie Analytics"
            badge="Facoltativi"
            description="Ci aiutano a capire come i visitatori utilizzano il sito (pagine più visitate, tempo di permanenza, provenienza). I dati sono aggregati e anonimi. Nessun dato è venduto a terzi."
            examples={['Google Analytics 4']}
            checked={analytics}
            onChange={setAnalytics}
            disabled={false}
          />

          <CategoryRow
            title="Cookie Marketing e Profilazione"
            badge="Facoltativi"
            description="Utilizzati per mostrarti pubblicità pertinente ai tuoi interessi su altri siti e misurare l'efficacia delle campagne pubblicitarie. Richiedono il tuo consenso esplicito."
            examples={['Meta Pixel', 'Google Ads']}
            checked={marketing}
            onChange={setMarketing}
            disabled={false}
          />
        </div>

        {/* Nota legale */}
        <div className="px-6 pb-2">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Per maggiori dettagli leggi la nostra{' '}
            <a href="/cookie-policy" className="text-brand hover:underline">Cookie Policy</a>
            {' '}e la{' '}
            <a href="/privacy-policy" className="text-brand hover:underline">Privacy Policy</a>.
          </p>
        </div>

        {/* Azioni */}
        <div className="p-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRejectAll}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white transition-colors"
          >
            Rifiuta tutti
          </button>
          <button
            onClick={handleSaveSelected}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-brand/50 text-brand hover:bg-brand/10 transition-colors"
          >
            Salva selezione
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors"
          >
            Accetta tutti
          </button>
        </div>
      </div>
    </div>
  )
}
