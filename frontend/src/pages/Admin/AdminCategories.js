import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainForm, setMainForm] = useState({ name: '', editingId: null });
  const [subForm, setSubForm] = useState({ name: '', mainId: null, editingIdx: null, oldName: '' });

  // Fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Main category handlers
  const handleMainSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mainForm.editingId) {
        await api.put(`/categories/${mainForm.editingId}`, { name: mainForm.name });
      } else {
        await api.post('/categories', { name: mainForm.name });
      }
      setMainForm({ name: '', editingId: null });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save main category');
    }
  };
  const handleMainEdit = (cat) => {
    setMainForm({ name: cat.name, editingId: cat._id });
  };
  const handleMainDelete = async (cat) => {
    if (window.confirm('Delete this main category and all its subcategories?')) {
      try {
        await api.delete(`/categories/${cat._id}`);
        fetchCategories();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete main category');
      }
    }
  };

  // Subcategory handlers
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    try {
      if (subForm.editingIdx !== null) {
        await api.put(`/categories/${subForm.mainId}/subcategories`, { oldName: subForm.oldName, newName: subForm.name });
      } else {
        await api.post(`/categories/${subForm.mainId}/subcategories`, { subcategory: subForm.name });
      }
      setSubForm({ name: '', mainId: null, editingIdx: null, oldName: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subcategory');
    }
  };
  const handleSubEdit = (cat, sub, idx) => {
    setSubForm({ name: sub, mainId: cat._id, editingIdx: idx, oldName: sub });
  };
  const handleSubDelete = async (cat, sub) => {
    if (window.confirm('Delete this subcategory?')) {
      try {
        await api.delete(`/categories/${cat._id}/subcategories`, { data: { subcategory: sub } });
        fetchCategories();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete subcategory');
  }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>
        <h1>Manage Categories</h1>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {/* Main Category Form */}
      <form onSubmit={handleMainSubmit} style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text"
          placeholder="Main Category Name"
          value={mainForm.name}
          onChange={e => setMainForm(f => ({ ...f, name: e.target.value }))}
          style={{ flex: 1, fontSize: 16 }}
                required
              />
        <button type="submit" style={{ padding: '8px 18px', background: '#28a745', color: 'white', border: 'none', borderRadius: 5, fontWeight: 600 }}>
          {mainForm.editingId ? 'Update' : 'Add Main Category'}
              </button>
        {mainForm.editingId && (
          <button type="button" onClick={() => setMainForm({ name: '', editingId: null })} style={{ padding: '8px 12px', background: '#ccc', color: '#222', border: 'none', borderRadius: 5 }}>Cancel</button>
        )}
          </form>
      {/* Category Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Main Category</th>
            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Subcategories</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '15px', fontWeight: '500' }}>{cat.name}</td>
                <td style={{ padding: '15px' }}>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(cat.subcategories || []).map((sub, subIdx) => (
                    <li key={sub} style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {sub}
                      <button onClick={() => handleSubEdit(cat, sub, subIdx)} style={{ marginLeft: 8, fontSize: 12, background: '#ffc107', color: '#222', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleSubDelete(cat, sub)} style={{ fontSize: 12, background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Delete</button>
                    </li>
                  ))}
                </ul>
                {/* Subcategory Form */}
                {subForm.mainId === cat._id ? (
                  <form onSubmit={handleSubSubmit} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Subcategory Name"
                      value={subForm.name}
                      onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))}
                      style={{ fontSize: 14 }}
                      required
                    />
                    <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', fontSize: 13 }}>
                      {subForm.editingIdx !== null ? 'Update' : 'Add'}
                    </button>
                    <button type="button" onClick={() => setSubForm({ name: '', mainId: null, editingIdx: null, oldName: '' })} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 4, padding: '2px 10px', fontSize: 13 }}>Cancel</button>
                  </form>
                ) : (
                  <button onClick={() => setSubForm({ name: '', mainId: cat._id, editingIdx: null, oldName: '' })} style={{ marginTop: 8, fontSize: 13, background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}>+ Add Subcategory</button>
                )}
              </td>
              <td style={{ padding: '15px' }}>
                <button onClick={() => handleMainEdit(cat)} style={{ fontSize: 13, background: '#ffc107', color: '#222', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 6, cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleMainDelete(cat)} style={{ fontSize: 13, background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default AdminCategories; 