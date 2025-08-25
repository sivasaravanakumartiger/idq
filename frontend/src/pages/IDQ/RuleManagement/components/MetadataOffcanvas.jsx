// frontend/src/pages/IDQ/RuleManagement/components/MetadataOffcanvas.jsx
import React from "react";

const MetadataOffcanvas = ({ show = false, onClose = () => {}, tableInfo = null }) => {
  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      tabIndex="-1"
      style={{ visibility: show ? "visible" : "hidden" }}
      aria-labelledby="metadataOffcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="metadataOffcanvasLabel">
          <i className="fas fa-table-list me-2"></i>Table Metadata
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
      <div className="offcanvas-body">
        <div className="mb-3">
          <label className="form-label fw-bold">Table Name</label>
          <p className="text-muted">
            <em>{tableInfo?.tableName || "N/A"}</em>
          </p>
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Constraints</th>
                <th>Nullable</th>
              </tr>
            </thead>
            <tbody>
              {tableInfo?.columns?.length ? (
                tableInfo.columns.map((col) => (
                  <tr key={col.name}>
                    <td>{col.name}</td>
                    <td>{col.dataType}</td>
                    <td>{col.constraints || "-"}</td>
                    <td>{col.nullable ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No metadata available for this table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetadataOffcanvas;
