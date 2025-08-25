import React, { useState } from "react";
import Step1Rules from "./Step1Rules";
import Step2Review from "./Step2Review";

const RuleManagementWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    catalog: "",
    schema: "",
    table: "",
    rules: [],
  });

  const goToReview = () => setCurrentStep(2);
  const goToStep1 = () => setCurrentStep(1);

  const updateWizardData = (data) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div id="rulesetManagementWizard" className="card">
      <div className="card-header d-flex justify-content-between align-items-center bg-light">
        <h5 className="m-0 fw-bold text-primary">
          Rule Management: <span>{wizardData.table}</span>
        </h5>
        {currentStep === 2 ? (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={goToStep1}
          >
            <i className="fas fa-arrow-left me-1"></i> Back to Rule Selection
          </button>
        ) : null}
      </div>

      <div className="card-body">
        {/* Step Indicator */}
        <div className="d-flex justify-content-center mb-4">
          <div className="d-flex align-items-center">
            <div
              id="step1-indicator"
              className={`step-indicator ${
                currentStep === 1 ? "bg-primary text-white" : "bg-light border text-muted"
              } me-2`}
            >
              {currentStep === 1 ? (
                <i className="fas fa-pencil-alt"></i>
              ) : (
                <span className="d-none">1</span>
              )}
            </div>
            <div className={`me-2 step-label ${currentStep === 1 ? "text-primary" : "text-muted"}`}>
              Define Rules
            </div>
            <div className="step-line mx-2"></div>
          </div>

          <div className="d-flex align-items-center">
            <div
              id="step2-indicator"
              className={`step-indicator ${
                currentStep === 2 ? "bg-primary text-white" : "bg-light border text-muted"
              } me-2`}
            >
              <span>{currentStep === 2 ? "" : "2"}</span>
            </div>
            <div className={`me-2 step-label ${currentStep === 2 ? "text-primary" : "text-muted"}`}>
              Review & Save
            </div>
          </div>
        </div>

        {/* Step Components */}
        {currentStep === 1 && (
          <Step1Rules
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            goToReview={goToReview}
          />
        )}
        {currentStep === 2 && (
          <Step2Review wizardData={wizardData} goBack={goToStep1} />
        )}
      </div>
    </div>
  );
};

export default RuleManagementWizard;
