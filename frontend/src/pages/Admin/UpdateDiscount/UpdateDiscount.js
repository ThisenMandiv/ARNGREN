import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDiscounts } from '../../../services/discountService';
import UpdateDiscountForm from '../../../Components/discounts/UpdateDiscountForm';
import './UpdateDiscount.css';

const UpdateDiscount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        setLoading(true);
        const discounts = await getDiscounts();
        const foundDiscount = discounts.find(d => d._id === id);
        
        if (!foundDiscount) {
          setError('Discount not found');
          return;
        }
        
        setDiscount(foundDiscount);
      } catch (err) {
        setError(err.message || 'Failed to load discount');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [id]);

  const handleUpdateSuccess = () => {
    navigate('/admin/discounts');
  };

  if (loading) {
    return (
      <div className="update-discount-container">
        <div className="loading-message">Loading discount details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="update-discount-container">
        <div className="error-message">{error}</div>
        <button 
          className="back-button"
          onClick={() => navigate('/admin/discounts')}
        >
          Back to Discounts
        </button>
      </div>
    );
  }

  return (
    <div className="update-discount-container">
      <h1 className="update-discount-title">Update Discount</h1>
      <UpdateDiscountForm 
        initialValues={discount}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default UpdateDiscount; 