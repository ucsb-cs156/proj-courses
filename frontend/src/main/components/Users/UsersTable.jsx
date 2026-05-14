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
    cell: ({ cell }) => String(cell.row.original.admin), // hack needed for boolean values to show up
  },
];

export default function UsersTable({ users, page, totalPages, onPageChange }) {
  return (
    <>
      <OurTable data={users} columns={columns} testid={"UsersTable"} />

      <div className="d-flex align-items-center gap-2 mt-2">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
        >
          «
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onPageChange(p => p - 1)}
          disabled={page === 0}
        >
          ‹ Prev
        </button>

        <span>Page {page + 1} of {totalPages}</span>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onPageChange(p => p + 1)}
          disabled={page >= totalPages - 1}
        >
          Next ›
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
        >
          »
        </button>
      </div>
    </>
  );

  //return <OurTable data={users} columns={columns} testid={"UsersTable"} />;
}
