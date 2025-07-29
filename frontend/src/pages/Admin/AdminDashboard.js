import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    totalCategories: 0,
    recentAds: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersRes, adsRes, categoriesRes] = await Promise.all([
          api.get('/users'),
          api.get('/ads'),
          api.get('/categories')
        ]);

        const recentAds = adsRes.data.slice(0, 5); // Get 5 most recent ads

        setStats({
          totalUsers: usersRes.data.users.length,
          totalAds: adsRes.data.length,
          totalCategories: categoriesRes.data.length,
          recentAds: recentAds
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
        <Link to="/" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Go to Homepage
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px', color: '#dc3545' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-content">
            <h3>{stats.totalAds}</h3>
            <p>Total Ads</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <h3>Admin</h3>
            <p>Control Panel</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/users" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </Link>

          <Link to="/admin/ads" className="action-card">
            <div className="action-icon">📢</div>
            <h3>Manage Ads</h3>
            <p>Review and manage advertisements</p>
          </Link>

          <Link to="/admin/categories" className="action-card">
            <div className="action-icon">📂</div>
            <h3>Manage Categories</h3>
            <p>Add and edit categories</p>
          </Link>

          <Link to="/admin/user-role" className="action-card">
            <div className="action-icon">👑</div>
            <h3>Update User Role</h3>
            <p>Make users admin or change roles</p>
          </Link>
        </div>
      </div>

      {/* Recent Ads */}
      <div className="recent-ads">
        <h2>Recent Ads</h2>
        {stats.recentAds.length === 0 ? (
          <p>No ads posted yet.</p>
        ) : (
          <div className="ads-list">
            {stats.recentAds.map(ad => (
              <div key={ad._id} className="ad-item">
                <div className="ad-info">
                  <h4>{ad.title}</h4>
                  <p className="ad-category">{ad.category}</p>
                  <p className="ad-date">
                    Posted on {new Date(ad.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="ad-actions">
                  <Link to={`/ads/${ad._id}`} className="view-btn">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="system-info">
        <h2>System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Platform:</strong> ARNGREN Classified Ads
          </div>
          <div className="info-item">
            <strong>Admin:</strong> {user.name}
          </div>
          <div className="info-item">
            <strong>Last Login:</strong> {new Date().toLocaleDateString()}
          </div>
          <div className="info-item">
            <strong>Status:</strong> <span className="status-active">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 