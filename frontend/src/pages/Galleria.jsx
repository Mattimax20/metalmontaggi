import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetGalleryProjectsQuery, useGetCompanyInfoQuery } from '../store/api/strapiApi'
import { getStrapiImageUrl, getCategoryLabel } from '../utils/strapi'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const FILTERS = [
  { value: 'tutti', label: 'Tutti i Lavori' },
  { value: 'fabbro', label: '⚒ Fabbro' },
  { value: 'serramenti', label: '🚪 Serramenti' },
  { value: 'carpenteria', label: '🏗 Carpenteria' },
]

const PLACEHOLDER_TITLES = [
  'Cancello Pedonale Design', 'Ringhiera Scala Moderna', 'Porta Blindata su Misura',
  'Infissi Industriali', 'Cancello Carrabile Automatico', 'Soppalco Industriale',
  'Tettoia in Acciaio', 'Scala a Chiocciola', 'Grata di Sicurezza',
]

function GalleryItem({ item, index }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const attrs = item?.attributes ?? {}
  const imgUrl = getStrapiImageUrl(attrs.immagine_copertina) ?? getStrapiImageUrl(attrs.immagini?.data?.[0])
  const cat = attrs.categoria
  const title = attrs.titolo ?? PLACEHOLDER_TITLES[index % PLACEHOLDER_TITLES.length]

  return (
    <>
      <div
        className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer"
        onClick={() => imgUrl && setLightboxOpen(true)}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex flex-col items-center justify-center gap-3">
            <span className="text-zinc-600 text-5xl">🔩</span>
            <span className="text-zinc-600 text-xs px-4 text-center">{title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {cat && (
              <span className="text-xs px-2 py-0.5 bg-brand/20 border border-brand/30 text-brand rounded-full">
                {getCategoryLabel(cat)}
              </span>
            )}
            {attrs.luogo && <span className="text-zinc-400 text-xs">📍 {attrs.luogo}</span>}
          </div>
        </div>

        {attrs.in_evidenza && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-brand text-white text-xs font-bold rounded-lg">
            In Evidenza
          </div>
        )}
      </div>

      {lightboxOpen && imgUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white text-xl flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <img
            src={imgUrl}
            alt={title}
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {(title || cat) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur px-5 py-3 rounded-xl text-center">
              <p className="text-white font-semibold">{title}</p>
              {cat && <p className="text-brand text-sm">{getCategoryLabel(cat)}</p>}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default function Galleria() {
  const [activeFilter, setActiveFilter] = useState('tutti')
  const { data: c } = useGetCompanyInfoQuery()
  const { data: projects, isLoading, isError } = useGetGalleryProjectsQuery()

  const filtered = activeFilter === 'tutti'
    ? (projects ?? [])
    : (projects ?? []).filter(p => p.attributes?.categoria === activeFilter)

  const isEmpty = !isLoading && !isError && filtered.length === 0
  const placeholders = Array.from({ length: 9 }, (_, i) => ({ id: `ph-${i}` }))

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {c?.galleria_eyebrow && <span className="text-brand text-sm font-semibold uppercase tracking-widest">{c.galleria_eyebrow}</span>}
          <h1 className="mt-2 text-4xl md:text-5xl font-black text-white">{c?.galleria_titolo || 'I Nostri Lavori'}</h1>
          {c?.galleria_sottotitolo && (
            <p className="mt-4 text-zinc-300 text-xl max-w-2xl leading-relaxed">{c.galleria_sottotitolo}</p>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtri */}
          <div className="flex flex-wrap gap-3 mb-10">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeFilter === value
                    ? 'bg-brand text-white shadow-lg shadow-brand/30'
                    : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-brand/50 hover:text-white'
                }`}
              >
                {label}
                {value !== 'tutti' && projects && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({projects.filter(p => p.attributes?.categoria === value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {!isLoading && !isEmpty && (
            <p className="text-zinc-500 text-sm mb-6">
              {filtered.length} {filtered.length === 1 ? 'lavoro' : 'lavori'} trovati
            </p>
          )}

          {isLoading && <LoadingSpinner text="Caricamento galleria..." />}

          {isError && (
            <div className="text-center py-16 text-zinc-500">
              <span className="text-4xl block mb-3">⚠️</span>
              <p>Impossibile caricare la galleria. Riprova più tardi.</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => (
                <GalleryItem key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {isEmpty && (
            <>
              <p className="text-zinc-500 text-sm mb-6 italic">
                La galleria verrà popolata dall'admin. Ecco un'anteprima del layout:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-40 pointer-events-none select-none">
                {placeholders.map((p, i) => (
                  <GalleryItem key={p.id} item={p} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Vuoi un Lavoro come Questi?
          </h2>
          <p className="text-zinc-400 mb-8">Contattaci per un preventivo gratuito e senza impegno.</p>
          <Button as={Link} to="/contatti" size="lg">{c?.galleria_cta || 'Richiedi Preventivo'}</Button>
        </div>
      </section>
    </>
  )
}
