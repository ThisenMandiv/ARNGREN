// src/pages/DiscountPage.js

import React, { useEffect, useState } from 'react';
import DiscountList from './DiscountList';
import UserDiscounts from './UserDiscounts';
import { getDiscounts } from '../../services/discountService';
import UserNav from '../UserNav/UserNav';
import './DiscountPage.css';
import { useNavigate } from 'react-router-dom';

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDiscounts();
        setDiscounts(data);
      } catch (error) {
        if (error.message === 'Session expired. Please login again.') {
          // Redirect to login page
          navigate('/login', { 
            state: { 
              from: '/discounts',
              message: 'Your session has expired. Please login again.'
            }
          });
        } else {
          setError(error.message || 'Failed to load discounts');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [navigate]);

  if (loading) {
    return (
      <div className="discount-page">
        <UserNav />
        <div className="discounts-loading">
          <p>Loading discounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discount-page">
        <UserNav />
        <div className="discounts-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discount-page">
      <UserNav />
      <div className="discounts-container">
        <UserDiscounts />
        <div className="available-discounts">
          <h2>Available Discounts</h2>
          <DiscountList discounts={discounts} isUserView={true} />
        </div>
      </div>
    </div>
  );
};

export default DiscountPage;
