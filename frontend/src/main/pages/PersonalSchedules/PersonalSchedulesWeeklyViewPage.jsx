import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulePanel from "main/components/PersonalSchedules/PersonalSchedulePanel";
import { useBackend } from "main/utils/useBackend";
import { Button, Row, Col } from "react-bootstrap";
import { transformToEvents } from "main/utils/dateUtils";

export default function PersonalSchedulesWeeklyViewPage() {
  let { id } = useParams();
  const navigate = useNavigate();

  const {
    data: personalSchedule,
    _error,
    _status,
  } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/personalschedules?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/personalschedules?id=${id}`,
      params: {
        id,
      },
    },
  );
  // Stryker restore all

  const { data: personalSection } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/personalSections/all?psId=${id}`],
    {
      method: "GET",
      url: `/api/personalSections/all?psId=${id}`,
      params: {
        id,
      },
    },
  );
  // Stryker restore all

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Weekly Schedule View</h1>
        {personalSchedule && <h2>{personalSchedule.name}</h2>}
        <Row className="mb-3">
          <Col className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate(`/personalschedules/details/${id}`)}
            >
              Back to Details
            </Button>
          </Col>
        </Row>
        {personalSection && (
          <div className="mt-4">
            <PersonalSchedulePanel
              Events={transformToEvents(personalSection)}
            />
          </div>
        )}
      </div>
    </BasicLayout>
  );
}
