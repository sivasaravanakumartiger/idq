// frontend/src/pages/IDQ/RuleManagement/components/ResultModal.jsx
import React from "react";

const ResultModal = ({ show = false, onClose = () => {}, title = "", message = "" }) => {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      aria-labelledby="resultModalTitle"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="resultModalTitle">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            />
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
};

export default ResultModal;
