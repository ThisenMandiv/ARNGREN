import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React from "react";

const OrderReport = ({ orders }) => {
  
  const generatePDF = () => {
    const doc = new jsPDF();

    // ✅ Add Title
    doc.text("Order Details Report", 14, 15);

    // ✅ Calculate Summary
    const totalOrders = orders.length;
    const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0);

    // ✅ Find Most Ordered Product
    const productCount = {};
    orders.forEach(order => {
      productCount[order.product] = (productCount[order.product] || 0) + order.quantity;
    });

    const mostOrderedProduct = Object.keys(productCount).reduce((a, b) => 
      productCount[a] > productCount[b] ? a : b, "No orders");

    // ✅ Add Summary to PDF
    doc.text(`Total Orders: ${totalOrders}`, 14, 25);
    doc.text(`Total Quantity Ordered: ${totalQuantity}`, 14, 35);
    doc.text(`Most Ordered Product: ${mostOrderedProduct}`, 14, 45);

    // ✅ Define Table Columns
    const tableColumn = ["User Name", "Product", "Quantity", "Address", "Date"];

    // ✅ Map Order Data to Table Rows
    const tableRows = orders.map(order => [
      order.userName,
      order.product,
      order.quantity,
      order.deliveryAddress,
      order.date,
    ]);

    // ✅ Generate Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55, // Adjusted to fit summary
    });

    // ✅ Save PDF
    doc.save("Order_Report.pdf");
  };

  return (
    <div>
      <button onClick={generatePDF} style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}>
        Download Report 📄
      </button>
    </div>
  );
};

export default OrderReport;
