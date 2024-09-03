import { renderHook, act, waitFor } from "@testing-library/react";
import useLocalStorage from "main/utils/useLocalStorage";
import mockConsole from "jest-mock-console";

describe("useLocalStorage tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("if no value in local storage, the default is used and stored", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {};
      return key in values ? values[key] : null;
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "testValue"),
    );
    expect(result.current[0]).toBe("testValue");
    expect(result.current[1]).toBeInstanceOf(Function);
    expect(getItemSpy).toHaveBeenCalledWith("testKey");
    expect(setItemSpy).toHaveBeenCalledWith(
      "testKey",
      JSON.stringify("testValue"),
    );
  });

  test("if there is a value local storage, it is used, not the default", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {
        testKey: JSON.stringify("localStoredValue"),
      };
      const result = key in values ? values[key] : null;
      return result;
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "testValue"),
    );
    expect(result.current[0]).toBe("localStoredValue");
    expect(result.current[1]).toBeInstanceOf(Function);
    expect(getItemSpy).toHaveBeenCalledWith("testKey");
    expect(setItemSpy).not.toHaveBeenCalled();
  });


  test("if there is a value in local storage and a new value is set, it is used", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {
        testKey: JSON.stringify("localStoredValue"),
      };
      const result = key in values ? values[key] : null;
      return result;
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "testValue"),
    );

    // Due to a weirdness of how renderHook works,
    // result.current[0] is the value of the state
    // and result.current[1] is the function to update it

    act(() => {
        result.current[1]("newStoredValue");
    });
    expect(result.current[0]).toBe("newStoredValue");
    expect(setItemSpy).toHaveBeenCalledWith("testKey", JSON.stringify("newStoredValue"));
  });

  test("error handler in getter works as expected", async () => {
    const restoreConsole = mockConsole();

    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      throw new Error("getItem error");
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "testValue"),
    );

    // Due to a weirdness of how renderHook works,
    // result.current[0] is the value of the state
    // and result.current[1] is the function to update it
   
    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error: when useLocalStorage called getItem"
    );
    restoreConsole();

  });

  test("error handler in setter works as expected", async () => {
    const restoreConsole = mockConsole();

    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {};
      return key in values ? values[key] : null;
    });

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
    setItemSpy.mockImplementation((key, value) => {
      throw new Error("setItem error");
    });

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "testValue"),
    );

    // Due to a weirdness of how renderHook works,
    // result.current[0] is the value of the state
    // and result.current[1] is the function to update it
   
    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error: when useLocalStorage called setItem"
    );
    restoreConsole();

  });

});
