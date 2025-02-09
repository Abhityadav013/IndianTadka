// Modal.js
import React from 'react';
import './Modal.css'; // Importing the modal's CSS

const Modal = ({ children, onClose, size = 'medium' }) => {
  const handleOverlayClick = (e) => {
    // Close modal if clicked outside
    onClose();
  };

  const handleModalClick = (e) => {
    // Stop propagation to prevent closing the modal when clicked inside
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal-content ${size}`}
        onClick={handleModalClick}
      >
        <button className="modal-close" onClick={onClose}>×</button> {/* Close button styled better */}
        <div className="modal-body">{children}</div> {/* Wrap content in body to manage overflow */}
      </div>
    </div>
  );
};

export default Modal;
