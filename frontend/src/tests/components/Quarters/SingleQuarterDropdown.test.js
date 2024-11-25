import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";
import { quarterRange } from "main/utils/quarterUtilities";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("SingleQuarterSelector tests", () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const quarter = jest.fn();
  const setQuarter = jest.fn();

  test("renders without crashing on one quarter", () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20211")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );
  });

  test("renders without crashing on three quarters", () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20214", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );
  });

  test('renders "ALL" option when showAll is true', async () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20211")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
        showAll={true}
      />,
    );

    const allOption = await screen.findByTestId("sqd1-option-all");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue("ALL");
    expect(allOption).toHaveTextContent("ALL");

    // ensure other options are present
    const firstQuarterOption = screen.getByTestId("sqd1-option-0");
    expect(firstQuarterOption).toBeInTheDocument();
    expect(firstQuarterOption).toHaveValue("20211");
  });

  test('"ALL" option is not avaliable when showAll is false', async () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20211")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
        showAll={false} // default value, so just visual
      />,
    );

    const allOption = screen.queryByTestId("sqd1-option-all");
    expect(allOption).not.toBeInTheDocument();
  });

  test("when I select an object, the value changes", async () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
        label="Select Quarter"
      />,
    );
    expect(await screen.findByLabelText("Select Quarter")).toBeInTheDocument();
    const selectQuarter = screen.getByLabelText("Select Quarter");
    userEvent.selectOptions(selectQuarter, "20213");
    expect(setQuarter).toBeCalledWith("20213");
  });

  test('when I select "ALL" option, value changes to "ALL"', async () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="spd1"
        showAll={true}
        label="Select Quarter"
      />,
    );
    expect(await screen.findByLabelText("Select Quarter")).toBeInTheDocument();
    const selectQuarter = screen.getByLabelText("Select Quarter");
    userEvent.selectOptions(selectQuarter, "ALL");
    expect(selectQuarter.value).toBe("ALL");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
        label="Select Quarter"
        onChange={onChange}
      />,
    );

    expect(await screen.findByLabelText("Select Quarter")).toBeInTheDocument();
    const selectQuarter = screen.getByLabelText("Select Quarter");
    userEvent.selectOptions(selectQuarter, "20213");
    await waitFor(() => expect(setQuarter).toBeCalledWith("20213"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("20213");
  });

  test('onChange is called when value is "ALL"', async () => {
    const onChange = jest.fn();

    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="spd1"
        showAll={true}
        label="Select Quarter"
        onChange={onChange}
      />,
    );

    expect(await screen.findByLabelText("Select Quarter")).toBeInTheDocument();
    const selectQuarter = screen.getByLabelText("Select Quarter");
    userEvent.selectOptions(selectQuarter, "ALL");
    await waitFor(() => expect(setQuarter).toHaveBeenCalledWith("ALL"));
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("ALL");
  });

  test("default label is Quarter", async () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );

    expect(await screen.findByLabelText("Quarter")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20211", "20222")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );

    const expectedKey = "sqd1-option-0";
    expect(await screen.findByTestId(expectedKey)).toBeInTheDocument();
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "20202");

    const setQuarterStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setQuarterStateSpy]);

    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20201", "20224")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("20202"));
  });

  test("when localstorage has no value last element of quarter range is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setQuarterStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setQuarterStateSpy]);

    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20201", "20234")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("20234"));
  });

  test("when localstorage has no value, last element of quarter range is the default parameter", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setQuarterStateSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <SingleQuarterDropdown
        quarters={quarterRange("20201", "20224")}
        quarter={quarter}
        setQuarter={setQuarter}
        controlId="sqd1"
      />,
    );

    await waitFor(() =>
      expect(setQuarterStateSpy).toBeCalledWith("sqd1", "20224"),
    );
  });
});
