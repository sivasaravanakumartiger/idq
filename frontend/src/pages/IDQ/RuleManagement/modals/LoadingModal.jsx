import React from "react";

export const LoadingModal = ({ show, title = "Please wait...", message = "Your rule is getting ready." }) => (
  <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
    <div className="modal-dialog modal-sm modal-dialog-centered">
      <div className="modal-content text-center py-4">
        <div className="loader mx-auto mb-3"></div>
        <h5 className="mb-2 text-dark">{title}</h5>
        <p className="text-muted">{message}</p>
      </div>
    </div>
  </div>
);

export default LoadingModal;
