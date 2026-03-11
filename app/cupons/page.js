'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const CATEGORY_FILTERS = [
  { label: 'Todos', value: '' },
  { label: 'Moda', value: 'moda' },
  { label: 'Eletrônicos', value: 'eletronicos' },
  { label: 'Casa', value: 'casa' },
  { label: 'Viagens', value: 'viagens' },
  { label: 'Saúde & Beleza', value: 'saude' },
];

function CouponCard({ item }) {
  const [copied, setCopied] = useState(false);

  const code = item.code || item.couponCode || null;
  const name = item.name || item.title || 'Promoção';
  const description = item.description || item.details || '';
  const brand = item.brand?.name || item.store?.name || item.sourceName || '';
  const logo = item.brand?.logo || item.store?.thumbnail || null;
  const url = item.url || item.link || '#';
  const discount = item.discountValue || item.discount || null;
  const discountType = item.discountType || (discount ? '%' : null);
  const endDate = item.period?.endAt || item.validity || null;

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="coupon-card">
      <div className="coupon-left">
        {logo ? (
          <img src={logo} alt={brand} className="coupon-logo" />
        ) : (
          <div className="coupon-logo-placeholder">🏷️</div>
        )}
        {discount && (
          <div className="coupon-discount">
            <span>{discount}{discountType === 'percentage' ? '%' : discountType === 'fixed' ? ' OFF' : '%'}</span>
            <small>desc.</small>
          </div>
        )}
      </div>
      <div className="coupon-body">
        {brand && <span className="coupon-brand">{brand}</span>}
        <h3 className="coupon-name">{name}</h3>
        {description && <p className="coupon-desc">{description.substring(0, 120)}{description.length > 120 ? '...' : ''}</p>}
        {endDate && (
          <span className="coupon-validity">
            📅 Válido até: {new Date(endDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
      <div className="coupon-right">
        {code ? (
          <>
            <button onClick={handleCopy} className={`coupon-code-btn ${copied ? 'copied' : ''}`}>
              {copied ? '✓ Copiado!' : code}
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" className="coupon-use-btn">
              Usar cupom →
            </a>
          </>
        ) : (
          <a href={url} target="_blank" rel="noopener noreferrer" className="coupon-use-btn full">
            Ver oferta →
          </a>
        )}
      </div>
    </div>
  );
}

export default function CuponsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('campaigns');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/lomadee?type=${tab}`)
      .then(r => r.json())
      .then(data => {
        const items = data?.data || data?.campaigns || data?.offers || data?.products || [];
        setCampaigns(Array.isArray(items) ? items : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Não foi possível carregar as promoções agora. Tente novamente.');
        setLoading(false);
      });
  }, [tab]);

  const filtered = campaigns.filter(item => {
    const text = `${item.name || ''} ${item.description || ''} ${item.brand?.name || ''} ${item.store?.name || ''}`.toLowerCase();
    const matchSearch = !search || text.includes(search.toLowerCase());
    const matchFilter = !filter || (item.categories || []).some(c => 
      typeof c === 'string' ? c.toLowerCase().includes(filter) : c?.name?.toLowerCase().includes(filter)
    );
    return matchSearch && matchFilter;
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

          {/* Tabs */}
          <div className="cupons-tabs">
            {[{ key: 'campaigns', label: '🎟️ Campanhas & Cupons' }, { key: 'offers', label: '🔥 Ofertas' }].map(t => (
              <button
                key={t.key}
                className={`cupons-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
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
                <CouponCard key={item.id || i} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
