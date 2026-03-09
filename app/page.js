import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCategoryBySlug, CATEGORIES } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArticleCard, ArticleCardHorizontal, ArticleListItem } from '@/components/ArticleCard';
import AdBanner from '@/components/AdBanner';

export const revalidate = 300;

const PILL_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #10b981, #34d399)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #14b8a6, #2dd4bf)',
  'linear-gradient(135deg, #8b5cf6, #a855f7)',
  'linear-gradient(135deg, #f97316, #fb923c)',
  'linear-gradient(135deg, #ef4444, #f87171)',
  'linear-gradient(135deg, #22c55e, #4ade80)',
  'linear-gradient(135deg, #06b6d4, #67e8f9)',
  'linear-gradient(135deg, #eab308, #fde047)',
  'linear-gradient(135deg, #64748b, #94a3b8)',
  'linear-gradient(135deg, #d946ef, #e879f9)',
  'linear-gradient(135deg, #f43f5e, #fb7185)',
];

async function getArticles() {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 40,
    });
    return articles;
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  const heroArticles = articles.slice(0, 3);
  const latestArticles = articles.slice(3, 9);
  const trendingArticles = articles.slice(0, 8);

  // Featured row
  const featuredMain = articles[3];
  const featuredList = articles.slice(4, 9);

  // By category
  const techArticles = articles.filter((a) => a.category === 'tecnologia').slice(0, 4);
  const sportsArticles = articles.filter((a) => a.category === 'esportes').slice(0, 4);
  const gamesArticles = articles.filter((a) => a.category === 'games').slice(0, 4);
  const financeArticles = articles.filter((a) => a.category === 'financas').slice(0, 4);

  return (
    <>
      <Header />

      {/* Breaking News Ticker */}
      {articles.length > 0 && (
        <div className="ticker-bar">
          <div className="ticker-label">ÚLTIMAS NOTÍCIAS</div>
          <div className="ticker-content">
            {articles.slice(0, 6).map((a, i) => (
              <span key={a.id} className="ticker-item">
                {a.title}
                {i < 5 && <span className="ticker-separator"> • </span>}
              </span>
            ))}
            {articles.slice(0, 6).map((a, i) => (
              <span key={`dup-${a.id}`} className="ticker-item">
                {a.title}
                {i < 5 && <span className="ticker-separator"> • </span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <main className="main-container">
        {articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📰</div>
            <h2 className="empty-state-text">Nenhuma notícia ainda</h2>
            <p className="empty-state-sub">
              As notícias aparecerão aqui após o primeiro processamento do pipeline.
              Acesse o painel admin para iniciar.
            </p>
          </div>
        ) : (
          <>
            {/* Category Pills */}
            <div className="category-pills">
              {CATEGORIES.slice(0, 8).map((cat, i) => (
                <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="category-pill">
                  <div className="category-pill-bg" style={{ background: PILL_GRADIENTS[i % PILL_GRADIENTS.length] }}>
                    <span className="category-pill-icon">{cat.icon}</span>
                    <span className="category-pill-name">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Hero Section */}
            {heroArticles.length >= 3 && (
              <section className="hero-section">
                <div className="hero-grid">
                  {heroArticles.map((article, index) => {
                    const cat = getCategoryBySlug(article.category);
                    return (
                      <Link key={article.id} href={`/noticia/${article.slug}`}
                        className={`hero-card ${index === 0 ? 'main' : ''}`}>
                        {article.imageUrl ? (
                          <img src={article.imageUrl} alt={article.title} className="hero-card-image" />
                        ) : (
                          <div className="hero-card-image" style={{
                            background: `linear-gradient(135deg, ${cat.color}55, #1a1a2e)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '60px', width: '100%', height: '100%'
                          }}>{cat.icon}</div>
                        )}
                        <div className="hero-card-overlay">
                          <span className="hero-card-category" style={{ background: cat.color }}>{cat.name}</span>
                          <h2 className="hero-card-title">{article.title}</h2>
                          <div className="hero-card-meta">
                            <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Focus Banner */}
            <div className="focus-banner">
              <div className="focus-label">
                <span className="focus-label-badge">FOCO</span>
                Destaques da Redação
              </div>
              <span className="focus-text">📌 Confira as notícias mais relevantes do momento</span>
            </div>

            <div className="content-grid">
              <div>
                {/* Featured Row */}
                {featuredMain && featuredList.length > 0 && (
                  <section style={{ marginBottom: '32px' }}>
                    <div className="section-header">
                      <h2 className="section-title"><span className="title-dot"></span>Destaques</h2>
                    </div>
                    <div className="featured-row">
                      <Link href={`/noticia/${featuredMain.slug}`} className="featured-main">
                        {featuredMain.imageUrl ? (
                          <img src={featuredMain.imageUrl} alt={featuredMain.title} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #334155, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>
                            {getCategoryBySlug(featuredMain.category).icon}
                          </div>
                        )}
                        <div className="hero-card-overlay">
                          <span className="hero-card-category" style={{ background: getCategoryBySlug(featuredMain.category).color }}>
                            {getCategoryBySlug(featuredMain.category).name}
                          </span>
                          <h2 className="hero-card-title">{featuredMain.title}</h2>
                          <div className="hero-card-meta">
                            <span>{new Date(featuredMain.publishedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="featured-list">
                        {featuredList.map((article) => {
                          const cat = getCategoryBySlug(article.category);
                          return (
                            <Link key={article.id} href={`/noticia/${article.slug}`} className="featured-list-item">
                              {article.imageUrl ? (
                                <img src={article.imageUrl} alt={article.title} className="featured-list-thumb" />
                              ) : (
                                <div className="featured-list-thumb-placeholder">{cat.icon}</div>
                              )}
                              <div className="featured-list-body">
                                <div className="featured-list-title">{article.title}</div>
                                <div className="featured-list-meta">{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}

                <AdBanner position="top" />

                {/* Latest */}
                <section>
                  <div className="section-header">
                    <h2 className="section-title"><span className="title-dot"></span>Últimas Notícias</h2>
                  </div>
                  <div className="articles-grid">
                    {latestArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>

                {/* Tech */}
                {techArticles.length > 0 && (
                  <section>
                    <div className="section-header">
                      <h2 className="section-title"><span className="title-dot"></span>Tecnologia</h2>
                      <Link href="/categoria/tecnologia" className="section-link">Ver todas →</Link>
                    </div>
                    <div className="articles-grid-4">
                      {techArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                )}

                <AdBanner position="middle" />

                {/* Sports */}
                {sportsArticles.length > 0 && (
                  <section>
                    <div className="section-header">
                      <h2 className="section-title"><span className="title-dot"></span>Esportes</h2>
                      <Link href="/categoria/esportes" className="section-link">Ver todas →</Link>
                    </div>
                    <div className="articles-grid-4">
                      {sportsArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Games */}
                {gamesArticles.length > 0 && (
                  <section>
                    <div className="section-header">
                      <h2 className="section-title"><span className="title-dot"></span>Games</h2>
                      <Link href="/categoria/games" className="section-link">Ver todas →</Link>
                    </div>
                    <div className="articles-grid-4">
                      {gamesArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Finance */}
                {financeArticles.length > 0 && (
                  <section>
                    <div className="section-header">
                      <h2 className="section-title"><span className="title-dot"></span>Finanças</h2>
                      <Link href="/categoria/financas" className="section-link">Ver todas →</Link>
                    </div>
                    <div className="articles-grid-4">
                      {financeArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <aside className="sidebar">
                <div className="sidebar-widget">
                  <h3 className="sidebar-title">🔥 Mais Lidas</h3>
                  {trendingArticles.slice(0, 5).map((article, index) => (
                    <ArticleListItem key={article.id} article={article} index={index} />
                  ))}
                </div>

                <AdBanner position="sidebar" />

                <div className="sidebar-widget">
                  <h3 className="sidebar-title">📁 Categorias</h3>
                  <ul style={{ listStyle: 'none', marginTop: '4px' }}>
                    {CATEGORIES.map((cat) => (
                      <li key={cat.slug} style={{ marginBottom: '8px' }}>
                        <Link href={`/categoria/${cat.slug}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', transition: '0.2s' }}>
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <AdBanner position="sidebar-bottom" />
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
