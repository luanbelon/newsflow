import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ message: 'Artigo excluído' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const article = await prisma.article.update({
      where: { id: body.id },
      data: {
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
        ...(body.title && { title: body.title }),
        ...(body.category && { category: body.category }),
      },
    });
    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
