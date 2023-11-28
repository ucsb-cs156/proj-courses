import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ReactJson from "react-json-view";
import { useSystemInfo } from "main/utils/systemInfo";

const DeveloperPage = () => {
  const { data: systemInfo } = useSystemInfo();
  return (
    <BasicLayout>
      <h2>Github Branch Information</h2>
      <p>The following SystemInfo is displayed in a JSON file.</p>
      <ReactJson src={systemInfo} />
    </BasicLayout>
  );
};

export default DeveloperPage;
