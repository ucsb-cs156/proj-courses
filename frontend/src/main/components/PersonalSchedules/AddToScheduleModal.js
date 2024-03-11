import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PersonalScheduleSelector from "./PersonalScheduleSelector";
import { useBackend } from "main/utils/useBackend";
import { Link } from "react-router-dom";

export default function AddToScheduleModal({ section, onAdd }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const {
    data: schedules,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/personalschedules/all"],
    { method: "GET", url: "/api/personalschedules/all" },
    []
  );

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    onAdd(section, selectedSchedule);
    handleModalClose();
  };

  return (
    <>
      <Button variant="success" onClick={() => setShowModal(true)}>
        Add
      </Button>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {schedules.length > 0 ? (
              <Form.Group controlId="scheduleSelect">
                <Form.Label>Select Schedule</Form.Label>
                <PersonalScheduleSelector
                  schedule={selectedSchedule}
                  setSchedule={setSelectedSchedule}
                  controlId="scheduleSelect"
                />
              </Form.Group>
            ) : (
              <p>
                No schedules found.
                <Link to="/personalschedules/create">Create a schedule</Link>
              </p>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}