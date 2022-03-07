import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

import PersonalSchedulesIndexPage from "main/pages/PersonalSchedules/PersonalSchedulesIndexPage";
import PersonalSchedulesCreatePage from "main/pages/PersonalSchedules/PersonalSchedulesCreatePage";


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
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/personalschedules/list" element={<PersonalSchedulesIndexPage />} />
              <Route exact path="/personalschedules/create" element={<PersonalSchedulesCreatePage />} />
            </>
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
