import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SingleAreaDropdown from "main/components/GEAreas/SingleAreaDropdown";
import { allGEAreas } from "../../../fixtures/singleAreaDropdownFixtures";
import { useBackend } from "main/utils/useBackend";

jest.mock("main/utils/useBackend", () => ({
  useBackend: jest.fn(),
}));

describe("SingleAreaDropdown tests", () => {
  const setAreaMock = jest.fn();
  const onChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useBackend.mockReturnValue({
      data: allGEAreas,
      error: null,
    });
  });

  test("renders without crashing and shows label", () => {
    render(
      <SingleAreaDropdown
        area="B"
        setArea={setAreaMock}
        controlId="ge-area-dropdown"
      />
    );

    expect(screen.getByLabelText("GE Area")).toBeInTheDocument();
    expect(screen.getByDisplayValue("B")).toBeInTheDocument();
  });

  test("renders all GE options from backend", () => {
    render(
      <SingleAreaDropdown
        area="C"
        setArea={setAreaMock}
        controlId="ge-area-dropdown"
      />
    );

    allGEAreas.forEach((areaCode) => {
      expect(screen.getByTestId(`ge-area-dropdown-option-${areaCode}`)).toBeInTheDocument();
    });
  });

  test("shows 'ALL' option if showAll is true", () => {
    render(
      <SingleAreaDropdown
        area="A1"
        setArea={setAreaMock}
        controlId="ge-area-dropdown"
        showAll={true}
      />
    );

    expect(screen.getByTestId("ge-area-dropdown-option-all")).toBeInTheDocument();
  });

  test("calls setArea and onChange when an option is selected", async () => {
    render(
      <SingleAreaDropdown
        area="D"
        setArea={setAreaMock}
        controlId="ge-area-dropdown"
        onChange={onChangeMock}
      />
    );

    const select = screen.getByLabelText("GE Area");
    fireEvent.change(select, { target: { value: "ETH" } });

    await waitFor(() => {
      expect(setAreaMock).toHaveBeenCalledWith("ETH");
      expect(onChangeMock).toHaveBeenCalled();
      expect(localStorage.getItem("ge-area-dropdown")).toEqual("ETH");
    });
  });

  test("loads initial value from localStorage", () => {
    localStorage.setItem("ge-area-dropdown", "AMH");

    render(
      <SingleAreaDropdown
        area=""
        setArea={setAreaMock}
        controlId="ge-area-dropdown"
      />
    );

    expect(screen.getByDisplayValue("AMH")).toBeInTheDocument();
  });
});
