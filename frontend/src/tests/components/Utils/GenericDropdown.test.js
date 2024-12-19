import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import GenericDropdown from "main/components/Utils/GenericDropdown";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

describe("GenericDropdown tests", () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setPizzaTopping = jest.fn();

  test("when I select an object, the value changes", async () => {
    render(
      <GenericDropdown
        values={["Cheese", "Mushroom", "Pepperoni"]}
        setValue={setPizzaTopping}
        controlId="pizza"
        label="Select Pizza Topping"
      />,
    );
    expect(
      await screen.findByLabelText("Select Pizza Topping"),
    ).toBeInTheDocument();
    const selectTopping = screen.getByLabelText("Select Pizza Topping");
    userEvent.selectOptions(selectTopping, "Mushroom");
    expect(setPizzaTopping).toHaveBeenCalledWith("Mushroom");
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "Pepperoni");

    const setQuarterStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setQuarterStateSpy]);

    render(
      <GenericDropdown
        values={["Cheese", "Mushroom", "Pepperoni"]}
        setValue={setPizzaTopping}
        controlId="pizza"
        label="Select Pizza Topping"
      />,
    );

    await screen.findByTestId("pizza-option-0");
    expect(screen.getByTestId("pizza-option-1")).toBeInTheDocument();
    expect(screen.getByTestId("pizza-option-2")).toBeInTheDocument();
  });
});
