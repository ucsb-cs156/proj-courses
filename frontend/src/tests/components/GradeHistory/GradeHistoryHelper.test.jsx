import { fullCourse } from "fixtures/gradeHistoryFixtures";
import {
  formatTooltip,
  createCompleteGradeData,
  groupDataByQuarterAndInstructor,
} from "main/components/GradeHistory/GradeHistoryHelper";

describe("formatTooltip", () => {
  it("tooltip displays correct formatted text", async () => {
    const value = 50.123456;
    const props = { payload: { count: 10 } };
    const result = formatTooltip(value, null, props);
    expect(result).toEqual(["Percentage: 50.1%, Count: 10"]);
  });
});

describe("createCompleteGradeData", () => {
  it("calculates grade percentages correctly", () => {
    const data = [
      { grade: "A", count: 1 },
      { grade: "B", count: 2 },
      { grade: "C", count: 3 },
    ];

    const result = createCompleteGradeData(data);

    expect(result).toEqual([
      { grade: "A+", count: 0, percentage: 0 },
      { grade: "A", count: 1, percentage: 16.666666666666664 },
      { grade: "A-", count: 0, percentage: 0 },
      { grade: "B+", count: 0, percentage: 0 },
      { grade: "B", count: 2, percentage: 33.33333333333333 },
      { grade: "B-", count: 0, percentage: 0 },
      { grade: "C+", count: 0, percentage: 0 },
      { grade: "C", count: 3, percentage: 50 },
      { grade: "C-", count: 0, percentage: 0 },
      { grade: "D+", count: 0, percentage: 0 },
      { grade: "D", count: 0, percentage: 0 },
      { grade: "D-", count: 0, percentage: 0 },
      { grade: "F", count: 0, percentage: 0 },
      { grade: "P", count: 0, percentage: 0 },
      { grade: "W", count: 0, percentage: 0 },
      { grade: "NP", count: 0, percentage: 0 },
    ]);
  });

  it("returns zero percentage when total count is zero", () => {
    const data = [
      { grade: "A", count: 0 },
      { grade: "B", count: 0 },
      { grade: "C", count: 0 },
    ];

    const result = createCompleteGradeData(data);

    expect(result).toEqual([
      { grade: "A+", count: 0, percentage: 0 },
      { grade: "A", count: 0, percentage: 0 },
      { grade: "A-", count: 0, percentage: 0 },
      { grade: "B+", count: 0, percentage: 0 },
      { grade: "B", count: 0, percentage: 0 },
      { grade: "B-", count: 0, percentage: 0 },
      { grade: "C+", count: 0, percentage: 0 },
      { grade: "C", count: 0, percentage: 0 },
      { grade: "C-", count: 0, percentage: 0 },
      { grade: "D+", count: 0, percentage: 0 },
      { grade: "D", count: 0, percentage: 0 },
      { grade: "D-", count: 0, percentage: 0 },
      { grade: "F", count: 0, percentage: 0 },
      { grade: "P", count: 0, percentage: 0 },
      { grade: "W", count: 0, percentage: 0 },
      { grade: "NP", count: 0, percentage: 0 },
    ]);
  });
});

describe("groupDataByQuarterAndInstructor", () => {
  it("groups data by quarter and instructor correctly", () => {
    const result = groupDataByQuarterAndInstructor(fullCourse);

    // Check that the keys of the grouped data are correct
    const keys = Object.keys(result);
    expect(keys).toEqual([
      "20222-LOKSHTANOV D",
      "20221-SINGH A K",
      "20214-AGRAWAL D",
      "20212-EL ABBADI A",
      "20211-LOKSHTANOV D",
      "20204-AGRAWAL D",
      "20202-AGRAWAL D",
      "20201-KOC C K",
      "20194-SINGH A K",
      "20193-COAKLEY C J",
      "20192-SINGH A K",
      "20191-SURI S",
      "20184-EL ABBADI A",
      "20182-SINGH A K",
      "20181-AGRAWAL D",
      "20174-COAKLEY C J",
      "20172-SURI S",
      "20171-COAKLEY C J",
      "20164-AGRAWAL D",
      "20162-SURI S",
      "20161-EL ABBADI A",
      "20154-AGRAWAL D",
      "20153-GONZALEZ T F",
      "20152-GONZALEZ T F",
      "20151-SURI S",
      "20144-SURI S",
      "20143-GONZALEZ T F",
      "20142-KOC C K",
      "20141-EL ABBADI A",
      "20134-SINGH A K",
      "20133-GONZALEZ T F",
      "20132-KOC C K",
      "20131-EL ABBADI A",
      "20124-KOC C K",
      "20123-GONZALEZ T F",
      "20121-SINGH A K",
      "20114-GONZALEZ T F",
      "20113-GONZALEZ T F",
      "20111-SURI S",
      "20104-GONZALEZ T F",
      "20103-GONZALEZ T F",
      "20094-GONZALEZ T F",
    ]);

    // Check that the data for each key is correct
    keys.forEach((key) => {
      const data = result[key];
      const [yyyyq, instructor] = key.split("-");

      // Check that all items in the data have the correct yyyyq and instructor
      data.forEach((item) => {
        expect(item.yyyyq).toBe(yyyyq);
        expect(item.instructor).toBe(instructor);
      });
    });
  });
});
