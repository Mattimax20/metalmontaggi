'use client';

import { useEffect, useState } from 'react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () =>
    fetch('/api/contacts')
      .then((r) => r.json())
      .then(setContacts)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: true } : c));
      if (selected?.id === id) setSelected({ ...selected, read: true });
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDeleteId(null);
      if (selected?.id === id) setSelected(null);
      load();
    }
  };

  const openContact = (c: Contact) => {
    setSelected(c);
    if (!c.read) markRead(c.id);
  };

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Messaggi</h1>
        <p className="text-zinc-500 mt-1">
          {contacts.length} messaggi totali
          {unread > 0 && <span className="ml-2 text-orange-500 font-medium">{unread} non letti</span>}
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-zinc-900 animate-pulse" />)}
        </div>
      ) : contacts.length === 0 ? (
        <div className="card-metal p-12 text-center text-zinc-600">
          Nessun messaggio ricevuto
        </div>
      ) : (
        <div className="card-metal overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider text-left w-8" />
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider text-left">Mittente</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider text-left hidden md:table-cell">Messaggio</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider text-left hidden sm:table-cell">Data</th>
                <th className="px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-zinc-900/60 cursor-pointer ${!c.read ? 'bg-orange-500/5' : ''}`}
                  onClick={() => openContact(c)}
                >
                  <td className="px-4 py-4">
                    <div className={`w-2 h-2 rounded-full mx-auto ${c.read ? 'bg-zinc-700' : 'bg-orange-500'}`} />
                  </td>
                  <td className="px-4 py-4">
                    <p className={`text-sm ${c.read ? 'text-zinc-300' : 'text-white font-medium'}`}>{c.name}</p>
                    <p className="text-zinc-500 text-xs">{c.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-zinc-400 text-sm truncate max-w-xs">{c.message}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-zinc-500 text-sm whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {!c.read && (
                        <button onClick={() => markRead(c.id)} className="text-zinc-400 hover:text-white text-xs px-2 py-1 border border-zinc-700 hover:border-zinc-500 transition-colors whitespace-nowrap">
                          Segna letto
                        </button>
                      )}
                      <button onClick={() => setDeleteId(c.id)} className="text-red-500 hover:text-red-400 text-xs px-2 py-1 border border-red-900 hover:border-red-700 transition-colors">
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

      {/* Message detail */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold">Messaggio da {selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Nome</p>
                  <p className="text-white">{selected.name}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Data</p>
                  <p className="text-white">{new Date(selected.createdAt).toLocaleDateString('it-IT', { dateStyle: 'long' })}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-orange-500 hover:text-orange-400">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Telefono</p>
                    <a href={`tel:${selected.phone}`} className="text-orange-500 hover:text-orange-400">{selected.phone}</a>
                  </div>
                )}
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Messaggio</p>
                <div className="bg-zinc-800 border border-zinc-700 p-4 text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}`} className="btn-primary flex-1 text-center text-sm">
                  Rispondi via Email
                </a>
                <button onClick={() => setDeleteId(selected.id)} className="btn-outline text-red-500 border-red-900 hover:bg-red-600 hover:text-white px-4">
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 max-w-sm w-full">
            <h3 className="text-white font-bold mb-2">Elimina Messaggio</h3>
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
