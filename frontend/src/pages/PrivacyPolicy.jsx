import { Link } from 'react-router-dom'
import { SeoHead } from '../hooks/useSeo'
import { useGetCompanyInfoQuery } from '../store/api/strapiApi'
import LegalLayout, { Section } from '../components/legal/LegalLayout'

export default function PrivacyPolicy() {
  const { data: c } = useGetCompanyInfoQuery()

  const nomeAzienda  = c?.nome_azienda    || 'Metal Montaggi'
  const indirizzo    = [c?.indirizzo, c?.cap, c?.citta, c?.provincia ? `(${c.provincia})` : ''].filter(Boolean).join(' ') || 'Leverano (LE)'
  const email        = c?.email           || 'info@metalmontaggi.it'
  const telefono     = c?.telefono        || ''
  const piva         = c?.piva            || ''

  return (
    <>
      <SeoHead
        title="Privacy Policy – Informativa sul Trattamento dei Dati Personali"
        description={`Informativa privacy di ${nomeAzienda} ai sensi del GDPR (Regolamento UE 2016/679). Scopri come trattiamo i tuoi dati personali.`}
        path="/privacy-policy"
      />

      <LegalLayout
        badge="Documento Legale"
        title="Informativa Privacy"
        subtitle="Ai sensi dell'art. 13 del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018."
        lastUpdated="29 aprile 2026"
        sibling={{ to: '/cookie-policy', label: 'Leggi anche la Cookie Policy' }}
      >

        {/* 1. Titolare */}
        <Section number="1" title="Titolare del Trattamento">
          <P>Il Titolare del trattamento dei dati personali è:</P>
          <InfoBox>
            <InfoRow label="Ragione sociale">{nomeAzienda}</InfoRow>
            <InfoRow label="Sede">{indirizzo}</InfoRow>
            {piva && <InfoRow label="P.IVA">{piva}</InfoRow>}
            <InfoRow label="E-mail">
              <a href={`mailto:${email}`} className="text-brand hover:underline">{email}</a>
            </InfoRow>
            {telefono && <InfoRow label="Telefono">
              <a href={`tel:${telefono}`} className="text-brand hover:underline">{telefono}</a>
            </InfoRow>}
          </InfoBox>
          <P className="mt-4">
            Per qualsiasi richiesta relativa ai tuoi dati personali puoi contattarci all'indirizzo
            e-mail indicato sopra oppure tramite il{' '}
            <Link to="/contatti" className="text-brand hover:underline">modulo di contatto</Link>.
          </P>
        </Section>

        {/* 2. Dati raccolti */}
        <Section number="2" title="Quali dati raccogliamo">
          <P>Raccogliamo dati personali esclusivamente quando necessario. Le categorie di dati trattate sono:</P>

          <SubTitle>a) Dati forniti volontariamente dall'utente</SubTitle>
          <Ul>
            <li><strong className="text-white">Dati di contatto</strong> — nome, cognome, indirizzo e-mail, numero di telefono che fornisci compilando il modulo di contatto.</li>
            <li><strong className="text-white">Contenuto delle comunicazioni</strong> — oggetto e testo del messaggio inviato tramite il modulo.</li>
          </Ul>

          <SubTitle>b) Dati raccolti automaticamente</SubTitle>
          <Ul>
            <li><strong className="text-white">Dati di navigazione</strong> — indirizzo IP, tipo di browser, sistema operativo, pagine visitate, data e ora dell'accesso. Questi dati sono necessari per il funzionamento tecnico del sito e vengono conservati in forma anonimizzata.</li>
            <li><strong className="text-white">Cookie</strong> — per i dettagli consulta la nostra <Link to="/cookie-policy" className="text-brand hover:underline">Cookie Policy</Link>.</li>
          </Ul>

          <P className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm">
            <strong className="text-white">Dati di minori:</strong> il sito non è diretto a minori di 16 anni e non raccoglie consapevolmente dati personali di minori. Se hai meno di 16 anni ti chiediamo di non inviare dati personali.
          </P>
        </Section>

        {/* 3. Finalità e basi giuridiche */}
        <Section number="3" title="Perché trattiamo i tuoi dati (finalità e basi giuridiche)">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800 text-zinc-300">
                  <th className="text-left px-4 py-3 font-semibold">Finalità</th>
                  <th className="text-left px-4 py-3 font-semibold">Base giuridica</th>
                  <th className="text-left px-4 py-3 font-semibold">Conservazione</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Rispondere alle tue richieste di contatto / preventivo', 'Esecuzione di misure precontrattuali (art. 6.1.b GDPR)', '12 mesi dalla risposta'],
                  ['Gestione del rapporto commerciale (se diventi cliente)', 'Esecuzione del contratto (art. 6.1.b GDPR)', '10 anni (obbligo fiscale)'],
                  ['Funzionamento tecnico del sito (log di accesso)', 'Legittimo interesse (art. 6.1.f GDPR)', '30 giorni'],
                  ['Statistiche di navigazione aggregate anonime — Google Analytics 4', 'Consenso (art. 6.1.a GDPR)', 'Fino alla revoca del consenso, max 26 mesi'],
                  ['Pubblicità personalizzata — Meta Pixel, Google Ads', 'Consenso (art. 6.1.a GDPR)', 'Fino alla revoca del consenso, max 13 mesi'],
                  ['Adempimento di obblighi legali', 'Obbligo legale (art. 6.1.c GDPR)', 'Secondo legge applicabile'],
                ].map(([fin, base, cons], i) => (
                  <tr key={i} className={`border-t border-zinc-800 align-top ${i % 2 === 0 ? 'bg-zinc-900/40' : 'bg-zinc-900/20'}`}>
                    <td className="px-4 py-3 text-zinc-300">{fin}</td>
                    <td className="px-4 py-3 text-zinc-400">{base}</td>
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{cons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P className="mt-4 text-sm">
            Dove la base giuridica è il <strong className="text-white">consenso</strong>, hai il diritto di revocarlo in qualsiasi momento senza che ciò pregiudichi la liceità del trattamento effettuato prima della revoca.
          </P>
        </Section>

        {/* 4. Destinatari */}
        <Section number="4" title="Chi può accedere ai tuoi dati">
          <P>I tuoi dati non sono venduti né ceduti a terzi per finalità commerciali. Possono accedere ai dati:</P>
          <Ul>
            <li><strong className="text-white">Nostro personale interno</strong> — limitatamente a quanto necessario per gestire le richieste.</li>
            <li><strong className="text-white">Fornitori di servizi tecnici</strong> (Responsabili del trattamento ex art. 28 GDPR) — tra cui provider di hosting, servizi e-mail e piattaforme di analytics, vincolati da appositi accordi.</li>
            <li><strong className="text-white">Autorità pubbliche</strong> — solo se richiesto dalla legge.</li>
          </Ul>
          <P className="mt-3">Principali fornitori terzi (con link alle rispettive informative):</P>
          <Ul>
            <li>
              <strong className="text-white">Google LLC</strong> (Google Analytics 4, Google Ads) — dati trasferiti negli USA con garanzie adeguate (DPF EU-USA).{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Privacy Policy Google</a>
            </li>
            <li>
              <strong className="text-white">Meta Platforms Ireland Ltd</strong> (Meta Pixel) — dati trasferiti negli USA con garanzie adeguate.{' '}
              <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Privacy Policy Meta</a>
            </li>
          </Ul>
        </Section>

        {/* 5. Trasferimenti extra-UE */}
        <Section number="5" title="Trasferimento dei dati fuori dall'UE">
          <P>
            Alcuni fornitori terzi (Google, Meta) operano negli Stati Uniti. Il trasferimento è coperto
            dal <strong className="text-white">Data Privacy Framework (DPF) EU-USA</strong> adottato dalla Commissione Europea
            con decisione di adeguatezza del 10 luglio 2023, che garantisce un livello di protezione
            equivalente a quello europeo.
          </P>
          <P className="mt-3">
            Per i trattamenti in cui non è applicabile il DPF, ci affidiamo alle{' '}
            <strong className="text-white">Clausole Contrattuali Standard</strong> approvate dalla Commissione Europea
            (art. 46.2.c GDPR).
          </P>
        </Section>

        {/* 6. Diritti */}
        <Section number="6" title="I tuoi diritti">
          <P>In quanto interessato, hai i seguenti diritti ai sensi degli artt. 15–22 GDPR:</P>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {[
              { icon: '🔍', title: 'Accesso', desc: 'Sapere se trattiamo tuoi dati e ottenerne copia (art. 15).' },
              { icon: '✏️', title: 'Rettifica', desc: 'Correggere dati inesatti o incompleti (art. 16).' },
              { icon: '🗑️', title: 'Cancellazione', desc: 'Richiedere l\'eliminazione dei dati ("diritto all\'oblio", art. 17).' },
              { icon: '⏸️', title: 'Limitazione', desc: 'Sospendere il trattamento in determinati casi (art. 18).' },
              { icon: '📦', title: 'Portabilità', desc: 'Ricevere i dati in formato strutturato e trasferirli (art. 20).' },
              { icon: '🚫', title: 'Opposizione', desc: 'Opporti al trattamento basato su legittimo interesse (art. 21).' },
              { icon: '🔄', title: 'Revoca consenso', desc: 'Revocare il consenso in qualsiasi momento senza effetto retroattivo (art. 7.3).' },
              { icon: '⚖️', title: 'Reclamo', desc: 'Presentare reclamo al Garante Privacy italiano (art. 77).' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{title}</div>
                  <div className="text-zinc-400 text-sm mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-brand/10 border border-brand/30 rounded-xl">
            <P className="text-sm">
              <strong className="text-white">Come esercitare i tuoi diritti:</strong> invia una richiesta
              scritta a <a href={`mailto:${email}`} className="text-brand hover:underline">{email}</a> indicando
              il diritto che vuoi esercitare e un documento d'identità. Risponderemo entro <strong className="text-white">30 giorni</strong>.
            </P>
          </div>
        </Section>

        {/* 7. Garante */}
        <Section number="7" title="Reclamo all'Autorità di controllo">
          <P>
            Se ritieni che il trattamento dei tuoi dati violi il GDPR, hai il diritto di presentare
            reclamo al <strong className="text-white">Garante per la Protezione dei Dati Personali</strong>:
          </P>
          <InfoBox className="mt-3">
            <InfoRow label="Sito web">
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                www.garanteprivacy.it
              </a>
            </InfoRow>
            <InfoRow label="E-mail">garante@gpdp.it</InfoRow>
            <InfoRow label="PEC">protocollo@pec.gpdp.it</InfoRow>
            <InfoRow label="Telefono">+39 06 69677 1</InfoRow>
          </InfoBox>
        </Section>

        {/* 8. Cookie */}
        <Section number="8" title="Cookie e tecnologie di tracciamento">
          <P>
            Questo sito utilizza cookie tecnici e, previo consenso, cookie analytics e di marketing.
            Per informazioni dettagliate — inclusa la tabella dei cookie con nome, fornitore e durata —
            consulta la nostra{' '}
            <Link to="/cookie-policy" className="text-brand hover:underline font-semibold">
              Cookie Policy
            </Link>.
          </P>
          <P className="mt-3">
            Puoi gestire o revocare le tue preferenze in qualsiasi momento cliccando su{' '}
            <strong className="text-white">"Gestisci cookie"</strong> nel piè di pagina del sito.
          </P>
        </Section>

        {/* 9. Sicurezza */}
        <Section number="9" title="Misure di sicurezza">
          <P>
            Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali
            da accesso non autorizzato, perdita, distruzione o divulgazione, tra cui:
          </P>
          <Ul>
            <li>Trasmissione cifrata via HTTPS/TLS</li>
            <li>Accesso ai dati limitato al personale autorizzato</li>
            <li>Cookie di sessione con flag <code className="text-brand text-xs bg-zinc-800 px-1.5 py-0.5 rounded">HttpOnly</code> e <code className="text-brand text-xs bg-zinc-800 px-1.5 py-0.5 rounded">Secure</code></li>
            <li>Revisione periodica delle misure di sicurezza</li>
          </Ul>
        </Section>

        {/* 10. Modifiche */}
        <Section number="10" title="Modifiche a questa informativa">
          <P>
            Potremmo aggiornare questa informativa per riflettere modifiche alle nostre pratiche
            o alla normativa applicabile. Ogni modifica sostanziale sarà comunicata tramite avviso
            sul sito. La data in cima alla pagina indica l'ultima revisione.
          </P>
          <P className="mt-3">
            Ti invitiamo a consultare periodicamente questa pagina. L'uso continuato del sito
            dopo la pubblicazione di modifiche costituisce accettazione delle stesse per i
            soli trattamenti basati su legittimo interesse; per i trattamenti basati su consenso
            sarà richiesta una nuova autorizzazione.
          </P>
        </Section>

      </LegalLayout>
    </>
  )
}

// ─── Micro-componenti tipografici ─────────────────────────────────────────────
function P({ children, className = '' }) {
  return <p className={`text-zinc-400 text-sm leading-relaxed ${className}`}>{children}</p>
}

function SubTitle({ children }) {
  return <h4 className="text-zinc-200 font-semibold mt-5 mb-2 text-sm">{children}</h4>
}

function Ul({ children }) {
  return (
    <ul className="space-y-2 text-sm text-zinc-400 ml-4">
      {children}
    </ul>
  )
}

function InfoBox({ children, className = '' }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800 ${className}`}>
      {children}
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="flex gap-4 px-4 py-3 text-sm">
      <span className="text-zinc-500 shrink-0 w-32">{label}</span>
      <span className="text-zinc-300">{children}</span>
    </div>
  )
}
