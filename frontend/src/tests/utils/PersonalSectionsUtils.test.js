import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/PersonalSectionsUtils";
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

describe("CoursesUtils", () => {
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
      const cell = {
        row: { values: { "classSections[0].enrollCode": "03452" } },
      };
      const psId = 3;
      // act
      const result = cellToAxiosParamsDelete({ cell: cell, psId: psId });

      // assert
      expect(result).toEqual({
        url: "/api/courses/user/psid",
        method: "DELETE",
        params: { enrollCd: "03452", psId: 3 },
      });
    });
  });
});
