import React from 'react';
import UserNav from '../../../Components/UserNav/UserNav';
import './AboutUs.css';

function AboutUs() {
    const teamMembers = [
        {
            name: 'Thisen Mandiv',
            role: 'Product Management Lead',
            image: '/thisen.png',
        },
        {
            name: 'Senindu Vidmal',
            role: 'User Management Lead',
            image: '/senindu.png',
        },
        {
            name: 'Bimalka Bandara',
            role: 'Order & Delivery Management Lead',
            image: '/bimalka.png',
        },
        {
            name: 'Tharushi Nethmini',
            role: 'Customization Management Lead',
            image: 'tharushi.jpg',
        },
        {
            name: 'Sachini Kaushalya',
            role: 'Promotion, Discount & Customization Management Lead',
            image: 'sachini.jpg',
        },
    ];

    return (
        <div>
            <UserNav />
            <div className="aboutus-container">
                <section className="aboutus-header">
                    <h1>About JADE JEWELLERS</h1>
                    <p>
                        At <strong>JADE JEWELLERS</strong>, we transform passion into elegance. Established in <strong>2024</strong>,
                        we are a digital-first jewelry brand offering ethically sourced, finely crafted gemstone pieces.
                    </p>
                    <p>
                        From timeless rings to custom-crafted heirlooms, our designs combine modern artistry with ancient beauty.
                        Every gemstone is handpicked. Every piece tells a story.
                    </p>
                </section>

                <section className="team-section">
                    <h2>Meet Our Development Team</h2>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div className="team-card" key={index}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="team-image"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/placeholder-user.png';
                                    }}
                                />
                                <h3>{member.name}</h3>
                                <p className="team-role">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUs;
