import React, { useState } from 'react'
import { Form } from 'react-bootstrap';

// controlId is used to remember the value for localStorage,
// and for the testId, so it should be unique to at least any
// given page where the component is used.

// quarter and setQuarter should be values returned
// by a parent component's setState 

// quarters is an array of objects in this format
// [{ yyyyq :"20214", qyy: "F21"},
//  { yyyyq :"20221", qyy: "W22"}, 
//  { yyyyq :"20222", qyy: "S22"}] 

function PersonalScheduleDropdown({ schedules, setSchedule, controlId, onChange = null, label = "Schedule ID" }) {

    const localSearchSchedule = localStorage.getItem(controlId);

    const [scheduleState, setScheduleState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchSchedule || {}
    );

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
                {schedules.map(function (object, i) {
                    const key=`${controlId}-option-${i}`;
                    return (
                        <option
                            key={key}
                            data-testid={key}
                            value={object.id}
                        >
                            {object.name}
                        </option>
                    );
                })}
            </Form.Control>
        </Form.Group>
    );
};

export default PersonalScheduleDropdown;

