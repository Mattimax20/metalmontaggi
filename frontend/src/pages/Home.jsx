import { Link } from 'react-router-dom'
import { SeoHead } from '../hooks/useSeo'
import {
  useGetCompanyInfoQuery,
  useGetFeaturedServicesQuery,
  useGetFeaturedGalleryQuery,
} from '../store/api/strapiApi'
import { getStrapiImageUrl, getCategoryLabel } from '../utils/strapi'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// ─── Hero ────────────────────────────────────────────────────
function Hero({ c }) {
  if (!c) return <div className="min-h-screen" />
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      {getStrapiImageUrl(c.hero_immagine) && (
        <img src={getStrapiImageUrl(c.hero_immagine)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      )}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }}
      />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {c.hero_badge && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand/15 border border-brand/30 rounded-full text-brand text-sm font-medium mb-6">
              {c.hero_badge}
            </span>
          )}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6">
            {c.hero_titolo_riga1}<br />
            <span className="bg-gradient-to-r from-brand to-orange-400 bg-clip-text text-transparent">
              {c.hero_titolo_accento}
            </span><br />
            {c.hero_titolo_riga3}
          </h1>
          {c.hero_sottotitolo && (
            <p className="text-xl text-zinc-300 leading-relaxed mb-10 max-w-xl">{c.hero_sottotitolo}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button as={Link} to="/contatti" size="lg">{c.hero_cta_primario || 'Richiedi Preventivo'}</Button>
            <Button as={Link} to="/servizi" variant="outline" size="lg">{c.hero_cta_secondario || 'Scopri i Servizi'} →</Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-zinc-500 text-xs tracking-widest uppercase">Scorri</span>
        <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
      </div>
    </section>
  )
}

// ─── Stats ───────────────────────────────────────────────────
function Stats({ c }) {
  if (!c) return null
  const stats = [
    { value: c.stat_1_valore, label: c.stat_1_label },
    { value: c.stat_2_valore, label: c.stat_2_label },
    { value: c.stat_3_valore, label: c.stat_3_label },
  ].filter(s => s.value)

  if (!stats.length) return null
  return (
    <section className="bg-zinc-900 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center py-8 sm:px-8">
              <div className="text-4xl lg:text-5xl font-black text-brand mb-2">{value}</div>
              <div className="text-zinc-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Servizi Preview ─────────────────────────────────────────
function ServicesPreview({ c, services }) {
  if (!services) return <div className="section-padding container-x"><LoadingSpinner /></div>
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          {c?.servizi_eyebrow && <span className="text-brand font-semibold text-sm uppercase tracking-widest">{c.servizi_eyebrow}</span>}
          {c?.servizi_titolo && <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">{c.servizi_titolo}</h2>}
          {c?.servizi_sottotitolo && <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">{c.servizi_sottotitolo}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((item) => {
            const s = item.attributes
            const imgUrl = getStrapiImageUrl(s.immagine_copertina)
            return (
              <div key={item.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-brand/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
                <div className="h-48 relative overflow-hidden bg-zinc-800">
                  {imgUrl
                    ? <img src={imgUrl} alt={s.titolo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-6xl text-zinc-700">{s.icona_emoji}</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-3xl mb-3">{s.icona_emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.titolo}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5">{s.descrizione_breve}</p>
                  <Link to={`/servizi#${s.categoria}`} className="text-brand font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                    Scopri di più →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Button as={Link} to="/servizi" variant="outline">{c?.servizi_cta || 'Tutti i Servizi'}</Button>
        </div>
      </div>
    </section>
  )
}

// ─── Perché noi ──────────────────────────────────────────────
function WhyUs({ c }) {
  if (!c?.perche_noi_titolo) return null
  const items = Array.isArray(c.perche_noi_items) ? c.perche_noi_items : []
  return (
    <section className="py-20 lg:py-28 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-brand font-semibold text-sm uppercase tracking-widest">I nostri punti di forza</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white leading-tight">{c.perche_noi_titolo}</h2>
            {c.perche_noi_sottotitolo && <p className="mt-4 text-zinc-400 text-lg">{c.perche_noi_sottotitolo}</p>}
            {c.perche_noi_cta && (
              <Button as={Link} to="/chi-siamo" variant="outline" className="mt-8">{c.perche_noi_cta}</Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {items.map((item, i) => (
              <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5 hover:border-brand/40 transition-colors">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className="text-white font-semibold mb-1.5">{item.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Galleria Preview ─────────────────────────────────────────
function GalleryPreview({ c, items }) {
  if (!items) return null
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          {c?.galleria_eyebrow && <span className="text-brand font-semibold text-sm uppercase tracking-widest">{c.galleria_eyebrow}</span>}
          {c?.galleria_titolo && <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">{c.galleria_titolo}</h2>}
          {c?.galleria_sottotitolo && <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">{c.galleria_sottotitolo}</p>}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.slice(0, 6).map((item, i) => {
              const s = item.attributes
              const imgUrl = getStrapiImageUrl(s?.immagine_copertina)
              return (
                <div key={item.id ?? i} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-800">
                  {imgUrl
                    ? <img src={imgUrl} alt={s.titolo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-5xl text-zinc-700">🔩</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {s?.titolo && <h4 className="text-white font-bold">{s.titolo}</h4>}
                    {s?.categoria && <span className="text-brand text-sm font-medium">{getCategoryLabel(s.categoria)}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-zinc-500 py-10">Aggiungi progetti in evidenza dal pannello admin.</p>
        )}

        <div className="text-center mt-10">
          <Button as={Link} to="/galleria" variant="outline">{c?.galleria_cta || 'Vedi Tutti i Lavori'}</Button>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ─────────────────────────────────────────────────────
function CTA({ c }) {
  if (!c?.cta_titolo) return null
  return (
    <section className="py-20 bg-gradient-to-br from-brand/15 via-zinc-900 to-zinc-900 border-t border-brand/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{c.cta_titolo}</h2>
        {c.cta_testo && <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">{c.cta_testo}</p>}
        <Button as={Link} to="/contatti" size="lg">{c.cta_bottone || 'Contattaci'}</Button>
      </div>
    </section>
  )
}

// ─── Home ─────────────────────────────────────────────────────
export default function Home() {
  const { data: company } = useGetCompanyInfoQuery()
  const { data: featuredServices } = useGetFeaturedServicesQuery()
  const { data: featuredGallery } = useGetFeaturedGalleryQuery()

  return (
    <>
      <SeoHead
        title="Fabbro, Serramenti e Carpenteria Metallica a Leverano (LE)"
        description="Metal Montaggi: lavorazioni da fabbro, serramenti in metallo e carpenteria metallica a Leverano (Lecce). Cancelli, ringhiere, portoni su misura. Preventivo gratuito."
        path="/"
      />
      <Hero c={company} />
      <Stats c={company} />
      <ServicesPreview c={company} services={featuredServices} />
      <WhyUs c={company} />
      <GalleryPreview c={company} items={featuredGallery} />
      <CTA c={company} />
    </>
  )
}
