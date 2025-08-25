// frontend/src/pages/IDQ/RuleManagement/components/RuleSelectorPanel.jsx
import React, { useEffect } from "react";
import axios from "axios";

const RuleSelectorPanel = ({ state, setState, fetchTableMetadata }) => {
  const apiEndpoints = {
    catalog_structure: "/manage_rulesets/catalog_structure",
    rules: "/manage_rulesets/get_rules",
    all_rule_summary: "/manage_rulesets/get_all_rule_summary",
    table_info: "/manage_rulesets/get_table_info",
  };

  // Fetch catalog structure on component mount
  useEffect(() => {
    const fetchCatalogStructure = async () => {
      try {
        const response = await axios.get(apiEndpoints.catalog_structure);
        setState((prev) => ({
          ...prev,
          catalogStructure: response.data || {},
        }));
      } catch (error) {
        console.error("Failed to fetch catalog structure:", error);
      }
    };
    fetchCatalogStructure();
  }, []);

  // Handle Catalog change
  const handleCatalogChange = (e) => {
    const catalog = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedCatalog: catalog,
      selectedSchema: null,
      selectedTable: null,
      rulesetsData: [],
    }));
  };

  // Handle Schema change
  const handleSchemaChange = (e) => {
    const schema = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedSchema: schema,
      selectedTable: null,
      rulesetsData: [],
    }));
  };

  // Handle Table change
  const handleTableChange = (e) => {
    const table = e.target.value;
    setState((prev) => ({
      ...prev,
      selectedTable: table,
      rulesetsData: [],
    }));
    fetchTableMetadata(table);
  };

  // Render Catalog options
  const renderCatalogOptions = () => {
    const catalogs = state.catalogStructure?.catalogs || [];
    return catalogs.map((cat) => (
      <option key={cat.name} value={cat.name}>
        {cat.name}
      </option>
    ));
  };

  // Render Schema options based on selected catalog
  const renderSchemaOptions = () => {
    const catalog = state.catalogStructure?.catalogs?.find(
      (c) => c.name === state.selectedCatalog
    );
    const schemas = catalog?.schemas || [];
    return schemas.map((sch) => (
      <option key={sch.name} value={sch.name}>
        {sch.name}
      </option>
    ));
  };

  // Render Table options based on selected schema
  const renderTableOptions = () => {
    const catalog = state.catalogStructure?.catalogs?.find(
      (c) => c.name === state.selectedCatalog
    );
    const schema = catalog?.schemas?.find((s) => s.name === state.selectedSchema);
    const tables = schema?.tables || [];
    return tables.map((tbl) => (
      <option key={tbl.name} value={tbl.name}>
        {tbl.name}
      </option>
    ));
  };

  // Show loading if catalog data not yet available
  if (!state.catalogStructure) {
    return <div>Loading catalog data...</div>;
  }

  return (
    <div id="rulesetSelectorPanel" className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-light">
        <h3 className="card-title m-0 text-primary">
          <i className="fas fa-table me-2"></i> Specify Table Details
        </h3>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Catalog */}
          <div className="col-md-4 mb-3">
            <label htmlFor="manageCatalog" className="form-label">
              Catalog
            </label>
            <select
              id="manageCatalog"
              className="form-select"
              value={state.selectedCatalog || ""}
              onChange={handleCatalogChange}
            >
              <option value="">Select catalog...</option>
              {renderCatalogOptions()}
            </select>
          </div>

          {/* Schema */}
          <div className="col-md-4 mb-3">
            <label htmlFor="manageSchema" className="form-label">
              Schema
            </label>
            <select
              id="manageSchema"
              className="form-select"
              value={state.selectedSchema || ""}
              onChange={handleSchemaChange}
              disabled={!state.selectedCatalog}
            >
              <option value="">Select schema...</option>
              {renderSchemaOptions()}
            </select>
          </div>

          {/* Table */}
          <div className="col-md-4 mb-3">
            <label htmlFor="manageAssetName" className="form-label">
              Table
            </label>
            <select
              id="manageAssetName"
              className="form-select"
              value={state.selectedTable || ""}
              onChange={handleTableChange}
              disabled={!state.selectedSchema}
            >
              <option value="">Select table...</option>
              {renderTableOptions()}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleSelectorPanel;
