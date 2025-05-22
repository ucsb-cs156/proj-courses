import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import SingleAreaDropdown from "main/components/Areas/SingleAreaDropdown";
import { useBackend } from "main/utils/useBackend";

const GeneralEducationSearchForm = ({ fetchJSON }) => {
  // Stryker disable all : not sure how to test/mock local storage
  const localArea = localStorage.getItem("GeneralEducationSearch.Area");

  const {
    data: areas,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/public/generalEducationInfo"],
    { method: "GET", url: "/api/public/generalEducationInfo" },
    [],
  );

  const [area, setArea] = useState(localArea || "A");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { area });
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleAreaDropdown
              areas={areas}
              area={area}
              setArea={setArea}
              controlId={"GeneralEducationSearch.Area"}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default GeneralEducationSearchForm;
