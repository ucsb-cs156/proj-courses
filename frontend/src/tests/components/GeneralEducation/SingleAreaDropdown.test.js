import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";

import SingleAreaDropdown from "main/components/GeneralEducation/SingleAreaDropdown";
import { oneArea } from "fixtures/geAreaFixtures";
import { threeAreas } from "fixtures/geAreaFixtures";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  compareValues: jest.fn(),
}));

describe("SingleAreaDropdown tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
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
  });

  const area = jest.fn();
  const setArea = jest.fn();

  test("renders without crashing on one area", () => {
    render(
      <SingleAreaDropdown
        areas={oneArea}
        subject={oneArea}
        setArea={setArea}
        controlId="sad1"
      />,
    );
  });

  test("renders without crashing on three areas and sorts them properly", async () => {
    render(
      <SingleAreaDropdown
        areas={[threeAreas[2], threeAreas[1], threeAreas[0]]}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    const A1E = "sad1-option-A1-ENGR";
    const A1L = "sad1-option-A1-L&S";
    const A2L = "sad1-option-A2-L&S";

    // Check that blanks are replaced with hyphens
    await waitFor(() => expect(screen.getByTestId(A1E).toBeInTheDocument));
    await waitFor(() => expect(screen.getByTestId(A1L).toBeInTheDocument));
    await waitFor(() => expect(screen.getByTestId(A2L).toBeInTheDocument));

    // Check that the options are sorted
    // See: https://www.atkinsondev.com/post/react-testing-library-order/
    const allOptions = screen.getAllByTestId("sad1-option-", { exact: false });
    for (let i = 0; i < allOptions.length - 1; i++) {
      console.log("[i]" + allOptions[i].value);
      console.log("[i+1]" + allOptions[i + 1].value);
      expect(allOptions[i].value < allOptions[i + 1].value).toBe(true);
    }
  });

  test('renders "ALL" option when showAll is true', async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
        showAll={true}
      />,
    );

    const allOption = screen.queryByTestId("sad1-option-all");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue("ALL");
    expect(allOption).toHaveTextContent("ALL");

    // ensure other options are present
    const firstSubjectAreaOption = await screen.findByTestId(
      "sad1-option-A1-ENGR",
    );
    expect(firstSubjectAreaOption).toBeInTheDocument();
    expect(firstSubjectAreaOption).toHaveTextContent(
      "A1 - English Reading & Composition (ENGR)",
    );

    const secondSubjectAreaOption =
      await screen.findByTestId("sad1-option-A1-L&S");
    expect(secondSubjectAreaOption).toBeInTheDocument();
    expect(secondSubjectAreaOption).toHaveTextContent(
      "A1 - English Reading & Composition (L&S)",
    );

    const thirdSubjectAreaOption =
      await screen.findByTestId("sad1-option-A2-L&S");
    expect(thirdSubjectAreaOption).toBeInTheDocument();
    expect(thirdSubjectAreaOption).toHaveTextContent(
      "A2 - English Reading & Composition (L&S)",
    );
  });

  test('"ALL" option is not available when showAll is false', () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
        showAll={false} // already false by default, so just visual
      />,
    );

    const allOption = screen.queryByTestId("sad1-option-all");
    expect(allOption).not.toBeInTheDocument();
  });

  test('"ALL" option is not available by default when showAll is not passed', () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad15"
        // showAll is not passed, should default to false
      />,
    );

    const allOption = screen.queryByTestId("sad15-option-all");
    expect(allOption).not.toBeInTheDocument();
  });

  test("sorts and puts hyphens in testids", () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );
  });

  test("when I select an object, the value changes", async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectElement = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectElement, "A1-L&S");
    expect(setArea).toHaveBeenCalledWith("A1-L&S");
  });

  test('when I select "ALL" option, value changes to "ALL"', async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
        showAll={true}
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectElement = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectElement, "ALL");
    expect(setArea).toHaveBeenCalledWith("ALL");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
        onChange={onChange}
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectElement = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectElement, "A1-L&S");
    await waitFor(() => expect(setArea).toHaveBeenCalledWith("A1-L&S"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("A1-L&S");
  });

  test('onChange is called when value is "ALL"', async () => {
    const onChange = jest.fn();
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
        showAll={true}
        onChange={onChange}
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectElement = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectElement, "ALL");
    await waitFor(() => expect(setArea).toHaveBeenCalledWith("ALL"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("ALL");
  });
  test("default label is General Education Area", async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    const expectedKey = "sad1-option-A1-L&S";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "A1-L&S");

    const setSubjectStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setSubjectStateSpy]);

    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    await waitFor(() => expect(useState).toHaveBeenCalledWith("A1-L&S"));
  });

  test("when localstorage has no value, first element of ubject area list is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setAreaStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setAreaStateSpy]);

    render(
      <SingleAreaDropdown
        areas={threeAreas}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    await waitFor(() =>
      expect(useState).toHaveBeenCalledWith(expect.objectContaining({})),
    );
  });

  test("When no areas, dropdown is blank", async () => {
    render(
      <SingleAreaDropdown
        areas={[]}
        area={area}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    const expectedKey = "sad1";
    expect(screen.queryByTestId(expectedKey)).toBeNull();
  });
});
