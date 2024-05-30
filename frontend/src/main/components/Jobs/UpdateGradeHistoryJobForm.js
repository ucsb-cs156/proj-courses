import { Form, Button, Container, Row, Col } from "react-bootstrap";

const UpdateGradeHistoryJobForm = ({ callback }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Updating Grade History");
    callback();
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  const padding = { paddingTop: 10, paddingBottom: 10 };
  // Stryker restore all

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row style={padding}>
          <Col md="auto">
            <Button
              variant="primary"
              type="submit"
              data-testid="updateGradeHistory"
            >
              Update Grade History
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateGradeHistoryJobForm;
