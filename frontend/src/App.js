import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";
import AdminPersonalSchedulesPage from "main/pages/AdminPersonalSchedulePage";
import AdminJobsPage from "main/pages/AdminJobsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

import PersonalSchedulesIndexPage from "main/pages/PersonalSchedules/PersonalSchedulesIndexPage";
import PersonalSchedulesCreatePage from "main/pages/PersonalSchedules/PersonalSchedulesCreatePage";
import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";

import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
import SectionSearchesIndexPage from "main/pages/SectionSearches/SectionSearchesIndexPage";

import CoursesIndexPage from "main/pages/Courses/PSCourseIndexPage";
import CoursesCreatePage from "main/pages/Courses/PSCourseCreatePage";

function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/admin/users" element={<AdminUsersPage />} />
              <Route exact path="/admin/loadsubjects" element={<AdminLoadSubjectsPage />} />
              <Route exact path="/admin/personalschedule" element={<AdminPersonalSchedulesPage />} />
              <Route path="/admin/jobs" element={<AdminJobsPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/personalschedules/list" element={<PersonalSchedulesIndexPage />} />
              <Route exact path="/personalschedules/create" element={<PersonalSchedulesCreatePage />} />
              <Route exact path="/personalschedules/edit/:id" element={<PersonalSchedulesEditPage />} />

              <Route exact path="/courses/list" element={<CoursesIndexPage />} />
              <Route exact path="/courses/create" element={<CoursesCreatePage />} />
              <Route exact path="/personalschedules/details/:id" element={<PersonalSchedulesDetailsPage />} />
            </>
          )
        }
        <Route exact path="/sectionsearches/search" element={<SectionSearchesIndexPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
