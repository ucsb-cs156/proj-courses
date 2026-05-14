import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";
import { useBackend } from "main/utils/useBackend";

const AdminUsersPage = () => {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const sortDirection = "ASC";

  const {
    data: usersPage,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/admin/users", page, pageSize, sortDirection],
    {
      // Stryker disable next-line StringLiteral : GET is default, so replacing with "" is an equivalent mutation
      method: "GET",
      url: "/api/admin/users",
      params: { page, pageSize, sortDirection }, 
    },
    [],
  );

  // Returns a table of users with pagination controls, empty array as a fallback for null data
  return (
    <BasicLayout>
      <h2>Users</h2>
      <UsersTable
        users={usersPage?.content ?? []}
        page={page}
        totalPages={usersPage?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </BasicLayout>
  );
};

export default AdminUsersPage;
