'use client';

import { useState, useEffect, useCallback } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [last7Days, setLast7Days] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') : '';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/stats?secret=${secret}`);
      const data = await res.json();
      setStats(data.stats);
      setRecentArticles(data.recentArticles || []);
      setLast7Days(data.last7Days || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [secret]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const triggerCron = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/cron?secret=${secret}`);
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.processed} artigos processados! Total hoje: ${data.total}`);
        fetchStats();
      } else {
        showToast(data.message || 'Nenhum artigo processado', 'error');
      }
    } catch (err) {
      showToast('Erro ao processar: ' + err.message, 'error');
    }
    setProcessing(false);
  };

  const seedFeeds = async () => {
    try {
      const res = await fetch(`/api/feeds?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed' }),
      });
      const data = await res.json();
      showToast(`✅ ${data.added} feeds adicionados!`);
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1 className="admin-page-title">📊 Dashboard</h1>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <div className="loading-skeleton" style={{ width: '60%', height: '14px', marginBottom: '12px' }} />
              <div className="loading-skeleton" style={{ width: '40%', height: '32px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxArticles = Math.max(...last7Days.map((d) => d.articlesCount), 1);

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-page-title">📊 Dashboard</h1>
        <div className="admin-toolbar-actions">
          <button className="admin-btn admin-btn-sm admin-btn-outline" onClick={seedFeeds}>
            🌱 Popular Feeds Padrão
          </button>
          <button
            className="admin-btn admin-btn-sm"
            onClick={triggerCron}
            disabled={processing}
          >
            {processing ? '⏳ Processando...' : '🚀 Processar Agora'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total de Artigos</div>
          <div className="stat-card-value">{stats?.totalArticles || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Publicados Hoje</div>
          <div className="stat-card-value" style={{ color: 'var(--green)' }}>
            {stats?.todayArticles || 0}
          </div>
          <div className="stat-card-sub">Limite: 50/dia</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total de Feeds</div>
          <div className="stat-card-value">{stats?.totalFeeds || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Feeds Ativos</div>
          <div className="stat-card-value" style={{ color: 'var(--accent)' }}>
            {stats?.activeFeeds || 0}
          </div>
        </div>
      </div>

      {/* Chart */}
      {last7Days.length > 0 && (
        <div className="chart-card">
          <div className="chart-title">Artigos nos Últimos 7 Dias</div>
          <div className="chart-bars">
            {last7Days.reverse().map((day) => (
              <div key={day.date} className="chart-bar-wrap">
                <div className="chart-bar-value">{day.articlesCount}</div>
                <div
                  className="chart-bar"
                  style={{ height: `${(day.articlesCount / maxArticles) * 100}%` }}
                />
                <div className="chart-bar-label">
                  {new Date(day.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Articles */}
      <div className="admin-table-wrap">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Últimos Artigos</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Fonte</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {recentArticles.map((article) => (
              <tr key={article.id}>
                <td className="title-cell">{article.title}</td>
                <td>{article.category}</td>
                <td>{article.sourceName}</td>
                <td>
                  <span className={`status-badge ${article.isPublished ? 'active' : 'inactive'}`}>
                    {article.isPublished ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td>{new Date(article.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
            {recentArticles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Nenhum artigo ainda. Clique em &quot;Processar Agora&quot; para iniciar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
