import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import OurTable, {
  ButtonColumn,
  convertOldStyleColumnsToNewStyle,
} from "main/components/OurTable";
import ourTableFixtures from "fixtures/ourTableFixtures";

describe("OurTable tests", () => {
  describe("OurTable helper tests", () => {
    test("add id when it doesn't exist", () => {
      const columns = [
        {
          Header: "Column 1",
          accessor: "col1", // accessor is the "key" in the data
        },
      ];

      console.log("columns", columns);
      const newColumns = convertOldStyleColumnsToNewStyle(columns);
      console.log("newColumns", newColumns);
      const expected = [
        {
          id: "col1",
          header: "Column 1",
          accessorKey: "col1",
          Header: "Column 1",
          accessor: "col1", // accessor is the "key" in the data
        },
      ];

      expect(newColumns).toEqual(expected);
    });
  });
  describe("OurTable component tests", () => {
    const threeRows = [
      {
        col1: "Hello",
        col2: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ];

    const clickMeCallback = jest.fn();

    const columns = [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
      ButtonColumn("Click", "primary", clickMeCallback, "testId"),
    ];

    test("renders an empty table without crashing", () => {
      render(<OurTable columns={columns} data={[]} />);
    });

    test("renders a table with three rows with correct test ids", async () => {
      render(<OurTable columns={columns} data={threeRows} testid={"testid"} />);

      await waitFor(() => {
        expect(screen.getByTestId("testid-header-group-0")).toBeInTheDocument();
      });
      expect(screen.getByTestId("testid-header-col1")).toBeInTheDocument();
      expect(screen.getByTestId("testid-header-col2")).toBeInTheDocument();
      expect(screen.getByTestId("testid-row-0")).toBeInTheDocument();
      expect(screen.getByTestId("testid-row-1")).toBeInTheDocument();
      expect(screen.getByTestId("testid-row-2")).toBeInTheDocument();
    });

    test("The button appears in the table", async () => {
      render(<OurTable columns={columns} data={threeRows} />);

      await screen.findByTestId("testId-cell-row-0-col-Click-button");
      const button = screen.getByTestId("testId-cell-row-0-col-Click-button");
      fireEvent.click(button);
      await waitFor(() => expect(clickMeCallback).toBeCalledTimes(1));
    });

    test("default testid is testid", async () => {
      render(<OurTable columns={columns} data={threeRows} />);
      await screen.findByTestId("testid-header-col1");
    });

    test("click on a header and a sort caret should appear", async () => {
      render(
        <OurTable columns={columns} data={threeRows} testid={"sampleTestId"} />,
      );

      await screen.findByTestId("sampleTestId-header-col1");
      const col1Header = screen.getByTestId("sampleTestId-header-col1");
      expect(col1Header).toBeInTheDocument();

      const col1SortCarets = screen.getByTestId(
        "sampleTestId-header-col1-sort-carets",
      );
      expect(col1SortCarets).toBeEmptyDOMElement();

      const col1Row0 = screen.getByTestId("sampleTestId-cell-row-0-col-col1");
      expect(col1Row0).toHaveTextContent("Hello");
    });

    test("placeholder headers work properly", async () => {
      render(
        <OurTable
          columns={ourTableFixtures.placeholderExample.columns}
          data={ourTableFixtures.placeholderExample.data}
          testid={"placeholderHeadersTest"}
        />,
      );
      await waitFor(() => {
        expect(
          screen.getByTestId("placeholderHeadersTest-header-group-0"),
        ).toBeInTheDocument();
      });
      const firstNameHeader = screen.getByTestId(
        "placeholderHeadersTest-header-firstName-sort-header",
      );
      expect(firstNameHeader).toBeInTheDocument();
      expect(firstNameHeader).toHaveTextContent("First Name");
      expect(firstNameHeader).toHaveAttribute("style", "cursor: pointer;");
    });
  });
});
