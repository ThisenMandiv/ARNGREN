import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const EditAd = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
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
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (categories.length === 0) return;

    // Load ad data after categories are loaded
    const loadAdData = async () => {
      try {
        const res = await api.get(`/ads/${id}`);
        const ad = res.data;
        
        if (ad.user !== user?._id) {
          alert('You can only edit your own ads!');
          navigate('/my-ads');
          return;
        }

        setForm({
          title: ad.title || '',
          description: ad.description || '',
          price: ad.price || '',
          location: ad.location || '',
          contactInfo: ad.contactInfo || '',
        });

        // Set main and subcategory
        const foundMain = ad.category && ad.category.trim() 
          ? categories.find(cat => (cat.subcategories || []).includes(ad.category)) 
          : null;
        
        setMainCategory(foundMain ? foundMain.name : '');
        setSubCategory(ad.category || '');
        setExistingImages(ad.images || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading ad:', err);
        alert('Error loading ad: ' + (err.response?.data?.error || err.message));
        navigate('/my-ads');
      }
    };

    loadAdData();
  }, [id, user?._id, navigate, categories]);

  const reloadAdData = async () => {
    try {
      const res = await api.get(`/ads/${id}`);
      const ad = res.data;
      
      setForm({
        title: ad.title || '',
        description: ad.description || '',
        price: ad.price || '',
        location: ad.location || '',
        contactInfo: ad.contactInfo || '',
      });

      const foundMain = ad.category && ad.category.trim() 
        ? categories.find(cat => (cat.subcategories || []).includes(ad.category)) 
        : null;
      
      setMainCategory(foundMain ? foundMain.name : '');
      setSubCategory(ad.category || '');
      setExistingImages(ad.images || []);
    } catch (err) {
      console.error('Error reloading ad data:', err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMainCategoryChange = e => {
    setMainCategory(e.target.value);
    setSubCategory('');
  };

  const handleSubCategoryChange = e => {
    setSubCategory(e.target.value);
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
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
    setMessage('');

    try {
      const formData = new FormData();
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });
      
      // Add user ID and category
      formData.append('user', user._id);
      formData.append('category', subCategory);
      
      // Add new images
      images.forEach(image => {
        formData.append('images', image);
      });
      
      // FIXED: Add each existing image as its own field instead of JSON string
      existingImages.forEach(img => {
        formData.append('existingImages', img);
      });

      await api.put(`/ads/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Ad updated successfully!');
      
      // Reload the ad data to show updated images
      await reloadAdData();
      
      // Clear the new images selection
      setImages([]);
      
      // Reset the file input
      const fileInput = document.getElementById('image-input');
      if (fileInput) {
        fileInput.value = '';
      }

      // Navigate back after a short delay to show success message
      setTimeout(() => {
        navigate('/my-ads');
      }, 1500);

    } catch (err) {
      console.error('Error updating ad:', err);
      setMessage(err.response?.data?.error || 'Failed to update ad');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      padding: '30px', 
      background: 'white', 
      borderRadius: '10px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)' 
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Edit Ad</h1>
      
      {message && (
        <div style={{ 
          color: message.includes('success') ? 'green' : 'red', 
          marginBottom: '16px',
          padding: '10px',
          border: `1px solid ${message.includes('success') ? 'green' : 'red'}`,
          borderRadius: '4px',
          backgroundColor: message.includes('success') ? '#f0f8f0' : '#fdf0f0'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Main Category *
          </label>
          <select
            value={mainCategory}
            onChange={handleMainCategoryChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="">Select main category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Subcategory *
          </label>
          <select
            value={subCategory}
            onChange={handleSubCategoryChange}
            required
            disabled={!mainCategory}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              opacity: !mainCategory ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            <option value="">{mainCategory ? 'Select subcategory' : 'Select main category first'}</option>
            {mainCategory && categories.find(cat => cat.name === mainCategory)?.subcategories?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

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
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
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
            rows={4}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
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
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
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
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
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
                    alt={`Current image ${index + 1}`}
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover', 
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
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
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          {images.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                Selected files:
              </p>
              {images.map((file, index) => (
                <div key={index} style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Ad'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/my-ads')}
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px'
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