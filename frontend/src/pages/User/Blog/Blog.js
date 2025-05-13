// src/pages/User/Blog/Blog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserNav from '../../../Components/UserNav/UserNav';
import './Blog.css';

const API_BASE_URL = "http://localhost:5000";

function Blog() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/blogposts`);
                const publishedPosts = (response.data.posts || []).filter(p => p.status === 'Published');
                setPosts(publishedPosts);
            } catch (err) {
                console.error("Error fetching blog posts:", err);
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
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
            <div className="static-page-container blog-list-user">
                <h1 className="page-title"> Blog</h1>
                <p className="blog-intro">Insights, stories, and tips from the world of gems and jewelry.</p>

                {isLoading && (
                    <div className="info-banner loading"> Loading blog posts...</div>
                )}

                {error && (
                    <div className="info-banner error">❌ {error}</div>
                )}

                {!isLoading && !error && posts.length === 0 && (
                    <div className="info-banner empty">📭 No blog posts published yet. Stay tuned!</div>
                )}

                <div className="blog-posts-container">
                    {posts.map((post) => (
                        <div key={post._id} className="blog-post-snippet-user">
                            {post.imageUrl && (
                                <div className="blog-image-user">
                                    <Link to={`/blog/${post.slug}`}>
                                        <img
                                            src={post.imageUrl.startsWith('http') ? post.imageUrl : `${API_BASE_URL}${post.imageUrl}`}
                                            alt={post.title}
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                    </Link>
                                </div>
                            )}
                            <div className="blog-details-user">
                                <h2 className="blog-title">
                                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="blog-meta-user">
                                     {post.author || 'Admin'} | 🗓 {formatDate(post.createdAt)}
                                </p>
                                <p className="blog-excerpt-user">
                                    {post.excerpt || `${post.content?.substring(0, 150)}...`}
                                </p>
                                <Link to={`/blog/${post.slug}`} className="read-more-link">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Blog;
