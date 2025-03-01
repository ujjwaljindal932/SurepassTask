import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import './SideNav.css';


const SideNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarActive, setIsSidebarActive] = useState(false);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };


  const closeSidebar = () => {
    setIsSidebarActive(false);
  };


  return (
    <>
      <button className="menu-toggle" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </button>


      <div 
        className={`sidebar-overlay ${isSidebarActive ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>


      <div className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h4>
            <i className="bi bi-receipt-cutoff"></i>
            Invoice System
          </h4>
        </div>


        <div className="sidebar-menu">
          <NavLink 
            to="/customers" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <i className="bi bi-people-fill"></i>
            Customers List
          </NavLink>


          <NavLink 
            to="/bill-generator" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <i className="bi bi-file-earmark-text-fill"></i>
            Bill Generator
          </NavLink>
        </div>


        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};


export default SideNav;




