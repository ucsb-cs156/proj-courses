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
    if (!time) return 0;
    if (time.includes("AM") || time.includes("PM")) {
      const timeStr = time.replace(/\s/g, "");
      const [timePart, modifier] = [timeStr.slice(0, -2), timeStr.slice(-2)];
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    } else {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
  };

  useEffect(() => {
    if (personalSection) {
      const styles = personalSection.flatMap((section, sectionIdx) => {
        if (!section.classSections) return [];

        return section.classSections.flatMap((cls, clsIdx) => {
          if (!cls.timeLocations) return [];

          return cls.timeLocations.map((loc, locIdx) => {
            const start = convertTimeToMinutes(loc.beginTime);
            const end = convertTimeToMinutes(loc.endTime);
            const height = end - start;

            return {
              id: `${sectionIdx}-${clsIdx}-${locIdx}`,
              title: section.title || "Untitled",
              startTime: loc.beginTime,
              endTime: loc.endTime,
              description: `${section.courseId?.trim()} — ${loc.building} ${loc.room}`,
              style: {
                position: "absolute",
                top: `${start + 94}px`,
                height: `${height}px`,
                width: "100%",
                backgroundColor: "#b3d9ff",
                border: "2px solid #3399ff",
                zIndex: 1,
                padding: "2px",
              },
              titleStyle: {
                fontSize: height < 25 ? "10px" : height < 40 ? "12px" : "14px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
              height: height,
            };
          });
        });
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
