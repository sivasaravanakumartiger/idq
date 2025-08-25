// frontend/src/pages/IDQ/RuleManagement/components/RuleInventoryTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const RuleInventoryTable = ({ state, setState, fetchRulesetDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch rulesets when catalog, schema, or table changes
  useEffect(() => {
    if (!state.selectedCatalog || !state.selectedSchema || !state.selectedTable) return;

    const fetchRulesets = async () => {
      try {
        const res = await axios.get("/manage_rulesets/get_all_rule_summary", {
          params: {
            catalog: state.selectedCatalog,
            schema: state.selectedSchema,
            table: state.selectedTable,
          },
        });
        setState((prev) => ({
          ...prev,
          rulesetsData: res.data.rulesets || [],
        }));
      } catch (err) {
        console.error("Failed to fetch rulesets:", err);
        setState((prev) => ({ ...prev, rulesetsData: [] }));
      }
    };

    fetchRulesets();
  }, [state.selectedCatalog, state.selectedSchema, state.selectedTable]);

  const handleViewRules = (ruleset) => {
    setState((prev) => ({
      ...prev,
      currentlyViewingRuleset: ruleset,
    }));
    fetchRulesetDetails(ruleset.id);
  };

  const filteredRulesets = state.rulesetsData.filter((r) =>
    r.ruleset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h3 className="card-title m-0 text-primary">
          <i className="fas fa-list-check me-2"></i> Rule Inventory
        </h3>
        <div className="input-group w-auto mt-2 mt-md-0">
          <span className="input-group-text bg-white">
            <i className="fas fa-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search rulesets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="card-body p-0">
        {filteredRulesets.length === 0 ? (
          <div className="alert alert-info mt-3">
            <i className="fas fa-info-circle me-2"></i>
            No validation rulesets found for the selected catalog/table.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover w-100">
              <thead className="thead-light">
                <tr>
                  <th>Catalog Name</th>
                  <th>Schema Name</th>
                  <th>Table Name</th>
                  <th>Total Rules</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRulesets.map((r) => (
                  <tr key={r.id}>
                    <td>{r.catalog_name}</td>
                    <td>{r.schema_name}</td>
                    <td>{r.table_name}</td>
                    <td>{r.total_rules}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleViewRules(r)}
                      >
                        <i className="fas fa-eye me-1"></i> View
                      </button>
                      {/* Additional actions like Edit/Delete can be added here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleInventoryTable;
