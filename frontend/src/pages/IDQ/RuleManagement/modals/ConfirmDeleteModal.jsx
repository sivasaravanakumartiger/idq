import React from "react";

export const ConfirmDeleteModal = ({ show, ruleName, onCancel, onDelete }) => (
  <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header bg-danger text-white">
          <h5 className="modal-title">Confirm Deletion</h5>
          <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
        </div>
        <div className="modal-body">
          Are you sure you want to delete rule "<strong>{ruleName}</strong>"? This action cannot be undone.
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmDeleteModal;
