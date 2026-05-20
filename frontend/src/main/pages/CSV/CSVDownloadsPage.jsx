import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Accordion, Form, Button, FormCheck } from "react-bootstrap";
import SingleQuarterDropdown from "../../components/Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../../components/Subjects/SingleSubjectDropdown";
import SingleLevelDropdown from "../../components/Levels/SingleLevelDropdown";
import { useSystemInfo } from "main/utils/systemInfo";
import { quarterRange } from "main/utils/quarterUtilities";
import { useBackend } from "main/utils/useBackend";
import { allTheLevels } from "fixtures/levelsFixtures";

export default function CSVDownloadsPage() {
  const { data: systemInfo } = useSystemInfo();
  const startQtr = systemInfo?.startQtrYYYYQ || "20084";
  const endQtr = systemInfo?.endQtrYYYYQ || "20262";
  const quarters = quarterRange(startQtr, endQtr);

  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/UCSBSubjects/all"],
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );

  const localSearchQuarter = localStorage.getItem("CSVDownloads.Quarter");
  const localSearchSubject = localStorage.getItem("CSVDownloads.Subject");
  const localLevel = localStorage.getItem("CSVDownloads.Level");
  const localOmitSections = localStorage.getItem("CSVDownloads.OmitSections");
  const localWithTimeLocations = localStorage.getItem(
    "CSVDownloads.WithTimeLocations",
  );

  const [quarter, setQuarter] = useState(
    localSearchQuarter || quarters[quarters.length - 1].yyyyq,
  );
  const defaultSubject = "ANTH";
  const [subject, setSubject] = useState(localSearchSubject || defaultSubject);
  const [level, setLevel] = useState(localLevel || "U");
  const [omitSections, setOmitSections] = useState(
    localOmitSections === null ? true : localOmitSections === "true",
  );
  const [withTimeLocations, setWithTimeLocations] = useState(
    localWithTimeLocations === null ? true : localWithTimeLocations === "true",
  );

  const byQuarterUrl = `/api/courses/csv/quarter?yyyyq=${encodeURIComponent(quarter)}`;
  const byQuarterAndSubjectUrl =
    `/api/courses/csv/byQuarterAndSubjectArea?yyyyq=${encodeURIComponent(quarter)}` +
    `&subjectArea=${encodeURIComponent(subject)}` +
    `&level=${encodeURIComponent(level)}` +
    `&omitSections=${encodeURIComponent(omitSections)}` +
    `&withTimeLocations=${encodeURIComponent(withTimeLocations)}`;

  const downloadCsv = (url) => {
    window.location.assign(url);
  };

  const handleQuarterSubmit = (e) => {
    e.preventDefault();
    downloadCsv(byQuarterUrl);
  };

  const handleQuarterSubjectSubmit = (e) => {
    e.preventDefault();
    downloadCsv(byQuarterAndSubjectUrl);
  };

  const handleOmitSectionsChange = (event) => {
    setOmitSections(event.target.checked);
    localStorage.setItem(
      "CSVDownloads.OmitSections",
      event.target.checked.toString(),
    );
  };

  const handleWithTimeLocationsChange = (event) => {
    setWithTimeLocations(event.target.checked);
    localStorage.setItem(
      "CSVDownloads.WithTimeLocations",
      event.target.checked.toString(),
    );
  };

  return (
    <BasicLayout>
      <div className="container mt-3">
        <h1>CSV Downloads</h1>

        <Accordion defaultActiveKey="by-quarter" className="mt-3">
          {/* Download by Quarter */}
          <Accordion.Item eventKey="by-quarter">
            <Accordion.Header>
              Download all UCSB classes by Quarter
            </Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleQuarterSubmit}>
                <SingleQuarterDropdown
                  quarters={quarters}
                  quarter={quarter}
                  setQuarter={setQuarter}
                  controlId="CSVDownloads.Quarter"
                  label="Quarter"
                />
                <Button type="submit" variant="primary" className="mt-3">
                  Download CSV
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          {/* Download by Quarter + Subject Area */}
          <Accordion.Item eventKey="by-quarter-and-subject-area">
            <Accordion.Header>
              Download all UCSB classes by Quarter and Subject Area
            </Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleQuarterSubjectSubmit}>
                <SingleQuarterDropdown
                  quarters={quarters}
                  quarter={quarter}
                  setQuarter={setQuarter}
                  controlId="CSVDownloads.Quarter"
                  label="Quarter"
                />
                <SingleSubjectDropdown
                  subjects={subjects}
                  subject={subject}
                  setSubject={setSubject}
                  controlId="CSVDownloads.Subject"
                  label="Subject Area"
                />
                <SingleLevelDropdown
                  levels={allTheLevels}
                  level={level}
                  setLevel={setLevel}
                  controlId={"CSVDownloads.Level"}
                  label="Course Level"
                />
                <FormCheck
                  data-testid={`CSVDownloads.OmitSections-checkbox`}
                  label="Omit Sections"
                  onChange={handleOmitSectionsChange}
                  checked={omitSections}
                ></FormCheck>
                <FormCheck
                  data-testid={`CSVDownloads.WithTimeLocations-checkbox`}
                  label="Only include courses with assigned Times and Locations"
                  onChange={handleWithTimeLocationsChange}
                  checked={withTimeLocations}
                ></FormCheck>
                <Button type="submit" variant="primary" className="mt-3">
                  Download CSV
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </BasicLayout>
  );
}