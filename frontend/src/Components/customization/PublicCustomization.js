import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CustomizationPreview from '../components/JewPreview/CustomizationPreview'; // Assuming this component is styled separately or will inherit global styles
import './PublicCustomization.css'; // Import the new CSS file

const PublicCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProduct = location.state?.product;

  const [formData, setFormData] = useState({
    customerId: 'guest', // Consider fetching actual customerId if logged in
    baseDesign: '',
    productId: '',
    customizationOptions: {
      metalType: '',
      gemType: '',
      size: '',
      engraving: '',
    },
    specialInstructions: '',
    status: 'Pending',
    priceQuote: '', // This might be dynamically calculated later
    productName: '',
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Initialize formData with selectedProduct details
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prevData) => ({
        ...prevData,
        baseDesign: selectedProduct.name || '',
        productId: selectedProduct.id || selectedProduct._id || '', // Use _id if that's the identifier
        productName: selectedProduct.name || '',
        priceQuote: selectedProduct.price || '',
        customizationOptions: {
          ...prevData.customizationOptions,
          metalType: selectedProduct.material || '',
          size: selectedProduct.size || '',
        },
      }));
    }
  }, [selectedProduct]);


  const metalTypes = [
    'Gold', 'Silver', 'Rose Gold', 'Platinum', 'White Gold', 'Titanium',
  ];
  const gemTypes = [
    'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Topaz', 'Pearl', 'None',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name]; // Clear error for this field on change

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setErrors(newErrors);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.customizationOptions.metalType) {
      newErrors['customizationOptions.metalType'] = 'Metal type is required.';
    }
    if (!formData.customizationOptions.gemType) {
      newErrors['customizationOptions.gemType'] = 'Gem type is required.';
    }
    if (!formData.customizationOptions.size.trim()) {
      newErrors['customizationOptions.size'] = 'Size is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Potentially add final validation here if needed
    // if (!validateStep1()) return; // Or a full form validation

    try {
      const submissionData = {
        ...formData,
        // Ensure product details are correctly passed if not fully in formData
        originalProductId: selectedProduct?._id || selectedProduct?.id,
        originalProductName: selectedProduct?.name,
        originalProductPrice: selectedProduct?.price,
        originalProductImage: selectedProduct?.image,
        // customerId could be dynamic based on auth state
      };

      const response = await axios.post(
        'http://localhost:5000/api/customization', // Ensure this endpoint matches your backend
        submissionData
      );
      navigate('/customization-submitted', {
        state: { customizationId: response.data._id, submittedData: response.data },
      });
    } catch (error) {
      console.error('Error submitting customization:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to submit your customization. Please check your details and try again.',
      });
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(step + 1);
      }
    } else {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step-content">
            <h2 className="form-section-title">
              Design Your {selectedProduct?.name || 'Jewelry'}
            </h2>
            <div className="form-grid">
              {/* Metal Type */}
              <div className="form-field">
                <label htmlFor="metalType" className="form-label">Metal Type</label>
                <select
                  id="metalType"
                  name="customizationOptions.metalType"
                  value={formData.customizationOptions.metalType}
                  onChange={handleChange}
                  className={`form-select ${errors['customizationOptions.metalType'] ? 'input-error' : ''}`}
                >
                  <option value="">Select Metal</option>
                  {metalTypes.map((metal) => (
                    <option key={metal} value={metal}>{metal}</option>
                  ))}
                </select>
                {errors['customizationOptions.metalType'] && <p className="error-text">{errors['customizationOptions.metalType']}</p>}
              </div>

              {/* Gem Type */}
              <div className="form-field">
                <label htmlFor="gemType" className="form-label">Gem Type</label>
                <select
                  id="gemType"
                  name="customizationOptions.gemType"
                  value={formData.customizationOptions.gemType}
                  onChange={handleChange}
                  className={`form-select ${errors['customizationOptions.gemType'] ? 'input-error' : ''}`}
                >
                  <option value="">Select Gem</option>
                  {gemTypes.map((gem) => (
                    <option key={gem} value={gem}>{gem}</option>
                  ))}
                </select>
                {errors['customizationOptions.gemType'] && <p className="error-text">{errors['customizationOptions.gemType']}</p>}
              </div>

              {/* Size */}
              <div className="form-field">
                <label htmlFor="size" className="form-label">Size</label>
                <input
                  id="size"
                  type="text"
                  name="customizationOptions.size"
                  value={formData.customizationOptions.size}
                  onChange={handleChange}
                  placeholder="e.g., 7, Medium, 18cm"
                  className={`form-input ${errors['customizationOptions.size'] ? 'input-error' : ''}`}
                />
                {errors['customizationOptions.size'] && <p className="error-text">{errors['customizationOptions.size']}</p>}
              </div>

              {/* Engraving */}
              <div className="form-field">
                <label htmlFor="engraving" className="form-label">Engraving (Optional)</label>
                <input
                  id="engraving"
                  type="text"
                  name="customizationOptions.engraving"
                  value={formData.customizationOptions.engraving}
                  onChange={handleChange}
                  placeholder="e.g., Forever Yours (max 20 chars)"
                  maxLength="50" // Example limit
                  className="form-input"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="form-field">
              <label htmlFor="specialInstructions" className="form-label">Special Instructions (Optional)</label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional details or requests..."
                className="form-textarea"
              ></textarea>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step-content">
            <h2 className="form-section-title">Review Your Customization</h2>
            <div className="review-summary-box">
              <h3 className="review-summary-subtitle">Order Summary</h3>
              <ul className="review-list">
                <li className="review-list-item">
                  <strong>Product:</strong> <span>{selectedProduct?.name || formData.productName}</span>
                </li>
                <li className="review-list-item">
                  <strong>Base Price:</strong> <span>${selectedProduct?.price.toFixed(2) || parseFloat(formData.priceQuote).toFixed(2)}</span>
                </li>
                <li className="review-list-item">
                  <strong>Metal Type:</strong> <span>{formData.customizationOptions.metalType || 'Not specified'}</span>
                </li>
                <li className="review-list-item">
                  <strong>Gem Type:</strong> <span>{formData.customizationOptions.gemType || 'Not specified'}</span>
                </li>
                <li className="review-list-item">
                  <strong>Size:</strong> <span>{formData.customizationOptions.size || 'Not specified'}</span>
                </li>
                <li className="review-list-item">
                  <strong>Engraving:</strong> <span>{formData.customizationOptions.engraving || 'None'}</span>
                </li>
                {formData.specialInstructions && (
                    <li className="review-list-item review-list-item-block">
                        <strong>Special Instructions:</strong>
                        <span className="review-instructions-text">{formData.specialInstructions}</span>
                    </li>
                )}
              </ul>
            </div>
            <p className="review-note">
              Please review your choices carefully. By submitting, you're requesting a quote for your custom jewelry. Our team will contact you with pricing and further details.
            </p>
            {errors.submit && (
              <p className="error-message-submit">{errors.submit}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="public-customization-page">
      <h1 className="page-main-title">
        Customize {selectedProduct?.name || 'Your Jewelry'}
      </h1>

      <div className="layout-grid-container">
        <div className="form-panel">
          <div className="form-card">
            {selectedProduct && (
              <div className="product-display-section">
                <div className="product-info-flex">
                  <img
                    src={selectedProduct.image || '/placeholder-image.jpg'} // Fallback image
                    alt={selectedProduct.name}
                    className="product-image-custom"
                  />
                  <div className="product-details-custom">
                    <h2 className="product-name-custom">{selectedProduct.name}</h2>
                    <p className="product-meta-custom">
                      Base Price: ${selectedProduct.price?.toFixed(2)}
                    </p>
                    <p className="product-meta-custom">
                      Material: {selectedProduct.material}
                    </p>
                    <p className="product-meta-custom">Size: {selectedProduct.size}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="step-indicator-container">
              {[1, 2].map((i, index, arr) => (
                <div key={i} className={`step-item ${index < arr.length -1 ? 'has-connector' : ''}`}>
                  <div
                    className={`step-circle ${
                      step === i ? 'active' : step > i ? 'completed' : 'pending'
                    }`}
                  >
                    {step > i ? '✓' : i}
                  </div>
                  <p className="step-text">
                    {i === 1 ? 'Design Choices' : 'Review & Submit'}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              <div className="form-navigation">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="button button-secondary"
                  >
                    Back
                  </button>
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="button button-primary"
                    style={{ marginLeft: step === 1 ? 'auto' : undefined }} // Push to right if no "Back" button
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="button button-submit"
                  >
                    Submit Customization Request
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="preview-panel-container">
          {/* This component will need its own styling or inherit global ones */}
          <CustomizationPreview
            selectedProduct={selectedProduct}
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicCustomization;