# Metal Montaggi — CMS Backend (Strapi v4 + PostgreSQL)

Sito professionale per **Metal Montaggi**, azienda di Leverano (LE) specializzata in:
- Lavorazioni da fabbro
- Serramenti in metallo
- Carpenteria metallica

---

## Stack

| Componente | Tecnologia |
|---|---|
| CMS / API REST | **Strapi v4.22** |
| Database | **PostgreSQL 15** |
| Upload media | Plugin locale Strapi |
| Runtime | **Node.js 18** |
| Container | **Docker + Docker Compose** |

---

## Avvio rapido

### 1. Clona e configura l'ambiente

```bash
git clone <repo-url>
cd metalmontaggi

# Crea il file .env partendo dall'esempio
cp .env.example .env
```

### 2. Genera secrets sicuri

```bash
# Esegui questo snippet e copia i valori nel tuo .env
node -e "
const crypto = require('crypto');
const gen = () => crypto.randomBytes(32).toString('base64');
console.log('APP_KEYS=' + [gen(),gen(),gen(),gen()].join(','));
console.log('API_TOKEN_SALT=' + gen());
console.log('ADMIN_JWT_SECRET=' + gen());
console.log('JWT_SECRET=' + gen());
console.log('TRANSFER_TOKEN_SALT=' + gen());
"
```

### 3. Avvia (produzione)

```bash
docker-compose up --build -d
```

### 4. Avvia (sviluppo con hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 5. Accedi al pannello admin

```
http://localhost:1337/admin
```

> L'utente admin viene creato automaticamente al primo avvio con le credenziali definite in `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

## Content Types

### Servizio (collection type)
> `GET /api/servizi`

| Campo | Tipo | Note |
|---|---|---|
| `titolo` | string | Obbligatorio |
| `slug` | uid | Auto-generato da titolo |
| `descrizione_breve` | string | Testo breve per card |
| `descrizione` | richtext | Testo completo |
| `categoria` | enum | `fabbro` / `serramenti` / `carpenteria` |
| `immagine_copertina` | media | Immagine principale |
| `galleria` | media[] | Immagini aggiuntive |
| `ordine` | integer | Posizione in lista |
| `in_evidenza` | boolean | Da mostrare in homepage |
| `attivo` | boolean | Visibilità |

---

### Galleria Progetto (collection type)
> `GET /api/galleria-progetti`

| Campo | Tipo | Note |
|---|---|---|
| `titolo` | string | Obbligatorio |
| `slug` | uid | Auto-generato |
| `descrizione` | text | |
| `immagine_copertina` | media | |
| `immagini` | media[] | Carousel del progetto |
| `categoria` | enum | Stesso elenco servizi |
| `data_completamento` | date | |
| `cliente` | string | |
| `luogo` | string | |
| `in_evidenza` | boolean | |

---

### Contatto (collection type — solo admin può leggere)
> `POST /api/contatti/submit` (pubblico)
> `GET /api/contatti` (solo admin)

| Campo | Tipo | Note |
|---|---|---|
| `nome` | string | Obbligatorio |
| `cognome` | string | |
| `email` | email | Obbligatorio |
| `telefono` | string | |
| `oggetto` | string | |
| `messaggio` | text | Obbligatorio |
| `servizio_interesse` | enum | |
| `stato` | enum | `nuovo` / `letto` / `in_lavorazione` / `risposto` / `archiviato` |
| `note_interne` | text | Visibili solo in admin |

---

### Informazioni Azienda (single type)
> `GET /api/informazioni-azienda`

Contiene tutti i dati dell'azienda: nome, indirizzo, contatti, social, coordinate, logo, immagini.

---

## Esempi chiamate API

### Servizi — lista con filtri

