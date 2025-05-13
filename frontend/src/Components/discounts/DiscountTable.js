// src/components/DiscountTable.js

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import './DiscountTable.css';

const DiscountTable = ({ discounts = [], onEdit, onDelete, isLoading }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (discountId) => {
    setDeletingId(discountId);
    try {
      await onDelete(discountId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="discount-table-wrapper">
      {isLoading ? (
        <div className="discount-loading">Loading discounts...</div>
      ) : discounts.length === 0 ? (
        <div className="discount-empty">No discounts found</div>
      ) : (
        <div className="discount-grid">
          {discounts.map((discount) => (
            <div key={discount._id} className="discount-card">
              <div className="discount-card-body">
                <div className="discount-header">
                  <h3 className="discount-code">{discount.code}</h3>
                  <span className="discount-badge">{discount.percentage}% OFF</span>
                </div>

                <div className="discount-date">
                  <svg className="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {format(new Date(discount.validUntil), 'MMM dd, yyyy')}
                </div>

                <div className="discount-actions">
                  <button onClick={() => onEdit(discount)} className="btn-edit" title="Edit Discount">
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(discount._id)}
                    className="btn-delete"
                    disabled={deletingId === discount._id}
                    title="Delete Discount"
                  >
                    {deletingId === discount._id ? (
                      <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountTable;
