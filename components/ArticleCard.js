import Link from 'next/link';
import { getCategoryBySlug, timeAgo } from '@/lib/utils';

export function ArticleCard({ article }) {
  const cat = getCategoryBySlug(article.category);

  return (
    <Link href={`/noticia/${article.slug}`} className="article-card">
      <div className="article-card-image-wrap">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="article-card-image" loading="lazy" />
        ) : (
          <div className="article-card-image-placeholder">{cat.icon}</div> 
        )}
        <span className="article-card-badge" style={{ background: cat.color }}>{cat.name}</span>
      </div>
      <div className="article-card-body">
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-summary">{article.summary}</p>
        <div className="article-card-footer">
          <span className="article-card-category-tag">{cat.icon} {cat.name}</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCardHorizontal({ article }) {
  const cat = getCategoryBySlug(article.category);

  return (
    <Link href={`/noticia/${article.slug}`} className="article-card-h">
      <div className="article-card-image-wrap">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="article-card-image" loading="lazy" />
        ) : (
          <div className="article-card-image-placeholder">{cat.icon}</div>
        )}
      </div>
      <div className="article-card-body">
        <h3 className="article-card-title">{article.title}</h3>
        <div className="article-card-footer">
          <span className="article-card-category-tag">{cat.icon} {cat.name}</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ArticleListItem({ article, index }) {
  return (
    <Link href={`/noticia/${article.slug}`} className="article-list-item">
      <span className="article-list-number">{String(index + 1).padStart(2, '0')}</span>
      <div className="article-list-content">
        <h3 className="article-card-title">{article.title}</h3>
        <div className="article-card-footer">
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
