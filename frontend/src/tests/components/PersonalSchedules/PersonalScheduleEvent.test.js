/* eslint-disable jest/no-conditional-expect */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import PersonalScheduleEvent from "main/components/PersonalSchedules/PersonalScheduleEvent";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

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

  const queryClient = new QueryClient();

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

  test("renders event with correct styles and popover", async () => {
    const event = {
      id: 1,
      title: "Test Event",
      startTime: "12:00PM",
      endTime: "1:00PM",
      description: "Test Description",
      actions: [
        {
          text: "Edit",
          variant: "primary",
          callback: jest.fn(),
        },
        {
          text: "Delete",
          variant: "danger",
          callback: jest.fn(),
        },
      ],
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalScheduleEvent
            event={event}
            eventColor="lightblue"
            borderColor="blue"
          />
        </Router>
      </QueryClientProvider>,
    );

    // Check if the event is rendered with the correct title
    expect(screen.getByText(event.title)).toBeInTheDocument();

    // Check if the event card has correct styles
    const card = screen.getByTestId(`${testId}-${event.id}`);
    expect(card).toHaveStyle("background-color: lightblue");
    expect(card).toHaveStyle("border: 2px solid blue");

    // Check if time is displayed
    expect(
      screen.getByText(`${event.startTime} - ${event.endTime}`),
    ).toBeInTheDocument();

    // Simulate a click to show the popover
    fireEvent.click(card);

    // Check if the popover content is correct
    const popover = await screen.findByRole("tooltip");
    // Use a more robust way to check for text within the popover
    expect(
      within(popover).getByText(event.description, { exact: false }),
    ).toBeInTheDocument();

    // Check if the actions are rendered correctly
    event.actions.forEach((action) => {
      expect(screen.getByText(action.text)).toBeInTheDocument();
    });

    // Check if clicking action buttons triggers callbacks
    event.actions.forEach((action) => {
      const button = screen.getByText(action.text);
      fireEvent.click(button);
      expect(action.callback).toHaveBeenCalled();
    });
  });

  const timeTestCases = [
    {
      startTime: "12:00PM",
      endTime: "12:10PM",
      expectedFontSize: null,
      expectedHeight: 10,
    },
    {
      startTime: "12:00PM",
      endTime: "12:20PM",
      expectedFontSize: "10px",
      expectedHeight: 20,
    },
    {
      startTime: "12:00PM",
      endTime: "12:30PM",
      expectedFontSize: "12px",
      expectedHeight: 30,
    },
    {
      startTime: "12:00PM",
      endTime: "12:40PM",
      expectedFontSize: "14px",
      expectedHeight: 40,
    },
    {
      startTime: "12:00PM",
      endTime: "01:00PM",
      expectedFontSize: "16px",
      expectedHeight: 60,
    },
    {
      startTime: "12:00PM",
      endTime: "02:00PM",
      expectedFontSize: "16px",
      expectedHeight: 120,
    },
    {
      startTime: "12:00AM",
      endTime: "02:00PM",
      expectedFontSize: "16px",
      expectedHeight: 840,
    },
    {
      startTime: "2:00AM",
      endTime: "02:00PM",
      expectedFontSize: "16px",
      expectedHeight: 720,
    },
  ];

  timeTestCases.forEach(
    ({ startTime, endTime, expectedFontSize, expectedHeight }) => {
      test(`renders event from ${startTime}-${endTime} (H:${expectedHeight}, FS:${expectedFontSize})`, () => {
        const uniqueEventId = `event-${startTime}-${endTime}`.replace(
          /[:\s]/g,
          "",
        );
        render(
          <PersonalScheduleEvent
            event={{ ...mockEventBase, id: uniqueEventId, startTime, endTime }}
            eventColor={eventColor}
            borderColor={borderColor}
          />,
        );

        const card = screen.getByTestId(`${testId}-${uniqueEventId}`);
        expect(card).toHaveStyle(`height: ${expectedHeight}px`);

        if (expectedFontSize === null || expectedHeight < 20) {
          expect(
            screen.queryByTestId(`${testId}-title`),
          ).not.toBeInTheDocument();
        } else {
          const titleElement = screen.getByTestId(`${testId}-title`);
          expect(titleElement).toBeInTheDocument();
          expect(titleElement).toHaveTextContent(mockEventBase.title);
          expect(titleElement).toHaveStyle(`font-size: ${expectedFontSize}`);
        }

        if (expectedHeight >= 40) {
          const titleElement = screen.getByTestId(`${testId}-title`);
          expect(titleElement).toBeInTheDocument();
          const timeElement = screen.getByTestId(`${testId}-time`);
          expect(timeElement).toBeInTheDocument();
          expect(timeElement).toHaveTextContent(`${startTime} - ${endTime}`);
        } else if (expectedHeight >= 20) {
          const titleElement = screen.getByTestId(`${testId}-title`);
          expect(titleElement).toBeInTheDocument();
          expect(
            screen.queryByTestId(`${testId}-time`),
          ).not.toBeInTheDocument();
        } else {
          expect(
            screen.queryByTestId(`${testId}-title`),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByTestId(`${testId}-time`),
          ).not.toBeInTheDocument();
        }
      });
    },
  );

  const fixedEndTimeRenderTestCases = [
    { time: "12:00AM", expectTitle: true, expectTimeText: true },
    { time: "12:55PM", expectTitle: true, expectTimeText: false },
    { time: "1:00PM", expectTitle: false, expectTimeText: false },
  ];

  fixedEndTimeRenderTestCases.forEach(
    ({ time, expectTitle, expectTimeText }) => {
      test(`renders for fixed end time with start: ${time}`, () => {
        const uniqueEventId = `fixedEndTime-${time}`.replace(/[:\s]/g, "");
        const testEvent = {
          ...mockEventBase,
          id: uniqueEventId,
          startTime: time,
          endTime: "1:00PM",
        };
        const { container } = render(
          <PersonalScheduleEvent
            event={testEvent}
            eventColor={eventColor}
            borderColor={borderColor}
          />,
        );

        if (expectTitle) {
          const titleElement = within(container).getByTestId(`${testId}-title`);
          expect(titleElement).toBeInTheDocument();
          expect(titleElement).toHaveTextContent(mockEventBase.title);
        } else {
          expect(
            within(container).queryByTestId(`${testId}-title`),
          ).not.toBeInTheDocument();
        }

        if (expectTimeText) {
          const timeTextElement = within(container).getByTestId(
            `${testId}-time`,
          );
          expect(timeTextElement).toBeInTheDocument();
          expect(timeTextElement).toHaveTextContent(
            `${testEvent.startTime} - ${testEvent.endTime}`,
          );
        } else {
          expect(
            within(container).queryByTestId(`${testId}-time`),
          ).not.toBeInTheDocument();
        }
      });
    },
  );
});
