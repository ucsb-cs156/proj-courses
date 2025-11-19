import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";

import { useBackend } from "main/utils/useBackend";

const AdminUsersPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  const {
    data: pagedUsers,
    error: _error,
    status: _status,
  } = useBackend(
    [`/api/admin/users/paged`, page, size],
    {
      method: "GET",
      url: `/api/admin/users/paged?page=${page}&size=${size}`,
    },
    [page, size]
  );
  


  const users = pagedUsers?.content || [];
  const totalPages = pagedUsers?.totalPages ?? 1;

  return (
    <BasicLayout>
      <h2>Users</h2>

      {/* Page Size Selecting Thing */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <label htmlFor="pageSizeSelect">Page Size:</label>
        <select
          id="pageSizeSelect"
          className="form-select w-auto"
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0); // Return to pg 0
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <UsersTable users={users} />

      {/* Page Buttons (Inc/Dec) */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>
    </BasicLayout>
  );
};

export default AdminUsersPage;
