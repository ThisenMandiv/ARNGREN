import React, { useState, useEffect } from "react";
import axios from "axios";
import Order from "../Order/Order";
import "./Orders.css";

const URL = "http://localhost:5000/orders";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setOrders(data.orders));
  }, []);

  return (
    <div className="page-content">
      <div className="orders-container">
        <h1>Order Details</h1>
        {orders && orders.map((order, i) => (
          <div key={i}><Order order={order} /></div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
