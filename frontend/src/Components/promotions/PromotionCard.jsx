import React from 'react';
import './PromotionCard.css';

const PromotionCard = ({ promotion, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="promotion-card">
      <div className="promotion-header">
        <h3 className="promotion-title">{promotion.title}</h3>
        <span className="promotion-percentage">{promotion.percentage}% OFF</span>
      </div>
      <div className="promotion-body">
        <p className="promotion-description">{promotion.description}</p>
        <div className="promotion-dates">
          <span>Start: {formatDate(promotion.startDate)}</span>
          <span>End: {formatDate(promotion.endDate)}</span>
        </div>
      </div>
      <div className="promotion-actions">
        <button 
          className="edit-button"
          onClick={() => onEdit(promotion)}
        >
          Edit
        </button>
        <button 
          className="delete-button"
          onClick={() => onDelete(promotion._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PromotionCard; 