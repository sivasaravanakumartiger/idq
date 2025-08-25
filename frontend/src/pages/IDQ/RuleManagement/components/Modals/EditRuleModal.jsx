// frontend/src/pages/IDQ/RuleManagement/components/Modals/EditRuleModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditRuleModal = ({
  show = false,
  rule = null, // the rule object to edit
  onSave = () => {},
  onClose = () => {},
}) => {
  const [ruleType, setRuleType] = useState("");
  const [parameters, setParameters] = useState({});

  useEffect(() => {
    if (rule) {
      setRuleType(rule.type || "");
      setParameters(rule.parameters || {});
    } else {
      setRuleType("");
      setParameters({});
    }
  }, [rule]);

  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (rule) {
      onSave({ ...rule, type: ruleType, parameters });
    }
  };

  if (!rule) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title>Edit Validation Rule</Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Rule</Form.Label>
          <Form.Control
            as="select"
            value={ruleType}
            disabled
            className="bg-light"
          >
            <option value={ruleType}>{ruleType}</option>
          </Form.Control>
        </Form.Group>

        {Object.keys(parameters).map((key) => (
          <Form.Group key={key} className="mb-3">
            <Form.Label>{key}</Form.Label>
            <Form.Control
              type="text"
              value={parameters[key]}
              onChange={(e) => handleParameterChange(key, e.target.value)}
            />
          </Form.Group>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRuleModal;
