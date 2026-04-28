'use strict';

module.exports = {
  register({ strapi }) {},
  async bootstrap({ strapi }) {
    await createAdminUser(strapi);
    await setPublicPermissions(strapi);
    await seedInformazioniAzienda(strapi);
    await seedServizi(strapi);
  },
};

// ─────────────────────────────────────────────────────────────
async function createAdminUser(strapi) {
  const svc = strapi.service('admin::user');
  if ((await svc.count()) > 0) { strapi.log.info('[Bootstrap] Admin già esistente.'); return; }
  const role = await strapi.service('admin::role').getSuperAdmin();
  const email = process.env.ADMIN_EMAIL || 'admin@metalmontaggi.it';
  const password = process.env.ADMIN_PASSWORD || 'MetalMontaggi@2024!';
  try {
    await svc.create({ email, firstname: 'Admin', lastname: 'Metal Montaggi', username: null, password, isActive: true, roles: role ? [role.id] : [] });
    strapi.log.info('[Bootstrap] ✅ Admin creato: ' + email);
  } catch (e) { strapi.log.error('[Bootstrap] Admin error: ' + e.message); }
}

// ─────────────────────────────────────────────────────────────
async function setPublicPermissions(strapi) {
  try {
    const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!role) return;
    const actions = [
      'api::servizio.servizio.find', 'api::servizio.servizio.findOne',
      'api::galleria-progetto.galleria-progetto.find', 'api::galleria-progetto.galleria-progetto.findOne',
      'api::informazioni-azienda.informazioni-azienda.find',
      'api::contatto.contatto.create',
    ];
    let n = 0;
    for (const action of actions) {
      const ex = await strapi.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
      if (!ex) { await strapi.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } }); n++; }
    }
    strapi.log.info('[Bootstrap] ✅ Permessi pubblici: ' + n + ' nuovi.');
  } catch (e) { strapi.log.error('[Bootstrap] Permessi error: ' + e.message); }
}

