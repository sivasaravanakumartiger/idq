import React from "react";

export const RuleModal = ({ show, onClose, onAddRule }) => {
  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" aria-labelledby="modalTitle" style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalTitle">Add New Validation Rule</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div id="ruleModalContent"></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onAddRule}>Add Rule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleModal;
