import React from "react";

export const EditModal = ({ show, onClose, onSave }) => (
  <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Validation Rule</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="editRuleType">Rule</label>
            <select id="editRuleType" disabled className="form-select bg-light"></select>
          </div>
          <div id="editParameterFields"></div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  </div>
);

export default EditModal;
