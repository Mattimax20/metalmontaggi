import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Sezione accordion ────────────────────────────────────────────────────────
export function Section({ number, title, children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-zinc-800 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-zinc-900 hover:bg-zinc-800/60 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-brand font-black text-lg w-8 shrink-0">{number}.</span>
          <span className="text-white font-semibold text-base">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 py-5 bg-zinc-950/50 border-t border-zinc-800 prose-legal">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Tabella cookie ───────────────────────────────────────────────────────────
export function CookieTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-800 text-zinc-300">
            <th className="text-left px-4 py-3 font-semibold">Nome cookie</th>
            <th className="text-left px-4 py-3 font-semibold">Fornitore</th>
            <th className="text-left px-4 py-3 font-semibold">Finalità</th>
            <th className="text-left px-4 py-3 font-semibold">Durata</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t border-zinc-800 ${i % 2 === 0 ? 'bg-zinc-900/40' : 'bg-zinc-900/20'}`}>
              <td className="px-4 py-3 font-mono text-brand text-xs align-top">{r.name}</td>
              <td className="px-4 py-3 text-zinc-300 align-top">{r.provider}</td>
              <td className="px-4 py-3 text-zinc-400 align-top">{r.purpose}</td>
              <td className="px-4 py-3 text-zinc-400 align-top whitespace-nowrap">{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Badge categoria cookie ───────────────────────────────────────────────────
export function CategoryBadge({ type }) {
  const map = {
    tecnici:   { label: 'Tecnici',   cls: 'bg-zinc-700 text-zinc-300' },
    analytics: { label: 'Analytics', cls: 'bg-blue-900/50 text-blue-300 border border-blue-800/50' },
    marketing: { label: 'Marketing', cls: 'bg-purple-900/50 text-purple-300 border border-purple-800/50' },
  }
  const { label, cls } = map[type] ?? map.tecnici
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  )
}

// ─── Wrapper pagina legale ────────────────────────────────────────────────────
export default function LegalLayout({ badge, title, subtitle, lastUpdated, sibling, children }) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-zinc-900 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="text-brand text-sm font-semibold uppercase tracking-widest">{badge}</span>
          <h1 className="mt-2 text-4xl md:text-5xl font-black text-white leading-tight">{title}</h1>
          {subtitle && <p className="mt-4 text-zinc-400 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-zinc-500">
            <span>Ultimo aggiornamento: <strong className="text-zinc-400">{lastUpdated}</strong></span>
            {sibling && (
              <Link to={sibling.to} className="text-brand hover:underline">
                → {sibling.label}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Corpo */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {children}
        </div>
      </section>
    </>
  )
}
