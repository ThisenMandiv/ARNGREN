// src/pages/User/BlogPostDetail/BlogPostDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import UserNav from '../../../Components/UserNav/UserNav'; // Adjust path
import './BlogPostDetail.css'; // Create this CSS

const API_BASE_URL = "http://localhost:5000";

function BlogPostDetail() {
    const { identifier } = useParams(); // Get slug or ID from URL
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            setError(null);
            console.log(`Fetching blog post with identifier: ${identifier}`);
            try {
                // Use the backend endpoint that accepts slug or ID
                const response = await axios.get(`${API_BASE_URL}/blogposts/${identifier}`);
                setPost(response.data.post);
            } catch (err) {
                console.error("Error fetching blog post:", err);
                if (err.response && err.response.status === 404) {
                    setError("Blog post not found.");
                } else {
                    setError(`Failed to load blog post: ${err.response?.data?.message || 'Server error'}`);
                }
                setPost(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (identifier) {
            fetchPost();
        } else {
             setError("No blog post identifier provided.");
             setIsLoading(false);
        }
    }, [identifier]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-LK', {
                 day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch (e) { return 'Invalid Date'; }
    };

     // --- Render Logic ---
    if (isLoading) {
        return <div><UserNav /><div className="blog-detail-container loading">Loading post...</div></div>;
    }

    if (error) {
        return <div><UserNav /><div className="blog-detail-container error">Error: {error} <br /><Link to="/blog">Back to Blog</Link></div></div>;
    }

    if (!post) {
        return <div><UserNav /><div className="blog-detail-container">Blog post not available. <Link to="/blog">Back to Blog</Link></div></div>;
    }

    // Render the actual post content
    return (
        <div>
            <UserNav />
            <div className="blog-detail-container">
                <Link to="/blog" className="back-to-blog-link">&larr; Back to Blog List</Link>

                <article className="blog-post-content">
                    <h1>{post.title}</h1>
                    <p className="blog-meta-detail">
                        By {post.author || 'Admin'} | Published on {formatDate(post.createdAt)}
                        {post.updatedAt && post.createdAt !== post.updatedAt &&
                            ` | Updated on ${formatDate(post.updatedAt)}`
                        }
                    </p>

                    {/* Optional: Display featured image */}
                    {post.imageUrl && (
                        <div className="blog-featured-image">
                            <img src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API_BASE_URL}${post.imageUrl}`}
                                 alt={post.title}
                                 onError={(e) => { e.target.style.display='none'; }}
                            />
                        </div>
                    )}

                    {/* Render HTML content safely if stored as HTML, or render plain text */}
                    {/* WARNING: Only use dangerouslySetInnerHTML if you TRUST the source of the HTML (e.g., your own admin editor) */}
                    {/* Otherwise, render plain text or use a markdown renderer if content is markdown */}
                    <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    {/* Alternative for plain text: */}
                    {/* <div className="blog-post-body">{post.content}</div> */}

                </article>

                 {/* Optional: Add related posts or comments section here */}

            </div>
        </div>
    );
}

export default BlogPostDetail;
