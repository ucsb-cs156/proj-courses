import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost"

export default function AppNavbar({ currentUser, systemInfo, doLogout, currentUrl = window.location.href }) {
  return (
    <>
      {
        (currentUrl.startsWith("http://localhost:3000") ||
          currentUrl.startsWith("http://127.0.0.1:3000")) && (
          <AppNavbarLocalhost url={currentUrl} />
        )
      }
      <Navbar expand="xl" variant="dark" bg="dark" sticky="top" data-testid="AppNavbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Example
          </Navbar.Brand>

          <Navbar.Toggle />
        




          <>
            {/* be sure that each NavDropdown has a unique id and data-testid  */}
          </>

          <Navbar.Collapse className="justify-content-between">

          <Nav className="me-auto">
            {
              systemInfo?.springH2ConsoleEnabled && (
                <>
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                </>
              )
            }
            {
              systemInfo?.showSwaggerUILink && (
                <>
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                </>
              )
            }
          </Nav>

            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="Courses" id="appnavbar-courses-dropdown" data-testid="appnavbar-courses-dropdown" >
                    <NavDropdown.Item href="/courses/list" data-testid="appnavbar-courses-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/courses/create" data-testid="appnavbar-courses-create">Create</NavDropdown.Item>
                  </NavDropdown>
                )
              }
            </Nav>

        
            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_USER") && (
                  <NavDropdown title="PersonalSchedules" id="appnavbar-personalschedules-dropdown" data-testid="appnavbar-personalschedules-dropdown" >
                    <NavDropdown.Item href="/personalschedules/list" data-testid="appnavbar-personalschedules-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/personalschedules/create" data-testid="appnavbar-personalschedules-create">Create</NavDropdown.Item>
                  </NavDropdown>
                )
              }
            </Nav>

            <Nav className="mr-auto">
              <NavDropdown title="Section Searches" id="appnavbar-section-searches-dropdown" data-testid="appnavbar-section-searches-dropdown" >
                <NavDropdown.Item href="/sectionsearches/search" data-testid="appnavbar-section-searches-search">Search</NavDropdown.Item>
              </NavDropdown>
            </Nav>



            
            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_ADMIN") && (
                  <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown" >

                    <NavDropdown.Item href="/admin/users" data-testid="appnavbar-admin-users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/personalschedule" data-testid="appnavbar-admin-personalschedule">Personal Schedules</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/loadsubjects" data-testid="appnavbar-admin-loadsubjects">Load Subjects</NavDropdown.Item>

                  </NavDropdown>
                )
              }
            </Nav>
            

            <Nav className="ml-auto">
              {
                currentUser && currentUser.loggedIn ? (
                  <>
                    <Navbar.Text className="me-3" as={Link} to="/profile">Welcome, {currentUser.root.user.email}</Navbar.Text>
                    <Button onClick={doLogout}>Log Out</Button>
                  </>
                ) : (
                  <Button href="/oauth2/authorization/google">Log In</Button>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container >
      </Navbar >
    </>
  );
}
