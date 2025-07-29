import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AdDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/ads/${id}`);
        setAd(response.data);
      } catch (err) {
        console.error('Error fetching ad:', err);
        setError(err.response?.data?.error || 'Failed to load ad');
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (imagePath) {
      const fullUrl = `http://localhost:5000${imagePath}`;
      console.log('AdDetail - Image URL:', fullUrl);
      return fullUrl;
    }
    return null;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await axios.delete(`${API_BASE_URL}/ads/${id}`, { 
          data: { user: user?._id } 
        });
        alert('Ad deleted successfully!');
        navigate('/my-ads');
      } catch (err) {
        console.error('Error deleting ad:', err);
        alert('Error deleting ad: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-ad/${id}`, { 
      state: { ad: ad } 
    });
  };

  const nextImage = () => {
    if (ad.images && ad.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === ad.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (ad.images && ad.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? ad.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px', color: '#dc3545' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/ads" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Back to Ads
        </Link>
      </div>
    );
  }

  if (!ad) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2>Ad Not Found</h2>
        <p>The ad you're looking for doesn't exist.</p>
        <Link to="/ads" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Back to Ads
        </Link>
      </div>
    );
  }

  const isOwner = user && ad.user === user._id;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/ads" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Ads
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '30px 30px 20px 30px', borderBottom: '1px solid #e9ecef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '28px' }}>
                {ad.title}
              </h1>
              <div style={{ 
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {ad.category}
              </div>
            </div>
            
            {isOwner && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleEdit}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {ad.price && (
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#28a745' 
              }}>
                Rs. {ad.price.toLocaleString()}
              </div>
            )}
            
            {ad.location && (
              <div style={{ 
                fontSize: '16px', 
                color: '#666',
                display: 'flex',
                alignItems: 'center'
              }}>
                📍 {ad.location}
              </div>
            )}

            <div style={{ 
              fontSize: '14px', 
              color: '#666',
              marginLeft: 'auto'
            }}>
              Posted on {new Date(ad.date).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Images */}
        {ad.images && ad.images.length > 0 && (
          <div style={{ position: 'relative', backgroundColor: '#f8f9fa' }}>
            <div style={{ position: 'relative', height: '400px' }}>
              <img
                src={getImageUrl(ad.images[currentImageIndex])}
                alt={ad.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  console.error('Image failed to load:', getImageUrl(ad.images[currentImageIndex]));
                  e.target.style.display = 'none';
                }}
              />
              
              {ad.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Image thumbnails */}
            {ad.images.length > 1 && (
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                padding: '15px 30px',
                overflowX: 'auto'
              }}>
                {ad.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${ad.title} ${index + 1}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '2px solid #007bff' : '2px solid transparent'
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Description</h3>
            <div style={{ 
              fontSize: '16px', 
              lineHeight: '1.6', 
              color: '#555',
              whiteSpace: 'pre-wrap'
            }}>
              {ad.description}
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Contact Information</h3>
            <div style={{ 
              fontSize: '16px', 
              color: '#555',
              wordBreak: 'break-word'
            }}>
              {ad.contactInfo}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AdDetail; 