import React from "react";
import OurTable, {
  PlaintextColumn,
  DateColumn,
} from "main/components/OurTable";

// import { useNavigate } from "react-router-dom";

export default function JobsTable({ jobs }) {
  const testid = "JobsTable";

  const truncateLog = (log) => {
    const lines = log.split("\n")
    if (lines.length > 10) {
      return lines.slice(0,10).join("\n") + "\n..."
    }
    return log;
  };

  // let navigate = useNavigate();

  // const navigateCallback = (cell) => {
  //   let id = cell.row.original.id
  //   let path =`/admin/jobs/${id}`; 
  //   navigate(path);
  // };


  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    DateColumn("Created", (cell) => cell.row.original.createdAt),
    DateColumn("Updated", (cell) => cell.row.original.updatedAt),
    {
      Header: "Status",
      accessor: "status",
    },
    PlaintextColumn("Log", (cell) => truncateLog(cell.row.original.log)),
    // ButtonColumn("Detailed Logs", "primary", navigateCallback)
  ];

  const sortees = React.useMemo(
    () => [
      {
        id: "id",
        desc: true,
      },
    ],
    // Stryker disable next-line all
    [],
  );

  return (
    <OurTable
      data={jobs}
      columns={columns}
      testid={testid}
      initialState={{ sortBy: sortees }}
    />
  );
}
