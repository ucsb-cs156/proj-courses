import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
  schedulesFilter,
} from "main/utils/PersonalScheduleUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("PersonalScheduleUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("abc");

      // assert
      expect(mockToast).toHaveBeenCalledWith("abc");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("abc");

      restoreConsole();
    });
  });
  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { values: { id: 17 } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
        url: "/api/personalschedules",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });

  describe("schedulesFilter", () => {
    test("schedulesFilter", () => {
      // arrange
      const schedules = [
        { id: 1, quarter: "20241", name: "Schedule 1" },
        { id: 2, quarter: "20242", name: "Schedule 2" },
      ];

      //assert
      expect(schedulesFilter(schedules, "20241")).toEqual([
        { id: 1, quarter: "20241", name: "Schedule 1" },
      ]);
    });
  });
});
