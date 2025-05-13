import axios from 'axios';

const API_URL = 'http://localhost:5000/api/promotions';

// Format date to ISO string
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString();
};

// Get all promotions
export const getPromotions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch promotions');
  }
};

// Create a new promotion
export const createPromotion = async (promotionData) => {
  try {
    // Format dates before sending
    const formattedData = {
      ...promotionData,
      startDate: formatDate(promotionData.startDate),
      endDate: formatDate(promotionData.endDate)
    };
    console.log('Creating promotion with data:', formattedData);
    const response = await axios.post(API_URL, formattedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create promotion');
  }
};

// Update a promotion
export const updatePromotion = async (id, promotionData) => {
  try {
    // Format dates before sending
    const formattedData = {
      ...promotionData,
      startDate: formatDate(promotionData.startDate),
      endDate: formatDate(promotionData.endDate)
    };
    console.log('Updating promotion with data:', formattedData);
    const response = await axios.put(`${API_URL}/${id}`, formattedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update promotion');
  }
};

// Delete a promotion
export const deletePromotion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete promotion');
  }
}; 