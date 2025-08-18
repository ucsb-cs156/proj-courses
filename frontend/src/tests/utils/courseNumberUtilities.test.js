import {
  getCourseNumber,
  getSuffix,
} from "../../main/utils/courseNumberUtilities";

describe("courseNumberUtilities tests", () => {
  test("getCourseNumber extracts course number from 'CMPSC 130A'", () => {
    expect(getCourseNumber("130A")).toBe("130");
  });

  test("getCourseNumber extracts course number from 'CMPSC 190DD'", () => {
    expect(getCourseNumber("190DD")).toBe("190");
  });

  test("getCourseNumber extracts course number from '16B'", () => {
    expect(getCourseNumber("16B")).toBe("16");
  });

  test("getCourseNumber returns empty string for invalid input", () => {
    expect(getCourseNumber("")).toBe("");
    expect(getCourseNumber("CMPSC")).toBe("");
    expect(getCourseNumber("130 X")).toBe("");
    expect(getCourseNumber("CMPSC 130 X")).toBe("");
    expect(getCourseNumber(" 130A ")).toBe("");
    expect(getCourseNumber(" 130A 130A ")).toBe("");
    expect(getCourseNumber(" 130abc ")).toBe("");
    expect(getCourseNumber("++++ 130A")).toBe("");
  });

  test("getSuffix extracts suffix from '130A'", () => {
    expect(getSuffix("130A")).toBe("A");
  });

  test("getSuffix extracts suffix from '16B'", () => {
    expect(getSuffix("16B")).toBe("B");
  });

  test("getSuffix extracts suffix from '1ab'", () => {
    expect(getSuffix("1ab")).toBe("AB");
  });

  test("getSuffix extracts suffix  from '190DD'", () => {
    expect(getSuffix("190DD")).toBe("DD");
  });

  test("getSuffix returns empty string for invalid input", () => {
    expect(getSuffix("130 X")).toBe("");
    expect(getSuffix("")).toBe("");
    expect(getSuffix("CMPSC")).toBe("");
    expect(getSuffix("CMPSC 130A X")).toBe("");
    expect(getSuffix(" 130A ")).toBe("");
    expect(getSuffix(" 130A 130A ")).toBe("");
    expect(getSuffix(" 130abc ")).toBe("");
    expect(getSuffix("130++")).toBe("");
    expect(getSuffix("++++ 130A")).toBe("");
  });
});
