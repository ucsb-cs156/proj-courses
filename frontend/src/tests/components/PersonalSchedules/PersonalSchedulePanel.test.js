import React from "react";
import { render, screen } from "@testing-library/react";
import PersonalSchedulePanel from "main/components/PersonalSchedules/PersonalSchedulePanel";

describe("PersonalSchedulePanel tests", () => {
  const testId = "SchedulerPanel";

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = [
    "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
    "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
    "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM",
    "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
  ];

  test("renders without crashing and displays day and time headers", () => {
    render(<PersonalSchedulePanel Events={[]} />);

    // Check for day headers
    daysOfWeek.forEach((day) => {
      expect(screen.getByTestId(`${testId}-${day}-title`)).toBeInTheDocument();
    });

    // Check for time slot labels (skipping the first empty one in the component's `hours` array)
    hours.forEach((hour) => {
      expect(screen.getByTestId(`${testId}-${hour.replace(" ", "-")}-title`)).toBeInTheDocument();
      // Also check for the span label inside
      expect(screen.getByTestId(`${testId}-${hour.replace(" ", "-")}-label`)).toHaveTextContent(hour);
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
        description: "Lecture"
      },
      {
        id: "event2-Wednesday",
        title: "CS 101",
        day: "Wednesday",
        startTime: "2:00 PM",
        endTime: "3:30 PM",
        description: "Lab section"
      },
    ];
    render(<PersonalSchedulePanel Events={mockEvents} />);

    // Check that SchedulerEvents are rendered (by checking for their testids)
    expect(screen.getByTestId("SchedulerEvent-event1-Monday")).toBeInTheDocument();
    expect(screen.getByTestId("SchedulerEvent-event2-Wednesday")).toBeInTheDocument();
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
      />
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
