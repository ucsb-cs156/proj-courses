import {
  convertToFraction,
  formatLocation,
  isSection,
  formatDays,
  formatTime,
  formatInstructors,
  formatInfoLink,
  renderInfoLink,
  formatStatus,
} from "main/utils/sectionUtils";
import { oneSection } from "../../fixtures/sectionFixtures";

const testTimeLocations = [
  {
    room: "1",
    building: "LOC1",
    roomCapacity: "90",
    days: "M W",
    beginTime: "15:30",
    endTime: "16:45",
  },
  {
    room: "2",
    building: "LOC2",
    roomCapacity: "90",
    days: "R F",
    beginTime: "10:30",
    endTime: "11:45",
  },
];

const testTimeLocations1 = [
  {
    room: "1",
    building: "LOC1",
    roomCapacity: "90",
    days: null,
    beginTime: "15:30",
    endTime: "16:45",
  },
  {
    room: "2",
    building: "LOC2",
    roomCapacity: "90",
    days: "R F",
    beginTime: "10:30",
    endTime: "11:45",
  },
];

const testInstructors = [
  {
    instructor: "HESPANHA J P",
    functionCode: "Teaching and in charge",
  },
  {
    instructor: "JOHN S",
    functionCode: "Teaching and in charge",
  },
];

describe("section utils tests", () => {
  describe("convertToFraction tests", () => {
    test("convertToFraction one null test 1", () => {
      expect(convertToFraction(null, "100")).toBe("");
    });

    test("convertToFraction one null test 2", () => {
      expect(convertToFraction("100", null)).toBe("");
    });

    test("convertToFraction both null test", () => {
      expect(convertToFraction(null, null)).toBe("");
    });
    test("convertToFraction both not null test", () => {
      expect(convertToFraction("100", "200")).toBe("100/200");
    });
  });
  describe("isSection tests", () => {
    test("isSection true test", () => {
      expect(isSection("0104")).toBe(true);
    });

    test("isSection false test", () => {
      expect(isSection("0100")).toBe(false);
    });
  });
  describe("formatLocation tests", () => {
    test("formatLocation test", () => {
      expect(formatLocation(testTimeLocations)).toBe("LOC1 1, LOC2 2");
    });
    test("formatLocation null test", () => {
      expect(formatLocation(null)).toBe("");
    });
  });
  describe("formatDays tests", () => {
    test("formatDays test 1", () => {
      expect(formatDays(testTimeLocations)).toBe("M W, R F");
    });

    test("formatDays test 2", () => {
      expect(formatDays(testTimeLocations1)).toBe("R F");
    });

    test("formatDays null test", () => {
      expect(formatDays(null)).toBe("");
    });
  });

  describe("formatTime tests", () => {
    test("formatTime test 3", () => {
      expect(formatTime(testTimeLocations)).toBe(
        "3:30 PM - 4:45 PM, 10:30 AM - 11:45 AM",
      );
    });
    test("formatTime null test", () => {
      expect(formatTime(null)).toBe("");
    });
  });

  describe("formatInstructors tests", () => {
    test("formatInstructors test", () => {
      expect(formatInstructors(testInstructors)).toBe("HESPANHA J P, JOHN S");
    });
    test("formatInstructors null test", () => {
      expect(formatInstructors(null)).toBe("");
    });
  });

  describe("formatInfoLink tests", () => {
    test("formatInfoLink test", () => {
      expect(formatInfoLink(oneSection[0])).toBe("/coursedetails/20221/12583");
    });
  });

  describe("renderInfoLink tests", () => {
    test("renderInfoLink test", () => {
      const view = renderInfoLink({
        cell: { value: "/coursedetails/20221/12583" },
      });
      expect(view.props.children.props.style.color).toBe("white");
      expect(view.props.children.props.href).toBe("/coursedetails/20221/12583");
    });
  });

  describe("formatStatus tests", () => {
    test("formatStatus cancelled test", () => {
      const section = { courseCancelled: true };
      expect(formatStatus(section)).toBe("Cancelled");
    });

    test("formatStatus closed test", () => {
      const section = { classClosed: "Y" };
      expect(formatStatus(section)).toBe("Closed");
    });

    test("formatStatus full test", () => {
      const section = { enrolledTotal: 30, maxEnroll: 30 };
      expect(formatStatus(section)).toBe("Full");
    });

    test("formatStatus open test", () => {
      const section = { enrolledTotal: 20, maxEnroll: 30 };
      expect(formatStatus(section)).toBe("Open");
    });
  });
});
