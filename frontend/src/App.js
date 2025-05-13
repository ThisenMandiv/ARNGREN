import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// --- Import Layout Components ---
import Nav from './Components/Nav/Nav'; // Admin Nav
import UserNav from './Components/UserNav/UserNav';
import Footer from './Components/Footer/Footer';
import Chatbot from './Components/Chatbot/Chatbot';
import './Components/Chatbot/Chatbot.css';

// --- Import Protected Route Components ---
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import UserProtectedRoute from './Components/ProtectedRoute/UserProtectedRoute';

// --- Import Admin Page Components ---
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import AddProduct from './pages/Admin/AddProduct/AddProduct';
import ProductList from './pages/Admin/ProductList/ProductList';
import UpdateProduct from './pages/Admin/UpdateProduct/UpdateProduct';
import InventoryHistory from './pages/Admin/InventoryHistory/InventoryHistory';
import OrderList from './pages/Admin/OrderList/Orders';
import UpdateOrder from './pages/Admin/UpdateOrder/UpdateOrder';
import SearchOrders from './pages/Admin/SearchOrders/SearchOrders';
import OrderReportPage from './pages/Admin/OrderReport/OrderReportPage';
import EventList from './pages/Admin/EventList/EventList';
import AddEditEvent from './pages/Admin/AddEditEvent/AddEditEvent';
import BlogPostList from './pages/Admin/BlogPostList/BlogPostList';
import AddEditBlogPost from './pages/Admin/AddEditBlogPost/AddEditBlogPost';
import UserList from './pages/Admin/UserList/UserList';
import AddUser from './pages/Admin/AddUser/AddUser';
import UpdateUser from './pages/Admin/UpdateUser/UpdateUser';
import UpdateDiscount from './pages/Admin/UpdateDiscount/UpdateDiscount';
import PromotionsPage from './pages/promotions/PromotionsPage';
import PromotionForm from './Components/promotions/PromotionForm';
import PromotionUpdateForm from './Components/promotions/PromotionUpdateForm';
import CouponManager from './Components/coupons/CouponManager';

// --- Import User Page Components ---
import UserHome from './pages/User/UserHome/UserHome';
import ProductGallery from './pages/User/ProductGallery/ProductGallery';
import UserProductDetail from './pages/User/UserProductDetail/UserProductDetail';
import AboutUs from './pages/User/AboutUs/AboutUs';
import Blog from './pages/User/Blog/Blog';
import ContactUs from './pages/User/ContactUs/ContactUs';
import Events from './pages/User/Events/Events';
import Login from './pages/User/Login/Login';
import Register from './pages/User/Register/Register';
import Cart from './pages/User/Cart/Cart';
import Checkout from './pages/User/Checkout/Checkout';
import BlogPostDetail from './pages/User/BlogPostDetail/BlogPostDetail';
import UserProfile from './pages/User/UserProfile/UserProfile';
import EditUserProfile from './pages/User/EditUserProfile/EditUserProfile';
import UserOrderHistory from './pages/User/UserOrderHistory/UserOrderHistory';
import UserPromotions from './Components/promotions/UserPromotions';

// --- Import Discount Components ---
import DiscountList from './Components/discounts/DiscountList';
import DiscountPage from './Components/discounts/DiscountPage';
import DiscountForm from './Components/discounts/DiscountForm';
import UpdateDiscountForm from './Components/discounts/UpdateDiscountForm';

// --- Import Ticket Components ---
import TicketRaise from './Components/tickets/TicketRaise';
import TicketStatus from './Components/tickets/TicketStatus';
import AdminTickets from './Components/tickets/AdminTickets';

// --- Import Customization Components ---
import UserCustomizations from './Components/customization/UserCustomizations';
import AdminCustomizations from './Components/customization/AdminCustomizations';

// --- Import Reports Component ---
import AdminReports from './Components/reports/AdminReports';

// --- Admin Layout Component ---
const AdminLayout = ({ children }) => (
  <>
    <Nav />
    <div className="admin-page-content">{children}</div>
  </>
);

// --- App Component ---
function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* --- User Routes --- */}
        <Route path="/" element={<UserHome />} />
        <Route path="/products" element={<ProductGallery />} />
        <Route path="/product/:productId" element={<UserProductDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:identifier" element={<BlogPostDetail />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/promotions" element={<UserPromotions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<UserProtectedRoute><UserProfile /></UserProtectedRoute>} />
        <Route path="/profile/edit" element={<UserProtectedRoute><EditUserProfile /></UserProtectedRoute>} />
        <Route path="/order-history" element={<UserProtectedRoute><UserOrderHistory /></UserProtectedRoute>} />
        <Route path="/discounts" element={<DiscountPage />} />
        <Route path="/raise-ticket" element={<UserProtectedRoute><TicketRaise /></UserProtectedRoute>} />
        <Route path="/view-tickets" element={<UserProtectedRoute><TicketStatus /></UserProtectedRoute>} />
        <Route path="/my-customizations" element={<UserCustomizations />} />

        {/* --- Admin Routes --- */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><ProductList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute><AdminLayout><PromotionsPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/promotions/add" element={<ProtectedRoute><AdminLayout><PromotionForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/promotions/update/:id" element={<ProtectedRoute><AdminLayout><PromotionUpdateForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AdminLayout><AddProduct /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/update/:id" element={<ProtectedRoute><AdminLayout><UpdateProduct /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/history/:id" element={<ProtectedRoute><AdminLayout><InventoryHistory /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><OrderList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders/update/:id" element={<ProtectedRoute><AdminLayout><UpdateOrder /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders/search" element={<ProtectedRoute><AdminLayout><SearchOrders /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders/report" element={<ProtectedRoute><AdminLayout><OrderReportPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute><AdminLayout><EventList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/events/add" element={<ProtectedRoute><AdminLayout><AddEditEvent /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/events/edit/:id" element={<ProtectedRoute><AdminLayout><AddEditEvent /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute><AdminLayout><BlogPostList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/blog/add" element={<ProtectedRoute><AdminLayout><AddEditBlogPost /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/blog/edit/:id" element={<ProtectedRoute><AdminLayout><AddEditBlogPost /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminLayout><UserList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users/add" element={<ProtectedRoute><AdminLayout><AddUser /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users/update/:id" element={<ProtectedRoute><AdminLayout><UpdateUser /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/discounts" element={<ProtectedRoute><AdminLayout><DiscountList /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/discounts/add" element={<ProtectedRoute><AdminLayout><DiscountForm /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/discounts/update/:id" element={<ProtectedRoute><AdminLayout><UpdateDiscount /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/tickets" element={<ProtectedRoute><AdminLayout><AdminTickets /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/customizations" element={<ProtectedRoute><AdminLayout><AdminCustomizations /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/coupons" element={<ProtectedRoute><AdminLayout><CouponManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/report" element={<ProtectedRoute><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />

        {/* --- Redirects --- */}
        <Route path="/mainhome" element={<Navigate replace to="/" />} />
        <Route path="/conus" element={<Navigate replace to="/contact" />} />

        {/* --- Catch-all 404 Page --- */}
        <Route path="*" element={
          <div>
            <UserNav />
            <h1 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</h1>
            <p style={{ textAlign: 'center' }}>The page you are looking for does not exist.</p>
            <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>Go to Homepage</Link>
          </div>
        } />
      </Routes>
    

      {/* --- Persistent UI Components --- */}
      <Chatbot />
      <Footer />
    </div>
  );
  
}


  export default App;
  