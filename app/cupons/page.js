'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function ProductCard({ item }) {
  const name = item.title || 'Promoção';
  const description = item.description || '';
  const brand = item.sourceName || 'Mercado Livre';
  const image = item.imageUrl || null;
  const url = item.affiliateUrl || '#';
  const price =
    typeof item.price === 'number'
      ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : null;
  const rating = typeof item.rating === 'number' ? item.rating : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="coupon-card">
      <div className="coupon-left">
        {image ? (
          <img src={image} alt={name} className="coupon-logo" />
        ) : (
          <div className="coupon-logo-placeholder">🏷️</div>
        )}
      </div>
      <div className="coupon-body">
        {brand && <span className="coupon-brand">{brand}</span>}
        <h3 className="coupon-name">{name}</h3>
        {description && (
          <p className="coupon-desc">
            {description.substring(0, 120)}
            {description.length > 120 ? '...' : ''}
          </p>
        )}
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {price && <span style={{ fontWeight: 600 }}>{price}</span>}
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < fullStars) return '★';
              if (i === fullStars && hasHalfStar) return '☆';
              return '☆';
            })}{' '}
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="coupon-right">
        <a href={url} target="_blank" rel="noopener noreferrer" className="coupon-use-btn full">
          Ver promoção →
        </a>
      </div>
    </div>
  );
}

export default function CuponsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/affiliates')
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Não foi possível carregar as promoções agora. Tente novamente.');
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((item) => {
    const text = `${item.title || ''} ${item.description || ''} ${item.category || ''} ${
      item.sourceName || ''
    }`.toLowerCase();
    return !search || text.includes(search.toLowerCase());
  });

  return (
    <>
      <Header />
      <main className="cupons-page">
        <div className="cupons-hero">
          <div className="cupons-hero-content">
            <h1>🏷️ Cupons &amp; Promoções</h1>
            <p>As melhores ofertas e cupons de desconto das principais lojas do Brasil</p>
          </div>
        </div>

        <div className="main-container">
          {/* Search */}
          <div className="cupons-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar cupons, lojas ou categorias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          {/* Conteúdo */}
          {loading ? (
            <div className="cupons-loading">
              <div className="cupons-spinner" />
              <p>Carregando promoções...</p>
            </div>
          ) : error ? (
            <div className="cupons-error">
              <p>😔 {error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏷️</div>
              <h2 className="empty-state-text">Nenhuma promoção encontrada</h2>
              <p className="empty-state-sub">Tente buscar por outro termo ou volte mais tarde.</p>
            </div>
          ) : (
            <div className="cupons-list">
              <p className="cupons-count">{filtered.length} promoções encontradas</p>
              {filtered.map((item, i) => (
                <ProductCard key={item.id || i} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
