import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const AdList = () => {
  const { category: routeCategory } = useParams();
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(routeCategory || '');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  // Fetch categories for filter dropdown
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Fetch ads with filters
  useEffect(() => {
    setLoading(true);
    setError('');
    let url = '/ads?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (priceMin) url += `priceMin=${encodeURIComponent(priceMin)}&`;
    if (priceMax) url += `priceMax=${encodeURIComponent(priceMax)}&`;
    api.get(url)
      .then(res => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load ads.');
        setLoading(false);
      });
  }, [category, search, priceMin, priceMax, routeCategory]);

  // Keep filter in sync with route param
  useEffect(() => {
    setCategory(routeCategory || '');
  }, [routeCategory]);

  const getImageUrl = (imagePath) => imagePath ? `http://localhost:5000${imagePath}` : null;

  return (
    <div>
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
          {category ? `${category} Ads` : 'All Ads'}
        </h1>
        <p style={{ margin: '0', color: '#666' }}>
          {ads.length} {ads.length === 1 ? 'ad' : 'ads'} found
          {category && ` in ${category} category`}
        </p>
        {/* Search and Filter UI */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Search ads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '2', minWidth: '180px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ flex: '1', minWidth: '140px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            style={{ flex: '1', minWidth: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            min="0"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            style={{ flex: '1', minWidth: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            min="0"
          />
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>Loading...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#dc3545' }}>{error}</div>
      ) : ads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e9ecef' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {category ? `No ${category} ads found` : 'No ads found'}
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#666' }}>
            {category
              ? `There are currently no ads in the ${category} category.`
              : 'There are currently no ads available.'
            }
          </p>
          <Link
            to="/post-ad"
            style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}
          >
            Post an Ad
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {ads.map(ad => (
            <Link
              key={ad._id}
              to={`/ads/${ad._id}`}
              style={{
                display: 'block',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #e9ecef',
                transition: 'box-shadow 0.2s',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {ad.images && ad.images.length > 0 && (
                <img
                  src={getImageUrl(ad.images[0])}
                  alt={ad.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                />
              )}
              <div style={{ padding: '16px' }}>
                <h2 style={{ fontSize: '1.2em', margin: '0 0 8px 0', color: '#222' }}>{ad.title}</h2>
                <div style={{ color: '#666', fontSize: '0.95em', marginBottom: '8px' }}>{ad.category}</div>
                <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.1em', marginBottom: '8px' }}>
                  {ad.price ? `Rs. ${ad.price.toLocaleString()}` : 'Contact for price'}
                </div>
                <div style={{ color: '#888', fontSize: '0.95em', marginBottom: '8px' }}>
                  {ad.description.length > 60 ? ad.description.substring(0, 60) + '...' : ad.description}
                </div>
                <div style={{ color: '#aaa', fontSize: '0.85em' }}>
                  {ad.location || 'No location'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdList; 