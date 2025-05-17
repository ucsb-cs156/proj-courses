import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import PersonalSchedulerPanel from "main/components/PersonalSchedules/PersonalSchedulePanel";
import { useBackend } from "main/utils/useBackend";
import { Button, Row, Col } from "react-bootstrap";
import { useCurrentUser } from "main/utils/currentUser";

// Moved dayMapping to be accessible by transformation logic if needed for abbreviation
const dayMapping = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  R: "Thursday",
  F: "Friday",
  S: "Saturday",
  U: "Sunday", // Assuming U for Sunday
};

// Helper function to convert HH:MM (24-hour) to h:MM AM/PM format
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
  const activeDays = [];
  // Use the module-level dayMapping
  for (let i = 0; i < daysString.length; i++) {
    const char = daysString[i];
    if (dayMapping[char]) {
      activeDays.push(dayMapping[char]);
    }
  }
  return activeDays;
};

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

  const backButton = () => {
    return (
      <Button variant="primary" href="/personalschedules/list">
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
            <>
              <PersonalSectionsTable
                personalSections={personalSection}
                psId={id}
                currentUser={currentUser}
              />
              <div className="mt-4">
                <h3>Weekly Schedule View</h3>
                <PersonalSchedulerPanel
                  Events={transformToEvents(personalSection)}
                />
              </div>
            </>
          )}
        </div>
        {backButton()}
      </div>
    </BasicLayout>
  );
}
