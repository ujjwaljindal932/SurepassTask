import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CustomerList.css";
// import SuccessModal from '../SuccessModal/SuccessModal';


const CustomerList = () => {
  const { customers } = useSelector((state) => state.customers);
  const navigate = useNavigate();
  const handleAddNewBill = () => {
    navigate('/bill-generator');
  };

  return (
    <div className="customer-list-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customers List</h2>
        
      </div>
      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            No customers found. Generate a bill to add customers.
          </div>
          <button 
            className="btn btn-primary mt-3"
            onClick={handleAddNewBill}
          >
            <i className="bi bi-plus-lg"></i> Generate Your First Bill
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped customer-table">
            <thead className="table-dark">
              <tr>
                <th>Client Name</th>
                <th>Contact Details</th>
                <th>Address</th>
                <th>Billing Date</th>
                <th>Product Quantity</th>
                <th>Billing Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.client}</td>
                  <td>{customer.number}</td>
                  <td>{customer.note}</td>
                  <td>{customer.date}</td>
                  <td>
                    {customer.items.reduce(
                      (sum, item) => sum + parseInt(item.quantity || 0),
                      0
                    )}
                  </td>
                  <td>
                    {customer.currency === "INR" ? "₹" : "$"}
                    {customer.total.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        customer.status === "Paid"
                          ? "bg-success"
                          : customer.status === "Sent"
                          ? "bg-warning"
                          : "bg-secondary"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );



};

export default CustomerList;
