import {
  convertToFraction,
  formatLocation,
  isSection,
  formatDays,
  formatTime,
  formatInstructors,
  formatInfoLink,
  renderInfoLink,
  renderCourseIdLink,
  formatStatus,
  isLectureWithNoSections,
  shouldShowAddToScheduleLink,
} from "main/utils/sectionUtils";
import primaryFixtures from "fixtures/primaryFixtures";

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
    const course = primaryFixtures.f24_math_lowerDiv[0];
    test("formatInfoLink works on a primary", () => {
      const row = {
        depth: 0,
        original: { ...course },
      };
      expect(formatInfoLink(row)).toBe("/coursedetails/20244/30247");
    });
    test("formatInfoLink works on another primary", () => {
      const row = {
        depth: 1,
        original: { ...course.subRows[0] },
        getParentRow: () => ({ depth: 0, original: { ...course } }),
      };
      expect(formatInfoLink(row)).toBe("/coursedetails/20244/30254");
    });
  });

  describe("renderInfoLink tests", () => {
    const course = primaryFixtures.f24_math_lowerDiv[0];
    test("renderInfoLink test", () => {
      const row = {
        depth: 0,
        original: { ...course },
      };
      const view = renderInfoLink(row, "testid");
      expect(view.props.children.props.style.color).toBe("black");
      expect(view.props.children.props.href).toBe("/coursedetails/20244/30247");
      expect(view.props.children.props["target"]).toBe("_blank");
    });
  });

  describe("renderCourseIdLink tests", () => {
    const course = primaryFixtures.f24_math_lowerDiv[0];
    test("renderCourseIdLink test for primary row", () => {
      const row = {
        id: 0,
        depth: 0,
        original: { ...course },
      };
      const view = renderCourseIdLink(row, "testid");
      expect(view.props.href).toBe("/coursedetails/20244/30247");
      expect(view.props["target"]).toBe("_blank");
      expect(view.props["data-testid"]).toBe("testid-row-0-col-courseId-link");
      expect(view.props.children).toBe("MATH 2A");
    });
    test("renderCourseIdLink test for subrow", () => {
      const row = {
        id: 1,
        depth: 1,
        original: { ...course.subRows[0] },
        getParentRow: () => ({ depth: 0, original: { ...course } }),
      };
      const view = renderCourseIdLink(row, "testid");
      expect(view.props.href).toBe("/coursedetails/20244/30254");
      expect(view.props["target"]).toBe("_blank");
      expect(view.props["data-testid"]).toBe("testid-row-1-col-courseId-link");
      expect(view.props.children).toBe("MATH 2A");
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
  describe("tests that depend on what kind of row it is", () => {
    const rowForLectureWithSubRows = {
      original: { ...primaryFixtures.f24_math_lowerDiv[0] },
    };
    const rowForLectureWithNoSubrows = {
      original: { ...primaryFixtures.singleLectureSectionWithNoDiscussion[0] },
    };
    const subrowForDiscussionSection = {
      original: { ...primaryFixtures.f24_math_lowerDiv[0].subRows[0] },
    };

    test("isLectureWithNoSections true test", () => {
      expect(isLectureWithNoSections(rowForLectureWithNoSubrows)).toBe(true);
      expect(isLectureWithNoSections(rowForLectureWithSubRows)).toBe(false);
      expect(isLectureWithNoSections(subrowForDiscussionSection)).toBe(false);
    });

    test("shouldShowAddToScheduleLink returns correct values", () => {
      expect(shouldShowAddToScheduleLink(rowForLectureWithSubRows)).toBe(false);
      expect(shouldShowAddToScheduleLink(rowForLectureWithNoSubrows)).toBe(
        true,
      );
      expect(shouldShowAddToScheduleLink(subrowForDiscussionSection)).toBe(
        true,
      );
    });
  });
});
