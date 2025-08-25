import React, { useState } from "react";
import RuleSelectorPanel from "./RuleSelectorPanel";
import RuleInventory from "./RuleInventory";
import RulesetDetails from "./RulesetDetails";
import RuleManagementWizard from "./RuleManagementWizard";
import RuleModal from "./modals/RuleModal";
import EditRuleModal from "./modals/EditRuleModal";
import LoadingModal from "./modals/LoadingModal";
import ResultModal from "./modals/ResultModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import MetadataOffcanvas from "./offcanvas/MetadataOffcanvas";

const RuleManagementPage = () => {
  const [selectedRuleset, setSelectedRuleset] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="container-fluid px-0">
      <RuleSelectorPanel />
      <RuleInventory onSelectRuleset={setSelectedRuleset} />
      {selectedRuleset && <RulesetDetails ruleset={selectedRuleset} />}
      {showWizard && (
        <RuleManagementWizard
          ruleset={selectedRuleset}
          onClose={() => setShowWizard(false)}
        />
      )}

      {/* Modals */}
      <RuleModal />
      <EditRuleModal />
      <LoadingModal />
      <ResultModal />
      <ConfirmDeleteModal />

      {/* Offcanvas */}
      <MetadataOffcanvas />
    </div>
  );
};

export default RuleManagementPage;
