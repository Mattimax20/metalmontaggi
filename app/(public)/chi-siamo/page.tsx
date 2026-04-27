import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description: 'Metal Montaggi: storia, valori e approccio artigianale. Specialisti in lavorazioni metalliche a Leverano dal 2000.',
};

const values = [
  {
    icon: '◈',
    title: 'Qualità Prima di Tutto',
    desc: 'Utilizziamo solo materiali selezionati con trattamenti di protezione certificati per garantire durata nel tempo.',
  },
  {
    icon: '✦',
    title: 'Su Misura',
    desc: 'Ogni lavorazione è progettata e realizzata su misura. Non esistono soluzioni standard perché ogni cliente è unico.',
  },
  {
    icon: '◉',
    title: 'Puntualità e Affidabilità',
    desc: 'Rispettiamo i tempi concordati e manteniamo il cliente informato in ogni fase del progetto.',
  },
  {
    icon: '◆',
    title: 'Assistenza Post-Vendita',
    desc: 'Il nostro rapporto con il cliente non finisce con la consegna. Offriamo assistenza e manutenzione nel tempo.',
  },
];

const milestones = [
  { year: '2000', event: 'Fondazione di Metal Montaggi a Leverano' },
  { year: '2005', event: 'Espansione con nuovi macchinari per carpenteria pesante' },
  { year: '2010', event: 'Ampliamento attività ai serramenti in acciaio e alluminio' },
  { year: '2015', event: 'Raggiungimento di 300 clienti soddisfatti' },
  { year: '2020', event: 'Innovazione con tecniche di taglio al plasma e laser' },
  { year: '2025', event: 'Oltre 500 lavori completati in tutta la Puglia' },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">La Nostra Storia</span>
          <h1 className="section-title mt-2">Chi Siamo</h1>
          <div className="divider-accent mt-6" />
        </div>
      </div>

      {/* Storia */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <span className="section-label">Dal 2000</span>
              <h2 className="section-title mt-2 mb-6">
                Artigiani del Ferro<br />
                <span className="text-orange-500">da Generazioni</span>
              </h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  Metal Montaggi nasce nel 2000 a Leverano, nel cuore del Salento, dalla passione
                  per il lavoro del metallo e dalla voglia di offrire lavorazioni artigianali
                  di alta qualità al territorio.
                </p>
                <p>
                  Nel corso di oltre vent'anni di attività, abbiamo affinato le nostre competenze
                  nel campo della carpenteria metallica, dei serramenti in acciaio e alluminio,
                  e delle lavorazioni da fabbro tradizionale, mantenendo sempre al centro
                  la cura per il dettaglio e la soddisfazione del cliente.
                </p>
                <p>
                  Lavoriamo sia per privati — che vogliono abbellire e mettere in sicurezza
                  la propria abitazione — sia per aziende e attività commerciali che necessitano
                  di soluzioni metalliche su misura per i propri spazi.
                </p>
                <p>
                  La nostra filosofia è semplice: ogni lavoro merita la massima cura,
                  indipendentemente dalle dimensioni. Dal cancello residenziale alla grande
                  struttura industriale, portiamo lo stesso impegno e la stessa passione.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/contatti" className="btn-primary">
                  Parlaci del Tuo Progetto
                </Link>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-white font-bold text-xl mb-8 uppercase tracking-wider">
                La Nostra Crescita
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
                <div className="space-y-6">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-6 pl-12 relative">
                      <div className="absolute left-0 top-1 w-8 h-8 bg-zinc-900 border-2 border-orange-500 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-orange-500" />
                      </div>
                      <div>
                        <span className="text-orange-500 text-sm font-bold">{m.year}</span>
                        <p className="text-zinc-300 text-sm mt-0.5">{m.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">I Nostri Valori</span>
            <h2 className="section-title mt-2">Come Lavoriamo</h2>
            <div className="divider-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card-metal p-6">
                <div className="text-orange-500 text-3xl font-bold mb-4">{v.icon}</div>
                <h3 className="text-white font-bold mb-3">{v.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approccio */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sopralluogo Gratuito',
                desc: 'Veniamo da te per capire le tue esigenze, prendere le misure e analizzare il contesto.',
              },
              {
                step: '02',
                title: 'Progettazione e Preventivo',
                desc: 'Elaboriamo un progetto su misura e forniamo un preventivo dettagliato senza costi nascosti.',
              },
              {
                step: '03',
                title: 'Realizzazione e Consegna',
                desc: 'Produciamo in officina con cura artigianale e installiamo nel rispetto dei tempi concordati.',
              },
            ].map((step) => (
              <div key={step.step} className="card-metal p-8">
                <div className="text-orange-500/30 text-7xl font-bold leading-none mb-4">{step.step}</div>
                <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Inizia il Tuo Progetto</h2>
          <p className="text-orange-100 mb-8">
            Contattaci oggi per un sopralluogo gratuito e senza impegno.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white font-semibold px-10 py-4 text-sm uppercase tracking-widest transition-colors"
          >
            Richiedi Preventivo
          </Link>
        </div>
      </section>
    </>
  );
}
