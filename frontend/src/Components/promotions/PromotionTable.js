import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import './PromotionTable.css'; // Import the CSS file

const PromotionTable = ({ promotions, onEdit, onDelete, isLoading }) => {
  return (
    <div className="promotion-table-container">
      <table className="promotion-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="center-text">Loading promotions...</td>
            </tr>
          ) : promotions.length === 0 ? (
            <tr>
              <td colSpan="5" className="center-text">No promotions found</td>
            </tr>
          ) : (
            promotions.map((promotion) => (
              <tr key={promotion._id}>
                <td>{promotion.title}</td>
                <td className="truncate">{promotion.description}</td>
                <td>{format(new Date(promotion.startDate), 'MMM dd, yyyy')}</td>
                <td>{format(new Date(promotion.endDate), 'MMM dd, yyyy')}</td>
                <td className="text-right">
                  <button className="edit-btn" onClick={() => onEdit(promotion)} title="Edit Promotion">
                    <Pencil size={18} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(promotion._id)} title="Delete Promotion">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
