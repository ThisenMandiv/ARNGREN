import React from 'react';
import { Pencil, Trash2, CalendarDays } from 'lucide-react'; // Added CalendarDays for consistency
import './DiscountCard.css'; // Import the CSS file

const DiscountCard = ({ discount, onEdit, onDelete, isUserView = false }) => {
  // Validate discount data
  if (!discount || !discount.code || typeof discount.percentage !== 'number' || !discount.validUntil) {
    return (
      <div className="invalid-discount-message">
        Invalid discount data provided.
      </div>
    );
  }

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid date';
    }
  };

  const isExpired = new Date(discount.validUntil) < new Date();

  return (
    <div className="discount-card">
      <div className="discount-card-content">
        {/* Header with code and actions */}
        <div className="discount-card-header">
          <h3 className="discount-card-code">{discount.code}</h3>
          {!isUserView && (
            <div className="discount-card-actions">
              <button
                onClick={() => onEdit(discount)}
                className="action-button edit-button"
                aria-label="Edit discount"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => onDelete(discount._id)}
                className="action-button delete-button"
                aria-label="Delete discount"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Discount percentage with badge */}
        <div className="discount-card-percentage-info">
          <span className="percentage-badge">
            {discount.percentage}% OFF
          </span>
          <span className="percentage-text">({discount.percentage}% discount)</span>
        </div>

        {/* Valid until date */}
        <div className="discount-card-validity">
          <CalendarDays size={16} className="calendar-icon" />
          <span>Valid Until: <span className="validity-date">{formatDate(discount.validUntil)}</span></span>
        </div>

        {/* Status indicator */}
        <div className="discount-card-status-container">
          <span className={`status-badge ${isExpired ? 'status-badge-expired' : 'status-badge-active'}`}>
            {isExpired ? 'Expired' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;