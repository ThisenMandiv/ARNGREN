import React, { useState } from 'react';
import CustomizationModal from '../customization/CustomizationModal';

const ProductDetail = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div onClick={handleProductClick} style={{ cursor: 'pointer' }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} style={{ maxWidth: '100%' }} />
      <CustomizationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />
    </div>
  );
};

export default ProductDetail; 