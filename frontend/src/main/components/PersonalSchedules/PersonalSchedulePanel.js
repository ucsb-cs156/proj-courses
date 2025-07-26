import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import SchedulerEvents from "./PersonalScheduleEvent"; // Updated import path
import { daysOfWeek, hours } from "../../utils/dateUtils";

// Example minimum required data for event object
// {
//     title: "Meeting with Team",
//     day: "Tuesday",
//     startTime: "2:00PM",
//     endTime: "4:00PM"
// }

// Stryker disable all: This is a component that is used to display a personal schedule
export default function SchedulerPanel({
  Events = [],
  eventColor = "#d1ecf188",
  borderColor = "#bee5eb",
}) {
  // Stryker restore all
  const testId = "SchedulerPanel";

  return (
    <Container fluid className="scheduler-panel">
      <Row className="scheduler-header-row">
        <Col className="scheduler-time-column"></Col>
        {daysOfWeek.map((day) => (
          <Col
            key={day}
            className="scheduler-day-column"
            data-testid={`${testId}-${day}-column`}
          >
            <Card className="scheduler-day-card">
              <Card.Body>
                <Card.Title
                  className="scheduler-day-title"
                  data-testid={`${testId}-${day}-title`}
                >
                  {day}
                </Card.Title>
              </Card.Body>
              {Events.filter((event) => event.day === day).map((event) => (
                <SchedulerEvents
                  key={event.id}
                  event={event}
                  eventColor={eventColor}
                  borderColor={borderColor}
                />
              ))}
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="scheduler-time-column">
          {
            <div
              className="time-slot-header"
              data-testid={`${testId}-timeslot-header`}
            ></div>
          }
          {hours.map((hour, index) => (
            <div
              key={index}
              className="time-slot-no-border"
              data-testid={`${testId}-${hour.replace(" ", "-")}-title`}
            >
              <span
                className="scheduler-hour-label"
                data-testid={`${testId}-${hour.replace(" ", "-")}-label`}
              >
                {hour}
              </span>
            </div>
          ))}
        </Col>

        {daysOfWeek.map((day) => (
          <Col key={day} className="scheduler-day-column">
            {
              <div
                className="scheduler-time-slot-short"
                data-testid={`${testId}-day-slot-header`}
              ></div>
            }
            {hours.slice(0, hours.length - 1).map((hour) => (
              <div
                key={hour}
                className="scheduler-time-slot"
                data-testid={`${testId}-base-slot`}
              >
                <Card className="scheduler-event-card" />
              </div>
            ))}
          </Col>
        ))}
      </Row>
    </Container>
  );
}
