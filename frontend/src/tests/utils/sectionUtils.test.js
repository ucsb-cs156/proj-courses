import {
  convertToFraction,
  formatLocation,
  isSection,
  formatDays,
  formatTime,
  formatInstructors,
  formatInfoLink,
  renderInfoLink,
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/sectionUtils";
import { oneSection } from "../../fixtures/sectionFixtures";
import mockConsole from "jest-mock-console";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: jest.fn(),
  };
});

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
  test("convertToFraction one null test 1", () => {
    expect(convertToFraction(null, "100")).toBe("");
  });

  test("convertToFraction one null test 2", () => {
    expect(convertToFraction("100", null)).toBe("");
  });

  test("isSection true test", () => {
    expect(isSection("0104")).toBe(true);
  });

  test("isSection false test", () => {
    expect(isSection("0100")).toBe(false);
  });

  test("formatLocation test", () => {
    expect(formatLocation(testTimeLocations)).toBe("LOC1 1, LOC2 2");
  });

  test("formatDays test 1", () => {
    expect(formatDays(testTimeLocations)).toBe("M W, R F");
  });

  test("formatDays test 2", () => {
    expect(formatDays(testTimeLocations1)).toBe("R F");
  });

  test("formatTime test 3", () => {
    expect(formatTime(testTimeLocations)).toBe(
      "3:30 PM - 4:45 PM, 10:30 AM - 11:45 AM",
    );
  });

  test("formatInstructors test", () => {
    expect(formatInstructors(testInstructors)).toBe("HESPANHA J P, JOHN S");
  });
  test("formatLocation null test", () => {
    expect(formatLocation(null)).toBe("");
  });

  test("formatDays null test", () => {
    expect(formatDays(null)).toBe("");
  });

  test("formatTime null test", () => {
    expect(formatTime(null)).toBe("");
  });

  test("formatInstructors null test", () => {
    expect(formatInstructors(null)).toBe("");
  });

  test("formatInfoLink test", () => {
    expect(formatInfoLink(oneSection[0])).toBe("/coursedetails/20221/12583");
  });

  test("renderInfoLink test", () => {
    const view = renderInfoLink({
      cell: { value: "/coursedetails/20221/12583" },
    });
    expect(view.props.children.props.style.color).toBe("white");
    expect(view.props.children.props.href).toBe("/coursedetails/20221/12583");
  });

  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      const restoreConsole = mockConsole();

      onDeleteSuccess("abc");

      expect(toast).toHaveBeenCalledWith("abc");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("abc");

      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      const cell = {
        row: {
          values: {
            "classSections[0].enrollCode": "12345",
          },
        },
      };
      const psId = 1;

      const result = cellToAxiosParamsDelete({ cell, psId });

      expect(result).toEqual({
        url: "/api/personalSections/delete",
        method: "DELETE",
        params: {
          psId: psId,
          enrollCd: "12345",
        },
      });
    });
  });
});
