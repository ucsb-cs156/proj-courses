import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";
import {oneSubject} from "fixtures/subjectFixtures";
import {threeSubjects} from "fixtures/subjectFixtures";
import {outOfOrderSubjects} from "fixtures/subjectFixtures";

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn(),
    compareValues: jest.fn()
  }))
  
import { useState } from 'react';
import { compareValues } from "main/utils/sortHelper";

describe("SingleSubjectDropdown tests", () => {

    beforeEach(() => {
        useState.mockImplementation(jest.requireActual('react').useState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const subject = jest.fn();
    const setSubject = jest.fn();

    test("renders without crashing on one subject", () => {
        render(<SingleSubjectDropdown
            subjects={oneSubject}
            subject={oneSubject}
            setSubject={setSubject}
            controlId="ssd1"
        />);
    });

    test("renders without crashing on three subjects", () => {
        render(<SingleSubjectDropdown
            subjects={threeSubjects}
            subject={subject}
            setSubject={setSubject}
            controlId="ssd1"
        />);
    });

    test("when I select an object, the value changes", async () => {
        const { getByLabelText } =
            render(<SingleSubjectDropdown
                subjects={threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />);
        await waitFor(() => expect(getByLabelText("Subject Area")).toBeInTheDocument);
        const selectQuarter = getByLabelText("Subject Area")
        userEvent.selectOptions(selectQuarter, "ARTHI");
        expect(setSubject).toBeCalledWith("ARTHI");
    });

    test("out of order subjects is sorted by subjectCode", async () => {
        const { getByText } =
            render(<SingleSubjectDropdown
                subjects={outOfOrderSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />);
        await waitFor(() => expect(getByText("Subject Area")).toBeInTheDocument);
        expect(getByText("ANTH - Anthropology")).toHaveAttribute("data-testid", "ssd1-option-0");
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        const { getByLabelText } =
            render(<SingleSubjectDropdown
                subjects={threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
                onChange={onChange}
            />
            );
        await waitFor(() => expect(getByLabelText("Subject Area")).toBeInTheDocument);
        const selectSubject = getByLabelText("Subject Area")
        userEvent.selectOptions(selectSubject, "ARTHI");
        await waitFor(() => expect(setSubject).toBeCalledWith("ARTHI"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x

        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("ARTHI");
    });

    test("default label is Subject Area", async () => {
        const { getByLabelText } =
            render(<SingleSubjectDropdown
                subjects={threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );
        await waitFor(() => expect(getByLabelText("Subject Area")).toBeInTheDocument);
    });

    test("keys / testids are set correctly on options", async () => {
        const { getByTestId } =
            render(<SingleSubjectDropdown
                subjects={threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );
        const expectedKey = "ssd1-option-0"
        await waitFor(() => expect(getByTestId(expectedKey).toBeInTheDocument));
        const firstOption = getByTestId(expectedKey);
    });

    test("when localstorage has a value, it is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => "ARTHI");

        const setSubjectStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setSubjectStateSpy])

        const { getByTestId } =
            render(<SingleSubjectDropdown
                subjects={threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );

        await waitFor(() => expect(useState).toBeCalledWith("ARTHI"));
    });

    test("when localstorage has no value, first element of subject list is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => null);

        const setSubjectStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setSubjectStateSpy])

        const { getByTestId } =
            render(<SingleSubjectDropdown
                subjects={threeSubjects}
                subject={subject}
                setSubject={setSubject}
                controlId="ssd1"
            />
            );

        await waitFor(() => expect(useState).toBeCalledWith("ANTH"));
    });

});