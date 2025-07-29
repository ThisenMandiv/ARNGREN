// src/components/Footer/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import CSS for styling
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi'; // Example social icons

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3 className="footer-logo">ARNGREN</h3>
                    <p>
                        Your trusted marketplace for quality products and services. 
                        Connect, trade, and discover amazing deals in our vibrant community.
                    </p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/ads">Browse Ads</Link></li>
                        <li><Link to="/post-ad">Post Ad</Link></li>
                        <li><Link to="/my-ads">My Ads</Link></li>
                    
                    </ul>
                </div>

                <div className="footer-section contact-info">
                    <h3>Contact Info</h3>
                    <p>📍 Colombo, Sri Lanka</p>
                    <p>📞 Phone: +94 11 234 5678</p>
                    <p>✉️ Email: info@arngren.lk</p>
                    <p>🕒 Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {currentYear} ARNGREN | All Rights Reserved | Privacy Policy | Terms of Service
            </div>
        </footer>
    );
}

export default Footer;
