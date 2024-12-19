import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UpdatesSearchForm from "main/components/Updates/UpdatesSearchForm";
import UpdatesTable from "main/components/Updates/UpdatesTable";
import { useState } from "react";
import { useBackend } from "main/utils/useBackend";
import OurPagination from "main/components/Utils/OurPagination";

export default function AdminUpdatesPage() {
  const testId = "AdminUpdatesPage";

  const [selectedPage, setSelectedPage] = useState(1);
  const refreshJobsIntervalMilliseconds = 500;

  const localSubject = localStorage.getItem("UpdatesSearch.SubjectArea");
  const localQuarter = localStorage.getItem("UpdatesSearch.Quarter");
  const localSortField = localStorage.getItem("UpdatesSearch.SortField");
  const localSortDirection = localStorage.getItem(
    "UpdatesSearch.SortDirection",
  );
  const localPageSize = localStorage.getItem("UpdatesSearch.PageSize");

  const [quarter, setQuarter] = useState(localQuarter || "ALL");
  const [subject, setSubject] = useState(localSubject || "ALL");
  const [sortField, setSortField] = useState(localSortField || "subjectArea");
  const [sortDirection, setSortDirection] = useState(
    localSortDirection || "ASC",
  );
  const [pageSize, setPageSize] = useState(localPageSize || "10");

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
        testId={testId}
      />
      <UpdatesTable updates={page.content} />
    </BasicLayout>
  );
}
