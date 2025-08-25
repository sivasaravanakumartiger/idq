// frontend/src/pages/IDQ/RuleManagement/RuleManagementPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RuleSelectorPanel from "./components/RuleSelectorPanel";
import RuleInventoryTable from "./components/RuleInventoryTable";
import LoadingModal from "./components/Modals/LoadingModal";
import ResultModal from "./components/Modals/ResultModal";
import MetadataOffcanvas from "./components/MetadataOffcanvas";

const RuleManagementPage = () => {
  const [state, setState] = useState({
    catalogStructure: null,
    selectedCatalog: null,
    selectedSchema: null,
    selectedTable: null,
    rulesetsData: [],
    allRulesetsSummary: [],
    loading: false,
    showResultModal: false,
    resultMessage: "",
    metadata: null,
  });

  const apiEndpoints = {
    catalog_structure: "/manage_rulesets/catalog_structure",
    table_metadata: "/manage_rulesets/table_metadata",
    rules: "/manage_rulesets/get_rules",
    submit: "/manage_rulesets/upsert_rules",
    all_rule_summary: "/manage_rulesets/get_all_rule_summary",
    all_rule_detail: "/manage_rulesets/get_rules_details",
    rule_delete: "/manage_rulesets/delete_rule_by_id",
    delete_multiple_rules: "/manage_rulesets/delete_multiple_rules",
    add_rule: "/manage_rulesets/add_rule_to_ruleset",
    update_rule: "/manage_rulesets/update_rule_by_id",
    table_info: "/manage_rulesets/get_table_info",
  };

  // Fetch catalog structure on mount
  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    axios
      .get(apiEndpoints.catalog_structure)
      .then((res) => {
        setState((prev) => ({
          ...prev,
          catalogStructure: res.data,
          loading: false,
        }));
      })
      .catch((err) => {
        console.error("Error fetching catalog structure:", err);
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  // Fetch rulesets whenever catalog/schema/table changes
  useEffect(() => {
    const { selectedCatalog, selectedSchema, selectedTable } = state;
    if (selectedCatalog && selectedSchema && selectedTable) {
      setState((prev) => ({ ...prev, loading: true }));
      axios
        .get(apiEndpoints.rules, {
          params: {
            catalog: selectedCatalog,
            schema: selectedSchema,
            table: selectedTable,
          },
        })
        .then((res) => {
          setState((prev) => ({
            ...prev,
            rulesetsData: res.data.rulesets || [],
            loading: false,
          }));
        })
        .catch((err) => {
          console.error("Error fetching rules:", err);
          setState((prev) => ({ ...prev, loading: false }));
        });
    }
  }, [state.selectedCatalog, state.selectedSchema, state.selectedTable]);

  const handleShowResult = (message) => {
    setState((prev) => ({ ...prev, resultMessage: message, showResultModal: true }));
  };

  const handleCloseResult = () => {
    setState((prev) => ({ ...prev, showResultModal: false, resultMessage: "" }));
  };

  const fetchTableMetadata = (tableName) => {
    if (!tableName) return;
    axios
      .get(apiEndpoints.table_info, { params: { table: tableName } })
      .then((res) => {
        setState((prev) => ({ ...prev, metadata: res.data }));
      })
      .catch((err) => console.error("Error fetching table metadata:", err));
  };

  return (
    <div className="container-fluid px-0">
      {/* Page Header */}
      <div className="content-header">
        <div className="row mb-3">
          <div className="col-sm-6">
            <h2>
              <i className="fas fa-tasks me-2 text-primary"></i>
              Data Quality Rule Management
            </h2>
          </div>
        </div>
      </div>

      {/* Loading */}
      {state.loading && <LoadingModal show={state.loading} message="Loading..." />}

      {/* Rule Selector Panel */}
      <RuleSelectorPanel
        state={state}
        setState={setState}
        fetchTableMetadata={fetchTableMetadata}
      />

      {/* Rule Inventory Table */}
      <RuleInventoryTable state={state} setState={setState} handleShowResult={handleShowResult} />

      {/* Result Modal */}
      <ResultModal
        show={state.showResultModal}
        onClose={handleCloseResult}
        message={state.resultMessage}
      />

      {/* Metadata Offcanvas */}
      <MetadataOffcanvas show={!!state.metadata} onClose={() => setState((prev) => ({ ...prev, metadata: null }))} title="Table Metadata">
        {state.metadata ? (
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
              {state.metadata.columns.map((col) => (
                <tr key={col.name}>
                  <td>{col.name}</td>
                  <td>{col.dataType}</td>
                  <td>{col.constraints}</td>
                  <td>{col.nullable ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-secondary text-center">No metadata available for this table.</div>
        )}
      </MetadataOffcanvas>
    </div>
  );
};

export default RuleManagementPage;
