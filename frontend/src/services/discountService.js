import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get all discounts
export const getDiscounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/discounts`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new discount
export const createDiscount = async (discountData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/discounts`, discountData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing discount
export const updateDiscount = async (id, discountData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/discounts/${id}`, discountData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a discount
export const deleteDiscount = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/discounts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 