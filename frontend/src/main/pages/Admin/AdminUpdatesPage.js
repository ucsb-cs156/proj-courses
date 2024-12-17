import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UpdatesSearchForm from "main/components/Updates/UpdatesSearchForm";
import UpdatesTable from "main/components/Updates/UpdatesTable";
import { useState } from "react";
import { useBackendMutation } from "main/utils/useBackend";

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/updates",
    params: {
      quarter: query.quarter,
      subjectArea: query.subject,
      page: 0,  // TODO: FIXME!
      pageSize: 100 // TODO: FIXME!
    },
  });

  const onSuccess = (updates) => {
    setUpdates(updates.content);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchUpdates(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <h2>Updates</h2>
      <UpdatesSearchForm fetchUpdates={fetchUpdates} />
      <UpdatesTable updates={updates} />
    </BasicLayout>
  );
}
