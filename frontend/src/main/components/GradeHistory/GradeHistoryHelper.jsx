// GradeHistoryHelper.js
export const allGrades = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  "P",
  "W",
  "NP",
];

export const qtrNumToQuarter = {
  1: "Winter",
  2: "Spring",
  3: "Summer",
  4: "Fall",
};

export const yyyyqToPrettyStr = (yyyyq) => {
  const [year, qtr] = [yyyyq.slice(0, 4), yyyyq[4]];
  return `${qtrNumToQuarter[qtr]} ${year}`;
};

export const formatTooltip = (value, _, props) => {
  return [`Percentage: ${value.toFixed(1)}%, Count: ${props.payload.count}`];
};

export const createCompleteGradeData = (data) => {
  const gradeCounts = data.reduce((acc, item) => {
    acc[item.grade] = item.count;
    return acc;
  }, {});

  const totalCount = Object.values(gradeCounts).reduce(
    (acc, count) => acc + count,
    0,
  );

  return allGrades.map((grade) => ({
    grade,
    count: gradeCounts[grade] || 0,
    percentage:
      totalCount > 0 ? ((gradeCounts[grade] || 0) / totalCount) * 100 : 0,
  }));
};

export const groupDataByQuarterAndInstructor = (data) => {
  const groupedData = {};

  data.sort((a, b) => {
    const [yearA, qtrA] = [a.yyyyq.slice(0, 4), a.yyyyq[4]];
    const [yearB, qtrB] = [b.yyyyq.slice(0, 4), b.yyyyq[4]];

    if (yearA !== yearB) return yearB - yearA;
    return qtrB - qtrA;
  });

  data.forEach((item) => {
    const key = `${item.yyyyq}-${item.instructor}`;
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(item);
  });

  return groupedData;
};
