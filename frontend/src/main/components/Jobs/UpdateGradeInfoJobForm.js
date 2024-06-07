import { Form, Button, Container, Row, Col } from "react-bootstrap";

const UpdateGradeInfoJobForm = ({ callback }) => {
  // Stryker disable all
  const handleSubmit = async (event) => {
    event.preventDefault();
    callback({});
  };
  // Stryker restore all
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row
          style={{ paddingTop: 10, paddingBottom: 10 }}
          data-testid="updateGradesRow"
        >
          <Col md="auto">
            <Button
              variant="primary"
              type="submit"
              data-testid="updateGradeInfo"
            >
              Update Grades
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateGradeInfoJobForm;
