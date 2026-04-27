import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const admin = searchParams.get('admin');

  const user = admin ? await getAuthUser() : null;
  if (admin && !user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  const where = admin
    ? category ? { category } : {}
    : { active: true, ...(category ? { category } : {}) };

  const items = await prisma.galleryItem.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const formData = await request.formData();
  const title = formData.get('title') as string | null;
  const category = formData.get('category') as string;
  const image = formData.get('image') as File | null;

  if (!category) return NextResponse.json({ error: 'Categoria richiesta' }, { status: 400 });
  if (!image || image.size === 0) return NextResponse.json({ error: 'Immagine richiesta' }, { status: 400 });

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = image.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const item = await prisma.galleryItem.create({
    data: { title: title || null, imageUrl: `/uploads/${filename}`, category },
  });

  return NextResponse.json(item, { status: 201 });
}
