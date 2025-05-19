import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import { Button, Card, OverlayTrigger, Popover } from "react-bootstrap";
import { useCurrentUser } from "main/utils/currentUser";
import React, { useEffect, useState } from "react";

export default function PersonalSchedulesDetailsPage() {
  let { id } = useParams();
  const { data: currentUser } = useCurrentUser();

  const { data: personalSchedule } = useBackend(
    [`/api/personalschedules?id=${id}`],
    {
      method: "GET",
      url: `/api/personalschedules?id=${id}`,
      params: { id },
    },
  );

  const { data: personalSection } = useBackend(
    [`/api/personalSections/all?psId=${id}`],
    {
      method: "GET",
      url: `/api/personalSections/all?psId=${id}`,
      params: { id },
    },
  );

  const [eventStyles, setEventStyles] = useState([]);

  const convertTimeToMinutes = (time) => {
    const [timePart, modifier] = [time.slice(0, -2), time.slice(-2)];
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (personalSection) {
      const styles = personalSection
        .filter((event) => event.startTime && event.endTime)
        .map((event) => {
          const start = convertTimeToMinutes(event.startTime);
          const end = convertTimeToMinutes(event.endTime);
          const height = end - start;
          const top = start + 94;

          return {
            id: event.id,
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            style: {
              position: "absolute",
              top: `${top}px`,
              height: `${height}px`,
              width: "100%",
              backgroundColor: "#b3d9ff",
              border: "2px solid #3399ff",
              zIndex: 1,
              padding: "2px",
              justifyContent: "center",
              alignItems: "left",
            },
            titleStyle: {
              fontSize:
                height < 25
                  ? "10px"
                  : height < 40
                    ? "12px"
                    : height < 60
                      ? "14px"
                      : "16px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "left",
              margin: "0",
            },
            height: height,
          };
        });
      setEventStyles(styles);
    }
  }, [personalSection]);

  const createButton = () => (
    <Button variant="primary" href="/personalschedules/list">
      Back
    </Button>
  );

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
        <h2>Sections in Personal Schedule</h2>
        {personalSection && (
          <PersonalSectionsTable
            personalSections={personalSection}
            psId={id}
            currentUser={currentUser}
          />
        )}

        {/* Optional visual scheduler block (from SchedulerEvents logic) */}
        <div
          style={{
            position: "relative",
            height: "1200px",
            marginTop: "40px",
            border: "1px solid #ccc",
          }}
        >
          {eventStyles.map((event, idx) => (
            <OverlayTrigger
              key={idx}
              trigger="click"
              placement="auto-start"
              rootClose
              overlay={
                <Popover>
                  <Popover.Header as="h3">{event.title}</Popover.Header>
                  <Popover.Body>
                    <p>
                      {event.startTime} - {event.endTime}
                      <br />
                      {event.description}
                    </p>
                  </Popover.Body>
                </Popover>
              }
            >
              <Card
                style={event.style}
                data-testid={`SchedulerEvent-${event.id}`}
              >
                <Card.Body style={{ padding: "5px" }}>
                  {event.height >= 20 && (
                    <Card.Text style={event.titleStyle}>
                      {event.title}
                    </Card.Text>
                  )}
                  {event.height >= 40 && (
                    <Card.Text style={{ fontSize: "12px", textAlign: "left" }}>
                      {event.startTime} - {event.endTime}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </OverlayTrigger>
          ))}
        </div>

        {createButton()}
      </div>
    </BasicLayout>
  );
}
