import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketForm = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ subject, description, category }),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to submit ticket';
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
            if (errorMsg.toLowerCase().includes('token is not valid')) {
              localStorage.removeItem('token');
              setTimeout(() => navigate('/login'), 1000);
            }
          }
        } catch (jsonErr) {
          // Ignore JSON parse errors
        }
        throw new Error(errorMsg);
      }
      // Navigate to view tickets after successful submission
      navigate('/view-tickets');
    } catch (err) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h2>Raise a Ticket</h2>
      {error && <div className="form-error">{error}</div>}
      <div className="form-group">
        <label>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Order">Order</option>
          <option value="Product">Product</option>
          <option value="Account">Account</option>
        </select>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
};

export default TicketForm;
