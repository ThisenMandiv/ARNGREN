import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// --- Import Layout Components ---
import Layout from './Components/Layout/Layout';
import UserNav from './Components/UserNav/UserNav';
import Footer from './Components/Footer/Footer';


// --- Import Protected Route Components ---
import UserProtectedRoute from './Components/ProtectedRoute/UserProtectedRoute';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

// --- Import User Auth Components ---
import Login from './pages/User/Login/Login';
import Register from './pages/User/Register/Register';
import UserProfile from './pages/User/UserProfile/UserProfile';
import EditUserProfile from './pages/User/EditUserProfile/EditUserProfile';

// --- Import Admin Components ---
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAds from './pages/Admin/AdminAds';
import AdminUserRole from './pages/Admin/AdminUserRole';
import AdminCategories from './pages/Admin/AdminCategories';

// --- Import Classified Ads Components ---
import Home from './pages/Ads/Home';
import AdList from './pages/Ads/AdList';
import AdDetail from './pages/Ads/AdDetail';
import PostAd from './pages/Ads/PostAd';
import UserAds from './pages/Ads/UserAds';
import EditAd from './pages/Ads/EditAd';

// --- App Component ---
function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* --- Classified Ads Routes (with Layout) --- */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/ads" element={
          <Layout>
            <AdList />
          </Layout>
        } />
        <Route path="/ads/category/:category" element={
          <Layout>
            <AdList />
          </Layout>
        } />
        <Route path="/ads/:id" element={
          <Layout>
            <AdDetail />
          </Layout>
        } />
        <Route path="/post-ad" element={
          <Layout>
            <UserProtectedRoute>
              <PostAd />
            </UserProtectedRoute>
          </Layout>
        } />
        <Route path="/my-ads" element={
          <Layout>
            <UserProtectedRoute>
              <UserAds />
            </UserProtectedRoute>
          </Layout>
        } />
        <Route path="/edit-ad/:id" element={
          <Layout>
            <UserProtectedRoute>
              <EditAd />
            </UserProtectedRoute>
          </Layout>
        } />

        {/* --- User Auth Routes (without Layout for cleaner login/register pages) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <Layout>
            <UserProtectedRoute>
              <UserProfile />
            </UserProtectedRoute>
          </Layout>
        } />
        <Route path="/profile/edit" element={
          <Layout>
            <UserProtectedRoute>
              <EditUserProfile />
            </UserProtectedRoute>
          </Layout>
        } />

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={
          <Layout>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/admin/users" element={
          <Layout>
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/admin/ads" element={
          <Layout>
            <ProtectedRoute>
              <AdminAds />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/admin/user-role" element={
          <Layout>
            <ProtectedRoute>
              <AdminUserRole />
            </ProtectedRoute>
          </Layout>
        } />
        <Route path="/admin/categories" element={
          <Layout>
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          </Layout>
        } />

        {/* --- Catch-all 404 Page --- */}
        <Route path="*" element={
          <Layout>
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
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
          </Layout>
        } />
      </Routes>

      {/* --- Persistent UI Components --- */}

      <Footer />
    </div>
  );
}

export default App;
  