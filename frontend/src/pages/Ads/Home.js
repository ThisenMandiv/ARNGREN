import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_STRUCTURE = [
  {
    icon: '🚗',
    name: 'Vehicles & Transport',
    subcategories: [
      'ATV (el.)', 'Car, el-car', 'el-Scooter & Car', 'el-Sykle-1, 2', 'Fatbike-el', 'GoKart-Pedal, el', 'Golf cars (m/skille)', 'Moped-el', 'Motorcycle-Mini', 'Bicycle-el, 1, 2'
    ]
  },
  {
    icon: '🎮',
    name: 'Toys & Hobbies',
    subcategories: [
      'Hobby & RC', 'Hoverpod', 'Rocket-Fly', 'RC Products', 'Figures'
    ]
  },
  {
    icon: '📷',
    name: 'Electronics & Gadgets',
    subcategories: [
      'Aquarium', 'Alarm', 'Alkotester', 'Photo Tiles', 'Digital-Certain', 'Disko-Lys', 'DVD-Player', 'Translator', 'Charger-230Vaq', 'Robots', 'Robot-Stilsandsvug', 'Solcellr'
    ]
  },
  {
    icon: '🏠',
    name: 'Home & Entertainment',
    subcategories: [
      'Billiards table M/b', 'Electronics & Bab', 'HP-Mtolaughs (Bill', 'TV-Ur & Armb. Ur', 'Star-heaven'
    ]
  },
  {
    icon: '🎯',
    name: 'Fun & Miscellaneous',
    subcategories: [
      'Air-joke', 'Listen', 'Converter', 'Compass (Bill/Bike)', 'Snow Shares', 'Train track (to PC)', 'Walkie Talk'
    ]
  }
];

const Home = () => {
  const [selectedMain, setSelectedMain] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      <h1>ARNGREN</h1>
      <h2>Browse items by category</h2>
      {selectedMain === null ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          padding: '24px 0'
        }}>
          {CATEGORY_STRUCTURE.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setSelectedMain(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '28px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                outline: 'none'
              }}
            >
              <span style={{ fontSize: '48px', marginBottom: '14px' }}>{cat.icon}</span>
              <span style={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelectedMain(null)} style={{ marginBottom: 20, background: 'none', border: 'none', color: '#118d21', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>&larr; Back to main categories</button>
          <h3 style={{ marginBottom: 16 }}>{CATEGORY_STRUCTURE[selectedMain].icon} {CATEGORY_STRUCTURE[selectedMain].name}</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px',
            padding: '10px 0'
          }}>
            {CATEGORY_STRUCTURE[selectedMain].subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => navigate(`/ads/category/${encodeURIComponent(sub)}`)}
                style={{
                  padding: '18px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  border: '1px solid #e0e0e0',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  color: '#222',
                  fontWeight: 500
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 