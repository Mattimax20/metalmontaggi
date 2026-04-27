'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: number;
  title: string | null;
  imageUrl: string;
  category: string;
}

const filters = [
  { key: 'all', label: 'Tutti i Lavori' },
  { key: 'cancelli', label: 'Cancelli' },
  { key: 'serramenti', label: 'Serramenti' },
  { key: 'strutture', label: 'Strutture' },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'all' ? items : items.filter((i) => i.category === activeFilter);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">I Nostri Lavori</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">Galleria</h1>
          <div className="divider-accent mt-6" />
          <p className="text-zinc-400 mt-4 max-w-xl">
            Una selezione dei lavori realizzati negli anni per privati e aziende in tutto il Salento.
          </p>
        </div>
      </div>

      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  activeFilter === f.key
                    ? 'bg-orange-500 text-white'
                    : 'border border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-zinc-600">
              <p className="text-lg">Nessuna immagine in questa categoria</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="relative aspect-square overflow-hidden group bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Lavoro Metal Montaggi'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/60 transition-all duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {!loading && (
            <p className="text-zinc-600 text-sm text-center mt-8">
              {filtered.length} {filtered.length === 1 ? 'lavoro' : 'lavori'} visualizzati
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:text-orange-500 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.title || 'Lavoro Metal Montaggi'}
              width={1200}
              height={800}
              className="object-contain w-full max-h-[80vh]"
            />
            {lightbox.title && (
              <p className="text-white text-center mt-4 font-medium">{lightbox.title}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
