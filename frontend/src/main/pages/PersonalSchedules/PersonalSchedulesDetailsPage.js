import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchedulerPanel from "main/components/PersonalSchedules/SchedulerPanel";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";

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
  // For now, using fixture data. Later, this will come from a backend call based on schedule ID.
  const personalScheduleData = personalSectionsFixtures.threePersonalSections;

  const transformedEvents = [];

  personalScheduleData.forEach((course) => {
    if (course.classSections) {
      course.classSections.forEach((classSection) => {
        if (classSection.timeLocations) {
          classSection.timeLocations.forEach((timeLocation) => {
            const days = mapDays(timeLocation.days);
            days.forEach((day) => {
              // Create a unique ID for each event instance
              const dayAbbreviation =
                Object.keys(dayMapping).find(
                  (key) => dayMapping[key] === day,
                ) || day.charAt(0);

              transformedEvents.push({
                id: `${classSection.enrollCode}-${dayAbbreviation}`,
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

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Personal Schedule Details</h1>
        <SchedulerPanel Events={transformedEvents} />
      </div>
    </BasicLayout>
  );
}
