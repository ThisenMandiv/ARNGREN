// src/pages/User/Events/Events.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNav from '../../../Components/UserNav/UserNav';
import './Events.css';

const API_BASE_URL = "http://localhost:5000";

function Events() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events`);
                setEvents(response.data.events || []);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-LK', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div>
            <UserNav />
            <div className="static-page-container events-list-user">
                <h1 className="page-title">Upcoming Events</h1>

                {isLoading && (
                    <div className="info-banner loading">🔄 Loading events...</div>
                )}

                {error && (
                    <div className="info-banner error">❌ {error}</div>
                )}

                {!isLoading && !error && events.length === 0 && (
                    <div className="info-banner empty">📭 No upcoming events found. Please check back later.</div>
                )}

                <div className="event-items-container">
                    {events.map((event) => (
                        <div key={event._id} className="event-item-user">
                            {event.imageUrl && (
                                <div className="event-image-user">
                                    <img
                                        src={event.imageUrl.startsWith('http') ? event.imageUrl : `${API_BASE_URL}${event.imageUrl}`}
                                        alt={event.title}
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                </div>
                            )}

                            <div className="event-details-user">
                                <h2 className="event-title">{event.title}</h2>
                                <p className="event-meta">
                                    <span><strong>Date:</strong> {formatDate(event.date)} {event.time ? ` | ${event.time}` : ''}</span><br />
                                    <span><strong>Location:</strong> {event.location}</span>
                                </p>
                                <p className="event-description-user">{event.description}</p>
                                {/* Optional: Link to register */}
                                {/* {event.registrationLink && (
                                    <a href={event.registrationLink} className="register-link" target="_blank" rel="noopener noreferrer">
                                        Register Now
                                    </a>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Events;
