import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

const categoryLabels: Record<string, string> = {
  fabbro: 'Fabbro',
  serramenti: 'Serramenti',
  carpenteria: 'Carpenteria',
};

const categoryIcons: Record<string, string> = {
  fabbro: '⚒',
  serramenti: '🚪',
  carpenteria: '🏗',
};

const stats = [
  { value: '20+', label: 'Anni di esperienza' },
  { value: '500+', label: 'Lavori realizzati' },
  { value: '100%', label: 'Clienti soddisfatti' },
];

const features = [
  {
    icon: '✦',
    title: 'Lavorazioni su Misura',
    desc: 'Ogni progetto è unico. Progettiamo e realizziamo ogni elemento su misura per le specifiche esigenze del cliente.',
  },
  {
    icon: '◈',
    title: 'Alta Qualità Materiali',
    desc: 'Utilizziamo solo acciaio, ferro e alluminio di prima scelta con trattamenti di protezione certificati.',
  },
  {
    icon: '◉',
    title: 'Precisione Artigianale',
    desc: 'Unione tra tecnica tradizionale e tecnologia moderna per garantire finiture perfette e durata nel tempo.',
  },
  {
    icon: '◆',
    title: 'Esperienza Certificata',
    desc: 'Oltre 20 anni di esperienza nel settore delle lavorazioni metalliche nel territorio salentino.',
  },
];

export default async function Home() {
  const [services, galleryItems] = await Promise.all([
    prisma.service.findMany({ where: { active: true }, orderBy: [{ order: 'asc' }], take: 6 }),
    prisma.galleryItem.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  const categories = ['fabbro', 'serramenti', 'carpenteria'];
  const servicesByCategory = categories.map((cat) => ({
    category: cat,
    count: services.filter((s) => s.category === cat).length,
  }));

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950 metal-grid-bg metal-radial" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950" />

        {/* Decorative orange line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <p className="section-label mb-6">Leverano (LE) — Dal 2000</p>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-none mb-6">
            SOLUZIONI
            <br />
            <span className="text-gradient">METALLICHE</span>
            <br />
            SU MISURA
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Cancelli, ringhiere, serramenti, carpenteria metallica.
            Precisione artigianale e materiali di qualità per ogni progetto.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contatti" className="btn-primary px-10 py-4 text-base">
              Richiedi Preventivo Gratuito
            </Link>
            <Link href="/servizi" className="btn-outline px-10 py-4 text-base">
              Scopri i Servizi
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-xs uppercase tracking-widest">Scorri</span>
          <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-bold text-white">{s.value}</div>
                <div className="text-orange-100 text-sm uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIZI ── */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label">Cosa Facciamo</span>
            <h2 className="section-title mt-2">I Nostri Servizi</h2>
            <div className="divider-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesByCategory.map(({ category, count }) => (
              <Link
                key={category}
                href={`/servizi#${category}`}
                className="card-metal p-8 group flex flex-col items-center text-center"
              >
                <div className="text-5xl mb-4">{categoryIcons[category]}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{categoryLabels[category]}</h3>
                <p className="text-zinc-500 text-sm mb-4">{count} servizi disponibili</p>
                <span className="text-orange-500 text-xs uppercase tracking-widest group-hover:gap-3 flex items-center gap-2 transition-all">
                  Scopri di più
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/servizi" className="btn-outline">
              Tutti i Servizi
            </Link>
          </div>
        </div>
      </section>

      {/* ── PERCHÉ SCEGLIERCI ── */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Perché Sceglierci</span>
              <h2 className="section-title mt-2 mb-4">
                Qualità Artigianale,<br />
                <span className="text-orange-500">Risultati Garantiti</span>
              </h2>
              <div className="divider-accent mb-8" />
              <p className="section-desc">
                Da oltre 20 anni realizziamo lavorazioni metalliche di alta qualità
                per privati e aziende nel territorio salentino e in tutta la Puglia.
                La nostra esperienza artigianale si unisce alle tecnologie moderne
                per garantire il massimo risultato in ogni progetto.
              </p>
              <div className="mt-8">
                <Link href="/chi-siamo" className="btn-primary">
                  Chi Siamo
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="card-metal p-6">
                  <div className="text-orange-500 text-2xl mb-3 font-bold">{f.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{f.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERIA ANTEPRIMA ── */}
      {galleryItems.length > 0 && (
        <section className="py-24 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="section-label">I Nostri Lavori</span>
              <h2 className="section-title mt-2">Galleria</h2>
              <div className="divider-accent mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative aspect-square overflow-hidden group bg-zinc-900">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Lavoro Metal Montaggi'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/50 transition-all duration-300 flex items-end">
                    {item.title && (
                      <p className="text-white text-sm font-medium px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {item.title}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/galleria" className="btn-outline">
                Vedi Tutti i Lavori
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24 bg-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 metal-grid-bg opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hai un Progetto in Mente?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Contattaci per un sopralluogo e un preventivo gratuito senza impegno.
            Trasformiamo le tue idee in realtà metallica.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 text-white font-semibold px-10 py-4 text-sm uppercase tracking-widest transition-colors duration-200"
          >
            Contattaci Ora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
