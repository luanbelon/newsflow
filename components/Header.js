'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeCategory = pathname.startsWith('/categoria/')
    ? pathname.split('/categoria/')[1]
    : '';

  const mainCategories = CATEGORIES.slice(0, 10);

  return (
    <>
      <header className="header">
        <div className="header-top">
          <Link href="/" className="logo">
            NEWS<span className="logo-accent">FLOW</span>
          </Link>
          <div className="header-ad-space">
            <div className="header-ad-placeholder">Publicidade - 728x90</div>
          </div>
          <div className="header-actions">
            <span className="current-time">{time}</span>
            <Link href="/busca" className="search-toggle">
              🔍 Buscar
            </Link>
          </div>
        </div>
        <nav className="category-nav">
          <ul className="category-list">
            <li>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="hamburger-btn"
                aria-label="Menu"
              >
                <div className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="hamburger-text">MENU</span>
              </button>
            </li>
            <li>
              <Link href="/" className={`category-link ${pathname === '/' ? 'active' : ''}`}>
                Início
              </Link>
            </li>
            {mainCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className={`category-link ${activeCategory === cat.slug ? 'active' : ''}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cupons" className={`category-link ${pathname === '/cupons' ? 'active' : ''}`}>
                <span className="cat-icon">🏷️</span> Cupons e Promoções
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hamburger Slide Menu */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="menu-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <span className="menu-title">Editorias</span>
              <button className="menu-close" onClick={() => setIsMenuOpen(false)}>×</button>
            </div>
            <ul className="menu-list">
              <li>
                <Link href="/" onClick={() => setIsMenuOpen(false)} className={`menu-link ${pathname === '/' ? 'active' : ''}`}>
                  Início
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`menu-link ${activeCategory === cat.slug ? 'active' : ''}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/cupons" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`menu-link ${pathname === '/cupons' ? 'active' : ''}`}
                >
                  🏷️ Cupons e Promoções
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
