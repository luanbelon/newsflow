import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_FEEDS } from '@/lib/utils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const feeds = await prisma.feed.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ feeds });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // If action is "seed", populate with default feeds
    if (body.action === 'seed') {
      let added = 0;
      for (const feed of DEFAULT_FEEDS) {
        try {
          await prisma.feed.create({ data: feed });
          added++;
        } catch (e) {
          // Skip duplicates
        }
      }
      return NextResponse.json({ message: `${added} feeds adicionados`, added });
    }

    // Add a single feed
    const feed = await prisma.feed.create({
      data: {
        name: body.name,
        url: body.url,
        category: body.category,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ feed });
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
    const feed = await prisma.feed.update({
      where: { id: body.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.url && { url: body.url }),
        ...(body.category && { category: body.category }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json({ feed });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.feed.delete({ where: { id } });
    return NextResponse.json({ message: 'Feed removido' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
