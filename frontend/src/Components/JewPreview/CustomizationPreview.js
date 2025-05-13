import React from 'react';
import './CustomizationPreview.css';

const BACKEND_URL = "http://localhost:5000";

const CustomizationPreview = ({ selectedProduct, formData }) => {
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
    const basePrice = selectedProduct?.price || 0;
    const materialMultiplier = materialMultipliers[formData?.customizationOptions?.metalType] || 1;
    const gemAddition = gemAdditions[formData?.customizationOptions?.gemType] || 0;
    return (basePrice * materialMultiplier) + gemAddition;
  };

  const getImageSrc = () => {
    if (selectedProduct.image) return selectedProduct.image;
    if (selectedProduct.imageUrl) {
      if (selectedProduct.imageUrl.startsWith('http')) return selectedProduct.imageUrl;
      return `${BACKEND_URL}${selectedProduct.imageUrl}`;
    }
    return '/default-product-image.jpg';
  };

  if (!selectedProduct) {
    return (
      <div className="preview-container">
        <h3 className="preview-title">Preview</h3>
        <div className="preview-placeholder">
          <p>Select a product to customize</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <h3 className="preview-title">Preview</h3>
      <div className="preview-image">
        <img src={getImageSrc()} alt={selectedProduct.name} />
      </div>

      <div className="preview-details">
        <div className="preview-row">
          <span className="label">Product:</span>
          <span className="value">{selectedProduct.name}</span>
        </div>

        <div className="preview-row">
          <span className="label">Metal Type:</span>
          <span className="value">{formData?.customizationOptions?.metalType || 'Not selected'}</span>
        </div>

        <div className="preview-row">
          <span className="label">Gem Type:</span>
          <span className="value">{formData?.customizationOptions?.gemType || 'None'}</span>
        </div>

        <div className="preview-row">
          <span className="label">Size:</span>
          <span className="value">{formData?.customizationOptions?.size || 'Not specified'}</span>
        </div>

        {formData?.customizationOptions?.engraving && (
          <div className="preview-row">
            <span className="label">Engraving:</span>
            <span className="value">{formData.customizationOptions.engraving}</span>
          </div>
        )}

        <div className="price-summary">
          <div className="preview-row">
            <span className="label">Base Price:</span>
            <span className="value">${selectedProduct.price.toFixed(2)}</span>
          </div>
          <div className="preview-row total">
            <span className="label">Total Price:</span>
            <span className="value">${calculatePrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPreview;
