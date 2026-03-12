'use client';

import { useState, useEffect, useCallback } from 'react';

export default function AfiliadosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    affiliateUrl: '',
    category: 'geral',
    sourceName: 'Mercado Livre',
  });

  const secret = typeof window !== 'undefined' ? sessionStorage.getItem('admin_secret') : '';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/affiliates?secret=${secret}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [secret]);

  useEffect(() => {
    if (secret) {
      fetchProducts();
    }
  }, [fetchProducts, secret]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editProduct ? 'PUT' : 'POST';
      const body = editProduct ? { id: editProduct.id, ...form } : form;

      const res = await fetch(`/api/admin/affiliates?secret=${secret}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar');
      }

      showToast(editProduct ? 'Produto atualizado!' : 'Produto adicionado!');
      setShowModal(false);
      setEditProduct(null);
      setForm({
        title: '',
        slug: '',
        description: '',
        imageUrl: '',
        affiliateUrl: '',
        category: 'geral',
        sourceName: 'Mercado Livre',
      });
      fetchProducts();
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    try {
      const res = await fetch(`/api/admin/affiliates?secret=${secret}&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao remover');
      }
      showToast('Produto removido!');
      fetchProducts();
    } catch (err) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      affiliateUrl: product.affiliateUrl,
      category: product.category,
      sourceName: product.sourceName || 'Mercado Livre',
    });
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-page-title">🛒 Produtos Afiliados (Mercado Livre)</h1>
        <button
          className="admin-btn admin-btn-sm"
          onClick={() => {
            setEditProduct(null);
            setForm({
              title: '',
              slug: '',
              description: '',
              imageUrl: '',
              affiliateUrl: '',
              category: 'geral',
              sourceName: 'Mercado Livre',
            });
            setShowModal(true);
          }}
        >
          + Adicionar Produto
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Origem</th>
              <th>Link Afiliado</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                  Carregando...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Nenhum produto afiliado cadastrado ainda.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="title-cell">{product.title}</td>
                  <td>{product.category}</td>
                  <td>{product.sourceName}</td>
                  <td className="title-cell" title={product.affiliateUrl}>
                    {product.affiliateUrl}
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-outline"
                        onClick={() => openEdit(product)}
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deleteProduct(product.id)}
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
          <form
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
          >
            <h2 className="modal-title">
              {editProduct ? 'Editar Produto Afiliado' : 'Novo Produto Afiliado'}
            </h2>
            <div className="form-group">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="admin-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL interna, sem espaços)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="ex: playstation-5-mercado-livre"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Link de afiliado do Mercado Livre</label>
              <input
                type="url"
                className="admin-input"
                placeholder="Cole aqui o link com sua etiqueta belonluan750"
                value={form.affiliateUrl}
                onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Imagem (URL opcional)</label>
              <input
                type="url"
                className="admin-input"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Descrição (opcional)</label>
              <textarea
                className="admin-input"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Categoria (texto livre)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="ex: eletronicos, games, casa..."
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-sm admin-btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="admin-btn admin-btn-sm">
                {editProduct ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

