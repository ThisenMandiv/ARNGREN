const jsPDF = require("jspdf");
require("jspdf-autotable");

const generateInvoice = (order) => {
  const doc = new jsPDF();
  doc.text("Order Invoice", 14, 20);

  doc.autoTable({
    head: [["Field", "Value"]],
    body: [
      ["User Name", order.userName],
      ["Product", order.product],
      ["Quantity", order.quantity],
      ["Delivery Address", order.deliveryAddress],
      ["Date", order.date],
      ["Status", order.status],
    ],
  });

  doc.save(`Invoice_${order._id}.pdf`);
};

module.exports = { generateInvoice };
