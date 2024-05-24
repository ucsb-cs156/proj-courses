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
  const currentQuarter = localStorage.getItem("BasicSearch.Quarter"); //Change

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
  // Stryker disable all : tested manually, complicated to test

  //Change
  const filteringSchedules = schedules.filter(
    (schedule) => schedule.quarter === currentQuarter
  );
  //Change

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
              /* istanbul ignore next */ filteringSchedules.length > 0 ? ( //Change /* istanbul ignore next */ schedules.length > 0 ? (
                <Form.Group controlId="scheduleSelect">
                  <Form.Label>Select Schedule</Form.Label>
                  <PersonalScheduleSelector
                    schedule={selectedSchedule}
                    setSchedule={setSelectedSchedule}
                    controlId="scheduleSelect"
                    filteringSchedules={filteringSchedules} //Change
                  />
                </Form.Group>
              ) : (
                <p>
                  There are no personal schedules for this quarter.
                  <Link to="/personalschedules/create">[Create Personal Schedule]</Link>
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
