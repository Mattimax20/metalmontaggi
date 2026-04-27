'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface GalleryItem {
  id: number;
  title: string | null;
  imageUrl: string;
  category: string;
  active: boolean;
}

const categories = [
  { value: 'cancelli', label: 'Cancelli' },
  { value: 'serramenti', label: 'Serramenti' },
  { value: 'strutture', label: 'Strutture' },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'cancelli' });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch('/api/gallery?admin=1')
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) { setUploadError('Seleziona un\'immagine'); return; }
    setUploading(true);
    setUploadError('');

    const fd = new FormData();
    fd.append('image', uploadFile);
    fd.append('category', uploadForm.category);
    if (uploadForm.title) fd.append('title', uploadForm.title);

    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: fd });
      if (!res.ok) {
        const d = await res.json();
        setUploadError(d.error || 'Errore upload');
        return;
      }
      setShowUpload(false);
      setUploadForm({ title: '', category: 'cancelli' });
      setUploadFile(null);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch {
      setUploadError('Errore di connessione');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) { setDeleteId(null); load(); }
  };

  const categoryLabel = (cat: string) => categories.find((c) => c.value === cat)?.label ?? cat;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Galleria</h1>
          <p className="text-zinc-500 mt-1">{items.length} immagini caricate</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary">
          + Carica Foto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card-metal p-12 text-center text-zinc-600">
          Nessuna immagine. Clicca &quot;Carica Foto&quot; per iniziare.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className="relative group bg-zinc-900 overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl}
                  alt={item.title || 'Galleria'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/70 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-3">
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 font-medium"
                >
                  Elimina
                </button>
              </div>
              <div className="p-2 bg-zinc-900 border-t border-zinc-800">
                <p className="text-white text-xs font-medium truncate">{item.title || '—'}</p>
                <p className="text-zinc-500 text-xs">{categoryLabel(item.category)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold">Carica Nuova Foto</h2>
              <button onClick={() => setShowUpload(false)} className="text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Immagine *</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="text-zinc-400 text-sm w-full file:mr-4 file:py-2 file:px-4 file:bg-zinc-800 file:text-zinc-300 file:border-0 file:text-sm file:cursor-pointer hover:file:bg-zinc-700"
                  required
                />
                <p className="text-zinc-600 text-xs mt-1">Max 5MB — JPG, PNG, WebP</p>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Categoria *</label>
                <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className="input-metal">
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Titolo (opzionale)</label>
                <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} className="input-metal" placeholder="Es: Cancello carrabile elegante" />
              </div>
              {uploadError && <div className="bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-400 text-sm">{uploadError}</div>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={uploading} className="btn-primary flex-1 disabled:opacity-60">
                  {uploading ? 'Caricamento...' : 'Carica Foto'}
                </button>
                <button type="button" onClick={() => setShowUpload(false)} className="btn-outline px-6">Annulla</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 max-w-sm w-full">
            <h3 className="text-white font-bold mb-2">Elimina Immagine</h3>
            <p className="text-zinc-400 text-sm mb-6">Questa azione è irreversibile.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 bg-red-600 hover:bg-red-700">Elimina</button>
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
