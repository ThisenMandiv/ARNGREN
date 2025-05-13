// DiscountList.js
import React, { useState, useEffect } from 'react';
import DiscountCard from './DiscountCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './DiscountList.css';

const DiscountList = ({ isUserView = false }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please log in to view discounts');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await axios.get('http://localhost:5000/api/discounts', { headers });
        setDiscounts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching discounts:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to load discounts. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [navigate]);

  const handleDelete = async (discountId) => {
    if (!isUserView) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          Swal.fire('Error', 'Please log in to delete discounts', 'error');
          return;
        }

        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this action!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it',
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          };

          const response = await axios.delete(`http://localhost:5000/api/discounts/${discountId}`, { headers });
          
          if (response.status === 200 || response.status === 204) {
            setDiscounts(currentDiscounts => currentDiscounts.filter(discount => discount._id !== discountId));
            Swal.fire('Deleted!', 'The discount has been successfully deleted.', 'success');
          }
        }
      } catch (err) {
        console.error('Error deleting discount:', err);
        if (err.response?.status === 401) {
          Swal.fire('Error', 'Your session has expired. Please log in again.', 'error');
          navigate('/login');
        } else {
          Swal.fire('Error', 'Failed to delete the discount. Please try again later.', 'error');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading discounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        {error.includes('log in') && (
          <button 
            className="button primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="no-discounts-container">
        <svg className="no-discounts-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div className="no-discounts-text">No discounts available at the moment.</div>
      </div>
    );
  }

  return (
    <div className="discount-list-container">
      {!isUserView && <h2 className="discount-list-title">Available Discounts</h2>}
      <div className="discount-grid">
        {discounts.map(discount => (
          <DiscountCard
            key={discount._id}
            discount={discount}
            onEdit={!isUserView ? () => navigate(`/admin/discounts/update/${discount._id}`) : undefined}
            onDelete={!isUserView ? () => handleDelete(discount._id) : undefined}
            isUserView={isUserView}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscountList;