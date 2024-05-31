import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PersonalScheduleSelector from "./PersonalScheduleSelector";
import { useBackend } from "main/utils/useBackend";
import { Link } from "react-router-dom";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { filterSchedulesByQuarter } from "main/utils/PersonalScheduleUtils";

export default function AddToScheduleModal({ quarter, section, onAdd }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  // Stryker disable all
  const {
    data: schedules,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/personalschedules/all"],
    { method: "GET", url: "/api/personalschedules/all" },
    [],
  );
  // Stryker restore all

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    onAdd(section, selectedSchedule);
    handleModalClose();
  };

  // Filter the schedules by the given quarter
  const filteredSchedules = filterSchedulesByQuarter(schedules, quarter);

  // Stryker disable all : tested manually, complicated to test
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
            {
              /* istanbul ignore next */ filteredSchedules.length > 0 ? (
                <Form.Group controlId="scheduleSelect">
                  <Form.Label>Select Schedule</Form.Label>
                  <PersonalScheduleSelector
                    filteredSchedules={filteredSchedules}
                    schedule={selectedSchedule}
                    filteredSchedules={filteredSchedules}
                    quarter={quarter}
                    setSchedule={setSelectedSchedule}
                    controlId="scheduleSelect"
                  />
                </Form.Group>
              ) : (
                <p>
                  There are no personal schedules for {yyyyqToQyy(quarter)}.
                  <br />
                  <Link to="/personalschedules/create">
                    [Create Personal Schedule]
                  </Link>
                </p>
              )
            }
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
  // Stryker restore all
}
