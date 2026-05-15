import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";
import usersFixtures from "fixtures/usersFixtures";

const AdminUsersPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // simulate backend pagination using fixtures
  const allUsers = usersFixtures.thirtyUsersPage.content;

  const start = page * pageSize;
  const end = start + pageSize;

  const usersPage = {
    content: allUsers.slice(start, end),
    totalPages: Math.ceil(allUsers.length / pageSize),
  };

  return (
    <BasicLayout>
      <h2>Users</h2>

      <UsersTable users={usersPage.content} />

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {/* First page */}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage(0)}
          disabled={page === 0}
          title="First page"
        >
          «
        </button>

        {/* Previous */}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          title="Previous page"
        >
          ‹
        </button>

        {/* Page indicator */}
        <span style={{ padding: "0 0.75rem", fontWeight: 500 }}>
          Page {page + 1} / {usersPage.totalPages}
        </span>

        {/* Next */}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() =>
            setPage((p) => Math.min(p + 1, usersPage.totalPages - 1))
          }
          disabled={page >= usersPage.totalPages - 1}
          title="Next page"
        >
          ›
        </button>

        {/* Last page */}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setPage(usersPage.totalPages - 1)}
          disabled={page >= usersPage.totalPages - 1}
          title="Last page"
        >
          »
        </button>
      </div>
    </BasicLayout>
  );
};

export default AdminUsersPage;