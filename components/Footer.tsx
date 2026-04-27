import Link from 'next/link';

const services = [
  { href: '/servizi', label: 'Cancelli su Misura' },
  { href: '/servizi', label: 'Ringhiere e Parapetti' },
  { href: '/servizi', label: 'Porte e Serramenti' },
  { href: '/servizi', label: 'Scale Metalliche' },
  { href: '/servizi', label: 'Tettoie e Coperture' },
  { href: '/servizi', label: 'Soppalchi Metallici' },
];

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/chi-siamo', label: 'Chi Siamo' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/galleria', label: 'Galleria' },
  { href: '/contatti', label: 'Contatti' },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 flex items-center justify-center text-white font-bold text-sm font-['Oswald'] tracking-wider">
                MM
              </div>
              <div>
                <div className="font-['Oswald'] font-bold text-white text-xl leading-none tracking-wider">METAL</div>
                <div className="font-['Oswald'] text-orange-500 text-xs tracking-[0.3em] leading-none">MONTAGGI</div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-4">
              Lavorazioni metalliche su misura a Leverano dal 2000. Qualità artigianale,
              precisione e affidabilità per privati e aziende.
            </p>
            <div className="divider-accent" />
          </div>

          {/* Servizi */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Servizi
            </h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="text-zinc-500 hover:text-orange-500 text-sm transition-colors duration-200"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link rapidi */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Link Rapidi
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-500 hover:text-orange-500 text-sm transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Contatti
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-zinc-500">Indirizzo</p>
                <p className="text-zinc-300">Via del Lavoro, 1<br />73045 Leverano (LE)</p>
              </div>
              <div>
                <p className="text-zinc-500">Telefono</p>
                <a href="tel:+390000000000" className="text-zinc-300 hover:text-orange-500 transition-colors">
                  +39 000 000 0000
                </a>
              </div>
              <div>
                <p className="text-zinc-500">Email</p>
                <a
                  href="mailto:info@metalmontaggi.it"
                  className="text-zinc-300 hover:text-orange-500 transition-colors"
                >
                  info@metalmontaggi.it
                </a>
              </div>
              <div>
                <p className="text-zinc-500">Orari</p>
                <p className="text-zinc-300">Lun–Ven: 8:00–18:00<br />Sab: 8:00–12:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-zinc-600 text-xs">
            © {new Date().getFullYear()} Metal Montaggi. Tutti i diritti riservati.
          </p>
          <p className="text-zinc-600 text-xs">
            P.IVA 00000000000 — Leverano (LE)
          </p>
        </div>
      </div>
    </footer>
  );
}
