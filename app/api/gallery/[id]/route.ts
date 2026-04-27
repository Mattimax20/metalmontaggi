import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id: parseInt(id) } });
  if (!item) return NextResponse.json({ error: 'Elemento non trovato' }, { status: 404 });

  if (item.imageUrl.startsWith('/uploads/')) {
    const filePath = join(process.cwd(), 'public', item.imageUrl);
    if (existsSync(filePath)) await unlink(filePath).catch(() => {});
  }

  await prisma.galleryItem.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ message: 'Immagine eliminata' });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const item = await prisma.galleryItem.update({
    where: { id: parseInt(id) },
    data: { active: body.active },
  });

  return NextResponse.json(item);
}
