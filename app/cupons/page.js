'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Produtos afiliados do Mercado Livre (substitui Lomadee por enquanto)
// Ajuste / adicione itens conforme necessário.
const ML_PRODUCTS = [
  {
    id: 'ml-1',
    name: 'Exemplo de Produto Mercado Livre',
    description: 'Substitua este exemplo pelos seus produtos reais do Mercado Livre.',
    sourceName: 'Mercado Livre',
    url: 'https://www.mercadolivre.com.br/',
    categories: ['eletronicos'],
  },
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
  const [campaigns] = useState(ML_PRODUCTS);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

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
          
          {/* Conteúdo */}
          {filtered.length === 0 ? (
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
