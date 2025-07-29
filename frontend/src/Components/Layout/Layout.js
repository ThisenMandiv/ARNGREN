import React from 'react';
import UserNav from '../UserNav/UserNav';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <UserNav />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 