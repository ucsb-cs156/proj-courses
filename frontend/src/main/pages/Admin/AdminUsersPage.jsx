import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersPaginated from "main/components/Users/UsersPaginated";

import { useBackend } from "main/utils/useBackend";

const AdminUsersPage = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize] = useState(10);

  const {
    data: page,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/admin/users/paginated", selectedPage, pageSize],
    {
      method: "GET",
      url: "/api/admin/users/paginated",
      params: {
        page: selectedPage - 1,
        pageSize: pageSize,
        sortField: "id",
        sortDirection: "ASC",
      },
    },
    { content: [], totalPages: 0 },
  );

  return (
    <BasicLayout>
      <h2>Users</h2>
      <UsersPaginated
        users={page.content}
        totalPages={page.totalPages}
        onPageChange={setSelectedPage}
      />
    </BasicLayout>
  );
};

export default AdminUsersPage;
