'use client';

import { useState } from 'react';

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Indirizzo',
    value: 'Via del Lavoro, 1\n73045 Leverano (LE)',
    href: null,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Telefono',
    value: '+39 000 000 0000',
    href: 'tel:+390000000000',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'info@metalmontaggi.it',
    href: 'mailto:info@metalmontaggi.it',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Orari',
    value: 'Lun–Ven: 8:00–18:00\nSab: 8:00–12:00',
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Errore durante l\'invio');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setErrorMsg('Errore di connessione. Riprova tra qualche momento.');
      setStatus('error');
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Siamo Qui per Te</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">Contattaci</h1>
          <div className="divider-accent mt-6" />
          <p className="text-zinc-400 mt-4 max-w-xl">
            Descrivi il tuo progetto e ti risponderemo entro 24 ore lavorative.
            Il sopralluogo e il preventivo sono sempre gratuiti.
          </p>
        </div>
      </div>

      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card-metal p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Invia un Messaggio</h2>

                {status === 'success' ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Messaggio Inviato!</h3>
                    <p className="text-zinc-400">Ti contatteremo entro 24 ore lavorative.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 btn-outline text-sm"
                    >
                      Invia un Altro Messaggio
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">
                          Nome e Cognome *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="input-metal"
                          placeholder="Mario Rossi"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="input-metal"
                          placeholder="mario@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">
                        Telefono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-metal"
                        placeholder="+39 000 000 0000"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 text-xs uppercase tracking-wider mb-2">
                        Messaggio *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="input-metal resize-none"
                        placeholder="Descrivi il tuo progetto o la tua richiesta..."
                      />
                    </div>

                    {status === 'error' && (
                      <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Invio in corso...
                        </>
                      ) : (
                        'Invia Messaggio'
                      )}
                    </button>

                    <p className="text-zinc-600 text-xs text-center">
                      * Campi obbligatori. I tuoi dati saranno usati solo per risponderti.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="card-metal p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-orange-500 mt-0.5">{info.icon}</div>
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-zinc-200 text-sm hover:text-orange-500 transition-colors whitespace-pre-line"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-zinc-200 text-sm whitespace-pre-line">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="card-metal overflow-hidden">
                <div className="h-48 bg-zinc-800 flex flex-col items-center justify-center gap-2 text-zinc-600">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-sm">Leverano (LE), Puglia</p>
                  <p className="text-xs">Aggiungi la mappa Google Maps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
