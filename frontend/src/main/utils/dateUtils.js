import { hhmmTohhmma } from "./timeUtils";

// Constants
export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const hours = [
  // Stryker disable all : no test needed
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
  // Stryker restore all
];

// Helper functions
/**
 * Transforms course sections data into an array of event objects for the scheduler
 * @param {Array} sections - Array of course section objects
 * @returns {Array} - Array of formatted event objects for display in the scheduler
 */
export const transformToEvents = (sections) => {
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
                startTime: hhmmTohhmma(timeLocation.beginTime),
                endTime: hhmmTohhmma(timeLocation.endTime),
              });
            });
          });
        }
      });
    }
  });
  return events;
};

/**
 * Helper function to parse days string (e.g., " T R  ") into an array of day names
 * @param {string} daysString - A string representing days (e.g., "M W F")
 * @returns {Array} - Array of full day names (e.g., ["Monday", "Wednesday", "Friday"])
 */
export const mapDays = (daysString) => {
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
