import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

const UserAds = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    axios.get(`${API_BASE_URL}/ads`)
      .then(res => {
        console.log('UserAds - All ads received:', res.data);
        const userAds = res.data.filter(ad => ad.user === user?._id);
        console.log('UserAds - Filtered user ads:', userAds);
        setAds(userAds);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching ads:', err);
        setLoading(false);
      });
  }, [isLoggedIn, navigate, user]);

  const getImageUrl = (imagePath) => {
    if (imagePath) {
      const fullUrl = `http://localhost:5000${imagePath}`;
      console.log('UserAds - Image URL:', fullUrl);
      return fullUrl;
    }
    return null;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await axios.delete(`${API_BASE_URL}/ads/${id}`, { 
          data: { user: user?._id } 
        });
        setAds(ads.filter(ad => ad._id !== id));
        alert('Ad deleted successfully!');
      } catch (err) {
        console.error('Error deleting ad:', err);
        alert('Error deleting ad: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleEdit = (ad) => {
    // Navigate to edit page with ad data
    navigate(`/edit-ad/${ad._id}`, { 
      state: { ad: ad } 
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Ads</h1>
      {ads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <p>You haven't posted any ads yet.</p>
          <button 
            onClick={() => navigate('/post-ad')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Post Your First Ad
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {ads.map(ad => (
            <div key={ad._id} style={{ 
              border: '1px solid #ccc', 
              padding: 8, 
              width: '200px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#007bff' }}>{ad.title}</h3>
              
              {/* Display first image if available */}
              {ad.images && ad.images.length > 0 ? (
                <div style={{ marginBottom: '8px' }}>
                  <img 
                    src={getImageUrl(ad.images[0])} 
                    alt={ad.title}
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      console.error('UserAds - Image failed to load:', getImageUrl(ad.images[0]));
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('UserAds - Image loaded successfully:', getImageUrl(ad.images[0]))}
                  />
                </div>
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '120px', 
                  backgroundColor: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  color: '#6c757d',
                  fontSize: '12px',
                  marginBottom: '8px'
                }}>
                  No Image
                </div>
              )}
              
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                {ad.category}
              </div>
              <div style={{ fontWeight: 'bold', color: '#28a745', marginBottom: '8px' }}>
                {ad.price ? `Rs. ${ad.price}` : 'Contact for price'}
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleEdit(ad)}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ad._id)}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAds; 