import { Form, Button, Container, Row, Col } from "react-bootstrap";

const ClearJobLogsForm = ({ callback }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
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
