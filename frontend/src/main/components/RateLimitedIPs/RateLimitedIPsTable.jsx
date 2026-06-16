import OurTable, { DateColumn } from "main/components/OurTable";

export default function RateLimitedIPsTable({ rateLimitedIPs }) {
  const testid = "RateLimitedIPsTable";

  const columns = [
    {
      header: "IP Address",
      accessorKey: "ipAddress",
      cell: ({ cell }) => (
        <a href={`https://tools.keycdn.com/geo?host=${cell.getValue()}`}>
          {cell.getValue()}
        </a>
      ),
    },
    {
      header: "Request Count",
      accessorKey: "requestCount",
    },
    DateColumn("Last Request At", (cell) => cell.row.original.lastRequestAt),
  ];

  return <OurTable data={rateLimitedIPs} columns={columns} testid={testid} />;
}
