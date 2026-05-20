import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Accordion, Form, Button } from "react-bootstrap";

export default function CSVDownloadsPage() {
  const [quarter, setQuarter] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const normalizedQuarter = quarter.trim();
  const normalizedSubjectArea = subjectArea.trim().toUpperCase();

  const isValidQuarter = /^\d{5}$/.test(normalizedQuarter);
  const isValidSubjectArea = normalizedSubjectArea.length > 0;

  const byQuarterUrl = `/api/courses/csv/quarter?yyyyq=${encodeURIComponent(normalizedQuarter)}`;
  const byQuarterAndSubjectUrl =
    `/api/courses/csv/byQuarterAndSubjectArea?yyyyq=${encodeURIComponent(normalizedQuarter)}` +
    `&subjectArea=${encodeURIComponent(normalizedSubjectArea)}`;

  const downloadCsv = (url) => {
    window.location.assign(url);
  };

  const handleQuarterSubmit = (e) => {
    e.preventDefault();
    if (isValidQuarter) {
      downloadCsv(byQuarterUrl);
    }
  };

  const handleQuarterSubjectSubmit = (e) => {
    e.preventDefault();
    if (isValidQuarter && isValidSubjectArea) {
      downloadCsv(byQuarterAndSubjectUrl);
    }
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
                <Form.Group className="mb-3" controlId="quarterOnly">
                  <Form.Label>Quarter (yyyyq)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 20261"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    pattern="\d{5}"
                  />
                  <Form.Text muted>
                    Example: 20254 (F25), 20261 (W26), 20262 (S26)
                  </Form.Text>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isValidQuarter}
                >
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
                <Form.Group className="mb-3" controlId="quarterWithSubject">
                  <Form.Label>Quarter (yyyyq)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 20261"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    pattern="\d{5}"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="subjectArea">
                  <Form.Label>Subject Area</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. CMPSC"
                    value={subjectArea}
                    onChange={(e) => setSubjectArea(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={!isValidQuarter || !isValidSubjectArea}
                >
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
