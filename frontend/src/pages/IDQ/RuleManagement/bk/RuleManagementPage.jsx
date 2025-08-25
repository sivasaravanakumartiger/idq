import React, { useState } from "react";
import PageLoader from "./components/PageLoader";
import PageHeader from "./components/PageHeader";
import RuleSelectorPanel from "./components/RuleSelectorPanel";
import RuleInventoryTable from "./components/RuleInventoryTable";
import RuleDetails from "./components/RuleDetails";
import RuleManagementWizard from "./components/RuleManagementWizard";
import MetadataOffcanvas from "./components/MetadataOffcanvas";

const RuleManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  return (
    <div className="p-4">
      {loading && <PageLoader />}

      <PageHeader title="Rule Management" breadcrumb={["Dashboard", "Rule Management"]} />

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-1">
          <RuleSelectorPanel onSelect={() => {}} />
        </div>
        <div className="col-span-2">
          <RuleInventoryTable onSelectRule={setSelectedRule} />
        </div>
      </div>

      {selectedRule && <RuleDetails rule={selectedRule} />}
      <RuleManagementWizard />
      <MetadataOffcanvas />
    </div>
  );
};

export default RuleManagementPage;
