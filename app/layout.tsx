import type { Metadata } from 'next';
import LayoutShell from '@/components/LayoutShell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Metal Montaggi - Lavorazioni Metalliche su Misura | Leverano (LE)',
    template: '%s | Metal Montaggi',
  },
  description:
    'Metal Montaggi a Leverano: cancelli, ringhiere, serramenti, carpenteria metallica su misura. Qualità artigianale e precisione da oltre 20 anni.',
  keywords: [
    'fabbro Leverano',
    'serramenti metallo Lecce',
    'carpenteria metallica',
    'cancelli su misura',
    'ringhiere ferro',
    'infissi acciaio',
    'Metal Montaggi',
    'Leverano LE',
  ],
  authors: [{ name: 'Metal Montaggi' }],
  creator: 'Metal Montaggi',
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Metal Montaggi - Lavorazioni Metalliche su Misura',
    description: 'Specialisti in lavorazioni metalliche a Leverano (LE). Cancelli, serramenti, carpenteria su misura.',
    siteName: 'Metal Montaggi',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
