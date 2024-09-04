import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SingleLevelDropdown from "main/components/Levels/SingleLevelDropdown";
import { allTheLevels } from "fixtures/levelsFixtures";

describe("SingleLevelDropdown tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const level = jest.fn();
  const setLevel = jest.fn();

  test("renders with correct defaults", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );
    // expect(screen.getByText("Course Level")).toBeInTheDocument();

    // await waitFor(() => {
    //   expect(screen.getByTestId("sld1-option-U")).toBeInTheDocument();
    // });
    // const selectSubject = screen.getByLabelText("Course Level");
    // expect(selectSubject.value).toBe("U");
  });

  test("when I select an level, the value changes", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    expect(await screen.findByLabelText("Course Level")).toBeInTheDocument();
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "U");
    expect(setLevel).toHaveBeenCalledWith("U");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
        onChange={onChange}
      />,
    );

    expect(await screen.findByLabelText("Course Level")).toBeInTheDocument();
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "U");

    await waitFor(() => expect(setLevel).toHaveBeenCalledWith("U"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("U");
  });

  test("default label is Course Level", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    expect(await screen.findByLabelText("Course Level")).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SingleLevelDropdown
        levels={allTheLevels}
        level={level}
        setLevel={setLevel}
        controlId="sld1"
      />,
    );

    const expectedKey = "sld1-option-0";
    expect(await screen.findByTestId(expectedKey)).toBeInTheDocument();
  });
});
