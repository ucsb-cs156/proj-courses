import { render, screen } from "@testing-library/react";

import FinalExamCard from "main/components/Finals/FinalExamCard";
import { finalsFixtures } from "fixtures/finalsFixtures";

describe("FinalExamCard tests", () => {
  describe("FinalExamCard happy path tests", () => {
    test("renders correctly when parameter is null", () => {
      render(<FinalExamCard finalsInfo={null} />);
      expect(
        screen.queryByText("Final Exam Information"),
      ).not.toBeInTheDocument();
    });

    test("renders correctly for CS24 S26", () => {
      render(<FinalExamCard finalsInfo={finalsFixtures.cmpsc24_s26} />);
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("Tuesday, June 9, 2026 12:00—15:00"),
      ).toBeInTheDocument();
    });

    test("renders correctly for CS196 S26", () => {
      render(<FinalExamCard finalsInfo={finalsFixtures.cmpsc196_s26} />);
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("Contact Professor for Final Exam Information"),
      ).toBeInTheDocument();
    });
  });
  describe("FinalExamCard error path tests", () => {
    test("renders correctly for malformed day of week", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc24_s26,
            examDay: "X",
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("X, June 9, 2026 12:00—15:00"),
      ).toBeInTheDocument();
    });

    test("renders correctly for malformed month", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc24_s26,
            examDate: "20261309",
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("Tuesday, 13 9, 2026 12:00—15:00"),
      ).toBeInTheDocument();
    });

    test("renders correctly when hasFinals is false and there is no comment", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc196_s26,
            hasFinals: false,
            comments: null,
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("No final exam information available."),
      ).toBeInTheDocument();
    });

    test("renders correctly when examDay is missing", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc24_s26,
            examDay: null,
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("Exam information not available."),
      ).toBeInTheDocument();
    });

    test("renders correctly when examDate is missing", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc24_s26,
            examDate: null,
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(screen.getByText("Tuesday, 12:00—15:00")).toBeInTheDocument();
    });

    test("renders correctly when beginTime is missing", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc24_s26,
            beginTime: null,
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("Tuesday, June 9, 2026 —15:00"),
      ).toBeInTheDocument();
    });

    test("renders correctly when endTime is missing", () => {
      render(
        <FinalExamCard
          finalsInfo={{
            ...finalsFixtures.cmpsc24_s26,
            endTime: null,
          }}
        />,
      );
      expect(screen.getByText("Final Exam:")).toBeInTheDocument();
      expect(
        screen.getByText("Tuesday, June 9, 2026 12:00—"),
      ).toBeInTheDocument();
    });
  });
});
