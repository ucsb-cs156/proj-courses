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

          // Check for correct font size class instead of inline style
          const expectedClass =
            expectedHeight >= 60
              ? "event-title-lg"
              : expectedHeight >= 40
                ? "event-title-md"
                : expectedHeight >= 25
                  ? "event-title-sm"
                  : "event-title-xs";
          expect(titleElement).toHaveClass(expectedClass);
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
    { time: "12:55PM", expectTitle: false, expectTimeText: false },
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

  const mockEvent = {
    id: "test-event-1",
    title: "Test Event",
    startTime: "9:00 AM",
    endTime: "10:30 AM",
    description: "This is a test event.",
    day: "Monday", // Not directly used by PersonalScheduleEvent styling but good for context
  };

  // Helper to convert time string (e.g., "9:00 AM") to minutes from midnight
  const convertTimeToMinutes = (time) => {
    const [timePart, modifier] = [time.slice(0, -2), time.slice(-2)];
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0; // Midnight case
    return hours * 60 + minutes;
  };

  test("renders event with correct position and height", () => {
    render(
      <PersonalScheduleEvent
        event={mockEvent}
        eventColor={eventColor}
        borderColor={borderColor}
      />,
    );

    const eventElement = screen.getByTestId(`SchedulerEvent-${mockEvent.id}`);
    expect(eventElement).toBeInTheDocument();
    expect(eventElement).toHaveClass("scheduler-event");

    // Check for Card.Body with scheduler-event-body class
    const eventBody = eventElement.querySelector(".card-body");
    expect(eventBody).toHaveClass("scheduler-event-body");

    // Calculate expected values
    const startMinutes = convertTimeToMinutes(mockEvent.startTime); // 9 * 60 = 540
    const endMinutes = convertTimeToMinutes(mockEvent.endTime); // 10 * 60 + 30 = 630
    const expectedHeight = endMinutes - startMinutes; // 630 - 540 = 90
    const TOP_POSITION_OFFSET = 94; // Value from PersonalScheduleEvent.js
    const expectedTop = startMinutes + TOP_POSITION_OFFSET; // 540 + 94 = 634

    expect(eventElement).toHaveStyle(`height: ${expectedHeight}px`);
    expect(eventElement).toHaveStyle(`top: ${expectedTop}px`);
    expect(eventElement).toHaveStyle(`background-color: ${eventColor}`);
    expect(eventElement).toHaveStyle(`border: 2px solid ${borderColor}`);
  });

  test("renders title and time based on height", () => {
    const shortEvent = {
      ...mockEvent,
      id: "short-event",
      startTime: "1:00 PM",
      endTime: "1:15 PM", // 15 min height
    };
    const { container: shortContainer } = render(
      <PersonalScheduleEvent event={shortEvent} eventColor="" borderColor="" />,
    );
    // Title should not render as height is < 20 (15px)
    expect(
      within(shortContainer).queryByTestId("SchedulerEvent-title"),
    ).not.toBeInTheDocument();
    // Time should not render as height is < 40 (15px)
    expect(
      within(shortContainer).queryByTestId("SchedulerEvent-time"),
    ).not.toBeInTheDocument();

    const mediumEvent = {
      ...mockEvent,
      id: "medium-event",
      startTime: "2:00 PM",
      endTime: "2:30 PM", // 30 min height
    };
    const { container: mediumContainer } = render(
      <PersonalScheduleEvent
        event={mediumEvent}
        eventColor=""
        borderColor=""
      />,
    );
    // Title should render as height >= 20 (30px)
    expect(
      within(mediumContainer).getByTestId("SchedulerEvent-title"),
    ).toBeInTheDocument();
    // Time should not render as height < 40 (30px)
    expect(
      within(mediumContainer).queryByTestId("SchedulerEvent-time"),
    ).not.toBeInTheDocument();

    const tallEvent = {
      ...mockEvent,
      id: "tall-event",
      startTime: "3:00 PM",
      endTime: "4:00 PM", // 60 min height
    };
    const { container: tallContainer } = render(
      <PersonalScheduleEvent event={tallEvent} eventColor="" borderColor="" />,
    );
    // Title should render as height >= 20 (60px)
    expect(
      within(tallContainer).getByTestId("SchedulerEvent-title"),
    ).toBeInTheDocument();
    // Time should render as height >= 40 (60px)
    const timeElement = within(tallContainer).getByTestId(
      "SchedulerEvent-time",
    );
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveClass("PersonalScheduleCard");
  });

  test("initializes with correct title class based on event height", () => {
    // Test events with different heights to verify correct initial class
    const testCases = [
      { height: 15, expectedClass: "event-title-xs" }, // < 25
      { height: 25, expectedClass: "event-title-sm" }, // Exactly 25
      { height: 39, expectedClass: "event-title-sm" }, // < 40
      { height: 40, expectedClass: "event-title-md" }, // Exactly 40
      { height: 59, expectedClass: "event-title-md" }, // < 60
      { height: 60, expectedClass: "event-title-lg" }, // Exactly 60
      { height: 90, expectedClass: "event-title-lg" }, // > 60
    ];

    testCases.forEach(({ height, expectedClass }) => {
      // Create an event with exactly the tested height
      const testEvent = {
        ...mockEvent,
        id: `height-${height}`,
        // Set times to create the exact height we want to test
        startTime: "9:00 AM",
        endTime: convertTimeToEndTime("9:00 AM", height),
      };

      const { container } = render(
        <PersonalScheduleEvent
          event={testEvent}
          eventColor="blue"
          borderColor="black"
        />,
      );

      if (height >= 20) {
        // Only check if title should be visible
        const titleElement = within(container).getByTestId(
          "SchedulerEvent-title",
        );
        expect(titleElement).toHaveClass("scheduler-event-title");
        expect(titleElement).toHaveClass(expectedClass);
      }
    });
  });

  test("validates default styling when component initializes", () => {
    // Create a small event (15 min) that will later grow
    const smallEvent = {
      ...mockEvent,
      id: "small-init-event",
      startTime: "9:00 AM",
      endTime: "9:15 AM", // 15 min
    };

    // Render with the small event
    const { container } = render(
      <PersonalScheduleEvent
        event={smallEvent}
        eventColor="blue"
        borderColor="black"
      />,
    );

    // Verify event card has proper styling
    const eventCard = within(container).getByTestId(
      `SchedulerEvent-${smallEvent.id}`,
    );
    expect(eventCard).toHaveClass("scheduler-event");
    expect(eventCard).toHaveStyle("background-color: blue");
    expect(eventCard).toHaveStyle("border: 2px solid black");

    // Since height is < 20, the title should not be visible
    expect(
      within(container).queryByTestId("SchedulerEvent-title"),
    ).not.toBeInTheDocument();
  });

  test("all style props update correctly when props change", () => {
    // Start with a small event
    const initialEvent = {
      ...mockEvent,
      id: "update-test-event",
      startTime: "9:00 AM",
      endTime: "9:30 AM", // 30 min (title visible, time not visible)
    };

    // Calculate initial position
    const initialStartMinutes = convertTimeToMinutes(initialEvent.startTime);
    const TOP_POSITION_OFFSET = 94;
    const initialTop = initialStartMinutes + TOP_POSITION_OFFSET;

    // Render the component
    const { rerender, container } = render(
      <PersonalScheduleEvent
        event={initialEvent}
        eventColor="blue"
        borderColor="black"
      />,
    );

    // Verify initial state
    const eventElement = within(container).getByTestId(
      `SchedulerEvent-${initialEvent.id}`,
    );
    expect(eventElement).toHaveStyle(`top: ${initialTop}px`);
    expect(eventElement).toHaveStyle("background-color: blue");
    expect(eventElement).toHaveStyle("border: 2px solid black");

    // Initial title is visible with event-title-sm class (25 <= height < 40)
    const initialTitle = within(container).getByTestId("SchedulerEvent-title");
    expect(initialTitle).toHaveClass("event-title-sm");

    // Time is not visible initially (height < 40)
    expect(
      within(container).queryByTestId("SchedulerEvent-time"),
    ).not.toBeInTheDocument();

    // Create event with different properties
    const updatedEvent = {
      ...initialEvent,
      startTime: "10:00 AM", // Changed
      endTime: "11:00 AM", // Now 60 min - title and time should be visible
    };

    // Calculate new expected values
    const updatedStartMinutes = convertTimeToMinutes(updatedEvent.startTime);
    const updatedTop = updatedStartMinutes + TOP_POSITION_OFFSET;

    // Re-render with new props
    rerender(
      <PersonalScheduleEvent
        event={updatedEvent}
        eventColor="red" // Changed
        borderColor="green" // Changed
      />,
    );

    // Verify all properties updated correctly
    expect(eventElement).toHaveStyle(`top: ${updatedTop}px`);
    expect(eventElement).toHaveStyle("background-color: red");
    expect(eventElement).toHaveStyle("border: 2px solid green");

    // Verify title now has event-title-lg class (height >= 60)
    const updatedTitle = within(container).getByTestId("SchedulerEvent-title");
    expect(updatedTitle).toHaveClass("event-title-lg");

    // Verify time is now visible (height >= 40)
    const timeElement = within(container).getByTestId("SchedulerEvent-time");
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveClass("PersonalScheduleCard");
  });

  function convertTimeToEndTime(startTime, durationMinutes) {
    const [timePart, modifier] = [startTime.slice(0, -2), startTime.slice(-2)];
    let [hours, minutes] = timePart.split(":").map(Number);

    // Convert to 24-hour format
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // Add duration
    minutes += durationMinutes;
    while (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }

    // Convert back to 12-hour format
    let newModifier = hours < 12 ? "AM" : "PM";
    let newHours = hours % 12;
    if (newHours === 0) newHours = 12;

    return `${newHours}:${minutes.toString().padStart(2, "0")} ${newModifier}`;
  }

  test("initializes with default title class of event-title-xs", () => {
    // Test with a very short event where title would be hidden
    const tinyEvent = {
      ...mockEvent,
      id: "tiny-event",
      startTime: "9:00 AM",
      endTime: "9:10 AM", // 10 min height - no title visible
    };

    const { container } = render(
      <PersonalScheduleEvent
        event={tinyEvent}
        eventColor="blue"
        borderColor="black"
      />,
    );

    // Since event is too small to show title, we can't check the class directly
    // But we can verify the component rendered without errors
    const eventCard = within(container).getByTestId(
      `SchedulerEvent-${tinyEvent.id}`,
    );
    expect(eventCard).toBeInTheDocument();
    expect(eventCard).toHaveClass("scheduler-event");

    // Verify no title is shown for very short events
    expect(
      within(container).queryByTestId("SchedulerEvent-title"),
    ).not.toBeInTheDocument();

    // Now render a slightly larger event where title would be visible
    const smallEvent = {
      ...mockEvent,
      id: "small-event",
      startTime: "9:00 AM",
      endTime: "9:25 AM", // 25 min height - title visible with sm class
    };

    const { container: container2 } = render(
      <PersonalScheduleEvent
        event={smallEvent}
        eventColor="blue"
        borderColor="black"
      />,
    );

    // Now we can check the title and its class
    const titleElement = within(container2).getByTestId("SchedulerEvent-title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("event-title-sm");
  });
});
