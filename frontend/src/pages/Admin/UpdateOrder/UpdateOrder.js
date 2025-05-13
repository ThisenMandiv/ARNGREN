// --- UpdateOrder.js ---
// This component is used to update an existing order.
// It fetches the order details based on the ID from the URL params.
// Assumed path: src/pages/Admin/UpdateOrder/UpdateOrder.js (or similar, based on App.js imports)

import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateOrder() {
  const { id } = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    userName: "",
    product: "",
    quantity: "", // Should be number, handled by input type="number"
    deliveryAddress: "",
    date: "", // Expected format YYYY-MM-DD for input type="date"
    // status is typically not part of this form, as it's handled by the dropdown in Order.js
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null); // For form submission errors

  // useCallback to memoize fetchHandler unless 'id' changes
  const fetchHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/orders/${id}`);
      let orderData;
      if (response.data && response.data.order) { // Handles { order: {details} }
        orderData = response.data.order;
      } else if (response.data) { // Handles direct order object
        orderData = response.data;
      } else {
        throw new Error("Order data not found in API response");
      }

      // Format date for input type="date" which expects YYYY-MM-DD
      if (orderData.date) {
        orderData.date = new Date(orderData.date).toISOString().split('T')[0];
      }
      // Ensure quantity is a string for the input field initially if it might come as a number
      orderData.quantity = String(orderData.quantity || '');

      setInputs(orderData);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setError(`Failed to load order details: ${err.message}. Please check the console or try again later.`);
    } finally {
      setLoading(false);
    }
  }, [id]); // Dependency: re-run if 'id' changes

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]); // fetchHandler is memoized, so this effect runs when id changes

  // Handler for input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value, // Parse quantity to number
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null); // Clear previous submission errors
    console.log("Submitting updated inputs:", inputs);

    // Basic validation example
    if (!inputs.userName || !inputs.product || inputs.quantity <= 0 || !inputs.deliveryAddress || !inputs.date) {
        setSubmitError("All fields are required and quantity must be positive.");
        return;
    }
    
    try {
      // Ensure quantity is a number before sending to backend
      const payload = {
        ...inputs,
        quantity: Number(inputs.quantity),
      };
      await axios.put(`http://localhost:5000/orders/${id}`, payload);
      alert("Order updated successfully!");
      navigate("/admin/orders"); // Navigate to the admin orders list
    } catch (err) {
      console.error("Failed to update order:", err);
      setSubmitError(`Failed to update order: ${err.response?.data?.message || err.message}`);
      // alert(`Failed to update order: ${err.response?.data?.message || err.message}`);
    }
  };

  // Basic styling for the form (can be moved to a CSS file)
  const pageStyle = { padding: '20px', maxWidth: '700px', margin: '0 auto' };
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f9f9f9', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'};
  const labelStyle = { fontWeight: 'bold', marginBottom: '5px', color: '#333' };
  const inputStyle = { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', width: '100%', boxSizing: 'border-box' };
  const buttonStyle = { padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s ease' };
  const errorTextStyle = { color: 'red', marginTop: '10px', textAlign: 'center' };


  if (loading) {
    return <p style={{textAlign: 'center', marginTop: '30px', fontSize: '18px'}}>Loading order details...</p>;
  }

  if (error) {
    return <p style={errorTextStyle}>{error}</p>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Update Order</h1>
      {inputs && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label htmlFor="userName" style={labelStyle}>User Name</label>
            <input id="userName" style={inputStyle} type="text" name="userName" onChange={handleChange} value={inputs.userName || ""} required />
          </div>
          
          <div>
            <label htmlFor="product" style={labelStyle}>Product</label>
            <input id="product" style={inputStyle} type="text" name="product" onChange={handleChange} value={inputs.product || ""} required />
          </div>
          
          <div>
            <label htmlFor="quantity" style={labelStyle}>Quantity</label>
            <input id="quantity" style={inputStyle} type="number" name="quantity" onChange={handleChange} value={inputs.quantity || ""} required min="1" />
          </div>
          
          <div>
            <label htmlFor="deliveryAddress" style={labelStyle}>Delivery Address</label>
            <input id="deliveryAddress" style={inputStyle} type="text" name="deliveryAddress" onChange={handleChange} value={inputs.deliveryAddress || ""} required />
          </div>
          
          <div>
            <label htmlFor="date" style={labelStyle}>Order Date</label>
            <input id="date" style={inputStyle} type="date" name="date" onChange={handleChange} value={inputs.date || ""} required />
          </div>
          
          {submitError && <p style={errorTextStyle}>{submitError}</p>}

          <button type="submit" style={buttonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor='#0056b3'} onMouseOut={(e) => e.currentTarget.style.backgroundColor='#007bff'}>
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateOrder;