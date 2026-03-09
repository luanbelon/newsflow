'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', search: '' });
  const [toast, setToast] = useState(null);

  const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') : '';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
      });
      if (filter.category) params.set('category', filter.category);
      if (filter.search) params.set('search', filter.search);

      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setPagination(data.pagination || { page: 1, total: 0, pages: 0 });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const deleteArticle = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    try {
      await fetch(`/api/admin/articles?secret=${secret}&id=${id}`, { method: 'DELETE' });
      showToast('Artigo excluído!');
      fetchArticles(pagination.page);
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">📝 Gerenciar Artigos</h1>

      {/* Filters */}
      <div className="admin-toolbar">
        <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input
            type="text"
            className="admin-input"
            style={{ marginBottom: 0, maxWidth: '300px' }}
            placeholder="Buscar por título..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            className="form-select"
            style={{ maxWidth: '200px' }}
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">Todas as categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {pagination.total} artigo{pagination.total !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Fonte</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>Carregando...</td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Nenhum artigo encontrado.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="title-cell">
                    <Link
                      href={`/noticia/${article.slug}`}
                      target="_blank"
                      style={{ color: 'var(--accent)' }}
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td>{article.category}</td>
                  <td>{article.sourceName}</td>
                  <td>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => deleteArticle(article.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={pagination.page <= 1}
            onClick={() => fetchArticles(pagination.page - 1)}
          >
            ← Anterior
          </button>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Página {pagination.page} de {pagination.pages}
          </span>
          <button
            className="pagination-btn"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchArticles(pagination.page + 1)}
          >
            Próxima →
          </button>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
