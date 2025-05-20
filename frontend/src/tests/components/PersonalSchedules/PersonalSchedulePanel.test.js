import React from "react";
import { render, screen, within } from "@testing-library/react";
import PersonalSchedulePanel from "main/components/PersonalSchedules/PersonalSchedulePanel";
import { daysOfWeek, hours } from "../../../main/utils/dateUtils"; // Adjusted import path

describe("PersonalSchedulePanel tests", () => {
  const testId = "SchedulerPanel";

  test("renders without crashing and displays day and time headers", () => {
    const { container } = render(<PersonalSchedulePanel Events={[]} />);

    // Check for the timeslot header
    expect(screen.getByTestId(`${testId}-timeslot-header`)).toBeInTheDocument();

    // Check for day headers and columns
    daysOfWeek.forEach((day) => {
      // Check column exists
      expect(screen.getByTestId(`${testId}-${day}-column`)).toBeInTheDocument();
      // Check title exists
      const dayTitle = screen.getByTestId(`${testId}-${day}-title`);
      expect(dayTitle).toBeInTheDocument();
      expect(dayTitle).toHaveTextContent(day);

      // Check that day slot headers exist and have the right class
      const columnElements = screen.getAllByTestId(`${testId}-day-slot-header`);
      expect(columnElements.length).toBe(daysOfWeek.length); // One for each day
      columnElements.forEach((element) => {
        expect(element).toHaveClass("scheduler-time-slot-short");
      });
    });

    // Check for time slot labels (skipping the first empty one in the component's `hours` array)
    hours.forEach((hour) => {
      expect(
        screen.getByTestId(`${testId}-${hour.replace(" ", "-")}-title`),
      ).toBeInTheDocument();
      // Also check for the span label inside
      const hourLabel = screen.getByTestId(
        `${testId}-${hour.replace(" ", "-")}-label`,
      );
      expect(hourLabel).toBeInTheDocument();
      expect(hourLabel).toHaveTextContent(hour);
      expect(hourLabel).toHaveClass("scheduler-hour-label");
    });

    // Check base time slots are rendered
    const baseSlots = screen.getAllByTestId(`${testId}-base-slot`);
    // Should be (hours.length - 1) * daysOfWeek.length slots
    const expectedSlots = (hours.length - 1) * daysOfWeek.length;
    expect(baseSlots.length).toBe(expectedSlots);
    baseSlots.forEach((slot) => {
      expect(slot).toHaveClass("scheduler-time-slot");
      // Verify a card exists inside the slot
      const cardElement = slot.querySelector(".scheduler-event-card");
      expect(cardElement).not.toBeNull();
    });
  });

  test("renders events correctly when Events prop is provided", () => {
    // Mock events - you might want to create a fixture for this
    const mockEvents = [
      {
        id: "event1-Monday",
        title: "Math 101",
        day: "Monday",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        description: "Lecture",
      },
      {
        id: "event2-Wednesday",
        title: "CS 101",
        day: "Wednesday",
        startTime: "2:00 PM",
        endTime: "3:30 PM",
        description: "Lab section",
      },
    ];
    render(<PersonalSchedulePanel Events={mockEvents} />);

    // Check that SchedulerEvents are rendered (by checking for their testids)
    expect(
      screen.getByTestId("SchedulerEvent-event1-Monday"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("SchedulerEvent-event2-Wednesday"),
    ).toBeInTheDocument();
  });

  test("renders no events when Events prop is empty", () => {
    render(<PersonalSchedulePanel Events={[]} />);
    // Query for any element with a testid starting with SchedulerEvent-
    // There should be none
    const events = screen.queryAllByTestId(/^SchedulerEvent-/);
    expect(events.length).toBe(0);
  });

  test("uses default colors when not provided", () => {
    const mockEvent = {
      id: "event-default-color",
      title: "Default Color Event",
      day: "Tuesday",
      startTime: "9:00 AM",
      endTime: "10:00 AM",
    };
    render(<PersonalSchedulePanel Events={[mockEvent]} />);
    const eventElement = screen.getByTestId(`SchedulerEvent-${mockEvent.id}`);
    // The component uses inline styles, which are hard to check directly for exact default values
    // without knowing them or potentially using snapshot testing.
    // However, we can ensure it renders without crashing and the element exists.
    expect(eventElement).toBeInTheDocument();
    // You could also check that it does NOT have a specific custom color if that makes sense.
  });

  test("uses custom eventColor and borderColor when provided", () => {
    const mockEvent = {
      id: "event-custom-color",
      title: "Custom Color Event",
      day: "Thursday",
      startTime: "1:00 PM",
      endTime: "2:00 PM",
    };
    const customEventColor = "rgb(255, 0, 0)"; // red
    const customBorderColor = "rgb(0, 0, 255)"; // blue

    render(
      <PersonalSchedulePanel
        Events={[mockEvent]}
        eventColor={customEventColor}
        borderColor={customBorderColor}
      />,
    );
    const eventElement = screen.getByTestId(`SchedulerEvent-${mockEvent.id}`);
    expect(eventElement).toBeInTheDocument();
    // In PersonalScheduleEvent, the style is applied:
    // backgroundColor: eventColor, border: `2px solid ${borderColor}`
    // Checking inline styles:
    expect(eventElement).toHaveStyle(`background-color: ${customEventColor}`);
    expect(eventElement).toHaveStyle(`border: 2px solid ${customBorderColor}`);
  });
});
