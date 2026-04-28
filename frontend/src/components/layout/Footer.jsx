import { Link } from 'react-router-dom'
import { useGetCompanyInfoQuery } from '../../store/api/strapiApi'
import { getStrapiImageUrl } from '../../utils/strapi'

const SERVIZI_LINKS = [
  { to: '/servizi#fabbro', label: 'Lavorazioni Fabbro' },
  { to: '/servizi#serramenti', label: 'Serramenti in Metallo' },
  { to: '/servizi#carpenteria', label: 'Carpenteria Metallica' },
]

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chi-siamo', label: 'Chi Siamo' },
  { to: '/galleria', label: 'Galleria Lavori' },
  { to: '/contatti', label: 'Contatti' },
]

export default function Footer() {
  const { data: c } = useGetCompanyInfoQuery()

  const logoUrl = getStrapiImageUrl(c?.logo_negativo) ?? getStrapiImageUrl(c?.logo)
  const nomeAzienda = c?.nome_azienda || 'METAL MONTAGGI'
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={nomeAzienda} className="h-9 w-auto object-contain" />
              ) : (
                <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center font-black text-white text-sm">
                  MM
                </div>
              )}
              {!logoUrl && (
                <span className="font-bold text-white tracking-wide">
                  METAL <span className="text-brand">MONTAGGI</span>
                </span>
              )}
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {c?.footer_slogan || c?.slogan || 'Soluzioni metalliche su misura per privati e aziende. Qualità artigianale dal 2000 nel cuore del Salento.'}
            </p>
            {/* Social links */}
            {(c?.facebook_url || c?.instagram_url || c?.linkedin_url) && (
              <div className="flex gap-3 mt-4">
                {c.facebook_url && (
                  <a href={c.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 bg-zinc-800 hover:bg-brand/20 border border-zinc-700 hover:border-brand/40 rounded-lg flex items-center justify-center text-zinc-400 hover:text-brand transition-colors text-xs font-bold">
                    f
                  </a>
                )}
                {c.instagram_url && (
                  <a href={c.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 bg-zinc-800 hover:bg-brand/20 border border-zinc-700 hover:border-brand/40 rounded-lg flex items-center justify-center text-zinc-400 hover:text-brand transition-colors text-xs">
                    IG
                  </a>
                )}
                {c.linkedin_url && (
                  <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 bg-zinc-800 hover:bg-brand/20 border border-zinc-700 hover:border-brand/40 rounded-lg flex items-center justify-center text-zinc-400 hover:text-brand transition-colors text-xs">
                    in
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Servizi */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Servizi</h3>
            <ul className="space-y-2.5">
              {SERVIZI_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-zinc-400 hover:text-brand text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link rapidi */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Link Rapidi</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-zinc-400 hover:text-brand text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contatti</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              {(c?.indirizzo || c?.citta) && (
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">📍</span>
                  <span>
                    {c.indirizzo && <>{c.indirizzo}<br /></>}
                    {c.cap} {c.citta}{c.provincia ? ` (${c.provincia})` : ''}
                  </span>
                </li>
              )}
              {c?.telefono && (
                <li className="flex items-center gap-2">
                  <span className="text-brand">📞</span>
                  <a href={`tel:${c.telefono}`} className="hover:text-brand transition-colors">
                    {c.telefono}
                  </a>
                </li>
              )}
              {c?.email && (
                <li className="flex items-center gap-2">
                  <span className="text-brand">✉️</span>
                  <a href={`mailto:${c.email}`} className="hover:text-brand transition-colors">
                    {c.email}
                  </a>
                </li>
              )}
              {c?.orari_apertura && (
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">🕐</span>
                  <span className="whitespace-pre-line">{c.orari_apertura}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>
            {c?.footer_copyright
              ? c.footer_copyright.replace('{year}', currentYear)
              : `© ${currentYear} ${nomeAzienda}. Tutti i diritti riservati.`
            }
          </span>
          {c?.piva && <span>P.IVA {c.piva}</span>}
        </div>
      </div>
    </footer>
  )
}
