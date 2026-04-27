# Metal Montaggi — Sito Web Aziendale

Sito web professionale per **Metal Montaggi**, azienda di lavorazioni metalliche con sede a **Leverano (LE)**.

## Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Linguaggio | TypeScript |
| Stile | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT in cookie httpOnly (jose) |

> Il backend è integrato tramite Next.js API Routes — un solo `npm run dev` avvia tutto.

---

## Prerequisiti — Versione Node.js

**Node.js 20 LTS è richiesto** (Next.js 15 non supporta Node.js 19.0.x).

Verifica la tua versione:
```bash
node --version   # deve essere >=20.0.0
```

### Come aggiornare Node.js su Windows

**Opzione A — Download diretto (più semplice):**
1. Scarica Node.js 20 LTS da [nodejs.org](https://nodejs.org/)
2. Esegui l'installer (sostituisce automaticamente la versione esistente)
3. Riapri il terminale e verifica: `node --version`

**Opzione B — nvm-windows (per gestire più versioni):**
```bash
# Installa nvm-windows da: https://github.com/coreybutler/nvm-windows
nvm install 20
nvm use 20
node --version  # deve mostrare v20.x.x
```

---

## Installazione su Windows — Passo per Passo

### 1. Installa PostgreSQL

Scarica da [postgresql.org](https://www.postgresql.org/download/windows/) e installa. Ricorda la password di `postgres`.

### 2. Crea il database

```bash
# In psql o pgAdmin esegui:
CREATE DATABASE metalmontaggi;
```

### 3. Configura l'ambiente

```bash
copy .env.local.example .env.local
```

Modifica `.env.local`:
```env
DATABASE_URL="postgresql://postgres:TUA_PASSWORD@localhost:5432/metalmontaggi"
JWT_SECRET="stringa-lunga-e-casuale"
```

Genera un JWT_SECRET sicuro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Installa dipendenze e setup database

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Avvia

```bash
npm run dev
```

Sito su: **http://localhost:3000**

---

## Credenziali Admin

| Campo | Valore |
|---|---|
| URL | http://localhost:3000/admin/login |
| Email | `admin@metalmontaggi.it` |
| Password | `admin123` |

---

## URL Principali

| Pagina | URL |
|---|---|
| Home | `/` |
| Chi Siamo | `/chi-siamo` |
| Servizi | `/servizi` |
| Galleria | `/galleria` |
| Contatti | `/contatti` |
| Admin | `/admin/dashboard` |

---

## Comandi Utili

```bash
npm run dev          # Avvia dev server
npm run build        # Build produzione
npm run db:migrate   # Crea/aggiorna tabelle DB
npm run db:seed      # Inserisce dati di esempio
npx prisma studio    # GUI per il database (porta 5555)
```

---

## Personalizzazioni

1. Telefono/email/indirizzo → `components/Footer.tsx` e `app/(public)/contatti/page.tsx`
2. Foto reali → pannello admin `/admin/galleria`
3. Mappa → sostituisci il placeholder in `contatti/page.tsx`
4. Colore accento → cerca `orange-500` in `globals.css`

---

## First run (default Next.js instructions)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
