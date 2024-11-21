import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import { updateFixtures } from "fixtures/updateFixtures";
import AdminUpdatesPage from "main/pages/Admin/AdminUpdatesPage";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("AdminUpdatesPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "UpdatesTable";

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test("renders without crashing for admin user", () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/updates/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUpdatesPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  //   test("renders three earthquakes without crashing for regular user", async () => {
  //     setupAdminUser();
  //     const queryClient = new QueryClient();
  //     axiosMock
  //       .onGet("/api/updates/all")
  //       .reply(200, updateFixtures.threeUpdates);

  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <MemoryRouter>
  //           <AdminUpdatesPage />
  //         </MemoryRouter>
  //       </QueryClientProvider>,
  //     );

  //     expect(
  //       await screen.findByTestId(`${testId}-cell-row-0-col-subjectArea`),
  //     ).toHaveTextContent("EARTH");
  //     expect(
  //       screen.getByTestId(`${testId}-cell-row-1-col-subjectArea`),
  //     ).toHaveTextContent("CMPSC");
  //     expect(
  //       screen.getByTestId(`${testId}-cell-row-2-col-subjectArea`),
  //     ).toHaveTextContent("PSTAT");
  //   });

  //   test("what happens when you click load, admin - originally nothing in table, load 3 subjects", async () => {
  //     setupAdminUser();
  //     const queryClient = new QueryClient();
  //     axiosMock.onGet("/api/UCSBSubjects/all").reply(200, []);
  //     axiosMock
  //       .onPost("/api/updates/load")
  //       .reply(200, updateFixtures.threeUpdates);

  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <MemoryRouter>
  //           <AdminUpdatesPage />
  //         </MemoryRouter>
  //       </QueryClientProvider>,
  //     );

  //     expect(
  //       await screen.findByTestId(`AdminUpdates-Load-Button`),
  //     ).toBeInTheDocument();

  //     const loadButton = screen.getByTestId(`AdminUpdates-Load-Button`);
  //     expect(loadButton).toBeInTheDocument();
  //     fireEvent.click(loadButton);

  //     await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
  //     expect(mockToast).toHaveBeenCalledWith("Number of Subjects Loaded : 3");
  //   });

  //   test("what happens when you click load, admin - originally 3 subjects, load nothing", async () => {
  //     setupAdminUser();
  //     const queryClient = new QueryClient();
  //     axiosMock
  //       .onGet("/api/updates/all")
  //       .reply(200, updateFixtures.threeUpdates);
  //     axiosMock.onPost("/api/updates/load").reply(200, []);

  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <MemoryRouter>
  //           <AdminUpdatesPage />
  //         </MemoryRouter>
  //       </QueryClientProvider>,
  //     );

  //     expect(
  //       await screen.findByTestId(`AdminUpdates-Load-Button`),
  //     ).toBeInTheDocument();

  //     const loadButton = screen.getByTestId(`AdminUpdates-Load-Button`);
  //     expect(loadButton).toBeInTheDocument();
  //     fireEvent.click(loadButton);
  //   });
});
