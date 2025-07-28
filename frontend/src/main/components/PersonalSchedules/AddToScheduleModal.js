import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import PersonalScheduleSelector from "./PersonalScheduleSelector";
import { Link } from "react-router-dom";
import { schedulesFilter } from "main/utils/PersonalScheduleUtils";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function AddToScheduleModal({
  quarter,
  section,
  onAdd,
  schedules = [],
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const filteringSchedules = schedulesFilter(schedules, quarter);

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
            {
              /* istanbul ignore next */
              filteringSchedules.length > 0 ? (
                <Form.Group controlId="scheduleSelect">
                  <Form.Label>Select Schedule</Form.Label>
                  <PersonalScheduleSelector
                    schedule={selectedSchedule}
                    setSchedule={setSelectedSchedule}
                    controlId="scheduleSelect"
                    filteringSchedules={filteringSchedules}
                  />
                </Form.Group>
              ) : (
                <p>
                  There are no personal schedules for {yyyyqToQyy(quarter)}.
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
}
