// src/pages/Admin/UserList/UserList.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserRow from './UserRow'; // Assuming UserRow component handles individual row display
import './UserList.css'; // Make sure this CSS file exists and is styled
import { FiPlusCircle, FiDownload } from 'react-icons/fi'; // <<< Import FiDownload

const API_BASE_URL = "http://localhost:5000/api";

function UserList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data.users || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(`Failed to load users: ${err.response?.data?.message || 'Server error'}`);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('User deleted successfully.');
                fetchUsers(); // Refresh the list
            } catch (err) {
                console.error("Error deleting user:", err);
                alert(`Failed to delete user: ${err.response?.data?.message || 'Server error'}`);
            }
        }
    };

    // Simple frontend search filter
    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Helper function to format date for CSV
    const formatDateForCSV = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            // Format as YYYY-MM-DD for better CSV compatibility
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // Function to handle report download
    const handleDownloadReport = () => {
        if (filteredUsers.length === 0) {
            alert("No users to download.");
            return;
        }

        // Define CSV headers
        const headers = ['Name', 'Email', 'Age', 'Role', 'Joined Date'];
        
        // Convert user data to CSV rows
        const csvRows = filteredUsers.map(user => [
            `"${user.name || 'N/A'}"`, // Enclose in quotes to handle commas in names
            `"${user.email || 'N/A'}"`,
            user.age || 'N/A',
            `"${user.role || 'N/A'}"`,
            formatDateForCSV(user.createdAt) // Assuming 'createdAt' is the join date field
        ].join(','));

        // Combine headers and rows
        const csvString = [headers.join(','), ...csvRows].join('\n');

        // Create a Blob with the CSV data
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        
        // Create a link element to trigger the download
        const link = document.createElement("a");
        if (link.download !== undefined) { // Check for browser support
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "user_report.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Clean up
        } else {
            alert("Your browser does not support this download feature.");
        }
    };


    return (
        <div className="admin-list-container">
            <div className="admin-list-header">
                <h1>Manage Users</h1>
                <div className="admin-header-actions"> {/* Wrapper for buttons */}
                    <Link to="/admin/users/add" className="admin-add-button">
                        <FiPlusCircle /> Add New User
                    </Link>
                    <button onClick={handleDownloadReport} className="admin-action-button admin-download-button"> {/* New Download Button */}
                        <FiDownload /> Download Report
                    </button>
                </div>
            </div>

            <div className="admin-search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading && <p className="loading-message">Loading users...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
                filteredUsers.length === 0 ? (
                    <p className="no-results-message">{searchTerm ? 'No users match your search.' : 'No users found.'}</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <UserRow
                                    key={user._id}
                                    user={user}
                                    onDelete={handleDeleteUser}
                                    // Pass formatDate if UserRow needs it for display, 
                                    // or UserRow can have its own formatting.
                                    // For CSV, we use formatDateForCSV defined above.
                                />
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}

export default UserList;
