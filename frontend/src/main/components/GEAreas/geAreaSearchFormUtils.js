export const deduplicateAreaCodes = (areas) => {
  const normalizedAreaCodes = (areas ?? [])
    .map((r) => r?.requirementCode)
    .filter((code) => typeof code === "string" && code.trim() !== "")
    .map((code) => code.trim());

  return Array.from(new Set(normalizedAreaCodes));
};

export const getResolvedArea = (currentArea, areaCodes) => {
  if (currentArea) {
    return currentArea;
  }

  const firstAreaCode = areaCodes?.[0];
  return firstAreaCode || "";
};
