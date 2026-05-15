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

      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={page <= 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 1rem" }}>
          Page {page + 1} / {usersPage.totalPages}
        </span>

        <button
          disabled={page + 1 >= usersPage.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </BasicLayout>
  );
};

export default AdminUsersPage;