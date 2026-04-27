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

  const where = admin ? (category ? { category } : {}) : { active: true, ...(category ? { category } : {}) };

  const services = await prisma.service.findMany({
    where,
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const formData = await request.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const featuresRaw = formData.get('features') as string;
  const order = formData.get('order') as string;
  const image = formData.get('image') as File | null;

  if (!title || !description || !category) {
    return NextResponse.json({ error: 'Titolo, descrizione e categoria sono richiesti' }, { status: 400 });
  }

  let imageUrl: string | null = null;
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = image.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const features = featuresRaw ? JSON.parse(featuresRaw) : [];

  const service = await prisma.service.create({
    data: { title, description, category, imageUrl, features, order: order ? parseInt(order) : 0 },
  });

  return NextResponse.json(service, { status: 201 });
}
