import { render, screen, within } from "@testing-library/react";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";
import { oneSection } from "fixtures/sectionFixtures";

describe("ConvertedSectionTable tests", () => {
  afterEach(() => {
    vi.doUnmock("main/components/OurTable");
  });

  const sectionWith = ({ quarter = "20233", session = null } = {}) => ({
    ...oneSection[0],
    courseInfo: {
      ...oneSection[0].courseInfo,
      quarter,
    },
    section: {
      ...oneSection[0].section,
      session,
    },
  });

  const sectionWithoutSession = ({ quarter = "20233" } = {}) => {
    const { session: _session, ...section } = oneSection[0].section;
    return {
      ...oneSection[0],
      courseInfo: {
        ...oneSection[0].courseInfo,
        quarter,
      },
      section,
    };
  };

  test("renders with expected headers", () => {
    render(<ConvertedSectionTable sections={[]} />);

    expect(screen.getByTestId("ConvertedSectionTable")).toBeInTheDocument();

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
    ];

    expectedHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    expect(screen.queryByText("Session")).not.toBeInTheDocument();
  });

  test("renders with expected fields", () => {
    const testid = "AnotherTestId";
    render(<ConvertedSectionTable sections={oneSection} testid={testid} />);

    const quarter = screen.getByTestId(`${testid}-cell-row-0-col-quarter`);
    expect(quarter).toBeInTheDocument();
    expect(quarter).toHaveTextContent("W22");

    const courseId = screen.getByTestId(`${testid}-cell-row-0-col-courseId`);
    expect(courseId).toBeInTheDocument();
    expect(courseId).toHaveTextContent("ECE 1A -1");

    const title = screen.getByTestId(`${testid}-cell-row-0-col-title`);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("COMP ENGR SEMINAR");

    const enrollCd = screen.getByTestId(`${testid}-cell-row-0-col-enrollCode`);
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

    const instructors = screen.getByTestId(
      `${testid}-cell-row-0-col-instructors`,
    );
    expect(instructors).toBeInTheDocument();
    expect(instructors).toHaveTextContent("WANG L C");
  });

  test("renders session column after Section when requested", () => {
    const testid = "SessionTable";
    render(
      <ConvertedSectionTable
        sections={[]}
        testid={testid}
        showSession={true}
      />,
    );

    const headerRow = screen.getByTestId(`${testid}-header-group-0`);
    const headers = within(headerRow)
      .getAllByRole("columnheader")
      .map((header) => header.textContent);

    expect(headers.slice(-2)).toEqual(["Section", "Session"]);
  });

  test("renders summer session A and B from sixth character", () => {
    const testid = "SessionTable";
    const sections = [
      sectionWith({ session: "00000A  " }),
      sectionWith({ session: "00000B  " }),
    ];

    render(
      <ConvertedSectionTable
        sections={sections}
        testid={testid}
        showSession={true}
      />,
    );

    expect(
      screen.getByTestId(`${testid}-cell-row-0-col-session`),
    ).toHaveTextContent("A");
    expect(
      screen.getByTestId(`${testid}-cell-row-1-col-session`),
    ).toHaveTextContent("B");
  });

  test("renders blank session for non-summer or missing session", () => {
    const testid = "SessionTable";
    const sections = [
      sectionWith({ quarter: "20231", session: "00000A  " }),
      sectionWithoutSession(),
      sectionWith({ session: "" }),
      sectionWith({ session: "0000" }),
    ];

    render(
      <ConvertedSectionTable
        sections={sections}
        testid={testid}
        showSession={true}
      />,
    );

    sections.forEach((_section, index) => {
      expect(
        screen.getByTestId(`${testid}-cell-row-${index}-col-session`)
          .textContent,
      ).toBe("");
    });
  });

  test("renders blank session when courseInfo is missing or null", async () => {
    vi.resetModules();
    vi.doMock("main/components/OurTable", () => ({
      default: ({ data, columns, testid }) => {
        const sessionColumn = columns.find(
          (column) => column.accessorKey === "session",
        );
        return (
          <table data-testid={testid}>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td data-testid={`${testid}-cell-row-${index}-col-session`}>
                    {sessionColumn.cell({ row: { original: row } })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      },
    }));

    const { default: ConvertedSectionTableWithMockedOurTable } =
      await import("main/components/Common/ConvertedSectionTable");
    const testid = "MissingCourseInfoSessionTable";
    const sections = [
      {
        ...oneSection[0],
        courseInfo: null,
        section: { ...oneSection[0].section, session: "00000A  " },
      },
      {
        ...oneSection[0],
        section: { ...oneSection[0].section, session: "00000B  " },
      },
    ];

    expect(() =>
      render(
        <ConvertedSectionTableWithMockedOurTable
          sections={sections}
          testid={testid}
          showSession={true}
        />,
      ),
    ).not.toThrow();

    sections.forEach((_section, index) => {
      expect(
        screen.getByTestId(`${testid}-cell-row-${index}-col-session`)
          .textContent,
      ).toBe("");
    });
  });

  test("renders blank session when section is missing or null", async () => {
    vi.resetModules();
    vi.doMock("main/components/OurTable", () => ({
      default: ({ data, columns, testid }) => {
        const sessionColumn = columns.find(
          (column) => column.accessorKey === "session",
        );
        return (
          <table data-testid={testid}>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td data-testid={`${testid}-cell-row-${index}-col-session`}>
                    {sessionColumn.cell({ row: { original: row } })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      },
    }));

    const { default: ConvertedSectionTableWithMockedOurTable } =
      await import("main/components/Common/ConvertedSectionTable");
    const testid = "MissingSectionSessionTable";
    const sections = [
      {
        ...oneSection[0],
        courseInfo: { ...oneSection[0].courseInfo, quarter: "20233" },
        section: null,
      },
      {
        ...oneSection[0],
        courseInfo: { ...oneSection[0].courseInfo, quarter: "20233" },
      },
    ];

    expect(() =>
      render(
        <ConvertedSectionTableWithMockedOurTable
          sections={sections}
          testid={testid}
          showSession={true}
        />,
      ),
    ).not.toThrow();

    sections.forEach((_section, index) => {
      expect(
        screen.getByTestId(`${testid}-cell-row-${index}-col-session`)
          .textContent,
      ).toBe("");
    });
  });
});
