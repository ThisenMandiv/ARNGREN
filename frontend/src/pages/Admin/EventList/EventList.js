// src/pages/Admin/EventList/EventList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi'; // Icons
import './EventList.css'; // Create this CSS

const API_BASE_URL = "http://localhost:5000";

function EventList() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/events`);
            setEvents(response.data.events || []);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError(`Failed to load events: ${err.response?.data?.message || 'Server error'}`);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the event "${title}"?`)) {
            try {
                await axios.delete(`${API_BASE_URL}/events/${id}`);
                alert('Event deleted successfully.');
                fetchEvents(); // Refresh the list
            } catch (err) {
                console.error("Error deleting event:", err);
                alert(`Failed to delete event: ${err.response?.data?.message || 'Server error'}`);
            }
        }
    };

     // Format date for display
     const formatDate = (dateString) => {
         if (!dateString) return 'N/A';
         try {
             return new Date(dateString).toLocaleDateString('en-LK', {
                 day: '2-digit', month: 'short', year: 'numeric'
             });
         } catch (e) { return 'Invalid Date'; }
     };

    return (
        <div className="admin-list-container">
            <div className="admin-list-header">
                <h1>Manage Events</h1>
                <Link to="/admin/events/add" className="admin-add-button">
                    <FiPlusCircle /> Add New Event
                </Link>
            </div>

            {isLoading && <p className="loading-message">Loading events...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                events.length === 0 ? (
                    <p className="no-results-message">No events found. Add one!</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td>{event.title}</td>
                                    <td>{formatDate(event.date)} {event.time ? `(${event.time})` : ''}</td>
                                    <td>{event.location}</td>
                                    <td className="action-cell">
                                        <Link to={`/admin/events/edit/${event._id}`} className="action-icon edit-icon" title="Edit">
                                            <FiEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(event._id, event.title)}
                                            className="action-icon delete-icon"
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}

export default EventList;
