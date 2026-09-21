import { Container } from "react-bootstrap";
import Footer from "main/components/Nav/Footer";
import AppNavbar from "main/components/Nav/AppNavbar";
import { useCurrentUser, useLogout } from "main/utils/currentUser";
import { useSystemInfo } from "main/utils/systemInfo";
import { useHealthCheck, healthMessages } from "main/utils/healthCheck";

export default function BasicLayout({ children }) {
  const { data: currentUser } = useCurrentUser();
  const { data: systemInfo } = useSystemInfo();
  const { data: health } = useHealthCheck();

  // Database outage messages are shown by the same banner as systemInfo's messages, but
  // come from a separate, frequently polled query, since systemInfo is cached for 24 hours.
  const systemInfoWithHealth = {
    ...systemInfo,
    systemMessages: [
      ...healthMessages(health),
      ...(systemInfo?.systemMessages ?? []),
    ],
  };

  const doLogout = useLogout().mutate;

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar
        currentUser={currentUser}
        systemInfo={systemInfoWithHealth}
        doLogout={doLogout}
      />
      <Container expand="xl" className="pt-4 flex-grow-1">
        {children}
      </Container>
      <Footer systemInfo={systemInfo} />
    </div>
  );
}
