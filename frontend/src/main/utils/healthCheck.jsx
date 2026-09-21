import { useQuery } from "react-query";
import axios from "axios";

export const HEALTH_CHECK_QUERY_KEY = "healthCheck";

const ONE_MINUTE_MS = 1000 * 60;

// The backend's /api/actuator/health endpoint (Spring Boot Actuator) answers 200 when
// everything is up, and 503 when any component (e.g. a database) is down. The body has
// the same shape in both cases, e.g.
//   { status: "DOWN", components: { db: { status: "UP" }, mongo: { status: "DOWN" } } }
// axios treats the 503 as an error, so the body has to be pulled out of the error.
//
// Anything else (network error, backend not running, no mock in a test or story) yields
// null: we only ever want to alarm the user when the backend positively reports a problem.
export async function fetchHealth() {
  try {
    const response = await axios.get("/api/actuator/health");
    return response.data;
  } catch (e) {
    return e.response?.data ?? null;
  }
}

// Converts a health response into system messages, in the same { variant, message } shape
// as systemInfo.systemMessages, so that they can be shown by the same banner in AppNavbar.
export function healthMessages(health) {
  const messages = [];
  if (health?.components?.mongo?.status === "DOWN") {
    messages.push({
      variant: "danger",
      message:
        "The course database (MongoDB) is currently unavailable, so some searches may not work. Please try again later.",
    });
  }
  if (health?.components?.db?.status === "DOWN") {
    messages.push({
      variant: "danger",
      message:
        "The user database (SQL) is currently unavailable, so logging in and personal schedules may not work. Please try again later.",
    });
  }
  return messages;
}

// Unlike systemInfo, this is deliberately polled and never treated as fresh: a day-old
// cached answer to "is the database up right now?" is worse than no answer. For the same
// reason, main.jsx excludes this query from the cache persisted to localStorage.
export function useHealthCheck() {
  return useQuery(HEALTH_CHECK_QUERY_KEY, fetchHealth, {
    refetchInterval: ONE_MINUTE_MS,
  });
}
