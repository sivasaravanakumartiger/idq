// frontend/src/pages/IDQ/RuleManagement/components/LoadingModal.jsx
import React from "react";

const LoadingModal = ({
  show = false,
  title = "Please wait...",
  message = "Your rule is getting ready.",
}) => {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      aria-labelledby="loadingModalLabel"
      aria-hidden={!show}
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center py-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mb-2 text-dark">{title}</h5>
            <p className="text-muted">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
