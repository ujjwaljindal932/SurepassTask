import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import CustomerList from '../CustomerList/CustomerList';
import BillGenerator from '../BillGenerator/BillGenerator';
import { useSelector } from 'react-redux';
import './Dashboard.css';

const Dashboard = () => {
  const { showSuccessModal } = useSelector(state => state.bill);

  return (
    <div className="dashboard-container">
      <SideNav />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/customers" />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/bill-generator" element={<BillGenerator />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;