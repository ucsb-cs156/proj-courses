import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RateLimitedIPsSearchForm from "main/components/RateLimitedIPs/RateLimitedIPsSearchForm";
import RateLimitedIPsTable from "main/components/RateLimitedIPs/RateLimitedIPsTable";
import { useBackend } from "main/utils/useBackend";
import useLocalStorage from "main/utils/useLocalStorage";
import OurPagination from "main/components/Utils/OurPagination";

const AdminRateLimitingPage = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStorage(
    "RateLimitedIPsSearch.PageSize",
    "10",
  );
  const [sortField, setSortField] = useLocalStorage(
    "RateLimitedIPsSearch.SortField",
    "requestCount",
  );
  const [sortDirection, setSortDirection] = useLocalStorage(
    "RateLimitedIPsSearch.SortDirection",
    "DESC",
  );

  // Stryker disable all
  const { data: page } = useBackend(
    ["/api/admin/rate-limited-ips"],
    {
      method: "GET",
      url: "/api/admin/rate-limited-ips",
      params: {
        page: selectedPage - 1,
        pageSize: pageSize,
        sortField: sortField,
        sortDirection: sortDirection,
      },
    },
    { content: [], totalPages: 0 },
  );
  // Stryker restore all

  return (
    <BasicLayout>
      <h2 className="p-3">Rate Limiting</h2>
      <RateLimitedIPsSearchForm
        updateSortField={setSortField}
        updateSortDirection={setSortDirection}
        updatePageSize={setPageSize}
      />
      <OurPagination
        updateActivePage={setSelectedPage}
        totalPages={page.totalPages}
      />
      <RateLimitedIPsTable rateLimitedIPs={page.content} />
    </BasicLayout>
  );
};

export default AdminRateLimitingPage;