```bash
# Tutti i servizi pubblicati
curl http://localhost:1337/api/servizi?populate=immagine_copertina

# Solo servizi fabbro, ordinati
curl "http://localhost:1337/api/servizi?filters[categoria][$eq]=fabbro&sort=ordine:asc&populate=*"

# Servizi in evidenza
curl "http://localhost:1337/api/servizi?filters[in_evidenza][$eq]=true&populate=immagine_copertina"

# Dettaglio singolo servizio
curl http://localhost:1337/api/servizi/1?populate=*
curl "http://localhost:1337/api/servizi?filters[slug][$eq]=lavorazioni-fabbro&populate=*"
```

### Galleria Progetti

```bash
# Tutti i progetti pubblicati
curl http://localhost:1337/api/galleria-progetti?populate=immagine_copertina

# Progetti in evidenza per categoria
curl "http://localhost:1337/api/galleria-progetti?filters[in_evidenza][$eq]=true&filters[categoria][$eq]=serramenti&populate=immagini"

# Paginazione
curl "http://localhost:1337/api/galleria-progetti?pagination[page]=1&pagination[pageSize]=6&populate=immagine_copertina"
```

### Informazioni Azienda

```bash
curl http://localhost:1337/api/informazioni-azienda?populate=*
```

### Form Contatto (endpoint pubblico)

```bash
curl -X POST http://localhost:1337/api/contatti/submit \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario.rossi@example.com",
    "telefono": "+39 333 1234567",
    "oggetto": "Preventivo cancello",
    "messaggio": "Vorrei un preventivo per un cancello in ferro.",
    "servizio_interesse": "fabbro"
  }'
```

### Upload immagine (con API Token)

```bash
curl -X POST http://localhost:1337/api/upload \
  -H "Authorization: Bearer <API_TOKEN>" \
  -F "files=@/path/to/immagine.jpg" \
  -F "ref=api::servizio.servizio" \
  -F "refId=1" \
  -F "field=immagine_copertina"
```

---

## Struttura del progetto

```
metalmontaggi/
├── docker-compose.yml          # Stack produzione
├── docker-compose.dev.yml      # Stack sviluppo
├── .env.example                # Template variabili d'ambiente
├── .gitignore
├── deploy.sh                   # Script avvio
└── strapi/
    ├── Dockerfile              # Immagine produzione
    ├── Dockerfile.dev          # Immagine sviluppo
    ├── package.json
    ├── config/
    │   ├── database.js         # Connessione PostgreSQL
    │   ├── server.js           # Host / port
    │   ├── admin.js            # JWT admin
    │   ├── plugins.js          # Upload + i18n
    │   └── middlewares.js      # CORS + security
    ├── src/
    │   ├── index.js            # Bootstrap (admin user + permessi)
    │   └── api/
    │       ├── servizio/               # Servizi offerti
    │       ├── galleria-progetto/      # Portfolio lavori
    │       ├── contatto/               # Form contatti
    │       └── informazioni-azienda/   # Single type dati azienda
    └── public/
        └── uploads/            # File caricati (volume Docker)
```

---

## Comandi utili

```bash
# Logs Strapi
docker-compose logs -f strapi

# Logs PostgreSQL
docker-compose logs -f postgres

# Accesso al DB
docker-compose exec postgres psql -U strapi -d metalmontaggi

# Riavvio solo Strapi
docker-compose restart strapi

# Stop completo
docker-compose down

# Stop + elimina dati (ATTENZIONE!)
docker-compose down -v
```

---

## Permessi configurati automaticamente

Al primo avvio il bootstrap configura i seguenti permessi per il ruolo **Public** (senza autenticazione):

| Endpoint | Metodo | Pubblico |
|---|---|---|
| `/api/servizi` | GET | ✅ |
| `/api/servizi/:id` | GET | ✅ |
| `/api/galleria-progetti` | GET | ✅ |
| `/api/galleria-progetti/:id` | GET | ✅ |
| `/api/informazioni-azienda` | GET | ✅ |
| `/api/contatti/submit` | POST | ✅ |
| `/api/contatti` | GET/PUT/DELETE | ❌ Solo admin |
