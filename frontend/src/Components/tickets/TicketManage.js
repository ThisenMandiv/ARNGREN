import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminTicketForm from "../components/tickets/AdminTicketForm";
import "./TicketManage.css";

const TicketManage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTickets(response.data);
      setFilteredTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setSelectedTicket(null);
    fetchTickets();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query) ||
        ticket.status.toLowerCase().includes(query) ||
        (ticket.customerId?.name || "").toLowerCase().includes(query)
    );
    setFilteredTickets(filtered);
  };

  return (
    <div className="ticket-manage-container">
      <div className="ticket-manage-wrapper">
        <h2 className="ticket-manage-title">Manage Tickets</h2>

        {/* Search Bar */}
        <div className="ticket-search-bar">
          <div className="ticket-search-controls">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="ticket-search-input"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="ticket-search-button"
            >
              Search
            </button>
          </div>
        </div>

        <div className="ticket-content">
          {loading ? (
            <div className="ticket-loading">
              <div className="ticket-spinner"></div>
            </div>
          ) : selectedTicket ? (
            <AdminTicketForm
              ticket={selectedTicket}
              onUpdateSuccess={handleUpdateSuccess}
            />
          ) : (
            <div className="ticket-list">
              {filteredTickets.length === 0 ? (
                <div className="ticket-empty">
                  <svg
                    className="ticket-empty-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3>No tickets found</h3>
                  <p>Try searching with different keywords.</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div key={ticket._id} className="ticket-card">
                    <div className="ticket-card-content">
                      <div className="ticket-card-info">
                        <h3 className="ticket-subject">{ticket.subject}</h3>
                        <p className="ticket-description">{ticket.description}</p>
                        <div className="ticket-details">
                          <div><strong>Category:</strong> {ticket.category}</div>
                          <div><strong>Status:</strong> {ticket.status}</div>
                          <div><strong>Customer:</strong> {ticket.customerId?.name || "Unknown"}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="ticket-edit-button"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketManage;
