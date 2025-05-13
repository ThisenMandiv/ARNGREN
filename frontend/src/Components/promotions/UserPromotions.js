// UserPromotions.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPromotions.css';
import { useNavigate } from 'react-router-dom';
import UserNav from '../UserNav/UserNav';

const UserPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/promotions');
        console.log('All promotions:', response.data);

        // Filter only active promotions
        const activePromotions = response.data.filter(promo => {
          const now = new Date();
          // Set time to start of day for fair comparison
          now.setHours(0, 0, 0, 0);
          
          const startDate = new Date(promo.startDate);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = new Date(promo.endDate);
          endDate.setHours(23, 59, 59, 999); // End of day

          // Debug logs
          console.log('Promotion:', promo.title);
          console.log('Start Date:', startDate.toLocaleString());
          console.log('End Date:', endDate.toLocaleString());
          console.log('Current Date:', now.toLocaleString());
          
          const isActive = now >= startDate && now <= endDate;
          console.log('Is Active:', isActive);

          return isActive;
        });

        console.log('Active promotions:', activePromotions);
        setPromotions(activePromotions);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading promotions...</div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (promotions.length === 0) {
    return (
      <div className="empty-container">
        <svg className="empty-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <div className="empty-text">No active promotions available at the moment.</div>
      </div>
    );
  }

  return (
    <>
      <UserNav />
      <div className="user-promotions-container">
        <h1 className="user-promotions-title">Current Promotions</h1>
        <div className="user-promotions-grid">
          {promotions.map(promotion => (
            <div key={promotion._id} className="user-promotion-card">
              <div className="user-promotion-header">
                <h2 className="user-promotion-title">{promotion.title}</h2>
                <span className="user-promotion-percentage">{promotion.percentage}% OFF</span>
              </div>
              <div className="user-promotion-body">
                <p className="user-promotion-description">{promotion.description}</p>
                <div className="promotion-dates">
                  <span>Start: {new Date(promotion.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(promotion.endDate).toLocaleDateString()}</span>
                </div>
                <button className="shop-now-btn" onClick={() => navigate('/products')}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserPromotions;
