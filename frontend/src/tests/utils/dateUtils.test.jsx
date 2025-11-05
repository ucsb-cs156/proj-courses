import { vi } from "vitest";
import {
  daysOfWeek,
  hours,
  mapDays,
  transformToEvents,
} from "main/utils/dateUtils";
import * as timeUtils from "main/utils/timeUtils";

// Mock the timeUtils dependency
vi.mock("main/utils/timeUtils", () => ({
  hhmmTohhmma: vi.fn().mockImplementation((time) => {
    // Simple mock implementation for test
    if (time === "10:00") return "10:00 AM";
    if (time === "14:30") return "2:30 PM";
    return time + " (mocked)";
  }),
}));

describe("dateUtils tests", () => {
  describe("daysOfWeek constant", () => {
    test("contains correct days in correct order", () => {
      expect(daysOfWeek).toEqual([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
    });
  });

  describe("hours constant", () => {
    test("contains 15 hours in correct order", () => {
      // hours now starts at 8 AM and ends at 10 PM
      expect(hours.length).toBe(15);
      expect(hours[0]).toBe("8 AM");
      expect(hours[4]).toBe("12 PM");
      expect(hours[14]).toBe("10 PM");
    });
  });

  describe("mapDays function", () => {
    test("handles empty or null input", () => {
      expect(mapDays("")).toEqual([]);
      expect(mapDays(null)).toEqual([]);
      expect(mapDays(undefined)).toEqual([]);
    });

    test("maps single day correctly", () => {
      expect(mapDays("M")).toEqual(["Monday"]);
      expect(mapDays("T")).toEqual(["Tuesday"]);
      expect(mapDays("W")).toEqual(["Wednesday"]);
      expect(mapDays("R")).toEqual(["Thursday"]);
      expect(mapDays("F")).toEqual(["Friday"]);
      expect(mapDays("S")).toEqual(["Saturday"]);
      expect(mapDays("U")).toEqual(["Sunday"]);
    });

    test("maps multiple days correctly", () => {
      expect(mapDays("MWF")).toEqual(["Monday", "Wednesday", "Friday"]);
      expect(mapDays("TR")).toEqual(["Tuesday", "Thursday"]);
      expect(mapDays("MTWRFSU")).toEqual([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
    });

    test("ignores whitespace and unknown characters", () => {
      expect(mapDays("M W F")).toEqual(["Monday", "Wednesday", "Friday"]);
      expect(mapDays(" T  R ")).toEqual(["Tuesday", "Thursday"]);
      expect(mapDays("M-W-F")).toEqual(["Monday", "Wednesday", "Friday"]);
      expect(mapDays("TRX")).toEqual(["Tuesday", "Thursday"]);
    });
  });

  describe("transformToEvents function", () => {
    beforeEach(() => {
      // Clear mock history before each test
      timeUtils.hhmmTohhmma.mockClear();
    });

    test("handles empty or null input", () => {
      expect(transformToEvents([])).toEqual([]);
      expect(transformToEvents(null)).toEqual([]);
      expect(transformToEvents(undefined)).toEqual([]);
    });

    test("transforms simple course section data correctly", () => {
      // Reset the mock implementation for this specific test
      timeUtils.hhmmTohhmma.mockImplementation((time) => {
        if (time === "10:00") return "10:00 AM";
        if (time === "14:30") return "2:30 PM";
        return time + " (mocked)";
      });

      const mockCourseData = [
        {
          courseId: "CMPSC 156",
          title: "Advanced Applications Programming",
          classSections: [
            {
              enrollCode: "12345",
              section: "0100",
              timeLocations: [
                {
                  days: "MW",
                  beginTime: "10:00",
                  endTime: "14:30",
                  building: "PHELP",
                  room: "1401",
                },
              ],
            },
          ],
        },
      ];

      const result = transformToEvents(mockCourseData);

      // Should create 2 events (one for Monday, one for Wednesday)
      expect(result.length).toBe(2);

      // Verify common properties
      expect(result[0].title).toBe("CMPSC 156 (0100)");
      expect(result[0].description).toBe(
        "Advanced Applications Programming - PHELP 1401",
      );
      expect(result[0].startTime).toBe("10:00 AM");
      expect(result[0].endTime).toBe("2:30 PM");

      // Verify specific day properties
      expect(result[0].day).toBe("Monday");
      expect(result[1].day).toBe("Wednesday");

      // Verify IDs follow pattern
      expect(result[0].id).toBe("12345-Monday");
      expect(result[1].id).toBe("12345-Wednesday");

      // Verify timeUtils helper was called
      expect(timeUtils.hhmmTohhmma).toHaveBeenCalledTimes(4); // 2 events x 2 times each
      expect(timeUtils.hhmmTohhmma).toHaveBeenCalledWith("10:00");
      expect(timeUtils.hhmmTohhmma).toHaveBeenCalledWith("14:30");
    });

    test("handles multiple sections and time locations", () => {
      const mockComplexData = [
        {
          courseId: "CMPSC 156",
          title: "Advanced Applications Programming",
          classSections: [
            {
              enrollCode: "12345",
              section: "0100",
              timeLocations: [
                {
                  days: "TR",
                  beginTime: "10:00",
                  endTime: "14:30",
                  building: "PHELP",
                  room: "1401",
                },
              ],
            },
            {
              enrollCode: "67890",
              section: "0200",
              timeLocations: [
                {
                  days: "F",
                  beginTime: "10:00",
                  endTime: "14:30",
                  building: "PHELP",
                  room: "1402",
                },
              ],
            },
          ],
        },
      ];

      const result = transformToEvents(mockComplexData);

      // Should create 3 events (Tuesday, Thursday from first section, Friday from second)
      expect(result.length).toBe(3);

      // Check different sections have proper identifiers
      const tuesdayEvent = result.find((e) => e.day === "Tuesday");
      const fridayEvent = result.find((e) => e.day === "Friday");

      expect(tuesdayEvent.id).toContain("12345");
      expect(tuesdayEvent.title).toContain("0100");

      expect(fridayEvent.id).toContain("67890");
      expect(fridayEvent.title).toContain("0200");
      expect(fridayEvent.description).toContain("1402");
    });

    test("handles missing or malformed data gracefully", () => {
      const mockIncompleteData = [
        {
          // Missing courseId
          classSections: [
            {
              enrollCode: "12345",
              // Missing section
              timeLocations: [
                {
                  days: "M",
                  // Missing times and location
                },
              ],
            },
          ],
        },
        {
          courseId: "CMPSC 130A",
          title: "Data Structures",
          // No classSections
        },
      ];

      const result = transformToEvents(mockIncompleteData);

      // Should still create an event for Monday despite missing data
      expect(result.length).toBe(1);

      // Check default values are used where data is missing
      expect(result[0].title).toContain("N/A");
      expect(result[0].day).toBe("Monday");
    });
  });
  test("Handle when classSections has no timeLocations", () => {
    const mockData = [
      {
        courseId: "CMPSC 156",
        title: "Advanced Applications Programming",
        classSections: [
          {
            enrollCode: "12345",
            section: "0100",
            timeLocations: null, // No time locations
          },
        ],
      },
    ];

    const result = transformToEvents(mockData);
    expect(result.length).toBe(0); // Should return empty array since no time locations
  });
});
