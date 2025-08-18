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
  schedules,
  testid = "AddToScheduleModal",
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
      <Button
        variant="success"
        onClick={() => setShowModal(true)}
        data-testid={`${testid}-add-to-schedule-button`}
      >
        Add
      </Button>
      <Modal
        show={showModal}
        onHide={handleModalClose}
        data-testid={`${testid}-modal`}
      >
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
                    data-testid={`${testid}-schedule-selector`}
                    schedule={selectedSchedule}
                    setSchedule={setSelectedSchedule}
                    controlId="scheduleSelect"
                    filteringSchedules={filteringSchedules}
                  />
                </Form.Group>
              ) : (
                <p data-testid={`${testid}-no-schedules`}>
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
          <Button
            variant="secondary"
            onClick={handleModalClose}
            data-testid={`${testid}-modal-close-button`}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleModalSave}
            data-testid={`${testid}-modal-save-button`}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
