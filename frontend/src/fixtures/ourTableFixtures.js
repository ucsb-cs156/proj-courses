import { createColumnHelper } from "@tanstack/react-table";
const columnHelper = createColumnHelper();

const ourTableFixtures = {
  simpleExample: {
    data: [
      { col1: "Hello", col2: "World" },
      { col1: "react-table", col2: "rocks" },
      { col1: "whatever", col2: "you want" },
    ],
    columns: [
      { header: "Column 1", accessorKey: "col1" },
      { header: "Column 2", accessorKey: "col2" },
    ],
  },
  simpleLegacyExample: {
    data: [
      { col1: "Hello", col2: "World" },
      { col1: "react-table", col2: "rocks" },
      { col1: "whatever", col2: "you want" },
    ],
    columns: [
      { Header: "Column 1", accessor: "col1" },
      { Header: "Column 2", accessor: "col2" },
    ],
  },
  newStyleColumns: {
    columns: [
      columnHelper.accessor("col1", {
        header: "Column 1",
        cell: (info) => info.getValue(), // Simple cell rendering (default behavior)
      }),
      columnHelper.accessor("col2", {
        header: "Column 2",
        cell: (info) => info.getValue(),
      }),
    ],
    data: [
      { col1: "Hello", col2: "World" },
      { col1: "react-table", col2: "rocks" },
      { col1: "whatever", col2: "you want" },
    ],
  },
  complexData: {
    data: [
      {
        firstName: "Tanner",
        lastName: "Linsley",
        age: 24,
        visits: 100,
        status: "In Relationship",
        progress: 50,
        email: "tanner@example.com",
      },
      {
        firstName: "Kevin",
        lastName: "Vandy",
        age: 22,
        visits: 200,
        status: "Single",
        progress: 70,
        email: "kevin@example.com",
      },
      {
        firstName: "Joe",
        lastName: "Biden",
        age: 78,
        visits: 50,
        status: "Complicated",
        progress: 30,
        email: "joe@example.com",
      },
    ],
    columns: [
      columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => info.getValue(), // Simple cell rendering (default behavior)
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("age", {
        header: "Age",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        // This is your custom cell rendering function!
        cell: (info) => {
          const status = info.getValue(); // Get the cell's value
          let statusStyle = {};
          if (status === "In Relationship") {
            statusStyle = { color: "green", fontWeight: "bold" };
          } else if (status === "Single") {
            statusStyle = { color: "blue" };
          } else if (status === "Complicated") {
            statusStyle = { color: "orange" };
          }

          return <span style={statusStyle}>{status}</span>;
        },
      }),
      columnHelper.accessor("email", {
        header: "Email",
        // Another custom cell: rendering a link
        cell: (info) => {
          const email = info.getValue();
          return <a href={`mailto:${email}`}>{email}</a>;
        },
      }),
      columnHelper.display({
        id: "actions", // Unique ID for display columns
        header: "Actions",
        cell: (props) => (
          // You can access the entire row data using props.row.original
          <div>
            <button
              onClick={() => alert(`Editing ${props.row.original.firstName}`)}
            >
              Edit
            </button>{" "}
            <button
              onClick={() => alert(`Deleting ${props.row.original.firstName}`)}
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
  },
  placeholderExample: {
    data: [
      {
        firstName: "Tanner",
        lastName: "Linsley",
        age: 24,
        visits: 100,
        status: "In Relationship",
        progress: 50,
      },
      {
        firstName: "Kevin",
        lastName: "Vandenbossche",
        age: 20,
        visits: 40,
        status: "Single",
        progress: 80,
      },
      // ... more data
    ],
    columns: [
      // Group 1: Name Information
      columnHelper.group({
        header: "Name Information",
        footer: (props) => props.column.id,
        columns: [
          columnHelper.accessor("firstName", {
            header: "First Name",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor("lastName", {
            header: "Last Name",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          }),
        ],
      }),
      // Group 2: Personal Details
      columnHelper.group({
        header: "Personal Details",
        footer: (props) => props.column.id,
        columns: [
          columnHelper.accessor("age", {
            header: "Age",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          }),
          // This column is not part of a direct sub-group but is within 'Personal Details'.
          // To make it align correctly with 'Name Information', TanStack Table might introduce a placeholder.
          columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
          }),
        ],
      }),
      // A standalone column that will likely cause a placeholder in the upper header row
      columnHelper.accessor("visits", {
        header: "Total Visits",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
    ],
  },
};

export default ourTableFixtures;
