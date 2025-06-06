import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import {
  Button,
  Card,
  OverlayTrigger,
  Popover,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useCurrentUser } from "main/utils/currentUser";
import React, { useEffect, useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const hours = [
  "",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
];

export default function PersonalSchedulesDetailsPage() {
  let { id } = useParams();
  const { data: currentUser } = useCurrentUser();

  const { data: personalSchedule } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/personalschedules?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/personalschedules?id=${id}`,
      params: { id },
    },
  );

  const { data: personalSection } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/personalSections/all?psId=${id}`],
    {
      method: "GET",
      url: `/api/personalSections/all?psId=${id}`,
      params: { id },
    },
  );

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

  // Stryker disable all : hard to test for specific styles
  const [eventStyles, setEventStyles] = useState([]);
  useEffect(() => {
    const dayMap = {
      M: "Monday",
      T: "Tuesday",
      W: "Wednesday",
      R: "Thursday",
      F: "Friday",
      S: "Saturday",
      U: "Sunday",
    };

    if (personalSection) {
      const styles = personalSection.flatMap((section, sectionIdx) => {
        if (!section.classSections) return [];

        return section.classSections.flatMap((cls, clsIdx) => {
          if (!cls.timeLocations) return [];

          return cls.timeLocations.flatMap((loc, locIdx) => {
            const start = convertTimeToMinutes(loc.beginTime);
            const end = convertTimeToMinutes(loc.endTime);
            const height = end - start;

            return (
              loc.days?.split("")?.map((dayAbbrev) => {
                const day = dayMap[dayAbbrev];

                return {
                  id: `${sectionIdx}-${clsIdx}-${locIdx}-${dayAbbrev}`,
                  title: section.title || "Untitled",
                  startTime: loc.beginTime,
                  endTime: loc.endTime,
                  day,
                  description: `${section.courseId?.trim()} — ${loc.building} ${loc.room}`,
                  style: {
                    position: "absolute",
                    top: `${start - 205}px`,
                    height: `${height}px`,
                    width: "100%",
                    backgroundColor: "#b3d9ff",
                    border: "2px solid #3399ff",
                    zIndex: 1,
                    padding: "4px",
                  },
                  titleStyle: {
                    fontSize:
                      height < 25 ? "10px" : height < 40 ? "12px" : "14px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  },
                  height: height,
                };
              }) ?? []
            );
          });
        });
      });
      setEventStyles(styles);
    }
  }, [personalSection]);
  // Stryker restore all

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
          data-testid="calendar-grid"
          style={{
            position: "relative",
            height: "1500px",
            margin: "20px 0",
            border: "1px solid #ddd",
          }}
        >
          <h2 className="mt-4 text-center">Weekly View</h2>
          <div style={styles.weeklyViewWrapper}>
            <Container fluid style={styles.schedulerPanel}>
              <Row style={styles.headerRow}>
                <Col style={styles.timeColumn}></Col>
                {daysOfWeek.map((day) => (
                  <Col key={day} style={styles.dayColumn}>
                    <Card style={styles.dayCard}>
                      <Card.Body>
                        <Card.Title style={styles.dayTitle}>{day}</Card.Title>
                      </Card.Body>
                      {eventStyles
                        .filter((event) => event.day === day)
                        .map((event) => (
                          <OverlayTrigger
                            key={event.id}
                            trigger="click"
                            placement="auto-start"
                            rootClose
                            overlay={
                              <Popover>
                                <Popover.Header as="h3">
                                  {event.title}
                                </Popover.Header>
                                <Popover.Body
                                  data-testid={`PopoverBody-${event.id}`}
                                >
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
                              data-testid={`SchedulerEvent-${event.id}`}
                              style={event.style}
                            >
                              <Card.Body style={{ padding: "5px" }}>
                                <Card.Text
                                  data-testid={`SchedulerEventTitle-${event.id}`}
                                  style={event.titleStyle}
                                >
                                  {event.title}
                                </Card.Text>
                                {event.height >= 40 && (
                                  <Card.Text
                                    data-testid={`SchedulerEventTime-${event.id}`}
                                    style={{
                                      fontSize: "12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {event.startTime} - {event.endTime}
                                  </Card.Text>
                                )}
                              </Card.Body>
                            </Card>
                          </OverlayTrigger>
                        ))}
                    </Card>
                  </Col>
                ))}
              </Row>
              <Row>
                <Col style={styles.timeColumn}>
                  <div
                    style={{ ...styles.timeSlot, height: "30px", border: "0" }}
                  ></div>
                  {hours.map((hour, index) => (
                    <div
                      key={index}
                      style={{ ...styles.timeSlot, border: "0" }}
                    >
                      <span style={styles.hourLabel}>{hour}</span>
                    </div>
                  ))}
                </Col>
                {daysOfWeek.map((day) => (
                  <Col key={day} style={styles.dayColumn}>
                    <div style={{ ...styles.timeSlot, height: "30px" }}></div>
                    {hours.slice(0, hours.length - 1).map((_, index) => (
                      <div key={index} style={styles.timeSlot}>
                        <Card style={styles.eventCard} />
                      </div>
                    ))}
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </div>
        {createButton()}
      </div>
    </BasicLayout>
  );
}

// Stryker disable all: no need to test styles
const styles = {
  weeklyViewWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  schedulerPanel: {
    backgroundColor: "#fff",
    padding: "20px",
  },
  headerRow: {
    textAlign: "center",
  },
  timeColumn: {
    textAlign: "right",
    borderRight: "1px solid #ddd",
    position: "relative",
  },
  dayColumn: {
    padding: 0,
    borderRight: "1px solid #ddd",
  },
  dayCard: {
    backgroundColor: "#ddd",
    borderRadius: "0",
  },
  dayTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  timeSlot: {
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderBottom: "1px solid #ddd",
  },
  eventCard: {
    width: "100%",
    height: "100%",
    border: "0",
    borderRadius: "0",
  },
  hourLabel: {
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "right",
    position: "absolute",
    top: 0,
    right: "5px",
    transform: "translateY(-50%)",
  },
};
// Stryker restore all
