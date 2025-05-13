import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas/dist/html2canvas.min.js";
import { toast } from "react-hot-toast";
import Button from "../ui/Button"; // Assuming this is your custom Button component
import "./AdminReports.css"; // Import the new CSS file

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminReports = () => {
  const [discountUsage, setDiscountUsage] = useState({
    labels: [],
    datasets: [],
  });
  const [promotionPerformance, setPromotionPerformance] = useState({
    labels: [],
    datasets: [],
  });
  const [userActivity, setUserActivity] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  // Default luxury theme colors for charts
  const defaultChartColors = [
    'rgba(160, 118, 249, 0.7)', // Luxury Purple
    'rgba(60, 170, 130, 0.7)',  // Refined Green
    'rgba(220, 165, 30, 0.7)',  // Muted Gold
    'rgba(90, 120, 220, 0.7)',  // Softer Blue
    'rgba(219, 112, 147, 0.7)', // Pale Violet Red
    'rgba(0, 206, 209, 0.7)',   // Dark Turquoise
  ];
  const defaultBorderColors = defaultChartColors.map(color => color.replace('0.7', '1'));


  useEffect(() => {
    fetchReports();
  }, []);

  const processChartData = (data, defaultLabel = "Data") => {
    if (!data || !data.datasets) {
      return { labels: [], datasets: [] };
    }
    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        label: dataset.label || `${defaultLabel} Series ${index + 1}`,
        backgroundColor: dataset.backgroundColor || defaultChartColors[index % defaultChartColors.length],
        borderColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
        borderWidth: dataset.borderWidth || 1,
        hoverBackgroundColor: dataset.hoverBackgroundColor || defaultBorderColors[index % defaultBorderColors.length], // Darker on hover
      })),
    };
  };


  const fetchReports = async () => {
    setLoading(true);
    try {
      const headersConfig = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      const [discountRes, promoRes, userRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/discounts", headersConfig),
        axios.get("http://localhost:5000/api/reports/promotions", headersConfig),
        axios.get("http://localhost:5000/api/reports/users", headersConfig),
      ]);

      setDiscountUsage(processChartData(discountRes.data, "Discount"));
      setPromotionPerformance(processChartData(promoRes.data, "Promotion"));
      setUserActivity(processChartData(userRes.data, "User Activity"));

    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: titleText,
        color: '#E8E8E8',
        font: {
          size: 18, // Slightly larger title
          family: "'Merriweather Sans', sans-serif",
          weight: '600',
        },
        padding: {
          top: 10,
          bottom: 25, // More space below title
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#B0B0B0',
          font: {
            size: 13,
            family: "'Roboto', sans-serif",
          },
          boxWidth: 18, // Larger legend color box
          padding: 25, // More padding for legend
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(18, 18, 18, 0.9)', // Darker tooltip
        titleColor: '#A076F9', // Accent title color
        titleFont: { weight: 'bold', size: 14 },
        bodyColor: '#E0E0E0',
        bodyFont: { size: 12 },
        borderColor: '#333',
        borderWidth: 1,
        padding: 12, // More padding
        callbacks: {
          labelTextColor: function (context) {
            return '#E0E0E0';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.08)', // Subtler grid lines
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
        ticks: {
          color: '#B0B0B0',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          padding: 10, // Padding for ticks
        },
      },
      x: {
        grid: {
          display: false, // Cleaner look for x-axis
        },
        ticks: {
          color: '#B0B0B0',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          padding: 10,
        },
      },
    },
  });

  const generatePDF = async () => {
    toast.loading("Generating PDF, please wait...", { id: "pdf-toast" });
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // PDF Header (Light theme for PDF document itself)
      doc.setFillColor(245, 245, 245); // Light gray header background
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, "F"); // Header bar

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50); // Dark text for PDF
      doc.text("Luxury Admin Reports", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, doc.internal.pageSize.getWidth() / 2, 28, {
        align: "center",
      });

      const chartElements = document.querySelectorAll(".chart-card-reports"); // Use the styled card for capture
      let yPosition = 50; // Start Y position for the first chart
      const pageHeight = doc.internal.pageSize.getHeight();
      const usablePageHeight = pageHeight - 30; // Margin for footer
      const chartMargin = 5; // Margin between charts
      const sideMargin = 15;
      const contentWidth = doc.internal.pageSize.getWidth() - (2 * sideMargin);


      for (let i = 0; i < chartElements.length; i++) {
        const chartElement = chartElements[i];
        const chartTitle = chartElement.querySelector('.chart-title-reports')?.textContent || `Chart ${i + 1}`;

        // Temporarily set chart background to white for PDF capture if needed for light PDF theme
        // chartElement.style.backgroundColor = 'white'; // Uncomment if PDF needs light bg charts
        // const chartTitleElement = chartElement.querySelector('.chart-title-reports');
        // if (chartTitleElement) chartTitleElement.style.color = '#333333'; // Dark title for PDF

        const canvas = await html2canvas(chartElement, {
            scale: 2, // Increase scale for better resolution
            useCORS: true,
            backgroundColor: '#1A1A1A' // Capture with its dark theme background
        });
        
        // chartElement.style.backgroundColor = ''; // Reset style
        // if (chartTitleElement) chartTitleElement.style.color = ''; // Reset style

        const imgData = canvas.toDataURL("image/png", 0.95); // Slightly higher quality
        const aspectRatio = canvas.width / canvas.height;
        let imgWidth = contentWidth / 2 - chartMargin * 2; // Two charts per row
        if (chartElements.length === 1 || (chartElements.length % 2 !== 0 && i === chartElements.length -1)) {
             imgWidth = contentWidth - chartMargin*2; // Full width if only one chart left or single chart
        }
        let imgHeight = imgWidth / aspectRatio;

        if (yPosition + imgHeight + 20 > usablePageHeight) { // Check if it fits, +20 for title space
          doc.addPage();
          yPosition = 20; // Reset Y for new page
        }

        // Chart Title in PDF
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50,50,50);
        doc.text(chartTitle, sideMargin + (i%2 === 0 ? 0 : contentWidth/2 + chartMargin), yPosition);

        doc.addImage(imgData, "PNG", sideMargin + (i%2 === 0 ? 0 : contentWidth/2 + chartMargin), yPosition + 5, imgWidth, imgHeight);
        
        if(i%2 !== 0 || i === chartElements.length -1) { // If it's the second chart in a row or the last chart
            yPosition += imgHeight + 15; // Move yPosition down after a row is complete
        }
      }
      
      // Add detailed promotion performance section (if it fits on current page)
      if (yPosition + 60 > usablePageHeight) { // Check for space for details section
          doc.addPage();
          yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50,50,50);
      doc.text("Promotion Performance Details", sideMargin, yPosition + 10);
      yPosition += 20;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const promoLabels = promotionPerformance?.labels;
      const promoValues = promotionPerformance?.datasets?.[0]?.data;

      if (promoLabels && promoLabels.length > 0 && promoValues) {
        promoLabels.forEach((label, index) => {
          if (yPosition + 7 > usablePageHeight) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`- ${label}: ${promoValues[index] ?? 'N/A'} uses`, sideMargin + 5, yPosition);
          yPosition += 7;
        });
      } else {
        doc.text("No detailed promotion performance data available.", sideMargin + 5, yPosition);
        yPosition += 7;
      }


      // PDF Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let j = 1; j <= pageCount; j++) {
        doc.setPage(j);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${j} of ${pageCount} | Confidential Report | Luxury Admin Panel`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      doc.save("LuxuryAdmin-Reports.pdf");
      toast.success("PDF generated successfully!", { id: "pdf-toast" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please check console.", { id: "pdf-toast" });
    }
  };

  if (loading) {
    return (
      <div className="loading-container-reports">
        <div className="loading-spinner-reports"></div>
        <p className="loading-text-reports">Loading analytical reports...</p>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <div className="reports-header-section">
        <h1 className="page-main-title-reports">Comprehensive Admin Analytics</h1>
        {/* Using the custom Button component, assuming it's styled or we add a class */}
        <Button
          onClick={generatePDF}
          className="button-generate-pdf" // Add this class for styling
        >
          Download PDF Report
        </Button>
      </div>

      <div className="charts-grid-container">
        <div className="chart-card-reports"> {/* This is also .chart-container implicitly for PDF */}
          <h2 className="chart-title-reports">Discount Usage Analysis</h2>
          {discountUsage?.labels?.length > 0 ? (
            <div className="chart-wrapper">
              <Bar
                data={discountUsage}
                options={chartOptions("Discount Usage Frequency")}
              />
            </div>
          ) : (
            <p className="no-data-message-reports">
              No discount usage data available to display.
            </p>
          )}
        </div>

        <div className="chart-card-reports">
          <h2 className="chart-title-reports">Promotion Performance Metrics</h2>
          {promotionPerformance?.labels?.length > 0 ? (
            <div className="chart-wrapper">
              <Bar
                data={promotionPerformance}
                options={chartOptions("Promotion Engagement & Conversion")}
              />
            </div>
          ) : (
            <p className="no-data-message-reports">
              No promotion performance data available to display.
            </p>
          )}
        </div>

        <div className="chart-card-reports">
          <h2 className="chart-title-reports">User Activity Overview</h2>
          {userActivity?.labels?.length > 0 ? (
            <div className="chart-wrapper">
              <Bar data={userActivity} options={chartOptions("Key User Actions")} />
            </div>
          ) : (
            <p className="no-data-message-reports">
              No user activity data available to display.
            </p>
          )}
        </div>
      </div>

      <div className="detailed-reports-section">
        <h2 className="detailed-reports-main-title">In-Depth Data Views</h2>

        <div className="detailed-report-card">
          <h3 className="detailed-report-subtitle">
            Promotion Performance Breakdown
          </h3>
          {promotionPerformance?.labels?.length > 0 && promotionPerformance?.datasets?.[0]?.data ? (
            <div className="detailed-list-container">
              {promotionPerformance.labels.map((label, index) => (
                <div key={index} className="detailed-list-item-reports">
                  <span>{label}</span>
                  <span>
                    {promotionPerformance.datasets[0].data[index] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message-reports">
              No detailed promotion data available for breakdown.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 