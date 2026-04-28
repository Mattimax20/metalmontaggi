export default function LoadingSpinner({ text = 'Caricamento...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-zinc-700 border-t-brand rounded-full animate-spin" />
      {text && <p className="text-zinc-400 text-sm">{text}</p>}
    </div>
  )
}
