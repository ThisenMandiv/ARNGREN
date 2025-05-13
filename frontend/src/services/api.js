import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Get discounts (send JWT if available)
export const getDiscounts = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/discounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      throw new Error('Session expired. Please login again.');
    }
    throw error;
  }
};

// Get all promotions (for coupon creation UI)
export const getPromotions = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    const response = await axios.get(`${API_BASE_URL}/promotions`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};
