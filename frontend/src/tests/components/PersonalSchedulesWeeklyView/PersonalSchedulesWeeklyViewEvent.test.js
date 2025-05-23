import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import PersonalSectionsEvents from "main/components/PersonalSchedulesWeeklyView/PersonalSchedulesWeeklyViewEvent";
import { personalSectionsEventsFixtures } from "fixtures/personalSectionsEventsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("PersonalSectionsEvents tests", () => {
  const queryClient = new QueryClient();

  const event = personalSectionsEventsFixtures.oneEvent;

  test("renders event with correct styles and popover", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalSectionsEvents
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
    const card = screen.getByText(event.title).closest(".card");
    expect(card).toHaveStyle("background-color: lightblue");
    expect(card).toHaveStyle("border: 2px solid blue");

    expect(
      screen.getByText(`/\b2:00\s*-\s*3:15\b`),
    ).toBeInTheDocument();

    // Simulate a click to show the popover
    fireEvent.click(card);

    // Check if the popover content is correct
    await waitFor(() =>
      expect(
        screen.getByTestId("PersonalSectionsEvent-description"),
      ).toBeInTheDocument(),
    );
  });

  const heights = [
    {
      startTime: "12:00",
      endTime: "12:10",
      expectedFontSize: null,
      expectedHeight: 10,
    },
    {
      startTime: "12:00",
      endTime: "12:20",
      expectedFontSize: "10px",
      expectedHeight: 20,
    },
    {
      startTime: "12:00",
      endTime: "12:30",
      expectedFontSize: "12px",
      expectedHeight: 30,
    },
    {
      startTime: "12:00",
      endTime: "12:40",
      expectedFontSize: "14px",
      expectedHeight: 40,
    },
    {
      startTime: "12:00",
      endTime: "13:00",
      expectedFontSize: "16px",
      expectedHeight: 60,
    },
    {
      startTime: "12:00",
      endTime: "14:00",
      expectedFontSize: "16px",
      expectedHeight: 120,
    },
    {
      startTime: "00:00",
      endTime: "14:00",
      expectedFontSize: "16px",
      expectedHeight: 840,
    },
    {
      startTime: "02:00",
      endTime: "14:00",
      expectedFontSize: "16px",
      expectedHeight: 720,
    },
  ];

  heights.forEach(
    ({ startTime, endTime, expectedFontSize, expectedHeight }) => {
      test(`renders event with height from ${startTime} to ${endTime} with font size ${expectedFontSize}`, async () => {
        render(
          <QueryClientProvider client={queryClient}>
            <Router>
              <PersonalSectionsEvents
                event={{ ...event, startTime, endTime }}
                eventColor="lightblue"
                borderColor="blue"
              />
            </Router>
          </QueryClientProvider>,
        );

        // Check if the event card has correct font size
        if (expectedFontSize === null) {
          expect(
            screen.queryByTestId("PersonalSectionsEvent-title"),
          ).not.toBeInTheDocument();
        } else {
          const cardText = await screen.findByText(event.title);
          expect(cardText).toHaveStyle(`font-size: ${expectedFontSize}`);
        }

        // Check if the event card has correct height
        const card = screen.getByTestId("PersonalSectionsEvent-06619");
        expect(card).toHaveStyle(`height: ${expectedHeight}px`);

        if (expectedHeight >= 40) {
          expect(
            screen.getByTestId("PersonalSectionsEvent-title"),
          ).toBeInTheDocument();
          const time = screen.getByTestId("PersonalSectionsEvent-time");
          expect(time).toBeInTheDocument();
          expect(time).toHaveStyle("font-size: 12px");
          expect(time).toHaveStyle("text-align: left");
        } else if (expectedHeight >= 20) {
          expect(
            screen.queryByTestId("PersonalSectionsEvent-title"),
          ).toBeInTheDocument();
          expect(
            screen.queryByTestId("PersonalSectionsEvent-time"),
          ).not.toBeInTheDocument();
        } else {
          expect(
            screen.queryByTestId("PersonalSectionsEvent-title"),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByTestId("PersonalSectionsEvent-time"),
          ).not.toBeInTheDocument();
        }
      });
    },
  );
});
