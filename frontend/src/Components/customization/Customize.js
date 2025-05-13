import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './Customize.css';

const Customize = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [error, setError] = useState('');

  function getCustomizedPrice() {
    if (!product) return 0;
    let price = product.price;
    if (selectedMaterial) {
      if (selectedMaterial.toLowerCase().includes('gold')) price += 150;
      else if (selectedMaterial.toLowerCase().includes('silver')) price += 60;
      else if (selectedMaterial.toLowerCase().includes('platinum')) price += 200;
      else if (selectedMaterial.toLowerCase().includes('pearl')) price += 90;
      else if (selectedMaterial.toLowerCase().includes('gemstone')) price += 120;
    }
    if (selectedTheme) {
      if (selectedTheme.toLowerCase() === 'vintage') price += 80;
      else if (selectedTheme.toLowerCase() === 'modern') price += 40;
      else if (selectedTheme.toLowerCase() === 'luxury') price += 200;
      else if (selectedTheme.toLowerCase() === 'floral') price += 60;
    }
    return price;
  }

  useEffect(() => {
    if (location.state && location.state.productDetails) {
      setProduct({
        ...location.state.productDetails,
        options: {
          materials: ['Rose Gold', 'Yellow Gold', 'White Gold', location.state.productDetails.material],
          sizes: ['16 inch', '18 inch', '20 inch', location.state.productDetails.size],
          themes: ['Floral', 'Modern', 'Vintage', location.state.productDetails.theme]
        }
      });
      return;
    }
    setError('Product details not found. Please return to the shop page.');
  }, [productId, location.state]);

  const handleCustomize = async () => {
    if (!selectedMaterial || !selectedSize || !selectedTheme) {
      toast.error('Please select all customization options');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5000/api/customizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          material: selectedMaterial,
          size: selectedSize,
          theme: selectedTheme,
          price: getCustomizedPrice(),
          userId: user?._id,
          userName: user?.name
        })
      });
      if (res.ok) {
        toast.success("Customization saved!");
        setTimeout(() => navigate("/my-customizations"), 1200);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save customization");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="loading-message">Loading...</div>;

  return (
    <div className="customize-container">
      <div className="customize-wrapper">
        <div className="preview-section">
          <h2 className="preview-title">Live Preview</h2>
          <div className="preview-image-box">
            <img
              src={product.image}
              alt={product.name}
              className="preview-image"
              style={{
                filter: selectedTheme === 'Vintage' ? 'sepia(0.5)' : selectedTheme === 'Modern' ? 'contrast(1.2)' : 'none'
              }}
            />
            <div className="overlay top-left">{selectedMaterial || product.material}</div>
            <div className="overlay top-right">{selectedSize || product.size}</div>
            <div className="overlay bottom-center">{selectedTheme || product.theme}</div>
          </div>
          <div className="preview-price">
            ₨{getCustomizedPrice().toLocaleString()}
            <div className="price-note">Price updates with your choices</div>
          </div>
        </div>
        <div className="form-section">
          <h1 className="form-title">Customize <span>{product.name}</span></h1>
          <div className="form-group">
            <label>Material</label>
            <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
              <option value="">Select Material</option>
              {product.options.materials.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Size</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              <option value="">Select Size</option>
              {product.options.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Theme</label>
            <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
              <option value="">Select Theme</option>
              {product.options.themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button className="confirm-button" onClick={handleCustomize}>Confirm Customization</button>
          <div className="summary-box">
            <h3>Current Selections</h3>
            <ul>
              <li><strong>Material:</strong> {selectedMaterial || product.material}</li>
              <li><strong>Size:</strong> {selectedSize || product.size}</li>
              <li><strong>Theme:</strong> {selectedTheme || product.theme}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
