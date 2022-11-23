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
  if (stryMutAct_9fa48("132")) {
    {}
  } else {
    stryCov_9fa48("132");
    return <>
      {stryMutAct_9fa48("135") ? currentUrl.startsWith("http://localhost:3000") || currentUrl.startsWith("http://127.0.0.1:3000") || <AppNavbarLocalhost url={currentUrl} /> : stryMutAct_9fa48("134") ? false : stryMutAct_9fa48("133") ? true : (stryCov_9fa48("133", "134", "135"), (stryMutAct_9fa48("137") ? currentUrl.startsWith("http://localhost:3000") && currentUrl.startsWith("http://127.0.0.1:3000") : stryMutAct_9fa48("136") ? true : (stryCov_9fa48("136", "137"), currentUrl.startsWith(stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), "http://localhost:3000")) || currentUrl.startsWith(stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), "http://127.0.0.1:3000")))) && <AppNavbarLocalhost url={currentUrl} />)}
      <Navbar expand="xl" variant="dark" bg="dark" sticky="top" data-testid="AppNavbar">
        <Container>
        <img data-testid="AppNavbarImage" src={headerImg} alt="" style={stryMutAct_9fa48("140") ? {} : (stryCov_9fa48("140"), {
            width: 80,
            height: 80,
            marginRight: 10
          })} />
          <Navbar.Brand as={Link} to="/">
            Example
          </Navbar.Brand>

          <Navbar.Toggle />
        




          <>
            {
              /* be sure that each NavDropdown has a unique id and data-testid  */
            }
          </>

          <Navbar.Collapse className="justify-content-between">

          <Nav className="me-auto">
            {stryMutAct_9fa48("143") ? systemInfo?.springH2ConsoleEnabled || <>
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                </> : stryMutAct_9fa48("142") ? false : stryMutAct_9fa48("141") ? true : (stryCov_9fa48("141", "142", "143"), (stryMutAct_9fa48("144") ? systemInfo.springH2ConsoleEnabled : (stryCov_9fa48("144"), systemInfo?.springH2ConsoleEnabled)) && <>
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                </>)}
            {stryMutAct_9fa48("147") ? systemInfo?.showSwaggerUILink || <>
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                </> : stryMutAct_9fa48("146") ? false : stryMutAct_9fa48("145") ? true : (stryCov_9fa48("145", "146", "147"), (stryMutAct_9fa48("148") ? systemInfo.showSwaggerUILink : (stryCov_9fa48("148"), systemInfo?.showSwaggerUILink)) && <>
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                </>)}
          </Nav>

            <Nav className="mr-auto">
              {stryMutAct_9fa48("151") ? hasRole(currentUser, "ROLE_USER") || <NavDropdown title="PSCourse" id="appnavbar-courses-dropdown" data-testid="appnavbar-courses-dropdown">
                    <NavDropdown.Item href="/courses/list" data-testid="appnavbar-courses-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/courses/create" data-testid="appnavbar-courses-create">Create</NavDropdown.Item>
                  </NavDropdown> : stryMutAct_9fa48("150") ? false : stryMutAct_9fa48("149") ? true : (stryCov_9fa48("149", "150", "151"), hasRole(currentUser, stryMutAct_9fa48("152") ? "" : (stryCov_9fa48("152"), "ROLE_USER")) && <NavDropdown title="PSCourse" id="appnavbar-courses-dropdown" data-testid="appnavbar-courses-dropdown">
                    <NavDropdown.Item href="/courses/list" data-testid="appnavbar-courses-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/courses/create" data-testid="appnavbar-courses-create">Create</NavDropdown.Item>
                  </NavDropdown>)}
            </Nav>

        
            <Nav className="mr-auto">
              {stryMutAct_9fa48("155") ? hasRole(currentUser, "ROLE_USER") || <NavDropdown title="PersonalSchedules" id="appnavbar-personalschedules-dropdown" data-testid="appnavbar-personalschedules-dropdown">
                    <NavDropdown.Item href="/personalschedules/list" data-testid="appnavbar-personalschedules-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/personalschedules/create" data-testid="appnavbar-personalschedules-create">Create</NavDropdown.Item>
                  </NavDropdown> : stryMutAct_9fa48("154") ? false : stryMutAct_9fa48("153") ? true : (stryCov_9fa48("153", "154", "155"), hasRole(currentUser, stryMutAct_9fa48("156") ? "" : (stryCov_9fa48("156"), "ROLE_USER")) && <NavDropdown title="PersonalSchedules" id="appnavbar-personalschedules-dropdown" data-testid="appnavbar-personalschedules-dropdown">
                    <NavDropdown.Item href="/personalschedules/list" data-testid="appnavbar-personalschedules-list">List</NavDropdown.Item>
                    <NavDropdown.Item href="/personalschedules/create" data-testid="appnavbar-personalschedules-create">Create</NavDropdown.Item>
                  </NavDropdown>)}
            </Nav>

            <Nav className="mr-auto">
              <NavDropdown title="Section Searches" id="appnavbar-section-searches-dropdown" data-testid="appnavbar-section-searches-dropdown">
                <NavDropdown.Item href="/sectionsearches/search" data-testid="appnavbar-section-searches-search">Search</NavDropdown.Item>
              </NavDropdown>
            </Nav>



            
            <Nav className="mr-auto">
              {stryMutAct_9fa48("159") ? hasRole(currentUser, "ROLE_ADMIN") || <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown">

                    <NavDropdown.Item href="/admin/users" data-testid="appnavbar-admin-users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/personalschedule" data-testid="appnavbar-admin-personalschedule">Personal Schedules</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/loadsubjects" data-testid="appnavbar-admin-loadsubjects">Load Subjects</NavDropdown.Item>

                  </NavDropdown> : stryMutAct_9fa48("158") ? false : stryMutAct_9fa48("157") ? true : (stryCov_9fa48("157", "158", "159"), hasRole(currentUser, stryMutAct_9fa48("160") ? "" : (stryCov_9fa48("160"), "ROLE_ADMIN")) && <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown">

                    <NavDropdown.Item href="/admin/users" data-testid="appnavbar-admin-users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/personalschedule" data-testid="appnavbar-admin-personalschedule">Personal Schedules</NavDropdown.Item>
                    <NavDropdown.Item href="/admin/loadsubjects" data-testid="appnavbar-admin-loadsubjects">Load Subjects</NavDropdown.Item>

                  </NavDropdown>)}
            </Nav>
            

            <Nav className="ml-auto">
              {(stryMutAct_9fa48("163") ? currentUser || currentUser.loggedIn : stryMutAct_9fa48("162") ? false : stryMutAct_9fa48("161") ? true : (stryCov_9fa48("161", "162", "163"), currentUser && currentUser.loggedIn)) ? <>
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