import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalArticles, todayArticles, totalFeeds, activeFeeds, recentArticles, last7Days] = await Promise.all([
      prisma.article.count(),
      prisma.dailyStat.findUnique({ where: { date: today } }),
      prisma.feed.count(),
      prisma.feed.count({ where: { isActive: true } }),
      prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          sourceName: true,
          isPublished: true,
          createdAt: true,
        },
      }),
      prisma.dailyStat.findMany({
        orderBy: { date: 'desc' },
        take: 7,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalArticles,
        todayArticles: todayArticles?.articlesCount || 0,
        totalFeeds,
        activeFeeds,
      },
      recentArticles,
      last7Days,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
