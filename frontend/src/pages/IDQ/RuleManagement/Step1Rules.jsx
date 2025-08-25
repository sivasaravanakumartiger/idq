import React, { useState, useEffect } from "react";

const Step1Rules = ({ wizardData, updateWizardData, goToReview }) => {
  const [rules, setRules] = useState(wizardData.rules || []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    updateWizardData({ rules });
  }, [rules]);

  const handleAddRule = () => {
    // Open modal logic (keep your existing JS modal logic)
    console.log("Open Add/Edit Rule modal");
  };

  const filteredRules = rules.filter(
    (r) =>
      r.column?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="step1-rules-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="m-0 fw-bold text-dark">Defined Rules</h6>
        <div className="d-flex align-items-center">
          <button
            id="addRuleBtn"
            className="btn btn-primary btn-sm me-2"
            onClick={handleAddRule}
          >
            <i className="fas fa-pen-to-square me-1"></i> Add/Edit Rule
          </button>
          <div className="input-group" style={{ width: 250 }}>
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive border rounded">
        <table className="table table-bordered table-hover mb-0" id="wizardRulesTable">
          <thead className="thead-light">
            <tr>
              <th>Column</th>
              <th>Rule</th>
              <th>Parameters</th>
              <th>Status</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody id="wizardRulesTableBody">
            {filteredRules.length > 0 ? (
              filteredRules.map((rule, idx) => (
                <tr key={idx}>
                  <td>{rule.column}</td>
                  <td>{rule.rule}</td>
                  <td>{rule.parameters}</td>
                  <td>{rule.status}</td>
                  <td>
                    {/* Operation buttons */}
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  This ruleset contains no validation rules. Add a new rule to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-primary" onClick={goToReview}>
          Next: Review <i className="fas fa-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};

export default Step1Rules;
