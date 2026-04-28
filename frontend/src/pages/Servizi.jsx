import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useGetServicesQuery, useGetCompanyInfoQuery } from '../store/api/strapiApi'
import { getStrapiImageUrl } from '../utils/strapi'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const CAT_ORDER = ['fabbro', 'serramenti', 'carpenteria']

function ServiceSection({ service }) {
  const s = service.attributes
  const sottocategorie = Array.isArray(s.sottocategorie) ? s.sottocategorie : []
  const imgUrl = getStrapiImageUrl(s.immagine_copertina)

  return (
    <section id={s.categoria} className="py-20 lg:py-24 border-b border-zinc-800 last:border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-brand/15 border border-brand/30 rounded-2xl flex items-center justify-center text-2xl">
            {s.icona_emoji}
          </div>
          <div>
            <div className="text-brand text-sm font-semibold uppercase tracking-wider">{s.categoria}</div>
            <h2 className="text-2xl md:text-3xl font-black text-white">{s.titolo}</h2>
          </div>
        </div>

        {/* Intro + immagine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {s.descrizione_breve && <p className="text-zinc-300 text-lg leading-relaxed">{s.descrizione_breve}</p>}
            {s.descrizione && (
              <div className="mt-4 text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {s.descrizione.replace(/##\s/g, '').replace(/\*\*(.+?)\*\*/g, '$1')}
              </div>
            )}
          </div>
          {imgUrl && (
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img src={imgUrl} alt={s.titolo} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Sottocategorie */}
        {sottocategorie.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sottocategorie.map((sub, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-brand/40 transition-colors">
                <div className="text-brand text-xs font-bold uppercase tracking-wider mb-2">●</div>
                <h3 className="text-white font-bold text-lg mb-3">{sub.titolo}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{sub.descrizione}</p>
                {Array.isArray(sub.caratteristiche) && (
                  <ul className="space-y-1.5">
                    {sub.caratteristiche.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-brand mt-0.5 flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Galleria servizio */}
        {s.galleria?.data?.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {s.galleria.data.map((img) => (
              <img key={img.id} src={img.attributes.url} alt={s.titolo}
                className="w-full aspect-square object-cover rounded-xl" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Servizi() {
  const { data: company } = useGetCompanyInfoQuery()
  const { data: services, isLoading } = useGetServicesQuery()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150)
    }
  }, [hash, services])

  // Ordina per categoria nell'ordine prestabilito
  const sorted = services
    ? [...services].sort((a, b) => CAT_ORDER.indexOf(a.attributes.categoria) - CAT_ORDER.indexOf(b.attributes.categoria))
    : []

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="text-brand text-sm font-semibold uppercase tracking-widest">I Nostri Servizi</span>
          <h1 className="mt-2 text-4xl md:text-5xl font-black text-white">Cosa Offriamo</h1>
          <p className="mt-4 text-zinc-300 text-xl max-w-2xl leading-relaxed">
            Soluzioni metalliche complete per privati e aziende. Ogni lavoro è realizzato su misura con materiali certificati.
          </p>
          {/* Anchor links */}
          {sorted.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              {sorted.map((item) => (
                <a key={item.id} href={`#${item.attributes.categoria}`}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-200 transition-colors">
                  {item.attributes.icona_emoji} {item.attributes.titolo}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {isLoading && <LoadingSpinner text="Caricamento servizi..." />}

      {sorted.map((service) => (
        <ServiceSection key={service.id} service={service} />
      ))}

      {!isLoading && sorted.length === 0 && (
        <div className="py-20 text-center text-zinc-500">
          <p>Nessun servizio disponibile. Aggiungili dal pannello admin.</p>
        </div>
      )}

      <section className="py-16 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Non hai trovato quello che cerchi?</h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Realizziamo qualsiasi lavorazione in ferro, acciaio e alluminio. Contattaci e descrivi il tuo progetto.</p>
          <Button as={Link} to="/contatti" size="lg">Richiedi un Preventivo Gratuito</Button>
        </div>
      </section>
    </>
  )
}
