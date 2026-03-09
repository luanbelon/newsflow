'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?search=${encodeURIComponent(query)}&limit=20`);
        const data = await res.json();
        setResults(data.articles || []);
        setTotal(data.pagination?.total || 0);
      } catch {
        setResults([]);
      }
      setLoading(false);
      setSearched(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <Header />
      <main className="main-container search-page">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar notícias..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {loading && (
          <div className="articles-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="loading-skeleton loading-card" />
            ))}
          </div>
        )}

        {searched && !loading && (
          <>
            <p className="search-results-count">
              {total} {total === 1 ? 'resultado' : 'resultados'} para &quot;{query}&quot;
            </p>
            {results.length > 0 ? (
              <div className="articles-grid">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h2 className="empty-state-text">Nenhum resultado encontrado</h2>
                <p className="empty-state-sub">Tente buscar com outros termos.</p>
              </div>
            )}
          </>
        )}

        {!searched && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">💡</div>
            <h2 className="empty-state-text">Digite para buscar</h2>
            <p className="empty-state-sub">
              Busque por título ou resumo das notícias. Mínimo 3 caracteres.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
