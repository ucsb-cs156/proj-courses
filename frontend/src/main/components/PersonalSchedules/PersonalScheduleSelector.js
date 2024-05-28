import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

const PersonalScheduleSelector = ({
  schedule,
  setSchedule,
  controlId,
  filteringSchedules,
  onChange = null,
  label = "Schedule",
}) => {
  const [scheduleState, setScheduleState] = useState(schedule);

  useEffect(() => {
    if (filteringSchedules && filteringSchedules.length > 0) {
      setSchedule(filteringSchedules[0].id);
    }
  }, [filteringSchedules, setSchedule]);

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
        {filteringSchedules &&
          filteringSchedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {yyyyqToQyy(schedule.quarter)} {schedule.name}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
};

export default PersonalScheduleSelector;
