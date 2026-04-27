import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id: parseInt(id) } });
  if (!service) return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.service.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });

  const formData = await request.formData();
  const title = (formData.get('title') as string) || existing.title;
  const description = (formData.get('description') as string) || existing.description;
  const category = (formData.get('category') as string) || existing.category;
  const featuresRaw = formData.get('features') as string | null;
  const order = formData.get('order') as string | null;
  const activeRaw = formData.get('active') as string | null;
  const image = formData.get('image') as File | null;

  let imageUrl = existing.imageUrl;
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = image.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
    if (existing.imageUrl?.startsWith('/uploads/')) {
      const oldPath = join(process.cwd(), 'public', existing.imageUrl);
      if (existsSync(oldPath)) await unlink(oldPath).catch(() => {});
    }
    imageUrl = `/uploads/${filename}`;
  }

  const service = await prisma.service.update({
    where: { id: parseInt(id) },
    data: {
      title,
      description,
      category,
      imageUrl,
      features: featuresRaw ? JSON.parse(featuresRaw) : existing.features,
      order: order !== null ? parseInt(order) : existing.order,
      active: activeRaw !== null ? activeRaw === 'true' : existing.active,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.service.findUnique({ where: { id: parseInt(id) } });
  if (!existing) return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });

  if (existing.imageUrl?.startsWith('/uploads/')) {
    const path = join(process.cwd(), 'public', existing.imageUrl);
    if (existsSync(path)) await unlink(path).catch(() => {});
  }

  await prisma.service.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ message: 'Servizio eliminato' });
}
