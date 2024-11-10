import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Inspector } from "react-inspector";
import { useSystemInfo } from "main/utils/systemInfo";

const DeveloperPage = () => {
  const { data: systemInfo } = useSystemInfo();
  const env = process.env;
  return (
    <BasicLayout>
      <h2>Developer Page</h2>
      <Inspector data={systemInfo} name={"systemInfo"} />
      <Inspector data={env} name={"env"} />
    </BasicLayout>
  );
};

export default DeveloperPage;
