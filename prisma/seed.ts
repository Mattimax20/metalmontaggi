import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const services = [
  {
    title: 'Cancelli su Misura',
    description: 'Realizziamo cancelli in ferro e acciaio su misura, carrabili e pedonali. Design personalizzato per ogni esigenza, con trattamenti anticorrosione di alta qualità che garantiscono lunga durata nel tempo.',
    category: 'fabbro',
    features: ['Design completamente personalizzato', 'Acciaio inox o ferro verniciato', 'Trattamento anticorrosione certificato', 'Installazione inclusa nel prezzo', 'Motorizzazione elettrica opzionale'],
    order: 1,
  },
  {
    title: 'Ringhiere e Parapetti',
    description: 'Scale interne, balconi e terrazze sicuri e belli con le nostre ringhiere artigianali in ferro battuto e acciaio inox. Modelli classici e moderni realizzati su misura per ogni contesto.',
    category: 'fabbro',
    features: ['Ferro battuto o acciaio inox', 'Stile classico o moderno', 'Conformità norme di sicurezza', 'Finitura a scelta del cliente', 'Consegna e posa in opera'],
    order: 2,
  },
  {
    title: 'Inferriate e Grate di Sicurezza',
    description: 'Grate di sicurezza per finestre e porte-finestre. Massima protezione senza rinunciare all\'estetica. Disponibili apribili con chiave o fisse, con diverse lavorazioni decorative.',
    category: 'fabbro',
    features: ['Apertura antipanico di emergenza', 'Serratura di sicurezza a cilindro', 'Diversi stili e lavorazioni', 'Integrazione con impianto antifurto', 'Trattamento antiruggine a caldo'],
    order: 3,
  },
  {
    title: 'Porte in Metallo',
    description: 'Porte blindate e di sicurezza in acciaio per abitazioni e locali commerciali. Eccellente isolamento termico e acustico, elevata resistenza agli agenti atmosferici e ai tentativi di effrazione.',
    category: 'serramenti',
    features: ['Classe sicurezza certificata UNI EN', 'Isolamento termoacustico superiore', 'Personalizzazione colore RAL', 'Serratura multipunto antieffrazione', 'Garanzia 10 anni sul prodotto'],
    order: 4,
  },
  {
    title: 'Finestre e Infissi',
    description: 'Finestre in acciaio e alluminio per un\'estetica industriale e contemporanea. Doppio vetro camera, alta efficienza energetica classe A e durata garantita nel tempo anche in ambienti costieri.',
    category: 'serramenti',
    features: ['Doppio vetro basso emissivo', 'Profili in acciaio o alluminio', 'Risparmio energetico certificato', 'Stile industriale contemporaneo', 'Installazione professionale certificata'],
    order: 5,
  },
  {
    title: 'Installazione e Sostituzione Infissi',
    description: 'Servizio completo di installazione e sostituzione infissi. Dalla rimozione del vecchio serramento allo smaltimento certificato, fino al montaggio del nuovo con garanzia sul lavoro eseguito.',
    category: 'serramenti',
    features: ['Sopralluogo gratuito e preventivo', 'Smaltimento vecchi infissi incluso', 'Installazione a regola d\'arte', 'Garanzia sul lavoro eseguito', 'Intervento rapido e puntuale'],
    order: 6,
  },
  {
    title: 'Scale Metalliche',
    description: 'Scale interne ed esterne in acciaio e ferro, a giorno o con pedate in legno. Progettazione su misura per ogni tipo di spazio con calcolo strutturale e conformità alle normative vigenti.',
    category: 'carpenteria',
    features: ['Progettazione 3D su misura', 'Carpenteria certificata', 'Pedate in acciaio, legno o vetro', 'Conformità norme di sicurezza', 'Finitura verniciatura a scelta'],
    order: 7,
  },
  {
    title: 'Tettoie e Coperture',
    description: 'Tettoie in acciaio per auto, ingressi e spazi esterni. Strutture robuste e durature, personalizzabili nella forma e nel tipo di copertura: policarbonato, lamiera grecata o vetro strutturale.',
    category: 'carpenteria',
    features: ['Struttura portante in acciaio', 'Copertura a scelta del cliente', 'Montaggio in opera incluso', 'Progettazione su misura', 'Resistenza alle intemperie garantita'],
    order: 8,
  },
  {
    title: 'Soppalchi Metallici',
    description: 'Soppalchi in struttura metallica per abitazioni, negozi e capannoni industriali. Soluzione ideale per ottimizzare gli spazi, con calcolo strutturale, pratiche edilizie e pavimentazione inclusi.',
    category: 'carpenteria',
    features: ['Calcolo strutturale professionale', 'Supporto per pratiche edilizie', 'Portata elevata fino a 400 kg/m²', 'Pavimentazione in lamiera o legno', 'Piena conformità normative'],
    order: 9,
  },
];

const galleryItems = [
  { title: 'Cancello Carrabile', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Cancello+Carrabile', category: 'cancelli' },
  { title: 'Cancello Pedonale Design', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Cancello+Design', category: 'cancelli' },
  { title: 'Ringhiera Scala Moderna', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Ringhiera+Scala', category: 'strutture' },
  { title: 'Porta Blindata', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Porta+Blindata', category: 'serramenti' },
  { title: 'Infissi Industriali', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Infissi+Industriali', category: 'serramenti' },
  { title: 'Tettoia in Acciaio', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Tettoia+Acciaio', category: 'strutture' },
  { title: 'Scala a Giorno', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Scala+a+Giorno', category: 'strutture' },
  { title: 'Inferriate Sicurezza', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Inferriate', category: 'cancelli' },
  { title: 'Soppalco Metallico', imageUrl: 'https://placehold.co/800x600/18181b/f97316?text=Soppalco', category: 'strutture' },
];

async function main() {
  console.log('Avvio seed database...');

  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@metalmontaggi.it' } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: { username: 'admin', email: 'admin@metalmontaggi.it', password: hashed },
    });
    console.log('✓ Admin creato');
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({ data: services });
    console.log(`✓ ${services.length} servizi creati`);
  }

  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    await prisma.galleryItem.createMany({ data: galleryItems });
    console.log(`✓ ${galleryItems.length} immagini galleria create`);
  }

  console.log('\n✅ Seed completato!');
  console.log('📧 Admin: admin@metalmontaggi.it');
  console.log('🔑 Password: admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
