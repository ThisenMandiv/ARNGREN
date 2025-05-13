import { useEffect, useState } from "react";
import axios from "axios";
import "./UserDiscounts.css";

const UserDiscounts = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCouponId, setCopiedCouponId] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          setLoading(false);
          setCoupons([]);
          return; // Don't show error, just skip fetching
        }

        const response = await axios.get(
          `http://localhost:5000/api/coupons/user/${userId}`
        );
        setCoupons(response.data);
      } catch (err) {
        setError("Failed to load coupons: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) return <div className="message loading">Loading coupons...</div>;
  // If not logged in or no coupons, don't show anything
  if (!error && coupons.length === 0) return null;
  if (error) return <div className="message error">{error}</div>;

  return (
    <div className="discounts-container">
      <h2 className="discounts-heading">
        <span className="gradient-text">Your Coupons</span>
        <div className="gradient-line"></div>
      </h2>

      <div className="coupons-grid">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="coupon-card">
            <div className="coupon-content">
              <div className="ribbon">
                Expires: {new Date(coupon.validUntil).toLocaleDateString()}
              </div>

              <div className="code-section">
                <button
                  className="code-button"
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    setCopiedCouponId(coupon._id);
                    setTimeout(() => setCopiedCouponId(null), 2000);
                  }}
                >
                  <h3 className="code-text">
                    <span>{coupon.code}</span>
                    <span className="copy-icon">
                      {copiedCouponId === coupon._id ? "✔️" : "📄"}
                    </span>
                  </h3>
                </button>
                <p className="promotion-title">
                  {coupon.promotion?.title || "Special Discount"}
                </p>
              </div>

              <div className="discount-box">
                <span className="discount-percentage">{coupon.percentage}%</span>
                <span className="discount-off">OFF</span>
              </div>
            </div>

            <div className="footer">
              <span className="issuer">👤 Issued by: {coupon.createdBy?.name || "Store Admin"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDiscounts; 