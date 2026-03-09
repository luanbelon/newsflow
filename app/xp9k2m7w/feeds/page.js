'use client';

import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from '@/lib/utils';

export default function FeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editFeed, setEditFeed] = useState(null);
  const [form, setForm] = useState({ name: '', url: '', category: 'brasil' });
  const [toast, setToast] = useState(null);

  const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') : '';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchFeeds = useCallback(async () => {
    try {
      const res = await fetch(`/api/feeds?secret=${secret}`);
      const data = await res.json();
      setFeeds(data.feeds || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [secret]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editFeed) {
        await fetch(`/api/feeds?secret=${secret}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editFeed.id, ...form }),
        });
        showToast('Feed atualizado!');
      } else {
        await fetch(`/api/feeds?secret=${secret}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        showToast('Feed adicionado!');
      }
      setShowModal(false);
      setEditFeed(null);
      setForm({ name: '', url: '', category: 'brasil' });
      fetchFeeds();
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  const toggleFeed = async (feed) => {
    try {
      await fetch(`/api/feeds?secret=${secret}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feed.id, isActive: !feed.isActive }),
      });
      fetchFeeds();
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  const deleteFeed = async (id) => {
    if (!confirm('Tem certeza que deseja remover este feed?')) return;
    try {
      await fetch(`/api/feeds?secret=${secret}&id=${id}`, { method: 'DELETE' });
      showToast('Feed removido!');
      fetchFeeds();
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  const openEdit = (feed) => {
    setEditFeed(feed);
    setForm({ name: feed.name, url: feed.url, category: feed.category });
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-page-title">📡 Gerenciar Feeds RSS</h1>
        <button
          className="admin-btn admin-btn-sm"
          onClick={() => {
            setEditFeed(null);
            setForm({ name: '', url: '', category: 'brasil' });
            setShowModal(true);
          }}
        >
          + Adicionar Feed
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>URL</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Último Fetch</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Carregando...</td></tr>
            ) : feeds.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Nenhum feed cadastrado. Adicione feeds ou use o botão &quot;Popular Feeds Padrão&quot; no Dashboard.
                </td>
              </tr>
            ) : (
              feeds.map((feed) => (
                <tr key={feed.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{feed.name}</td>
                  <td className="title-cell" title={feed.url}>{feed.url}</td>
                  <td>{feed.category}</td>
                  <td>
                    <span
                      className={`status-badge ${feed.isActive ? 'active' : 'inactive'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleFeed(feed)}
                    >
                      {feed.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    {feed.lastFetched
                      ? new Date(feed.lastFetched).toLocaleString('pt-BR')
                      : 'Nunca'
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-outline"
                        onClick={() => openEdit(feed)}
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deleteFeed(feed.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h2 className="modal-title">{editFeed ? 'Editar Feed' : 'Novo Feed'}</h2>
            <div className="form-group">
              <label className="form-label">Nome do Feed</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Ex: G1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">URL do RSS</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://exemplo.com/feed.xml"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="admin-btn admin-btn-sm admin-btn-outline" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn admin-btn-sm">
                {editFeed ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
