import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCategoryBySlug, CATEGORIES } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  return {
    title: `${cat.name} | NewsFlow`,
    description: `Últimas notícias de ${cat.name}. Fique por dentro de tudo que acontece.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1');
  const limit = 12;

  const cat = getCategoryBySlug(slug);

  if (!CATEGORIES.find((c) => c.slug === slug)) {
    notFound();
  }

  let articles = [];
  let total = 0;

  try {
    [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { category: slug, isPublished: true },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({
        where: { category: slug, isPublished: true },
      }),
    ]);
  } catch {}

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Header />
      <main className="main-container">
        <div className="category-page-header">
          <h1 className="category-page-title">
            <span className="category-page-icon">{cat.icon}</span>
            {cat.name}
          </h1>
          <p className="category-page-count">
            {total} {total === 1 ? 'notícia' : 'notícias'} encontradas
          </p>
        </div>

        <AdBanner position="category-top" />

        {articles.length > 0 ? (
          <>
            <div className="articles-grid">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <Link
                  href={`/categoria/${slug}?page=${page - 1}`}
                  className={`pagination-btn ${page <= 1 ? 'disabled' : ''}`}
                  style={page <= 1 ? { pointerEvents: 'none', opacity: 0.3 } : {}}
                >
                  ← Anterior
                </Link>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <Link
                      key={p}
                      href={`/categoria/${slug}?page=${p}`}
                      className={`pagination-btn ${page === p ? 'active' : ''}`}
                    >
                      {p}
                    </Link>
                  );
                })}
                <Link
                  href={`/categoria/${slug}?page=${page + 1}`}
                  className={`pagination-btn ${page >= totalPages ? 'disabled' : ''}`}
                  style={page >= totalPages ? { pointerEvents: 'none', opacity: 0.3 } : {}}
                >
                  Próxima →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">{cat.icon}</div>
            <h2 className="empty-state-text">Nenhuma notícia em {cat.name}</h2>
            <p className="empty-state-sub">
              Novas notícias serão publicadas em breve.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
