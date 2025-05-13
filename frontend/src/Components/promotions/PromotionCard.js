import React from 'react';
import './PromotionCard.css';
import Button from '../ui/Button';
import { format } from 'date-fns';

const PromotionCard = ({ promotion, onEdit, onDelete }) => {
  const isActive = new Date(promotion.endDate) > new Date();

  return (
    <div className="promotion-card">
      <div className="promotion-header">
        <h3 className="promotion-title">{promotion.title}</h3>
      </div>

      <div className="promotion-body">
        <p className="promotion-description">{promotion.description}</p>

        <div className="promotion-dates">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{format(new Date(promotion.startDate), 'MMM d, yyyy')}</span>
          <span className="dash">-</span>
          <span>{format(new Date(promotion.endDate), 'MMM d, yyyy')}</span>
        </div>

        <div className="promotion-status">
          <span className={isActive ? 'status-active' : 'status-expired'}>
            {isActive ? 'Active' : 'Expired'}
          </span>
        </div>

        <div className="promotion-actions">
          <Button onClick={() => onEdit(promotion)} className="action-button">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button onClick={() => onDelete(promotion._id)} className="action-button danger">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
