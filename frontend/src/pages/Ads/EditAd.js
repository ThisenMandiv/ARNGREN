import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const EditAd = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    contactInfo: '',
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load categories
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));

    // Load ad data
    api.get(`/ads/${id}`)
      .then(res => {
        const ad = res.data;
        console.log('EditAd - Ad data loaded:', ad);
        // Check if user owns this ad
        if (ad.user !== user?._id) {
          alert('You can only edit your own ads!');
          navigate('/my-ads');
          return;
        }
        setForm({
          title: ad.title || '',
          description: ad.description || '',
          price: ad.price || '',
          category: ad.category || '',
          location: ad.location || '',
          contactInfo: ad.contactInfo || '',
        });
        setExistingImages(ad.images || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading ad:', err);
        alert('Error loading ad: ' + (err.response?.data?.error || err.message));
        navigate('/my-ads');
      });
  }, [isLoggedIn, navigate, user, id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    // Check file sizes
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setMessage(`Error: ${oversizedFiles.map(f => f.name).join(', ')} are too large. Maximum file size is 10MB.`);
      return;
    }
    setImages(files);
    setMessage('');
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(existingImages.filter((_, index) => index !== imageIndex));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Add form fields
      Object.keys(form).forEach(key => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });
      // Add user ID
      formData.append('user', user._id);
      // Add new images
      images.forEach(image => {
        formData.append('images', image);
      });
      // Add info about which existing images to keep
      formData.append('existingImages', JSON.stringify(existingImages));
      // Submit update
      await api.put(`/ads/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Ad updated successfully!');
      setTimeout(() => {
        navigate('/my-ads');
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update ad');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Ad</h1>
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Price (optional)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Category *
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Location (optional)
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contact Information *
          </label>
          <input
            type="text"
            name="contactInfo"
            value={form.contactInfo}
            onChange={handleChange}
            required
            placeholder="Phone number or email"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Current Images
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {existingImages.map((imagePath, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={`http://localhost:5000${imagePath}`}
                    alt={`${index + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Add New Images (optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            id="image-input"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {images.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p>Selected files:</p>
              {images.map((file, index) => (
                <div key={index} style={{ fontSize: '12px', color: '#666' }}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Ad'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-ads')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAd; 