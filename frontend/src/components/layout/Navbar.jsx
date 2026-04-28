import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useScrollY } from '../../hooks/useScrollY'
import { useGetCompanyInfoQuery } from '../../store/api/strapiApi'
import { getStrapiImageUrl } from '../../utils/strapi'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chi-siamo', label: 'Chi Siamo' },
  { to: '/servizi', label: 'Servizi' },
  { to: '/galleria', label: 'Galleria' },
  { to: '/contatti', label: 'Contatti' },
]

export default function Navbar() {
  const scrollY = useScrollY()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { data: company } = useGetCompanyInfoQuery()

  useEffect(() => setMenuOpen(false), [pathname])

  const scrolled = scrollY > 40
  const logoUrl = getStrapiImageUrl(company?.logo)
  const nomeAzienda = company?.nome_azienda || 'METAL MONTAGGI'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={nomeAzienda}
                className="h-9 w-auto object-contain transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center font-black text-white text-sm transition-transform group-hover:scale-110">
                MM
              </div>
            )}
            <span className="font-bold text-white tracking-wide leading-tight hidden sm:block">
              {nomeAzienda.includes(' ') ? (
                <>
                  {nomeAzienda.split(' ').slice(0, -1).join(' ')}<br />
                  <span className="text-brand font-black">{nomeAzienda.split(' ').slice(-1)[0]}</span>
                </>
              ) : (
                <span className="text-brand font-black">{nomeAzienda}</span>
              )}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-brand bg-brand/10'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/contatti"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-light text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-brand/25"
            >
              Preventivo Gratuito
            </Link>

            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="px-4 pb-4 flex flex-col gap-1 border-t border-zinc-800 pt-3">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-brand bg-brand/10' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/contatti"
            className="mt-2 px-4 py-3 bg-brand text-white text-sm font-semibold rounded-lg text-center"
          >
            Preventivo Gratuito
          </Link>
        </nav>
      </div>
    </header>
  )
}
