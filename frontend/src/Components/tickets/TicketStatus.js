import { useEffect, useState } from 'react';
import axios from 'axios';
import UserNav from '../UserNav/UserNav';
import { FiSearch } from 'react-icons/fi';
import './TicketStatus.css';

const TicketStatus = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tickets', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                alert('Error fetching tickets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const getStatusColorClass = (status) => {
        switch (status.toLowerCase()) {
            case 'open':
                return 'status-open';
            case 'in progress':
                return 'status-in-progress';
            case 'resolved':
                return 'status-resolved';
            case 'closed':
                return 'status-closed';
            default:
                return 'status-default';
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-section">
                    <div className="loading-bar"></div>
                    <div className="skeleton-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-line short"></div>
                                <div className="skeleton-line thinner"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <UserNav />
            <div className="page-container">
                <div className="content-container">
                    <div className="header">
                        <h2 className="title">Your Tickets</h2>
                        <div className="search-box">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tickets..."
                                className="search-input"
                            />
                           
                        </div>
                    </div>

                    {filteredTickets.length === 0 ? (
                        <div className="no-tickets">
                            <div className="no-tickets-icon">💬</div>
                            <h3>No tickets found</h3>
                            <p>Get started by creating a new ticket.</p>
                        </div>
                    ) : (
                        <div className="ticket-list">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket._id} className="ticket-card">
                                    <div className="ticket-content">
                                        <div className="ticket-header">
                                            <h3 className="ticket-subject">{ticket.subject}</h3>
                                            <span className={`ticket-status ${getStatusColorClass(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="ticket-description">{ticket.description}</p>
                                        <div className="ticket-tags">
                                            <span className="tag">{ticket.category}</span>
                                            <span className="tag">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {ticket.adminResponse && (
                                            <div style={{marginTop: 10, color: '#ffd700'}}>
                                                <b>Admin Response:</b>
                                                <div style={{color: '#fff', background: '#181818', borderRadius: 5, padding: 8, marginTop: 4}}>{ticket.adminResponse}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketStatus;
