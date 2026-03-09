import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCategoryBySlug, formatDate } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArticleCardHorizontal } from '@/components/ArticleCard';
import AdBanner from '@/components/AdBanner';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) return { title: 'Artigo não encontrado' };
    return {
      title: `${article.title} | NewsFlow`,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        images: article.imageUrl ? [article.imageUrl] : [],
        type: 'article',
      },
    };
  } catch {
    return { title: 'NewsFlow' };
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  let article;
  try {
    article = await prisma.article.findUnique({ where: { slug } });
  } catch {
    notFound();
  }

  if (!article) notFound();

  const cat = getCategoryBySlug(article.category);

  let related = [];
  try {
    related = await prisma.article.findMany({
      where: { category: article.category, id: { not: article.id }, isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    });
  } catch {}

  const paragraphs = article.content.split(/\n\n|\n/).filter((p) => p.trim().length > 0);

  return (
    <>
      <Header />
      <article className="article-page">
        <div className="article-breadcrumb">
          <Link href="/">Início</Link> › <Link href={`/categoria/${article.category}`}>{cat.name}</Link> › Artigo
        </div>

        <div className="article-page-header">
          <Link href={`/categoria/${article.category}`}
            className="article-page-category" style={{ background: cat.color }}>
            {cat.icon} {cat.name}
          </Link>
          <h1 className="article-page-title">{article.title}</h1>
          <p className="article-page-summary">{article.summary}</p>
          <div className="article-page-meta">
            <span>📰 NewsFlow</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="article-page-image" />
        )}

        <AdBanner position="article-top" />

        <div className="article-page-content">
          {paragraphs.map((p, i) => (
            <p key={i}>{p.trim()}</p>
          ))}
        </div>

        <AdBanner position="article-bottom" />

        {related.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <div className="section-header">
              <h2 className="section-title"><span className="title-dot"></span>Notícias Relacionadas</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {related.map((r) => (
                <ArticleCardHorizontal key={r.id} article={r} />
              ))}
            </div>
          </section>
        )}
      </article>
      <Footer />
    </>
  );
}
