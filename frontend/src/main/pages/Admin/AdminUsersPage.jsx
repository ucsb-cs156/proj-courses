import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";
import { useBackend } from "main/utils/useBackend";

const AdminUsersPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const {
    data: usersPage = {},
  } = useBackend(
    ["/api/admin/users", page, pageSize], 
    {
      method: "GET",
      url: "/api/admin/users",
      params: {
        page,
        pageSize,
        sortDirection: "ASC",
      },
    }
  );

  const totalPages = usersPage.totalPages || 1;
  const users = usersPage.content || [];

  return (
    <BasicLayout>
      <h2>Users</h2>

      <UsersTable users={users} />

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage(0)}
          disabled={page === 0}
          title="First page"
        >
          «
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          title="Previous page"
        >
          ‹
        </button>

        <span style={{ padding: "0 0.75rem", fontWeight: 500 }}>
          Page {page + 1} / {totalPages}
        </span>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          title="Next page"
        >
          ›
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage(totalPages - 1)}
          disabled={page >= totalPages - 1}
          title="Last page"
        >
          »
        </button>
      </div>
    </BasicLayout>
  );
};

export default AdminUsersPage;