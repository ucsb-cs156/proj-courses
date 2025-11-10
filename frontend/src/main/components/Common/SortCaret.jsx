import { getSortCaret } from "main/components/Common/SortCaretUtils";

export default function SortCaret({ header, testId = "testid" }) {
  return (
    <span data-testid={`${testId}-header-${header.column.id}-sort-carets`}>
      {getSortCaret(header)}
    </span>
  );
}
