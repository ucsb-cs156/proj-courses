export function getSortCaret(header) {
  if (!header.column.getCanSort()) return "";
  if (header.column.getIsSorted() === "asc") {
    return "🔼";
  }
  if (header.column.getIsSorted() === "desc") {
    return "🔽";
  }
  return "";
}

export default function SortCaret({ header, testId = "testid" }) {
  return (
    <span data-testid={`${testId}-header-${header.column.id}-sort-carets`}>
      {getSortCaret(header)}
    </span>
  );
}
