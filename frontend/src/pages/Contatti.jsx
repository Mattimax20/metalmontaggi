import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitContact, resetContact, selectContactStatus, selectContactError } from '../store/slices/contactSlice'
import { useGetCompanyInfoQuery } from '../store/api/strapiApi'
import Button from '../components/ui/Button'

const SERVIZIO_OPTIONS = [
  { value: '', label: 'Seleziona un servizio (facoltativo)' },
  { value: 'fabbro', label: '⚒ Lavorazioni Fabbro' },
  { value: 'serramenti', label: '🚪 Serramenti in Metallo' },
  { value: 'carpenteria', label: '🏗 Carpenteria Metallica' },
  { value: 'altro', label: '🔧 Altro' },
]

const INIT = { nome: '', cognome: '', email: '', telefono: '', oggetto: '', messaggio: '', servizio_interesse: '' }

export default function Contatti() {
  const dispatch = useDispatch()
  const status = useSelector(selectContactStatus)
  const error  = useSelector(selectContactError)
  const { data: c } = useGetCompanyInfoQuery()

  const [form, setForm]       = useState(INIT)
  const [touched, setTouched] = useState({})

  useEffect(() => { if (status === 'success') { setForm(INIT); setTouched({}) } }, [status])
  useEffect(() => () => { dispatch(resetContact()) }, [dispatch])

  const validate = (f) => {
    const e = {}
    if (!f.nome.trim())     e.nome     = 'Il nome è obbligatorio'
    if (!f.email.trim())    e.email    = "L'email è obbligatoria"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email non valida'
    if (!f.messaggio.trim()) e.messaggio = 'Il messaggio è obbligatorio'
    return e
  }

  const errors  = validate(form)
  const isValid = Object.keys(errors).length === 0

  const onChange  = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const onBlur    = (e) => setTouched(p => ({ ...p, [e.target.name]: true }))
  const onSubmit  = (e) => {
    e.preventDefault()
    setTouched({ nome: true, email: true, messaggio: true })
    if (!isValid || status === 'loading') return
    dispatch(submitContact({
      nome: form.nome.trim(), cognome: form.cognome.trim() || undefined,
      email: form.email.trim(), telefono: form.telefono.trim() || undefined,
      oggetto: form.oggetto.trim() || undefined, messaggio: form.messaggio.trim(),
      servizio_interesse: form.servizio_interesse || undefined,
    }))
  }

  const input = (field) => `w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-500 outline-none transition-colors focus:border-brand ${touched[field] && errors[field] ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-600'}`

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {c?.contatti_eyebrow && <span className="text-brand text-sm font-semibold uppercase tracking-widest">{c.contatti_eyebrow}</span>}
          <h1 className="mt-2 text-4xl md:text-5xl font-black text-white">{c?.contatti_titolo || 'Contattaci'}</h1>
          {c?.contatti_intro && <p className="mt-4 text-zinc-300 text-xl max-w-2xl leading-relaxed">{c.contatti_intro}</p>}
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-white mb-6">Invia un Messaggio</h2>

              {status === 'success' && (
                <div className="mb-6 p-5 bg-green-900/30 border border-green-500/40 rounded-xl flex gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="text-green-400 font-semibold">Messaggio inviato con successo!</p>
                    <p className="text-zinc-400 text-sm mt-1">Ti risponderemo entro 24 ore lavorative.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-5 bg-red-900/30 border border-red-500/40 rounded-xl flex gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="text-red-400 font-semibold">Errore durante l'invio</p>
                    <p className="text-zinc-400 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome <span className="text-brand">*</span></label>
                    <input name="nome" value={form.nome} onChange={onChange} onBlur={onBlur} placeholder="Mario" className={input('nome')} />
                    {touched.nome && errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Cognome</label>
                    <input name="cognome" value={form.cognome} onChange={onChange} onBlur={onBlur} placeholder="Rossi" className={input('cognome')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email <span className="text-brand">*</span></label>
                    <input name="email" type="email" value={form.email} onChange={onChange} onBlur={onBlur} placeholder="mario@esempio.it" className={input('email')} />
                    {touched.email && errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">Telefono</label>
                    <input name="telefono" type="tel" value={form.telefono} onChange={onChange} onBlur={onBlur} placeholder="+39 333 1234567" className={input('telefono')} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Servizio di interesse</label>
                  <select name="servizio_interesse" value={form.servizio_interesse} onChange={onChange} className={`${input('servizio_interesse')} cursor-pointer`}>
                    {SERVIZIO_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Oggetto</label>
                  <input name="oggetto" value={form.oggetto} onChange={onChange} onBlur={onBlur} placeholder="es. Preventivo cancello carrabile" className={input('oggetto')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Messaggio <span className="text-brand">*</span></label>
                  <textarea name="messaggio" value={form.messaggio} onChange={onChange} onBlur={onBlur} rows={5} placeholder="Descrivi il tuo progetto: dimensioni, materiali, tempistiche..." className={`${input('messaggio')} resize-none`} />
                  {touched.messaggio && errors.messaggio && <p className="text-red-400 text-xs mt-1">{errors.messaggio}</p>}
                </div>

                <p className="text-zinc-500 text-xs">I tuoi dati saranno usati solo per risponderti. Nessun spam.</p>

                <Button type="submit" size="lg" disabled={status === 'loading'} className={`w-full sm:w-auto ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {status === 'loading'
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Invio in corso...</>
                    : 'Invia Messaggio'
                  }
                </Button>
              </form>
            </div>

            {/* Info contatti */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Dove siamo</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 space-y-5">
                {[
                  { icon: '📍', label: 'Indirizzo', val: `${c?.indirizzo ?? ''} — ${c?.cap ?? ''} ${c?.citta ?? ''} (${c?.provincia ?? ''})`, href: null },
                  { icon: '📞', label: 'Telefono', val: c?.telefono, href: c?.telefono ? `tel:${c.telefono}` : null },
                  { icon: '✉️', label: 'Email', val: c?.email, href: c?.email ? `mailto:${c.email}` : null },
                  { icon: '🕐', label: 'Orari', val: c?.orari_apertura, href: null },
                ].filter(r => r.val).map(({ icon, label, val, href }) => (
                  <div key={label}>
                    {href
                      ? <a href={href} className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                          <div className="w-11 h-11 bg-brand/15 border border-brand/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                          <div><div className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">{label}</div><div className="text-white font-medium whitespace-pre-line">{val}</div></div>
                        </a>
                      : <div className="flex items-start gap-4">
                          <div className="w-11 h-11 bg-brand/15 border border-brand/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                          <div><div className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">{label}</div><div className="text-white font-medium whitespace-pre-line">{val}</div></div>
                        </div>
                    }
                    <div className="border-t border-zinc-800 mt-5" />
                  </div>
                ))}
              </div>

              {c?.whatsapp && (
                <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-3 p-4 bg-green-600/15 border border-green-500/30 rounded-xl hover:border-green-500/60 transition-colors">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Scrivici su WhatsApp</p>
                    <p className="text-zinc-400 text-xs">Risposta rapida in orario lavorativo</p>
                  </div>
                </a>
              )}

              <div className="mt-4 h-56 rounded-2xl overflow-hidden border border-zinc-700">
                <iframe
                  title="Mappa sede"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    [c?.indirizzo, c?.cap, c?.citta, c?.provincia ? `(${c.provincia})` : '', 'Italia']
                      .filter(Boolean).join(' ')
                  )}&output=embed&hl=it&z=15`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
