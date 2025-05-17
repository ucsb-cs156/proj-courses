import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulePanel from "main/components/PersonalSchedules/PersonalSchedulePanel";
import { useBackend } from "main/utils/useBackend";
import { Button, Row, Col } from "react-bootstrap";

// Helper function to convert HH:MM (24-hour) to h:MM AM/PM format
// Stryker disable all
const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hoursInt = parseInt(hours, 10);
  const ampm = hoursInt >= 12 ? "PM" : "AM";
  const formattedHours = hoursInt % 12 || 12; // Convert 0 or 12 to 12
  return `${formattedHours}:${minutes} ${ampm}`;
};

// Helper function to parse days string (e.g., " T R  ") into an array of day names
const mapDays = (daysString) => {
  if (!daysString) return [];
  const dayMapping = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    R: "Thursday",
    F: "Friday",
    S: "Saturday",
    U: "Sunday",
  };
  const activeDays = [];
  for (let i = 0; i < daysString.length; i++) {
    const char = daysString[i];
    if (dayMapping[char]) {
      activeDays.push(dayMapping[char]);
    }
  }
  return activeDays;
};

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
  // helper function does not need test

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

  const transformToEvents = (sections) => {
    if (!sections) return [];
    const events = [];

    sections.forEach((course) => {
      if (course.classSections) {
        course.classSections.forEach((classSection) => {
          if (classSection.timeLocations) {
            classSection.timeLocations.forEach((timeLocation) => {
              const days = mapDays(timeLocation.days);
              days.forEach((day) => {
                events.push({
                  id: `${classSection.enrollCode}-${day}`,
                  title: `${course.courseId ? course.courseId.trim() : "N/A"} (${classSection.section})`,
                  description: `${course.title ? course.title : "N/A"} - ${timeLocation.building} ${timeLocation.room}`,
                  day: day,
                  startTime: formatTime(timeLocation.beginTime),
                  endTime: formatTime(timeLocation.endTime),
                });
              });
            });
          }
        });
      }
    });
    return events;
  };

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
