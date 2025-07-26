import React from "react";
import OurTable from "main/components/OurTable";

const columns = [
  {
    header: "id",
    accessorKey: "id", // accessor is the "key" in the data
  },
  {
    header: "First Name",
    accessorKey: "givenName",
  },
  {
    header: "Last Name",
    accessorKey: "familyName",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Admin",
    id: "admin",
    accessorKey: "admin",
    cell: ({ cell }) => String(cell.row.original.admin), // hack needed for boolean values to show up
  },
];

export default function UsersTable({ users }) {
  return <OurTable data={users} columns={columns} testid={"UsersTable"} />;
}
