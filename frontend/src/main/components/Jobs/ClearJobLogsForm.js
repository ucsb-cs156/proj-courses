import { Form, Button, Container, Row, Col } from "react-bootstrap";

const ClearJobLogsForm = ({ clearJobLogs }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    clearJobLogs();
  };
  // Stryker disable all
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row style={{ paddingTop: 8, paddingBottom: 8 }}>
          <Col md="auto">
            <Button
              variant="danger"
              type="submit"
              data-testid="clearJobLogsButn"
            >
              Clear Jobs
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default ClearJobLogsForm;
