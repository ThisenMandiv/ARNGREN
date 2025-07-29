import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const AdminUserRole = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('mandivttt@gmail.com');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateUserRole = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/users/set-admin', {
        email: email
      });
      
      setMessage(`✅ Success! User ${response.data.user.name} is now an admin.`);
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Update User Role</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            User Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
            placeholder="Enter user email"
          />
        </div>

        <button
          onClick={updateUserRole}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Updating...' : 'Make User Admin'}
        </button>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '5px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserRole; 