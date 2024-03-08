import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Button } from "react-bootstrap";

export default function PersonalSchedulesEditPage() {
  const createButton = () => {
    return (
      <Button variant="primary" href="/personalschedules/list" style={{}}>
        Back
      </Button>
    );
  };
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Personal Schedules</h1>
        <p>This is where the edit page will go</p>
        {createButton()}
      </div>
    </BasicLayout>
  );
}
