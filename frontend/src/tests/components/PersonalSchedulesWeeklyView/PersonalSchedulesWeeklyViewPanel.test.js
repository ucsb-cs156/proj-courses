import React from "react";
import { render, screen, within } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import PersonalSchedulesWeeklyView from "main/components/PersonalSchedulesWeeklyView/PersonalSchedulesWeeklyViewPanel";
import { personalSectionsEventsFixtures } from "fixtures/personalSectionsEventsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

describe("PersonalSchedulesWeeklyViewPanel tests", () => {
  const queryClient = new QueryClient();
  const events = personalSectionsEventsFixtures.threeEvents;

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
    "",
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
  ];

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalSchedulesWeeklyView />
        </Router>
      </QueryClientProvider>,
    );

    daysOfWeek.forEach((day) => {
      const dayTitle = screen.getByTestId(
        `PersonalSchedulesWeeklyView-${day}-title`,
      );
      expect(dayTitle).toBeInTheDocument();
      const { getByText } = within(dayTitle);
      expect(getByText(day)).toBeInTheDocument();
    });

    hours.forEach((hour) => {
      const hourSlot = screen.getByTestId(
        `PersonalSchedulesWeeklyView-${hour.replace(" ", "-")}-title`,
      );
      expect(hourSlot).toBeInTheDocument();
      const { getByTestId } = within(hourSlot);
      expect(
        getByTestId(
          `PersonalSchedulesWeeklyView-${hour.replace(" ", "-")}-label`,
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getAllByTestId("PersonalSchedulesWeeklyView-base-slot").length,
    ).toBe(161);
  });

  test("renders events on correct days", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalSchedulesWeeklyView Events={events} />
        </Router>
      </QueryClientProvider>,
    );

    events.forEach((event) => {
      expect(
        screen.getAllByTestId(`PersonalSectionsEvent-${event.id}`).length,
      ).toBe(event.day.length);
      event.day.forEach((dayElement) => {
        const dayColumn = screen.getByTestId(
          `PersonalSchedulesWeeklyView-${dayElement}-column`,
        );
        expect(dayColumn).toBeInTheDocument();
        const { getByTestId } = within(dayColumn);
        expect(
          getByTestId(`PersonalSectionsEvent-${event.id}`),
        ).toBeInTheDocument();
      });
    });
  });

  test("renders without events", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <PersonalSchedulesWeeklyView Events={[]} />
        </Router>
      </QueryClientProvider>,
    );

    daysOfWeek.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    hours.forEach((hour) => {
      expect(screen.getByText(hour)).toBeInTheDocument();
    });
  });
});
