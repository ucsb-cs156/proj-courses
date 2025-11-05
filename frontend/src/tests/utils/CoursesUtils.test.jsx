import { vi } from "vitest";
import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/CoursesUtils";
import mockConsole from "tests/testutils/mockConsole";;

const mockToast = vi.fn();
vi.mock("react-toastify", () => {
  const originalModule = vi.importActual("react-toastify");
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
      const cell = { row: { original: { id: 17 } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
        url: "/api/courses/user",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });
});
