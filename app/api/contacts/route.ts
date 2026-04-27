import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nome, email e messaggio sono richiesti' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || null, message: message.trim() },
    });

    return NextResponse.json({ message: 'Messaggio inviato con successo', id: contact.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(contacts);
}
