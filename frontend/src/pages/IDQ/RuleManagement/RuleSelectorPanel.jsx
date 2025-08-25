import React from "react";

const RuleSelectorPanel = () => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-light">
        <h3 className="card-title m-0 text-primary">
          <span className="position-relative d-inline-block" style={{ fontSize: "1em" }}>
            <i className="fas fa-table"></i>
            <i
              className="fas fa-circle-check text-success position-absolute"
              style={{ fontSize: "0.5em", top: "-0.3em", right: "-0.6em" }}
            ></i>
          </span>
          Specify Table Details
        </h3>
      </div>
      <div className="card-body">
        <div id="rulesetSelectorPanel">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="manageCatalog" className="form-label">Catalog</label>
              <select id="manageCatalog" className="select2-searchable form-select" data-placeholder="Search catalog..."></select>
              <div id="totalRuleCountContainer" className="mt-2 d-none">
                <div className="d-flex align-items-center rounded px-2 py-1 bg-primary-subtle small" id="totalRuleBox" style={{ maxWidth: "180px" }}>
                  <i className="fas fa-table me-2" style={{ fontSize: "1rem" }}></i>
                  <div className="fw-bold" id="totalRuleCount">Total Rules: 0</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="manageSchema" className="form-label">Schema</label>
              <select id="manageSchema" className="select2-searchable form-select" disabled data-placeholder="Select schema..."></select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="manageAssetName" className="form-label">Table</label>
              <select id="manageAssetName" className="select2-searchable form-select" disabled data-placeholder="Select table..."></select>
              <div id="tableInfoContainer" className="mt-2 d-none">
                <a
                  id="viewMetadataBtn"
                  href="#"
                  className="d-flex align-items-center rounded px-2 py-1 bg-info-subtle small"
                  style={{ textDecoration: "none", maxWidth: "250px" }}
                  data-bs-toggle="offcanvas"
                  data-bs-target="#metadataOffcanvas"
                  aria-controls="metadataOffcanvas"
                  role="button"
                >
                  <span id="tableInfoMessage"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <div id="manageActions">
              <button id="viewRulesBtn" className="btn btn-primary d-none">
                <i className="fas fa-eye me-1"></i> View Rules
              </button>
              <button id="addFirstRuleBtn" className="btn btn-success d-none">
                <i className="fas fa-plus me-1"></i> Add First Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleSelectorPanel;
