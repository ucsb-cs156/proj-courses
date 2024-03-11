import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

const PersonalScheduleSelector = ({
  schedule,
  setSchedule,
  controlId,
  onChange = null,
  label = "Schedule",
}) => {
  const localSearchSchedule = localStorage.getItem(controlId);

  const [scheduleState, setScheduleState] = useState(
    localSearchSchedule || schedule,
  );

  const {
    data: schedules,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/personalschedules/all"],
    { method: "GET", url: "/api/personalschedules/all" },
    [],
  );

  useEffect(() => {
    if (schedules.length > 0) {
      setSchedule(schedules[0].id);
    }
  }, [schedules, setSchedule]);

  const handleScheduleOnChange = (event) => {
    const selectedSchedule = event.target.value;
    localStorage.setItem(controlId, selectedSchedule);
    setScheduleState(selectedSchedule);
    setSchedule(selectedSchedule);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={scheduleState}
        onChange={handleScheduleOnChange}
      >
        {schedules &&
          schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {yyyyqToQyy(schedule.quarter)} {schedule.name}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
};

export default PersonalScheduleSelector;