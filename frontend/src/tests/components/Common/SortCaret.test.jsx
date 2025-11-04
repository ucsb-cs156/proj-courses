import { render, screen, waitFor } from "@testing-library/react";
import SortCaret from "main/components/Common/SortCaret";

describe("SortCaret tests", () => {
  test("Up arrow when sorted asc", async () => {
    const header = {
      column: {
        id: "testColumn",
        getCanSort: () => true,
        getIsSorted: () => "asc",
      },
    };
    render(<SortCaret header={header} />);
    const testid = "testid";
    const expectedTestId = `${testid}-header-${header.column.id}-sort-carets`;
    await waitFor(() => {
      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });
    expect(screen.getByTestId(expectedTestId)).toHaveTextContent("🔼");
  });

  test("Can specify custom testid", async () => {
    const header = {
      column: {
        id: "testColumn",
        getCanSort: () => true,
        getIsSorted: () => "asc",
      },
    };
    const testid = "customTestId";

    render(<SortCaret header={header} testId={testid} />);
    const expectedTestId = `${testid}-header-${header.column.id}-sort-carets`;
    await waitFor(() => {
      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });
    expect(screen.getByTestId(expectedTestId)).toHaveTextContent("🔼");
  });

  test("Empty when cannot sort", async () => {
    const header = {
      column: {
        id: "testColumn",
        getCanSort: () => false,
      },
    };
    const testid = "customTestId";

    render(<SortCaret header={header} testId={testid} />);
    const expectedTestId = `${testid}-header-${header.column.id}-sort-carets`;
    await waitFor(() => {
      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });
    expect(screen.getByTestId(expectedTestId)).toBeEmptyDOMElement();
  });

  test("Empty when is not sorted", async () => {
    const header = {
      column: {
        id: "testColumn",
        getCanSort: () => true,
        getIsSorted: () => false,
      },
    };
    const testid = "customTestId";

    render(<SortCaret header={header} testId={testid} />);
    const expectedTestId = `${testid}-header-${header.column.id}-sort-carets`;
    await waitFor(() => {
      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });
    expect(screen.getByTestId(expectedTestId)).toBeEmptyDOMElement();
  });

  test("Down arrow when desc", async () => {
    const header = {
      column: {
        id: "testColumn",
        getCanSort: () => true,
        getIsSorted: () => "desc",
      },
    };
    const testid = "customTestId";

    render(<SortCaret header={header} testId={testid} />);
    const expectedTestId = `${testid}-header-${header.column.id}-sort-carets`;
    await waitFor(() => {
      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });
    expect(screen.getByTestId(expectedTestId)).toHaveTextContent("🔽");
  });
});
