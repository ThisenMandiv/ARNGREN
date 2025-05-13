import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './TicketStatus.css';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTickets(res.data);
      } catch (err) {
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setResponse(ticket.adminResponse || '');
    setError(null);
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tickets/${selectedTicket._id}`,
        { adminResponse: response, status: 'Resolved' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Update ticket in list
      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? res.data : t))
      );
      setSelectedTicket(res.data);
    } catch (err) {
      setError('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Tickets Report', 14, 16);
    const tableColumn = [
      'Subject', 'User', 'Status', 'Category', 'Discount', 'Promotion', 'Created At', 'Admin Response'
    ];
    const tableRows = tickets.map(ticket => [
      ticket.subject,
      ticket.customerId?.email || ticket.customerId,
      ticket.status,
      ticket.category,
      ticket.discount ? (ticket.discount.code || ticket.discount.name || ticket.discount) : '',
      ticket.promotion ? (ticket.promotion.title || ticket.promotion.name || ticket.promotion) : '',
      new Date(ticket.createdAt).toLocaleDateString(),
      ticket.adminResponse || ''
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [255, 215, 0], textColor: 20 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    doc.save('tickets_report.pdf');
  };

  if (loading) return <div className="page-container"><div className="loading-bar"></div></div>;
  if (error) return <div className="page-container"><div className="form-error">{error}</div></div>;

  return (
    <div className="page-container">
      <div className="content-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 className="title">All Tickets</h2>
          <button onClick={handleDownloadPDF} style={{ background: '#ffd700', color: '#111', border: 'none', borderRadius: 5, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>
            Download PDF
          </button>
        </div>
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card" onClick={() => handleSelectTicket(ticket)} style={{ cursor: 'pointer', border: selectedTicket && selectedTicket._id === ticket._id ? '2px solid #ffd700' : 'none' }}>
              <div className="ticket-header">
                <h3 className="ticket-subject">{ticket.subject}</h3>
                <span className={`ticket-status status-${ticket.status?.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>
              </div>
              <p className="ticket-description">{ticket.description}</p>
              <div className="ticket-tags">
                <span className="tag">{ticket.category}</span>
                <span className="tag">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span className="tag">User: {ticket.customerId?.email || ticket.customerId}</span>
                {ticket.discount && <span className="tag">Discount: {ticket.discount.code || ticket.discount.name || ticket.discount}</span>}
                {ticket.promotion && <span className="tag">Promotion: {ticket.promotion.title || ticket.promotion.name || ticket.promotion}</span>}
              </div>
            </div>
          ))}
        </div>
        {selectedTicket && (
          <div style={{ marginTop: 32, background: '#222', borderRadius: 8, padding: 24 }}>
            <h3 style={{ color: '#ffd700' }}>Ticket Details</h3>
            <p><b>Subject:</b> {selectedTicket.subject}</p>
            <p><b>Description:</b> {selectedTicket.description}</p>
            <p><b>Category:</b> {selectedTicket.category}</p>
            <p><b>Status:</b> {selectedTicket.status}</p>
            <p><b>User:</b> {selectedTicket.customerId?.email || selectedTicket.customerId}</p>
            {selectedTicket.discount && <p><b>Discount:</b> {selectedTicket.discount.code || selectedTicket.discount.name || selectedTicket.discount}</p>}
            {selectedTicket.promotion && <p><b>Promotion:</b> {selectedTicket.promotion.title || selectedTicket.promotion.name || selectedTicket.promotion}</p>}
            <form onSubmit={handleResponseSubmit} style={{ marginTop: 16 }}>
              <label style={{ color: '#fff' }}>Admin Response:</label>
              <textarea
                value={response}
                onChange={e => setResponse(e.target.value)}
                style={{ width: '100%', minHeight: 80, background: '#181818', color: '#fff', border: '1px solid #ffd700', borderRadius: 6, marginTop: 8 }}
                required
              />
              <button type="submit" disabled={submitting} style={{ marginTop: 12, background: '#ffd700', color: '#111', border: 'none', borderRadius: 5, padding: '8px 24px', fontWeight: 700, cursor: 'pointer' }}>
                {submitting ? 'Sending...' : 'Send Response & Mark Resolved'}
              </button>
            </form>
            {selectedTicket.adminResponse && (
              <div style={{ marginTop: 16, color: '#ffd700' }}>
                <b>Previous Response:</b>
                <div style={{ color: '#fff', background: '#181818', borderRadius: 5, padding: 8, marginTop: 4 }}>{selectedTicket.adminResponse}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets; 