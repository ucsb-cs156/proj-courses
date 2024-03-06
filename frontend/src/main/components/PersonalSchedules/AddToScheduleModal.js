import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PersonalScheduleSelector from './PersonalScheduleSelector';
import { Link } from 'react-router-dom';

export default function AddToScheduleModal({ section, onAdd }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [hasSchedules, setHasSchedules] = useState(true);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    onAdd(section, selectedSchedule);
    handleModalClose();
  };

  <PersonalScheduleSelector
    schedule={selectedSchedule}
    setSchedule={setSelectedSchedule}
    controlId="scheduleSelect"
    setHasSchedules={setHasSchedules}
  />

  return (
    <>
      <Button variant="success" onClick={() => setShowModal(true)}>Add</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          {hasSchedules ? (
            <Form.Group controlId="scheduleSelect">
              <Form.Label>Select Schedule</Form.Label>
              <PersonalScheduleSelector
                schedule={selectedSchedule}
                setSchedule={setSelectedSchedule}
                controlId="scheduleSelect"
                setHasSchedules={setHasSchedules}
              />
            </Form.Group>
          ) : (
            <p>No schedules found. <Link to="/personalschedules/create">Create a schedule</Link></p>
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