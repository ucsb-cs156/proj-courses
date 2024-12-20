import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UpdatesSearchForm from "main/components/Updates/UpdatesSearchForm";
import UpdatesTable from "main/components/Updates/UpdatesTable";
import { useState } from "react";
import useLocalStorage from "main/utils/useLocalStorage";
import { useBackend } from "main/utils/useBackend";
import OurPagination from "main/components/Utils/OurPagination";

export default function AdminUpdatesPage() {
  const [selectedPage, setSelectedPage] = useState(1);
  const refreshJobsIntervalMilliseconds = 500;

  const [quarter, setQuarter] = useLocalStorage("UpdatesSearch.Quarter", "ALL");
  const [subject, setSubject] = useLocalStorage(
    "UpdatesSearch.SubjectArea",
    "ALL",
  );
  const [sortField, setSortField] = useLocalStorage(
    "UpdatesSearch.SortField",
    "subjectArea",
  );
  const [sortDirection, setSortDirection] = useLocalStorage(
    "UpdatesSearch.SortDirection",
    "ASC",
  );
  const [pageSize, setPageSize] = useLocalStorage(
    "UpdatesSearch.PageSize",
    "10",
  );

  // Stryker disable all
  const { data: page } = useBackend(
    ["/api/updates"],
    {
      method: "GET",
      url: "/api/updates",
      params: {
        quarter: quarter,
        subjectArea: subject,
        page: selectedPage - 1,
        pageSize: pageSize,
        sortField: sortField,
        sortDirection: sortDirection,
      },
    },
    { content: [], totalPages: 0 },
    { refetchInterval: refreshJobsIntervalMilliseconds },
  );
  // Stryker restore  all

  return (
    <BasicLayout>
      <h2>Updates</h2>
      <UpdatesSearchForm
        updateQuarter={setQuarter}
        updateSubjectArea={setSubject}
        updateSortField={setSortField}
        updateSortDirection={setSortDirection}
        updatePageSize={setPageSize}
      />
      <OurPagination
        updateActivePage={setSelectedPage}
        totalPages={page.totalPages}
      />
      <UpdatesTable updates={page.content} />
    </BasicLayout>
  );
}
