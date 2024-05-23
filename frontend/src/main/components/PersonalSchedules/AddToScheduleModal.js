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

  const localQuarter = localStorage.getItem("BasicSearch.Quarter");

  //translate quarter from yyyyq to qyy
  var quarterTrans = "";
  if (localQuarter.substring(4, 5) === "1") {
    quarterTrans = "W";
  }
  else if (localQuarter.substring(4, 5) === "2") {
    quarterTrans = "S"
  }
  if (localQuarter.substring(4, 5) === "1") {
    quarterTrans = "M";
  }
  else {
    quarterTrans = "F";
  }

  quarterTrans += localQuarter.substring(2, 4);

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


  //filter schedules to match the current quarter 
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.quarter === localQuarter
  );

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
                    setSchedule={setSelectedSchedule}
                    controlId="scheduleSelect"
                  />
                </Form.Group>
              ) : (
                <p>
                  No personal schedules exist for quarter {quarterTrans}.
                  <br />
                  <Link to="/personalschedules/create">[Create One]</Link>
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
