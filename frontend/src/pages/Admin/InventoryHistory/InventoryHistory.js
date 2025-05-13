import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Nav from '../../../Components/Nav/Nav';
import './InventoryHistory.css'; // Create this CSS file

function InventoryHistory() {
const { id } = useParams(); // Get product ID from URL
const [history, setHistory] = useState([]);
const [productName, setProductName] = useState('');
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
const fetchHistory = async () => {
setIsLoading(true);
setError(null);
try {
// Fetch product details first to get the name
const productRes = await axios.get(`http://localhost:5000/products/${id}`);
setProductName(productRes.data.product.name);

// Then fetch history
const historyRes = await axios.get(`http://localhost:5000/products/${id}/history`);
setHistory(historyRes.data.history || []);

} catch (err) {
console.error("Error fetching inventory history:", err.response ? err.response.data : err.message);
setError(`Failed to load history: ${err.response?.data?.message || 'Server error'}`);
setHistory([]);
setProductName('');
} finally {
setIsLoading(false);
}
};

fetchHistory();
}, [id]); // Re-fetch if ID changes

const formatTimestamp = (timestamp) => {
if (!timestamp) return 'N/A';
try {
// Format for Colombo timezone
return new Date(timestamp).toLocaleString('en-LK', {
timeZone: 'Asia/Colombo',
dateStyle: 'medium', // e.g., Apr 16, 2025
timeStyle: 'short' // e.g., 6:30 PM
});
} catch (e) {
console.error("Error formatting date:", e);
return 'Invalid Date';
}
};

const getChangeTypeStyle = (changeType) => {
switch (changeType) {
case 'sale':
case 'deletion':
return 'change-type-negative';
case 'restock':
case 'initial':
return 'change-type-positive';
case 'manual_update':
return 'change-type-neutral';
default:
return '';
}
};

return (
<div>
<Nav />
<div className="history-container">
<h1>Inventory Movement History</h1>
{productName && <h2>For Product: {productName}</h2>}
<Link to="/productdetails" className="back-link">&larr; Back to Product List</Link>

{isLoading && <p className="loading-message">Loading history...</p>}
{error && <p className="error-message">{error}</p>}

{!isLoading && !error && (
history.length === 0 ? (
<p className="no-results">No movement history found for this product.</p>
) : (
<table className="history-table">
<thead>
<tr>
<th>Timestamp</th>
<th>Type</th>
<th>Change</th>
<th>Qty Before</th>
<th>Qty After</th>
<th>Notes</th>
</tr>
</thead>
<tbody>
{history.map((item) => (
<tr key={item._id}>
<td>{formatTimestamp(item.timestamp)}</td>
<td>
<span className={`change-type-badge ${getChangeTypeStyle(item.changeType)}`}>
{item.changeType.replace('_', ' ').toUpperCase()}
</span>
</td>
<td className={item.quantityChange >= 0 ? 'positive-change' : 'negative-change'}>
{item.quantityChange > 0 ? `+${item.quantityChange}` : item.quantityChange}
</td>
<td>{item.quantityBefore}</td>
<td>{item.quantityAfter}</td>
<td>{item.notes || '-'}</td>
</tr>
))}
</tbody>
</table>
)
)}
</div>
</div>
);
}

export default InventoryHistory;