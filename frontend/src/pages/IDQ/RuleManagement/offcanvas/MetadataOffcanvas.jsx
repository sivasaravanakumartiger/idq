import React from "react";

const MetadataOffcanvas = () => {
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="metadataOffcanvas" aria-labelledby="metadataOffcanvasLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="metadataOffcanvasLabel"><i className="fas fa-table-list me-2"></i>Table Metadata</h5>
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <div className="mb-3">
          <label className="form-label fw-bold">Table Name</label>
          <p className="text-muted" id="modalTableName"><em>N/A</em></p>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered" id="metadataTable">
            <thead className="table-light">
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Constraints</th>
                <th>Nullable</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div id="noMetadataMessage" className="alert alert-secondary text-center d-none">
            No metadata available for this table.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataOffcanvas;
