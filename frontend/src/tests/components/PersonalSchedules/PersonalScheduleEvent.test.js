import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import PersonalScheduleEvent from "main/components/PersonalSchedules/PersonalScheduleEvent";

describe("PersonalScheduleEvent tests", () => {
  const testId = "SchedulerEvent";

  const mockEventBase = {
    id: "test-event-1",
    title: "CS 156",
    startTime: "2:00 PM",
    endTime: "3:00 PM", // 60 min duration
    description: "Lecture with Conrad",
  };

  const eventColor = "rgb(200, 200, 255)"; // Light blue
  const borderColor = "rgb(100, 100, 200)"; // Darker blue

  test("renders without crashing for a standard event", () => {
    render(
      <PersonalScheduleEvent
        event={mockEventBase}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    // Check the event card itself
    const eventCard = screen.getByTestId(`${testId}-${mockEventBase.id}`);
    expect(eventCard).toBeInTheDocument();
    expect(eventCard).toHaveStyle(`background-color: ${eventColor}`);
    expect(eventCard).toHaveStyle(`border: 2px solid ${borderColor}`);
  });

  test("renders title and time on card if event duration is sufficient", () => {
    const longEvent = { ...mockEventBase, endTime: "4:00 PM" }; // 2 hours, should be enough height
    render(
      <PersonalScheduleEvent
        event={longEvent}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    expect(screen.getByTestId(`${testId}-title`)).toHaveTextContent(
      longEvent.title,
    );
    expect(screen.getByTestId(`${testId}-time`)).toHaveTextContent(
      `${longEvent.startTime} - ${longEvent.endTime}`,
    );
  });

  test("does not render time on card if event duration is too short (e.g., < 40min)", () => {
    const shortEvent = { ...mockEventBase, endTime: "2:30 PM" }; // 30 min
    render(
      <PersonalScheduleEvent
        event={shortEvent}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    expect(screen.getByTestId(`${testId}-title`)).toHaveTextContent(
      shortEvent.title,
    );
    expect(screen.queryByTestId(`${testId}-time`)).not.toBeInTheDocument();
  });

  test("does not render title or time on card if event duration is very short (e.g., < 20min)", () => {
    const veryShortEvent = { ...mockEventBase, endTime: "2:15 PM" }; // 15 min
    render(
      <PersonalScheduleEvent
        event={veryShortEvent}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    expect(screen.queryByTestId(`${testId}-title`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${testId}-time`)).not.toBeInTheDocument();
  });

  test("popover appears on click and shows details", async () => {
    render(
      <PersonalScheduleEvent
        event={mockEventBase}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    const eventCard = screen.getByTestId(`${testId}-${mockEventBase.id}`);
    fireEvent.click(eventCard);

    // Wait for the popover to appear and find it by its role
    const popover = await screen.findByRole("tooltip");

    // Check for title within the popover
    expect(within(popover).getByText(mockEventBase.title)).toBeInTheDocument();

    // Check for description within the popover
    const popoverDescription = within(popover).getByTestId(
      `${testId}-description`,
    );
    expect(popoverDescription).toHaveTextContent(
      `${mockEventBase.startTime} - ${mockEventBase.endTime}`,
    );
    expect(popoverDescription).toHaveTextContent(mockEventBase.description);
  });

  test("renders action buttons in popover and calls callback on click", async () => {
    const mockActionCallback = jest.fn();
    const eventWithActions = {
      ...mockEventBase,
      actions: [
        {
          text: "Test Action",
          variant: "primary",
          callback: mockActionCallback,
        },
      ],
    };

    render(
      <PersonalScheduleEvent
        event={eventWithActions}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    const eventCard = screen.getByTestId(`${testId}-${eventWithActions.id}`);
    fireEvent.click(eventCard);

    // Wait for the popover to appear and find it by its role
    const popover = await screen.findByRole("tooltip");

    // Find the button within the popover and click it
    const actionButton = within(popover).getByRole("button", {
      name: "Test Action",
    });
    expect(actionButton).toBeInTheDocument();
    fireEvent.click(actionButton);
    expect(mockActionCallback).toHaveBeenCalledTimes(1);
  });

  // Test for time conversion, indirectly via style calculation
  test("handles different AM/PM time formats for style calculation", () => {
    const eventAcrossMidday = {
      ...mockEventBase,
      id: "event-midday",
      startTime: "11:30 AM",
      endTime: "1:30 PM", // 2 hours
    };
    render(
      <PersonalScheduleEvent
        event={eventAcrossMidday}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );
    // Check that title and time are rendered (implies height calculation was reasonable)
    expect(screen.getByTestId(`${testId}-title`)).toHaveTextContent(
      eventAcrossMidday.title,
    );
    expect(screen.getByTestId(`${testId}-time`)).toHaveTextContent(
      `${eventAcrossMidday.startTime} - ${eventAcrossMidday.endTime}`,
    );
  });
});
