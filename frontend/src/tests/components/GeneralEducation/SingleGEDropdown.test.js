import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";

import SingleGEDropdown from "main/components/GeneralEducation/SingleGEDropdown";
import { oneGEArea } from "fixtures/GEAreaFixtures";
import { threeGEAreas } from "fixtures/GEAreaFixtures";
import { outOfOrderGEAreas } from "fixtures/GEAreaFixtures";

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: jest.fn(),
    compareValues: jest.fn(),
}));

describe("SingleGEDropdown tests", () => {
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
            <SingleGEDropdown areas={oneGEArea} setArea={setArea} controlId="ssd1" />,
        );
    });

    test("renders without crashing on three areas", async () => {
        render(
            <SingleGEDropdown
                areas={[threeGEAreas[2], threeGEAreas[0], threeGEAreas[1]]}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        const A1 = "ssd1-option-A1";
        const B = "ssd1-option-B";
        const C = "ssd1-option-C";

        // Check that blanks are replaced with hyphens
        await waitFor(() => expect(screen.getByTestId(A1).toBeInTheDocument));
        await waitFor(() => expect(screen.getByTestId(B).toBeInTheDocument));
        await waitFor(() => expect(screen.getByTestId(C).toBeInTheDocument));

        // Check that the options are sorted
        // See: https://www.atkinsondev.com/post/react-testing-library-order/
        const allOptions = screen.getAllByTestId("ssd1-option-", { exact: false });
        for (let i = 0; i < allOptions.length - 1; i++) {
            console.log("[i]" + allOptions[i].value);
            console.log("[i+1]" + allOptions[i + 1].value);
            expect(allOptions[i].value < allOptions[i + 1].value).toBe(true);
        }
    });

    test('renders "ALL" option when showAll is true', async () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
                showAll={true}
            />,
        );

        const allOption = screen.queryByTestId("ssd1-option-all");
        expect(allOption).toBeInTheDocument();
        expect(allOption).toHaveValue("ALL");
        expect(allOption).toHaveTextContent("ALL");

        // ensure other options are present
        const firstGEAreaOption = await screen.findByTestId("ssd1-option-A1");
        expect(firstGEAreaOption).toBeInTheDocument();
        expect(firstGEAreaOption).toHaveTextContent("A1");

        const secondGEAreaOption = await screen.findByTestId("ssd1-option-B");
        expect(secondGEAreaOption).toBeInTheDocument();
        expect(secondGEAreaOption).toHaveTextContent("B");

        const thirdGEAreaOption = await screen.findByTestId("ssd1-option-C");
        expect(thirdGEAreaOption).toBeInTheDocument();
        expect(thirdGEAreaOption).toHaveTextContent("C");
    });

    test('"ALL" option is not available when showAll is false', () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
                showAll={false} // already false by default, so just visual
            />,
        );

        const allOption = screen.queryByTestId("ssd1-option-all");
        expect(allOption).not.toBeInTheDocument();
    });

    test('"ALL" option is not available by default when showAll is not passed', () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd15"
            // showAll is not passed, should default to false
            />,
        );

        const allOption = screen.queryByTestId("ssd15-option-all");
        expect(allOption).not.toBeInTheDocument();
    });

    test("sorts and puts hyphens in testids", () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );
    });

    test("when I select an object, the value changes", async () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();

        const selectGEArea = screen.getByLabelText("GE Area");
        userEvent.selectOptions(selectGEArea, "A1");
        expect(setArea).toBeCalledWith("A1");
    });

    test('when I select "ALL" option, value changes to "ALL"', async () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
                showAll={true}
            />,
        );

        expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();

        const selectGEArea = screen.getByLabelText("GE Area");
        userEvent.selectOptions(selectGEArea, "ALL");
        expect(setArea).toBeCalledWith("ALL");
    });

    test("out of order areas is sorted by GEAreaCode", async () => {
        render(
            <SingleGEDropdown
                areas={outOfOrderGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        expect(await screen.findByText("GE Area")).toBeInTheDocument();
        expect(screen.getByText("A1")).toHaveAttribute(
            "data-testid",
            "ssd1-option-A1",
        );
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
                onChange={onChange}
            />,
        );

        expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();

        const selectGEArea = screen.getByLabelText("GE Area");
        userEvent.selectOptions(selectGEArea, "A1");
        await waitFor(() => expect(setArea).toBeCalledWith("A1"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("A1");
    });

    test('onChange is called when value is "ALL"', async () => {
        const onChange = jest.fn();
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
                showAll={true}
                onChange={onChange}
            />,
        );

        expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();

        const selectGEArea = screen.getByLabelText("GE Area");
        userEvent.selectOptions(selectGEArea, "ALL");
        await waitFor(() => expect(setArea).toBeCalledWith("ALL"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("ALL");
    });

    test("default label is GE Area", async () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        expect(await screen.findByLabelText("GE Area")).toBeInTheDocument();
    });

    test("keys / testids are set correctly on options", async () => {
        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        const expectedKey = "ssd1-option-A1";
        await waitFor(() =>
            expect(screen.getByTestId(expectedKey).toBeInTheDocument),
        );
    });

    test("when localstorage has a value, it is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
        getItemSpy.mockImplementation(() => "A1");

        const setGEAreaStateSpy = jest.fn();
        useState.mockImplementation((x) => [x, setGEAreaStateSpy]);

        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        await waitFor(() => expect(useState).toBeCalledWith("A1"));
    });

    test("when localstorage has no value, first element of subject list is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
        getItemSpy.mockImplementation(() => null);

        const setGEAreaStateSpy = jest.fn();
        useState.mockImplementation((x) => [x, setGEAreaStateSpy]);

        render(
            <SingleGEDropdown
                areas={threeGEAreas}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        await waitFor(() =>
            expect(useState).toBeCalledWith(expect.objectContaining({})),
        );
    });

    test("When no GE areas, dropdown is blank", async () => {
        render(
            <SingleGEDropdown
                areas={[]}
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        const expectedKey = "ssd1";
        expect(screen.queryByTestId(expectedKey)).toBeNull();
    });

    test("when no areas prop is passed, component uses empty default and renders nothing", () => {
        render(
            <SingleGEDropdown
                // Don't pass areas prop - let it use the default []
                area={area}
                setArea={setArea}
                controlId="ssd1"
            />,
        );

        // When areas defaults to empty array, component should render nothing
        const dropdown = screen.queryByTestId("ssd1");
        expect(dropdown).not.toBeInTheDocument();
    });
});

