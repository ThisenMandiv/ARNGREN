// src/pages/Admin/BlogPostList/BlogPostList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlusCircle, FiEye, FiEyeOff } from 'react-icons/fi'; // Icons
import './BlogPostList.css'; // Create this CSS

const API_BASE_URL = "http://localhost:5000";

function BlogPostList() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch summary fields including status
            const response = await axios.get(`${API_BASE_URL}/blogposts`);
            setPosts(response.data.posts || []);
        } catch (err) {
            console.error("Error fetching blog posts:", err);
            setError(`Failed to load posts: ${err.response?.data?.message || 'Server error'}`);
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the post "${title}"?`)) {
            try {
                await axios.delete(`${API_BASE_URL}/blogposts/${id}`);
                alert('Blog post deleted successfully.');
                fetchPosts(); // Refresh the list
            } catch (err) {
                console.error("Error deleting blog post:", err);
                alert(`Failed to delete post: ${err.response?.data?.message || 'Server error'}`);
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
        <div className="admin-list-container"> {/* Reuse admin list styles */}
            <div className="admin-list-header">
                <h1>Manage Blog Posts</h1>
                <Link to="/admin/blog/add" className="admin-add-button">
                    <FiPlusCircle /> Add New Post
                </Link>
            </div>

            {isLoading && <p className="loading-message">Loading posts...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                posts.length === 0 ? (
                    <p className="no-results-message">No blog posts found. Add one!</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post._id}>
                                    <td>
                                        {/* Link to edit page */}
                                        <Link to={`/admin/blog/edit/${post._id}`} className="item-title-link">
                                            {post.title}
                                        </Link>
                                        {/* Optional: Link to view user-side post */}
                                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="view-live-link" title="View Live Post">
                                             <FiEye />
                                        </a>
                                    </td>
                                    <td>{post.author || 'N/A'}</td>
                                    <td>
                                        <span className={`status-label status-label-${post.status?.toLowerCase()}`}>
                                            {post.status === 'Published' ? <FiEye /> : <FiEyeOff />} {post.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(post.createdAt)}</td>
                                    <td className="action-cell">
                                        <Link to={`/admin/blog/edit/${post._id}`} className="action-icon edit-icon" title="Edit">
                                            <FiEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post._id, post.title)}
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

export default BlogPostList;
