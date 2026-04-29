import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SeoHead } from '../hooks/useSeo'
import { useGetCompanyInfoQuery } from '../store/api/strapiApi'
import { revokeConsent } from '../utils/cookieConsent'
import LegalLayout, { Section, CookieTable, CategoryBadge } from '../components/legal/LegalLayout'

// ─── Dati cookie ──────────────────────────────────────────────────────────────
const COOKIE_TECNICI = [
  {
    name: 'mm_cookie_consent',
    provider: 'Metal Montaggi (1st party)',
    purpose: 'Memorizza la scelta dell\'utente sul consenso cookie (analytics, marketing). Nessun dato personale identificativo.',
    duration: 'Persistente (localStorage)',
  },
]

const COOKIE_ANALYTICS = [
  {
    name: '_ga',
    provider: 'Google Analytics 4',
    purpose: 'Identifica sessioni univoche degli utenti per generare statistiche di navigazione aggregate.',
    duration: '2 anni',
  },
  {
    name: `_ga_${'{ID}'}`,
    provider: 'Google Analytics 4',
    purpose: 'Mantiene lo stato della sessione per la property GA4 specifica.',
    duration: '2 anni',
  },
  {
    name: '_gid',
    provider: 'Google Analytics 4',
    purpose: 'Distingue utenti diversi nella stessa giornata.',
    duration: '24 ore',
  },
  {
    name: '_gat',
    provider: 'Google Analytics 4',
    purpose: 'Limita la frequenza delle richieste all\'API di Google Analytics.',
    duration: '1 minuto',
  },
]

const COOKIE_MARKETING = [
  {
    name: '_fbp',
    provider: 'Meta (Facebook) Pixel',
    purpose: 'Identifica il browser per misurare le conversioni pubblicitarie e mostrare annunci pertinenti su Facebook/Instagram.',
    duration: '3 mesi',
  },
  {
    name: '_fbc',
    provider: 'Meta (Facebook) Pixel',
    purpose: 'Memorizza l\'ultimo click su un annuncio Facebook per attribuire le conversioni.',
    duration: '2 anni',
  },
  {
    name: '_gcl_au',
    provider: 'Google Ads',
    purpose: 'Memorizza e tiene traccia delle conversioni generate da Google Ads.',
    duration: '3 mesi',
  },
]

