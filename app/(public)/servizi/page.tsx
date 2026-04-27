import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Servizi',
  description: 'Cancelli, ringhiere, serramenti in metallo, carpenteria metallica: tutti i servizi di Metal Montaggi a Leverano su misura per privati e aziende.',
};

const categoryConfig = {
  fabbro: {
    label: 'Fabbro',
    subtitle: 'Lavorazioni Tradizionali del Ferro',
    desc: 'Realizziamo ogni tipo di lavorazione da fabbro: cancelli carrabili e pedonali, ringhiere, inferriate, grate di sicurezza e molto altro. Ogni pezzo è lavorato artigianalmente su misura.',
    color: 'text-orange-500',
  },
  serramenti: {
    label: 'Serramenti',
    subtitle: 'Porte, Finestre e Infissi in Metallo',
    desc: 'Forniamo e installiamo serramenti in acciaio e alluminio di alta qualità: porte blindate, finestre, infissi con eccellente isolamento termico e acustico.',
    color: 'text-orange-500',
  },
  carpenteria: {
    label: 'Carpenteria',
    subtitle: 'Strutture Metalliche su Misura',
    desc: 'Progettiamo e realizziamo strutture metalliche di qualsiasi complessità: scale, tettoie, soppalchi, coperture e strutture portanti, con calcolo strutturale incluso.',
    color: 'text-orange-500',
  },
};

type ServiceWithId = {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  features: string[];
  order: number;
  active: boolean;
};

function ServiceCard({ service }: { service: ServiceWithId }) {
  return (
    <div className="card-metal overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-video bg-zinc-800">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-zinc-700">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white text-xl font-bold mb-3">{service.title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">{service.description}</p>

        {service.features.length > 0 && (
          <ul className="space-y-1.5">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <svg className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-300">{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Cosa Offriamo</span>
          <h1 className="section-title mt-2">I Nostri Servizi</h1>
          <div className="divider-accent mt-6" />
          <p className="text-zinc-400 mt-6 max-w-xl leading-relaxed">
            Dalla progettazione alla realizzazione, offriamo soluzioni metalliche complete
            su misura per privati e aziende in tutto il Salento.
          </p>
        </div>
      </div>

      {/* Category quick nav */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#${cat}`}
                className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-orange-500 border-b-2 border-transparent hover:border-orange-500 transition-all whitespace-nowrap"
              >
                {categoryConfig[cat].label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Service sections */}
      {categories.map((cat) => {
        const catServices = services.filter((s) => s.category === cat);
        const config = categoryConfig[cat];

        return (
          <section key={cat} id={cat} className="py-24 bg-zinc-950 border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <span className="section-label">{config.label}</span>
                <h2 className="section-title mt-2 mb-4">{config.subtitle}</h2>
                <div className="divider-accent mb-6" />
                <p className="text-zinc-400 max-w-2xl leading-relaxed">{config.desc}</p>
              </div>

              {catServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 italic">Servizi in aggiornamento...</p>
              )}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Non Hai Trovato Quello che Cerchi?</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Contattaci per discutere il tuo progetto. Realizziamo qualsiasi tipo di
            lavorazione metallica su misura.
          </p>
          <Link href="/contatti" className="btn-primary">
            Contattaci per un Preventivo
          </Link>
        </div>
      </section>
    </>
  );
}
