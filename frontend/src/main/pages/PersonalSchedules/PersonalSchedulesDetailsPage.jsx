import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import { useBackend } from "main/utils/useBackend";
import { Button, Row, Col } from "react-bootstrap";
import { useCurrentUser } from "main/utils/currentUser";
import PersonalSchedulePanel from "main/components/PersonalSchedules/PersonalSchedulePanel";
import { transformToEvents } from "main/utils/dateUtils";

export default function PersonalSchedulesDetailsPage() {
  let { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();

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

  const backButton = () => {
    return (
      <Button
        variant="primary"
        onClick={() => navigate("/personalschedules/list")}
      >
        Back
      </Button>
    );
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Personal Schedules Details</h1>
        {personalSchedule && (
          <PersonalSchedulesTable
            personalSchedules={[personalSchedule]}
            showButtons={false}
          />
        )}
        <div className="mt-4">
          <Row className="align-items-center mb-3">
            <Col>
              <h2>Sections in Personal Schedule</h2>
            </Col>
          </Row>
          {personalSection && (
            <PersonalSectionsTable
              personalSections={personalSection}
              psId={id}
              currentUser={currentUser}
            />
          )}
          {personalSection && (
            <>
              <h2 className="mt-4">Weekly Schedule</h2>
              <PersonalSchedulePanel Events={transformToEvents(personalSection)} />
            </>
          )}
        </div>
        {backButton()}
      </div>
    </BasicLayout>
  );
}
