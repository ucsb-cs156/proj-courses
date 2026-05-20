import { fireEvent, render, screen } from "@testing-library/react";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";
import { oneSection, fourSections } from "fixtures/sectionFixtures";

const testid = "ConvertedSectionTable";

describe("ConvertedSectionTable tests", () => {
  describe("flat table", () => {
    test("renders with expected headers", () => {
      render(<ConvertedSectionTable sections={[]} />);

      expect(screen.getByTestId(testid)).toBeInTheDocument();

      const expectedHeaders = [
        "Quarter",
        "CourseId",
        "Title",
        "EnrollCd",
        "Status",
        "Enrolled",
        "Days",
        "Time",
        "Location",
        "Instructors",
        "Section",
        "Summer Session",
      ];

      expectedHeaders.forEach((header) => {
        expect(screen.getByText(header)).toBeInTheDocument();
      });
    });

    test("renders with expected fields", () => {
      render(<ConvertedSectionTable sections={oneSection} />);

      const quarter = screen.getByTestId(`${testid}-cell-row-0-col-quarter`);
      expect(quarter).toBeInTheDocument();
      expect(quarter).toHaveTextContent("W22");

      const courseId = screen.getByTestId(`${testid}-cell-row-0-col-courseId`);
      expect(courseId).toBeInTheDocument();
      expect(courseId).toHaveTextContent("ECE 1A -1");

      const title = screen.getByTestId(`${testid}-cell-row-0-col-title`);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("COMP ENGR SEMINAR");

      const enrollCd = screen.getByTestId(
        `${testid}-cell-row-0-col-enrollCode`,
      );
      expect(enrollCd).toBeInTheDocument();
      expect(enrollCd).toHaveTextContent("12583");

      const status = screen.getByTestId(`${testid}-cell-row-0-col-status`);
      expect(status).toBeInTheDocument();
      expect(status).toHaveTextContent("Open");

      const enrolled = screen.getByTestId(`${testid}-cell-row-0-col-enrolled`);
      expect(enrolled).toBeInTheDocument();
      expect(enrolled).toHaveTextContent("84/100");

      const days = screen.getByTestId(`${testid}-cell-row-0-col-days`);
      expect(days).toBeInTheDocument();
      expect(days).toHaveTextContent("M");

      const time = screen.getByTestId(`${testid}-cell-row-0-col-time`);
      expect(time).toBeInTheDocument();
      expect(time).toHaveTextContent("3:00 PM - 3:50 PM");

      const location = screen.getByTestId(`${testid}-cell-row-0-col-location`);
      expect(location).toBeInTheDocument();
      expect(location).toHaveTextContent("BUCHN 1930");

      const section = screen.getByTestId(`${testid}-cell-row-0-col-section`);
      expect(section).toBeInTheDocument();
      expect(section).toHaveTextContent("0100");

      const summer_session = screen.getByTestId(
        `${testid}-cell-row-0-col-summer_session`,
      );
      expect(summer_session).toBeInTheDocument();
      expect(summer_session.textContent).toBe("A");

      const instructors = screen.getByTestId(
        `${testid}-cell-row-0-col-instructors`,
      );
      expect(instructors).toBeInTheDocument();
      expect(instructors).toHaveTextContent("WANG L C");
    });

    test("regex works as expected", () => {
      const regexSection = [
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       1A -1",
            title: "COMP ENGR SEMINAR",
            description:
              "Introductory seminar to expose students to a broad range of topics in computer   engineering.",
          },
          section: {
            enrollCode: "12583",
            section: "0100",
            session: "A01",
          },
        },
      ];
      render(<ConvertedSectionTable sections={regexSection} />);
      const summer_session = screen.getByTestId(
        `${testid}-cell-row-0-col-summer_session`,
      );
      expect(summer_session).toBeInTheDocument();
      expect(summer_session.textContent).toBe("A01");
    });

    test("renders OurTable when groupSectionsUnderLectures is disabled", () => {
      render(<ConvertedSectionTable sections={fourSections} />);

      expect(
        screen.queryByTestId(`${testid}-expand-all-rows`),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`${testid}-row-0-expand-button`),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId(`${testid}-header-quarter-sort-header`),
      ).toBeInTheDocument();
      expect(screen.getAllByText("0100")).toHaveLength(2);
      expect(screen.getByText("0101")).toBeInTheDocument();
      expect(screen.getByText("0102")).toBeInTheDocument();
      expect(screen.getByTestId(`${testid}-row-0`)).toBeInTheDocument();
      expect(screen.getByTestId(`${testid}-row-3`)).toBeInTheDocument();
    });
  });

  describe("grouped table", () => {
    test("shows lectures and hides sections until expanded", () => {
      render(
        <ConvertedSectionTable
          sections={fourSections}
          groupSectionsUnderLectures
        />,
      );

      expect(screen.getAllByText("0100")).toHaveLength(2);
      expect(screen.queryByText("0101")).not.toBeInTheDocument();
      expect(screen.queryByText("0102")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(`${testid}-row-1-expand-button`));
      expect(screen.getByText("0101")).toBeInTheDocument();
      expect(screen.getByText("0102")).toBeInTheDocument();
    });

    test("nests sections ending in 0 under matching lecture", () => {
      const sectionsWith0110 = [
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       5  -1",
            title: "INTRO TO ECE",
          },
          section: { section: "0100" },
        },
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       5  -1",
            title: "INTRO TO ECE",
          },
          section: { section: "0110" },
        },
      ];

      render(
        <ConvertedSectionTable
          sections={sectionsWith0110}
          groupSectionsUnderLectures
        />,
      );

      expect(screen.queryByText("0110")).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId(`${testid}-row-0-expand-button`));
      expect(screen.getByText("0110")).toBeInTheDocument();
    });

    test("nests sections under the correct lecture when a course has two lectures", () => {
      const twoLectureSections = [
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       5  -1",
            title: "INTRO TO ECE",
          },
          section: { section: "0100" },
        },
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       5  -1",
            title: "INTRO TO ECE",
          },
          section: { section: "0200" },
        },
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       5  -1",
            title: "INTRO TO ECE",
          },
          section: { section: "0101" },
        },
        {
          courseInfo: {
            quarter: "20221",
            courseId: "ECE       5  -1",
            title: "INTRO TO ECE",
          },
          section: { section: "0201" },
        },
      ];

      render(
        <ConvertedSectionTable
          sections={twoLectureSections}
          groupSectionsUnderLectures
        />,
      );

      fireEvent.click(screen.getByTestId(`${testid}-row-0-expand-button`));
      expect(screen.getByText("0101")).toBeInTheDocument();
      expect(screen.queryByText("0201")).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId(`${testid}-row-0-expand-button`));
      fireEvent.click(screen.getByTestId(`${testid}-row-1-expand-button`));
      expect(screen.getByText("0201")).toBeInTheDocument();
      expect(screen.queryByText("0101")).not.toBeInTheDocument();
    });

    describe("expander column", () => {
      test("header toggles all expandable rows", () => {
        render(
          <ConvertedSectionTable
            sections={fourSections}
            groupSectionsUnderLectures
          />,
        );

        const expandAllButton = screen.getByTestId(`${testid}-expand-all-rows`);
        expect(expandAllButton).toBeInTheDocument();
        expect(expandAllButton).toHaveTextContent("➕");
        expect(screen.queryByText("0101")).not.toBeInTheDocument();
        expect(screen.queryByText("0102")).not.toBeInTheDocument();

        fireEvent.click(expandAllButton);
        expect(expandAllButton).toHaveTextContent("➖");
        expect(screen.getByText("0101")).toBeInTheDocument();
        expect(screen.getByText("0102")).toBeInTheDocument();

        fireEvent.click(expandAllButton);
        expect(expandAllButton).toHaveTextContent("➕");
        expect(screen.queryByText("0101")).not.toBeInTheDocument();
        expect(screen.queryByText("0102")).not.toBeInTheDocument();
      });

      test("row buttons toggle individual lectures", () => {
        render(
          <ConvertedSectionTable
            sections={fourSections}
            groupSectionsUnderLectures
          />,
        );

        expect(
          screen.getByTestId(`${testid}-row-0-cannot-expand`),
        ).toBeInTheDocument();

        const expandRowButton = screen.getByTestId(
          `${testid}-row-1-expand-button`,
        );
        expect(expandRowButton).toBeInTheDocument();
        expect(expandRowButton).toHaveAttribute("style", "cursor: pointer;");
        expect(expandRowButton).toHaveTextContent("➕");
        expect(screen.queryByText("0101")).not.toBeInTheDocument();
        expect(screen.queryByText("0102")).not.toBeInTheDocument();

        fireEvent.click(expandRowButton);
        expect(expandRowButton).toHaveTextContent("➖");
        expect(screen.getByText("0101")).toBeInTheDocument();
        expect(screen.getByText("0102")).toBeInTheDocument();

        fireEvent.click(expandRowButton);
        expect(expandRowButton).toHaveTextContent("➕");
        expect(screen.queryByText("0101")).not.toBeInTheDocument();
        expect(screen.queryByText("0102")).not.toBeInTheDocument();
      });

      test("shows cannot-expand for lectures with no sections", () => {
        render(
          <ConvertedSectionTable
            sections={oneSection}
            groupSectionsUnderLectures
          />,
        );

        expect(
          screen.getByTestId(`${testid}-row-0-cannot-expand`),
        ).toBeInTheDocument();
      });
    });
  });
});
