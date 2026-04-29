import { Link } from 'react-router-dom'
import { SeoHead } from '../hooks/useSeo'
import { useGetCompanyInfoQuery } from '../store/api/strapiApi'
import { getStrapiImageUrl } from '../utils/strapi'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ChiSiamo() {
  const { data: c, isLoading } = useGetCompanyInfoQuery()

  if (isLoading) return <div className="pt-32"><LoadingSpinner /></div>
  if (!c) return null

  const timeline = Array.isArray(c.chi_siamo_timeline) ? c.chi_siamo_timeline : []
  const valori   = Array.isArray(c.chi_siamo_valori)   ? c.chi_siamo_valori   : []
  const processo = Array.isArray(c.chi_siamo_processo)  ? c.chi_siamo_processo  : []
  const immagini = c.chi_siamo_immagini?.data ?? []

  return (
    <>
      <SeoHead
        title="Chi Siamo – La Nostra Storia e i Nostri Valori"
        description="Scopri la storia di Metal Montaggi, azienda di fabbricazione metallica a Leverano (Lecce). Esperienza, qualità e passione per le lavorazioni in ferro e acciaio."
        path="/chi-siamo"
      />
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {c.chi_siamo_eyebrow && <span className="text-brand text-sm font-semibold uppercase tracking-widest">{c.chi_siamo_eyebrow}</span>}
          <h1 className="mt-2 text-4xl md:text-5xl font-black text-white leading-tight">{c.chi_siamo_titolo}</h1>
          {c.chi_siamo_intro && <p className="mt-4 text-zinc-300 text-xl max-w-2xl leading-relaxed">{c.chi_siamo_intro}</p>}
        </div>
      </section>

      {/* Storia + Timeline */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Sinistra — testo + stats */}
            <div>
              {c.chi_siamo_storia && (
                <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: c.chi_siamo_storia.replace(/\n/g, '<br/>').replace(/##\s(.+)/g, '<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                />
              )}

              {/* Immagini azienda */}
              {immagini.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {immagini.slice(0, 4).map((img) => (
                    <img key={img.id} src={img.attributes.url} alt="" className="w-full aspect-[4/3] object-cover rounded-xl" />
                  ))}
                </div>
              )}

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: c.anni_esperienza ? `${c.anni_esperienza}+` : null, lbl: 'Anni di esperienza' },
                  { val: '500+', lbl: 'Lavori completati' },
                  { val: '100%', lbl: 'Clienti soddisfatti' },
                  { val: c.regione, lbl: 'Area di intervento' },
                ].filter(s => s.val).map(({ val, lbl }) => (
                  <div key={lbl} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="text-2xl font-black text-brand">{val}</div>
                    <div className="text-zinc-400 text-sm mt-1">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
                <div className="space-y-8">
                  {timeline.map(({ year, title, desc }, i) => (
                    <div key={i} className="pl-12 relative">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-zinc-900 border-2 border-brand flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand" />
                      </div>
                      <div className="text-brand text-sm font-bold mb-0.5">{year}</div>
                      <h4 className="text-white font-semibold">{title}</h4>
                      <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Valori */}
      {valori.length > 0 && (
        <section className="py-20 lg:py-28 bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">I nostri valori</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">{c.chi_siamo_valori_titolo}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valori.map((v, i) => (
                <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 hover:border-brand/40 transition-colors text-center">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="text-white font-bold mb-2">{v.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Processo */}
      {processo.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-brand font-semibold text-sm uppercase tracking-widest">Come lavoriamo</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">{c.chi_siamo_processo_titolo}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {processo.map((p, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-brand/30 transition-colors">
                  <div className="text-5xl font-black text-brand/20 mb-4">{p.step}</div>
                  <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Pronto a Iniziare il Tuo Progetto?</h2>
          <p className="text-zinc-400 mb-8">Contattaci per un sopralluogo gratuito senza impegno.</p>
          <Button as={Link} to="/contatti" size="lg">Richiedi Preventivo Gratuito</Button>
        </div>
      </section>
    </>
  )
}
