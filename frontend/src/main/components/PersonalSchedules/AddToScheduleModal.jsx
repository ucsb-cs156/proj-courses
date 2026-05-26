import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PersonalScheduleSelector from "./PersonalScheduleSelector";
import { schedulesFilter } from "main/utils/PersonalScheduleUtils";
import { yyyyqToQyy } from "main/utils/quarterUtilities.jsx";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function AddToScheduleModal({
  quarter,
  section,
  onAdd,
  schedules,
  testid = "AddToScheduleModal",
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [modalMode, setModalMode] = useState("normal");
  const [scheduleParams, setScheduleParams] = useState({
    // Stryker disable next-line StringLiteral : initial values are overwritten before use
    name: "",
    // Stryker disable next-line StringLiteral : initial values are overwritten before use
    description: "",
    quarter: quarter,
  });

  const filteringSchedules = schedulesFilter(schedules, quarter);

  const objectToAxiosParams = (personalSchedule) => ({
    url: "/api/personalschedules/post",
    method: "POST",
    params: {
      name: personalSchedule.name,
      description: personalSchedule.description,
      quarter: personalSchedule.quarter,
    },
  });

  const onSuccess = (data) => {
    toast(`Schedule "${data.name}" Created`);
    onAdd(section, data.id);
    handleModalClose();
  };

  const onError = (error) => {
    toast(`Error: ${error.response.data.message}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess, onError },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/personalschedules/all"],
  );

  const handleModalClose = () => {
    setShowModal(false);
    setModalMode("normal");
  };

  const handleModalSave = () => {
    onAdd(section, selectedSchedule);
    handleModalClose();
  };

  const handleModalSaveSchedule = () => {
    mutation.mutate(scheduleParams);
  };

  const handleCreateClick = () => {
    const timeString = new Date().toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setScheduleParams({
      ...scheduleParams,
      name: `${timeString} Schedule`,
      description: "Auto-generated schedule",
    });
    setModalMode("auto-create");
  };

  const onSaveButtonClick = () => {
    if (modalMode === "auto-create") {
      handleModalSaveSchedule();
    } else {
      handleModalSave();
    }
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
              filteringSchedules.length > 0 && modalMode === "normal" ? (
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
                <div data-testid={`${testid}-no-schedules`}>
                  {modalMode === "auto-create" ? (
                    <p>
                      New Schedule: <strong>{scheduleParams.name}</strong> will
                      be created.
                    </p>
                  ) : (
                    <p>
                      There are no personal schedules for {yyyyqToQyy(quarter)}.
                      <Button
                        onClick={handleCreateClick}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#007bff",
                          padding: 0,
                          verticalAlign: "baseline",
                          textDecoration: "underline",
                        }}
                      >
                        [Create Personal Schedule]
                      </Button>
                    </p>
                  )}
                </div>
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
            onClick={onSaveButtonClick}
            data-testid={`${testid}-modal-save-button`}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Creating..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
