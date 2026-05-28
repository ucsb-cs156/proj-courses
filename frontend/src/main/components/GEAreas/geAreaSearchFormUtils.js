export const deduplicateAreaCodes = (areas) => {
  if (!areas) {
    return [];
  }

  const normalizedAreaCodes = areas
    .map((r) => r?.requirementCode)
    .filter((code) => typeof code === "string" && code.trim() !== "")
    .map((code) => code.trim());

  return Array.from(new Set(normalizedAreaCodes));
};
