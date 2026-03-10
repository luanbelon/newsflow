import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchFeed, createHash } from '@/lib/rss';
import { rewriteArticle } from '@/lib/ai';
import { slugify } from '@/lib/utils';

export const maxDuration = 60;

export async function GET(request) {
  // 1. Verificação de Segurança via Header (Padrão Vercel)
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Não autorizado' }, 
      { status: 401 }
    );
  }

  try {
    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    let dailyStat = await prisma.dailyStat.findUnique({ where: { date: today } });

    if (!dailyStat) {
      dailyStat = await prisma.dailyStat.create({ data: { date: today, articlesCount: 0 } });
    }

    if (dailyStat.articlesCount >= 50) {
      return NextResponse.json({ 
        message: 'Limite diário de 50 artigos atingido', 
        count: dailyStat.articlesCount 
      });
    }

    const remaining = 50 - dailyStat.articlesCount;
    const batchSize = Math.min(remaining, 5); // Process up to 5 per invocation

    // Get active feeds
    const feeds = await prisma.feed.findMany({ where: { isActive: true } });

    if (feeds.length === 0) {
      return NextResponse.json({ message: 'Nenhum feed ativo encontrado' });
    }

    let processed = 0;
    const results = [];

    // Rotate through feeds - pick one feed at a time based on least recently fetched
    const sortedFeeds = feeds.sort((a, b) => {
      if (!a.lastFetched) return -1;
      if (!b.lastFetched) return 1;
      return new Date(a.lastFetched) - new Date(b.lastFetched);
    });

    for (const feed of sortedFeeds) {
      if (processed >= batchSize) break;

      const items = await fetchFeed(feed.url);

      for (const item of items) {
        if (processed >= batchSize) break;

        const hash = createHash(item.link);

        // Check if already exists
        const exists = await prisma.article.findUnique({ where: { sourceHash: hash } });
        if (exists) continue;

        // Skip items with too little content
        if (!item.title || item.title.length < 10) continue;
        if (!item.content || item.content.length < 50) continue;

        // Rewrite with AI
        const rewritten = await rewriteArticle(item.title, item.content);

        const slug = slugify(rewritten.title) + '-' + Date.now().toString(36);

        try {
          const article = await prisma.article.create({
            data: {
              title: rewritten.title,
              slug,
              content: rewritten.content,
              summary: rewritten.summary,
              imageUrl: item.imageUrl,
              sourceUrl: item.link,
              sourceName: feed.name,
              category: feed.category,
              sourceHash: hash,
              publishedAt: new Date(item.pubDate),
            },
          });

          results.push({ id: article.id, title: article.title, category: article.category });
          processed++;
        } catch (err) {
          console.error('Erro ao salvar artigo:', err.message);
          continue;
        }
      }

      // Update lastFetched
      await prisma.feed.update({
        where: { id: feed.id },
        data: { lastFetched: new Date() },
      });
    }

    // Update daily count
    await prisma.dailyStat.update({
      where: { date: today },
      data: { articlesCount: dailyStat.articlesCount + processed },
    });

    return NextResponse.json({
      success: true,
      processed,
      total: dailyStat.articlesCount + processed,
      articles: results,
    });
  } catch (error) {
    console.error('Erro no cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}