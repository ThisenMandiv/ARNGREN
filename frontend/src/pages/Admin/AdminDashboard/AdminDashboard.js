import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminDashboard.css'; // Ensure CSS is linked
import { FiUsers, FiClock, FiCalendar, FiFileText, FiTag, FiPercent, FiAward, FiSettings } from 'react-icons/fi'; // Optional icons
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const BACKEND_URL = "http://localhost:5000";

function AdminDashboard() {
    // Combine stats into one state object
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalUsers: 0,
        totalEvents: 0,
        totalBlogPosts: 0,
        totalPromotions: 0,
        totalDiscounts: 0,
        totalTickets: 0,
        totalCustomizations: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [recentBlogPosts, setRecentBlogPosts] = useState([]);
    const [recentPromotions, setRecentPromotions] = useState([]);
    const [recentDiscounts, setRecentDiscounts] = useState([]);
    const [recentTickets, setRecentTickets] = useState([]);
    const [recentCustomizations, setRecentCustomizations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                
                const [
                    usersRes, 
                    productsRes, 
                    ordersRes,
                    eventsRes,
                    blogPostsRes,
                    promotionsRes,
                    discountsRes,
                    ticketsRes,
                    customizationsRes
                ] = await Promise.all([
                    axios.get(`${BACKEND_URL}/api/users`, { headers }),
                    axios.get(`${BACKEND_URL}/products`, { headers }),
                    axios.get(`${BACKEND_URL}/orders`, { headers }),
                    axios.get(`${BACKEND_URL}/events`, { headers }),
                    axios.get(`${BACKEND_URL}/blogposts`, { headers }),
                    axios.get(`${BACKEND_URL}/api/promotions`, { headers }),
                    axios.get(`${BACKEND_URL}/api/discounts`, { headers }),
                    axios.get(`${BACKEND_URL}/api/tickets`, { headers }),
                    axios.get(`${BACKEND_URL}/api/customizations`, { headers })
                ]);

                // Process existing stats
                const products = productsRes.data.products || [];
                const orders = ordersRes.data.orders || [];
                const users = usersRes.data.users || [];
                
                // Process new stats
                const events = eventsRes.data.events || [];
                const blogPosts = blogPostsRes.data.blogPosts || [];
                const promotions = promotionsRes.data.promotions || [];
                const discounts = discountsRes.data.discounts || [];
                const tickets = ticketsRes.data.tickets || [];
                const customizations = customizationsRes.data.customizations || [];

                // Set recent items
                setRecentEvents(events.slice(0, 5));
                setRecentBlogPosts(blogPosts.slice(0, 5));
                setRecentPromotions(promotions.slice(0, 5));
                setRecentDiscounts(discounts.slice(0, 5));
                setRecentTickets(tickets.slice(0, 5));
                setRecentCustomizations(customizations.slice(0, 5));

                // Update stats
                setStats({
                    totalProducts: products.length,
                    lowStockCount: products.filter(p => p.quantity <= p.lowStockThreshold).length,
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'Pending').length,
                    totalUsers: users.length,
                    totalEvents: events.length,
                    totalBlogPosts: blogPosts.length,
                    totalPromotions: promotions.length,
                    totalDiscounts: discounts.length,
                    totalTickets: tickets.length,
                    totalCustomizations: customizations.length
                });

                setRecentOrders(orders.slice(0, 5));
                setRecentUsers(users.slice(0, 5));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError("Failed to load dashboard data. Please try again.");
                setStats({
                    totalProducts: 0,
                    lowStockCount: 0,
                    totalOrders: 0,
                    pendingOrders: 0,
                    totalUsers: 0,
                    totalEvents: 0,
                    totalBlogPosts: 0,
                    totalPromotions: 0,
                    totalDiscounts: 0,
                    totalTickets: 0,
                    totalCustomizations: 0
                });
                setRecentOrders([]);
                setRecentUsers([]);
                setRecentEvents([]);
                setRecentBlogPosts([]);
                setRecentPromotions([]);
                setRecentDiscounts([]);
                setRecentTickets([]);
                setRecentCustomizations([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format date helper
     const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            // More concise date format for lists
            return new Date(timestamp).toLocaleDateString('en-LK', {
                day: 'numeric', month: 'numeric', year: '2-digit'
            });
        } catch (e) { return 'Invalid Date'; }
    };

    // Status badge helper (keep existing)
    const getStatusClass = (status) => `status-badge status-${status?.toLowerCase() || 'unknown'}`;

    // Mock data for charts (replace with real analytics as needed)
    const orderStatusData = [
        { name: 'Pending', value: stats.pendingOrders },
        { name: 'Completed', value: stats.totalOrders - stats.pendingOrders },
    ];
    const userRoleData = [
        { name: 'Users', value: stats.totalUsers },
        { name: 'Admins', value: 1 }, // Replace with real admin count if available
    ];
    const productData = [
        { name: 'Products', value: stats.totalProducts },
        { name: 'Low Stock', value: stats.lowStockCount },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (isLoading) {
        return <div className="admin-dashboard loading">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="admin-dashboard error">Error: {error}</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="dashboard-charts" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
                {/* Pie Chart: Order Status */}
                <div style={{ flex: 1, minWidth: 300, background: 'white', borderRadius: 8, padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '1.1em', color: '#333' }}>Order Status Breakdown</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Bar Chart: Products */}
                <div style={{ flex: 1, minWidth: 300, background: 'white', borderRadius: 8, padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '1.1em', color: '#333' }}>Product Inventory</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={productData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" radius={[8,8,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Pie Chart: User Roles */}
                <div style={{ flex: 1, minWidth: 300, background: 'white', borderRadius: 8, padding: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '1.1em', color: '#333' }}>User Distribution</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={userRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                {userRoleData.map((entry, index) => (
                                    <Cell key={`cell-role-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- Stats Section --- */}
            <div className="dashboard-stats">
                {/* Product Stats */}
                <div className="stat-card">
                    <h2>Total Products</h2>
                    <p>{stats.totalProducts}</p>
                    <Link to="/admin/products">View Products</Link>
                </div>
                <div className={`stat-card ${stats.lowStockCount > 0 ? 'warning' : ''}`}>
                    <h2>Low Stock Items</h2>
                    <p>{stats.lowStockCount}</p>
                    {stats.lowStockCount > 0 && <Link to="/admin/products">View Items</Link>}
                </div>

                {/* Order Stats */}
                <div className="stat-card">
                    <h2>Total Orders</h2>
                    <p>{stats.totalOrders}</p>
                    <Link to="/admin/orders">View Orders</Link>
                </div>
                 <div className={`stat-card ${stats.pendingOrders > 0 ? 'info' : ''}`}>
                    <h2>Pending Orders</h2>
                    <p>{stats.pendingOrders}</p>
                    {stats.pendingOrders > 0 && <Link to="/admin/orders">View Pending</Link>}
                </div>

                 {/* User Stats <<< NEW */}
                 <div className="stat-card">
                    <h2>Total Users</h2>
                    <p><FiUsers /> {stats.totalUsers}</p> {/* Optional Icon */}
                    <Link to="/admin/users">View Users</Link>
                </div>

                {/* New Stats */}
                <div className="stat-card">
                    <h2>Events</h2>
                    <p><FiCalendar /> {stats.totalEvents}</p>
                    <Link to="/admin/events">View Events</Link>
                </div>
                <div className="stat-card">
                    <h2>Blog Posts</h2>
                    <p><FiFileText /> {stats.totalBlogPosts}</p>
                    <Link to="/admin/blog-posts">View Blog Posts</Link>
                </div>
                <div className="stat-card">
                    <h2>Promotions</h2>
                    <p><FiTag /> {stats.totalPromotions}</p>
                    <Link to="/admin/promotions">View Promotions</Link>
                </div>
                <div className="stat-card">
                    <h2>Discounts</h2>
                    <p><FiPercent /> {stats.totalDiscounts}</p>
                    <Link to="/admin/discounts">View Discounts</Link>
                </div>
                <div className="stat-card">
                    <h2>Tickets</h2>
                    <p><FiAward /> {stats.totalTickets}</p>
                    <Link to="/admin/tickets">View Tickets</Link>
                </div>
                <div className="stat-card customization-card">
                    <h2>Customizations</h2>
                    <p><FiSettings /> {stats.totalCustomizations}</p>
                    <Link to="/admin/customizations">View Customizations</Link>
                </div>
            </div>

            {/* --- Quick Actions Section (keep existing) --- */}
            <div className="dashboard-actions">
                {/* ... actions ... */}
                 <h2>Quick Actions</h2>
                <Link to="/admin/add" className="action-link">Add New Product</Link>
                {/* <Link to="/admin/orders/add" className="action-link">Add New Order</Link> */}
                <Link to="/admin/users/add" className="action-link">Add New User</Link> {/* Link to Add User */}
                <Link to="/admin/events/add" className="action-link">Add New Event</Link>
                <Link to="/admin/blog-posts/add" className="action-link">Add New Blog Post</Link>
                <Link to="/admin/promotions/add" className="action-link">Add New Promotion</Link>
                <Link to="/admin/discounts/add" className="action-link">Add New Discount</Link>
                <Link to="/admin/tickets/add" className="action-link">Add New Ticket</Link>
                <Link to="/admin/customizations/add" className="action-link">Add New Customization</Link>
                <a href={`${BACKEND_URL}/products/report/pdf`} target="_blank" rel="noopener noreferrer" className="action-link">Product Report (PDF)</a>
                 <Link to="/admin/orders/report" className="action-link">Generate Order Report</Link>
            </div>

             {/* --- Recent Activity Section (Combined or Separate) --- */}
             <div className="dashboard-recent-activity-grid"> {/* Optional Grid Layout */}

                 {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recent Orders</h2>
                        <ul className="recent-list"> {/* Use a common class */}
                            {recentOrders.map(order => (
                                 <li key={order._id}>
                                    <span className={getStatusClass(order.status)} title={order.status}></span> {/* Status Indicator */}
                                    <span className="item-info">
                                        Order <strong>#{order._id.slice(-6)}</strong> for {order.product}
                                    </span>
                                    <span className="item-meta">by {order.userName}</span>
                                    <span className="item-date"><FiClock /> {formatDate(order.date)}</span>
                                    <Link to={`/admin/orders/update/${order._id}`} className="view-link">View</Link>
                                </li>
                             ))}
                         </ul>
                         <Link to="/admin/orders" className="view-all-link">View All Orders &rarr;</Link>
                     </div>
                 )}

                 {/* Recent Users <<< NEW */}
                 {recentUsers.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recently Joined Users</h2>
                        <ul className="recent-list"> {/* Use a common class */}
                            {recentUsers.map(user => (
                                 <li key={user._id}>
                                     {/* Optional: Role Indicator */}
                                     <span className={`role-label role-${user.role?.toLowerCase()}`} title={user.role}></span>
                                    <span className="item-info">
                                        <strong>{user.name}</strong>
                                    </span>
                                    <span className="item-meta">{user.email}</span>
                                    <span className="item-date"><FiClock /> {formatDate(user.createdAt)}</span> {/* Use createdAt */}
                                    <Link to={`/admin/users/update/${user._id}`} className="view-link">View</Link>
                                </li>
                             ))}
                         </ul>
                         <Link to="/admin/users" className="view-all-link">View All Users &rarr;</Link>
                     </div>
                 )}

                 {/* Recent Events */}
                 {recentEvents.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recent Events</h2>
                        <ul className="recent-list">
                            {recentEvents.map(event => (
                                <li key={event._id}>
                                    <span className="item-info">
                                        <strong>{event.title}</strong>
                                    </span>
                                    <span className="item-meta">{event.location}</span>
                                    <span className="item-date"><FiCalendar /> {formatDate(event.date)}</span>
                                    <Link to={`/admin/events/update/${event._id}`} className="view-link">View</Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/admin/events" className="view-all-link">View All Events &rarr;</Link>
                    </div>
                 )}

                 {/* Recent Blog Posts */}
                 {recentBlogPosts.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recent Blog Posts</h2>
                        <ul className="recent-list">
                            {recentBlogPosts.map(post => (
                                <li key={post._id}>
                                    <span className="item-info">
                                        <strong>{post.title}</strong>
                                    </span>
                                    <span className="item-meta">by {post.author}</span>
                                    <span className="item-date"><FiFileText /> {formatDate(post.createdAt)}</span>
                                    <Link to={`/admin/blog-posts/update/${post._id}`} className="view-link">View</Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/admin/blog-posts" className="view-all-link">View All Blog Posts &rarr;</Link>
                    </div>
                 )}

                 {/* Recent Promotions */}
                 {recentPromotions.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recent Promotions</h2>
                        <ul className="recent-list">
                            {recentPromotions.map(promotion => (
                                <li key={promotion._id}>
                                    <span className="item-info">
                                        <strong>{promotion.title}</strong>
                                    </span>
                                    <span className="item-meta">{promotion.description}</span>
                                    <span className="item-date"><FiTag /> {formatDate(promotion.startDate)}</span>
                                    <Link to={`/admin/promotions/update/${promotion._id}`} className="view-link">View</Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/admin/promotions" className="view-all-link">View All Promotions &rarr;</Link>
                    </div>
                 )}

                 {/* Recent Discounts */}
                 {recentDiscounts.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recent Discounts</h2>
                        <ul className="recent-list">
                            {recentDiscounts.map(discount => (
                                <li key={discount._id}>
                                    <span className="item-info">
                                        <strong>{discount.code}</strong>
                                    </span>
                                    <span className="item-meta">{discount.percentage}% off</span>
                                    <span className="item-date"><FiPercent /> {formatDate(discount.expiryDate)}</span>
                                    <Link to={`/admin/discounts/update/${discount._id}`} className="view-link">View</Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/admin/discounts" className="view-all-link">View All Discounts &rarr;</Link>
                    </div>
                 )}

                 {/* Recent Tickets */}
                 {recentTickets.length > 0 && (
                    <div className="dashboard-recent-activity">
                        <h2>Recent Tickets</h2>
                        <ul className="recent-list">
                            {recentTickets.map(ticket => (
                                <li key={ticket._id}>
                                    <span className="item-info">
                                        <strong>{ticket.title}</strong>
                                    </span>
                                    <span className="item-meta">${ticket.price}</span>
                                    <span className="item-date"><FiAward /> {formatDate(ticket.createdAt)}</span>
                                    <Link to={`/admin/tickets/update/${ticket._id}`} className="view-link">View</Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/admin/tickets" className="view-all-link">View All Tickets &rarr;</Link>
                    </div>
                 )}

                 {/* Recent Customizations */}
                 {recentCustomizations.length > 0 && (
                    <div className="dashboard-recent-activity customization-activity">
                        <h2>Recent Customizations</h2>
                        <ul className="recent-list">
                            {recentCustomizations.map(customization => (
                                <li key={customization._id}>
                                    <span className="item-info">
                                        <strong>{customization.name}</strong>
                                    </span>
                                    <span className="item-meta">{customization.type}</span>
                                    <span className="item-date"><FiSettings /> {formatDate(customization.createdAt)}</span>
                                    <Link to={`/admin/customizations/update/${customization._id}`} className="view-link">View</Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/admin/customizations" className="view-all-link">View All Customizations &rarr;</Link>
                    </div>
                 )}

             </div>

        </div>
    );
}

export default AdminDashboard;
