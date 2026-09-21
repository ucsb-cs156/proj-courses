import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";
import UsersSearchForm from "main/components/Users/UsersSearchForm";

import { useBackend } from "main/utils/useBackend";
import OurPagination from "main/components/Utils/OurPagination";
import useLocalStorage from "main/utils/useLocalStorage";

const AdminUsersPage = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStorage("UsersSearch.PageSize", "10");
  const [sortField, setSortField] = useLocalStorage(
    "UsersSearch.SortField",
    "email",
  );
  const [sortDirection, setSortDirection] = useLocalStorage(
    "UsersSearch.SortDirection",
    "ASC",
  );

  const {
    data: page,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/admin/users", selectedPage, pageSize, sortField, sortDirection],
    {
      // Stryker disable next-line StringLiteral : GET is default, so replacing with "" is an equivalent mutation
      method: "GET",
      url: "/api/admin/users",
      params: {
        page: selectedPage - 1,
        pageSize,
        sortField,
        sortDirection,
      },
    },
    { content: [], totalPages: 0 },
  );

  return (
    <BasicLayout>
      <h2>Users</h2>
      <UsersSearchForm
        updateSortField={setSortField}
        updateSortDirection={setSortDirection}
        updatePageSize={setPageSize}
      />
      <OurPagination
        updateActivePage={setSelectedPage}
        totalPages={page.totalPages}
      />
      <UsersTable users={page.content} />
    </BasicLayout>
  );
};

export default AdminUsersPage;
