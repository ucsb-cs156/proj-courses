// @ts-nocheck
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost";
import headerImg from "../../../assets/header-logo-240.png";
export default function AppNavbar({
  currentUser,
  systemInfo,
  doLogout,
  currentUrl = window.location.href
}) {
  if (stryMutAct_9fa48("118")) {
    {}
  } else {
    stryCov_9fa48("118");
    return <>
      {stryMutAct_9fa48("121") ? currentUrl.startsWith("http://localhost:3000") || currentUrl.startsWith("http://127.0.0.1:3000") || <AppNavbarLocalhost url={currentUrl} /> : stryMutAct_9fa48("120") ? false : stryMutAct_9fa48("119") ? true : (stryCov_9fa48("119", "120", "121"), (stryMutAct_9fa48("123") ? currentUrl.startsWith("http://localhost:3000") && currentUrl.startsWith("http://127.0.0.1:3000") : stryMutAct_9fa48("122") ? true : (stryCov_9fa48("122", "123"), currentUrl.startsWith(stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), "http://localhost:3000")) || currentUrl.startsWith(stryMutAct_9fa48("125") ? "" : (stryCov_9fa48("125"), "http://127.0.0.1:3000")))) && <AppNavbarLocalhost url={currentUrl} />)}
      <Navbar expand="xl" variant="dark" bg="dark" sticky="top" data-testid="AppNavbar">
        <Container>
        <img data-testid="AppNavbarImage" src={headerImg} alt="" style={stryMutAct_9fa48("126") ? {} : (stryCov_9fa48("126"), {
            width: 80,
            height: 80,
            marginRight: 10
          })} />
          <Navbar.Brand as={Link} to="/">
            UCSB Courses Search
          </Navbar.Brand>

          <Navbar.Toggle />
        




          <>
            {
              /* be sure that each NavDropdown has a unique id and data-testid  */
            }
          </>

          <Navbar.Collapse className="justify-content-between">

          <Nav className="me-auto">
            {stryMutAct_9fa48("129") ? systemInfo?.springH2ConsoleEnabled || <>
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                </> : stryMutAct_9fa48("128") ? false : stryMutAct_9fa48("127") ? true : (stryCov_9fa48("127", "128", "129"), (stryMutAct_9fa48("130") ? systemInfo.springH2ConsoleEnabled : (stryCov_9fa48("130"), systemInfo?.springH2ConsoleEnabled)) && <>
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                </>)}
            {stryMutAct_9fa48("133") ? systemInfo?.showSwaggerUILink || <>
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                </> : stryMutAct_9fa48("132") ? false : stryMutAct_9fa48("131") ? true : (stryCov_9fa48("131", "132", "133"), (stryMutAct_9fa48("134") ? systemInfo.showSwaggerUILink : (stryCov_9fa48("134"), systemInfo?.showSwaggerUILink)) && <>
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                </>)}
          </Nav>

            <Nav className="mr-auto">
              {stryMutAct_9fa48("137") ? hasRole(currentUser, "ROLE_USER") || <NavDropdown title="PSCourse" id="appnavbar-courses-dropdown" data-testid="appnavbar-courses-dropdown">
                    <NavDropdown.Item href="/courses/list" data-testid="appnavbar-courses-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/courses/create" data-testid="appnavbar-courses-create">Create</NavDropdown.Item>
                  </NavDropdown> : stryMutAct_9fa48("136") ? false : stryMutAct_9fa48("135") ? true : (stryCov_9fa48("135", "136", "137"), hasRole(currentUser, stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), "ROLE_USER")) && <NavDropdown title="PSCourse" id="appnavbar-courses-dropdown" data-testid="appnavbar-courses-dropdown">
                    <NavDropdown.Item href="/courses/list" data-testid="appnavbar-courses-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/courses/create" data-testid="appnavbar-courses-create">Create</NavDropdown.Item>
                  </NavDropdown>)}
            </Nav>

        
            <Nav className="mr-auto">
              {stryMutAct_9fa48("141") ? hasRole(currentUser, "ROLE_USER") || <NavDropdown title="PersonalSchedules" id="appnavbar-personalschedules-dropdown" data-testid="appnavbar-personalschedules-dropdown">
                    <NavDropdown.Item href="/personalschedules/list" data-testid="appnavbar-personalschedules-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/personalschedules/create" data-testid="appnavbar-personalschedules-create">Create</NavDropdown.Item>
                  </NavDropdown> : stryMutAct_9fa48("140") ? false : stryMutAct_9fa48("139") ? true : (stryCov_9fa48("139", "140", "141"), hasRole(currentUser, stryMutAct_9fa48("142") ? "" : (stryCov_9fa48("142"), "ROLE_USER")) && <NavDropdown title="PersonalSchedules" id="appnavbar-personalschedules-dropdown" data-testid="appnavbar-personalschedules-dropdown">
                    <NavDropdown.Item href="/personalschedules/list" data-testid="appnavbar-personalschedules-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/personalschedules/create" data-testid="appnavbar-personalschedules-create">Create</NavDropdown.Item>
                  </NavDropdown>)}
            </Nav>

            <Nav className="mr-auto">
              <NavDropdown title="Course Descriptions" id="appnavbar-course-descriptions-dropdown" data-testid="appnavbar-course-descriptions-dropdown">
                <NavDropdown.Item href="/coursedescriptions/search" data-testid="appnavbar-course-descriptions-search">Search</NavDropdown.Item>
              </NavDropdown>
            </Nav>



            
            <Nav className="mr-auto">
              {stryMutAct_9fa48("145") ? hasRole(currentUser, "ROLE_ADMIN") || <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown">

                    <NavDropdown.Item href="/admin/users" data-testid="appnavbar-admin-users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/personalschedule" data-testid="appnavbar-admin-personalschedule">Personal Schedules</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/loadsubjects" data-testid="appnavbar-admin-loadsubjects">Load Subjects</NavDropdown.Item>

                  </NavDropdown> : stryMutAct_9fa48("144") ? false : stryMutAct_9fa48("143") ? true : (stryCov_9fa48("143", "144", "145"), hasRole(currentUser, stryMutAct_9fa48("146") ? "" : (stryCov_9fa48("146"), "ROLE_ADMIN")) && <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown">

                    <NavDropdown.Item href="/admin/users" data-testid="appnavbar-admin-users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/personalschedule" data-testid="appnavbar-admin-personalschedule">Personal Schedules</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/loadsubjects" data-testid="appnavbar-admin-loadsubjects">Load Subjects</NavDropdown.Item>

                  </NavDropdown>)}
            </Nav>
            

            <Nav className="ml-auto">
              {(stryMutAct_9fa48("149") ? currentUser || currentUser.loggedIn : stryMutAct_9fa48("148") ? false : stryMutAct_9fa48("147") ? true : (stryCov_9fa48("147", "148", "149"), currentUser && currentUser.loggedIn)) ? <>
                    <Navbar.Text className="me-3" as={Link} to="/profile">Welcome, {currentUser.root.user.email}</Navbar.Text>
                    <Button onClick={doLogout}>Log Out</Button>
                  </> : <Button href="/oauth2/authorization/google">Log In</Button>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>;
  }
}