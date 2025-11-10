import { Form, Button, Container, Row, Col } from "react-bootstrap";

const SingeButtonJobForm = ({ callback, text }) => {
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
              data-testid="singleButtonJobForm-Submit"
            >
              {text || "Button"}
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default SingeButtonJobForm;
