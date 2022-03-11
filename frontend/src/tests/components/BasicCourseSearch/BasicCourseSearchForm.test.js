import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";

jest.mock("react-toastify", () => ({
	toast: jest.fn(),
}));

describe("BasicCourseSearchForm tests", () => {
	const addToast = jest.fn();
	beforeEach(() => {
		toast.mockReturnValue({
			addToast: addToast,
		});
	});

	test("renders without crashing", () => {
		render(<BasicCourseSearchForm />);
	});

	test("when I select a quarter, the state for quarter changes", () => {
		const { getByLabelText } = render(<BasicCourseSearchForm />);
		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "20204");
		expect(selectQuarter.value).toBe("20204");
	});

	test("when I select a subject, the state for subject changes", () => {
		const { getByLabelText } = render(<BasicCourseSearchForm />);
		const selectSubject = getByLabelText("Subject Area");
		userEvent.selectOptions(selectSubject, "MATH");
		expect(selectSubject.value).toBe("MATH");
	});

	test("when I select a level, the state for level changes", () => {
		const { getByLabelText } = render(<BasicCourseSearchForm />);
		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");
		expect(selectLevel.value).toBe("G");
	});

	test("when I click submit, the right stuff happens", async () => {
		const sampleReturnValue = {
			sampleKey: "sampleValue",
		};

		const setCourseJSONSpy = jest.fn();
		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText } = render(
			<BasicCourseSearchForm
				setCourseJSON={setCourseJSONSpy}
				fetchJSON={fetchJSONSpy}
			/>
		);

		const expectedFields = {
			quarter: "20211",
			subject: "ANTH",
			level: "G",
		};

		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "20211");
		const selectSubject = getByLabelText("Subject Area");
		userEvent.selectOptions(selectSubject, "ANTH");
		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		const submitButton = getByText("Submit");
		userEvent.click(submitButton);

		await waitFor(() => expect(setCourseJSONSpy).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

		expect(setCourseJSONSpy).toHaveBeenCalledWith(sampleReturnValue);
		expect(fetchJSONSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expectedFields
		);

	});

	test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
		const sampleReturnValue = {
			sampleKey: "sampleValue",
			total: 0,
		};

		const setCourseJSONSpy = jest.fn();
		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText } = render(
			<BasicCourseSearchForm
				setCourseJSON={setCourseJSONSpy}
				fetchJSON={fetchJSONSpy}
			/>
		);

		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "20204");
		const selectSubject = getByLabelText("Subject Area");
		userEvent.selectOptions(selectSubject, "MATH");
		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		const submitButton = getByText("Submit");
		userEvent.click(submitButton);

		await waitFor(() => expect(setCourseJSONSpy).toHaveBeenCalledTimes(0));
		expect(toast).toHaveBeenCalledWith(
			"If search were implemented, we would have made a call to the back end to get courses for x subject, x quarter, x level",{
				appearance: "error",
		});
	});


});
