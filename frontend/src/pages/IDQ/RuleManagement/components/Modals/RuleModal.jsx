// frontend/src/pages/IDQ/RuleManagement/components/Modals/RuleModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RuleModal = ({
  show = false,
  availableRules = [], // list of rules from API
  onAddRule = () => {},
  onClose = () => {},
}) => {
  const [selectedRule, setSelectedRule] = useState("");
  const [parameters, setParameters] = useState({});

  useEffect(() => {
    // Reset modal state when opened
    if (show) {
      setSelectedRule("");
      setParameters({});
    }
  }, [show]);

  const handleRuleChange = (ruleName) => {
    setSelectedRule(ruleName);
    setParameters({}); // reset parameters for new rule
  };

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    if (selectedRule) {
      onAddRule({ type: selectedRule, parameters });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header>
        <Modal.Title>Add New Validation Rule</Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Select Rule</Form.Label>
          <Form.Control
            as="select"
            value={selectedRule}
            onChange={(e) => handleRuleChange(e.target.value)}
          >
            <option value="">-- Choose Rule --</option>
            {availableRules.map((rule) => (
              <option key={rule.name} value={rule.name}>
                {rule.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedRule &&
          availableRules
            .find((r) => r.name === selectedRule)
            ?.parameters.map((param) => (
              <Form.Group key={param} className="mb-3">
                <Form.Label>{param}</Form.Label>
                <Form.Control
                  type="text"
                  value={parameters[param] || ""}
                  onChange={(e) =>
                    handleParameterChange(param, e.target.value)
                  }
                />
              </Form.Group>
            ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          Add Rule
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RuleModal;
