import React, { useState } from "react";
import Step1Rules from "./RuleManagementWizard/Step1Rules";
import Step2Review from "./RuleManagementWizard/Step2Review";

const RuleManagementWizard = () => {
  const [step, setStep] = useState(1);
  const [rules, setRules] = useState([]);

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      {step === 1 && <Step1Rules onNext={(selected) => { setRules(selected); setStep(2); }} />}
      {step === 2 && <Step2Review rules={rules} onBack={() => setStep(1)} />}
    </div>
  );
};

export default RuleManagementWizard;
