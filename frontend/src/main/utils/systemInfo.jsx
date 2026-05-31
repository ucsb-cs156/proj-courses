import { useQuery } from "react-query";
import axios from "axios";

const TWENTY_FOUR_HOURS_MS = 1000 * 60 * 60 * 24;

export function useSystemInfo() {
  return useQuery(
    "systemInfo",
    async () => {
      try {
        const response = await axios.get("/api/systemInfo");
        return response.data;
      } catch (e) {
        console.error("Error invoking axios.get: ", e);
        return {};
      }
    },
    {
      placeholderData: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20221",
        endQtrYYYYQ: "20222",
      },
      staleTime: TWENTY_FOUR_HOURS_MS,
      cacheTime: TWENTY_FOUR_HOURS_MS,
    },
  );
}
