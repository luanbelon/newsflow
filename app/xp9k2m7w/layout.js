'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';

const ADMIN_PATH = '/xp9k2m7w';

export default function AdminLayout({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth');
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // We check password client-side against an env var exposed via API
    // For simplicity, we'll use a known password stored in env
    fetch(`/api/admin/stats?secret=${encodeURIComponent(password)}`)
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem('admin_auth', 'true');
          sessionStorage.setItem('admin_secret', password);
          setAuthenticated(true);
          setError('');
        } else {
          setError('Senha incorreta');
        }
      })
      .catch(() => setError('Erro de conexão'));
  };

  if (!authenticated) {
    return (
      <div className="admin-login">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <h1 className="admin-login-title">🔐 Acesso Restrito</h1>
          <p className="admin-login-sub">Digite a senha para continuar</p>
          <input
            type="password"
            className="admin-input"
            placeholder="Senha de acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button type="submit" className="admin-btn">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span className="logo" style={{ fontSize: '20px' }}>News<span>Flow</span></span>
          <nav className="admin-nav">
            <Link
              href={ADMIN_PATH}
              className={`admin-nav-link ${pathname === ADMIN_PATH ? 'active' : ''}`}
            >
              📊 Dashboard
            </Link>
            <Link
              href={`${ADMIN_PATH}/feeds`}
              className={`admin-nav-link ${pathname.includes('/feeds') ? 'active' : ''}`}
            >
              📡 Feeds
            </Link>
            <Link
              href={`${ADMIN_PATH}/artigos`}
              className={`admin-nav-link ${pathname.includes('/artigos') ? 'active' : ''}`}
            >
              📝 Artigos
            </Link>
            <Link
              href={`${ADMIN_PATH}/afiliados`}
              className={`admin-nav-link ${pathname.includes('/afiliados') ? 'active' : ''}`}
            >
              🛒 Afiliados
            </Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" target="_blank" className="admin-btn admin-btn-sm admin-btn-outline">
            🌐 Ver Site
          </Link>
          <button
            className="admin-btn admin-btn-sm admin-btn-outline"
            onClick={() => {
              sessionStorage.removeItem('admin_auth');
              sessionStorage.removeItem('admin_secret');
              setAuthenticated(false);
            }}
          >
            Sair
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
