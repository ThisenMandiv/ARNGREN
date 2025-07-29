// src/Components/Nav/Nav.js - Your Admin Sidebar
import React from 'react';
import { NavLink } from "react-router-dom";
import './nav.css';
// Optional: Import icons
// import { /*...,*/ FiUsers } from 'react-icons/fi';

function Nav() {
    const getNavLinkClass = ({ isActive }) => {
        return isActive ? "admin-sidebar-link active" : "admin-sidebar-link";
    };

    return (
        <nav className="admin-sidebar">
            <div className="admin-sidebar-brand">
                <NavLink to="/admin">🇳🇴 Admin Panel</NavLink>
            </div>

            <ul className="admin-sidebar-nav-list">
                {/* Dashboard */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin" className={getNavLinkClass} end> Dashboard </NavLink>
                </li>

                {/* Product Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/products" className={getNavLinkClass}> Products </NavLink>
                </li>
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/add" className={getNavLinkClass}> Add Product </NavLink>
                </li>
                {/* Discounts Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/discounts" className={getNavLinkClass}> Discounts </NavLink>
                    <ul style={{paddingLeft: '20px', margin: 0}}>
                        <li>
                            <NavLink to="/admin/discounts/add" className={getNavLinkClass}>+ Add Discount</NavLink>
                        </li>
                    </ul>
                </li>

                {/* Coupon Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/coupons" className={getNavLinkClass}> Coupon Manager </NavLink>
                </li>
                {/* ADMIN REPORT */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/report" className={getNavLinkClass}> ADMIN REPORT </NavLink>
                </li>

                {/* Promotions Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/promotions" className={getNavLinkClass}> Promotions </NavLink>
                    <ul style={{paddingLeft: '20px', margin: 0}}>
                       
                    </ul>
                </li>

                {/* Order Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/orders" className={getNavLinkClass}> Orders </NavLink>
                </li>
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/orders/search" className={getNavLinkClass}> Search Orders </NavLink>
                </li>
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/orders/report" className={getNavLinkClass}> Order Report </NavLink>
                </li>

                {/* Event Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/events" className={getNavLinkClass}> Events </NavLink>
                </li>
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/events/add" className={getNavLinkClass}> Add Event </NavLink>
                </li>

                {/* Blog Management */}
                 <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/blog" className={getNavLinkClass}> Blog Posts </NavLink>
                </li>
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/blog/add" className={getNavLinkClass}> Add Blog Post </NavLink>
                </li>

                {/* Tickets Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/tickets" className={getNavLinkClass}> Tickets </NavLink>
                </li>

                {/* Customizations Management */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/customizations" className={getNavLinkClass}> Customizations </NavLink>
                </li>

                {/* --- NEW: User Management --- */}
                <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/users" className={getNavLinkClass}>
                        {/* <FiUsers /> */} Users
                    </NavLink>
                </li>
                 {/* Optional: Add User link - Usually users register themselves */}
                 {/* <li className="admin-sidebar-nav-item">
                    <NavLink to="/admin/users/add" className={getNavLinkClass}> Add User </NavLink>
                 </li> */}
                 {/* --- End User Management --- */}


                 <li className="admin-sidebar-nav-item spacer"></li>

                 {/* View User Site */}
                 <li className="admin-sidebar-nav-item user-site-link">
                    <NavLink to="/" className="admin-sidebar-link"> View User Site </NavLink>
                 </li>
            </ul>
        </nav>
    );
}

export default Nav;
