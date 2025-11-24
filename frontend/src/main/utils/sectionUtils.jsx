import { hhmmTohhmma, convertToTimeRange } from "main/utils/timeUtils.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export const convertToFraction = (en1, en2) => {
  return en1 != null && en2 != null ? `${en1}/${en2}` : "";
};

// Takes a time location array and returns the locations
export const formatLocation = (timeLocationArray) => {
  try {
    let res = "";
    for (let index = 0; index < timeLocationArray.length; index++) {
      res += `${timeLocationArray[index].building} ${timeLocationArray[index].room}`;
      if (index + 1 < timeLocationArray.length) {
        res += `, `;
      }
    }
    return res;
  } catch {
    return "";
  }
};

// Takes a time location array and returns the days
export const formatDays = (timeLocationArray) => {
  try {
    let res = "";
    for (let index = 0; index < timeLocationArray.length; index++) {
      res +=
        timeLocationArray[index].days !== null
          ? `${timeLocationArray[index].days}`
          : "";
      if (
        index + 1 < timeLocationArray.length &&
        timeLocationArray[index].days !== null
      ) {
        res += `, `;
      }
    }
    return res;
  } catch {
    return "";
  }
};

// Takes a time location array and returns the time range
export const formatTime = (timeLocationArray) => {
  try {
    let res = "";
    for (let index = 0; index < timeLocationArray.length; index++) {
      res += convertToTimeRange(
        hhmmTohhmma(timeLocationArray[index].beginTime),
        hhmmTohhmma(timeLocationArray[index].endTime),
      );
      if (index + 1 < timeLocationArray.length) {
        res += `, `;
      }
    }
    return res;
  } catch {
    return "";
  }
};

// Takes a instructors array and returns the instructors
export const formatInstructors = (instructorArray) => {
  try {
    let res = "";
    for (let index = 0; index < instructorArray.length; index++) {
      res += `${instructorArray[index].instructor}`;
      if (index + 1 < instructorArray.length) {
        res += `, `;
      }
    }
    return res;
  } catch {
    return "";
  }
};

export const isSection = (en1) => {
  return en1.substring(2) !== "00";
};

// returns the course status based on cancel, closed, or full
export const formatStatus = (section) => {
  if (section.courseCancelled) {
    return "Cancelled";
  } else if (section.classClosed === "Y") {
    return "Closed";
  } else if (section.enrolledTotal >= section.maxEnroll) {
    return "Full";
  } else {
    return "Open";
  }
};

export const getQuarter = (row) =>
  row.depth === 0 ? row.original.quarter : row.getParentRow().original.quarter;

export const formatInfoLink = (row) =>
  `/coursedetails/${getQuarter(row)}/${getSectionField(row, "enrollCode")}`;

export const renderInfoLink = (row, testid) => (
  <p style={{ textAlign: "center" }}>
    <a
      href={formatInfoLink(row)}
      data-testid={`${testid}-row-${row.id}-col-info-link`}
      target={"_blank"}
      rel="noopener noreferrer"
      style={{ color: "black", backgroundColor: "inherit" }}
    >
      <FontAwesomeIcon icon={faInfoCircle} />
    </a>
  </p>
);

export const renderCourseIdLink = (row, testid) => {
  const courseId =
    row.depth === 0
      ? row.original.courseId
      : row.getParentRow().original.courseId;

  return (
    <a
      href={formatInfoLink(row)}
      data-testid={`${testid}-row-${row.id}-col-courseId-link`}
      target={"_blank"}
      rel="noopener noreferrer"
    >
      {courseId?.replace(/\s+/g, " ").trim()}
    </a>
  );
};

export function enrollmentFraction(row) {
  const num = getSectionField(row, "enrolledTotal");
  const denom = getSectionField(row, "maxEnroll");
  const result = convertToFraction(num, denom);
  return result;
}

export const isPrimary = (row) => "primary" in row.original;

export const isLectureWithNoSections = (row) =>
  isPrimary(row) && row.original.subRows.length === 0;

export const shouldShowAddToScheduleLink = (row) =>
  !isPrimary(row) || row.original.subRows.length === 0;

export function getSection(row) {
  return "primary" in row.original ? row.original.primary : row.original;
}

export function getSectionField(row, key) {
  return getSection(row)[key];
}
