import React from "react";

const RulesetDetails = () => {
  return (
    <div id="rulesetDetailsSection" className="card d-none">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="m-0 fw-bold text-primary">
          Ruleset Details: <span id="rulesetDetailName"></span>
        </h5>
        <div>
          <button className="btn btn-sm btn-outline-primary" onClick={() => window.hideRulesetDetails()}>
            <i className="fas fa-arrow-left me-1"></i> Back to Rule Selection
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="m-0 fw-bold text-dark">Defined Rules</h6>
          <div className="d-flex align-items-center">
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => window.showRulesetManagementWizard()}>
              <i className="fas fa-pen-to-square me-1"></i> Modify Rules
            </button>
            <div className="input-group ms-2" style={{ width: 250 }}>
              <span className="input-group-text"><i className="fas fa-search"></i></span>
              <input id="rulesetDetailSearch" type="text" className="form-control" placeholder="Search rules..." />
            </div>
          </div>
        </div>
        <div className="table-responsive border rounded">
          <table className="table table-bordered table-hover mb-0" id="rulesetDetailTable">
            <thead className="thead-light">
              <tr>
                <th>Column</th>
                <th>Rule</th>
                <th>Parameters</th>
                <th>DQ Dimension</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="rulesetDetailBody"></tbody>
          </table>
        </div>
        <div id="noRulesMessage" className="alert alert-info mt-3 d-none">
          This ruleset contains no validation rules.
        </div>
        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
          <small className="text-muted">
            Showing <span id="rulesetDetailPagination-start">0</span> to <span id="rulesetDetailPagination-end">0</span> of <span id="rulesetDetailPagination-total">0</span> rules
          </small>
          <nav aria-label="Page navigation for ruleset details">
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item">
                <button className="page-link" id="rulesetDetailPrevPage"><i className="fas fa-angle-left"></i></button>
              </li>
              <div className="d-flex" id="rulesetDetailPageNumbers"></div>
              <li className="page-item">
                <button className="page-link" id="rulesetDetailNextPage"><i className="fas fa-angle-right"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default RulesetDetails;
