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
                    <h3 className="footer-logo">JADE JEWELLERS</h3>
                    <p>
                        Exquisite gems and handcrafted jewelry, created with passion and precision.
                        Discover timeless elegance with our curated collections.
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
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/products">Shop</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        {/* Add other links like FAQ, Terms, Privacy Policy */}
                    </ul>
                </div>

                <div className="footer-section contact-info">
                    <h3>Contact Info</h3>
                    <p>123 Gem Lane, Nugegoda, Sri Lanka</p>
                    <p>Phone: +94 11 234 5678</p>
                    <p>Email: info@jadejewellers.lk</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {currentYear} JADE JEWELLERS | All Rights Reserved
            </div>
        </footer>
    );
}

export default Footer;
