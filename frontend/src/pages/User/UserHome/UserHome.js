import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import UserNav from '../../../Components/UserNav/UserNav';
import './UserHome.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BACKEND_URL = "http://localhost:5000";

// Hero slider data
const heroSlidesData = [
    {
        id: 1,
        image: '/bgimage1.jpg',
        alt: "Exquisite Diamond Necklace",
        headline: "Discover Unrivaled Brilliance",
        subheadline: "Explore our latest collection of handcrafted masterpieces.",
        ctaText: "Shop New Arrivals",
        ctaLink: "/products?filter=new",
    },
    {
        id: 2,
        image: '/bgimage4.jpg',
        alt: "Vibrant Gemstone Rings",
        headline: "Colors of JADE JEWELLERS",
        subheadline: "Find the perfect gemstone to tell your story.",
        ctaText: "Explore Events",
        ctaLink: "/events",
    },
    {
        id: 3,
        image: '/bgimage3.jpg',
        alt: "Timeless Jade Pieces",
        headline: "The Essence of Jade Jewellers",
        subheadline: "Craftsmanship that lasts a lifetime.",
        ctaText: "Learn Our Story",
        ctaLink: "/about",
    }
];

function UserHome() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/products`);
                setFeaturedProducts((response.data.products || []).slice(0, 8));
            } catch (err) {
                console.error("Error fetching featured products:", err);
                setError("Could not load featured items.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const getImageUrl = (imagePath) => {
        if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
            return `${BACKEND_URL}/${imagePath.replace(/^\/+/, '')}`;
        }
        if (imagePath) {
            return imagePath.startsWith('http') ? imagePath : `${BACKEND_URL}${imagePath}`;
        }
        return ""; // no fallback here
    };

    const heroSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'linear',
        pauseOnHover: true,
    };

    const productCarouselSettings = {
        dots: true,
        infinite: featuredProducts.length > 3,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div>
            <UserNav />
            <div className="user-home-container">
                <div className="hero-slider-section">
                    <Slider {...heroSliderSettings}>
                        {heroSlidesData.map(slide => (
                            <div key={slide.id} className="hero-slide">
                                <img src={slide.image} alt={slide.alt} className="hero-slide-image" />
                                <div className="hero-slide-content">
                                    <h1>{slide.headline}</h1>
                                    <p>{slide.subheadline}</p>
                                    <Link to={slide.ctaLink} className="cta-button hero-cta">
                                        {slide.ctaText}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="welcome-text-section">
                    <h2>Welcome to <span className="brand-name">JADE JEWELLERS</span></h2>
                    <p>Where timeless elegance meets the brilliance of gemstones.</p>
                    <Link to="/products" className="cta-button-outline">Explore the Full Collection</Link>
                </div>

                <div className="featured-section">
                    <h2>Featured Masterpieces</h2>
                    {isLoading && <p className="loading-text">Loading exquisite pieces...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!isLoading && !error && (
                        featuredProducts.length > 0 ? (
                            <Slider {...productCarouselSettings} className="featured-products-carousel">
                                {featuredProducts.map(product => (
                                    <div key={product._id} className="product-slide-item">
                                        <Link to={`/product/${product._id}`} className="featured-card-link">
                                            <div className="featured-card">
                                                <div className="featured-card-image-wrapper">
                                                    <img
                                                        src={getImageUrl(product.imageUrl)}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                </div>
                                                <h3>{product.name}</h3>
                                                <p className="product-price">LKR {product.price ? product.price.toFixed(2) : 'N/A'}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className="no-products-message">Currently no featured products. Check back soon!</p>
                        )
                    )}
                </div>

                <div className="categories-section">
                    <h2>Shop by Category</h2>
                    <div className="categories-grid">
                        <Link to="/products?category=rings" className="category-card">
                            <img src="/category-rings.jpg" alt="Rings" />
                            <span>Rings</span>
                        </Link>
                        <Link to="/products?category=necklaces" className="category-card">
                            <img src="/category-necklaces.jpg" alt="Necklaces" />
                            <span>Necklaces</span>
                        </Link>
                        <Link to="/products?category=earrings" className="category-card">
                            <img src="/category-earrings.jpg" alt="Earrings" />
                            <span>Earrings</span>
                        </Link>
                        <Link to="/products?category=bracelets" className="category-card">
                            <img src="/category-bracelets.jpg" alt="Bracelets" />
                            <span>Bracelets</span>
                        </Link>
                    </div>
                </div>

                <div className="testimonials-section">
  <h2>What Our Clients Say</h2>
  <div className="testimonial-slider">
    <div className="testimonial-item">
      <p>"Absolutely stunning piece and incredible service. JADE JEWELLERS is my go-to for quality jewelry."</p>
      <div className="star-rating">★★★★★</div>
      <h4>K.Mark </h4>
    </div><br />
    <div className="testimonial-item">
      <p>"The craftsmanship is exquisite. I receive compliments every time I wear my necklace."</p>
      <div className="star-rating">★★★★★</div>
      <h4>B.Ken</h4>
    </div>
    <div className="testimonial-item">
      <p>"Truly elegant designs and top-notch quality. I'm beyond satisfied with my bracelet!"</p>
      <div className="star-rating">★★★★★</div>
      <h4>A.Ben</h4>
    </div>
  </div>
</div>


                <div className="brand-promise-section">
                    <h2>Our Commitment to You</h2>
                    <div className="promise-points">
                        <div className="promise-point">
                            <h3>Exquisite Craftsmanship</h3>
                            <p>Each piece is meticulously crafted by master artisans.</p>
                        </div>
                        <div className="promise-point">
                            <h3>Ethically Sourced Gems</h3>
                            <p>We ensure all our gemstones are sourced responsibly.</p>
                        </div>
                        <div className="promise-point">
                            <h3>Timeless Designs</h3>
                            <p>Creating heirlooms that transcend fleeting trends.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserHome;
