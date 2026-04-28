export default function SectionTitle({ eyebrow, title, subtitle, center = false, className = '' }) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <span className="text-brand font-semibold text-sm uppercase tracking-widest">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-zinc-400 text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
