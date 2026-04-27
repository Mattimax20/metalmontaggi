'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  services: number;
  gallery: number;
  contacts: number;
  unread: number;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/services?admin=1').then((r) => r.json()),
      fetch('/api/gallery?admin=1').then((r) => r.json()),
      fetch('/api/contacts').then((r) => r.json()),
    ]).then(([services, gallery, contacts]) => {
      setStats({
        services: Array.isArray(services) ? services.length : 0,
        gallery: Array.isArray(gallery) ? gallery.length : 0,
        contacts: Array.isArray(contacts) ? contacts.length : 0,
        unread: Array.isArray(contacts) ? contacts.filter((c: Contact) => !c.read).length : 0,
      });
      setRecentContacts(Array.isArray(contacts) ? contacts.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Servizi Attivi', value: stats?.services ?? '–', color: 'border-orange-500', href: '/admin/servizi' },
    { label: 'Foto Galleria', value: stats?.gallery ?? '–', color: 'border-blue-500', href: '/admin/galleria' },
    { label: 'Messaggi Totali', value: stats?.contacts ?? '–', color: 'border-green-500', href: '/admin/contatti' },
    { label: 'Non Letti', value: stats?.unread ?? '–', color: 'border-red-500', href: '/admin/contatti' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Benvenuto nel pannello di gestione Metal Montaggi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`card-metal p-6 border-t-2 ${card.color} hover:bg-zinc-800 transition-colors`}
          >
            {loading ? (
              <div className="h-8 w-16 bg-zinc-800 animate-pulse mb-2 rounded" />
            ) : (
              <div className="text-4xl font-bold text-white mb-1">{card.value}</div>
            )}
            <div className="text-zinc-500 text-sm">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent contacts */}
      <div className="card-metal">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-white font-bold">Ultimi Messaggi</h2>
          <Link href="/admin/contatti" className="text-orange-500 hover:text-orange-400 text-sm">
            Vedi tutti →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-zinc-800 animate-pulse rounded" />
            ))}
          </div>
        ) : recentContacts.length === 0 ? (
          <div className="p-8 text-center text-zinc-600">Nessun messaggio ricevuto</div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {recentContacts.map((c) => (
              <div key={c.id} className="flex items-start gap-4 p-4 hover:bg-zinc-900/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${c.read ? 'bg-zinc-600' : 'bg-orange-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-medium text-sm">{c.name}</span>
                    <span className="text-zinc-600 text-xs shrink-0">
                      {new Date(c.createdAt).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5">{c.email}</p>
                  <p className="text-zinc-400 text-sm mt-1 truncate">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/servizi', label: 'Aggiungi Servizio', desc: 'Crea un nuovo servizio' },
          { href: '/admin/galleria', label: 'Carica Foto', desc: 'Aggiungi immagini alla galleria' },
          { href: '/', label: 'Vedi il Sito', desc: 'Apri il sito pubblico', external: true },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            target={a.external ? '_blank' : undefined}
            className="card-metal p-5 hover:border-orange-500/60 transition-colors"
          >
            <div className="text-white font-medium text-sm">{a.label}</div>
            <div className="text-zinc-500 text-xs mt-1">{a.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