// ─────────────────────────────────────────────────────────────
async function seedInformazioniAzienda(strapi) {
  try {
    const ex = await strapi.entityService.findMany('api::informazioni-azienda.informazioni-azienda', {});
    const isUpdate = ex && ex.id;

    const data = {
      nome_azienda: 'Metal Montaggi',
      piva: '01234567891',
      indirizzo: 'Via del Lavoro, 1',
      citta: 'Leverano',
      cap: '73045',
      provincia: 'LE',
      regione: 'Puglia',
      telefono: '+39 000 000 0000',
      email: 'info@metalmontaggi.it',
      orari_apertura: 'Lun–Ven: 8:00–18:00\nSabato: 8:00–12:00\nDomenica: Chiuso',
      anni_esperienza: 25,
      numero_dipendenti: 10,

      hero_badge: '⚒ Dal 2000 — Leverano, Salento',
      hero_titolo_riga1: 'SOLUZIONI',
      hero_titolo_accento: 'METALLICHE',
      hero_titolo_riga3: 'SU MISURA',
      hero_sottotitolo: 'Lavorazioni da fabbro, serramenti in metallo e carpenteria metallica. Qualità artigianale certificata per privati e aziende in tutto il Salento.',
      hero_cta_primario: 'Richiedi Preventivo Gratuito',
      hero_cta_secondario: 'Scopri i Servizi',

      stat_1_valore: '25+',
      stat_1_label: 'Anni di Esperienza',
      stat_2_valore: '500+',
      stat_2_label: 'Lavori Realizzati',
      stat_3_valore: '100%',
      stat_3_label: 'Clienti Soddisfatti',

      perche_noi_titolo: 'Qualità Artigianale, Risultati Garantiti',
      perche_noi_sottotitolo: 'Ogni lavoro porta la firma della nostra esperienza. Non facciamo serie, facciamo su misura.',
      perche_noi_cta: 'Scopri la nostra storia',
      perche_noi_items: [
        { icon: '🎯', title: 'Lavorazioni su Misura', desc: 'Ogni progetto è unico. Progettiamo e realizziamo in base alle tue esigenze specifiche.' },
        { icon: '🏆', title: 'Alta Qualità Materiali', desc: 'Utilizziamo acciaio, ferro e alluminio certificati con trattamenti anti-corrosione.' },
        { icon: '⚙️', title: 'Precisione Artigianale', desc: 'Oltre 20 anni di esperienza garantiscono lavorazioni precise e finiture impeccabili.' },
        { icon: '🤝', title: 'Assistenza Post-Vendita', desc: 'Supporto continuo dopo la consegna. Siamo qui per ogni necessità.' },
      ],

      cta_titolo: 'Hai un Progetto in Mente?',
      cta_testo: 'Descrivi il tuo progetto e ti risponderemo entro 24 ore lavorative con un preventivo gratuito e senza impegno.',
      cta_bottone: 'Contattaci Ora',

      servizi_eyebrow: 'Cosa facciamo',
      servizi_titolo: 'I Nostri Servizi',
      servizi_sottotitolo: 'Dalla progettazione alla posa in opera, realizziamo soluzioni metalliche su misura con materiali certificati e finiture di alta qualità.',
      servizi_cta: 'Tutti i Servizi',

      galleria_eyebrow: 'Il nostro portfolio',
      galleria_titolo: 'I Nostri Lavori',
      galleria_sottotitolo: 'Una selezione dei progetti realizzati negli anni per privati e aziende in tutto il Salento.',
      galleria_cta: 'Vedi Tutti i Lavori',

      chi_siamo_eyebrow: 'Dal 2000',
      chi_siamo_titolo: 'La Nostra Storia',
      chi_siamo_intro: 'Fondata nel 2000 a Leverano, Metal Montaggi è una realtà artigianale specializzata in carpenteria metallica, serramenti in acciaio e alluminio e lavorazioni tradizionali da fabbro.',
      chi_siamo_storia: '## Chi Siamo\n\nMetal Montaggi nasce nel **2000** a Leverano, nel cuore del Salento, come piccola officina artigianale a conduzione familiare.\n\nNel corso degli anni abbiamo investito in macchinari moderni e ampliato la nostra squadra, mantenendo sempre la cura artigianale che ci contraddistingue.\n\nOggi serviamo **privati, aziende ed enti pubblici** in tutta la Puglia, con un portfolio di oltre **500 lavori completati**.',
      chi_siamo_timeline: [
        { year: '2000', title: 'Fondazione', desc: 'Metal Montaggi nasce a Leverano, nel cuore del Salento, con una piccola officina artigianale.' },
        { year: '2005', title: 'Espansione', desc: 'Investimento in nuovi macchinari CNC e ampliamento del laboratorio. Prima grande commessa industriale.' },
        { year: '2012', title: 'Diversificazione', desc: 'Ampliamento del catalogo: serramenti in alluminio e strutture di carpenteria pesante.' },
        { year: '2020', title: 'Oltre 500 Lavori', desc: 'Tagliamo il traguardo dei 500 progetti completati in Puglia, tra privati, aziende e enti pubblici.' },
        { year: '2025', title: 'Oggi', desc: 'Continuiamo a crescere mantenendo la qualità artigianale che ci ha sempre contraddistinto.' },
      ],
      chi_siamo_valori_titolo: 'I Principi che Guidano il Nostro Lavoro',
      chi_siamo_valori: [
        { icon: '🏆', title: 'Qualità Prima di Tutto', desc: 'Selezioniamo solo materiali certificati con trattamenti anti-corrosione e finiture a norma.' },
        { icon: '📐', title: 'Su Misura', desc: 'Non lavoriamo in serie. Ogni progetto è disegnato, calcolato e realizzato per il cliente.' },
        { icon: '⏱', title: 'Puntualità e Affidabilità', desc: 'Rispettiamo i tempi concordati e manteniamo una comunicazione trasparente in ogni fase.' },
        { icon: '🔧', title: 'Assistenza Post-Vendita', desc: 'Il nostro rapporto con il cliente non finisce alla consegna. Siamo presenti per ogni esigenza.' },
      ],
      chi_siamo_processo_titolo: 'Il Nostro Processo in 3 Fasi',
      chi_siamo_processo: [
        { step: '01', title: 'Sopralluogo Gratuito', desc: 'Veniamo da te, misuriamo, ascoltiamo le tue esigenze e valutiamo la fattibilità tecnica del progetto.' },
        { step: '02', title: 'Progettazione e Preventivo', desc: 'Elaboriamo il progetto tecnico con disegni quotati e ti forniamo un preventivo dettagliato e trasparente.' },
        { step: '03', title: 'Realizzazione e Consegna', desc: 'Realizziamo il lavoro in officina e provvediamo alla posa in opera con trattamenti superficiali certificati.' },
      ],

      contatti_eyebrow: 'Contatti',
      contatti_titolo: 'Parliamo del Tuo Progetto',
      contatti_intro: 'Descrivi il tuo progetto e ti risponderemo entro 24 ore lavorative con un preventivo gratuito e senza impegno.',

      footer_slogan: 'Soluzioni metalliche su misura per privati e aziende. Qualità artigianale dal 2000 nel cuore del Salento.',
      meta_descrizione: 'Metal Montaggi – Lavorazioni da fabbro, serramenti in metallo e carpenteria metallica a Leverano (LE).',
    };

    if (isUpdate) {
      await strapi.entityService.update('api::informazioni-azienda.informazioni-azienda', ex.id, { data });
      strapi.log.info('[Bootstrap] ✅ InformazioniAzienda aggiornata con tutti i campi.');
    } else {
      await strapi.entityService.create('api::informazioni-azienda.informazioni-azienda', { data });
      strapi.log.info('[Bootstrap] ✅ InformazioniAzienda creata.');
    }
  } catch (e) { strapi.log.error('[Bootstrap] Azienda error: ' + e.message); }
}

