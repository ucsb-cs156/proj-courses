import { deduplicateAreaCodes } from "main/components/GEAreas/geAreaSearchFormUtils";

describe("geAreaSearchFormUtils tests", () => {
  test("deduplicateAreaCodes removes duplicate requirement codes", () => {
    const areas = [
      { requirementCode: "A1" },
      { requirementCode: "A1" },
      { requirementCode: "B" },
      { requirementCode: "B" },
    ];

    expect(deduplicateAreaCodes(areas)).toEqual(["A1", "B"]);
  });

  test("deduplicateAreaCodes trims, filters, and de-duplicates codes", () => {
    const areas = [
      { requirementCode: " A1 " },
      { requirementCode: "A1" },
      { requirementCode: "B" },
      { requirementCode: "" },
      { requirementCode: "   " },
      { requirementCode: null },
      {},
      undefined,
    ];

    expect(deduplicateAreaCodes(areas)).toEqual(["A1", "B"]);
  });

  test("deduplicateAreaCodes returns empty array for nullish input", () => {
    expect(deduplicateAreaCodes(undefined)).toEqual([]);
    expect(deduplicateAreaCodes(null)).toEqual([]);
  });
});
