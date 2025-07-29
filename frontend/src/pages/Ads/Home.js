import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/categories'),
      api.get('/ads')
    ])
      .then(([catRes, adRes]) => {
        console.log('Home - Categories received:', catRes.data);
        console.log('Home - Ads received:', adRes.data);
        
        setCategories(catRes.data);
        
        // Calculate ad counts for each category
        const counts = {};
        adRes.data.forEach(ad => {
          counts[ad.category] = (counts[ad.category] || 0) + 1;
        });
        setCategoryCounts(counts);
        
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data.');
        setLoading(false);
      });
  }, []);

  // Category icons mapping
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Mobiles': '📱',
      'Property': '🏠',
      'Electronics': '💻',
      'Vehicles': '🚗',
      'Services': '🔧',
      'Home & Garden': '🏡',
      'Business & Industry': '🏭',
      'Jobs': '💼',
      'Hobby, Sport & Kids': '⚽',
      'Animals': '🐕',
      'Fashion & Beauty': '⌚',
      'Education': '🎓'
    };
    return icons[categoryName] || '📦';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>ARNGREN</h1>
      <h2>Browse items by category</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        padding: '20px 0'
      }}>
        {categories.map(cat => (
          <Link 
            key={cat._id} 
            to={`/ads/category/${cat.name}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: '1px solid #e0e0e0'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px'
            }}>
              {getCategoryIcon(cat.name)}
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px',
              marginBottom: '8px',
              textAlign: 'center',
              color: '#333'
            }}>
              {cat.name}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#666',
              textAlign: 'center'
            }}>
              {categoryCounts[cat.name] || 0} ads
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 