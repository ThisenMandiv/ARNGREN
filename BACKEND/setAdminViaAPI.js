import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function setUserAsAdmin(email) {
  try {
    console.log(`Setting user ${email} as admin...`);
    
    const response = await axios.post(`${API_BASE_URL}/users/set-admin`, {
      email: email
    });
    
    console.log('Success!', response.data);
    console.log('User details:', response.data.user);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure the backend server is running on http://localhost:5000');
    }
  }
}

// Set the user as admin
const userEmail = 'mandivttt@gmail.com';
setUserAsAdmin(userEmail); 