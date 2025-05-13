// Order.js - Modified to remove conflicting inline styles for dark theme compatibility

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "@emailjs/browser";
import "./Order.css"; // Ensure this file is imported for styling
// Ensure Orders.css is imported in the parent Orders.js or this component's CSS is linked
// If Order.js has its own CSS file (e.g., Order.css), ensure styles there also don't conflict.

function Order({ order }) {
  // Destructure order properties
  const { _id, userName, product, quantity, deliveryAddress, date, status } = order;
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(status);

  // Handler for deleting an order
  const deleteHandler = async () => {
    // Optional: Add a confirmation dialog
    // if (!window.confirm("Are you sure you want to delete this order?")) {
    //   return;
    // }
    try {
      await axios.delete(`http://localhost:5000/orders/${_id}`);
      alert("Order deleted successfully!");
      navigate("/admin/orders"); // Navigate to admin orders list
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert(`Failed to delete order: ${error.response?.data?.message || error.message}.`);
    }
  };

  // Handler for changing the order status via dropdown
  const statusChangeHandler = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);

    try {
      await axios.put(`http://localhost:5000/orders/${_id}`, {
        userName,
        product,
        quantity,
        deliveryAddress,
        date,
        status: newStatus,
      });

      const templateParams = {
        user_name: userName,
        product_name: product,
        order_quantity: quantity,
        delivery_address: deliveryAddress,
        order_status: newStatus,
      };

      // Replace with your actual EmailJS Service ID, Template ID, and Public Key
      await emailjs.send(
        "YOUR_EMAILJS_SERVICE_ID",
        "YOUR_EMAILJS_TEMPLATE_ID",
        templateParams,
        "YOUR_EMAILJS_PUBLIC_KEY"
      );
      alert("Order status updated and email sent!");
    } catch (error) {
      console.error("Order update or email sending failed:", error);
      if (error.response) {
        alert(`Order update failed: ${error.response.data.message || error.message}`);
      } else if (error.text) {
        alert(`Order updated but email failed to send: ${error.text}`);
      } else {
        alert("An unexpected error occurred during order update or email sending.");
      }
    }
  };

  // Handler for generating an invoice PDF
  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Invoice", 14, 22);
    doc.setFontSize(12);
    doc.text(`Order ID: ${_id}`, 14, 32);
    
    autoTable(doc, {
      startY: 40,
      head: [["Field", "Value"]],
      body: [
        ["User Name", userName],
        ["Product", product],
        ["Quantity", quantity],
        ["Delivery Address", deliveryAddress],
        ["Date", new Date(date).toLocaleDateString()],
        ["Status", currentStatus],
      ],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }, // Example: Teal color for header
    });
    doc.save(`Invoice_${userName}_${_id}.pdf`);
  };

  // The main 'div' now only has className="order-card".
  // All styling (padding, margin, background-color, color, border, box-shadow, border-radius)
  // should come from your Orders.css file targeting .order-card.
  return (
    <div className="order-card">
      {/* Heading for Order ID - styling from Orders.css */}
      <h3>Order ID: {_id}</h3>
      
      {/* Paragraphs for order details - styling from Orders.css */}
      <p><strong>User:</strong> {userName}</p>
      <p><strong>Product:</strong> {product}</p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Delivery Address:</strong> {deliveryAddress}</p>
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      
      <p><strong>Status:</strong>
        {/* Select dropdown - styling from Orders.css targeting .status-dropdown */}
        <select 
          value={currentStatus} 
          onChange={statusChangeHandler} 
          className="status-dropdown" 
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </p>

      {/* Button group container - styling from Orders.css */}
      <div className="button-group">
        {/* Link and Button for Update - styling from Orders.css targeting .update-btn */}
        <Link to={`/admin/orders/update/${_id}`}>
          <button className="update-btn">
            Update Order
          </button>
        </Link>
        
        {/* Button for Delete - styling from Orders.css targeting .delete-btn */}
        <button 
          onClick={deleteHandler} 
          className="delete-btn" 
        >
          Delete Order
        </button>
        
        {/* Button for Invoice - styling from Orders.css targeting .invoice-btn */}
        <button 
          onClick={generateInvoice} 
          className="invoice-btn" 
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
}

export default Order;
