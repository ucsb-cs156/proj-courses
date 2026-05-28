import {
  deduplicateAreaCodes,
  getResolvedArea,
} from "main/components/GEAreas/geAreaSearchFormUtils";

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

  test("getResolvedArea keeps existing non-empty area", () => {
    expect(getResolvedArea("B", ["A1", "B"])).toBe("B");
  });

  test("getResolvedArea falls back to first area code when current is empty", () => {
    expect(getResolvedArea("", ["A1", "B"])).toBe("A1");
  });

  test("getResolvedArea returns empty string when no area is resolvable", () => {
    expect(getResolvedArea("", [])).toBe("");
    expect(getResolvedArea("", undefined)).toBe("");
  });
});
