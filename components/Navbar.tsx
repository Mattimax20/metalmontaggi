'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/chi-siamo', label: 'Chi Siamo' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/galleria', label: 'Galleria' },
  { href: '/contatti', label: 'Contatti' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-zinc-950/98 shadow-lg shadow-black/40 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-orange-500 flex items-center justify-center text-white font-bold text-sm font-['Oswald'] tracking-wider shrink-0">
              MM
            </div>
            <div className="leading-tight">
              <div className="font-['Oswald'] font-bold text-white text-xl leading-none tracking-wider">
                METAL
              </div>
              <div className="font-['Oswald'] text-orange-500 text-xs tracking-[0.3em] leading-none">
                MONTAGGI
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${
                    isActive
                      ? 'text-orange-500'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contatti" className="btn-primary text-xs px-6 py-2.5">
              Preventivo Gratuito
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-zinc-300"
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-widest py-1 transition-colors ${
                  isActive ? 'text-orange-500' : 'text-zinc-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/contatti" className="btn-primary text-xs text-center mt-2">
            Preventivo Gratuito
          </Link>
        </div>
      </div>
    </header>
  );
}
