import { QueryClient, QueryClientProvider } from "react-query";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import {
  fetchHealth,
  healthMessages,
  useHealthCheck,
  HEALTH_CHECK_QUERY_KEY,
} from "main/utils/healthCheck";
import { healthFixtures } from "fixtures/healthFixtures";

const mongoMessage = {
  variant: "danger",
  message:
    "The course database (MongoDB) is currently unavailable, so some searches may not work. Please try again later.",
};
const sqlMessage = {
  variant: "danger",
  message:
    "The user database (SQL) is currently unavailable, so logging in and personal schedules may not work. Please try again later.",
};

describe("utils/healthCheck tests", () => {
  let axiosMock;
  beforeEach(() => {
    axiosMock = new AxiosMockAdapter(axios);
  });
  afterEach(() => {
    axiosMock.restore();
  });

  describe("fetchHealth tests", () => {
    test("returns the body of a 200 response", async () => {
      axiosMock.onGet("/api/actuator/health").reply(200, healthFixtures.allUp);
      expect(await fetchHealth()).toEqual(healthFixtures.allUp);
    });

    test("returns the body of a 503 response", async () => {
      axiosMock
        .onGet("/api/actuator/health")
        .reply(503, healthFixtures.mongoDown);
      expect(await fetchHealth()).toEqual(healthFixtures.mongoDown);
    });

    test("returns null on a network error", async () => {
      axiosMock.onGet("/api/actuator/health").networkError();
      expect(await fetchHealth()).toBeNull();
    });

    test("returns null on a timeout", async () => {
      axiosMock.onGet("/api/actuator/health").timeout();
      expect(await fetchHealth()).toBeNull();
    });
  });

  describe("healthMessages tests", () => {
    test("no messages when everything is up", () => {
      expect(healthMessages(healthFixtures.allUp)).toEqual([]);
    });

    test("no messages when there is no health information", () => {
      expect(healthMessages(null)).toEqual([]);
      expect(healthMessages(undefined)).toEqual([]);
      expect(healthMessages({})).toEqual([]);
      expect(healthMessages({ components: {} })).toEqual([]);
      expect(healthMessages("<html>not json</html>")).toEqual([]);
    });

    test("no messages for an error body that has no components, e.g. a 404", () => {
      expect(healthMessages({ status: 404, error: "Not Found" })).toEqual([]);
    });

    test("no messages for a status other than DOWN", () => {
      expect(
        healthMessages({
          components: {
            db: { status: "UNKNOWN" },
            mongo: { status: "OUT_OF_SERVICE" },
          },
        }),
      ).toEqual([]);
    });

    test("message when mongo is down", () => {
      expect(healthMessages(healthFixtures.mongoDown)).toEqual([mongoMessage]);
    });

    test("message when sql is down", () => {
      expect(healthMessages(healthFixtures.sqlDown)).toEqual([sqlMessage]);
    });

    test("both messages when both are down", () => {
      expect(healthMessages(healthFixtures.bothDown)).toEqual([
        mongoMessage,
        sqlMessage,
      ]);
    });
  });

  describe("useHealthCheck tests", () => {
    let queryClient;
    beforeEach(() => {
      queryClient = new QueryClient();
    });
    afterEach(() => {
      // also stops the polling timer, even when an assertion above has failed
      queryClient.clear();
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    test("retrieves health from the backend under the expected query key", async () => {
      axiosMock
        .onGet("/api/actuator/health")
        .reply(503, healthFixtures.mongoDown);

      const { result, unmount } = renderHook(() => useHealthCheck(), {
        wrapper,
      });

      await waitFor(() =>
        expect(result.current.data).toEqual(healthFixtures.mongoDown),
      );
      expect(HEALTH_CHECK_QUERY_KEY).toBe("healthCheck");
      expect(queryClient.getQueryData("healthCheck")).toEqual(
        healthFixtures.mongoDown,
      );
      unmount();
    });

    test("polls once a minute, so that an outage or a recovery shows up without a page reload", async () => {
      axiosMock.onGet("/api/actuator/health").reply(200, healthFixtures.allUp);

      const { result, unmount } = renderHook(() => useHealthCheck(), {
        wrapper,
      });
      await waitFor(() =>
        expect(result.current.data).toEqual(healthFixtures.allUp),
      );

      const query = queryClient.getQueryCache().find("healthCheck");
      expect(query.observers[0].options.refetchInterval).toBe(60000);
      unmount();
    });
  });
});