// ─────────────────────────────────────────────────────────────
async function seedServizi(strapi) {
  try {
    const ex = await strapi.entityService.findMany('api::servizio.servizio', { pagination: { limit: 5 } });
    const needsReset = ex && ex.length > 0 && !ex[0].sottocategorie;

    if (needsReset) {
      for (const s of ex) { await strapi.entityService.delete('api::servizio.servizio', s.id); }
      strapi.log.info('[Bootstrap] Vecchi servizi rimossi — ricreo con sottocategorie.');
    } else if (ex && ex.length > 0) {
      strapi.log.info('[Bootstrap] Servizi già completi — skip.');
      return;
    }

    const servizi = [
      {
        titolo: 'Lavorazioni Fabbro', slug: 'lavorazioni-fabbro', categoria: 'fabbro',
        icona_emoji: '⚒',
        descrizione_breve: 'Cancelli su misura, ringhiere, inferriate e grate di sicurezza in ferro e acciaio. Lavorazioni artigianali con materiali certificati.',
        descrizione: '## Lavorazioni da Fabbro\n\nRealizziamo lavorazioni artigianali in ferro, acciaio e acciaio inox. Tutti i manufatti sono trattati con primer antiruggine e verniciatura a polvere per la massima durabilità.',
        sottocategorie: [
          { titolo: 'Cancelli su Misura', descrizione: 'Realizziamo cancelli in ferro e acciaio su misura, carrabili e pedonali, con design personalizzato e trattamenti anti-corrosione.', caratteristiche: ['Personalizzazione completa del design', 'Acciaio, ferro o ferro battuto', 'Motorizzazione e automazione opzionale', 'Trattamento zincatura e verniciatura', 'Installazione e collaudo inclusi'] },
          { titolo: 'Ringhiere e Parapetti', descrizione: 'Soluzioni per scale interne, balconi e terrazze in ferro battuto o acciaio inox, con stili dal classico al contemporaneo.', caratteristiche: ['Ferro battuto o acciaio inox', 'Conformità norme UNI EN 1090', 'Stile classico, moderno o minimal', 'Trattamenti superficiali certificati', 'Posa in opera professionale'] },
          { titolo: 'Inferriate e Grate di Sicurezza', descrizione: 'Grate di sicurezza per finestre e aperture con protezione anti-intrusione e opzioni estetiche personalizzabili.', caratteristiche: ['Apertura antipanico certificata', 'Integrazione sistemi antifurto', 'Design a scomparsa disponibile', 'Trattamento galvanico', 'Garanzia strutturale'] },
        ],
        ordine: 1, in_evidenza: true, attivo: true, publishedAt: new Date(),
      },
      {
        titolo: 'Serramenti in Metallo', slug: 'serramenti-metallo', categoria: 'serramenti',
        icona_emoji: '🚪',
        descrizione_breve: 'Porte blindate, finestre e infissi in acciaio e alluminio con isolamento termoacustico certificato e garanzia decennale.',
        descrizione: '## Serramenti in Metallo\n\nProgettiamo e installiamo serramenti in acciaio e alluminio ad alte prestazioni termiche e acustiche.',
        sottocategorie: [
          { titolo: 'Porte in Metallo', descrizione: 'Porte blindate e di sicurezza per abitazioni e locali commerciali, con isolamento termoacustico superiore e garanzia decennale.', caratteristiche: ['Classe 3–6 antieffrazione', 'Isolamento termoacustico', 'Garanzia 10 anni', 'Personalizzazione estetica', 'Montaggio certificato'] },
          { titolo: 'Finestre e Infissi in Metallo', descrizione: 'Finestre in acciaio o alluminio con doppio vetro camera e prestazioni energetiche di classe A.', caratteristiche: ['Doppio o triplo vetro camera', 'Classe energetica A', 'Taglio termico certificato', 'Profili in acciaio o alluminio', "Tenuta all'aria e all'acqua"] },
          { titolo: 'Installazione e Sostituzione Infissi', descrizione: 'Servizio completo dalla misurazione alla posa: sopralluogo gratuito, smontaggio del vecchio serramento e installazione.', caratteristiche: ['Sopralluogo gratuito', 'Smontaggio e smaltimento', "Posa a regola d'arte", 'Sigillatura e isolamento', 'Test post-installazione'] },
        ],
        ordine: 2, in_evidenza: true, attivo: true, publishedAt: new Date(),
      },
      {
        titolo: 'Carpenteria Metallica', slug: 'carpenteria-metallica', categoria: 'carpenteria',
        icona_emoji: '🏗',
        descrizione_breve: 'Scale metalliche, tettoie, soppalchi e strutture in acciaio su misura con calcolo strutturale e certificazioni CE.',
        descrizione: '## Carpenteria Metallica\n\nProgettiamo e costruiamo strutture metalliche per uso civile e industriale con calcolo strutturale e certificazioni CE.',
        sottocategorie: [
          { titolo: 'Scale Metalliche', descrizione: 'Scale interne ed esterne progettate con calcolo strutturale in conformità normativa, in stile industriale, moderno o classico.', caratteristiche: ['Calcolo strutturale incluso', 'Acciaio S275 o inox 316', 'Gradini in acciaio, legno o vetro', 'Conformità DM 17/01/2018', 'Finitura verniciata o zincata'] },
          { titolo: 'Tettoie e Coperture', descrizione: 'Strutture in acciaio per tettoie, pensiline e coperture industriali con profili certificati e coperture personalizzabili.', caratteristiche: ['Acciaio a caldo o freddo', 'Coperture in policarbonato o vetro', 'Calcolo carichi neve e vento', 'Ancoraggio certificato', 'Colori e finiture su richiesta'] },
          { titolo: 'Soppalchi Metallici', descrizione: 'Soluzioni spaziali verticali per abitazioni e magazzini, con portata elevata fino a 400 kg/m² e conformità normativa.', caratteristiche: ['Portata fino a 400 kg/m²', 'Struttura autoportante', 'Pianale in lamiera o legno', 'Certificazione strutturale', 'Scala integrata'] },
        ],
        ordine: 3, in_evidenza: true, attivo: true, publishedAt: new Date(),
      },
    ];

    for (const s of servizi) {
      await strapi.entityService.create('api::servizio.servizio', { data: s });
    }
    strapi.log.info('[Bootstrap] ✅ ' + servizi.length + ' servizi creati con sottocategorie.');
  } catch (e) { strapi.log.error('[Bootstrap] Servizi error: ' + e.message); }
}
