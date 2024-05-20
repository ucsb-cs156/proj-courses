import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";

const UpdateGradeInfoForm = ({ callback }) => {
  const { error: _error, status: _status } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/jobs/launch/uploadGradeData"],
    { method: "POST", url: "/api/jobs/launch/uploadGradeData" },
    [],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button
              variant="primary"
              type="submit"
              data-testid="updateGradeData"
            >
              Update Grade Info
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateGradeInfoForm;
