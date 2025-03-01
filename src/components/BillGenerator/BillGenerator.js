import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBillField,
  addItem,
  removeItem,
  updateItem,
  calculateTotals,
  setShowSuccessModal,
  setCurrency,
  setExchangeRate
} from '../../redux/slices/billSlice';
import { addCustomer } from '../../redux/slices/customersSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SuccessModal from '../SuccessModal/SuccessModal';
import './BillGenerator.css';


const BillGenerator = () => {
  const dispatch = useDispatch();
  const billState = useSelector(state => state.bill);
  const invoiceRef = useRef(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    dispatch(setExchangeRate(75));
  }, [dispatch]);


  const validateForm = () => {
    const newErrors = {};

    if (!billState.client.trim()) {
      newErrors.client = 'Client name is required';
    }


    if (!billState.number.trim()) {
      newErrors.number = 'Number is required';
    }


    if (!billState.year.trim()) {
      newErrors.year = 'Year is required';
    }


    if (!billState.date) {
      newErrors.date = 'Date is required';
    }


    if (!billState.expireDate) {
      newErrors.expireDate = 'Expire date is required';
    }


    // Validate date logic
    if (billState.date && billState.expireDate && 
        new Date(billState.expireDate) <= new Date(billState.date)) {
      newErrors.expireDate = 'Expire date must be after the bill date';
    }


    // Validate items
    const hasEmptyItems = billState.items.some(
      item => !item.item.trim() || !item.quantity || !item.price
    );


    if (hasEmptyItems) {
      newErrors.items = 'All items must have a name, quantity, and price';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    dispatch(setBillField({ field: name, value }));
  };


  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    dispatch(setCurrency(newCurrency));
  };


  const handleItemChange = (id, field, value) => {
    if (errors.items) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
    dispatch(updateItem({ id, field, value }));
    dispatch(calculateTotals());
  };


  const handleAddItem = () => {
    dispatch(addItem());
  };


  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
    dispatch(calculateTotals());
  };


  const handleSaveInvoice = () => {
    if (validateForm()) {
      const customerId = Date.now().toString();
      dispatch(addCustomer({
        id: customerId,
        ...billState,
        status: billState.status
      }));
      dispatch(setShowSuccessModal(true));
    }
  };


  const downloadInvoice = () => {
    if (validateForm()) {
      const input = invoiceRef.current;
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`invoice-${billState.client}-${billState.number}.pdf`);
        setShowDownloadModal(true);
      });
    }
  };


  const getCurrencySymbol = () => {
    return billState.currency === 'USD' ? '$' : '₹';
  };


  const closeDownloadModal = () => {
    setShowDownloadModal(false);
  };


  return (
    <>
      <div className="bill-generator-container">
        <h2 className="mb-4">Bill Generator</h2>
        
        <div className="invoice-container" ref={invoiceRef}>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="client" className="form-label required-field">Client</label>
                <input
                  type="text"
                  className={`form-control ${errors.client ? 'is-invalid' : ''}`}
                  id="client"
                  name="client"
                  value={billState.client}
                  onChange={handleInputChange}
                  required
                />
                {errors.client && (
                  <div className="invalid-feedback">
                    {errors.client}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label htmlFor="number" className="form-label required-field">Number</label>
                <input
                  type="text"
                  className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                  id="number"
                  name="number"
                  value={billState.number}
                  onChange={handleInputChange}
                  required
                />
                {errors.number && (
                  <div className="invalid-feedback">
                    {errors.number}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label htmlFor="year" className="form-label required-field">Year</label>
                <input
                  type="text"
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  id="year"
                  name="year"
                  value={billState.year}
                  onChange={handleInputChange}
                  required
                />
                {errors.year && (
                  <div className="invalid-feedback">
                    {errors.year}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={billState.status}
                  onChange={handleInputChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>


          <div className="row mb-4">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="note" className="form-label">Note</label>
                <input
                  type="text"
                  className="form-control"
                  id="note"
                  name="note"
                  value={billState.note}
                  onChange={handleInputChange}
                  placeholder="Address"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="date" className="form-label required-field">Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  id="date"
                  name="date"
                  value={billState.date}
                  onChange={handleInputChange}
                  required
                />
                {errors.date && (
                  <div className="invalid-feedback">
                    {errors.date}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="expireDate" className="form-label required-field">Expire Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.expireDate ? 'is-invalid' : ''}`}
                  id="expireDate"
                  name="expireDate"
                  value={billState.expireDate}
                  onChange={handleInputChange}
                  required
                />
                {errors.expireDate && (
                  <div className="invalid-feedback">
                    {errors.expireDate}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label htmlFor="currency" className="form-label">Currency</label>
                <select
                  className="form-select"
                  id="currency"
                  name="currency"
                  value={billState.currency}
                  onChange={handleCurrencyChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
                {billState.currency === 'INR' && (
                  <small className="text-muted">1 USD = {billState.exchangeRate} INR</small>
                )}
              </div>
            </div>
          </div>


          <div className="row mb-4">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billState.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.item}
                            onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <div className="input-group">
                            <span className="input-group-text">{getCurrencySymbol()}</span>
                            <input
                              type="number"
                              className="form-control"
                              value={item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </td>
                        <td>{getCurrencySymbol()}{(item.quantity * item.price).toFixed(2)}</td>
                        <td>
                          {billState.items.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {errors.items && (
                  <div className="table-error-message">
                    {errors.items}
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="row mb-3">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddItem}
              >
                + Add field
              </button>
            </div>
          </div>


          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveInvoice}
                >
                  Save Invoice
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={downloadInvoice}
                >
                  Download Invoice
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="invoice-totals">
                <div className="row mb-2">
                  <div className="col-6 text-end">Sub Total:</div>
                  <div className="col-6">
                    <div className="input-group">
                      <span className="input-group-text">{getCurrencySymbol()}</span>
                      <input
                        type="text"
                        className="form-control"
                        value={billState.subTotal.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-6 text-end">Tax ({billState.taxRate}%):</div>
                  <div className="col-6">
                    <div className="input-group">
                      <span className="input-group-text">{getCurrencySymbol()}</span>
                      <input
                        type="text"
                        className="form-control"
                        value={billState.taxAmount.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="row font-weight-bold">
                  <div className="col-6 text-end">Total:</div>
                  <div className="col-6">
                    <div className="input-group">
                      <span className="input-group-text">{getCurrencySymbol()}</span>
                      <input
                        type="text"
                        className="form-control"
                        value={billState.total.toFixed(2)}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {billState.showSuccessModal && (
        <SuccessModal type="save" status={billState.status} />
      )}
      {showDownloadModal && (
        <SuccessModal type="download" onClose={closeDownloadModal} />
      )}
    </>
  );
};


export default BillGenerator;


