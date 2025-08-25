// frontend/src/pages/IDQ/RuleManagement/components/RuleModals.jsx
import React from "react";

export const ResultModal = ({ show, title, message, onClose }) => (
  <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Return to Rulesets
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ResultModal;
