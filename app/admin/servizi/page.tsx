'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  features: string[];
  order: number;
  active: boolean;
}

const categories = [
  { value: 'fabbro', label: 'Fabbro' },
  { value: 'serramenti', label: 'Serramenti' },
  { value: 'carpenteria', label: 'Carpenteria' },
];

const categoryColors: Record<string, string> = {
  fabbro: 'bg-orange-500/20 text-orange-400',
  serramenti: 'bg-blue-500/20 text-blue-400',
  carpenteria: 'bg-green-500/20 text-green-400',
};

const emptyForm = {
  title: '',
  description: '',
  category: 'fabbro',
  features: '',
  order: '0',
  active: 'true',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () =>
    fetch('/api/services?admin=1')
      .then((r) => r.json())
      .then(setServices)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description,
      category: s.category,
      features: s.features.join('\n'),
      order: String(s.order),
      active: String(s.active),
    });
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('features', JSON.stringify(form.features.split('\n').map((f) => f.trim()).filter(Boolean)));
    fd.append('order', form.order);
    fd.append('active', form.active);
    if (imageFile) fd.append('image', imageFile);

    const url = editingId ? `/api/services/${editingId}` : '/api/services';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Errore nel salvataggio');
        return;
      }
      setShowModal(false);
      load();
    } catch {
      setError('Errore di connessione');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDeleteId(null);
      load();
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Servizi</h1>
          <p className="text-zinc-500 mt-1">Gestisci i servizi mostrati sul sito</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          + Aggiungi Servizio
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-zinc-900 animate-pulse" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="card-metal p-12 text-center text-zinc-600">
          Nessun servizio. Clicca &quot;Aggiungi Servizio&quot; per iniziare.
        </div>
      ) : (
        <div className="card-metal overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider">Servizio</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider hidden md:table-cell">Categoria</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider hidden lg:table-cell">Ordine</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider">Stato</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {s.imageUrl && (
                        <div className="relative w-10 h-10 bg-zinc-800 shrink-0 overflow-hidden">
                          <Image src={s.imageUrl} alt={s.title} fill className="object-cover" sizes="40px" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">{s.title}</p>
                        <p className="text-zinc-500 text-xs mt-0.5 hidden sm:block">{s.features.length} caratteristiche</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`px-2 py-1 text-xs font-medium ${categoryColors[s.category]}`}>
                      {categories.find((c) => c.value === s.category)?.label ?? s.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-zinc-400 text-sm">{s.order}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 ${s.active ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>
                      {s.active ? 'Attivo' : 'Nascosto'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} className="text-zinc-400 hover:text-white text-xs px-3 py-1 border border-zinc-700 hover:border-zinc-500 transition-colors">
                        Modifica
                      </button>
                      <button onClick={() => setDeleteId(s.id)} className="text-red-500 hover:text-red-400 text-xs px-3 py-1 border border-red-900 hover:border-red-700 transition-colors">
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold">{editingId ? 'Modifica Servizio' : 'Nuovo Servizio'}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Titolo *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="input-metal" placeholder="Es: Cancelli su Misura" />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Categoria *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-metal">
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Descrizione *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="input-metal resize-none" />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Caratteristiche (una per riga)</label>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} className="input-metal resize-none" placeholder="Design personalizzato&#10;Acciaio certificato&#10;Garanzia inclusa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Ordine</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input-metal" />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Stato</label>
                  <select value={form.active} onChange={(e) => setForm({ ...form, active: e.target.value })} className="input-metal">
                    <option value="true">Attivo</option>
                    <option value="false">Nascosto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">Immagine</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="text-zinc-400 text-sm w-full file:mr-4 file:py-2 file:px-4 file:bg-zinc-800 file:text-zinc-300 file:border-0 file:text-sm file:cursor-pointer hover:file:bg-zinc-700" />
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-400 text-sm">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? 'Salvataggio...' : editingId ? 'Salva Modifiche' : 'Crea Servizio'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline px-6">
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 max-w-sm w-full">
            <h3 className="text-white font-bold mb-2">Elimina Servizio</h3>
            <p className="text-zinc-400 text-sm mb-6">Sei sicuro? Questa azione è irreversibile.</p>
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
