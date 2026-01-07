import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseDescriptionIndexPage from "main/pages/CourseDescriptions/CourseDescriptionIndexPage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/Admin/AdminUsersPage";
import AdminUpdatesPage from "main/pages/Admin/AdminUpdatesPage";
import AdminLoadSubjectsPage from "main/pages/Admin/AdminLoadSubjectsPage";
import AdminJobsPage from "main/pages/Admin/AdminJobsPage";
import AdminJobLogPage from "main/pages/Admin/AdminJobLogPage";
import DeveloperPage from "main/pages/DeveloperPage"; // route from /developer to DeveloperPage

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

import PersonalSchedulesIndexPage from "main/pages/PersonalSchedules/PersonalSchedulesIndexPage";
import PersonalSchedulesCreatePage from "main/pages/PersonalSchedules/PersonalSchedulesCreatePage";
import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";
import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
import SectionSearchesIndexPageLoggedIn from "main/pages/SectionSearches/SectionSearchesIndexPageLoggedIn";
import SectionSearchesIndexPageNotLoggedIn from "main/pages/SectionSearches/SectionSearchesIndexPageNotLoggedIn";

import CourseOverTimeIndexPage from "main/pages/CourseOverTime/CourseOverTimeIndexPage";
import CourseOverTimeInstructorIndexPage from "main/pages/CourseOverTime/CourseOverTimeInstructorIndexPage";
import CourseOverTimeBuildingsIndexPage from "main/pages/CourseOverTime/CourseOverTimeBuildingsIndexPage";

import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";
import CourseDetailsIndexPage from "main/pages/CourseDetails/CourseDetailsIndexPage";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        {hasRole(currentUser, "ROLE_USER") && (
          <Route
            exact
            path="/"
            element={<SectionSearchesIndexPageLoggedIn />}
          />
        )}
        {!hasRole(currentUser, "ROLE_USER") && (
          <Route
            exact
            path="/"
            element={<SectionSearchesIndexPageNotLoggedIn />}
          />
        )}

        <Route exact path="/profile" element={<ProfilePage />} />
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route exact path="/admin/users" element={<AdminUsersPage />} />
            <Route exact path="/admin/updates" element={<AdminUpdatesPage />} />
            <Route
              exact
              path="/admin/loadsubjects"
              element={<AdminLoadSubjectsPage />}
            />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/jobs/logs/:id" element={<AdminJobLogPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/personalschedules/list"
              element={<PersonalSchedulesIndexPage />}
            />
            <Route
              exact
              path="/personalschedules/create"
              element={<PersonalSchedulesCreatePage />}
            />
            <Route
              exact
              path="/personalschedules/edit/:id"
              element={<PersonalSchedulesEditPage />}
            />
            <Route
              exact
              path="/personalschedules/details/:id"
              element={<PersonalSchedulesDetailsPage />}
            />
          </>
        )}
        <Route
          exact
          path="/coursedescriptions/search"
          element={<CourseDescriptionIndexPage />}
        />
        <Route
          exact
          path="/courseovertime/search"
          element={<CourseOverTimeIndexPage />}
        />
        <Route
          exact
          path="/courseovertime/buildingsearch/classrooms"
          element={<CourseOverTimeBuildingsIndexPage />}
        />
        <Route
          exact
          path="/courseovertime/instructorsearch"
          element={<CourseOverTimeInstructorIndexPage />}
        />
        <Route
          exact
          path="/coursedetails/:qtr/:enrollCode"
          element={<CourseDetailsIndexPage />}
        />
        <Route
          exact
          path="/generaleducation/search"
          element={<GeneralEducationSearchPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
