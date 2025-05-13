import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/User/Login/Login';
import Register from './pages/User/Register/Register';
import Home from './pages/User/Home/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductList from './pages/Admin/ProductList';
import AddProduct from './pages/Admin/AddProduct';
import UpdateProduct from './pages/Admin/UpdateProduct';
import DiscountPage from './Components/discounts/DiscountPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discounts" element={<DiscountPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/update/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 