import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'; // Assuming these are still desired
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './AdminCustomizations.css'; // Import the CSS file

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminCustomizations() {
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const fetchCustomizations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customizations');
      setCustomizations(res.data);
    } catch (err) {
      toast.error('Failed to fetch customizations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/customizations/${id}/status`,
        {
          status: newStatus,
        }
      );
      toast.success('Status updated successfully');
      fetchCustomizations();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handlePriceChange = async (id, newPrice) => {
    try {
      await axios.put(`http://localhost:5000/api/customizations/${id}`, { price: newPrice });
      toast.success('Price updated successfully');
      fetchCustomizations();
    } catch (err) {
      toast.error('Failed to update price');
    }
  };

  if (loading) return <div className="loading-message">Loading, please wait...</div>;

  const filteredCustomizations = customizations.filter(custom =>
    custom.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custom.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custom.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custom.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); // Dark blue-gray
    doc.text('Customization Orders Report', 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 30);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    const totalOrders = filteredCustomizations.length;
    const pendingOrders = filteredCustomizations.filter(c => c.status === 'Pending').length;
    const inProgressOrders = filteredCustomizations.filter(c => c.status === 'In Progress').length;
    const completedOrders = filteredCustomizations.filter(c => c.status === 'Completed').length;

    doc.text(`Total Orders: ${totalOrders}`, 15, 45);
    doc.text(`Pending: ${pendingOrders}`, 15, 52);
    doc.text(`In Progress: ${inProgressOrders}`, 15, 59);
    doc.text(`Completed: ${completedOrders}`, 15, 66);

    const tableData = filteredCustomizations.map(custom => [
      custom.userName,
      custom.productName,
      `${custom.material} (${custom.size}), Theme: ${custom.theme}`,
      `₨${custom.price?.toLocaleString()}`,
      custom.status
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['Customer', 'Product', 'Details', 'Price', 'Status']],
      body: tableData,
      theme: 'grid', // 'striped' or 'plain' are other options
      headStyles: {
        fillColor: [26, 18, 70], // Darker purple/blue
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [50,50,50],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 255] // Light lavender
      },
      footStyles: {
        fillColor: [26, 18, 70],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
      // Example of adding a footer to the table
      // didDrawPage: function (data) {
      //   doc.setFontSize(10);
      //   doc.setTextColor(40);
      //   doc.text('Report Footer - Confidential', data.settings.margin.left, doc.internal.pageSize.height - 10);
      // }
    });

    doc.save('customization-orders-report.pdf');
  };

  const statusCounts = {
    Pending: filteredCustomizations.filter(c => c.status === 'Pending').length,
    'In Progress': filteredCustomizations.filter(c => c.status === 'In Progress').length,
    Completed: filteredCustomizations.filter(c => c.status === 'Completed').length,
  };

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(220, 165, 30, 0.7)', // Muted Gold/Yellow for Pending
          'rgba(90, 120, 220, 0.7)', // Softer Blue for In Progress
          'rgba(60, 170, 130, 0.7)',  // Refined Green for Completed
        ],
        borderColor: [ // Use darker shades for borders or a consistent border
          '#1E1E1E',
          '#1E1E1E',
          '#1E1E1E',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#E0E0E0', // Light text for legend
          font: {
            size: 13,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        color: '#FFFFFF', // White text for title
        font: {
          size: 20,
          weight: 'bold',
          family: "'Georgia', 'Times New Roman', Times, serif" // A more classic, luxurious font
        },
        padding: {
          top: 10,
          bottom: 25
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        bodyFont: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        callbacks: {
            label: function(context) {
                let label = context.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed !== null) {
                    label += context.parsed;
                }
                return label;
            }
        }
      }
    },
  };

  return (
    <div className="admin-customizations-container">
      <div className="header-section">
        <h2 className="main-title">Manage Customizations</h2>
        <div className="actions-toolbar">
          <div className="search-bar-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={generatePDF} className="action-button report-button">
            <DocumentArrowDownIcon className="button-icon" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total-orders-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">Total Orders</p>
              <p className="stat-value">{filteredCustomizations.length}</p>
            </div>
            <div className="stat-icon-bg">
              {/* Replace with a more suitable icon or keep SVG */}
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card completed-orders-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">
                {filteredCustomizations.filter(c => c.status === 'Completed').length}
              </p>
            </div>
            <div className="stat-icon-bg">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card progress-orders-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">In Progress</p>
              <p className="stat-value">
                {filteredCustomizations.filter(c => c.status === 'In Progress').length}
              </p>
            </div>
            <div className="stat-icon-bg">
              <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="stat-card pending-orders-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-label">Pending</p>
              <p className="stat-value">
                {filteredCustomizations.filter(c => c.status === 'Pending').length}
              </p>
            </div>
            <div className="stat-icon-bg">
               <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container-wrapper">
        <div className="chart-container">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="customizations-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Details</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomizations.length > 0 ? (
              filteredCustomizations.map((custom) => (
                <tr key={custom._id}>
                  <td data-label="Customer">{custom.userName}</td>
                  <td data-label="Product">{custom.productName}</td>
                  <td data-label="Details" className="details-cell">
                    <span>Material: {custom.material}</span>
                    <span>Size: {custom.size}</span>
                    <span>Theme: {custom.theme}</span>
                  </td>
                  <td data-label="Price">
                    <input
                      type="number"
                      min="0"
                      value={custom.price}
                      onChange={e => handlePriceChange(custom._id, e.target.value)}
                      style={{ width: '90px', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge status-${custom.status?.toLowerCase().replace(' ', '-')}`}>{custom.status}</span>
                  </td>
                  <td data-label="Actions">
                    <select
                      className="status-select"
                      value={custom.status}
                      onChange={(e) => updateStatus(custom._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data-message">No customization orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}