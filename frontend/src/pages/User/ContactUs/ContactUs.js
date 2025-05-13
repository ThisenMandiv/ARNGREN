import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import UserNav from '../../../Components/UserNav/UserNav';
import './ContactUs.css';

function ContactUs() {
    const formRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus('');
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, message } = formData;
        if (!name || !email || !message) {
            setError("Please fill in Name, Email, and Message fields.");
            return;
        }

        setStatus('Sending...');
        try {
            await emailjs.sendForm(
                'service_x86j8zi',         // Replace with actual service ID
                'template_s11ddcd',        // Replace with actual template ID
                formRef.current,
                {
                    publicKey: 'G4uH0YYjdNW_C6WoI', // Replace with your EmailJS public key
                }
            );

            setStatus('Your message has been successfully sent!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('EmailJS Error:', err);
            setError('Failed to send message. Please try again.');
            setStatus('');
        }
    };

    return (
        <div>
            <UserNav />
            <div className="contact-page-container">
                <section className="contact-hero">
                    <h1>Get in Touch</h1>
                    <p>We’re here to answer your questions and help you with anything you need.</p>
                </section>

                <section className="contact-details">
                    <h2>Contact Information</h2>
                    <div className="info-grid">
                        <div><p><strong>Address:</strong><br />Gem Lane, Nugegoda, Sri Lanka</p></div>
                        <div><p><strong>Phone:</strong><br />+94 11 234 5678</p></div>
                        <div><p><strong>Email:</strong><br />info@jewelshop.lk</p></div>
                        <div><p><strong>Hours:</strong><br />Mon - Sat, 9:00 AM - 6:00 PM</p></div>
                    </div>
                </section>

                <section className="contact-form-section">
                    <h2>Send Us a Message</h2>
                    {error && <p className="form-status error">{error}</p>}
                    {status && !error && <p className="form-status success">{status}</p>}

                    <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button" disabled={status === 'Sending...'}>
                            {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default ContactUs;
