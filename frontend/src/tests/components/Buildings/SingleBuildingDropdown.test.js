import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";

import SingleBuildingDropdown from "main/components/Buildings/SingleBuildingDropdown";
import { oneBuilding } from "fixtures/buildingFixtures";
import { threeBuildings } from "fixtures/buildingFixtures";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  compareValues: jest.fn(),
}));

describe("SingleBuildingDropdown tests", () => {

  beforeEach(() => {
    jest.spyOn(console, 'error')
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
 })

  const building = jest.fn();
  const setBuilding = jest.fn();

  test("renders without crashing on one building", () => {
    render(
      <SingleBuildingDropdown
        buildings={oneBuilding}
        building={oneBuilding}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );
  });

  test("renders without crashing on three buildings", async () => {
     render(
      <SingleBuildingDropdown
        buildings={[ 
          threeBuildings[0],
          threeBuildings[1],
          threeBuildings[2]
        ]}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );

    const ELLSN = "sbd1-option-0";
    const ELNGS = "sbd1-option-1";
    const EMBAR = "sbd1-option-2";

    // Check that blanks are replaced with hyphens
    await waitFor(() => expect(screen.getByTestId(ELLSN).toBeInTheDocument));
    await waitFor(() => expect(screen.getByTestId(ELNGS).toBeInTheDocument));
    await waitFor(() => expect(screen.getByTestId(EMBAR).toBeInTheDocument));

    // Check that the options are sorted
    // See: https://www.atkinsondev.com/post/react-testing-library-order/
    const allOptions = screen.getAllByTestId("sbd1-option-",  { exact: false });
    for (let i = 0; i < allOptions.length - 1; i++) {
      console.log("[i]" + allOptions[i].value);
      console.log("[i+1]" + allOptions[i+1].value);
      expect(allOptions[i].value < allOptions[i + 1].value).toBe(true);
    }

  });

  test("sorts and puts hyphens in testids", () => {
    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );
  });

  test("when I select an object, the value changes", async () => {
    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );
    
    expect(await screen.findByLabelText("Building Name")).toBeInTheDocument();

    const selectBuilding = screen.getByLabelText("Building Name");
    userEvent.selectOptions(selectBuilding, "ELLSN");
    expect(setBuilding).toBeCalledWith("ELLSN");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    const setBuilding = jest.fn();
    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
        onChange={onChange}
      />
    );
    
    expect(await screen.findByLabelText("Building Name")).toBeInTheDocument();

    const selectBuilding = screen.getByLabelText("Building Name");
    userEvent.selectOptions(selectBuilding, "ELLSN");
    await waitFor(() => expect(setBuilding).toBeCalledWith("ELLSN"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("ELLSN");
  });

  test("default label is Building Name", async () => {
    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );
    
    expect(await screen.findByLabelText("Building Name")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );

    const expectedKey = "sbd1-option-0";
    await waitFor(() => expect(screen.getByTestId(expectedKey).toBeInTheDocument));
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "ELLSN");

    const setBuildingStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setBuildingStateSpy]);

    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );

    await waitFor(() => expect(useState).toBeCalledWith("ELLSN"));
  });

  test("when localstorage has no value, first element of building list is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setBuildingStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setBuildingStateSpy]);

    render(
      <SingleBuildingDropdown
        buildings={threeBuildings}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );

    await waitFor(() =>
      expect(useState).toBeCalledWith(expect.objectContaining({}))
    );
  });

  test("When no buildings, dropdown is blank", async () => {
    render(
      <SingleBuildingDropdown
        buildings={[]}
        building={building}
        setBuilding={setBuilding}
        controlId="sbd1"
      />
    );

    const expectedKey = "sbd1";
    expect(screen.queryByTestId(expectedKey)).toBeNull();
  });
});
