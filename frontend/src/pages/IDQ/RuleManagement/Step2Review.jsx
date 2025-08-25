import React from "react";

const Step2Review = ({ wizardData, goBack, saveRuleset }) => {
  const { catalog, schema, table, rules } = wizardData;

  return (
    <div id="step2-review-section">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0 fw-bold">
                <i className="fas fa-database me-2 text-primary"></i>Datasource Details
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-1"><strong>Catalog:</strong> {catalog || "N/A"}</p>
              <p className="mb-1"><strong>Schema:</strong> {schema || "N/A"}</p>
              <p className="mb-0"><strong>Table:</strong> {table || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0 fw-bold">
                <i className="fas fa-clipboard-list me-2 text-primary"></i>Rules Summary
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-0"><strong>Total Rules:</strong> {rules.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0 fw-bold">
            <i className="fas fa-tasks me-2 text-primary"></i>Rules to be Saved
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0" id="reviewRulesTable">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "20%" }}>Column</th>
                  <th style={{ width: "20%" }}>Rule</th>
                  <th style={{ width: "40%" }}>Parameters</th>
                  <th style={{ width: "20%" }}>Operation</th>
                </tr>
              </thead>
              <tbody id="reviewRulesTableBody">
                {rules.length > 0 ? (
                  rules.map((rule, idx) => (
                    <tr key={idx}>
                      <td>{rule.column}</td>
                      <td>{rule.rule}</td>
                      <td>{rule.parameters}</td>
                      <td>
                        {/* Operation buttons */}
                        <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No rules to review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-primary" onClick={goBack}>
          <i className="fas fa-arrow-left me-1"></i> Back
        </button>
        <button className="btn btn-success" onClick={saveRuleset}>
          <i className="fas fa-save me-1"></i> Save Rule
        </button>
      </div>
    </div>
  );
};

export default Step2Review;
