import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function GeneralEducationSearchPage() {
  return (
    <BasicLayout>
      <div className="container mt-3">
        <h1>CSV Downloads</h1>

        <h2>Download by Quarter and Subject Area</h2>

        <p>
          Improved UX coming soon; for now, visit{" "}
          <a href="/swagger-ui/index.html#/API%20for%20course%20data%20as%20CSV%20downloads/csvForCoursesQuarterAndSubjectArea">
            this link
          </a>
          , using <code>qyyyy</code> format for quarter (e.g. <code>20254</code>{" "}
          for F25, <code>20261</code> for W26, <code>20262</code> for S26, etc)
        </p>

        <h2>Download all UCSB classes by Quarter</h2>

        <p>
          Improved UX coming soon; for now, visit{" "}
          <a href="//swagger-ui/index.html#/API%20for%20course%20data%20as%20CSV%20downloads/csvForCourses">
            this link
          </a>{" "}
          using <code>qyyyy</code> format for quarter (e.g. <code>20254</code>{" "}
          for F25, <code>20261</code> for W26, <code>20262</code> for S26, etc)
        </p>
      </div>
    </BasicLayout>
  );
}
