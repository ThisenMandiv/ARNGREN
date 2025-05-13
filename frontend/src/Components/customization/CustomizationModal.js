import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizationPreview from '../JewPreview/CustomizationPreview';
import './CustomizationModal.css';

const metalTypes = [
  'Gold', 'Silver', 'Rose Gold', 'Platinum', 'White Gold', 'Titanium',
];
const gemTypes = [
  'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Topaz', 'Pearl', 'None',
];
const themeOptions = [
  'Default', 'Classic', 'Modern', 'Minimalist', 'Vintage', 'Nature', 'Romantic', 'Luxury', 'Personalized'
];

const BACKEND_URL = 'http://localhost:5000';

const CustomizationModal = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customizationOptions: {
      metalType: '',
      gemType: '',
      size: '',
      engraving: '',
      theme: 'Default',
    },
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customizationOptions: {
        ...prev.customizationOptions,
        [name]: value,
      },
    }));
  };

  // Calculate price based on selected options
  const materialMultipliers = {
    'Gold': 1.5,
    'Silver': 1,
    'Rose Gold': 1.3,
    'Platinum': 2,
    'White Gold': 1.4,
    'Titanium': 1.2
  };
  const gemAdditions = {
    'Diamond': 1000,
    'Ruby': 800,
    'Sapphire': 750,
    'Emerald': 900,
    'Amethyst': 300,
    'Topaz': 400,
    'Pearl': 200,
    'None': 0
  };
  const calculatePrice = () => {
    const basePrice = product?.price || 0;
    const materialMultiplier = materialMultipliers[formData?.customizationOptions?.metalType] || 1;
    const gemAddition = gemAdditions[formData?.customizationOptions?.gemType] || 0;
    return (basePrice * materialMultiplier) + gemAddition;
  };

  const handleCustomize = async () => {
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const customizationData = {
        productId: product._id || product.id,
        productName: product.name,
        material: formData.customizationOptions.metalType,
        size: formData.customizationOptions.size,
        theme: formData.customizationOptions.theme,
        price: calculatePrice(),
        status: 'Pending',
        userId: user?._id,
        userName: user?.name || user?.username || user?.email || 'User',
        customizationOptions: formData.customizationOptions,
      };
      const res = await fetch(`${BACKEND_URL}/api/customizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customizationData),
      });
      if (!res.ok) throw new Error('Failed to save customization');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/my-customizations');
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to save customization. Please try again.');
    }
  };

  return (
    <div className="customization-modal-overlay">
      <div className="customization-modal pro-modal-layout">
        <div className="customization-form-section">
          <h2>Customize {product?.name}</h2>
          {showSuccess && (
            <div className="customization-success-message">
              🎉 Customization started! Redirecting to My Customizations...
            </div>
          )}
          {error && (
            <div className="customization-error-message">
              {error}
            </div>
          )}
          <div className="customization-options" style={{ opacity: showSuccess ? 0.5 : 1, pointerEvents: showSuccess ? 'none' : 'auto' }}>
            <label>
              Metal Type
              <select name="metalType" value={formData.customizationOptions.metalType} onChange={handleChange}>
                <option value="">Select Metal</option>
                {metalTypes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label>
              Gem Type
              <select name="gemType" value={formData.customizationOptions.gemType} onChange={handleChange}>
                <option value="">Select Gem</option>
                {gemTypes.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label>
              Size
              <input name="size" type="text" value={formData.customizationOptions.size} onChange={handleChange} placeholder="e.g. 7, Medium, 18cm" />
            </label>
            <label>
              Theme/Style
              <select name="theme" value={formData.customizationOptions.theme} onChange={handleChange}>
                {themeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label>
              Engraving (optional)
              <input name="engraving" type="text" value={formData.customizationOptions.engraving} onChange={handleChange} maxLength={50} placeholder="e.g. Forever Yours" />
            </label>
          </div>
          <div className="customization-actions">
            <button className="customize-button" onClick={handleCustomize} disabled={showSuccess}>Customize</button>
            <button className="cancel-button" onClick={onClose} disabled={showSuccess}>Cancel</button>
          </div>
        </div>
        <div className="customization-preview-section">
          <CustomizationPreview selectedProduct={product} formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal; 