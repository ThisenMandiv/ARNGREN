// src/pages/Admin/AddEditEvent/AddEditEvent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './AddEditEvent.css';

const API_BASE_URL = "http://localhost:5000";

function AddEditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    // Remove image-related state
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', time: '', location: '',
    });
    // const [imageFile, setImageFile] = useState(null); // REMOVE
    // const [imagePreview, setImagePreview] = useState(null); // REMOVE
    // const [existingImageUrl, setExistingImageUrl] = useState(''); // REMOVE

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch event data if editing (remove imageUrl handling)
    useEffect(() => {
        if (isEditing) {
            setIsLoading(true);
            axios.get(`${API_BASE_URL}/events/${id}`)
                .then(response => {
                    const eventData = response.data.event;
                    const formattedDate = eventData.date ? new Date(eventData.date).toISOString().split('T')[0] : '';
                    setFormData({
                        title: eventData.title || '',
                        description: eventData.description || '',
                        date: formattedDate,
                        time: eventData.time || '',
                        location: eventData.location || '',
                    });
                    // No need to handle image preview state
                })
                .catch(err => {
                    console.error("Error fetching event:", err);
                    setError(`Failed to load event data: ${err.response?.data?.message || 'Server error'}`);
                })
                .finally(() => setIsLoading(false));
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
         if (validationErrors[e.target.name]) {
             setValidationErrors(prev => ({ ...prev, [e.target.name]: null }));
         }
         if(error) setError(null);
    };

    // REMOVE handleImageChange function

    const validateForm = () => {
        // ... (validation logic remains the same) ...
         const errors = {};
        if (!formData.title.trim()) errors.title = "Title is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        if (!formData.date) errors.date = "Date is required";
        if (!formData.location.trim()) errors.location = "Location is required";
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});

        if (!validateForm()) {
            setError("Please fix the errors in the form.");
            return;
        }

        setIsLoading(true);

        // --- Submit as JSON, not FormData ---
        const payload = { ...formData };
        console.log("Submitting Event Payload:", payload);
        // --- End JSON Payload ---

        const url = isEditing ? `${API_BASE_URL}/events/${id}` : `${API_BASE_URL}/events`;
        const method = isEditing ? 'put' : 'post';

        try {
            // --- Send JSON data ---
            await axios({
                method: method,
                url: url,
                data: payload, // Send payload directly
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
            });
            // --- End Send JSON ---
            alert(`Event ${isEditing ? 'updated' : 'created'} successfully!`);
            navigate('/admin/events');
        } catch (err) {
            console.error("Error saving event:", err.response || err);
            const backendErrorMessage = err.response?.data?.message || 'An unexpected server error occurred.';
            const backendValidationErrors = err.response?.data?.errors;
             if (backendValidationErrors && Array.isArray(backendValidationErrors)) {
                 setError(`Validation Failed: ${backendValidationErrors.join(', ')}`);
             } else {
                 setError(`Failed to save event: ${backendErrorMessage}`);
             }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEditing) {
        return <div className="admin-form-container loading">Loading event data...</div>;
    }

    return (
        <div className="admin-form-container">
            <h1>{isEditing ? 'Edit Event' : 'Add New Event'}</h1>
            {error && <p className="error-message">{error}</p>}

            {/* Remove encType from form */}
            <form onSubmit={handleSubmit} noValidate>
                {/* ... other form groups ... */}
                 <div className="form-group">
                    <label htmlFor="title">Event Title</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required aria-invalid={!!validationErrors.title}/>
                    {validationErrors.title && <span className="validation-error">{validationErrors.title}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} required aria-invalid={!!validationErrors.description}></textarea>
                    {validationErrors.description && <span className="validation-error">{validationErrors.description}</span>}
                </div>
                 <div className="form-row">
                     <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required aria-invalid={!!validationErrors.date}/>
                         {validationErrors.date && <span className="validation-error">{validationErrors.date}</span>}
                    </div>
                     <div className="form-group">
                        <label htmlFor="time">Time (Optional)</label>
                        <input type="text" id="time" name="time" placeholder="e.g., 6:00 PM" value={formData.time} onChange={handleChange} />
                    </div>
                 </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required aria-invalid={!!validationErrors.location}/>
                    {validationErrors.location && <span className="validation-error">{validationErrors.location}</span>}
                </div>

                {/* --- REMOVE Image Upload Input --- */}
                {/* <div className="form-group"> ... image input ... </div> */}

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                    </button>
                    <Link to="/admin/events" className="cancel-button">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

export default AddEditEvent;
