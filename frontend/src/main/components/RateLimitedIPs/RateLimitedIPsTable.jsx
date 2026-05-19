import OurTable, { DateColumn } from "main/components/OurTable";

export default function RateLimitedIPsTable({ rateLimitedIPs }) {
  const testid = "RateLimitedIPsTable";

  const columns = [
    {
      header: "IP Address",
      accessorKey: "ipAddress",
    },
    {
      header: "Host Name",
      accessorKey: "hostname",
    },
    {
      header: "Request Count",
      accessorKey: "requestCount",
    },
    {
      header: "Country",
      accessorKey: "country",
    },
    {
      header: "City",
      accessorKey: "city",
    },
    {
      header: "State",
      accessorKey: "state",
    },
    {
      header: "Postal Code",
      accessorKey: "postalCode",
    },
    {
      header: "Latitude",
      accessorKey: "latitude",
    },
    {
      header: "Longitude",
      accessorKey: "longitude",
    },
    DateColumn("Last Request At", (cell) => cell.row.original.lastRequestAt),
  ];

  return <OurTable data={rateLimitedIPs} columns={columns} testid={testid} />;
}
