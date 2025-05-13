// src/pages/Admin/AddEditBlogPost/AddEditBlogPost.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import './AddEditBlogPost.css';

const API_BASE_URL = "http://localhost:5000";

function AddEditBlogPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    // Remove image-related state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('Draft');
    // const [imageFile, setImageFile] = useState(null); // REMOVE
    // const [imagePreview, setImagePreview] = useState(null); // REMOVE
    // const [existingImageUrl, setExistingImageUrl] = useState(''); // REMOVE

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch post data if editing (remove imageUrl handling)
    useEffect(() => {
        if (isEditing) {
            setIsLoading(true);
            axios.get(`${API_BASE_URL}/blogposts/${id}`)
                .then(response => {
                    const postData = response.data.post;
                    setTitle(postData.title || '');
                    setContent(postData.content || '');
                    setExcerpt(postData.excerpt || '');
                    setAuthor(postData.author || '');
                    setStatus(postData.status || 'Draft');
                    // No image state to set
                })
                .catch(err => {
                    console.error("Error fetching blog post:", err);
                    setError(`Failed to load post data: ${err.response?.data?.message || 'Server error'}`);
                })
                .finally(() => setIsLoading(false));
        }
    }, [id, isEditing]);

    // --- Input Handlers (keep existing handlers for text fields) ---
    const handleTitleChange = (e) => { setTitle(e.target.value); if (validationErrors.title) setValidationErrors(prev => ({ ...prev, title: null })); if(error) setError(null); };
    const handleContentChange = (e) => { setContent(e.target.value); if (validationErrors.content) setValidationErrors(prev => ({ ...prev, content: null })); if(error) setError(null); };
    // const handleQuillContentChange = (value) => { setContent(value); ... };
    const handleExcerptChange = (e) => setExcerpt(e.target.value);
    const handleAuthorChange = (e) => setAuthor(e.target.value);
    const handleStatusChange = (e) => setStatus(e.target.value);
    // REMOVE handleImageChange function

    const validateForm = () => {
        // ... (validation logic remains the same) ...
        const errors = {};
        if (!title.trim()) errors.title = "Title is required";
        if (!content.trim()) errors.content = "Content is required";
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

        // --- Submit as JSON ---
        const payload = {
            title,
            content,
            excerpt,
            author: author || 'Admin',
            status,
            // No imageUrl field needed here anymore
        };
        console.log("Submitting Blog Post Payload:", payload);
        // --- End JSON Payload ---

        const url = isEditing ? `${API_BASE_URL}/blogposts/${id}` : `${API_BASE_URL}/blogposts`;
        const method = isEditing ? 'put' : 'post';

        try {
             // --- Send JSON data ---
            await axios({
                method: method,
                url: url,
                data: payload, // Send payload directly
                headers: {
                    'Content-Type': 'application/json', // Set content type
                },
            });
             // --- End Send JSON ---
            alert(`Blog post ${isEditing ? 'updated' : 'created'} successfully!`);
            navigate('/admin/blog');
        } catch (err) {
            console.error("Error saving blog post:", err.response || err);
            const backendErrorMessage = err.response?.data?.message || 'An unexpected server error occurred.';
            const backendValidationErrors = err.response?.data?.errors;
             if (backendValidationErrors && Array.isArray(backendValidationErrors)) {
                 setError(`Validation Failed: ${backendValidationErrors.join(', ')}`);
             } else {
                 setError(`Failed to save post: ${backendErrorMessage}`);
             }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEditing) {
        return <div className="admin-form-container loading">Loading post data...</div>;
    }

    return (
        <div className="admin-form-container">
            <h1>{isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}</h1>
            {error && <p className="error-message">{error}</p>}

            {/* Remove encType from form */}
            <form onSubmit={handleSubmit} noValidate>
                {/* ... title, content, excerpt, author, status fields ... */}
                 <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" value={title} onChange={handleTitleChange} required aria-invalid={!!validationErrors.title}/>
                    {validationErrors.title && <span className="validation-error">{validationErrors.title}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" rows="15" value={content} onChange={handleContentChange} required aria-invalid={!!validationErrors.content}></textarea>
                    {/* <ReactQuill theme="snow" value={content} onChange={handleQuillContentChange} /> */}
                     {validationErrors.content && <span className="validation-error">{validationErrors.content}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="excerpt">Excerpt (Short Summary - Optional)</label>
                    <textarea id="excerpt" name="excerpt" rows="3" value={excerpt} onChange={handleExcerptChange}></textarea>
                </div>
                 <div className="form-row">
                     <div className="form-group">
                        <label htmlFor="author">Author (Optional)</label>
                        <input type="text" id="author" name="author" placeholder="Admin" value={author} onChange={handleAuthorChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" name="status" value={status} onChange={handleStatusChange} required>
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                 </div>

                {/* --- REMOVE Image Upload Input --- */}
                {/* <div className="form-group"> ... image input ... </div> */}

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                    </button>
                    <Link to="/admin/blog" className="cancel-button">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

export default AddEditBlogPost;
