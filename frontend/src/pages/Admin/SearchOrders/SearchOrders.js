import React, { useState, useEffect } from "react";
import axios from "axios";
import './SearchOrders.css';

const SearchOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get("http://localhost:5000/orders");
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    };
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = orders.filter(
      (order) => order.userName.toLowerCase().includes(value) ||
                 order.product.toLowerCase().includes(value)
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="page-content">
      <div className="search-container">
        <h1>Search Order Details</h1>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by User Name or Product..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Address</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.userName}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>{order.deliveryAddress}</td>
                    <td>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No matching orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchOrders;

