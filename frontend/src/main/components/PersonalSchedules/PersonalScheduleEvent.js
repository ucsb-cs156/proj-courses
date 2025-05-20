import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Card,
  OverlayTrigger,
  Popover,
  Button,
} from "react-bootstrap";

export default function SchedulerEvents({ event, eventColor, borderColor }) {
  const [style, setStyle] = useState({});
  // Stryker disable next-line all : Initial value is immediately overwritten in useEffect
  const [titleClass, setTitleClass] = useState("");

  const testId = "SchedulerEvent";

  const convertTimeToMinutes = (time) => {
    const [timePart, modifier] = [time.slice(0, -2), time.slice(-2)];
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const TOP_POSITION_OFFSET = 94;
  const DISPLAY_START_HOUR_MINUTES = 8 * 60; // 8 AM in minutes

  useEffect(() => {
    const startMinutes = convertTimeToMinutes(event.startTime);
    const endMinutes = convertTimeToMinutes(event.endTime);
    const height = endMinutes - startMinutes;
    const topPosition =
      startMinutes + TOP_POSITION_OFFSET - DISPLAY_START_HOUR_MINUTES;

    // Determine font size class based on height
    let fontSizeClass = "event-title-xs";
    if (height >= 60) {
      fontSizeClass = "event-title-lg";
    } else if (height >= 40) {
      fontSizeClass = "event-title-md";
    } else if (height >= 25) {
      fontSizeClass = "event-title-sm";
    }
    setTitleClass(fontSizeClass);

    setStyle({
      event: {
        top: `${topPosition}px`,
        height: `${height}px`,
        backgroundColor: eventColor,
        border: `2px solid ${borderColor}`,
      },
      height: height,
    });
  }, [
    event.startTime,
    event.endTime,
    eventColor,
    borderColor,
    DISPLAY_START_HOUR_MINUTES,
  ]);

  return (
    <OverlayTrigger
      trigger="click"
      key={event.title}
      placement="auto-start"
      rootClose
      overlay={
        <Popover>
          <Popover.Header as="h3">{event.title}</Popover.Header>
          <Popover.Body>
            <p data-testid={`${testId}-description`}>
              {event.startTime} - {event.endTime}
              <br />
              {event.description}
            </p>
            {event.actions &&
              event.actions.map((action, index) => (
                <ButtonGroup key={index}>
                  <Button variant={action.variant} onClick={action.callback}>
                    {action.text}
                  </Button>
                </ButtonGroup>
              ))}
          </Popover.Body>
        </Popover>
      }
    >
      <Card
        key={event.title}
        className="scheduler-event"
        style={style.event}
        data-testid={`${testId}-${event.id}`}
      >
        <Card.Body className="scheduler-event-body">
          {style.height >= 20 && (
            <Card.Text
              data-testid={`${testId}-title`}
              className={`scheduler-event-title ${titleClass}`}
            >
              {event.title}
            </Card.Text>
          )}
          {style.height >= 40 && (
            <Card.Text
              data-testid={`${testId}-time`}
              className="PersonalScheduleCard"
            >
              {event.startTime} - {event.endTime}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
}
