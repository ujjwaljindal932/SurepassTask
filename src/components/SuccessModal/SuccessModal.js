import React,{useEffect} from 'react';
import './SuccessModal.css';
import { useDispatch } from 'react-redux';
import { setShowSuccessModal } from '../../redux/slices/billSlice';
// import './SuccessModal.css';

const SuccessModal = ({ type, status, onClose }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        if (type === 'save') {
            dispatch(setShowSuccessModal(false));
        }
    };
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

  
  const getStatusMessage = () => {
    if (type === 'download') {
      return 'Your invoice has been downloaded successfully.';
    }
    
    switch (status) {
      case 'Draft':
        return 'Your invoice draft has been saved successfully.';
      case 'Sent':
        return 'Your invoice has been saved and marked as sent.';
      case 'Paid':
        return 'Your invoice has been saved and marked as paid.';
      default:
        return 'Your invoice has been saved successfully.';
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="success-modal">
          <div className="success-icon">
            <i className={`bi ${type === 'download' ? 'bi-file-earmark-arrow-down-fill' : 'bi-check-circle-fill'}`}></i>
          </div>
          <h3>Success!</h3>
          <p>{getStatusMessage()}</p>
          <button 
            className="btn btn-primary w-100" 
            onClick={handleClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;