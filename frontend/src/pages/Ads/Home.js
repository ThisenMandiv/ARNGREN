import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get('/categories')
      .then(res => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load categories');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>ARNGREN</h1>
      <h2>Browse items by category</h2>
      {selectedMain === null ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          padding: '24px 0'
        }}>
          {categories.map((cat, idx) => (
            <button
              key={cat._id}
              onClick={() => setSelectedMain(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <span style={{ marginBottom: '14px', fontSize: 32 }}></span>
              <span style={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedMain(null)} style={{ marginBottom: 20, background: 'none', border: 'none', color: '#118d21', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>&larr; Back to main categories</button>
          <h3 style={{ marginBottom: 16 }}>{categories[selectedMain].name}</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px',
            padding: '10px 0'
          }}>
            {(categories[selectedMain].subcategories || []).map(sub => (
              <button
                key={sub}
                onClick={() => navigate(`/ads/category/${encodeURIComponent(sub)}`)}
                style={{
                  padding: '18px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  color: '#222',
                  fontWeight: 500
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 