import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const OrderReportPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get("http://localhost:5000/orders");
      setOrders(response.data.orders);
    };
    fetchOrders();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Order Details Report", 14, 15);
    const tableColumn = ["User Name", "Product", "Quantity", "Address", "Date"];
    const tableRows = orders.map(order => [
      order.userName,
      order.product,
      order.quantity,
      order.deliveryAddress,
      order.date,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Order_Report.pdf");
  };

  return (
    <div className="page-content" style={{ padding: "20px" }}>
      <h1>Order Report</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
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
          {orders.length > 0 ? (
            orders.map((order, index) => (
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
              <td colSpan="5" style={{ textAlign: "center" }}>No orders available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={generatePDF}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white" }}>
        Generate PDF Report
      </button>
    </div>
  );
};

export default OrderReportPage;