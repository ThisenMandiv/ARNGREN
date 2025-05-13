import React from 'react';
import PromotionCard from './PromotionCard';
import './PromotionList.css';

const PromotionList = ({ promotions, onEdit, onDelete }) => {
  if (!promotions || promotions.length === 0) {
    return (
      <div className="promotion-list-empty">
        <p>No promotions available</p>
      </div>
    );
  }

  return (
    <div className="promotion-list">
      {promotions.map(promotion => (
        <PromotionCard
          key={promotion._id}
          promotion={promotion}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PromotionList;