export default function CookiePolicy() {
  const { data: c } = useGetCompanyInfoQuery()
  const [revokeMsg, setRevokeMsg] = useState(false)

  const email = c?.email || 'info@metalmontaggi.it'

  function handleRevoke() {
    revokeConsent()
    setRevokeMsg(true)
    setTimeout(() => window.location.reload(), 1500)
  }

  return (
    <>
      <SeoHead
        title="Cookie Policy – Informativa sull'Uso dei Cookie"
        description="Scopri quali cookie utilizza Metal Montaggi, perché li usiamo e come gestire le tue preferenze. Conforme al GDPR e alle linee guida del Garante Privacy italiano."
        path="/cookie-policy"
      />

      <LegalLayout
        badge="Documento Legale"
        title="Cookie Policy"
        subtitle="Informativa dettagliata sull'utilizzo dei cookie ai sensi dell'art. 122 del D.Lgs. 196/2003 e delle linee guida del Garante per la Protezione dei Dati Personali."
        lastUpdated="29 aprile 2026"
        sibling={{ to: '/privacy-policy', label: 'Leggi anche la Privacy Policy' }}
      >

        {/* 1. Cosa sono i cookie */}
        <Section number="1" title="Cosa sono i cookie">
          <P>
            I <strong className="text-white">cookie</strong> sono piccoli file di testo che i siti web salvano
            nel browser del visitatore. Permettono al sito di ricordare informazioni tra una visita e l'altra
            (es. preferenze di lingua, stato di login) e di raccogliere statistiche di utilizzo.
          </P>
          <P className="mt-3">
            Questo sito utilizza anche tecnologie simili ai cookie, come il{' '}
            <strong className="text-white">localStorage</strong> del browser, utilizzato esclusivamente per
            memorizzare le tue preferenze sul consenso cookie, senza raccogliere dati personali identificativi.
          </P>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Prima parte', desc: 'Impostati direttamente da Metal Montaggi' },
              { label: 'Terza parte', desc: 'Impostati da fornitori esterni (Google, Meta)' },
              { label: 'Persistenti', desc: 'Rimangono nel browser fino alla scadenza' },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm">
                <div className="text-white font-semibold mb-1">{label}</div>
                <div className="text-zinc-400">{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 2. Tecnici */}
        <Section number="2" title="Cookie tecnici (sempre attivi)">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge type="tecnici" />
            <span className="text-zinc-500 text-sm">Non richiedono consenso — necessari per il funzionamento del sito</span>
          </div>
          <P>
            I cookie tecnici sono strettamente necessari per erogare il servizio. Non raccolgono dati
            a scopo di profilazione e non possono essere disabilitati senza compromettere le funzionalità
            del sito. Non è richiesto il tuo consenso per il loro utilizzo (art. 122 co. 1 D.Lgs. 196/2003).
          </P>
          <CookieTable rows={COOKIE_TECNICI} />
        </Section>

        {/* 3. Analytics */}
        <Section number="3" title="Cookie analytics (facoltativi)">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge type="analytics" />
            <span className="text-zinc-500 text-sm">Richiedono il tuo consenso</span>
          </div>
          <P>
            Utilizziamo <strong className="text-white">Google Analytics 4</strong> per analizzare come
            i visitatori interagiscono con il sito (pagine più visitate, percorsi di navigazione, provenienza
            geografica). I dati sono trattati in forma aggregata e pseudo-anonimizzata con IP anonimizzato.
          </P>
          <P className="mt-2">
            Google Analytics è configurato con le seguenti misure di tutela:
          </P>
          <Ul>
            <li>Anonimizzazione dell'indirizzo IP (<code className="text-brand text-xs">anonymize_ip: true</code>)</li>
            <li>Google Consent Mode v2 — nessun dato raccolto prima del consenso</li>
            <li>Conservazione dati impostata al minimo (26 mesi)</li>
            <li>Nessuna condivisione di dati con altri prodotti Google</li>
          </Ul>
          <CookieTable rows={COOKIE_ANALYTICS} />
          <P className="mt-3 text-xs">
            Titolare del trattamento per GA4: Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA (USA).{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Privacy Policy Google
            </a>{' · '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Opt-out browser plug-in GA
            </a>
          </P>
        </Section>

        {/* 4. Marketing */}
        <Section number="4" title="Cookie marketing e profilazione (facoltativi)">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge type="marketing" />
            <span className="text-zinc-500 text-sm">Richiedono il tuo consenso esplicito</span>
          </div>
          <P>
            Questi cookie vengono utilizzati per mostrarti pubblicità personalizzata in base ai tuoi interessi
            su altri siti e piattaforme social, e per misurare l'efficacia delle nostre campagne pubblicitarie.
            Sono attivati <strong className="text-white">solo se accetti la categoria "Marketing"</strong> nel banner cookie.
          </P>

          <SubTitle>Meta Pixel (Facebook/Instagram)</SubTitle>
          <P>
            Il Meta Pixel ci permette di misurare le conversioni generate dalle campagne su Facebook e Instagram
            e di creare pubblici personalizzati. I dati sono trattati da Meta Platforms Ireland Ltd con sede
            nell'UE e possono essere trasferiti negli USA tramite il Data Privacy Framework.{' '}
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Privacy Policy Meta
            </a>
          </P>

          <SubTitle>Google Ads</SubTitle>
          <P>
            I cookie di Google Ads misurano le conversioni (es. compilazione del modulo di contatto) generate
            da campagne Google. I dati sono trattati da Google LLC.{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Privacy Policy Google
            </a>
          </P>
          <CookieTable rows={COOKIE_MARKETING} />
        </Section>

        {/* 5. Gestione */}
        <Section number="5" title="Come gestire le tue preferenze">
          <P>
            Puoi modificare o revocare il consenso ai cookie in qualsiasi momento con gli strumenti qui sotto.
            La revoca non pregiudica la liceità del trattamento effettuato prima della stessa.
          </P>

          {/* Widget revoca */}
          <div className="mt-4 p-5 bg-zinc-900 border border-zinc-700 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-white font-semibold text-sm mb-1">Gestisci le preferenze cookie su questo sito</div>
                <div className="text-zinc-400 text-xs">
                  Clicca il pulsante per reimpostare le preferenze: il banner cookie riapparirà.
                </div>
              </div>
              {revokeMsg ? (
                <span className="text-brand text-sm font-semibold shrink-0">✓ Preferenze azzerate</span>
              ) : (
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="shrink-0 px-5 py-2.5 rounded-xl border border-brand/50 text-brand text-sm font-semibold hover:bg-brand/10 transition-colors"
                >
                  Modifica preferenze
                </button>
              )}
            </div>
          </div>

          <SubTitle className="mt-5">Impostazioni del browser</SubTitle>
          <P>
            Puoi disabilitare i cookie direttamente dalle impostazioni del tuo browser. Tieni presente
            che disabilitare i cookie tecnici potrebbe compromettere le funzionalità del sito.
          </P>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {[
              { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
              { name: 'Firefox', url: 'https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox' },
              { name: 'Safari', url: 'https://support.apple.com/it-it/guide/safari/sfri11471/mac' },
              { name: 'Edge', url: 'https://support.microsoft.com/it-it/windows/eliminare-e-gestire-i-cookie-168dab11-0753-043d-7c16-ede5947fc64d' },
              { name: 'Opera', url: 'https://help.opera.com/it/latest/security-and-privacy/' },
              { name: 'iOS Safari', url: 'https://support.apple.com/it-it/HT201265' },
            ].map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors"
              >
                <span className="text-zinc-500">→</span> {name}
              </a>
            ))}
          </div>

          <SubTitle>Opt-out specifici per provider</SubTitle>
          <Ul>
            <li>
              <strong className="text-white">Google Analytics</strong> —{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                plug-in di opt-out per il browser
              </a>
            </li>
            <li>
              <strong className="text-white">Google Ads</strong> —{' '}
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                Impostazioni annunci Google
              </a>
            </li>
            <li>
              <strong className="text-white">Meta Pixel</strong> —{' '}
              <a href="https://www.facebook.com/privacy/policies/cookies/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                Impostazioni cookie Meta
              </a>
            </li>
            <li>
              <strong className="text-white">Opt-out generalizzato (tutti i network pubblicitari)</strong> —{' '}
              <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                YourOnlineChoices.eu
              </a>
            </li>
          </Ul>
        </Section>

        {/* 6. Normativa */}
        <Section number="6" title="Riferimenti normativi">
          <Ul>
            <li>Regolamento (UE) 2016/679 — <strong className="text-white">GDPR</strong> (General Data Protection Regulation)</li>
            <li>Direttiva 2002/58/CE — <strong className="text-white">ePrivacy Directive</strong> (Cookie Law)</li>
            <li>D.Lgs. 196/2003 e ss.mm.ii. — <strong className="text-white">Codice Privacy italiano</strong></li>
            <li>
              Linee guida del <strong className="text-white">Garante per la Protezione dei Dati Personali</strong> del 10 giugno 2021 sui cookie e altri strumenti di tracciamento —{' '}
              <a
                href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Provvedimento n. 231/2021
              </a>
            </li>
            <li>Decisione di adeguatezza della Commissione Europea — <strong className="text-white">Data Privacy Framework EU-USA</strong> (10 luglio 2023)</li>
          </Ul>
        </Section>

        {/* 7. Contatti */}
        <Section number="7" title="Contatti per la privacy">
          <P>
            Per qualsiasi domanda su questa Cookie Policy o per esercitare i tuoi diritti ai sensi del GDPR,
            puoi contattarci:
          </P>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors"
            >
              ✉️ {email}
            </a>
            <Link
              to="/contatti"
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors"
            >
              → Modulo di contatto
            </Link>
            <Link
              to="/privacy-policy"
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 hover:border-brand/40 hover:text-brand transition-colors"
            >
              🔒 Privacy Policy completa
            </Link>
          </div>
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
    <ul className="space-y-2 text-sm text-zinc-400 ml-4 list-disc list-outside marker:text-brand">
      {children}
    </ul>
  )
}
