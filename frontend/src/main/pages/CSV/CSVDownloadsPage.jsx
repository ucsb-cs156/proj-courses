import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Accordion, Form, Button } from "react-bootstrap";
import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";
import SingleLevelDropdown from "main/components/Levels/SingleLevelDropdown";
import { useBackend } from "main/utils/useBackend";
import { useSystemInfo } from "main/utils/systemInfo";
import { quarterRange } from "main/utils/quarterUtilities";

// Stryker disable all : testing specific hard-coded dropdown options is just writing the code twice
const csvLevels = [
  ["U", "Undergraduate"],
  ["G", "Graduate"],
  ["A", "All"],
];
// Stryker restore all

export default function CSVDownloadsPage({
  browserLocation = window.location,
}) {
  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker restore OptionalChaining
  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : hard to test internal React Query caching/configuration
  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/UCSBSubjects/all"],
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );
  // Stryker restore all

  const [quarter, setQuarter] = useState(quarters[0].yyyyq);
  const [subjectArea, setSubjectArea] = useState(
    subjects[0]?.subjectCode || "ANTH",
  );
  const [level, setLevel] = useState("U");
  const [omitSections, setOmitSections] = useState(true);
  const [withTimeLocations, setWithTimeLocations] = useState(true);

  const byQuarterUrl = `/api/courses/csv/quarter?yyyyq=${encodeURIComponent(quarter)}`;
  const byQuarterAndSubjectUrl =
    `/api/courses/csv/byQuarterAndSubjectArea?yyyyq=${encodeURIComponent(quarter)}` +
    `&subjectArea=${encodeURIComponent(subjectArea)}` +
    `&level=${encodeURIComponent(level)}` +
    `&omitSections=${omitSections}` +
    `&withTimeLocations=${withTimeLocations}`;

  const downloadCsv = (url) => {
    browserLocation.assign(url);
  };

  const handleQuarterSubmit = (e) => {
    e.preventDefault();
    downloadCsv(byQuarterUrl);
  };

  const handleQuarterSubjectSubmit = (e) => {
    e.preventDefault();
    downloadCsv(byQuarterAndSubjectUrl);
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
                <div className="mb-3">
                  <SingleQuarterDropdown
                    quarters={quarters}
                    quarter={quarter}
                    setQuarter={setQuarter}
                    controlId="CSVDownloads.Quarter"
                  />
                </div>

                <Button type="submit" variant="primary">
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
                <div className="mb-3">
                  <SingleQuarterDropdown
                    quarters={quarters}
                    quarter={quarter}
                    setQuarter={setQuarter}
                    controlId="CSVDownloads.SubjectQuarter"
                  />
                </div>

                <div className="mb-3">
                  <SingleSubjectDropdown
                    subjects={subjects}
                    subject={subjectArea}
                    setSubject={setSubjectArea}
                    controlId="CSVDownloads.Subject"
                  />
                </div>

                <div className="mb-3">
                  <SingleLevelDropdown
                    levels={csvLevels}
                    level={level}
                    setLevel={setLevel}
                    controlId="CSVDownloads.Level"
                  />
                </div>

                <Form.Group
                  className="mb-3"
                  controlId="CSVDownloads.OmitSections"
                >
                  <Form.Check
                    type="checkbox"
                    label="Omit sections"
                    checked={omitSections}
                    onChange={(e) => setOmitSections(e.target.checked)}
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="CSVDownloads.WithTimeLocations"
                >
                  <Form.Check
                    type="checkbox"
                    label="Only include courses with times or locations"
                    checked={withTimeLocations}
                    onChange={(e) => setWithTimeLocations(e.target.checked)}
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
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
