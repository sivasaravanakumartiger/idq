// frontend/src/pages/IDQ/RuleManagement/components/Modals/ConfirmDeleteModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDeleteModal = ({
  show = false,
  ruleName = "",
  onCancel = () => {},
  onConfirm = () => {},
}) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="bg-danger text-white">
        <Modal.Title>Confirm Deletion</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={onCancel}
        />
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete rule{" "}
        <strong>{ruleName}</strong>? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
