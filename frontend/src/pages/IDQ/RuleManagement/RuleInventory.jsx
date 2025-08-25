import React from "react";

const RuleInventory = ({ onSelectRuleset }) => {
  return (
    <div className="card border-0 shadow-sm" id="rulesetsTableContainer">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h3 className="card-title m-0 text-primary">
          <i className="fas fa-list-check me-2"></i>
          Rule Inventory
        </h3>
        <div className="input-group w-auto mt-2 mt-md-0">
          <span className="input-group-text bg-white">
            <i className="fas fa-search text-muted"></i>
          </span>
          <input id="rulesetsSearchBox" type="text" className="form-control border-start-0" placeholder="Search rulesets..." />
        </div>
      </div>
      <div className="card-body p-0">
        <div id="rulesetsTableWithControls">
          <div id="rulesetsLoading" className="d-none text-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading rules...</span>
          </div>
          <div className="table-responsive">
            <table id="rulesetsTable" className="table table-hover w-100">
              <thead className="thead-light">
                <tr>
                  <th>Catalog Name</th>
                  <th>Schema Name</th>
                  <th>Table Name</th>
                  <th>Total Rules</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div id="noRulesetsMessageContainer" className="d-none">
          <div className="alert alert-info mt-3">
            <i className="fas fa-info-circle me-2"></i>
            There are no validation rulesets configured yet. Select a catalog and table above to create your first ruleset.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleInventory;
